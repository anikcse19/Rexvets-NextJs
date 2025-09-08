import { connectToDatabase } from "@/lib/mongoose";
import {
    IErrorResponse,
    ISendResponse,
    sendResponse,
    throwAppError,
} from "@/lib/utils/send.response";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import moment from "moment-timezone";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

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

    const vet = await Veterinarian.findById(vetId).select(
      "timezone noticePeriod"
    );
    if (!vet) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }

    const tz = vet.timezone || "UTC";
    const notice = vet.noticePeriod ?? 0;

    // Build an aggregation to find the first eligible upcoming slot in vet's timezone
    const now = moment.tz(tz);
    const startWindowUtc = now.clone().startOf("day").utc().toDate();
    const endWindowUtc = now.clone().add(90, "day").endOf("day").utc().toDate();

    const results = await AppointmentSlot.aggregate([
      {
        $match: {
          vetId: new Types.ObjectId(vetId),
          status: SlotStatus.AVAILABLE,
          date: { $gte: startWindowUtc, $lte: endWindowUtc },
        },
      },
      { $set: { tz: tz } },
      {
        $addFields: {
          slotDateStr: {
            $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: "$tz" },
          },
          // Construct slot start datetime in vet's timezone
          startDateTime: {
            $dateFromString: {
              dateString: { $concat: ["$slotDateStr", "T", "$startTime", ":00"] },
              timezone: "$tz",
            },
          },
        },
      },
      {
        $addFields: {
          minutesFromNow: {
            $divide: [{ $subtract: ["$startDateTime", now.toDate()] }, 60000],
          },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $gte: ["$startDateTime", new Date()] },
              { $gte: ["$minutesFromNow", notice] },
            ],
          },
        },
      },
      { $limit: 1 },
      { $project: { _id: 1 } },
    ]);

    const hasAvailability = results.length > 0;

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


