import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { SlotStatus } from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import {
  getSlotsByVetId,
  IGetSlotsParams,
} from "../../../generate-appointment-slot/utils.appointment-slot";
import { groupSlotsIntoPeriods } from "../util.slot.summary";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) => {
  try {
    console.log("HIT VET ID");
    await connectToDatabase();
    const { vetId } = await params;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 1000;
    if (!vetId || !new Types.ObjectId(vetId)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid vetId",
        errorCode: "INVALID_VET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }
    const isVetExist = await Veterinarian.findOne({
      _id: vetId,
      isDeleted: false,
      isActive: true,
    });
    if (!isVetExist) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }
    if (!startDate || !endDate) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid date range",
        errorCode: "INVALID_DATE_RANGE",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    const paramsFn: IGetSlotsParams = {
      vetId,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      status: SlotStatus.ALL,
      limit,
      page,
    };
    console.log("paramsFn", paramsFn);
    const response = await getSlotsByVetId(paramsFn);
    console.log("response", response);
    const slotPeriods = groupSlotsIntoPeriods(response.data);
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Veterinarian slots retrieved successfully",
      data: slotPeriods,
    };

    return sendResponse(responseFormat);
  } catch (error) {
    const errResp: IErrorResponse = {
      success: false,
      message: "Failed to retrieve veterinarian slots",
      errorCode: "FAILED_TO_RETRIEVE_SLOTS",
      errors: null,
    };
    return throwAppError(errResp);
  }
};
