import mongoose, { Document, model, Schema, Types } from "mongoose";

export enum BlockIdentifier {
  IP = "IP",
  ID = "ID",
  EMAIL = "EMAIL",
  MACAddress = "MACAddress",
}

export interface IBlockList extends Document {
  blockedBy: {
    userId?: Types.ObjectId;
  };
  targetType: BlockIdentifier; // Enum for target type
  targetValue: string; // IP, UserID, Email, or MAC address
  reason?: string; // Optional reason for blocking
  blockedPaths: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlockListSchema = new Schema<IBlockList>(
  {
    blockedBy: {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    },
    targetType: {
      type: String,
      enum: Object.values(BlockIdentifier),
      required: true,
    },
    targetValue: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
    blockedPaths: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

export const BlockListModel =
  mongoose.models.BlockList || model<IBlockList>("BlockList", BlockListSchema);
