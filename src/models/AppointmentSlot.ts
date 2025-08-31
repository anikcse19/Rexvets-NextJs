import mongoose, { Document, Model, Schema, Types, models } from "mongoose";
export enum SlotStatus {
  AVAILABLE = "available",
  BOOKED = "booked",
  DISABLED = "disabled",
  ALL = "all",
}

export interface IAvailabilitySlot {
  vetId: Types.ObjectId;
  date: Date; // Store as date without timezone (local date)
  startTime: string; // Store as HH:mm in the appointment's timezone
  endTime: string; // Store as HH:mm in the appointment's timezone
  timezone: string; // Store the timezone of the appointment (e.g., "America/New_York")
  status: SlotStatus;
  notes?: string;
  createdAt: Date;
}

// Mongoose schema
const appointmentSlotSchema: Schema<IAvailabilitySlot & Document> = new Schema(
  {
    vetId: { type: Schema.Types.ObjectId, ref: "Veterinarian", required: true },
    date: { type: Date, required: true }, // Store as local date without timezone
    startTime: { type: String, required: true }, // HH:mm format in appointment timezone
    endTime: { type: String, required: true }, // HH:mm format in appointment timezone
    timezone: { type: String, required: true }, // Timezone identifier (e.g., "America/New_York")
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

// Index to prevent overlapping slots for the same vet, date, and timezone
appointmentSlotSchema.index(
  { date: 1, startTime: 1, endTime: 1, timezone: 1 },
  { unique: true }
);

// Index for efficient querying by date range and timezone

export const AppointmentSlot: Model<IAvailabilitySlot & Document> =
  models.AppointmentSlot ||
  mongoose.model<IAvailabilitySlot & Document>(
    "AppointmentSlot",
    appointmentSlotSchema
  );
