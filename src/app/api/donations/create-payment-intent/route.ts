import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { DonationModel } from "@/models";
import config from "@/config/env.config";

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
    const body = await request.json();
    // Extract donation details from request body
    const {
      donationAmount,
      currency = "usd",
      donorEmail,
      donorName,
      donationType = "donation",
      isRecurring = false,
      metadata,
    } = body || {};

    // Add debugging for isRecurring
    console.log("[DEBUG] Received isRecurring from frontend:", isRecurring);
    console.log("[DEBUG] Type of isRecurring:", typeof isRecurring);
    console.log("[DEBUG] isRecurring === true:", isRecurring === true);
    console.log("[DEBUG] isRecurring === false:", isRecurring === false);
    console.log("[DEBUG] Boolean(isRecurring):", Boolean(isRecurring));

    // Ensure isRecurring is a proper boolean
    const isRecurringBoolean = isRecurring === true;

    // Validate Stripe configuration
    if (!config.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Validate donation amount (minimum $1)
    if (!donationAmount || donationAmount < 1) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!donorEmail || !donorName) {
      return NextResponse.json(
        { error: "Donor email and name are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 1. Find or create the customer
    let customerId;
    const customers = await stripe.customers.list({
      email: donorEmail,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("[DEBUG] Found existing customer:", customerId);
    } else {
      const customer = await stripe.customers.create({
        email: donorEmail,
        name: donorName,
      });
      customerId = customer.id;
      console.log("[DEBUG] Created new customer:", customerId);
    }

    if (isRecurringBoolean) {
      // Handle recurring donation with subscription
      console.log("[DEBUG] FLOW: Going to RECURRING donation flow");
      console.log(
        "[DEBUG] Creating recurring subscription for donation amount:",
        donationAmount
      );

      // Create a price for the recurring donation amount
      const price = await stripe.prices.create({
        unit_amount: Math.round(Number(donationAmount)), // Donation amount is already in cents from frontend
        currency,
        recurring: {
          interval: "month",
        },
        product_data: {
          name: `Rex Vet Monthly Donation - $${donationAmount / 100}`,
        },
      });

      console.log("[DEBUG] Created price:", price.id);

      // Create a payment intent for the first payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(donationAmount)), // Donation amount is already in cents from frontend
        currency,
        customer: customerId,
        receipt_email: donorEmail,
        automatic_payment_methods: { enabled: true },
        metadata: {
          donorName: donorName,
          donationType: "recurring",
          ...(metadata || {}),
        },
      });

      console.log(
        "[DEBUG] Created payment intent for recurring:",
        paymentIntent.id
      );

      // Create subscription (will be activated after first payment)
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: price.id }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        metadata: {
          donorName: donorName,
          donationType: "recurring",
        },
      });

      console.log("[DEBUG] Created subscription:", subscription.id);

      // Store recurring donation record
      const donation = await DonationModel.create({
        donationAmount: Number(donationAmount) / 100, // Convert cents back to dollars for storage
        donationType,
        donorEmail,
        donorName,
        isRecurring: isRecurringBoolean,
        status: "pending",
        transactionID: paymentIntent.id, // Use payment intent ID for first payment
        subscriptionId: subscription.id,
        paymentIntentId: paymentIntent.id,
        stripeCustomerId: customerId,
        timestamp: new Date(),
        metadata,
      });

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        isRecurring: isRecurringBoolean,
        donationId: donation._id,
        paymentIntentId: paymentIntent.id,
      });
    } else {
      // Handle one-time donation
      console.log("[DEBUG] FLOW: Going to ONE-TIME donation flow");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(donationAmount)), // Donation amount is already in cents from frontend
        currency,
        customer: customerId,
        receipt_email: donorEmail,
        automatic_payment_methods: { enabled: true },
        metadata: {
          donorName: donorName,
          donationType: "one-time",
          ...(metadata || {}),
        },
      });

      console.log("[DEBUG] Created paymentIntent:", paymentIntent.id);

      // Store one-time donation record
      const donation = await DonationModel.create({
        donationAmount: Number(donationAmount) / 100, // Convert cents back to dollars for storage
        donationType,
        donorEmail,
        donorName,
        isRecurring: false, // Explicitly false for one-time donations
        status: "pending",
        transactionID: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
        stripeCustomerId: customerId,
        timestamp: new Date(),
        metadata,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        isRecurring: false, // Explicitly false for one-time donations
        donationId: donation._id,
        paymentIntentId: paymentIntent.id,
      });
    }
  } catch (error: any) {
    console.error("create-payment-intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
