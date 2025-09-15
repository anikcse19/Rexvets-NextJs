import { connectToDatabase } from "@/lib/mongoose";
import { IErrorResponse, ISendResponse, sendResponse, throwAppError } from "@/lib/utils/send.response";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import moment from "moment-timezone";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const vetId = searchParams.get("vetId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!vetId || !Types.ObjectId.isValid(vetId)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid veterinarian ID",
        errorCode: "INVALID_VET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    if (!startDate || !endDate) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Start date and end date are required",
        errorCode: "MISSING_DATE_RANGE",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();

    // Fetch slots in range
    const slots = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: { $gte: start, $lte: end },
    }).lean();

    // Aggregate stats
    let available = 0;
    let booked = 0;
    let disabled = 0;
    let totalHours = 0;
    const periodsPerDay: Record<string, number> = {};

    // Helper to parse HH:mm and compute duration in hours
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map((v) => parseInt(v, 10));
      return h * 60 + (m || 0);
    };

    // We will consider contiguous slots as part of a period; a gap > 50 mins splits a period
    const slotsByDate: Record<string, any[]> = {};
    for (const s of slots) {
      const key = moment(s.date).format("YYYY-MM-DD");
      if (!slotsByDate[key]) slotsByDate[key] = [];
      slotsByDate[key].push(s);
      if (s.status === SlotStatus.AVAILABLE) available++;
      else if (s.status === SlotStatus.BOOKED) booked++;
      else if (s.status === SlotStatus.DISABLED) disabled++;
      // Sum slot duration hours
      if (s.startTime && s.endTime) {
        const mins = Math.max(0, toMinutes(s.endTime) - toMinutes(s.startTime));
        totalHours += mins / 60;
      }
    }

    let totalPeriods = 0;
    Object.values(slotsByDate).forEach((daySlots) => {
      daySlots.sort(
        (a: any, b: any) => toMinutes(a.startTime) - toMinutes(b.startTime)
      );
      let periods = 0;
      for (let i = 0; i < daySlots.length; i++) {
        if (i === 0) {
          periods++;
          continue;
        }
        const gap = toMinutes(daySlots[i].startTime) - toMinutes(daySlots[i - 1].endTime);
        if (gap > 50) periods++;
      }
      totalPeriods += periods;
    });

    const data = {
      availableSlots: available,
      bookedSlots: booked,
      disabledSlots: disabled,
      totalPeriods,
      totalSlotHours: Number(totalHours.toFixed(2)),
    };

    const response: ISendResponse<typeof data> = {
      statusCode: 200,
      success: true,
      message: "Veterinarian slot statistics",
      data,
    };

    return sendResponse(response);
  } catch (error: any) {
    console.error("Error in slot-stats GET:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Internal Server Error",
      errorCode: "SLOT_STATS_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};


