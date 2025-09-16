import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { AppointmentModel } from "@/models/Appointment";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import moment from "moment-timezone";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface VetSlotStatistics {
  // Basic counts
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  disabledSlots: number;

  // Time statistics
  totalHours: number;
  availableHours: number;
  bookedHours: number;
  disabledHours: number;

  // Period statistics
  totalPeriods: number;
  averagePeriodDuration: number; // in hours

  // Daily breakdown
  dailyStats: Array<{
    date: string;
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    disabledSlots: number;
    totalHours: number;
    periods: number;
    availableTimes: Array<{
      from: string;
      to: string;
    }>;
  }>;

  // Utilization metrics
  utilizationRate: number; // percentage of booked slots
  availabilityRate: number; // percentage of available slots

  // Time range analysis
  earliestSlotTime: string;
  latestSlotTime: string;
  mostActiveHour: string;

  // Revenue potential (if consultation fee is available)
  potentialRevenue: number;
  actualRevenue: number;

  // Recent activity
  slotsCreatedToday: number;
  slotsBookedToday: number;

  // Timezone info
  timezone: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const vetId = searchParams.get("vetId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validation check
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

    // Check if veterinarian exists
    const veterinarian = await Veterinarian.findOne({
      _id: vetId,
      isDeleted: false,
      isActive: true,
    });

    if (!veterinarian) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found or inactive",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }

    const vetTimezone = veterinarian.timezone || "UTC";
    const start = moment.tz(startDate, vetTimezone).startOf("day").toDate();
    const end = moment.tz(endDate, vetTimezone).endOf("day").toDate();

    // Fetch slots in range
    const slots = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: { $gte: start, $lte: end },
    }).lean();

    // Fetch appointments for revenue calculation
    const appointments = await AppointmentModel.find({
      appointmentDate: { $gte: start, $lte: end },
      isDeleted: false,
    }).lean();

    // Helper functions
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map((v) => parseInt(v, 10));
      return h * 60 + (m || 0);
    };

    const minutesToHours = (minutes: number) => minutes / 60;

    // Initialize counters
    let totalSlots = 0;
    let availableSlots = 0;
    let bookedSlots = 0;
    let disabledSlots = 0;
    let totalHours = 0;
    let availableHours = 0;
    let bookedHours = 0;
    let disabledHours = 0;
    let totalPeriods = 0;
    let totalPeriodDuration = 0;

    const slotsByDate: Record<string, any[]> = {};
    const dailyStats: VetSlotStatistics["dailyStats"] = [];
    const hourCounts: Record<number, number> = {};
    let earliestTime = 24 * 60; // Latest possible time in minutes
    let latestTime = 0; // Earliest possible time in minutes

    // Process slots
    for (const slot of slots) {
      const dateKey = moment(slot.date).format("YYYY-MM-DD");
      if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
      slotsByDate[dateKey].push(slot);

      totalSlots++;

      const slotDuration = toMinutes(slot.endTime) - toMinutes(slot.startTime);
      const slotHours = minutesToHours(slotDuration);
      totalHours += slotHours;

      // Track hour activity
      const startHour = Math.floor(toMinutes(slot.startTime) / 60);
      hourCounts[startHour] = (hourCounts[startHour] || 0) + 1;

      // Track time range
      const startMinutes = toMinutes(slot.startTime);
      const endMinutes = toMinutes(slot.endTime);
      if (startMinutes < earliestTime) earliestTime = startMinutes;
      if (endMinutes > latestTime) latestTime = endMinutes;

      switch (slot.status) {
        case SlotStatus.AVAILABLE:
          availableSlots++;
          availableHours += slotHours;
          break;
        case SlotStatus.BOOKED:
          bookedSlots++;
          bookedHours += slotHours;
          break;
        case SlotStatus.DISABLED:
          disabledSlots++;
          disabledHours += slotHours;
          break;
      }
    }

    // Process daily statistics
    const sortedDates = Object.keys(slotsByDate).sort();
    for (const dateKey of sortedDates) {
      const daySlots = slotsByDate[dateKey];
      daySlots.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

      let dayTotalSlots = 0;
      let dayAvailableSlots = 0;
      let dayBookedSlots = 0;
      let dayDisabledSlots = 0;
      let dayTotalHours = 0;
      let dayPeriods = 0;
      const dayAvailableTimes: Array<{ from: string; to: string }> = [];

      // Group slots into periods (contiguous slots with gap <= 50 minutes)
      let currentPeriod: any[] = [];
      for (let i = 0; i < daySlots.length; i++) {
        const slot = daySlots[i];
        const slotDuration =
          toMinutes(slot.endTime) - toMinutes(slot.startTime);
        const slotHours = minutesToHours(slotDuration);

        dayTotalSlots++;
        dayTotalHours += slotHours;

        switch (slot.status) {
          case SlotStatus.AVAILABLE:
            dayAvailableSlots++;
            break;
          case SlotStatus.BOOKED:
            dayBookedSlots++;
            break;
          case SlotStatus.DISABLED:
            dayDisabledSlots++;
            break;
        }

        if (currentPeriod.length === 0) {
          currentPeriod.push(slot);
        } else {
          const lastSlot = currentPeriod[currentPeriod.length - 1];
          const gap = toMinutes(slot.startTime) - toMinutes(lastSlot.endTime);

          if (gap <= 50) {
            currentPeriod.push(slot);
          } else {
            // End current period and start new one
            dayPeriods++;
            if (currentPeriod.some((s) => s.status === SlotStatus.AVAILABLE)) {
              dayAvailableTimes.push({
                from: currentPeriod[0].startTime,
                to: currentPeriod[currentPeriod.length - 1].endTime,
              });
            }
            currentPeriod = [slot];
          }
        }
      }

      // Don't forget the last period
      if (currentPeriod.length > 0) {
        dayPeriods++;
        if (currentPeriod.some((s) => s.status === SlotStatus.AVAILABLE)) {
          dayAvailableTimes.push({
            from: currentPeriod[0].startTime,
            to: currentPeriod[currentPeriod.length - 1].endTime,
          });
        }
      }

      dailyStats.push({
        date: dateKey,
        totalSlots: dayTotalSlots,
        availableSlots: dayAvailableSlots,
        bookedSlots: dayBookedSlots,
        disabledSlots: dayDisabledSlots,
        totalHours: Number(dayTotalHours.toFixed(2)),
        periods: dayPeriods,
        availableTimes: dayAvailableTimes,
      });

      totalPeriods += dayPeriods;
    }

    // Calculate period statistics
    const averagePeriodDuration =
      totalPeriods > 0 ? totalHours / totalPeriods : 0;

    // Find most active hour
    const mostActiveHour =
      Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "0";
    const mostActiveHourFormatted = `${mostActiveHour.padStart(2, "0")}:00`;

    // Calculate utilization rates
    const utilizationRate =
      totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
    const availabilityRate =
      totalSlots > 0 ? (availableSlots / totalSlots) * 100 : 0;

    // Calculate revenue
    const consultationFee = veterinarian.consultationFee || 0;
    const potentialRevenue = bookedSlots * consultationFee;
    const actualRevenue = appointments.reduce(
      (sum, apt) => sum + (apt.feeUSD || 0),
      0
    );

    // Get today's stats
    const today = moment().format("YYYY-MM-DD");
    const todaySlots = slotsByDate[today] || [];
    const slotsCreatedToday = todaySlots.length;
    const slotsBookedToday = todaySlots.filter(
      (s) => s.status === SlotStatus.BOOKED
    ).length;

    // Format time strings
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
    };

    const statistics: VetSlotStatistics = {
      // Basic counts
      totalSlots,
      availableSlots,
      bookedSlots,
      disabledSlots,

      // Time statistics
      totalHours: Number(totalHours.toFixed(2)),
      availableHours: Number(availableHours.toFixed(2)),
      bookedHours: Number(bookedHours.toFixed(2)),
      disabledHours: Number(disabledHours.toFixed(2)),

      // Period statistics
      totalPeriods,
      averagePeriodDuration: Number(averagePeriodDuration.toFixed(2)),

      // Daily breakdown
      dailyStats,

      // Utilization metrics
      utilizationRate: Number(utilizationRate.toFixed(2)),
      availabilityRate: Number(availabilityRate.toFixed(2)),

      // Time range analysis
      earliestSlotTime:
        earliestTime < 24 * 60 ? formatTime(earliestTime) : "N/A",
      latestSlotTime: latestTime > 0 ? formatTime(latestTime) : "N/A",
      mostActiveHour: mostActiveHourFormatted,

      // Revenue potential
      potentialRevenue: Number(potentialRevenue.toFixed(2)),
      actualRevenue: Number(actualRevenue.toFixed(2)),

      // Recent activity
      slotsCreatedToday,
      slotsBookedToday,

      // Timezone info
      timezone: vetTimezone,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };

    const response: ISendResponse<VetSlotStatistics> = {
      statusCode: 200,
      success: true,
      message: "Veterinarian slot statistics retrieved successfully",
      data: statistics,
    };

    return sendResponse(response);
  } catch (error: any) {
    console.error("Error in vet-slot-statistics GET:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: error?.message || "Internal Server Error",
      errorCode: "VET_SLOT_STATISTICS_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }
};
