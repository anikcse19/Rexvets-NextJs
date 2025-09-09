import { AppointmentSlot } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { vetId } = await req.json();
    
    if (!vetId) {
      return NextResponse.json(
        { error: "vetId is required" },
        { status: 400 }
      );
    }

    // Delete all appointment slots for the specified vetId
    const result = await AppointmentSlot.deleteMany({ vetId });
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} appointment slots for vetId: ${vetId}`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error deleting appointment slots:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment slots" },
      { status: 500 }
    );
  }
};
