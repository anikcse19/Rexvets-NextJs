import {
  AppointmentSlot,
  IAvailabilitySlot,
  SlotStatus,
} from "@/models/AppointmentSlot";
import moment from "moment";
import { Types } from "mongoose";

export interface IGetVetSlotPeriodsParams {
  vetId: string;
  dateRange: { start: Date; end: Date };
}

export interface ISlotPeriod {
  start: Date;
  end: Date;
  durationHours: number;
  slotCount: number;
  availableSlots: number;
  bookedSlots: number;
}

export interface IPeriods {
  date: {
    start: Date;
    end: Date;
  };
  totalDays: number;
  periods: ISlotPeriod[];
  totalPeriods: number;
  totalSlots: number;
  totalHours: number;
}

export interface IGetVetSlotPeriodsResponse {
  periods: IPeriods[];
  summary: {
    totalDays: number;
    daysWithSlots: number;
    totalPeriods: number;
    totalSlots: number;
    totalHours: number;
    averagePeriodsPerDay: number;
    utilizationRate: number;
  };
}

export const getVetSlotPeriods = async ({
  vetId,
  dateRange,
}: IGetVetSlotPeriodsParams): Promise<IGetVetSlotPeriodsResponse> => {
  try {
    // Validate input
    if (!Types.ObjectId.isValid(vetId)) {
      throw new Error("Invalid vetId");
    }
    if (dateRange.start > dateRange.end) {
      throw new Error("Invalid date range: start date must be before end date");
    }

    // Fetch slots within the date range
    const slots = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: moment(dateRange.start).startOf("day").toDate(),
        $lte: moment(dateRange.end).endOf("day").toDate(),
      },
    }).sort({ date: 1, startTime: 1 });

    // Initialize response structure
    const periodsByDate: { [key: string]: IPeriods } = {};
    let totalDays = 0;
    let daysWithSlots = 0;
    let totalPeriods = 0;
    let totalSlots = 0;
    let totalHours = 0;
    let totalBookedSlots = 0;

    // Group slots by date
    const slotsByDate: { [key: string]: IAvailabilitySlot[] } = {};
    slots.forEach((slot) => {
      const dateKey = moment(slot.date).format("YYYY-MM-DD");
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push(slot);
    });

    // Define example periods (10:00-16:00, 17:00-22:00) as per requirement
    const dailyPeriods = [
      { startTime: "10:00", endTime: "16:00" },
      { startTime: "17:00", endTime: "22:00" },
    ];

    // Process each date
    for (const dateKey in slotsByDate) {
      const dateSlots = slotsByDate[dateKey];
      const periods: ISlotPeriod[] = [];

      // For each predefined period, aggregate slots
      for (const period of dailyPeriods) {
        const periodStart = moment(
          `${dateKey} ${period.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const periodEnd = moment(
          `${dateKey} ${period.endTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const durationHours = periodEnd.diff(periodStart, "hours", true);

        // Find slots within this period
        const slotsInPeriod = dateSlots.filter((slot) => {
          const slotStart = moment(
            `${dateKey} ${slot.startTime}`,
            "YYYY-MM-DD HH:mm"
          );
          const slotEnd = moment(
            `${dateKey} ${slot.endTime}`,
            "YYYY-MM-DD HH:mm"
          );
          return (
            slotStart.isSameOrAfter(periodStart) &&
            slotEnd.isSameOrBefore(periodEnd)
          );
        });

        if (slotsInPeriod.length === 0) continue; // Skip empty periods

        const slotCount = slotsInPeriod.length;
        const availableSlots = slotsInPeriod.filter(
          (slot) => slot.status === SlotStatus.AVAILABLE
        ).length;
        const bookedSlots = slotsInPeriod.filter(
          (slot) => slot.status === SlotStatus.BOOKED
        ).length;

        periods.push({
          start: periodStart.toDate(),
          end: periodEnd.toDate(),
          durationHours,
          slotCount,
          availableSlots,
          bookedSlots,
        });
      }

      if (periods.length === 0) continue; // Skip days with no valid periods

      // Calculate periods metrics
      const dateStart = moment(dateKey).startOf("day").toDate();
      const dateEnd = moment(dateKey).endOf("day").toDate();
      const dateTotalSlots = dateSlots.length;
      const dateTotalHours = periods.reduce(
        (sum, p) => sum + p.durationHours,
        0
      );

      periodsByDate[dateKey] = {
        date: { start: dateStart, end: dateEnd },
        totalDays: 1,
        periods,
        totalPeriods: periods.length,
        totalSlots: dateTotalSlots,
        totalHours: dateTotalHours,
      };

      // Update summary metrics
      daysWithSlots += 1;
      totalPeriods += periods.length;
      totalSlots += dateTotalSlots;
      totalHours += dateTotalHours;
      totalBookedSlots += periods.reduce((sum, p) => sum + p.bookedSlots, 0);
    }

    // Calculate total days in range
    totalDays = moment(dateRange.end).diff(moment(dateRange.start), "days") + 1;

    // Prepare response
    const response: IGetVetSlotPeriodsResponse = {
      periods: Object.values(periodsByDate),
      summary: {
        totalDays,
        daysWithSlots,
        totalPeriods,
        totalSlots,
        totalHours,
        averagePeriodsPerDay: daysWithSlots ? totalPeriods / daysWithSlots : 0,
        utilizationRate: totalSlots ? totalBookedSlots / totalSlots : 0,
      },
    };

    return response;
  } catch (error: any) {
    console.error("Error fetching vet slot periods:", error);
    throw new Error(`Failed to fetch vet slot periods: ${error.message}`);
  }
};
