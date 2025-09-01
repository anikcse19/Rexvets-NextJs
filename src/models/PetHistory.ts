import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPetHistory extends Document {
  petParent: Types.ObjectId;
  pet: Types.ObjectId;
  veterinarian: Types.ObjectId;
  appointment: Types.ObjectId;
  visitDate: Date;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  notes?: string;
  followUpNeeded: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PetHistorySchema = new Schema<IPetHistory>(
  {
    petParent: {
      type: Schema.Types.ObjectId,
      ref: "PetParent",
      required: true,
    },
    pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    veterinarian: {
      type: Schema.Types.ObjectId,
      ref: "Veterinarian",
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    visitDate: { type: Date, required: true },
    diagnosis: { type: String, trim: true, maxlength: 1000 },
    treatment: { type: String, trim: true, maxlength: 1000 },
    medications: [{ type: String, trim: true }],
    notes: { type: String, trim: true, maxlength: 1000 },
    followUpNeeded: { type: Boolean, default: false },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

export const PetHistoryModel =
  mongoose.models.PetHistory ||
  mongoose.model<IPetHistory>("PetHistory", PetHistorySchema);
