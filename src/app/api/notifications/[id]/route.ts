import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { NotificationModel } from "@/models";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const body = await req.json();
    
    // Validate the notification ID
    if (!id) {
      return throwAppError(
        {
          success: false,
          message: "Notification ID is required",
          errorCode: "INVALID_NOTIFICATION_ID",
          errors: null,
        },
        400
      );
    }
    
    // Update the notification
    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedNotification) {
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
      data: updatedNotification,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    // Validate the notification ID
    if (!id) {
      return throwAppError(
        {
          success: false,
          message: "Notification ID is required",
          errorCode: "INVALID_NOTIFICATION_ID",
          errors: null,
        },
        400
      );
    }
    
    // Delete the notification
    const deletedNotification = await NotificationModel.findByIdAndDelete(id);
    
    if (!deletedNotification) {
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
      message: "Notification deleted successfully",
      data: deletedNotification,
    });
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return throwAppError(
      {
        success: false,
        message: "Failed to delete notification",
        errorCode: "NOTIFICATION_DELETE_ERROR",
        errors: error?.errors || null,
      },
      500
    );
  }
}
