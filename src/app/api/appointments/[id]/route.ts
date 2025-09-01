import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import {
  AppointmentModel,
  AppointmentStatus,
  IAppointment,
} from "@/models/Appointment";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

// GET Appointment by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    console.log("USER", session?.user);
    if (!session?.user) {
      return throwAppError(
        {
          success: false,
          message: "Unauthorized",
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

    const userIdToMatch = (session.user as any)?.refId ?? session.user.id;

    const appointment = await AppointmentModel.findOne({
      _id: id,
      isDeleted: false,
      // $or: [
      //   { veterinarian: new Types.ObjectId(String(userIdToMatch)) },
      //   { petParent: new Types.ObjectId(String(userIdToMatch)) },
      // ],
    })
      .populate("veterinarian", "name email profileImage specialization ")
      .populate(
        "petParent",
        "name email profileImage phone profileImage  state  city"
      )
      .populate(
        "pet",
        "name species breed age weight gender color image spayedNeutered"
      )
      .lean();

    if (!appointment) {
      return throwAppError(
        {
          success: false,
          message: "Appointment not found or unauthorized",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Appointment fetched successfully",
      data: appointment,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: "Failed to fetch appointment",
        errorCode: "FETCH_ERROR",
        errors: error?.errors || { message: error.message },
      },
      500
    );
  }
}

// UPDATE Appointment
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return throwAppError(
        {
          success: false,
          message: "Unauthorized",
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

    const updates = await req.json();
    const allowedUpdates: (keyof IAppointment)[] = [
      "appointmentDate",
      "durationMinutes",
      "meetingLink",
      "notes",
      "concerns",
      "feeUSD",
      "status",
      "appointmentType",
      "paymentStatus",
      "isFollowUp",
      "reminderSent",
    ];

    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every((key) =>
      allowedUpdates.includes(key as keyof IAppointment)
    );

    if (!isValidOperation) {
      return throwAppError(
        {
          success: false,
          message: "Invalid updates provided",
          errorCode: "INVALID_UPDATES",
          errors: { allowedUpdates },
        },
        400
      );
    }

    if (updates.appointmentDate) {
      updates.appointmentDate = new Date(updates.appointmentDate);
    }

    const userIdToMatch = (session.user as any)?.refId ?? session.user.id;

    const appointment = await AppointmentModel.findOne({
      _id: id,
      isDeleted: false,
      $or: [
        { veterinarian: new Types.ObjectId(String(userIdToMatch)) },
        { petParent: new Types.ObjectId(String(userIdToMatch)) },
      ],
    });

    if (!appointment) {
      return throwAppError(
        {
          success: false,
          message: "Appointment not found or unauthorized",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    Object.assign(appointment, updates);
    await appointment.save();

    const populatedAppointment = await AppointmentModel.findById(id)
      .populate("veterinarian")
      .populate("petParent")
      .populate("pet")
      .lean();

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Appointment updated successfully",
      data: populatedAppointment,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: "Failed to update appointment",
        errorCode: "UPDATE_ERROR",
        errors: error?.errors || { message: error.message },
      },
      500
    );
  }
}

// SOFT DELETE Appointment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return throwAppError(
        {
          success: false,
          message: "Unauthorized",
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

    const userIdToMatch = (session.user as any)?.refId ?? session.user.id;

    const appointment = await AppointmentModel.findOne({
      _id: id,
      isDeleted: false,
      $or: [
        { veterinarian: new Types.ObjectId(String(userIdToMatch)) },
        { petParent: new Types.ObjectId(String(userIdToMatch)) },
      ],
    });

    if (!appointment) {
      return throwAppError(
        {
          success: false,
          message: "Appointment not found or unauthorized",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    appointment.isDeleted = true;
    appointment.status = AppointmentStatus.CANCELLED;
    await appointment.save();

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Appointment soft deleted successfully",
      data: null,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: "Failed to delete appointment",
        errorCode: "DELETE_ERROR",
        errors: error?.errors || { message: error.message },
      },
      500
    );
  }
}
