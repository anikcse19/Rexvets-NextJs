import { AppointmentSlot, SlotStatus } from "@/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface DeleteSlotsByIdsRequest {
  slotIds: string[];
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { slotIds }: DeleteSlotsByIdsRequest = await req.json();

    // Validate required fields
    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return NextResponse.json(
        { 
          error: "Missing required fields: slotIds array" 
        },
        { status: 400 }
      );
    }

    // Validate that all slotIds are valid ObjectIds
    const invalidIds = slotIds.filter(id => !Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return NextResponse.json(
        { 
          error: `Invalid slot IDs: ${invalidIds.join(", ")}` 
        },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectIds
    const objectIds = slotIds.map(id => new Types.ObjectId(id));

    // Find slots that will be deleted
    const slotsToDelete = await AppointmentSlot.find({
      _id: { $in: objectIds }
    });

    if (slotsToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No slots found with the provided IDs",
        deletedCount: 0
      });
    }

    // Check if any slots are booked (should not be deleted)
    const bookedSlots = slotsToDelete.filter(slot => slot.status === SlotStatus.BOOKED);
    if (bookedSlots.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete slots: ${bookedSlots.length} slots are already booked`,
          bookedSlotsCount: bookedSlots.length,
          bookedSlotIds: bookedSlots.map(slot => slot._id?.toString() || '')
        },
        { status: 409 }
      );
    }

    // Delete only available and disabled slots
    const deleteResult = await AppointmentSlot.deleteMany({
      _id: { $in: objectIds },
      status: { $in: [SlotStatus.AVAILABLE, SlotStatus.DISABLED] }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} slots`,
      deletedCount: deleteResult.deletedCount,
      requestedCount: slotIds.length,
      foundCount: slotsToDelete.length
    });

  } catch (error: any) {
    console.error("Error deleting slots by IDs:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete slots",
        details: error.message 
      },
      { status: 500 }
    );
  }
};
