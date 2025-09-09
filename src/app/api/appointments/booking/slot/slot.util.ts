import {
  AppointmentSlot,
  IAvailabilitySlot,
  SlotStatus,
} from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import moment from "moment-timezone";
import { Types } from "mongoose";

export interface GetVetSlotsOptions {
  date?: Date; // Specific date
  page?: number; // Page number for pagination
  limit?: number; // Items per page
  status?: SlotStatus | "all"; // Filter by slot status
  timezone?: string; // Timezone for date filtering
}

export interface GetVetSlotsResult {
  slots: IAvailabilitySlot[];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getVeterinarianSlots(
  vetId: string,
  options: GetVetSlotsOptions = {}
): Promise<GetVetSlotsResult> {
  try {
    const {
      date,
      page = 1,
      limit = 20,
      status = "all",
      timezone = "UTC",
    } = options;

    // Validate pagination
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.max(1, Math.min(limit, 100));
    const skip = (validatedPage - 1) * validatedLimit;

    // Convert date to UTC range. Support Date or YYYY-MM-DD string
    const targetDate = moment.isDate(date)
      ? moment.tz(date as any, timezone)
      : moment.tz((date as any) || undefined, timezone);
    const startOfDay = targetDate.clone().startOf("day").utc().toDate();
    const endOfDay = targetDate.clone().endOf("day").utc().toDate();

    // Build query
    const query: any = {
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };
    console.log("ST", status);
    if (status !== "all") {
      query.status = status;
    }

    const veterinarian = await Veterinarian.findById(vetId)
      .select("name timezone")
      .lean();

    if (!veterinarian) {
      throw new Error("Veterinarian not found");
    }

    // Query slots
    const totalCount = await AppointmentSlot.countDocuments(query);
    const slots = await AppointmentSlot.find(query)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(validatedLimit)
      .lean();

    const totalPages = Math.ceil(totalCount / validatedLimit);

    return {
      slots: slots as IAvailabilitySlot[],
      meta: {
        page: validatedPage,
        limit: validatedLimit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error getting veterinarian slots:", error);
    throw new Error("Failed to fetch veterinarian slots");
  }
}
interface IGetSlotsByNoticePeriodAndDateRangeByVetId {
  vetId: string;
  noticePeriod: number; // in minutes
  startDate: Date;
  endDate: Date;
  timezone: string;
}

export const getSlotsByNoticePeriodAndDateRangeByVetId = async (
  params: IGetSlotsByNoticePeriodAndDateRangeByVetId
): Promise<IAvailabilitySlot[]> => {
  const { vetId, noticePeriod, startDate, endDate, timezone } = params;

  try {
    // Get current time in the provided timezone and compute helpers
    const now = moment().tz(timezone);
    const todayStartUtc = now.clone().startOf("day").utc().toDate();
    const currentTime = now.format("HH:mm");

    // console.log(
    //   `[SLOT FILTERING] Current time in ${timezone}: ${now.format(
    //     "YYYY-MM-DD HH:mm:ss"
    //   )}`
    // );
    // console.log(`[SLOT FILTERING] Notice period: ${noticePeriod} minutes`);
    // console.log(`[SLOT FILTERING] Current time string: ${currentTime}`);

    // // Example scenario: Notice period = 15 minutes
    // // If current time is 8:46 AM and slot is at 9:00 AM:
    // // Time difference = 14 minutes (9:00 - 8:46 = 14 minutes)
    // // Since 14 < 15 (notice period), this slot should be FILTERED OUT
    // console.log(`[SLOT FILTERING] Example: If current time is 8:46 and slot is 9:00, time diff = 14min, notice period = ${noticePeriod}min, so slot should be FILTERED OUT`);

    // Convert input dates to start/end of day in the provided timezone, then to UTC
    const startDateUtc = moment
      .tz(startDate, timezone)
      .startOf("day")
      .utc()
      .toDate();
    const endDateUtc = moment.tz(endDate, timezone).endOf("day").utc().toDate();

    // Use MongoDB aggregation pipeline like veterinarian API
    const pipeline: any[] = [
      {
        $match: {
          vetId: new Types.ObjectId(vetId),
          status: SlotStatus.AVAILABLE,
          date: {
            $gte: startDateUtc,
            $lte: endDateUtc,
          },
        },
      },
      {
        $addFields: {
          // Local date string for the slot, and current time for comparisons
          slotDateStr: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: timezone,
            },
          },
          currentTimeStr: currentTime,
        },
      },
      {
        $addFields: {
          // Calculate time difference in minutes for notice period filtering
          slotDateTime: {
            $dateFromString: {
              dateString: {
                $concat: ["$slotDateStr", " ", "$startTime"],
              },
              timezone: timezone,
            },
          },
        },
      },
      {
        $addFields: {
          // Calculate minutes from now based on local slot datetime in timezone
          minutesFromNow: {
            $divide: [
              {
                $subtract: ["$slotDateTime", now.toDate()],
              },
              60000, // Convert milliseconds to minutes
            ],
          },
        },
      },
      {
        $match: {
          // Keep only future slots that also respect the notice period
          minutesFromNow: { $gte: noticePeriod },
        },
      },
      {
        $sort: {
          date: 1,
          startTime: 1,
        },
      },
      {
        $project: {
          _id: 1,
          vetId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          timezone: 1,
          status: 1,
          notes: 1,
          createdAt: 1,
          // Include computed fields for debugging
          minutesFromNow: 1,
        },
      },
    ];

    // First, get all slots before filtering to show what gets filtered out
    const allSlotsBeforeFiltering = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      status: SlotStatus.AVAILABLE,
      date: {
        $gte: startDateUtc,
        $lte: endDateUtc,
      },
    }).sort({ date: 1, startTime: 1 });

    // Execute aggregation pipeline
    const filteredSlots = await AppointmentSlot.aggregate(pipeline);

    return filteredSlots as IAvailabilitySlot[];
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw new Error("Failed to fetch available slots");
  }
};
