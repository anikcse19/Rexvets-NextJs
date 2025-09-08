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
import { checkVetAvailability } from "./utils.has-available";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const vetId = searchParams.get("vetId");

    if (!vetId) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Missing required query parameter: vetId",
        errorCode: "MISSING_VET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    if (!Types.ObjectId.isValid(vetId)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid vetId format",
        errorCode: "INVALID_VET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    const hasAvailability = await checkVetAvailability(vetId);
    const response: ISendResponse<any> = {
      success: true,
      statusCode: 200,
      message: "Availability checked successfully",
      data: { hasAvailability },
    };
    return sendResponse(response);
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
