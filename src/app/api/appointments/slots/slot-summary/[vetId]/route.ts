import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import Veterinarian from "@/models/Veterinarian";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import {
  IGetVetSlotPeriodsParams,
  getVetSlotPeriods,
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
    const paramsFn: IGetVetSlotPeriodsParams = {
      vetId: isVetExist._id,
      dateRange: {
        start: startDate as any,
        end: endDate as any,
      },
    };
    const response = await getVetSlotPeriods(paramsFn);
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Veterinarian slots retrieved successfully",
      data: response,
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
