import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import Veterinarian from "../../../../../../models/Veterinarian";
import { getSlotsByNoticePeriodAndDateRangeByVetId } from "../slot.util";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const vetId = searchParams.get("vetId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const timezone = searchParams.get("timezone") || "UTC";
    if (!vetId || !startDate || !endDate || !timezone) {
      throw Error(
        "Missing required query parameters: vetId, startDate, endDate , timezone"
      );
    }
    const veterinarian = await Veterinarian.findOne(
      { _id: new Types.ObjectId(vetId) },
      { noticePeriod: 1 }
    );
    if (!veterinarian) {
      throw Error("Veterinarian not found");
    }
    console.log(" veterinarian?.noticePeriod", veterinarian?.noticePeriod);
    const payload = {
      vetId,
      noticePeriod: veterinarian?.noticePeriod,
      timezone: timezone,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    console.log("payload", payload);
    const response = await getSlotsByNoticePeriodAndDateRangeByVetId(payload);
    const responseFormat: ISendResponse<any> = {
      success: true,
      message: "Available slots fetched successfully",
      data: response,
      statusCode: 200,
    };
    return sendResponse(responseFormat);
  } catch (error: any) {
    const errResp: IErrorResponse = {
      success: false,
      message: error.message || "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
