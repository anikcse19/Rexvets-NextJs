import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import {
  AppointmentModel,
  IAppointment,
} from "@/models/Appointment";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

// GET Appointment by ID for video call access (no authentication required)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid appointment ID",
          errorCode: "INVALID_ID",
          errors: null,
        },
        400
      );
    }

    // Find appointment with populated fields for video call
    const appointment = await AppointmentModel.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("veterinarian", "name email specialization profileImage")
      .populate("petParent", "name email phone profileImage")
      .populate("pet", "name species breed gender weight age")
      .lean();

    if (!appointment) {
      return throwAppError(
        {
          success: false,
          message: "Appointment not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    // Check if appointment has a meeting link (required for video calls)
    if (!appointment.meetingLink) {
      return throwAppError(
        {
          success: false,
          message: "No meeting link available for this appointment",
          errorCode: "NO_MEETING_LINK",
          errors: null,
        },
        400
      );
    }

    return sendResponse<IAppointment>({
      success: true,
      data: appointment as unknown as IAppointment,
      message: "Appointment retrieved successfully for video call",
      statusCode: 200,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: "Failed to fetch appointment for video call",
        errorCode: "FETCH_ERROR",
        errors: error?.errors || { message: error.message },
      },
      500
    );
  }
}
