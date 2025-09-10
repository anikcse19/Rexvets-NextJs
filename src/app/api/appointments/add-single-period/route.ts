import { connectToDatabase } from "@/lib/mongoose";
import { DateRange } from "@/lib/types";
import {
  IErrorResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import Veterinarian from "@/models/Veterinarian";
import { NextRequest } from "next/server";
import {
  IGenerateSinglePeriod,
  generateAppointmentSlotsForPeriod,
} from "../generate-appointment-slot/utils.appointment-slot";

interface AddSinglePeriodRequest {
  vetId: string;
  dateRange: DateRange;
  timezone?: string; // optional; fallback to vet.timezone
  period: { start: string; end: string }; // HH:mm
  slotDuration?: number;
  bufferBetweenSlots?: number;
}

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const {
      vetId,
      dateRange,
      timezone,
      period,
      slotDuration = 30,
      bufferBetweenSlots = 0,
    }: AddSinglePeriodRequest = await req.json();

    if (!vetId) {
      return throwAppError(
        {
          success: false,
          message: "Veterinarian ID is required",
          errorCode: "VET_ID_REQUIRED",
          errors: null,
        },
        400
      );
    }
    if (
      !dateRange?.start ||
      !dateRange?.end ||
      !period?.start ||
      !period?.end
    ) {
      return throwAppError(
        {
          success: false,
          message: "Date and period are required",
          errorCode: "INPUT_REQUIRED",
          errors: null,
        },
        400
      );
    }

    const vet = await Veterinarian.findById(vetId);
    if (!vet) {
      return throwAppError(
        {
          success: false,
          message: "Veterinarian not found",
          errorCode: "VET_NOT_FOUND",
          errors: null,
        },
        404
      );
    }
    if (!vet.timezone) {
      throw new Error("Veterinarian timezone is required");
    }
    const payload: IGenerateSinglePeriod = {
      vetId,
      dateRange: dateRange,
      timezone: vet.timezone,
      period,
      slotDuration,
      bufferBetweenSlots,
    };

    const result = await generateAppointmentSlotsForPeriod(payload);

    return sendResponse({
      success: true,
      message: "Single period slots created successfully",
      data: result,
      statusCode: 200,
    });
  } catch (error: any) {
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
