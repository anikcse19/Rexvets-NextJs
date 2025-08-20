import mongoose, { Document, Model, Schema, Types } from 'mongoose';

/**
 * Donation Model Interface
 * 
 * Represents a donation record in the database with Stripe integration.
 * Supports both one-time and recurring donations.
 * 
 * Stripe Integration Fields:
 * - subscriptionId: Stripe subscription ID for recurring donations
 * - transactionID: Stripe payment intent or subscription ID
 * - stripeCustomerId: Stripe customer ID for recurring donations
 * - paymentIntentId: Stripe payment intent ID for one-time donations
 * - paymentMethodLast4: Last 4 digits of payment method for display
 */
export interface IDonation extends Document {
  donationAmount: number; // e.g., 35
  donationType: 'donation' | 'booking'; // constrained set
  parentId?: Types.ObjectId; // Optional PetParent reference when donor is logged-in
  donorDocumentID?: string; // Firestore doc id or internal id
  donorEmail: string;
  donorName: string;
  isRecurring: boolean; // true for subscriptions
  paymentMethodLast4?: string; // e.g., "4242" - Last 4 digits of payment method
  read: boolean; // UI consumed/read flag
  status: string; // e.g., "pending" | "succeeded" | "failed"
  subscriptionId?: string | null; // Stripe subscription id (if recurring)
  transactionID?: string; // Stripe payment_intent id or subscription id
  timestamp: Date; // primary event timestamp

  // Stripe Integration Fields
  stripeCustomerId?: string; // Stripe customer ID for recurring donations
  paymentIntentId?: string; // Stripe payment intent ID for one-time donations

  // Arbitrary metadata (appointment id, vet id, etc.)
  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

export interface IDonationModel extends Model<IDonation> {}

/**
 * Donation Schema
 * 
 * MongoDB schema for donation records with Stripe integration support.
 * Includes validation, indexing, and Stripe-specific fields for payment tracking.
 */
const donationSchema = new Schema<IDonation>(
  {
    donationAmount: {
      type: Number,
      required: true,
      min: [1, 'Donation amount must be at least 1'],
    },
    donationType: {
      type: String,
      required: true,
      trim: true,
      enum: ['donation', 'booking'],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'PetParent',
      index: true,
    },
    donorDocumentID: {
      type: String,
      trim: true,
    },
    donorEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please provide a valid email'],
      index: true,
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    isRecurring: {
      type: Boolean,
      default: false,
      index: true, // Index for querying recurring vs one-time donations
    },
    paymentMethodLast4: {
      type: String,
      trim: true,
      match: [/^\d{4}$/ , 'Last4 must be 4 digits'], // Validate 4-digit format
    },
    read: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'pending', // Default to pending, updated based on payment result
      trim: true,
      index: true, // Index for querying by status
    },
    subscriptionId: {
      type: String,
      default: null,
      index: true, // Index for subscription tracking
    },
    transactionID: {
      type: String,
      trim: true,
      index: true, // Index for payment tracking
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Stripe Integration Fields
    stripeCustomerId: { 
      type: String, 
      trim: true,
      index: true, // Index for customer lookups
    },
    paymentIntentId: { 
      type: String, 
      trim: true,
      index: true, // Index for payment tracking
    },

    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Compound index for analytics queries by date, type, and status
// Useful for donation reports and analytics
donationSchema.index({ timestamp: -1, isRecurring: 1, status: 1 });

export default (mongoose.models.Donation as IDonationModel) ||
  mongoose.model<IDonation, IDonationModel>('Donation', donationSchema);


