import { connectToDatabase } from "@/lib/mongoose";
import { PetParentModel } from "@/models";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/pet-parents/stats
 * Returns counts for total, active, and inactive pet parents.
 * Does not modify or impact existing /api/pet-parents functionality.
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const total = await PetParentModel.countDocuments({
      isDeleted: { $ne: true },
    });

    // status field exists on model; default inactive; UI treats missing as active in some places
    const active = await PetParentModel.countDocuments({
      status: "active",
      isDeleted: { $ne: true },
    });

    const inactive = await PetParentModel.countDocuments({
      status: "inactive",
      isDeleted: { $ne: true },
    });
    const response = { total, active, inactive };
    console.log("GET /api/pet-parents/stats response:", response);
    return NextResponse.json({
      success: true,
      message: "Pet parent statistics retrieved successfully",
      data: response,
    });
  } catch (error: any) {
    console.error("GET /api/pet-parents/stats error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pet parent statistics",
        errorCode: "FETCH_PET_PARENT_STATS_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
