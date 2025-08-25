import { model, Schema, Types } from "mongoose";
export enum PrescriptionStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}
export interface IPrescription {
  _id?: Types.ObjectId;
  veterinarian: Types.ObjectId; // Reference to Vet User
  petOwner: Types.ObjectId; // Reference to Pet Owner User
  pet: Types.ObjectId; // Reference to Pet

  appointmentId: Types.ObjectId; // Optional: link to telehealth consultation
  prescriptionDate: Date;
  expirationDate?: Date; // Optional expiration date for medications

  diagnosis: string; // Vet diagnosis
  notes?: string; // Additional notes for owner or pharmacy

  medications: {
    name: string;
    dosage: string; // e.g., "5 mg/kg"
    frequency: string; // e.g., "Twice daily"
    duration: string; // e.g., "7 days"
    route?: string; // e.g., oral, injection
    instructions?: string; // Additional instructions
  }[];

  labTests?: {
    name: string;
    instructions?: string;
    scheduledDate?: Date;
  }[];

  followUp?: {
    date?: Date;
    notes?: string;
  };

  status: PrescriptionStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

const MedicationSchema = new Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    route: { type: String },
    instructions: { type: String },
  },
  { _id: false }
);

const LabTestSchema = new Schema(
  {
    name: { type: String, required: true },
    instructions: { type: String },
    scheduledDate: { type: Date },
  },
  { _id: false }
);

const FollowUpSchema = new Schema(
  {
    date: { type: Date },
    notes: { type: String },
  },
  { _id: false }
);

const VetPrescriptionSchema = new Schema<IPrescription>(
  {
    // clinic: { type: Types.ObjectId, ref: "Clinic", required: true },
    veterinarian: { type: Schema.Types.ObjectId, ref: "User", required: true },
    petOwner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },

    prescriptionDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },

    diagnosis: { type: String, required: true },
    notes: { type: String },

    medications: { type: [MedicationSchema], default: [] },
    labTests: { type: [LabTestSchema], default: [] },
    followUp: { type: FollowUpSchema },

    status: {
      type: String,
      enum: Object.values(PrescriptionStatus),
      default: PrescriptionStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export const PrescriptionModel = model<IPrescription>(
  "Prescription",
  VetPrescriptionSchema
);
