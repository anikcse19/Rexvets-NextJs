import { connectToDatabase } from "@/lib/mongoose";
import { formatDateTime } from "@/lib/utils";
import {
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { SlotStatus } from "@/models/AppointmentSlot";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { getVeterinarianSlots } from "../slot.util";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) {
  try {
    await connectToDatabase();
    // const timeZone: string = "Asia/Dhaka";
    const { vetId } = await params;
    const { searchParams } = new URL(req.url);
    if (!mongoose.Types.ObjectId.isValid(vetId)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid vetId",
          errorCode: "INVALID_VET_ID",
          errors: null,
        },
        400
      );
    }
    const status = searchParams.get("status") || "all";
    console.log("STATUS", status);
    const formattedDate = formatDateTime(
      searchParams.get("date") || new Date().toUTCString()
    ); // Fix: Pass string directly
    const response = await getVeterinarianSlots(vetId, {
      date: formattedDate as any,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
      status: status as SlotStatus | "all",
      timezone: searchParams.get("timezone") || "UTC",
    });
    console.log("response.slots", response.slots.length);
    const responseFormat: ISendResponse<any[]> = {
      success: true,
      data: response.slots,
      statusCode: 200,
      message: response.slots.length
        ? "Appointment slots retrieved successfully"
        : "No appointment slots found for the specified date range and vetId",
      meta: {
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: response.meta.totalPages,
      },
    };
    return sendResponse(responseFormat);
  } catch (error: any) {
    console.error("GET /appointment-slots/[vetId] error:", error);
    return throwAppError(
      {
        success: false,
        message: error.message || "Internal Server Error",
        errorCode: "INTERNAL_SERVER_ERROR",
        errors: null,
      },
      500
    );
  }
}
