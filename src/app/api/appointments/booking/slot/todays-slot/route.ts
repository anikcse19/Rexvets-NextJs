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
    const timezoneParam = searchParams.get("timezone") || "";
    if (!vetId || !startDate || !endDate) {
      throw Error(
        "Missing required query parameters: vetId, startDate, endDate"
      );
    }
    const veterinarian = await Veterinarian.findOne(
      { _id: new Types.ObjectId(vetId) },
      { noticePeriod: 1, timezone: 1 }
    );
    if (!veterinarian) {
      throw Error("Veterinarian not found");
    }
    const tz = veterinarian.timezone || timezoneParam || "UTC";
    console.log(
      "todays-slot vet noticePeriod=",
      veterinarian?.noticePeriod,
      " tz=",
      tz
    );
    // Ensure same local date is used for both bounds; util will convert using tz
    const onlyDate = new Date(startDate);
    const payload = {
      vetId,
      noticePeriod: veterinarian?.noticePeriod,
      timezone: tz,
      startDate: onlyDate,
      endDate: onlyDate,
    };
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
