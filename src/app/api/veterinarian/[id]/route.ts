import { connectToDatabase } from "@/lib/mongoose";
import { VeterinarianModel } from "@/models";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/veterinarian/[id]
 *
 * Returns a single veterinarian by ID.
 * Path params:
 * - id: veterinarian ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    console.log("Received GET request for veterinarian with id:", id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Veterinarian ID is required",
          errorCode: "MISSING_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    const veterinarian = await VeterinarianModel.findById(id).select(
      "-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken"
    );

    // console.log("Fetched veterinarian in api route:", veterinarian);

    if (!veterinarian) {
      return NextResponse.json(
        {
          success: false,
          message: "Veterinarian not found",
          errorCode: "VETERINARIAN_NOT_FOUND",
          errors: null,
        },
        { status: 404 }
      );
    }
    const vetTimezone=await User.findOne({
      veterinarianRef:id
    }).select("timezone")
    if(!vetTimezone){
      return NextResponse.json({
        success: false,
        message: "Veterinarian timezone not found",
        errorCode: "VETERINARIAN_TIMEZONE_NOT_FOUND",
        errors: null,
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: "Veterinarian retrieved successfully",
      data: {
        veterinarian,
        timezone:vetTimezone.timezone
      },
    });
  } catch (error: any) {
    console.error("GET /api/veterinarian/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch veterinarian",
        errorCode: "FETCH_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
