import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import moment from "moment-timezone";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import Veterinarian from "../../../../../../models/Veterinarian";
import { getSlotsByNoticePeriodAndDateRangeByVetId } from "../slot.util";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const vetId = searchParams.get("vetId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    console.log("START DATE", startDate);
    console.log("END DATE", endDate);
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
    const tz = veterinarian.timezone || "UTC";
    console.log(
      "todays-slot vet noticePeriod=",
      veterinarian?.noticePeriod,
      " tz=",
      tz
    );
    const notice = veterinarian?.noticePeriod ?? 0;
    const startDateUtc = moment.tz(startDate, tz).startOf("day").utc().toDate();
    const endDateUtc = moment.tz(endDate, tz).endOf("day").utc().toDate();
    const payload = {
      vetId: veterinarian._id.toString(),
      noticePeriod: notice,
      timezone: tz,
      startDate: startDateUtc,
      endDate: endDateUtc,
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
