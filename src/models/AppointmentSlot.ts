import mongoose, { Document, Model, Schema, Types, models } from "mongoose";
export enum SlotStatus {
  AVAILABLE = "available",
  BOOKED = "booked",
  BLOCKED = "blocked",
  PENDING = "pending",
  ALL = "all",
}

export interface IAvailabilitySlot {
  vetId: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  notes?: string;
  createdAt: Date;
}

// Mongoose schema
const appointmentSlotSchema: Schema<IAvailabilitySlot & Document> = new Schema(
  {
    vetId: { type: Schema.Types.ObjectId, ref: "Veterinarian", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SlotStatus),
      default: SlotStatus.AVAILABLE,
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Optional: add index to prevent overlapping slots
appointmentSlotSchema.index(
  { vetId: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export const AppointmentSlot: Model<IAvailabilitySlot & Document> =
  models.AppointmentSlot ||
  mongoose.model<IAvailabilitySlot & Document>(
    "AppointmentSlot",
    appointmentSlotSchema
  );
