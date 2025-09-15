import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { NotificationModel } from "@/models";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { notificationIds } = body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return throwAppError(
        {
          success: false,
          message: "notificationIds must be a non-empty array",
          errorCode: "INVALID_NOTIFICATION_IDS",
          errors: null,
        },
        400
      );
    }

    // Validate all IDs are valid ObjectIds
    const invalidIds = notificationIds.filter(
      (id: string) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidIds.length > 0) {
      return throwAppError(
        {
          success: false,
          message: "Invalid notification IDs provided",
          errorCode: "INVALID_NOTIFICATION_IDS",
          errors: { invalidIds },
        },
        400
      );
    }

    const result = await NotificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { isRead: true }
    );

    return sendResponse({
      statusCode: 200,
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
    });
  } catch (error: any) {
    console.error("Error marking notifications as read:", error);
    return throwAppError(
      {
        success: false,
        message: "Failed to mark notifications as read",
        errorCode: "NOTIFICATION_MARK_READ_ERROR",
        errors: error?.errors || null,
      },
      500
    );
  }
}
