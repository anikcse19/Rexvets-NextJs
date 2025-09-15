// models/PharmacyTransferRequest.ts
import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface IPharmacyTransferRequest extends Document {
  pharmacyName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  appointment: Types.ObjectId;
  petParentId: Types.ObjectId;
  prescriptions: string[];
  appointmentDate?: Date;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  // 💳 Payment-related fields
  paymentStatus: "unpaid" | "paid" | "refunded";
  amount: number;
  transactionID?: string;
  paymentIntentId?: string;
  stripeCustomerId?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

const PharmacyTransferRequestSchema = new Schema<IPharmacyTransferRequest>(
  {
    pharmacyName: {
      type: String,
      required: [true, "Pharmacy name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    street: {
      type: String,
      required: [true, "Street is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    prescriptions: {
      type: [String],
      ref: "Prescription",
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment is required"],
      index: true,
    },
    petParentId: {
      type: Schema.Types.ObjectId,
      ref: "PetParent",
      required: [true, "Pet Parent is required"],
      index: true,
    },
    appointmentDate: {
      type: Date,
      // required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 💳 Payment / Stripe fields
    transactionID: {
      type: String,
      index: true,
    },
    paymentIntentId: {
      type: String,
      index: true,
    },
    stripeCustomerId: {
      type: String,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed, // flexible object storage
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

PharmacyTransferRequestSchema.index({ appointment: 1, createdAt: -1 });

export const PharmacyTransferRequestModel =
  mongoose.models.PharmacyTransferRequest ||
  model<IPharmacyTransferRequest>(
    "PharmacyTransferRequest",
    PharmacyTransferRequestSchema
  );
