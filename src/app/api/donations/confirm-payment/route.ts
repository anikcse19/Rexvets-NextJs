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
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
    const { paymentIntentId, donationId, isRecurring } = body || {};
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

    try {
      // Find the donation record using session
      const donation = await DonationModel.findOne({
        $or: [{ paymentIntentId }, { _id: donationId }],
      }).session(sessionDb);

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
      }

      // Commit the transaction - if this fails, everything is rolled back
      await sessionDb.commitTransaction();

      // After successful commit, proceed with external operations
      // Determine badge name based on donation amount
      const badgeName = getBadgeNameFromAmount(donation.donationAmount);

      // Format donation date
      const donationDate = donation.timestamp.toISOString().split("T")[0];

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

      return NextResponse.json({
        success: true,
        message: "Payment confirmed and thank you email sent",
        donationId: donation._id,
      });
    } catch (transactionError: any) {
      // If any operation within the transaction fails, abort and rollback
      console.error("Transaction error:", transactionError);

      if (sessionDb) {
        await sessionDb.abortTransaction();
      }

      // Return appropriate error response
      if (transactionError.message === "Donation not found") {
        return NextResponse.json(
          { error: "Donation not found" },
          { status: 404 }
        );
      }

      if (transactionError.message.includes("Payment not successful")) {
        return NextResponse.json(
          { error: transactionError.message },
          { status: 400 }
        );
      }

      // For any other transaction errors, throw to be caught by outer catch
      throw transactionError;
    }
  } catch (error: any) {
    console.error("confirm-payment error:", error);

    // Ensure transaction is aborted if session still exists
    if (sessionDb) {
      try {
        await sessionDb.abortTransaction();
      } catch (abortError) {
        console.error("Error aborting transaction:", abortError);
      }
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

/**
 * Get badge name based on donation amount
 */
function getBadgeNameFromAmount(amount: number): string {
  if (amount >= 100) return "Champion";
  if (amount >= 50) return "Guardian";
  if (amount >= 25) return "Supporter";
  return "Friend";
}
