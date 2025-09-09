import { connectToDatabase } from "@/lib/mongoose";
import { getUserTimezone } from "@/lib/timezone";
import {
    IErrorResponse,
    sendResponse,
    throwAppError,
} from "@/lib/utils/send.response";
import Veterinarian from "@/models/Veterinarian";
import moment from "moment";
import { NextRequest } from "next/server";
import {
    generateAppointmentSlots,
    IGenerateAppointmentSlots,
} from "../generate-appointment-slot/utils.appointment-slot";

interface AddPeriodRequest {
  vetId: string;
  slotPeriods: Array<{
    start: Date;
    end: Date;
  }>;
  dateRange: {
    start: Date;
    end: Date;
  };
  slotDuration?: number;
  bufferBetweenSlots?: number;
}

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    
    const {
      vetId,
      slotPeriods,
      dateRange,
      slotDuration = 30,
      bufferBetweenSlots = 0,
    }: AddPeriodRequest = await req.json();

    // Validate required fields
    if (!vetId) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian ID is required",
        errorCode: "VET_ID_REQUIRED",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    if (!slotPeriods || !Array.isArray(slotPeriods) || slotPeriods.length === 0) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Slot periods are required",
        errorCode: "SLOT_PERIODS_REQUIRED",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    if (!dateRange || !dateRange.start || !dateRange.end) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Date range is required",
        errorCode: "DATE_RANGE_REQUIRED",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Find the veterinarian
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

    // Convert slot periods from Date objects to HH:mm format strings
    const formattedSlotPeriods = slotPeriods.map(period => ({
      start: moment(period.start).format("HH:mm"),
      end: moment(period.end).format("HH:mm"),
    }));

    // Prepare slot data for generation
    const slotData: IGenerateAppointmentSlots = {
      vetId: existingVet._id,
      slotPeriods: formattedSlotPeriods,
      dateRange: dateRange,
      timezone: existingVet?.timezone || getUserTimezone(),
      bufferBetweenSlots: bufferBetweenSlots,
      slotDuration: slotDuration,
    };

    console.log("Adding new period with slot data:", slotData);

    // Generate appointment slots for the new period
    const response = await generateAppointmentSlots(slotData);
    
    console.log("New period slots generated:", response);
    
    return sendResponse({
      success: true,
      message: "New period added and slots generated successfully",
      data: response,
      statusCode: 200,
    });
  } catch (error: any) {
    console.log("ERROR adding new period:", error.message);
    
    // Handle specific MongoDB duplicate key errors
    if (error.message?.includes("E11000 duplicate key error")) {
      const errResp: IErrorResponse = {
        success: false,
        message:
          "Some appointment slots already exist for this time period. Please try again or contact support if the issue persists.",
        errorCode: "DUPLICATE_SLOTS_ERROR",
        errors: null,
      };
      return throwAppError(errResp, 409); // 409 Conflict
    }

    // Handle existing slots error
    if (error.message?.includes("already exist")) {
      const errResp: IErrorResponse = {
        success: false,
        message: error.message,
        errorCode: "SLOTS_ALREADY_EXIST",
        errors: null,
      };
      return throwAppError(errResp, 409);
    }

    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
