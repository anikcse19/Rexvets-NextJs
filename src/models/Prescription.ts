// models/Prescription.js
import mongoose, { Document, model, Schema, Types } from "mongoose";

const quantityUnits = ["tablet", "ml", "capsule", "packet", "drop", "other"];
const strengthUnits = ["mg", "g", "mcg", "IU", "ml", "other"];

const MedicationDetailSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    form: { type: String, trim: true }, // e.g. tablet, syrup
    medicationQuantity: { type: Number, required: true, min: 0 },
    quantityUnit: { type: String, enum: quantityUnits, required: true },
    strength: { type: Number, min: 0 },
    strengthUnit: { type: String, enum: strengthUnits },
  },
  { _id: false }
);

const UsageInstructionSchema = new Schema(
  {
    refills: { type: Number, default: 0, min: 0 },
    refillsGap: { type: Number, default: 0, min: 0 }, // days
    directionForUse: { type: String, trim: true },
  },
  { _id: false }
);

const PharmacySchema = new Schema(
  {
    canUseGenericSubs: { type: Boolean, default: true },
    canFilledHumanPharmacy: { type: Boolean, default: false },
    noteToPharmacist: { type: String, trim: true },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema(
  {
    veterinarian: {
      type: Schema.Types.ObjectId,
      ref: "Veterinarian",
      required: true,
    },
    petParent: {
      type: Schema.Types.ObjectId,
      ref: "PetParent",
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },

    medication_details: { type: [MedicationDetailSchema], required: true },
    usage_instruction: { type: UsageInstructionSchema, default: {} },
    pharmacy: { type: PharmacySchema, default: {} },

    pdfLink: { type: String },
    pdfPublicId: { type: String },
  },
  {
    timestamps: true,
  }
);

PrescriptionSchema.index({ appointment: 1 });
PrescriptionSchema.index({ veterinarian: 1 });
PrescriptionSchema.index({ pet: 1 });
PrescriptionSchema.index({ petParent: 1 });

export const PrescriptionModel =
  mongoose.models.Prescription ||
  model<Document>("Prescription", PrescriptionSchema);
