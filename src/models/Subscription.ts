import { Document, model, models, Schema, Types } from "mongoose";

/**
 * Subscription Model Interface
 *
 * Represents a subscription record for pet parents with appointment tracking.
 * Each $120 subscription allows maximum 4 appointments per calendar year.
 *
 * Key Features:
 * - Tracks remaining appointments (starts at 4, decrements with each appointment)
 * - Calendar year based (resets annually)
 * - References Donation model via subscriptionId
 * - Prevents negative appointment counts
 */
export interface ISubscription extends Document {
  petParent: Types.ObjectId; // Reference to PetParent
  subscriptionId: string; // Stripe subscription ID, references Donation model
  donationId: Types.ObjectId; // Reference to Donation document
  subscriptionAmount: number; // Should be $120
  startDate: Date; // When subscription started
  endDate: Date; // When subscription expires (1 year from start)
  maxAppointments: number; // Maximum appointments allowed (4)
  remainingAppointments: number; // Current remaining appointments (4, 3, 2, 1, 0)
  appointmentIds: Types.ObjectId[]; // Array of appointment IDs used in this subscription
  isActive: boolean; // Whether subscription is currently active
  calendarYear: number; // Calendar year for tracking (e.g., 2024)

  // Re-subscription tracking
  isResubscription: boolean; // Whether this is a re-subscription after quota exhaustion
  resubscriptionCount: number; // Number of times re-subscribed (0 for original, 1+ for re-subscriptions)

  // Stripe Integration Fields
  stripeSubscriptionId: string; // Stripe subscription ID
  stripeCustomerId: string; // Stripe customer ID

  // Metadata
  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription Schema
 *
 * MongoDB schema for subscription records with appointment tracking.
 * Includes validation, indexing, and methods for managing appointment counts.
 */
const subscriptionSchema = new Schema<ISubscription>(
  {
    petParent: {
      type: Schema.Types.ObjectId,
      ref: "PetParent",
      required: true,
      index: true,
    },
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    donationId: {
      type: Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      index: true,
    },
    subscriptionAmount: {
      type: Number,
      required: true,
      default: 120, // $120 subscription
      min: [120, "Subscription amount must be at least $120"],
      max: [120, "Subscription amount must be exactly $120"],
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    maxAppointments: {
      type: Number,
      required: true,
      default: 4,
      min: [4, "Maximum appointments must be at least 4"],
      max: [4, "Maximum appointments must be exactly 4"],
    },
    remainingAppointments: {
      type: Number,
      required: true,
      default: 4,
      min: [0, "Remaining appointments cannot be negative"],
      max: [4, "Remaining appointments cannot exceed maximum appointments"],
      index: true,
    },
    appointmentIds: {
      type: [Schema.Types.ObjectId],
      ref: "Appointment",
      default: [],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    calendarYear: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
      index: true,
    },

    // Re-subscription tracking
    isResubscription: {
      type: Boolean,
      default: false,
      index: true,
    },

    resubscriptionCount: {
      type: Number,
      default: 0,
      min: [0, "Resubscription count cannot be negative"],
      index: true,
    },

    // Stripe Integration Fields
    stripeSubscriptionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
subscriptionSchema.index({ petParent: 1, calendarYear: 1, isActive: 1 });
subscriptionSchema.index({ subscriptionId: 1, isActive: 1 });
subscriptionSchema.index({ endDate: 1, isActive: 1 });
subscriptionSchema.index({
  petParent: 1,
  isResubscription: 1,
  calendarYear: 1,
});
subscriptionSchema.index({ isActive: 1 });

// Pre-save middleware to set end date if not provided
subscriptionSchema.pre("save", function (next) {
  if (!this.endDate && this.startDate) {
    // Set end date to 1 year from start date
    this.endDate = new Date(this.startDate);
    this.endDate.setFullYear(this.endDate.getFullYear() + 1);
  }
  next();
});
export const SubscriptionModel =
  models.Subscription ||
  model<ISubscription>("Subscription", subscriptionSchema);
