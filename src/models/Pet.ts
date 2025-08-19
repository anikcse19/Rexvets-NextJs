import { IPet } from "@/lib";
import mongoose, { Document, Schema, Types } from "mongoose";

const petSchema = new Schema<IPet & Document>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  species: {
    type: String,
    enum: ["dog", "cat", "bird", "rabbit", "hamster", "guinea pig"],
    required: true,
  },
  breed: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  primaryColor: { type: String, required: true },
  spayedNeutered: {
    type: String,
    enum: ["spayed", "neutered", "intact"],
    required: true,
  },
  weight: { type: Number, required: true },
  weightUnit: { type: String, enum: ["kg", "lb"], required: true },
  dateOfBirth: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "PetParent", required: true },
  allergies: [{ type: String }],
  medicalConditions: [{ type: String }],
  currentMedications: [{ type: String }],
  healthStatus: {
    type: String,
    enum: ["Healthy", "Under Treatment", "Critical", "Unknown"],
    default: "Unknown",
  },
  emergencyContact: { type: String },
  veterinarianNotes: { type: String },
  lastVisit: { type: String },
  nextVaccination: { type: String },
  isDeleted: { type: Boolean, default: false },
});

// Indexes
petSchema.index({ name: 1 });
petSchema.index({ species: 1 });
petSchema.index({ breed: 1 });
petSchema.index({ parentId: 1 });
petSchema.index({ species: 1, breed: 1 });
petSchema.index({ name: "text", breed: "text" });

export const PetModel =
  mongoose.models.Pet || mongoose.model<IPet>("Pet", petSchema);
