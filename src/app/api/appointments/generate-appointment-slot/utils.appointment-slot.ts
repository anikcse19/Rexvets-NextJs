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
    bufferBetweenSlots = 5,
    slotDuration = 30,
  } = data;

  try {
    // Convert date range to UTC and normalize to start/end of day
    const startDate = moment(dateRange.start).utc().startOf("day");
    const endDate = moment(dateRange.end).utc().endOf("day");

    // Validate date range
    if (endDate.isBefore(startDate)) {
      throw new Error("Invalid date range: end date must be after start date");
    }

    // Check for existing slots for this vet in the date range
    const existingSlots = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    });

    // If slots already exist, return early without generating new ones
    if (existingSlots.length > 0) {
      throw new Error(
        `Appointment slots already exist for this vet between ${startDate.format(
          "YYYY-MM-DD"
        )} and ${endDate.format(
          "YYYY-MM-DD"
        )}. Please delete existing slots first.`
      );
      // return {
      //   success: false,
      //   message: `Appointment slots already exist for this vet between ${startDate.format(
      //     "YYYY-MM-DD"
      //   )} and ${endDate.format(
      //     "YYYY-MM-DD"
      //   )}. Please delete existing slots first.`,
      //   existingSlotsCount: existingSlots.length,
      // };
    }

    const slotsToCreate: any[] = [];

    // Process each day in the date range
    const numberOfDays = endDate.diff(startDate, "days") + 1;
    for (let day = 0; day < numberOfDays; day++) {
      const currentDate = startDate.clone().add(day, "days");
      const utcDate = currentDate.toDate();

      // Process each slot period for this day
      for (const period of slotPeriods) {
        // Parse the time from slotPeriods and combine with current date
        const periodStart = moment(
          `${currentDate.format("YYYY-MM-DD")} ${period.start}`,
          "YYYY-MM-DD HH:mm"
        ).utc();
        const periodEnd = moment(
          `${currentDate.format("YYYY-MM-DD")} ${period.end}`,
          "YYYY-MM-DD HH:mm"
        ).utc();

        // Validate that the period is valid
        if (periodEnd.isSameOrBefore(periodStart)) {
          throw new Error(
            `Invalid time period: end time ${period.end} must be after start time ${period.start}`
          );
        }

        // Calculate total time needed per slot (duration + buffer)
        const totalTimePerSlot = slotDuration + bufferBetweenSlots;

        // Generate slots within this period
        let currentSlotStart = periodStart.clone();

        while (currentSlotStart.isBefore(periodEnd)) {
          const currentSlotEnd = currentSlotStart
            .clone()
            .add(slotDuration, "minutes");

          // If the slot would extend beyond the period end, break
          if (currentSlotEnd.isAfter(periodEnd)) {
            break;
          }

          // Create slot data with ISO 8601 UTC format for times
          const slotData = {
            vetId: new Types.ObjectId(vetId),
            date: utcDate,
            startTime: currentSlotStart.toISOString(),
            endTime: currentSlotEnd.toISOString(),
            status: SlotStatus.AVAILABLE,
            createdAt: new Date(),
          };

          slotsToCreate.push(slotData);

          // Move to next slot start time (no buffer gap)
          currentSlotStart = currentSlotEnd.clone();

          // If next slot start would be beyond period end, break
          if (currentSlotStart.isSameOrAfter(periodEnd)) {
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
      )} and ${endDate.format("YYYY-MM-DD")}`,
      slotsCount: slotsToCreate.length,
      dateRange: {
        start: startDate.toDate(),
        end: endDate.toDate(),
      },
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
  bufferBetweenSlots?: number;
  slotDuration?: number;
}

export const updateAppointmentSlots = async (data: IUpdateAppointmentSlots) => {
  try {
    const {
      vetId,
      slotPeriods,
      dateRange,
      bufferBetweenSlots = 5,
      slotDuration = 30,
    } = data;

    // Convert date range to UTC
    const startDate = moment(dateRange.start).utc().startOf("day");
    const endDate = moment(dateRange.end).utc().startOf("day");

    // Validate date range
    if (endDate.isBefore(startDate)) {
      throw new Error("Invalid date range: end date must be after start date");
    }

    // Validate slot periods
    for (const period of slotPeriods) {
      const periodStart = moment(period.start).utc();
      const periodEnd = moment(period.end).utc();

      if (periodEnd.isSameOrBefore(periodStart)) {
        throw new Error(
          `Invalid time period: end time must be after start time`
        );
      }
    }

    // Get all existing slots for this vet in the date range
    const existingSlots = await AppointmentSlot.find({
      vetId: new Types.ObjectId(vetId),
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
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
      const utcDate = currentDate.toDate();

      // Process each slot period for this day
      for (const period of slotPeriods) {
        const periodStart = moment(period.start).utc();
        const periodEnd = moment(period.end).utc();

        // Generate slots within this period with buffer consideration
        let currentSlotStart = periodStart.clone();

        while (currentSlotStart.isBefore(periodEnd)) {
          const currentSlotEnd = currentSlotStart
            .clone()
            .add(slotDuration, "minutes");

          // If the slot would extend beyond the period end, break
          if (currentSlotEnd.isAfter(periodEnd)) {
            break;
          }

          // Create slot data
          const slotData = {
            vetId: new Types.ObjectId(vetId),
            date: utcDate,
            startTime: currentSlotStart.toISOString(),
            endTime: currentSlotEnd.toISOString(),
            status: SlotStatus.AVAILABLE,
            createdAt: new Date(),
          };

          newAvailableSlots.push(slotData);

          // Move to next slot, considering buffer time
          currentSlotStart = currentSlotEnd
            .clone()
            .add(bufferBetweenSlots, "minutes");

          // If next slot start would be beyond period end, break
          if (currentSlotStart.isSameOrAfter(periodEnd)) {
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
        )} and ${endDate.format("YYYY-MM-DD")}`,
        preservedBookedSlots: bookedSlots.length,
        deletedAvailableSlots: availableSlots.length,
        createdSlotsCount: createdSlotsCount,
        totalSlots: bookedSlots.length + createdSlotsCount,
        dateRange: {
          start: startDate.toDate(),
          end: endDate.toDate(),
        },
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
  };
}

export const getAppointmentSlots = async (
  params: IGetAppointmentSlots
): Promise<IGetAppointmentSlotsResponse> => {
  try {
    const {
      vetId,
      dateRange,
      page = 1,
      limit = 10,
      status = SlotStatus.AVAILABLE,
      search = "",
      sortBy = "date",
      sortOrder = "asc",
    } = params;

    // Validate date range
    const startDate = moment(dateRange.start).utc().startOf("day");
    const endDate = moment(dateRange.end).utc().startOf("day");

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
      baseQuery.status = { $in: [SlotStatus.AVAILABLE, SlotStatus.PENDING] };
    }

    // Filter out past dates and times
    const now = new Date();
    baseQuery.$and = [
      {
        $or: [
          // Date is in the future
          { date: { $gt: now } },
          // Or date is today but time is in the future
          {
            $and: [
              { date: { $gte: moment().startOf('day').toDate() } },
              { date: { $lte: moment().endOf('day').toDate() } },
              { startTime: { $gt: moment().format('HH:mm') } }
            ]
          }
        ]
      }
    ];

    // Add search functionality
    if (search.trim()) {
      const searchRegex = new RegExp(search, "i");

      // Search across multiple fields using $or
      baseQuery.$or = [
        { status: searchRegex },
        { vetId: searchRegex }, // If you want to search by vet details
        // Add other searchable fields as needed
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === SortOrder.ASC ? 1 : -1;

    // Execute queries in parallel for better performance
    const [slots, totalCount] = await Promise.all([
      // Get paginated results
      AppointmentSlot.find(baseQuery).sort(sort).skip(skip).limit(limit).lean(), // Use lean for better performance

      // Get total count for pagination
      AppointmentSlot.countDocuments(baseQuery),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Format the response data
    const formattedSlots = slots.map((slot) => ({
      ...slot,
      // Add any additional formatting here
      formattedDate: moment(slot.date).format("YYYY-MM-DD"),
      formattedStartTime: moment(slot.startTime).format("HH:mm"),
      formattedEndTime: moment(slot.endTime).format("HH:mm"),
    }));

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
  limit = 100,
  sortBy = "startTime",
  sortOrder = SortOrder.ASC,
  page = 1,
  search = "",
  status = SlotStatus.AVAILABLE,
}: IGetSlotsParams) => {
  console.log("getSlotsByVetId params:", {
    vetId,
    dateRange,
    limit,
    sortBy,
    sortOrder,
    page,
    search,
    status,
  });
  return getAppointmentSlots({
    vetId,
    dateRange,
    status,
    limit,
    page,
    sortBy,
    sortOrder,
    search,
  });
};
