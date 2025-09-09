import { AppointmentSlot, SlotStatus } from "@/models";
import moment from "moment";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface DeletePeriodRequest {
  vetId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { vetId, date, startTime, endTime, timezone }: DeletePeriodRequest =
      await req.json();
    // Validate required fields
    if (!vetId || !date || !startTime || !endTime || !timezone) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: vetId, date, startTime, endTime, timezone",
        },
        { status: 400 }
      );
    }

    // Validate date format
    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: "Invalid time format. Expected HH:mm" },
        { status: 400 }
      );
    }

    // Validate time period
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    // Convert date to proper format for database query
    const targetDate = moment(date).startOf("day").toDate();

    // Build query to find slots in the specified period
    const query = {
      vetId: new Types.ObjectId(vetId),
      date: targetDate,
      timezone: timezone,
      startTime: { $gte: startTime },
      endTime: { $lte: endTime },
      // Only delete available and disabled slots, preserve booked slots
      status: { $in: [SlotStatus.AVAILABLE, SlotStatus.DISABLED] },
    };

    // Find slots that will be deleted
    const slotsToDelete = await AppointmentSlot.find(query);

    if (slotsToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No slots found for the specified period",
        deletedCount: 0,
      });
    }

    // Check if any slots are booked (should not be deleted)
    const bookedSlots = slotsToDelete.filter(
      (slot) => slot.status === SlotStatus.BOOKED
    );
    if (bookedSlots.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete period: ${bookedSlots.length} slots are already booked`,
          bookedSlotsCount: bookedSlots.length,
        },
        { status: 409 }
      );
    }

    // Delete the slots
    const deleteResult = await AppointmentSlot.deleteMany(query);
    console.log("deleteResult", deleteResult);
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} slots for period ${startTime}-${endTime} on ${date}`,
      deletedCount: deleteResult.deletedCount,
      period: {
        date,
        startTime,
        endTime,
        timezone,
      },
    });
  } catch (error: any) {
    console.error("Error deleting period:", error);
    return NextResponse.json(
      {
        error: "Failed to delete period",
        details: error.message,
      },
      { status: 500 }
    );
  }
};
