import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { PetParentModel, VeterinarianModel } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    return NextResponse.json({
      success: true,
      message: "Veterinarian retrieved successfully",
      data: {
        veterinarian,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get the pet parent ID from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Pet parent ID is required" },
        { status: 400 }
      );
    }

    // Get session for authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    console.log("body", body);

    // Find the pet parent by ID
    const petParent = await VeterinarianModel.findById(id);

    if (!petParent) {
      return NextResponse.json(
        { success: false, message: "Pet parent not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to update this pet parent data

    // Update the pet parent
    const updatedPetParent = await VeterinarianModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-__v");

    return NextResponse.json({
      success: true,
      message: "Pet parent updated successfully",
      data: updatedPetParent,
    });
  } catch (error: any) {
    console.error("Error updating pet parent:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update pet parent",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
