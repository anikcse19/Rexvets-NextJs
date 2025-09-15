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
          success: false,
          error: "Missing required fields: slotIds array",
        },
        { status: 400 }
      );
    }

    // Validate that all slotIds are valid ObjectIds
    const invalidIds = slotIds.filter((id) => !Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid slot IDs: ${invalidIds.join(", ")}`,
          invalidIds,
        },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectIds
    const objectIds = slotIds.map((id) => new Types.ObjectId(id));

    // Find slots that match
    const slotsToAffect = await AppointmentSlot.find({
      _id: { $in: objectIds },
    }).lean();

    if (slotsToAffect.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No slots found with the provided IDs",
        deletedCount: 0,
        requestedCount: slotIds.length,
        foundCount: 0,
        bookedSlotsCount: 0,
        bookedSlotIds: [],
      });
    }

    // Partition into booked and deletable (available/disabled)
    const booked = slotsToAffect.filter((s: any) => s.status === SlotStatus.BOOKED);
    const deletableIds = slotsToAffect
      .filter((s: any) => [SlotStatus.AVAILABLE, SlotStatus.DISABLED].includes(s.status))
      .map((s: any) => s._id);

    // Delete deletable even if there are booked ones
    const deleteResult = await AppointmentSlot.deleteMany({ _id: { $in: deletableIds } });

    const responseBody = {
      success: true,
      message:
        booked.length > 0
          ? `Deleted ${deleteResult.deletedCount} slots. ${booked.length} booked slot(s) were not deleted.`
          : `Successfully deleted ${deleteResult.deletedCount} slots`,
      deletedCount: deleteResult.deletedCount,
      requestedCount: slotIds.length,
      foundCount: slotsToAffect.length,
      bookedSlotsCount: booked.length,
      bookedSlotIds: booked.map((s: any) => s._id?.toString() || ""),
    };

    if (booked.length > 0) {
      // Inform client of partial success via 409 to signal booked conflicts
      return NextResponse.json(responseBody, { status: 409 });
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting slots by IDs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete slots",
        details: error.message,
      },
      { status: 500 }
    );
  }
};
