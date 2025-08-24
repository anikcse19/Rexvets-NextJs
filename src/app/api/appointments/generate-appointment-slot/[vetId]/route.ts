import {
  IErrorResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import Veterinarian from "@/models/Veterinarian";
import { NextRequest } from "next/server";
import { generateSlotsForVeterinarian } from "../utils.appointment-slot";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) => {
  try {
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

    const { startDate, endDate, slotDuration, bufferBetweenSlots } =
      await req.json();
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
    const response = await generateSlotsForVeterinarian(existingVet, {
      startDate,
      endDate,
      slotDuration,
      bufferBetweenSlots,
    });
    return sendResponse({
      success: true,
      message: "Appointment slots generated successfully",
      data: response,
      statusCode: 200,
    });
  } catch (error) {
    const errResp: IErrorResponse = {
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
