import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { AppointmentSlot } from "@/models/AppointmentSlot";
import { endOfDay, startOfDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    // Filters
    let date = searchParams.get("date"); // optional, format: 'YYYY-MM-DD'
    const search = searchParams.get("search"); // optional, search in notes

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Use today if date is undefined
    const filterDate = date ? new Date(date) : new Date();
    const start = startOfDay(filterDate);
    const end = endOfDay(filterDate);

    // Build MongoDB query
    const query: any = {
      date: { $gte: start, $lte: end },
    };

    if (search) {
      query.notes = { $regex: search, $options: "i" };
    }

    const total = await AppointmentSlot.countDocuments(query);
    const slots = await AppointmentSlot.find(query)
      //   .populate("vetId")
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);
    const response: any = {
      success: true,
      data: slots,
      statusCode: 200,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    return sendResponse(response);

    // return NextResponse.json({
    //   success: true,
    //   data: slots,
    //   meta: {
    //     total,
    //     page,
    //     limit,
    //     totalPages: Math.ceil(total / limit),
    //   },
    // });
  } catch (error: any) {
    console.error("GET /appointment-slots error:", error);
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
