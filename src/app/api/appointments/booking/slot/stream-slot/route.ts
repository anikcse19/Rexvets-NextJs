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
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    if (!vetId || !startDate || !endDate) {
      throw Error("Missing required query parameters");
    }
    const response = await getSlotsByNoticePeriodAndDateRangeByVetId({
      vetId,
      noticePeriod: 30,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
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
