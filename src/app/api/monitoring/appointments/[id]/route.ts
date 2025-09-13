import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import {
  AppointmentModel,
  IAppointment,
} from "@/models/Appointment";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

// GET Appointment by ID for monitoring (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return throwAppError(
        {
          success: false,
          message: "Unauthorized - Admin access required",
          errorCode: "UNAUTHORIZED",
          errors: null,
        },
        401
      );
    }

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

    // Find appointment with populated fields for monitoring
    const appointment = await AppointmentModel.findById(id)
      .populate("veterinarian", "name email specialization")
      .populate("petParent", "name email phone")
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

    return sendResponse<IAppointment>({
      success: true,
      data: appointment as unknown as IAppointment,
      message: "Appointment retrieved successfully for monitoring",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching appointment for monitoring:", error);
    return throwAppError(
      {
        success: false,
        message: "Internal server error",
        errorCode: "INTERNAL_ERROR",
        errors: null,
      },
      500
    );
  }
}
