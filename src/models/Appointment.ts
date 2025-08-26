import mongoose, { Document, model, Schema, Types } from "mongoose";

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
}
export enum AppointmentType {
  GENERAL_CHECKUP = "general_checkup",
  VACCINATION = "vaccination",
  WELLNESS_EXAM = "wellness_exam",
  PUPPY_KITTEN_CHECKUP = "puppy_kitten_checkup",
  SENIOR_PET_CARE = "senior_pet_care",
  EMERGENCY = "emergency",
  URGENT_CARE = "urgent_care",
  DENTAL_CARE = "dental_care",
  DENTAL_CLEANING = "dental_cleaning",
  SURGERY_CONSULTATION = "surgery_consultation",
  SPAY_NEUTER = "spay_neuter",
  ORTHOPEDIC_SURGERY = "orthopedic_surgery",
  FOLLOW_UP = "follow_up",
  PHYSIOTHERAPY = "physiotherapy",
  PAIN_MANAGEMENT = "pain_management",
  NUTRITION_CONSULTATION = "nutrition_consultation",
  BEHAVIORAL_CONSULTATION = "behavioral_consultation",
  SKIN_DERMATOLOGY = "skin_dermatology",
  CANCER_ONCOLOGY = "cancer_oncology",
  CARDIOLOGY = "cardiology",
  TRAVEL_HEALTH_CERTIFICATE = "travel_health_certificate",
  VETERINARY_CERTIFICATE = "veterinary_certificate",
  OTHERS = "others",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

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
      ref: "User",
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
      default: AppointmentStatus.SCHEDULED,
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
