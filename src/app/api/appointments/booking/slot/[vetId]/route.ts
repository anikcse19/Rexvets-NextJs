import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { SlotStatus } from "@/models/AppointmentSlot";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import {
  IGetSlotsParams,
  SortOrder,
  getSlotsByVetId,
} from "../../../generate-appointment-slot/utils.appointment-slot";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) => {
  try {
    await connectToDatabase();
    const { vetId } = await params;
    const { searchParams } = new URL(req.url);
    console.log("HIT VET ID", vetId);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status") || SlotStatus.AVAILABLE;
    const searchQuery = searchParams.get("searchQuery") || "";
    const sortBy = searchParams.get("sortBy") || "startTime";
    const sortOrder = (searchParams.get("sortOrder") ||
      SortOrder.ASC) as SortOrder;
    //pagination
    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 10;
    if (!vetId || !Types.ObjectId.isValid(vetId)) {
      const errResp: IErrorResponse = {
        message: "Invalid vetId",
        success: false,
        errorCode: "INVALID_VET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }
    if (!startDate || !endDate) {
      const errResp: IErrorResponse = {
        message: "startDate and endDate are required",
        success: false,
        errorCode: "MISSING_DATE_RANGE",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }
    const availableParams: IGetSlotsParams = {
      vetId,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      limit,
      page,
      status: status as SlotStatus,
      search: searchQuery,
      sortOrder,
      sortBy,
    };
    // console.log("availableParams", availableParams);
    const response = await getSlotsByVetId(availableParams);
    // console.log("Response from getSlotsByVetId:", response);
    const sensResponseData: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Available slots fetched successfully",
      ...response,
    };
    return sendResponse(sensResponseData);
  } catch (error) {
    console.log("Error fetching available slots:", error);
    const errResp: IErrorResponse = {
      message: "Internal Server Error",
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
