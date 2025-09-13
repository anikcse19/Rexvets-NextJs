import config from "@/config/env.config";
import { authOptions } from "@/lib/auth";
import { sendDonationThankYouEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongoose";
import { generateDonationReceiptPdf } from "@/lib/pdf/generatePdf";
import mongoose from "mongoose";

import {
  DonationModel,
  INotification,
  NotificationModel,
  NotificationType,
} from "@/models";
import PetParent from "@/models/PetParent";
import { SubscriptionModel } from "@/models/Subscription";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  CreateSubscriptionInput,
  createSubscriptionWithSession,
} from "../../subscription/subcription.utils";

// Initialize Stripe with secret key for server-side operations
const stripe = new Stripe((config.STRIPE_SECRET_KEY as string) || "", {
  apiVersion: "2025-07-30.basil",
});

/**
 * API Route: Confirm Donation Payment
 *
 * This endpoint confirms a payment was successful and sends a thank you email.
 * It's called by the frontend after a successful payment confirmation.
 *
 * Flow:
 * 1. Retrieve payment intent from Stripe
 * 2. Update donation record in database
 * 3. Generate PDF receipt
 * 4. Send thank you email
 * 5. Return success response
 */
export async function POST(request: NextRequest) {
  let sessionDb: mongoose.ClientSession | null = null;

  try {
    const body = await request.json();
    const { paymentIntentId, donationId, isRecurring, isSelectFamilyPlan } =
      body || {};
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = session.user;

    // Validate required fields
    if (!paymentIntentId && !donationId) {
      return NextResponse.json(
        {
          error: "Either paymentIntentId or donationId is required",
        },
        { status: 400 }
      );
    }

    // Connect to database and start session
    await connectToDatabase();
    sessionDb = await mongoose.startSession();
    sessionDb.startTransaction();

    // Find the donation record using session
    const donation = await DonationModel.findOne({
      $or: [{ paymentIntentId }, { _id: donationId }],
    }).session(sessionDb);
    const petParent = await PetParent.findById(user.refId).session(sessionDb);
    if (!petParent) {
      throw new Error("Pet parent not found");
    }
    if (!donation) {
      throw new Error("Donation not found");
    }

    // If we have a payment intent ID, verify with Stripe
    let paymentMethod = "Credit Card";
    let paymentMethodLast4 = "";

    if (paymentIntentId) {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      // Check if payment was successful
      if (paymentIntent.status !== "succeeded") {
        throw new Error(`Payment not successful: ${paymentIntent.status}`);
      }

      // Get payment method details
      if (paymentIntent.payment_method) {
        const paymentMethodObj = await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method as string
        );

        if (paymentMethodObj.card) {
          paymentMethodLast4 = paymentMethodObj.card.last4;
          paymentMethod = `${paymentMethodObj.card.brand} ending in ${paymentMethodLast4}`;
        }
      }

      // Update donation record within session
      donation.status = "succeeded";
      donation.paymentMethodLast4 = paymentMethodLast4;

      console.log('isRecurring === "true"', isRecurring);
      console.log("isRecurring type:", typeof isRecurring);
      console.log("donation.isRecurring:", donation.isRecurring);

      // Determine notification type based on multiple sources
      let notificationType: NotificationType;
      if (
        isRecurring === true ||
        isRecurring === "true" ||
        donation.isRecurring === true
      ) {
        notificationType = NotificationType.RECURRING_DONATION;
      } else {
        notificationType = NotificationType.NEW_DONATION;
      }

      const notificationPayload: INotification = {
        type: notificationType,
        title: `THANK YOU`,
        recipientId: user?.id,
        actorId: user?.id,
        data: {
          donationId: donation._id,
          donationAmount: donation.donationAmount,
          donationType: donation.donationType,
          isRecurring: donation.isRecurring,
        },
        subTitle: "🙏Thank You for Your Donation!",
        body: `Thank you for your generous ${
          notificationType === NotificationType.RECURRING_DONATION
            ? "recurring"
            : "one-time"
        } donation of $${
          donation.donationAmount
        }! Your contribution makes a real difference in providing quality veterinary care.`,
      };

      console.log("notificationPayload", notificationPayload);
      // Create notification within session
      await NotificationModel.create([notificationPayload], {
        session: sessionDb,
      });

      // Save donation within session
      await donation.save({ session: sessionDb });
      console.log("donation", donation);
      // Create subscription for Family Plan inside the same transaction
      if (isSelectFamilyPlan === true || isSelectFamilyPlan === "true") {
        console.log(
          "FIRE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        );
        // Validate required fields from donation and session user

        if (!donation.stripeCustomerId) {
          throw new Error("Missing Stripe customer id on donation");
        }
        const currentYear = new Date().getFullYear();
        const isSubsExist = await SubscriptionModel.findOne({
          petParent: petParent?._id,
          calendarYear: currentYear,
        }).session(sessionDb);
        if (!isSubsExist) {
          const createSubsInputParams = {
            petParent: petParent?._id, // Use ObjectId, not string
            subscriptionId: donation.subscriptionId || donation.transactionID, // Use transactionID as fallback since subscriptionId is null
            donationId: donation._id,
            subscriptionAmount: donation.donationAmount, // Required field
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
            maxAppointments: 4, // Required field
            remainingAppointments: 4, // Required field
            appointmentIds: [], // Required field
            isActive: true, // Required field
            calendarYear: new Date().getFullYear(), // Required field
            isResubscription: false, // Required field
            resubscriptionCount: 0, // Required field
            stripeCustomerId: donation.stripeCustomerId,
            paymentIntentId: donation.paymentIntentId, // Required field
            transactionID: donation.transactionID,
            metadata: {
              createdFrom: "confirm-payment",
              donationType: donation.donationType,
              actorId: user?.id,
            },
          };
          await SubscriptionModel.create([createSubsInputParams], {
            session: sessionDb,
          });
        }

        // await createSubscriptionWithSession(createSubsInputParams, sessionDb);
      }
    }

    // Commit the transaction - if this fails, everything is rolled back
    await sessionDb.commitTransaction();
    // Mark session as completed to avoid double-abort
    sessionDb = null as any;

    // Check donation type to determine if we should send email
    if (donation.donationType === "donation") {
      // This is a standalone donation - send thank you email with receipt
      console.log(
        "Standalone donation confirmed - sending thank you email with receipt"
      );

      // Determine badge name based on donation amount
      const getBadgeNameFromAmount = (amount: number) => {
        if (amount > 500) return "Pet Care Hero";
        if (amount > 50 && amount <= 500) return "Community Champion";
        if (amount > 5 && amount <= 50) return "Friend of Rex Vet";
        return "Supporter";
      };

      // Format donation date
      const donationDate = donation.timestamp.toISOString().split("T")[0];
      const badgeName = getBadgeNameFromAmount(donation.donationAmount);

      // Generate PDF receipt
      const pdfBuffer = await generateDonationReceiptPdf({
        donorName: donation.donorName,
        amount: donation.donationAmount,
        receiptNumber: donation.transactionID || `REX_${Date.now()}`,
        isRecurring: donation.isRecurring,
        badgeName,
        date: donationDate,
        paymentMethod: paymentMethod,
      });

      // Send thank you email
      await sendDonationThankYouEmail({
        email: donation.donorEmail,
        name: donation.donorName,
        donationAmount: donation.donationAmount,
        isRecurring: donation.isRecurring,
        badgeName,
        donationDate,
        paymentMethod,
        transactionID:
          donation.transactionID || paymentIntentId || `REX_${Date.now()}`,
        pdfBuffer,
      });
    } else {
      // This is a booking donation - no email sent here, will be sent with appointment confirmation
      console.log(
        "Booking donation confirmed - email will be sent with appointment confirmation"
      );
    }

    return NextResponse.json({
      success: true,
      message:
        donation.donationType === "donation"
          ? "Payment confirmed and thank you email sent"
          : "Payment confirmed successfully",
      donationId: donation._id,
    });
  } catch (error: any) {
    console.error("confirm-payment error:", error);

    // Ensure transaction is aborted if session still exists
    if (sessionDb) {
      try {
        await sessionDb.abortTransaction();
      } catch (abortError) {
        console.error("Error aborting transaction:", abortError);
      }
      // Mark session as completed to avoid double-abort
      sessionDb = null as any;
    }

    // Return appropriate error response
    if (error.message === "Donation not found") {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    if (error.message.includes("Payment not successful")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Validation errors for subscription creation
    if (
      error.message.startsWith("Missing pet parent") ||
      error.message.startsWith("Missing Stripe")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: "Failed to confirm payment",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    // Always end the session
    if (sessionDb) {
      try {
        sessionDb.endSession();
      } catch (endError) {
        console.error("Error ending session:", endError);
      }
    }
  }
}

// Badge name generation moved to appointment confirmation flow
