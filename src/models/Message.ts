import { IMessage, MessageSenderType } from "@/lib/interfaces";
import mongoose, { Document, Schema } from "mongoose";

export type MessageDocument = IMessage & Document;

const messageSchema = new Schema<MessageDocument>(
  {
    isAdmin: {
      type: Boolean,
      required: [true, "isAdmin is required to indicate sender type."],
    },
    vetParent: {
      type: Schema.Types.ObjectId,
      ref: "PetParent",
      required: false,
    },
    senderType: {
      type: String,
      enum: {
        values: Object.values(MessageSenderType),
        message: "Sender type must be either ADMIN or VET_PARENT.",
      },
      required: [true, "Sender type is required."],
    },
    content: {
      type: String,
      required: [true, "Message content cannot be empty."],
      trim: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Validation to ensure senderType and isAdmin are consistent, and vetParent is provided for non-admin
messageSchema.pre("validate", function (next) {
  if (this.senderType === MessageSenderType.Admin && !this.isAdmin) {
    next(new Error("isAdmin must be true when senderType is ADMIN."));
  } else if (this.senderType === MessageSenderType.VetParent && this.isAdmin) {
    next(new Error("isAdmin must be false when senderType is VET_PARENT."));
  } else if (
    this.senderType === MessageSenderType.VetParent &&
    !this.vetParent
  ) {
    next(new Error("Vet Parent ID is required when senderType is VET_PARENT."));
  } else if (this.senderType === MessageSenderType.Admin && this.vetParent) {
    next(
      new Error("vetParent should not be provided when senderType is ADMIN.")
    );
  } else {
    next();
  }
});

export const MessageModel =
  (mongoose.models.Message as mongoose.Model<MessageDocument>) ||
  mongoose.model<MessageDocument>("Message", messageSchema);
