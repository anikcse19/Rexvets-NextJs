import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAppointmentMessage {
  _id: Types.ObjectId;
  appointmentId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderType: "pet_parent" | "veterinarian";
  senderName: string;
  senderImage?: string;
  content: string;
  messageType: "text" | "image" | "video" | "assessment" | "prescription" | "file";
  attachments?: Array<{
    url: string;
    fileName: string;
    fileSize?: number;
  }>;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointmentChat extends Document {
  appointmentId: Types.ObjectId;
  petParentId: Types.ObjectId;
  veterinarianId: Types.ObjectId;
  messages: IAppointmentMessage[];
  lastMessageAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentMessageSchema = new Schema<IAppointmentMessage>({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  senderType: {
    type: String,
    enum: ["pet_parent", "veterinarian"],
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderImage: {
    type: String,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "video", "assessment", "prescription", "file"],
    default: "text",
  },
  attachments: [{
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
  }],
  isRead: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const appointmentChatSchema = new Schema<IAppointmentChat>({
  appointmentId: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
    unique: true,
  },
  petParentId: {
    type: Schema.Types.ObjectId,
    ref: "PetParent",
    required: true,
  },
  veterinarianId: {
    type: Schema.Types.ObjectId,
    ref: "Veterinarian",
    required: true,
  },
  messages: [appointmentMessageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
appointmentChatSchema.index({ petParentId: 1 });
appointmentChatSchema.index({ veterinarianId: 1 });
appointmentChatSchema.index({ lastMessageAt: -1 });
appointmentMessageSchema.index({ appointmentId: 1, createdAt: 1 });

export const AppointmentChatModel = mongoose.models.AppointmentChat || 
  mongoose.model<IAppointmentChat>("AppointmentChat", appointmentChatSchema);

export const AppointmentMessageModel = mongoose.models.AppointmentMessage || 
  mongoose.model<IAppointmentMessage>("AppointmentMessage", appointmentMessageSchema);
