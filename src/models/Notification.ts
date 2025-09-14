import mongoose, { Document, Model, Schema, Types } from "mongoose";

export enum NotificationType {
  RECURRING_DONATION = "RECURRING_DONATION",
  PRESCRIPTION_REQUEST = "PRESCRIPTION_REQUEST",
  NEW_DONATION = "NEW_DONATION",
  NEW_MESSAGE = "NEW_MESSAGE",
  NEW_APPOINTMENT = "NEW_APPOINTMENT",
  NEW_SIGNUP = "NEW_SIGNUP",
}

export interface INotification {
  type: NotificationType;
  title: string;
  body?: string;
  subTitle?: string;
  recipientId: Types.ObjectId; // who will receive/see this notification (User)
  actorId?: Types.ObjectId; // who triggered it (User/Vet/System)

  appointmentId?: Types.ObjectId;

  // prescription-request-only fields
  vetId?: Types.ObjectId;
  petId?: Types.ObjectId;
  petParentId?: Types.ObjectId;

  // Flexible payload bucket
  data?: Record<string, unknown>;

  isRead?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INotificationModel extends Model<INotification & Document> {}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    subTitle: { type: String, trim: true },
    body: { type: String, trim: true },

    // ids
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorId: { type: Schema.Types.ObjectId, ref: "User" },

    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },

    // prescription-request-only fields
    vetId: { type: Schema.Types.ObjectId, ref: "Veterinarian" },
    petId: { type: Schema.Types.ObjectId, ref: "Pet" },
    petParentId: { type: Schema.Types.ObjectId, ref: "PetParent" },

    // generic payload
    data: { type: Schema.Types.Mixed },

    isRead: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

// Conditional validation for prescription requests
notificationSchema.pre("validate", function (next) {
  const doc = this as unknown as INotification;
  if (doc.type === NotificationType.PRESCRIPTION_REQUEST) {
    if (!doc.vetId || !doc.petId || !doc.petParentId) {
      return next(
        new Error(
          "vetId, petId, and petParentId are required when type is PRESCRIPTION_REQUEST"
        )
      );
    }
  }
  next();
});

// Helpful compound indexes for feed & unread queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

const NotificationModel =
  (mongoose.models.Notification as INotificationModel) ||
  mongoose.model<INotification, INotificationModel>(
    "Notification",
    notificationSchema
  );

export default NotificationModel;
