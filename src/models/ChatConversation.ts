// models/ChatConversation.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IChatBotMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  requiresHumanSupport?: boolean;
  isTeamRelated?: boolean;
}

export interface IChatConversation extends Document {
  userId?: string; // If user is logged in
  userName: string;
  userEmail: string;
  sessionId: string; // For tracking conversations across sessions
  messages: IChatBotMessage[];
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  requiresHumanSupport: boolean;
  tags: string[]; // For categorizing conversations
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  requiresHumanSupport: {
    type: Boolean,
    default: false,
  },
  isTeamRelated: {
    type: Boolean,
    default: false,
  },
});

const ChatConversationSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
    requiresHumanSupport: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ChatConversationSchema.index({ sessionId: 1, createdAt: -1 });
ChatConversationSchema.index({ userEmail: 1, createdAt: -1 });
ChatConversationSchema.index({ userId: 1, createdAt: -1 });

// Calculate duration before saving
ChatConversationSchema.pre("save", function (next) {
  if (this.endedAt && this.startedAt) {
    this.duration = Math.floor(
      (this.endedAt.getTime() - this.startedAt.getTime()) / 1000
    );
  }
  next();
});

export const ChatConversation: Model<IChatConversation> =
  mongoose.models.ChatConversation ||
  mongoose.model<IChatConversation>("ChatConversation", ChatConversationSchema);
