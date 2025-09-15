import { connectToDatabase } from "@/lib/mongoose";
import { VeterinarianModel } from "@/models";
import { VeterinarianStatus } from "@/models/Veterinarian";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/veterinarian/stats
 *
 * Returns statistics about veterinarians including total, active, pending, and suspended counts
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get total count of all veterinarians
    const totalDoctors = await VeterinarianModel.countDocuments({
      isDeleted: { $ne: true },
    });

    // Get count of active/approved doctors
    const activeDoctors = await VeterinarianModel.countDocuments({
      status: VeterinarianStatus.APPROVED,
      isDeleted: { $ne: true },
    });

    // Get count of pending doctors
    const pendingDoctors = await VeterinarianModel.countDocuments({
      status: VeterinarianStatus.PENDING,
      isDeleted: { $ne: true },
    });

    // Get count of suspended doctors
    const suspendedDoctors = await VeterinarianModel.countDocuments({
      status: VeterinarianStatus.SUSPENDED,
      isDeleted: { $ne: true },
    });

    const stats = {
      total: totalDoctors,
      active: activeDoctors,
      pending: pendingDoctors,
      suspended: suspendedDoctors,
    };

    return NextResponse.json({
      success: true,
      message: "Veterinarian statistics retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("GET /api/veterinarian/stats error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch veterinarian statistics",
        errorCode: "FETCH_STATS_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
