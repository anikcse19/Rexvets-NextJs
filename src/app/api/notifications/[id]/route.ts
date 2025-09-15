import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { NotificationModel } from "@/models";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid notification ID",
          errorCode: "INVALID_NOTIFICATION_ID",
          errors: null,
        },
        400
      );
    }

    const body = await req.json();
    const { isRead } = body;

    if (typeof isRead !== "boolean") {
      return throwAppError(
        {
          success: false,
          message: "isRead must be a boolean value",
          errorCode: "INVALID_ISREAD_VALUE",
          errors: null,
        },
        400
      );
    }

    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!notification) {
      return throwAppError(
        {
          success: false,
          message: "Notification not found",
          errorCode: "NOTIFICATION_NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return throwAppError(
      {
        success: false,
        message: "Failed to update notification",
        errorCode: "NOTIFICATION_UPDATE_ERROR",
        errors: error?.errors || null,
      },
      500
    );
  }
}