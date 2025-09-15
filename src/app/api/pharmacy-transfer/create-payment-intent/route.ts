import config from "@/config/env.config";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import {
  AppointmentModel,
  DonationModel,
  INotification,
  NotificationModel,
  NotificationType,
} from "@/models";
import { PharmacyTransferRequestModel } from "@/models/PharmacyTransferRequest";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with secret key for server-side operations
const stripe = new Stripe((config.STRIPE_SECRET_KEY as string) || "");

/**
 * API Route: Create Donation Payment
 *
 * This endpoint handles both one-time and recurring donation payments.
 * For recurring donations, it creates a subscription with a dynamic price.
 * For one-time donations, it creates a payment intent.
 *
 * Flow:
 * 1. Find or create Stripe customer
 * 2. Handle recurring: Create subscription with dynamic price
 * 3. Handle one-time: Create payment intent
 * 4. Store donation record in database
 * 5. Return appropriate response for frontend
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Validate session
    if (
      !session?.user?.email ||
      !session?.user?.name ||
      !session?.user?.refId ||
      !session?.user?.id
    ) {
      return NextResponse.json(
        { error: "User session is invalid or missing required information" },
        { status: 401 }
      );
    }

    const body = await request.json();
    // Extract donation details from request body
    const {
      pharmacyName, // Convert to cents
      phoneNumber,
      street,
      city,
      state,
      appointment,
      status,
      amount,
      paymentStatus,
      currency = "usd",
      metadata,
    } = body || {};

    console.log(body, "body");

    // Validate required body parameters
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Validate Stripe configuration
    if (!config.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Validate donation amount (minimum $1)
    if (!amount || amount !== 19.99) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Start MongoDB session for transaction
    const dbSession = await mongoose.startSession();

    try {
      await dbSession.startTransaction();

      // 1. Find or create the customer
      let customerId;
      const customers = await stripe.customers.list({
        email: session.user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log("[DEBUG] Found existing customer:", customerId);
      } else {
        const customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name,
        });
        customerId = customer.id;
        console.log("[DEBUG] Created new customer:", customerId);
      }

      const existingAppointment = await AppointmentModel.findById(appointment)
        .select("veterinarian pet")
        .session(dbSession);

      // Validate that the appointment exists and has required fields
      if (!existingAppointment) {
        await dbSession.abortTransaction();
        return NextResponse.json(
          { error: "Appointment not found" },
          { status: 404 }
        );
      }

      if (!existingAppointment.veterinarian || !existingAppointment.pet) {
        await dbSession.abortTransaction();
        return NextResponse.json(
          {
            error:
              "Appointment is missing required veterinarian or pet information",
          },
          { status: 400 }
        );
      }

      // Handle one-time donation
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(amount) * 100), // Donation amount is already in cents from frontend
        currency,
        customer: customerId,
        receipt_email: session.user.email,
        automatic_payment_methods: { enabled: true },
        metadata: {
          donorName: session.user.name,
          donationType: "one-time",
          ...(metadata || {}),
        },
      });

      const existingUser = await User.findOne({
        veterinarianRef: existingAppointment.veterinarian,
      }).session(dbSession);

      const notificationPayload: INotification = {
        type: NotificationType.PRESCRIPTION_REQUEST,
        body: `A prescription request has been made by ${session.user.name}`,
        petParentId: session.user.refId,
        vetId: existingAppointment.veterinarian,
        petId: existingAppointment.pet,
        appointmentId: appointment,
        data: {
          appointmentId: appointment,
          petId: existingAppointment.pet,
        },
        title: "Prescription Request",
        recipientId: existingUser?._id,
        actorId: session.user.id,
      };
      console.log("[DEBUG] Created paymentIntent:", paymentIntent.id);

      console.log(session.user.refId);

      // Store one-time donation record
      const donation = await PharmacyTransferRequestModel.create(
        [
          {
            amount: Number(amount), // Convert cents back to dollars for storage
            pharmacyName,
            phoneNumber,
            street,
            city,
            state,
            appointment,
            petParentId: session.user.refId,
            status,
            paymentStatus,
            transactionID: paymentIntent.id,
            paymentIntentId: paymentIntent.id,
            stripeCustomerId: customerId,
            timestamp: new Date(),
            metadata,
          },
        ],
        { session: dbSession }
      );

      await NotificationModel.create([notificationPayload], {
        session: dbSession,
      });

      // Commit the transaction
      await dbSession.commitTransaction();
      console.log("[DEBUG] Transaction committed successfully");

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        isRecurring: false,
        donationId: donation[0]._id,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      // Rollback transaction on error
      await dbSession.abortTransaction();
      console.error("[DEBUG] Transaction rolled back due to error:", error);
      throw error;
    } finally {
      // End the session
      await dbSession.endSession();
    }
  } catch (error: any) {
    console.error("create-payment-intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
