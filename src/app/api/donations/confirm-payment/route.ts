import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { DonationModel, PetParentModel } from "@/models";
import UserModel from "@/models/User";
import config from "@/config/env.config";
import { sendDonationThankYouEmail } from "@/lib/email";
import { generateDonationReceiptPdf } from "@/lib/pdf/generatePdf";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { paymentIntentId, donationId } = body || {};

    // Validate required fields
    if (!paymentIntentId && !donationId) {
      return NextResponse.json(
        {
          error: "Either paymentIntentId or donationId is required",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the donation record
    const donation = await DonationModel.findOne({
      $or: [{ paymentIntentId }, { _id: donationId }],
    });

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // If we have a payment intent ID, verify with Stripe
    let paymentMethod = "Credit Card";
    let paymentMethodLast4 = "";

    if (paymentIntentId) {
      try {
        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );

        // Check if payment was successful
        if (paymentIntent.status !== "succeeded") {
          return NextResponse.json(
            {
              error: "Payment not successful",
              status: paymentIntent.status,
            },
            { status: 400 }
          );
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

        // Update donation record
        donation.status = "succeeded";
        donation.paymentMethodLast4 = paymentMethodLast4;
        await donation.save();
      } catch (stripeError) {
        console.error("Error retrieving payment intent:", stripeError);
        // Continue anyway to send the email
      }
    }

    // Determine badge name based on donation amount
    const badgeName = getBadgeNameFromAmount(donation.donationAmount);

    console.log("badgeName", badgeName, session?.user?.id);

    // // Persist badge on both PetParent (legacy) and User documents
    // if (session?.user?.refId) {
    //   await PetParentModel.findByIdAndUpdate(session.user.refId, {
    //     categoryBadge: badgeName,
    //   }).catch(() => null);
    // }

    if (session?.user?.id) {
      await UserModel.findByIdAndUpdate(session.user.id, {
        categoryBadge: badgeName,
      }).catch(() => null);
    }

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
  } catch (error: any) {
    console.error("confirm-payment error:", error);
    return NextResponse.json(
      {
        error: "Failed to confirm payment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Get badge name based on donation amount
 */
function getBadgeNameFromAmount(amount: number) {
  if (amount > 500) return "Pet Care Hero";
  if (amount > 50 && amount <= 500) return "Community Champion";
  if (amount > 5 && amount <= 50) return "Friend of Rex Vet";
  return "";
}
