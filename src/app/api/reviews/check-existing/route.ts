import { connectToDatabase } from "@/lib/mongoose";
import ReviewModel from "@/models/Review";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const vetId = searchParams.get("vetId");
    const parentId = searchParams.get("parentId");

    // Validate required parameters
    if (!vetId || !parentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required parameters: vetId and parentId",
          errorCode: "MISSING_PARAMETERS",
          errors: null,
        },
        { status: 400 }
      );
    }
    console.log("VET ID:", vetId);
    console.log("PARENT ID:", parentId);
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(vetId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid veterinarian ID format",
          errorCode: "INVALID_VET_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid parent ID format",
          errorCode: "INVALID_PARENT_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    // Check if review exists
    const existingReview = await ReviewModel.findOne({
      vetId: new mongoose.Types.ObjectId(vetId),
      parentId: new mongoose.Types.ObjectId(parentId),
      isDeleted: { $ne: true },
    });

    return NextResponse.json({
      success: true,
      message: existingReview
        ? "Review already exists for this veterinarian"
        : "No existing review found",
      data: {
        hasReview: !!existingReview,
        review: existingReview
          ? {
              id: existingReview._id,
              rating: existingReview.rating,
              comment: existingReview.comment,
              createdAt: existingReview.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error checking existing review:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check existing review",
        errorCode: "CHECK_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
