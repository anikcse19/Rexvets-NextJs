import mongoose, { Document, Model, Schema, Types } from 'mongoose';

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
  isActive: boolean; // Whether subscription is currently active
  calendarYear: number; // Calendar year for tracking (e.g., 2024)
  
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
  
  decrementAppointmentCount(subscriptionId: string): Promise<ISubscription | null>;
  
  getActiveSubscription(petParentId: Types.ObjectId, year?: number): Promise<ISubscription | null>;
  
  resetYearlyAppointments(subscriptionId: string, newYear: number): Promise<ISubscription | null>;
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
      ref: 'PetParent',
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
      ref: 'Donation',
      required: true,
      index: true,
    },
    subscriptionAmount: {
      type: Number,
      required: true,
      default: 120, // $120 subscription
      min: [120, 'Subscription amount must be at least $120'],
      max: [120, 'Subscription amount must be exactly $120'],
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
      min: [4, 'Maximum appointments must be at least 4'],
      max: [4, 'Maximum appointments must be exactly 4'],
    },
    remainingAppointments: {
      type: Number,
      required: true,
      default: 4,
      min: [0, 'Remaining appointments cannot be negative'],
      max: [4, 'Remaining appointments cannot exceed maximum appointments'],
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
      type: Schema.Types.Mixed 
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

// Pre-save middleware to set end date if not provided
subscriptionSchema.pre('save', function(next) {
  if (!this.endDate && this.startDate) {
    // Set end date to 1 year from start date
    this.endDate = new Date(this.startDate);
    this.endDate.setFullYear(this.endDate.getFullYear() + 1);
  }
  next();
});

// Static method to create a new subscription
subscriptionSchema.statics.createSubscription = async function(data: {
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
subscriptionSchema.statics.decrementAppointmentCount = async function(subscriptionId: string) {
  const subscription = await this.findOne({ 
    subscriptionId, 
    isActive: true,
    remainingAppointments: { $gt: 0 } // Only if appointments remaining
  });
  
  if (!subscription) {
    return null;
  }
  
  // Decrement remaining appointments (ensuring it doesn't go below 0)
  subscription.remainingAppointments = Math.max(0, subscription.remainingAppointments - 1);
  
  return await subscription.save();
};

// Static method to get active subscription for a pet parent
subscriptionSchema.statics.getActiveSubscription = async function(
  petParentId: Types.ObjectId, 
  year?: number
) {
  const currentYear = year || new Date().getFullYear();
  
  return await this.findOne({
    petParent: petParentId,
    calendarYear: currentYear,
    isActive: true,
    endDate: { $gt: new Date() }, // Not expired
  });
};

// Static method to reset yearly appointments
subscriptionSchema.statics.resetYearlyAppointments = async function(
  subscriptionId: string, 
  newYear: number
) {
  const subscription = await this.findOne({ subscriptionId, isActive: true });
  
  if (!subscription) {
    return null;
  }
  
  subscription.calendarYear = newYear;
  subscription.remainingAppointments = subscription.maxAppointments;
  
  return await subscription.save();
};

// Instance method to check if appointment can be booked
subscriptionSchema.methods.canBookAppointment = function(): boolean {
  return this.isActive && 
         this.remainingAppointments > 0 && 
         this.endDate > new Date();
};

// Instance method to get subscription status
subscriptionSchema.methods.getStatus = function(): string {
  if (!this.isActive) return 'inactive';
  if (this.endDate <= new Date()) return 'expired';
  if (this.remainingAppointments === 0) return 'appointments_exhausted';
  return 'active';
};

export default (mongoose.models.Subscription as ISubscriptionModel) ||
  mongoose.model<ISubscription, ISubscriptionModel>('Subscription', subscriptionSchema);
