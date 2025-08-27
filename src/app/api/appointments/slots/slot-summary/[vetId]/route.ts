import { authOptions } from "@/lib/auth";
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
    console.log("HIT VET ID");
    await connectToDatabase();
    const { vetId } = await params;
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 1000;
    if (!vetId || !new Types.ObjectId(vetId)) {
      throw Error("Invalid vetId");
    }
    const isVetExist = await Veterinarian.findOne({
      _id: vetId,
      isDeleted: false,
      isActive: true,
    });
    if (!isVetExist) {
      throw Error("Veterinarian not found");
      // return throwAppError(errResp, 404);
    }
    if (!startDate || !endDate) {
      // return throwAppError(errResp, 400);
      throw Error("Invalid date range");
    }

    const paramsFn: IGetSlotsParams = {
      vetId,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate),
      } as any,
      status: SlotStatus.ALL,
      limit,
      page,
    };
    const response = await getSlotsByVetId(paramsFn);
    const slotPeriods = groupSlotsIntoPeriods(response.data);
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Veterinarian slots retrieved successfully",
      data: slotPeriods,
    };

    return sendResponse(responseFormat);
  } catch (error: any) {
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Failed to retrieve veterinarian slots",
      errorCode: "FAILED_TO_RETRIEVE_SLOTS",
      errors: null,
    };
    return throwAppError(errResp);
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
  } catch (error) {
    const errResp: IErrorResponse = {
      success: false,
      message: "Failed to update slot status",
      errorCode: "FAILED_TO_UPDATE_SLOT_STATUS",
      errors: null,
    };
    return throwAppError(errResp);
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
    console.log("status", status);
    console.log("slotIds", slotIds);
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
    const errResp: IErrorResponse = {
      success: false,
      message: error.message || "Failed to update slot status",
      errorCode: "FAILED_TO_UPDATE_SLOT_STATUS",
      errors: null,
    };
    return throwAppError(errResp);
  }
};
