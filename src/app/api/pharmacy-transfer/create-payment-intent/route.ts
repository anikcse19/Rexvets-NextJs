import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { DonationModel } from "@/models";
import config from "@/config/env.config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PharmacyTransferRequestModel } from "@/models/PharmacyTransferRequest";

// Initialize Stripe with secret key for server-side operations
const stripe = new Stripe((config.STRIPE_SECRET_KEY as string) || "", {
  apiVersion: "2025-07-30.basil",
});

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

    console.log("[DEBUG] Created paymentIntent:", paymentIntent.id);

    console.log(session?.user?.refId);

    // Store one-time donation record
    const donation = await PharmacyTransferRequestModel.create({
      amount: Number(amount), // Convert cents back to dollars for storage
      pharmacyName,
      phoneNumber,
      street,
      city,
      state,
      appointment,
      petParentId: session?.user?.refId,
      status,
      paymentStatus,
      transactionID: paymentIntent.id,
      paymentIntentId: paymentIntent.id,
      stripeCustomerId: customerId,
      timestamp: new Date(),
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      isRecurring: false,
      donationId: donation._id,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("create-payment-intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
