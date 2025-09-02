import mongoose, { Document, Schema, model, Types } from "mongoose";
import {
  AnnouncementKind,
  AudienceRole,
  ReactionValue,
} from "@/lib/types/announcement";

export interface IAnnouncement extends Document {
  kind: AnnouncementKind;
  title: string;
  details: string;
  audience: AudienceRole[]; // allowed viewers
  publishedAt?: Date | null;
  expiresAt?: Date | null;

  reactions: Array<{
    user: Types.ObjectId;
    role: AudienceRole;
    value: ReactionValue;
    reactedAt: Date;
  }>;

  reads: Array<{
    user: Types.ObjectId;
    role: AudienceRole;
    readAt: Date;
  }>;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true }, // user id from respective collection
    role: {
      type: String,
      enum: ["veterinarian", "pet_parent"],
      required: true,
    },
    value: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      required: true,
    },
    reactedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ReadSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    role: {
      type: String,
      enum: ["veterinarian", "pet_parent"],
      required: true,
    },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    kind: {
      type: String,
      enum: Object.values(AnnouncementKind),
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [160, "Title cannot exceed 160 characters"],
    },
    details: {
      type: String,
      required: [true, "Details are required"],
      trim: true,
      maxlength: [10000, "Details too long"],
    },
    audience: {
      type: [String],
      enum: ["veterinarian", "pet_parent"],
      required: true,
      validate: (arr: AudienceRole[]) => arr.length > 0,
    },
    publishedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },

    reactions: { type: [ReactionSchema], default: [] },
    reads: { type: [ReadSchema], default: [] },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helpful indexes for common queries
if (!mongoose.models.Announcement) {
  AnnouncementSchema.index({
    isDeleted: 1,
    publishedAt: 1,
    expiresAt: 1,
    createdAt: -1,
  });
  AnnouncementSchema.index({ audience: 1, isDeleted: 1, publishedAt: 1 }); // list by audience
  AnnouncementSchema.index({ kind: 1, isDeleted: 1, createdAt: -1 });

  // For analytics on reactions
  AnnouncementSchema.index({ "reactions.role": 1, "reactions.value": 1 });
  AnnouncementSchema.index({ "reads.role": 1 });
}

export const AnnouncementModel =
  mongoose.models.Announcement ||
  model<IAnnouncement>("Announcement", AnnouncementSchema);
