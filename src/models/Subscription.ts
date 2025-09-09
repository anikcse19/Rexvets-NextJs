import mongoose, { Document, Model, Schema, Types } from "mongoose";

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
  originalSubscriptionId?: string; // Reference to original subscription if this is a re-subscription
  resubscriptionCount: number; // Number of times re-subscribed (0 for original, 1+ for re-subscriptions)

  // Stripe Integration Fields
  stripeSubscriptionId: string; // Stripe subscription ID
  stripeCustomerId: string; // Stripe customer ID

  // Metadata
  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  canBookAppointment(): boolean;
  getStatus(): string;
  addAppointmentId(appointmentId: Types.ObjectId): Promise<ISubscription>;
  isQuotaExhausted(): boolean;
}

export interface ISubscriptionModel extends Model<ISubscription> {
  // Static methods for subscription management
  createSubscription(data: {
    petParent: Types.ObjectId;
    subscriptionId: string;
    donationId: Types.ObjectId;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    subscriptionAmount?: number;
    metadata?: Record<string, unknown>;
  }): Promise<ISubscription>;

  createResubscription(data: {
    petParent: Types.ObjectId;
    subscriptionId: string;
    donationId: Types.ObjectId;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    originalSubscriptionId: string;
    subscriptionAmount?: number;
    metadata?: Record<string, unknown>;
  }): Promise<ISubscription>;

  decrementAppointmentCount(
    subscriptionId: string,
    appointmentId?: Types.ObjectId
  ): Promise<ISubscription | null>;

  getActiveSubscription(
    petParentId: Types.ObjectId,
    year?: number,
    session?: any
  ): Promise<ISubscription | null>;

  resetYearlyAppointments(
    subscriptionId: string,
    newYear: number
  ): Promise<ISubscription | null>;

  getSubscriptionHistory(
    petParentId: Types.ObjectId,
    year?: number
  ): Promise<ISubscription[]>;

  canCreateResubscription(
    petParentId: Types.ObjectId,
    year?: number
  ): Promise<boolean>;
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
    originalSubscriptionId: {
      type: String,
      trim: true,
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
subscriptionSchema.index({ originalSubscriptionId: 1, isActive: 1 });

// Pre-save middleware to set end date if not provided
subscriptionSchema.pre("save", function (next) {
  if (!this.endDate && this.startDate) {
    // Set end date to 1 year from start date
    this.endDate = new Date(this.startDate);
    this.endDate.setFullYear(this.endDate.getFullYear() + 1);
  }
  next();
});

// Static method to create a new subscription
subscriptionSchema.statics.createSubscription = async function (data: {
  petParent: Types.ObjectId;
  subscriptionId: string;
  donationId: Types.ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  subscriptionAmount?: number;
  metadata?: Record<string, unknown>;
}) {
  const currentYear = new Date().getFullYear();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  const subscription = new this({
    ...data,
    subscriptionAmount: data.subscriptionAmount || 120,
    startDate,
    endDate,
    calendarYear: currentYear,
    maxAppointments: 4,
    remainingAppointments: 4,
    isActive: true,
  });

  return await subscription.save();
};

// Static method to decrement appointment count
subscriptionSchema.statics.decrementAppointmentCount = async function (
  subscriptionId: string,
  appointmentId?: Types.ObjectId
) {
  const subscription = await this.findOne({
    subscriptionId,
    isActive: true,
    remainingAppointments: { $gt: 0 },
  });

  if (!subscription) {
    return null;
  }

  // Decrement remaining appointments (ensuring it doesn't go below 0)
  subscription.remainingAppointments = Math.max(
    0,
    subscription.remainingAppointments - 1
  );

  // Add appointment ID to the array if provided
  if (appointmentId && !subscription.appointmentIds.includes(appointmentId)) {
    subscription.appointmentIds.push(appointmentId);
  }

  return await subscription.save();
};

// Static method to get active subscription for a pet parent
subscriptionSchema.statics.getActiveSubscription = async function (
  petParentId: Types.ObjectId,
  year?: number,
  session?: any
) {
  const currentYear = year || new Date().getFullYear();

  const query = this.findOne({
    petParent: petParentId,
    calendarYear: currentYear,
    isActive: true,
    endDate: { $gt: new Date() }, // Not expired
  });

  if (session) {
    return await query.session(session);
  }

  return await query;
};

// Static method to reset yearly appointments
subscriptionSchema.statics.resetYearlyAppointments = async function (
  subscriptionId: string,
  newYear: number
) {
  const subscription = await this.findOne({ subscriptionId, isActive: true });

  if (!subscription) {
    return null;
  }

  subscription.calendarYear = newYear;
  subscription.remainingAppointments = subscription.maxAppointments;
  subscription.appointmentIds = []; // Reset appointment IDs for new year

  return await subscription.save();
};

// Static method to create a re-subscription
subscriptionSchema.statics.createResubscription = async function (data: {
  petParent: Types.ObjectId;
  subscriptionId: string;
  donationId: Types.ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  originalSubscriptionId: string;
  subscriptionAmount?: number;
  metadata?: Record<string, unknown>;
}) {
  const currentYear = new Date().getFullYear();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  // Get the original subscription to determine resubscription count
  const originalSubscription = await this.findOne({
    subscriptionId: data.originalSubscriptionId,
  });

  const resubscriptionCount = originalSubscription
    ? originalSubscription.resubscriptionCount + 1
    : 1;

  const subscription = new this({
    ...data,
    subscriptionAmount: data.subscriptionAmount || 120,
    startDate,
    endDate,
    calendarYear: currentYear,
    maxAppointments: 4,
    remainingAppointments: 4,
    appointmentIds: [],
    isActive: true,
    isResubscription: true,
    resubscriptionCount,
  });

  return await subscription.save();
};

// Static method to get subscription history for a pet parent
subscriptionSchema.statics.getSubscriptionHistory = async function (
  petParentId: Types.ObjectId,
  year?: number
) {
  const currentYear = year || new Date().getFullYear();

  return await this.find({
    petParent: petParentId,
    calendarYear: currentYear,
  }).sort({ createdAt: 1 }); // Sort by creation date
};

// Static method to check if a pet parent can create a re-subscription
subscriptionSchema.statics.canCreateResubscription = async function (
  petParentId: Types.ObjectId,
  year?: number
) {
  const currentYear = year || new Date().getFullYear();

  // Check if there's an active subscription with exhausted appointments
  const activeSubscription = await this.findOne({
    petParent: petParentId,
    calendarYear: currentYear,
    isActive: true,
    remainingAppointments: 0,
  });

  return !!activeSubscription;
};

// Instance method to check if appointment can be booked
subscriptionSchema.methods.canBookAppointment = function (): boolean {
  return (
    this.isActive && this.remainingAppointments > 0 && this.endDate > new Date()
  );
};

// Instance method to get subscription status
subscriptionSchema.methods.getStatus = function (): string {
  if (!this.isActive) return "inactive";
  if (this.endDate <= new Date()) return "expired";
  if (this.remainingAppointments === 0) return "appointments_exhausted";
  return "active";
};

// Instance method to add appointment ID to the subscription
subscriptionSchema.methods.addAppointmentId = async function (
  appointmentId: Types.ObjectId
) {
  if (!this.appointmentIds.includes(appointmentId)) {
    this.appointmentIds.push(appointmentId);
    return await this.save();
  }
  return this;
};

// Instance method to check if quota is exhausted
subscriptionSchema.methods.isQuotaExhausted = function (): boolean {
  return this.remainingAppointments === 0;
};

export default (mongoose.models.Subscription as ISubscriptionModel) ||
  mongoose.model<ISubscription, ISubscriptionModel>(
    "Subscription",
    subscriptionSchema
  );
