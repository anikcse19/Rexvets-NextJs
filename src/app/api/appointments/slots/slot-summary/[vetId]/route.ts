import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { isValidTimezone } from "@/lib/timezone";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { SlotStatus } from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import {
  getSlotsByVetId,
  IGetSlotsParams,
} from "../../../generate-appointment-slot/utils.appointment-slot";
import {
  groupSlotsIntoPeriods,
  updateSlotStatus,
  updateSlotStatusBulk,
} from "../util.slot.summary";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) => {
  try {
    await connectToDatabase();
    const { vetId } = await params;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const timezone = searchParams.get("timezone"); // Timezone for display conversion
    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 1000;
    const slotStatus =
      (searchParams.get("status") as SlotStatus) || SlotStatus.AVAILABLE;

    // Validate vetId
    if (!vetId || !new Types.ObjectId(vetId)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid veterinarian ID",
        errorCode: "INVALID_VET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Validate date range
    if (!startDate || !endDate) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Start date and end date are required",
        errorCode: "MISSING_DATE_RANGE",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Validate timezone if provided
    if (timezone && !isValidTimezone(timezone)) {
      const errResp: IErrorResponse = {
        success: false,
        message: `Invalid timezone: ${timezone}`,
        errorCode: "INVALID_TIMEZONE",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Check if veterinarian exists and is active
    const isVetExist = await Veterinarian.findOne({
      _id: vetId,
      isDeleted: false,
      isActive: true,
    });

    if (!isVetExist) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found or inactive",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }

    // Prepare parameters for slot retrieval
    const paramsFn: IGetSlotsParams = {
      vetId,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      timezone: isVetExist.timezone || "UTC", // Pass timezone for display conversion
      status: slotStatus,
      limit,
      page,
    };

    console.log("Fetching slots with params:", {
      vetId,
      startDate,
      endDate,
      timezone,
      status: slotStatus,
    });

    const response = await getSlotsByVetId(paramsFn);
    console.log("Raw slots response:", response);

    const slotPeriods = groupSlotsIntoPeriods(response.data);
    console.log("Grouped slot periods:", slotPeriods);

    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Veterinarian slots retrieved successfully",
      data: {
        periods: slotPeriods,
        meta: response.meta,
        filters: {
          ...response.filters,
          timezone: timezone || "server_default",
        },
      },
    };

    return sendResponse(responseFormat);
  } catch (error: any) {
    console.error("Error in slot-summary GET:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Failed to retrieve veterinarian slots",
      errorCode: "FAILED_TO_RETRIEVE_SLOTS",
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
    const { vetId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
        errors: null,
      };
      return throwAppError(errResp, 401);
    }
    const body = await req.json();
    const { dateRange, status } = body;
    if (!vetId || !new Types.ObjectId(vetId)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid vetId",
        errorCode: "INVALID_VET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }
    if (!dateRange || !dateRange.start || !dateRange.end || !status) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid request body",
        errorCode: "INVALID_REQUEST_BODY",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }
    const response = await updateSlotStatus({
      vetId,
      dateRange,
      status,
    });
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Slot status updated successfully",
      data: response,
    };
    return sendResponse(responseFormat);
  } catch (error: any) {
    console.error("Error in slot-summary PATCH:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Failed to update slot status",
      errorCode: "FAILED_TO_UPDATE_SLOT_STATUS",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) => {
  try {
    const { vetId } = await params;
    const body = await req.json();
    const { status, slotIds } = body;
    console.log("Updating slot status:", { status, slotIds });
    const response = await updateSlotStatusBulk({
      vetId,
      slotIds,
      status,
    });
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Slot status updated successfully",
      data: response,
    };
    return sendResponse(responseFormat);
  } catch (error: any) {
    console.error("Error in slot-summary PUT:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Failed to update slot status",
      errorCode: "FAILED_TO_UPDATE_SLOT_STATUS",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
