import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { PetParentModel } from "@/models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

    // Find the pet parent by ID
    const petParent = await PetParentModel.findById(id).select("-__v");

    if (!petParent) {
      return NextResponse.json(
        { success: false, message: "Pet parent not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to access this pet parent data
    // Allow access if the user is the pet parent themselves or if they have admin privileges
    // const isAuthorized =
    //   session.user.id === petParent._id.toString() ||
    //   session.user.role === "admin" ||
    //   session.user.role === "veterinarian";

    // if (!isAuthorized) {
    //   return NextResponse.json(
    //     { success: false, message: "Access denied" },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json({
      success: true,
      message: "Pet parent details retrieved successfully",
      data: petParent,
    });
  } catch (error: any) {
    console.error("Error fetching pet parent details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pet parent details",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get the pet parent ID from params
    const { id } = params;

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

    // Find the pet parent by ID
    const petParent = await PetParentModel.findById(id);

    if (!petParent) {
      return NextResponse.json(
        { success: false, message: "Pet parent not found" },
        { status: 404 }
      );
    }

    // Check if the user is authorized to update this pet parent data
    const isAuthorized =
      session.user.id === petParent._id.toString() ||
      session.user.role === "admin";

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    // Update the pet parent
    const updatedPetParent = await PetParentModel.findByIdAndUpdate(
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get the pet parent ID from params
    const { id } = params;

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

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin privileges required.",
        },
        { status: 403 }
      );
    }

    // Find and delete the pet parent
    const deletedPetParent = await PetParentModel.findByIdAndDelete(id);

    if (!deletedPetParent) {
      return NextResponse.json(
        { success: false, message: "Pet parent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pet parent deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting pet parent:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete pet parent",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
