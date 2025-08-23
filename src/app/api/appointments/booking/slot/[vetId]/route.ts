import { connectToDatabase } from "@/lib/mongoose";
import {
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { AppointmentSlot } from "@/models/AppointmentSlot";
import { endOfDay, startOfDay } from "date-fns";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vetId: string }> }
) {
  try {
    await connectToDatabase();
    console.log("date", new Date());
    const { vetId } = await params;
    const { searchParams } = new URL(req.url);

    // Validate vetId
    if (!mongoose.Types.ObjectId.isValid(vetId)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid vetId",
          errorCode: "INVALID_VET_ID",
          errors: null,
        },
        500
      );
    }

    // Filters
    let date = searchParams.get("date"); // optional
    const search = searchParams.get("search"); // optional

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Use today if date is not provided
    const filterDate = date ? new Date(date) : new Date();
    const start = startOfDay(filterDate);
    const end = endOfDay(filterDate);

    // Build MongoDB query
    const query: any = {
      vetId: new mongoose.Types.ObjectId(vetId),
      date: { $gte: start, $lte: end },
    };

    if (search) {
      query.notes = { $regex: search, $options: "i" };
    }

    const total = await AppointmentSlot.countDocuments(query);
    const slots = await AppointmentSlot.find(query)
      // .populate("vetId")
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);

    const response: ISendResponse<any[]> = {
      success: true,
      data: slots,
      statusCode: 200,
      message: "Appointment slots retrieved successfully",
      meta: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    return sendResponse(response);
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
