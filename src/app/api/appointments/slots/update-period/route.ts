import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import moment from "moment";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

interface IUpdateExistingPeriodRequest {
  vetId: string;
  slotIds: string[];
  startTime: string; // HH:mm
  endTime: string; // HH:mm (can be 24:00)
  slotDuration?: number; // minutes
  bufferBetweenSlots?: number; // minutes
}

export const PUT = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const body = (await req.json()) as IUpdateExistingPeriodRequest;
    const {
      vetId,
      slotIds,
      startTime,
      endTime,
      slotDuration = 30,
      bufferBetweenSlots = 0,
    } = body || {};

    if (!vetId || !Array.isArray(slotIds) || slotIds.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "vetId and slotIds are required",
        }),
        { status: 400 }
      );
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !(timeRegex.test(endTime) || endTime === "24:00")) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Invalid time format. Expected HH:mm, got start: ${startTime}, end: ${endTime}`,
        }),
        { status: 400 }
      );
    }

    // Fetch target slots (must belong to vet)
    const objectIds = slotIds
      .filter(Boolean)
      .map((id) => {
        try {
          return new Types.ObjectId(id);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Types.ObjectId[];

    const targetSlots = await AppointmentSlot.find({
      _id: { $in: objectIds },
      vetId: new Types.ObjectId(vetId),
    }).lean();

    if (targetSlots.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No matching slots found" }),
        { status: 404 }
      );
    }

    // Group by date (day) and timezone to update per day
    type GroupKey = string; // `${YYYY-MM-DD}__${timezone}`
    const groups = new Map<GroupKey, { date: Date; timezone: string; slotIds: Types.ObjectId[] }>();

    targetSlots.forEach((s: any) => {
      const key = `${moment(s.date).format("YYYY-MM-DD")}__${s.timezone}`;
      const prev = groups.get(key);
      if (prev) {
        prev.slotIds.push(s._id);
      } else {
        groups.set(key, { date: s.date, timezone: s.timezone, slotIds: [s._id] });
      }
    });

    // Prepare generation helpers
    const computeNewSlotsForWindow = (
      date: Date,
      timezone: string
    ): Array<{ startTime: string; endTime: string }> => {
      const slots: Array<{ startTime: string; endTime: string }> = [];
      const periodStart = moment(`2000-01-01 ${startTime}`, "YYYY-MM-DD HH:mm");
      let endStr = endTime;
      let periodEndMoment = moment(`2000-01-01 ${endStr}`, "YYYY-MM-DD HH:mm");
      if (endTime === "24:00") {
        endStr = "00:00";
        periodEndMoment = moment("2000-01-02 00:00", "YYYY-MM-DD HH:mm");
      }
      if (periodEndMoment.isSameOrBefore(periodStart)) {
        throw new Error("Invalid time period: end must be after start");
      }

      let cursor = periodStart.clone();
      const endBoundary = periodEndMoment.clone();
      while (cursor.clone().add(slotDuration, "minutes").isSameOrBefore(endBoundary)) {
        const s = cursor.format("HH:mm");
        const e = cursor.clone().add(slotDuration, "minutes").format("HH:mm");
        slots.push({ startTime: s, endTime: e });
        cursor = cursor.add(slotDuration + bufferBetweenSlots, "minutes");
      }
      return slots;
    };

    // Transaction per all groups
    const session = await AppointmentSlot.startSession();
    session.startTransaction();

    try {
      let createdTotal = 0;
      let deletedAvailable = 0;
      let deletedDisabled = 0;
      let preservedBooked = 0;

      for (const [, group] of groups) {
        const { date, timezone } = group;

        // Fetch booked slots for this vet/day/timezone (preserve)
        const dayStart = moment(date).startOf("day").toDate();
        const dayEnd = moment(date).endOf("day").toDate();
        const booked = await AppointmentSlot.find({
          vetId: new Types.ObjectId(vetId),
          date: { $gte: dayStart, $lte: dayEnd },
          timezone,
          status: SlotStatus.BOOKED,
        })
          .session(session)
          .lean();
        preservedBooked += booked.length;

        // Delete only available and disabled slots for that day (for this vet/timezone)
        const delRes = await AppointmentSlot.deleteMany(
          {
            vetId: new Types.ObjectId(vetId),
            date: { $gte: dayStart, $lte: dayEnd },
            timezone,
            status: { $in: [SlotStatus.AVAILABLE, SlotStatus.DISABLED] },
          },
          { session }
        );
        // Track deletion counts approximately (Mongo returns total deleted)
        // We cannot distinguish available vs disabled in one call without extra queries; skip detailed split
        deletedAvailable += delRes.deletedCount || 0;

        // Generate new slots and remove those conflicting with booked ones
        const newSlots = computeNewSlotsForWindow(date, timezone).filter((candidate) => {
          const cStart = moment(`2000-01-01 ${candidate.startTime}`, "YYYY-MM-DD HH:mm");
          const cEnd = moment(`2000-01-01 ${candidate.endTime}`, "YYYY-MM-DD HH:mm");
          return !booked.some((b) => {
            const bStart = moment(`2000-01-01 ${b.startTime}`, "YYYY-MM-DD HH:mm");
            const bEnd = moment(`2000-01-01 ${b.endTime}`, "YYYY-MM-DD HH:mm");
            return cStart.isBefore(bEnd) && cEnd.isAfter(bStart);
          });
        });

        if (newSlots.length > 0) {
          const docs = newSlots.map((ns) => ({
            vetId: new Types.ObjectId(vetId),
            date: moment(date).startOf("day").toDate(),
            startTime: ns.startTime,
            endTime: ns.endTime,
            timezone,
            status: SlotStatus.AVAILABLE,
            createdAt: new Date(),
          }));
          const inserted = await AppointmentSlot.insertMany(docs, { session });
          createdTotal += inserted.length;
        }
      }

      await session.commitTransaction();
      session.endSession();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Existing period updated successfully",
          summary: {
            preservedBooked,
            deletedAvailableOrDisabled: deletedAvailable,
            createdNewSlots: createdTotal,
          },
        }),
        { status: 200 }
      );
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error: any) {
    console.error("[UPDATE EXISTING PERIOD]", error);
    return new Response(
      JSON.stringify({ success: false, message: error?.message || "Failed to update existing period" }),
      { status: 500 }
    );
  }
};


