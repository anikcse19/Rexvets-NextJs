import { AppointmentSlot, SlotStatus } from "@/models";
import moment from "moment";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface PeriodToDelete {
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
}

interface DeletePeriodsBulkRequest {
  vetId: string;
  periods: PeriodToDelete[];
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { vetId, periods }: DeletePeriodsBulkRequest = await req.json();

    // Validate required fields
    if (!vetId || !periods || !Array.isArray(periods) || periods.length === 0) {
      return NextResponse.json(
        { 
          error: "Missing required fields: vetId and periods array" 
        },
        { status: 400 }
      );
    }

    // Validate each period
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      
      if (!period.date || !period.startTime || !period.endTime || !period.timezone) {
        return NextResponse.json(
          { error: `Period ${i + 1}: Missing required fields (date, startTime, endTime, timezone)` },
          { status: 400 }
        );
      }

      if (!moment(period.date, "YYYY-MM-DD", true).isValid()) {
        return NextResponse.json(
          { error: `Period ${i + 1}: Invalid date format. Expected YYYY-MM-DD` },
          { status: 400 }
        );
      }

      if (!timeRegex.test(period.startTime) || !timeRegex.test(period.endTime)) {
        return NextResponse.json(
          { error: `Period ${i + 1}: Invalid time format. Expected HH:mm` },
          { status: 400 }
        );
      }

      if (period.startTime >= period.endTime) {
        return NextResponse.json(
          { error: `Period ${i + 1}: Start time must be before end time` },
          { status: 400 }
        );
      }
    }

    // Start a session for transaction
    const session = await AppointmentSlot.startSession();
    session.startTransaction();

    try {
      let totalDeletedCount = 0;
      const deletionResults = [];
      const errors = [];

      // Process each period
      for (let i = 0; i < periods.length; i++) {
        const period = periods[i];
        
        try {
          // Convert date to proper format for database query
          const targetDate = moment(period.date).startOf("day").toDate();

          // Build query to find slots in the specified period
          const query = {
            vetId: new Types.ObjectId(vetId),
            date: targetDate,
            timezone: period.timezone,
            startTime: { $gte: period.startTime },
            endTime: { $lte: period.endTime },
            // Only delete available and disabled slots, preserve booked slots
            status: { $in: [SlotStatus.AVAILABLE, SlotStatus.DISABLED] }
          };

          // Find slots that will be deleted
          const slotsToDelete = await AppointmentSlot.find(query, null, { session });

          // Check if any slots are booked (should not be deleted)
          const bookedSlots = slotsToDelete.filter(slot => slot.status === SlotStatus.BOOKED);
          if (bookedSlots.length > 0) {
            errors.push({
              periodIndex: i,
              period: period,
              error: `${bookedSlots.length} slots are already booked`,
              bookedSlotsCount: bookedSlots.length
            });
            continue;
          }

          // Delete the slots
          const deleteResult = await AppointmentSlot.deleteMany(query, { session });
          
          totalDeletedCount += deleteResult.deletedCount;
          deletionResults.push({
            periodIndex: i,
            period: period,
            deletedCount: deleteResult.deletedCount
          });

        } catch (periodError: any) {
          errors.push({
            periodIndex: i,
            period: period,
            error: periodError.message
          });
        }
      }

      // If there are any errors and no successful deletions, rollback
      if (errors.length > 0 && totalDeletedCount === 0) {
        await session.abortTransaction();
        session.endSession();
        
        return NextResponse.json(
          { 
            error: "Failed to delete any periods",
            errors: errors
          },
          { status: 400 }
        );
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: `Successfully processed ${periods.length} periods`,
        totalDeletedCount: totalDeletedCount,
        successfulDeletions: deletionResults,
        errors: errors.length > 0 ? errors : undefined,
        summary: {
          totalPeriods: periods.length,
          successfulPeriods: deletionResults.length,
          failedPeriods: errors.length,
          totalSlotsDeleted: totalDeletedCount
        }
      });

    } catch (transactionError: any) {
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }

  } catch (error: any) {
    console.error("Error deleting periods in bulk:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete periods",
        details: error.message 
      },
      { status: 500 }
    );
  }
};
