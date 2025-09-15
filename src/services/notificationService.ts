import { connectToDatabase } from "@/lib/mongoose";
import type { INotification } from "@/models";
import { NotificationModel, NotificationType, UserModel } from "@/models";
import type { FilterQuery, UpdateQuery } from "mongoose";

// Create
export async function createNotification(payload: Partial<INotification>) {
  await connectToDatabase();
  const doc = await NotificationModel.create(payload);
  return doc.toObject();
}

// Read - by id
export async function getNotificationById(id: string) {
  await connectToDatabase();
  return NotificationModel.findById(id).lean();
}

// Read - list for recipient
export async function listNotificationsForRecipient(
  recipientId: string,
  options?: {
    isRead?: boolean;
    type?: NotificationType;
    limit?: number;
    skip?: number;
  }
) {
  await connectToDatabase();
  const query: FilterQuery<INotification> = { recipientId } as any;
  if (typeof options?.isRead === "boolean") query.isRead = options.isRead;
  if (options?.type) query.type = options.type;

  return NotificationModel.find(query)
    .sort({ createdAt: -1 })
    .skip(options?.skip ?? 0)
    .limit(options?.limit ?? 20)
    .lean();
}

// Update
export async function updateNotification(
  id: string,
  updates: UpdateQuery<INotification>
) {
  await connectToDatabase();
  return NotificationModel.findByIdAndUpdate(id, updates, { new: true }).lean();
}

// Delete
export async function deleteNotification(id: string) {
  await connectToDatabase();
  await NotificationModel.findByIdAndDelete(id);
  return { success: true } as const;
}

// Mark read/unread
export async function markNotificationRead(id: string, isRead = true) {
  await connectToDatabase();
  return NotificationModel.findByIdAndUpdate(
    id,
    { $set: { isRead } },
    { new: true }
  ).lean();
}

// Bulk mark read for recipient
export async function markAllReadForRecipient(recipientId: string) {
  await connectToDatabase();
  await NotificationModel.updateMany(
    { recipientId },
    { $set: { isRead: true } }
  );
  return { success: true } as const;
}

// Create notification for all admin users
export async function createAdminNotification(payload: {
  type: NotificationType;
  title: string;
  body?: string;
  subTitle?: string;
  data?: Record<string, unknown>;
}) {
  await connectToDatabase();
  
  // Get all admin users
  const adminUsers = await UserModel.find({ role: "admin" }).select("_id").lean();
  
  if (adminUsers.length === 0) {
    console.warn("No admin users found to send notification to");
    return [];
  }
  
  // Create notification for each admin user
  const notifications = adminUsers.map(admin => ({
    ...payload,
    recipientId: admin._id,
    isRead: false,
  }));
  
  const createdNotifications = await NotificationModel.insertMany(notifications);
  return createdNotifications;
}

export { NotificationType };
export type { INotification };

