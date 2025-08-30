import {
  AppointmentStatus,
  AppointmentType,
  PaymentStatus,
} from "@/lib/types/appointment";
import mongoose, { Document, model, Schema, Types } from "mongoose";

// Re-export from shared types to maintain backward compatibility
export { AppointmentStatus, AppointmentType, PaymentStatus };

export interface IAppointment extends Document {
  veterinarian: Types.ObjectId;
  petParent: Types.ObjectId;
  pet: Types.ObjectId;
  appointmentDate: Date;
  durationMinutes?: number;
  meetingLink?: string;
  notes?: string;
  feeUSD: number;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
  isFollowUp: boolean;
  appointmentType: AppointmentType;
  paymentStatus: PaymentStatus;
  reminderSent: boolean;
  isDeleted: boolean;
  slotId: Types.ObjectId;
  concerns: string[];
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    veterinarian: {
      type: Schema.Types.ObjectId,
      // ref: "User",
      ref: "Veterinarian",
      required: true,
    },
    petParent: {
      type: Schema.Types.ObjectId,
      ref: "PetParent",
      required: true,
    },
    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: "Appointment date must be in the future",
      },
    },
    durationMinutes: {
      type: Number,
      default: 30,
      min: [10, "Minimum appointment duration is 10 minutes"],
      max: [120, "Maximum appointment duration is 120 minutes"],
    },
    meetingLink: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) =>
          !value || /^https?:\/\/[^\s]+$/.test(value),
        message: "Conference link must be a valid URL",
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    feeUSD: {
      type: Number,
      // required: [true, "Consultation fee is required"],
      min: [0, "Fee cannot be negative"],
      max: [3000, "Fee cannot exceed $3000"],
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.UPCOMING,
    },
    isFollowUp: {
      type: Boolean,
      default: false,
    },
    appointmentType: {
      type: String,
      enum: Object.values(AppointmentType),
      default: AppointmentType.GENERAL_CHECKUP,
      required: [true, "Appointment type is required"],
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PAID,
      required: [true, "Payment status is required"],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "AppointmentSlot",
      required: true,
    },
    concerns: {
      type: [String],
      trim: true,
      maxlength: [1000, "Concerns cannot exceed 1000 characters"],
    },
  },

  { timestamps: true }
);

export const AppointmentModel =
  mongoose.models.Appointment ||
  model<IAppointment>("Appointment", AppointmentSchema);

// Create indexes for optimal query performance
// This will be executed when the model is first loaded
if (!mongoose.models.Appointment) {
  // Index for cron job queries (most important for performance)
  AppointmentSchema.index({ 
    isDeleted: 1, 
    reminderSent: 1, 
    appointmentDate: 1 
  });

  // Index for cron job time window queries
  AppointmentSchema.index({ 
    isDeleted: 1, 
    status: 1, 
    appointmentDate: 1 
  });

  // Index for finding appointments by user (pet parent)
  AppointmentSchema.index({ 
    petParent: 1, 
    isDeleted: 1, 
    appointmentDate: -1 
  });

  // Index for finding appointments by veterinarian
  AppointmentSchema.index({ 
    veterinarian: 1, 
    isDeleted: 1, 
    appointmentDate: -1 
  });

  // Index for finding appointments by pet
  AppointmentSchema.index({ 
    pet: 1, 
    isDeleted: 1, 
    appointmentDate: -1 
  });

  // Index for finding appointments by slot
  AppointmentSchema.index({ 
    slotId: 1, 
    isDeleted: 1 
  });

  // Index for status-based queries
  AppointmentSchema.index({ 
    status: 1, 
    isDeleted: 1, 
    appointmentDate: 1 
  });

  // Compound index for dashboard queries
  AppointmentSchema.index({ 
    isDeleted: 1, 
    status: 1, 
    appointmentDate: -1, 
    createdAt: -1 
  });

  console.log('[APPOINTMENT MODEL] Indexes created for optimal query performance');
}
