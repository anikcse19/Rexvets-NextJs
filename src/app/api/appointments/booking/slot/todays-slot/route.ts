import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { NextRequest } from "next/server";
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
    const payload = {
      vetId,
      noticePeriod: 30,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timezone,
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
