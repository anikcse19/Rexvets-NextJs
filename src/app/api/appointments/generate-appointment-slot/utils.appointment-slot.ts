import { isTimeInPast, isValidTimezone } from "@/lib/timezone";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import moment from "moment";
import { Types } from "mongoose";

export interface IGenerateAppointmentSlots {
  vetId: string;
  slotPeriods: {
    start: string; //HH:mm
    end: string; //HH:mm
  }[];
  dateRange: {
    start: Date;
    end: Date;
  };
  timezone: string; // Timezone for the appointment slots (e.g., "America/New_York")
  bufferBetweenSlots?: number;
  slotDuration?: number;
}

export const generateAppointmentSlots = async (
  data: IGenerateAppointmentSlots
) => {
  const {
    vetId,
    slotPeriods,
    dateRange,
    timezone,
    bufferBetweenSlots = 5,
    slotDuration = 30,
  } = data;

  try {
    // Validate timezone
    if (!isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }

    // Parse dates as local dates without timezone conversion
    const startDate = moment(dateRange.start).startOf("day");
    const endDate = moment(dateRange.end).endOf("day");
    console.log("start date:", startDate.format("YYYY-MM-DD"));
    console.log("end date:", endDate.format("YYYY-MM-DD"));

    // Get current date in the appointment timezone for comparison
    const currentDateInTimezone = moment.tz(timezone).startOf("day");

    // Validate date range
    if (endDate.isBefore(startDate)) {
      throw new Error("Invalid date range: end date must be after start date");
    }

    // Check if any date in the range is in the past
    if (startDate.isBefore(currentDateInTimezone)) {
      throw new Error("Cannot create slots for past dates");
    }

    // Check for existing slots for this vet in the date range and timezone
    const existingSlots = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      timezone: timezone,
    });

    // If slots already exist, return early without generating new ones
    if (existingSlots.length > 0) {
      throw new Error(
        `Appointment slots already exist for this vet between ${startDate.format(
          "YYYY-MM-DD"
        )} and ${endDate.format(
          "YYYY-MM-DD"
        )} in timezone ${timezone}. Please delete existing slots first.`
      );
    }

    const slotsToCreate: any[] = [];

    // Process each day in the date range
    const numberOfDays = endDate.diff(startDate, "days") + 1;
    for (let day = 0; day < numberOfDays; day++) {
      const currentDate = startDate.clone().add(day, "days");
      const localDate = currentDate.toDate(); // Store as local date without timezone

      // Skip if this specific day is in the past
      if (currentDate.isBefore(currentDateInTimezone)) {
        continue;
      }

      // Process each slot period for this day
      for (const period of slotPeriods) {
        // Validate time format (HH:mm)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(period.start) || !timeRegex.test(period.end)) {
          throw new Error(
            `Invalid time format. Expected HH:mm, got start: ${period.start}, end: ${period.end}`
          );
        }

        // Handle 24:00 end time (convert to next day 00:00)
        let periodEnd = period.end;
        let periodEndDate = currentDate.clone();
        if (period.end === "24:00") {
          periodEnd = "00:00";
          periodEndDate = currentDate.clone().add(1, "day");
        }

        // Validate that the period is valid
        if (periodEnd === "00:00" && period.start !== "00:00") {
          // This is valid (period spans to midnight)
        } else if (periodEnd <= period.start) {
          throw new Error(
            `Invalid time period: end time ${period.end} must be after start time ${period.start}`
          );
        }

        // Skip this period if it's already in the past (for today)
        if (
          currentDate.isSame(currentDateInTimezone, "day") &&
          isTimeInPast(period.end, currentDate.toDate(), timezone)
        ) {
          continue;
        }

        // Calculate total time needed per slot (duration + buffer)
        const totalTimePerSlot = slotDuration + bufferBetweenSlots;

        // Generate slots within this period
        let currentSlotStart = period.start;

        while (true) {
          // Calculate slot end time
          const slotStartMoment = moment(
            `2000-01-01 ${currentSlotStart}`,
            "YYYY-MM-DD HH:mm"
          );
          const slotEndMoment = slotStartMoment
            .clone()
            .add(slotDuration, "minutes");
          const currentSlotEnd = slotEndMoment.format("HH:mm");

          // If the slot would extend beyond the period end, break
          if (periodEnd !== "00:00" && currentSlotEnd > periodEnd) {
            break;
          }

          // Skip slots that are in the past (for today)
          if (
            currentDate.isSame(currentDateInTimezone, "day") &&
            isTimeInPast(currentSlotEnd, currentDate.toDate(), timezone)
          ) {
            currentSlotStart = currentSlotEnd;
            continue;
          }

          // Create slot data with local date and timezone-specific times
          const slotData = {
            vetId: new Types.ObjectId(vetId),
            date: localDate, // Store as local date without timezone
            startTime: currentSlotStart, // Store as HH:mm in appointment timezone
            endTime: currentSlotEnd, // Store as HH:mm in appointment timezone
            timezone: timezone, // Store the timezone identifier
            status: SlotStatus.AVAILABLE,
            createdAt: new Date(),
          };

          slotsToCreate.push(slotData);

          // Move to next slot start time (no buffer gap)
          currentSlotStart = currentSlotEnd;

          // If next slot start would be beyond period end, break
          if (periodEnd !== "00:00" && currentSlotStart >= periodEnd) {
            break;
          }
        }
      }
    }

    // Insert all generated slots in bulk
    if (slotsToCreate.length > 0) {
      await AppointmentSlot.insertMany(slotsToCreate);
    }

    return {
      success: true,
      message: `Generated ${
        slotsToCreate.length
      } appointment slots between ${startDate.format(
        "YYYY-MM-DD"
      )} and ${endDate.format("YYYY-MM-DD")} in timezone ${timezone}`,
      slotsCount: slotsToCreate.length,
      dateRange: {
        start: startDate.format("YYYY-MM-DD"),
        end: endDate.format("YYYY-MM-DD"),
      },
      timezone: timezone,
      slotDuration,
      bufferBetweenSlots,
    };
  } catch (error: any) {
    console.error("Error generating appointment slots:", error);
    throw new Error(`Failed to generate appointment slots: ${error.message}`);
  }
};

export interface IUpdateAppointmentSlots {
  vetId: string;
  slotPeriods: {
    start: string; //HH:mm
    end: string; //HH:mm
  }[];
  dateRange: {
    start: Date;
    end: Date;
  };
  timezone: string; // Timezone for the appointment slots
  bufferBetweenSlots?: number;
  slotDuration?: number;
}

export const updateAppointmentSlots = async (data: IUpdateAppointmentSlots) => {
  try {
    const {
      vetId,
      slotPeriods,
      dateRange,
      timezone,
      bufferBetweenSlots = 5,
      slotDuration = 30,
    } = data;

    // Validate timezone
    if (!isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }

    // Convert date range to local dates without timezone conversion
    const startDate = moment(dateRange.start).startOf("day");
    const endDate = moment(dateRange.end).startOf("day");

    // Validate date range
    if (endDate.isBefore(startDate)) {
      throw new Error("Invalid date range: end date must be after start date");
    }

    // Validate slot periods
    for (const period of slotPeriods) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(period.start) || !timeRegex.test(period.end)) {
        throw new Error(
          `Invalid time format. Expected HH:mm, got start: ${period.start}, end: ${period.end}`
        );
      }

      if (period.end <= period.start && period.end !== "24:00") {
        throw new Error(
          `Invalid time period: end time must be after start time`
        );
      }
    }

    // Get all existing slots for this vet in the date range and timezone
    const existingSlots = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      timezone: timezone,
    });

    // Separate booked and available slots
    const bookedSlots = existingSlots.filter(
      (slot) => slot.status !== SlotStatus.AVAILABLE
    );
    const availableSlots = existingSlots.filter(
      (slot) => slot.status === SlotStatus.AVAILABLE
    );

    // Calculate number of days in the range
    const numberOfDays = endDate.diff(startDate, "days") + 1;

    // Generate new available slots based on the updated configuration
    const newAvailableSlots = [];

    // Process each day in the date range
    for (let day = 0; day < numberOfDays; day++) {
      const currentDate = startDate.clone().add(day, "days");
      const localDate = currentDate.toDate();

      // Process each slot period for this day
      for (const period of slotPeriods) {
        let periodEnd = period.end;
        if (period.end === "24:00") {
          periodEnd = "00:00";
        }

        // Generate slots within this period with buffer consideration
        let currentSlotStart = period.start;

        while (true) {
          // Calculate slot end time
          const slotStartMoment = moment(
            `2000-01-01 ${currentSlotStart}`,
            "YYYY-MM-DD HH:mm"
          );
          const slotEndMoment = slotStartMoment
            .clone()
            .add(slotDuration, "minutes");
          const currentSlotEnd = slotEndMoment.format("HH:mm");

          // If the slot would extend beyond the period end, break
          if (periodEnd !== "00:00" && currentSlotEnd > periodEnd) {
            break;
          }

          // Create slot data
          const slotData = {
            vetId: new Types.ObjectId(vetId),
            date: localDate, // Store as local date without timezone
            startTime: currentSlotStart, // Store as HH:mm in appointment timezone
            endTime: currentSlotEnd, // Store as HH:mm in appointment timezone
            timezone: timezone, // Store the timezone identifier
            status: SlotStatus.AVAILABLE,
            createdAt: new Date(),
          };

          newAvailableSlots.push(slotData);

          // Move to next slot, considering buffer time
          const nextSlotStartMoment = slotEndMoment
            .clone()
            .add(bufferBetweenSlots, "minutes");
          currentSlotStart = nextSlotStartMoment.format("HH:mm");

          // If next slot start would be beyond period end, break
          if (periodEnd !== "00:00" && currentSlotStart >= periodEnd) {
            break;
          }
        }
      }
    }

    // Start a session for transaction
    const session = await AppointmentSlot.startSession();
    session.startTransaction();

    try {
      // Delete only the available slots (keep booked slots)
      if (availableSlots.length > 0) {
        await AppointmentSlot.deleteMany(
          {
            _id: { $in: availableSlots.map((slot) => slot._id) },
          },
          { session }
        );
      }

      // Insert the new available slots
      let createdSlotsCount = 0;
      if (newAvailableSlots.length > 0) {
        const insertResult = await AppointmentSlot.insertMany(
          newAvailableSlots,
          { session }
        );
        createdSlotsCount = insertResult.length;
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: `Updated appointment slots for vet ${vetId} between ${startDate.format(
          "YYYY-MM-DD"
        )} and ${endDate.format("YYYY-MM-DD")} in timezone ${timezone}`,
        preservedBookedSlots: bookedSlots.length,
        deletedAvailableSlots: availableSlots.length,
        createdSlotsCount: createdSlotsCount,
        totalSlots: bookedSlots.length + createdSlotsCount,
        dateRange: {
          start: startDate.toDate(),
          end: endDate.toDate(),
        },
        timezone: timezone,
        slotDuration: slotDuration,
        bufferBetweenSlots: bufferBetweenSlots,
      };
    } catch (transactionError: any) {
      // If anything goes wrong, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
  } catch (error: any) {
    console.error("Error updating appointment slots:", error);
    throw new Error(`Failed to update appointment slots: ${error.message}`);
  }
};
export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
export interface IGetAppointmentSlots {
  vetId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  timezone?: string; // Optional timezone for display conversion
  page?: number;
  limit?: number;
  status?: SlotStatus | "ALL";
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface IGetAppointmentSlotsResponse {
  data: any[];
  meta: {
    page?: number;
    limit?: number;
    totalPages?: number;
    totalItems: number;
  };
  filters: {
    dateRange: {
      start: Date;
      end: Date;
    };
    status?: SlotStatus | "ALL";
    search?: string;
    timezone?: string;
  };
}

export const getAppointmentSlots = async (
  params: IGetAppointmentSlots
): Promise<IGetAppointmentSlotsResponse> => {
  try {
    const {
      vetId,
      dateRange,
      timezone,
      page = 1,
      limit = 10,
      status = SlotStatus.AVAILABLE,
      search = "",
      sortBy = "date",
      sortOrder = "asc",
    } = params;

    // Validate date range - use local dates without timezone conversion
    const startDate = moment(dateRange.start).startOf("day");
    const endDate = moment(dateRange.end).endOf("day");

    if (endDate.isBefore(startDate)) {
      throw new Error("Invalid date range: end date must be after start date");
    }

    // Build the base query
    const baseQuery: any = {
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    };

    // Add status filter - only show available slots (not booked, blocked, or pending)
    if (status !== SlotStatus.ALL) {
      baseQuery.status = status;
    } else {
      // If status is ALL, still exclude booked and blocked slots for booking purposes
      baseQuery.status = { $in: [SlotStatus.AVAILABLE] };
    }

    // REMOVED: Server timezone-based date filtering
    // This was causing slots to disappear when users changed their timezone
    // Slots should be timezone-agnostic and always visible regardless of user's current timezone
    // const todayStart = moment().startOf("day").toDate();
    // baseQuery.date.$gte = todayStart; // This line was the problem!

    // Add search functionality
    if (search.trim()) {
      const searchRegex = new RegExp(search, "i");
      baseQuery.$or = [{ status: searchRegex }, { vetId: searchRegex }];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === SortOrder.ASC ? 1 : -1;

    // Execute queries in parallel for better performance
    const [slots, totalCount] = await Promise.all([
      // Get paginated results
      AppointmentSlot.find(baseQuery).sort(sort).skip(skip).limit(limit).lean(),

      // Get total count for pagination
      AppointmentSlot.countDocuments(baseQuery),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Format the response data with timezone conversion if needed
    const formattedSlots = slots.map((slot) => {
      const baseSlot: any = {
        ...slot,
        formattedDate: moment(slot.date).format("YYYY-MM-DD"),
        formattedStartTime: slot.startTime, // Already in HH:mm format
        formattedEndTime: slot.endTime, // Already in HH:mm format
        timezone: slot.timezone, // Include the slot's timezone
        slotTime: calculateTimeString(slot.startTime, slot.endTime),
      };

      // If a display timezone is provided and different from slot timezone, convert times
      if (timezone && slot.timezone && timezone !== slot.timezone) {
        try {
          const dateStr = moment(slot.date).format("YYYY-MM-DD");
          const startDateTime = moment.tz(
            `${dateStr} ${slot.startTime}`,
            slot.timezone
          );
          const endDateTime = moment.tz(
            `${dateStr} ${slot.endTime}`,
            slot.timezone
          );

          baseSlot.formattedStartTime = startDateTime
            .tz(timezone)
            .format("HH:mm");
          baseSlot.formattedEndTime = endDateTime.tz(timezone).format("HH:mm");
          baseSlot.displayTimezone = timezone; // Add display timezone info
        } catch (error) {
          console.warn(
            `Failed to convert timezone for slot ${slot._id}:`,
            error
          );
          // Keep original times if conversion fails
        }
      }

      return baseSlot;
    });

    return {
      data: formattedSlots,
      meta: {
        page: page,
        limit: limit,
        totalPages: totalPages,
        totalItems: totalCount,
      },
      filters: {
        dateRange: {
          start: startDate.toDate(),
          end: endDate.toDate(),
        },
        status: status !== "ALL" ? status : undefined,
        search: search.trim() || undefined,
        timezone: timezone,
      },
    };
  } catch (error: any) {
    console.error("Error fetching appointment slots:", error);
    throw new Error(`Failed to fetch appointment slots: ${error.message}`);
  }
};
export interface IGetSlotsParams {
  vetId: string;
  dateRange: { start: Date; end: Date };
  timezone?: string; // Optional timezone for display conversion
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  status?: SlotStatus;
  search?: string;
}

export const getSlotsByVetId = async ({
  vetId,
  dateRange,
  timezone,
  limit = 100,
  sortBy = "startTime",
  sortOrder = SortOrder.ASC,
  page = 1,
  search = "",
  status = SlotStatus.AVAILABLE,
}: IGetSlotsParams) => {
  return getAppointmentSlots({
    vetId,
    dateRange,
    timezone,
    status,
    limit,
    page,
    sortBy,
    sortOrder,
    search,
  });
};
const calculateTimeString = (startTime: string, endTime: string): string => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  let diffMinutes = endTotalMinutes - startTotalMinutes;

  // Handle case if endTime is next day
  if (diffMinutes < 0) diffMinutes += 24 * 60;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  // Return only minutes if hours is 0
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
