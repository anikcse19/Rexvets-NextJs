import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for notice period update
const noticePeriodSchema = z.object({
  noticePeriod: z.number().min(0).max(1440), // 0 to 24 hours in minutes
});

/**
 * PUT /api/veterinarian/notice-period
 *
 * Updates the veterinarian's notice period setting
 * Body: { noticePeriod: number } (in minutes)
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to update your notice period.",
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = noticePeriodSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validatedData.error.issues,
        },
        { status: 400 }
      );
    }

    const { noticePeriod } = validatedData.data;

    // Connect to database
    await connectToDatabase();

    // Find the veterinarian by email
    const veterinarian = await VeterinarianModel.findOne({
      email: (session as any).user.email.toLowerCase(),
      isActive: true,
    });

    if (!veterinarian) {
      return NextResponse.json(
        {
          success: false,
          error: "Veterinarian profile not found",
        },
        { status: 404 }
      );
    }

    // Update the notice period
    const updatedVeterinarian = await VeterinarianModel.findByIdAndUpdate(
      veterinarian._id,
      {
        $set: {
          noticePeriod,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
        select: "name email noticePeriod timezone updatedAt",
      }
    );

    if (!updatedVeterinarian) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update notice period",
        },
        { status: 500 }
      );
    }

    // Log the update for debugging
    console.log(
      `[NOTICE PERIOD UPDATE] Veterinarian ${veterinarian.name} updated notice period to ${noticePeriod} minutes`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Notice period updated successfully",
        data: {
          noticePeriod: updatedVeterinarian.noticePeriod,
          updatedAt: updatedVeterinarian.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating notice period:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update notice period. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/veterinarian/notice-period
 *
 * Gets the veterinarian's current notice period setting
 */
export async function GET() {
  try {
    // Check authentication
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to view your notice period.",
        },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the veterinarian by email
    const veterinarian = await VeterinarianModel.findOne({
      email: (session as any).user.email.toLowerCase(),
      isActive: true,
    }).select("name email noticePeriod timezone");

    if (!veterinarian) {
      return NextResponse.json(
        {
          success: false,
          error: "Veterinarian profile not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notice period retrieved successfully",
      data: {
        noticePeriod: veterinarian.noticePeriod, // Default to 30 minutes if not set
        timezone: veterinarian.timezone,
      },
    });
  } catch (error: any) {
    console.error("Error fetching notice period:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
