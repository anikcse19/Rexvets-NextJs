import { isTimeInPast, isValidTimezone } from "@/lib/timezone";
import { DateRange } from "@/lib/types";
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
    }).populate("vetId", "name email");

    // If slots already exist, return early without generating new ones
    if (existingSlots.length > 0) {
      throw new Error(
        `Appointment slots already exist for ${
          (existingSlots[0].vetId as any)?.name
        } between ${startDate.format("YYYY-MM-DD")} and ${endDate.format(
          "YYYY-MM-DD"
        )} in timezone ${timezone}. Please delete existing slots or choose a different date range or time .`
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
    throw new Error(`${error?.message}`);
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

// Create slots for a single day and a single period without blocking entire date-range
export interface IGenerateSinglePeriod {
  vetId: string;
  // New payload supports dateRange; keep "date" for backward compatibility
  dateRange?: DateRange;
  date?: DateRange;
  timezone: string;
  period: { start: string; end: string }; // HH:mm
  slotDuration?: number; // minutes
  bufferBetweenSlots?: number; // minutes
}

export const generateAppointmentSlotsForPeriod = async (
  data: IGenerateSinglePeriod
) => {
  const {
    vetId,
    dateRange,
    date,
    timezone,
    period,
    bufferBetweenSlots = 5,
    slotDuration = 30,
  } = data;

  try {
    if (!isValidTimezone(timezone)) {
      throw new Error(`Invalid timezone: ${timezone}`);
    }

    // Normalize the input to a date range (inclusive)
    const inputRange: DateRange | undefined = dateRange || date;
    if (!inputRange?.start || !inputRange?.end) {
      throw new Error("dateRange is required");
    }
    const startDate = moment(inputRange.start).startOf("day");
    const endDate = moment(inputRange.end).endOf("day");
    const currentDateInTimezone = moment.tz(timezone).startOf("day");

    if (endDate.isBefore(startDate)) {
      throw new Error("Invalid date range: end date must be after start date");
    }
    if (startDate.isBefore(currentDateInTimezone)) {
      throw new Error("Cannot create slots for past dates");
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(period.start) || !timeRegex.test(period.end)) {
      throw new Error(
        `Invalid time format. Expected HH:mm, got start: ${period.start}, end: ${period.end}`
      );
    }

    // Build candidate slots setup for this period window
    const periodStart = moment(
      `2000-01-01 ${period.start}`,
      "YYYY-MM-DD HH:mm"
    );
    let periodEnd = period.end;
    let periodEndMoment = moment(`2000-01-01 ${periodEnd}`, "YYYY-MM-DD HH:mm");
    if (period.end === "24:00") {
      periodEnd = "00:00";
      periodEndMoment = moment("2000-01-02 00:00", "YYYY-MM-DD HH:mm");
    }
    if (periodEndMoment.isSameOrBefore(periodStart)) {
      throw new Error(
        `Invalid time period: end time ${period.end} must be after start time ${period.start}`
      );
    }

    // Fetch all existing slots for this vet in the date range and timezone
    const existingInRange = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      timezone,
    });

    const hasAnySlotsInRange = existingInRange.length > 0;

    // Helper: does a slot overlap the target period window (same-day window)
    const overlapsPeriodWindow = (slotStart: string, slotEnd: string) => {
      const sStart = moment(`2000-01-01 ${slotStart}`, "YYYY-MM-DD HH:mm");
      const sEnd = moment(`2000-01-01 ${slotEnd}`, "YYYY-MM-DD HH:mm");
      const pStart = periodStart;
      const pEnd = periodEndMoment;
      return sStart.isBefore(pEnd) && sEnd.isAfter(pStart);
    };

    // Check if given period has any slots across the date range
    const periodHasAnySlots = existingInRange.some((s) =>
      overlapsPeriodWindow(s.startTime, s.endTime)
    );

    // As requested: only create if range has slots, but this specific period has none
    if (!hasAnySlotsInRange) {
      return {
        createdSlotsCount: 0,
        message:
          "No slots exist in the given date range; skipping period creation per rule.",
      };
    }
    if (periodHasAnySlots) {
      return {
        createdSlotsCount: 0,
        message: "Target period already has slots in the given date range",
      };
    }

    // Create slots for the given period across the date range, skipping overlaps per day
    const slotsToCreate: any[] = [];
    const totalDays = endDate.clone().startOf("day").diff(startDate.clone().startOf("day"), "days") + 1;
    for (let day = 0; day < totalDays; day++) {
      const currentDate = startDate.clone().startOf("day").add(day, "days");
      if (currentDate.isBefore(currentDateInTimezone)) continue; // safety

      const localDate = currentDate.toDate();
      const existingForDay = existingInRange.filter((s) =>
        moment(s.date).isSame(currentDate, "day")
      );

      let cursor = periodStart.clone();
      const endBoundary = periodEndMoment.clone();
      while (cursor.clone().add(slotDuration, "minutes").isSameOrBefore(endBoundary)) {
        const slotStartStr = cursor.format("HH:mm");
        const slotEndStr = cursor.clone().add(slotDuration, "minutes").format("HH:mm");

        // Skip if time already passed for today in appointment timezone
        if (
          currentDate.isSame(currentDateInTimezone, "day") &&
          isTimeInPast(slotEndStr, currentDate.toDate(), timezone)
        ) {
          cursor = cursor.add(slotDuration + bufferBetweenSlots, "minutes");
          continue;
        }

        const overlaps = existingForDay.some((s) => {
          const sStart = moment(`2000-01-01 ${s.startTime}`, "YYYY-MM-DD HH:mm");
          const sEnd = moment(`2000-01-01 ${s.endTime}`, "YYYY-MM-DD HH:mm");
          const cStart = moment(`2000-01-01 ${slotStartStr}`, "YYYY-MM-DD HH:mm");
          const cEnd = moment(`2000-01-01 ${slotEndStr}`, "YYYY-MM-DD HH:mm");
          return cStart.isBefore(sEnd) && cEnd.isAfter(sStart);
        });

        if (!overlaps) {
          slotsToCreate.push({
            vetId: new Types.ObjectId(vetId),
            date: localDate,
            startTime: slotStartStr,
            endTime: slotEndStr,
            timezone,
            status: SlotStatus.AVAILABLE,
            createdAt: new Date(),
          });
        }

        cursor = cursor.add(slotDuration + bufferBetweenSlots, "minutes");
      }
    }

    if (slotsToCreate.length === 0) {
      return { createdSlotsCount: 0, message: "No new slots created (all overlapped)" };
    }

    await AppointmentSlot.insertMany(slotsToCreate, { ordered: false });
    return { createdSlotsCount: slotsToCreate.length };
  } catch (error) {
    throw error;
  }
};

export const updateAppointmentSlots = async (data: IUpdateAppointmentSlots) => {
  try {
    const {
      vetId,
      slotPeriods,
      dateRange,
      timezone,
      bufferBetweenSlots = 0,
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
    }).populate("vetId", "name email");

    // Separate slots by status for smart handling
    const bookedSlots = existingSlots.filter(
      (slot) => slot.status === SlotStatus.BOOKED
    );
    const availableSlots = existingSlots.filter(
      (slot) => slot.status === SlotStatus.AVAILABLE
    );
    const disabledSlots = existingSlots.filter(
      (slot) => slot.status === SlotStatus.DISABLED
    );

    // Calculate number of days in the range
    const numberOfDays = endDate.diff(startDate, "days") + 1;

    // Generate new available slots based on the updated configuration
    const newAvailableSlots = [];

    // Process each day in the date range
    for (let day = 0; day < numberOfDays; day++) {
      const currentDate = startDate.clone().add(day, "days");
      const localDate = currentDate.toDate();

      // Get booked slots for this specific day to avoid conflicts
      const dayBookedSlots = bookedSlots.filter((slot) =>
        moment(slot.date).isSame(currentDate, "day")
      );

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

          // Check if this slot conflicts with any booked slots
          const hasConflict = dayBookedSlots.some((bookedSlot) => {
            const bookedStart = moment(
              `2000-01-01 ${bookedSlot.startTime}`,
              "YYYY-MM-DD HH:mm"
            );
            const bookedEnd = moment(
              `2000-01-01 ${bookedSlot.endTime}`,
              "YYYY-MM-DD HH:mm"
            );

            // Check for overlap: new slot overlaps with booked slot
            return (
              slotStartMoment.isBefore(bookedEnd) &&
              slotEndMoment.isAfter(bookedStart)
            );
          });

          // Only create slot if it doesn't conflict with booked slots
          if (!hasConflict) {
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
          }

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
      // Industry Standard: Only delete available and disabled slots, preserve booked slots
      const slotsToDelete = [...availableSlots, ...disabledSlots];

      if (slotsToDelete.length > 0) {
        await AppointmentSlot.deleteMany(
          {
            _id: { $in: slotsToDelete.map((slot) => slot._id) },
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
        message: `Smart update completed for vet ${vetId} between ${startDate.format(
          "YYYY-MM-DD"
        )} and ${endDate.format("YYYY-MM-DD")} in timezone ${timezone}`,
        summary: {
          preservedBookedSlots: bookedSlots.length,
          deletedAvailableSlots: availableSlots.length,
          deletedDisabledSlots: disabledSlots.length,
          createdNewSlots: createdSlotsCount,
          totalSlotsAfterUpdate: bookedSlots.length + createdSlotsCount,
        },
        details: {
          bookedSlotsPreserved:
            bookedSlots.length > 0
              ? `✅ Preserved ${bookedSlots.length} booked appointment(s) - no disruption to existing bookings`
              : "ℹ️ No booked slots to preserve",
          availableSlotsReplaced:
            availableSlots.length > 0
              ? `🔄 Replaced ${availableSlots.length} available slot(s) with new schedule`
              : "ℹ️ No existing available slots to replace",
          newSlotsCreated:
            createdSlotsCount > 0
              ? `✨ Created ${createdSlotsCount} new available slot(s)`
              : "ℹ️ No new slots created (may be due to conflicts with booked slots)",
          conflictAvoidance:
            bookedSlots.length > 0
              ? "🛡️ Smart conflict detection prevented overlap with booked appointments"
              : "ℹ️ No conflicts to avoid",
        },
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

    // Add status filter
    if (status !== SlotStatus.ALL && status !== "ALL" && status !== undefined) {
      baseQuery.status = status;
    }
    // If status is ALL, undefined, or "ALL", don't add any status filter to return all slots

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
      // Get paginated results with populated vetId
      AppointmentSlot.find(baseQuery)
        .populate("vetId", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

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
  status = SlotStatus.ALL,
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
