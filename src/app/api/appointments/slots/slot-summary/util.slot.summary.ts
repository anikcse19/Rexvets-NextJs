import { authOptions } from "@/lib/auth";
import { Slot } from "@/lib/interfaces";
import { IErrorResponse, throwAppError } from "@/lib/utils/send.response";
import { AppointmentSlot, SlotStatus } from "@/models/AppointmentSlot";
import Veterinarian from "@/models/Veterinarian";
import moment from "moment";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";

interface Period {
  startTime: string;
  endTime: string;
  totalHours: number;
  slots: Slot[];
}

interface DateGroup {
  date: {
    start: Date;
    end: Date;
  };
  periods: Period[];
  numberOfPeriods: number;
  numberOfDays: number;
}

export const groupSlotsIntoPeriods = (slots: Slot[]): DateGroup[] => {
  // Group slots by date
  const groups: { [key: string]: Slot[] } = {};

  slots.forEach((slot) => {
    const key = moment(slot.date).format("YYYY-MM-DD");
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(slot);
  });

  const result: DateGroup[] = [];

  // Process each date group
  Object.keys(groups).forEach((date) => {
    const dateSlots = groups[date];
    // Sort slots by startTime
    dateSlots.sort(
      (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
    );

    const periods: Period[] = [];
    if (dateSlots.length === 0) return;

    // Initialize first period
    let currentStart = dateSlots[0].startTime;
    let currentEnd = dateSlots[0].endTime;
    let currentSlots: Slot[] = [dateSlots[0]];

    // Group slots into periods based on 50-minute gap
    for (let i = 1; i < dateSlots.length; i++) {
      const nextStart = dateSlots[i].startTime;
      const gap = moment(nextStart).diff(moment(currentEnd), "minutes");

      if (gap > 50) {
        // Complete the current period
        const totalHours = moment(currentEnd).diff(
          moment(currentStart),
          "hours",
          true
        );
        periods.push({
          startTime: currentStart,
          endTime: currentEnd,
          totalHours,
          slots: currentSlots,
        });
        // Start a new period
        currentStart = nextStart;
        currentEnd = dateSlots[i].endTime;
        currentSlots = [dateSlots[i]];
      } else {
        // Extend the current period
        currentEnd = dateSlots[i].endTime;
        currentSlots.push(dateSlots[i]);
      }
    }

    // Add the last period
    const totalHours = moment(currentEnd).diff(
      moment(currentStart),
      "hours",
      true
    );
    periods.push({
      startTime: currentStart,
      endTime: currentEnd,
      totalHours,
      slots: currentSlots,
    });

    // Calculate date range for the group
    const startDate = moment(date).startOf("day").toDate();
    const endDate = moment(date).endOf("day").toDate();

    // Calculate number of days (should be 1 since we're grouping by single dates)
    const numberOfDays = 1;

    // Add to result
    result.push({
      date: { start: startDate, end: endDate },
      periods,
      numberOfPeriods: periods.length,
      numberOfDays,
    });
  });

  // Sort results by date
  result.sort(
    (a, b) => moment(a.date.start).valueOf() - moment(b.date.start).valueOf()
  );

  return result;
};
interface UpdateSlotStatusParams {
  vetId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  status: SlotStatus;
}

export const updateSlotStatus = async ({
  vetId,
  dateRange,
  status,
}: UpdateSlotStatusParams) => {
  try {
    // Validate status
    if (
      !Object.values(SlotStatus).includes(status) ||
      status === SlotStatus.ALL
    ) {
      const errResp: IErrorResponse = {
        success: false,
        message: `Invalid status: ${status}. Must be one of ${Object.values(
          SlotStatus
        )
          .filter((s) => s !== SlotStatus.ALL)
          .join(", ")}`,
        errorCode: "INVALID_SLOT_STATUS",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Convert date range to UTC and normalize to start/end of day
    const startDate = moment(dateRange.start).utc().startOf("day").toDate();
    const endDate = moment(dateRange.end).utc().endOf("day").toDate();

    // Validate date range
    if (moment(endDate).isBefore(startDate)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid date range: end date must be after start date",
        errorCode: "INVALID_DATE_RANGE",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Start a Mongoose session for transaction
    const session = await AppointmentSlot.startSession();
    session.startTransaction();

    try {
      // Update slots within the date range for the given vet
      const updateResult = await AppointmentSlot.updateMany(
        {
          vetId: new Types.ObjectId(vetId),
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        { $set: { status } },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: `Updated ${
          updateResult.modifiedCount
        } slots to status '${status}' for vet ${vetId} between ${moment(
          startDate
        ).format("YYYY-MM-DD")} and ${moment(endDate).format("YYYY-MM-DD")}`,
        modifiedCount: updateResult.modifiedCount,
        matchedCount: updateResult.matchedCount,
      };
    } catch (transactionError: any) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
  } catch (error: any) {
    console.error("Error updating slot status:", error);
    return throwAppError(
      {
        success: false,
        message: `Failed to update slot status: ${error.message}`,
        errorCode: "UPDATE_SLOT_STATUS_FAILED",
        errors: null,
      },
      500
    );
  }
};
interface IUpdateSlotStatusBulk {
  vetId: string;
  slotIds: string[];
  status: SlotStatus;
}

export const updateSlotStatusBulk = async ({
  vetId,
  slotIds,
  status,
}: IUpdateSlotStatusBulk) => {
  try {
    // Check user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Unauthorized: Please log in to perform this action",
        errorCode: "UNAUTHORIZED",
        errors: null,
      };
      return throwAppError(errResp, 401);
    }

    // Validate input fields
    if (!vetId || !slotIds || !status) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Missing required fields: vetId, slotIds, or status",
        errorCode: "MISSING_REQUIRED_FIELDS",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Validate slot IDs format
    const invalidSlotIds = slotIds.filter((id) => !Types.ObjectId.isValid(id));
    if (invalidSlotIds.length > 0) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid slot ID format",
        errorCode: "INVALID_SLOT_ID_FORMAT",
        errors: {
          invalidSlotIds: invalidSlotIds,
        },
      };
      return throwAppError(errResp, 400);
    }

    if (!Object.values(SlotStatus).includes(status)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid status value",
        errorCode: "INVALID_SLOT_STATUS",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // Check if vet exists and is active
    const isVetExist = await Veterinarian.findOne({
      _id: new Types.ObjectId(vetId),
      isActive: true,
    });

    if (!isVetExist) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Veterinarian not found or inactive",
        errorCode: "VET_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }

    // Check if user has permission to update this vet's slots
    // This assumes your Veterinarian model has a userId field or similar
    if (isVetExist.userId.toString() !== session.user.id) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Forbidden: You don't have permission to update these slots",
        errorCode: "FORBIDDEN",
        errors: null,
      };
      return throwAppError(errResp, 403);
    }

    // Update slots in bulk
    const result = await AppointmentSlot.updateMany(
      {
        _id: { $in: slotIds.map((id) => new Types.ObjectId(id)) },
        vetId: new Types.ObjectId(vetId),
      },
      {
        $set: { status },
      }
    );

    if (result.modifiedCount === 0) {
      const errResp: IErrorResponse = {
        success: false,
        message: "No slots were updated. Please check the vetId and slotIds.",
        errorCode: "NO_SLOTS_UPDATED",
        errors: null,
      };
      return throwAppError(errResp, 404);
    }

    // Return success response
    return {
      success: true,
      message: `Successfully updated ${result.modifiedCount} slots to ${status}`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    };
  } catch (error: any) {
    console.error("Error updating slot status:", error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Duplicate slot found",
        errorCode: "DUPLICATE_SLOT",
        errors: null,
      };
      return throwAppError(errResp, 409);
    }

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const errResp: IErrorResponse = {
        success: false,
        message: "Validation error occurred",
        errorCode: "VALIDATION_ERROR",
        errors: error.errors,
      };
      return throwAppError(errResp, 400);
    }

    // Generic error
    return throwAppError(
      {
        success: false,
        message: `Failed to update slot status: ${error.message}`,
        errorCode: "UPDATE_SLOT_STATUS_FAILED",
        errors: null,
      },
      500
    );
  }
};
