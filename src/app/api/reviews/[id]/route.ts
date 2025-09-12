import { connectToDatabase } from "@/lib/mongoose";
import ReviewModel, { IReviewModel } from "@/models/Review";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for updating a review
const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(1).max(1000).optional(),
  visible: z.boolean().optional(),
  vetId: z.string().optional(),
  parentId: z.string().optional(),
  appointmentDate: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID format",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    const review = await ReviewModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    })
      .populate("vetId", "name specialization profileImage")
      .populate("parentId", "name profileImage");

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
          errorCode: "REVIEW_NOT_FOUND",
          errors: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review fetched successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID format",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedFields = updateReviewSchema.safeParse(body);

    if (!validatedFields.success) {
      const errors: any = {};
      validatedFields.error.issues.forEach((issue: any) => {
        errors[issue.path[0]] = issue.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors,
        },
        { status: 400 }
      );
    }

    const review = await ReviewModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Update review fields
    Object.assign(review, validatedFields.data);
    await review.save();

    // Populate the updated review
    const updatedReview = await ReviewModel.findById(id)
      .populate("vetId", "name specialization profileImage")
      .populate("parentId", "name profileImage");

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error: any) {
    console.error("Error updating review:", error);

    if (error.name === "ValidationError") {
      const errors: any = {};
      Object.values(error.errors).forEach((err: any) => {
        errors[err.path] = err.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update review",
        errorCode: "UPDATE_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID format",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    const review = await ReviewModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
          errorCode: "REVIEW_NOT_FOUND",
          errors: null,
        },
        { status: 404 }
      );
    }

    // Soft delete the review
    await (ReviewModel as IReviewModel).softDelete(
      new mongoose.Types.ObjectId(id)
    );

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review",
        errorCode: "DELETE_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
