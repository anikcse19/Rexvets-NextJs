import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentModel } from "@/models/Appointment";
import moment from "moment-timezone";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const timezone = searchParams.get("timezone") || "UTC";

    // Get current time in the specified timezone
    const now = moment().tz(timezone);
    const today = moment().tz(timezone).startOf('day');
    const tomorrow = moment().tz(timezone).add(1, 'day').startOf('day');

    // Build base query
    let query: any = {
      isDeleted: false,
    };

    // Add date range filter if provided
    if (startDate && endDate) {
      const start = moment.tz(startDate, timezone).startOf('day').toDate();
      const end = moment.tz(endDate, timezone).endOf('day').toDate();
      
      query.appointmentDate = {
        $gte: start,
        $lte: end,
      };
    }

    // Get all appointments matching the criteria
    const appointments = await AppointmentModel.find(query).lean();

    // Calculate statistics
    const stats = {
      totalToday: 0,
      upcoming: 0,
      incomplete: 0,
      completed: 0,
    };

    appointments.forEach((appointment) => {
      const appointmentDate = moment(appointment.appointmentDate).tz(timezone);
      const appointmentDateOnly = appointmentDate.clone().startOf('day');

      // Total Today - appointments scheduled for today
      if (appointmentDateOnly.isSame(today, 'day')) {
        stats.totalToday++;
      }

      // Upcoming - appointments in the future
      if (appointmentDate.isAfter(now)) {
        stats.upcoming++;
      }

      // Incomplete - past appointments that are not completed
      if (appointmentDate.isBefore(now) && appointment.status !== "completed") {
        stats.incomplete++;
      }

      // Completed - appointments with completed status
      if (appointment.status === "completed") {
        stats.completed++;
      }
    });

    return NextResponse.json({
      success: true,
      data: stats,
      message: "Appointment statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching appointment statistics:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
