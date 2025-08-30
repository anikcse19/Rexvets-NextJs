import { connectToDatabase } from "@/lib/mongoose";
import { getUserTimezone } from "@/lib/timezone";
import {
  IErrorResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import Veterinarian from "@/models/Veterinarian";
import { NextRequest } from "next/server";
import {
  generateAppointmentSlots,
  IGenerateAppointmentSlots,
  IUpdateAppointmentSlots,
  updateAppointmentSlots,
} from "../utils.appointment-slot";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) => {
  try {
    await connectToDatabase();
    const { vetId } = await params;
    if (!vetId) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian ID is required",
        errorCode: "VET_ID_REQUIRED",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    const {
      slotPeriods,
      slotDuration = 30,
      bufferBetweenSlots = 0,
      dateRange,
      timezone, // New timezone parameter
    } = await req.json();

    // Validate timezone - use provided timezone or default to user's timezone
    const appointmentTimezone = timezone || getUserTimezone();

    const existingVet = await Veterinarian.findOne({ _id: vetId });
    if (!existingVet) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }

    const slotData: IGenerateAppointmentSlots = {
      vetId: existingVet._id,
      slotPeriods: slotPeriods,
      dateRange: dateRange,
      timezone: appointmentTimezone, // Include timezone in the data
      bufferBetweenSlots: bufferBetweenSlots,
      slotDuration: slotDuration,
    };

    const response = await generateAppointmentSlots(slotData);
    console.log("RESPONSE", response);
    return sendResponse({
      success: true,
      message: "Appointment slots generated successfully",
      data: response,
      statusCode: 200,
    });
  } catch (error: any) {
    console.log("ERROR:", error.message);
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) => {
  try {
    await connectToDatabase();
    const { vetId } = await params;
    if (!vetId) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian ID is required",
        errorCode: "VET_ID_REQUIRED",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    const {
      slotPeriods,
      slotDuration = 30,
      bufferBetweenSlots = 5,
      dateRange,
      timezone, // New timezone parameter
    } = await req.json();

    // Validate timezone - use provided timezone or default to user's timezone
    const appointmentTimezone = timezone || getUserTimezone();

    const existingVet = await Veterinarian.findOne({ _id: vetId });
    if (!existingVet) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }

    console.log("existingVet", existingVet);
    const slotData: IUpdateAppointmentSlots = {
      vetId: existingVet._id,
      slotPeriods: slotPeriods,
      dateRange: dateRange,
      timezone: appointmentTimezone, // Include timezone in the data
      bufferBetweenSlots: bufferBetweenSlots,
      slotDuration: slotDuration,
    };

    const response = await updateAppointmentSlots(slotData);
    return sendResponse({
      success: true,
      message: "Appointment slots updated successfully",
      data: response,
      statusCode: 200,
    });
  } catch (error) {
    console.log("ERROR:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
