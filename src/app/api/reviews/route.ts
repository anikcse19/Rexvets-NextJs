import { connectToDatabase } from "@/lib/mongoose";
import ReviewModel, { IReviewModel } from "@/models/Review";
import VeterinarianModel from "@/models/Veterinarian";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



// Validation schema for creating a review
const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
  appointmentDate: z.string(),
  vetId: z
    .string()
    .min(1)
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid vetId ID format",
    }),
  parentId: z
    .string()
    .min(1)
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid parent ID format",
    }),
  visible: z.boolean().optional().default(true),
});

// Validation schema for updating a review
const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(1).max(1000).optional(),
  visible: z.boolean().optional(),
});

// Utility function to update veterinarian review statistics
async function updateVeterinarianReviewStats(
  vetId: mongoose.Types.ObjectId,
  incrementReviewCount: number = 0,
  reviewId?: mongoose.Types.ObjectId,
  operation: 'add' | 'remove' | 'update' = 'update'
) {
  try {
    // Check if veterinarian exists
    const veterinarian = await VeterinarianModel.findById(vetId);
    if (!veterinarian) {
      console.error(`Veterinarian with ID ${vetId} not found`);
      return false;
    }

    // Get updated review statistics for this veterinarian
    const reviewStats = await (ReviewModel as IReviewModel).getReviewStats(vetId);
    
    // Prepare update object
    const updateData: any = {
      averageRating: reviewStats.averageRating,
      ratingCount: reviewStats.totalReviews,
    };

    // Handle review count increment/decrement
    if (incrementReviewCount !== 0) {
      updateData.$inc = { reviewCount: incrementReviewCount };
    }

    // Handle reviews array updates
    if (reviewId) {
      if (operation === 'add') {
        updateData.$push = { reviews: reviewId };
      } else if (operation === 'remove') {
        updateData.$pull = { reviews: reviewId };
      }
    }

    // Update the veterinarian
    await VeterinarianModel.findByIdAndUpdate(
      vetId,
      updateData,
      { new: true }
    );

    return true;
  } catch (error) {
    console.error("Error updating veterinarian review stats:", error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const vetId = searchParams.get("vetId");
    const parentId = searchParams.get("parentId");
    const rating = searchParams.get("rating");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: { $ne: true } };

    // Filter by doctor
    if (vetId) {
      if (!mongoose.Types.ObjectId.isValid(vetId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid doctor ID format",
            errorCode: "INVALID_ID",
            errors: null,
          },
          { status: 400 }
        );
      }
      query.vetId = new mongoose.Types.ObjectId(vetId);
    }

    // Filter by parent
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid parent ID format",
            errorCode: "INVALID_ID",
            errors: null,
          },
          { status: 400 }
        );
      }
      query.parentId = new mongoose.Types.ObjectId(parentId);
    }

    // Filter by rating
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Get reviews with pagination
    const reviews = await ReviewModel.find(query)
      .populate("vetId", "name specialization profileImage")
      .populate("parentId", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await ReviewModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews",
        errorCode: "FETCH_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validatedFields = createReviewSchema.safeParse(body);

    if (!validatedFields.success) {
      const errors: any = {};
      validatedFields.error.issues.forEach((issue: any) => {
        errors[issue.path[0]] = issue.message;
      });
      console.log("ERRORS: here", errors);
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

    const { rating, comment, appointmentDate, vetId, parentId, visible } =
      validatedFields.data;

    // Convert string IDs to ObjectIds
    const doctorObjectId = new mongoose.Types.ObjectId(vetId);
    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    // Check if review already exists for this appointment
    const existingReview = await ReviewModel.findOne({
      vetId: doctorObjectId,
      parentId: parentObjectId,
      appointmentDate,
      isDeleted: { $ne: true },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "A review already exists for this appointment",
          errorCode: "DUPLICATE_REVIEW",
          errors: null,
        },
        { status: 409 }
      );
    }

    // Create new review
    const review = new ReviewModel({
      rating,
      comment,
      appointmentDate,
      vetId: doctorObjectId,
      parentId: parentObjectId,
      visible,
    });

    await review.save();

    // Update Veterinarian model with new review statistics
    try {
      await updateVeterinarianReviewStats(doctorObjectId, 1, review._id, 'add');
    } catch (updateError) {
      console.error("Error updating veterinarian review stats:", updateError);
      // Don't fail the review creation if stats update fails
    }

    // Populate the review with doctor and parent details
    const populatedReview = await ReviewModel.findById(review._id)
      .populate("vetId", "name specialization profileImage")
      .populate("parentId", "name profileImage");

    return NextResponse.json(
      {
        success: true,
        message: "Review created successfully",
        data: populatedReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating review:", error);

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
        message: "Failed to create review",
        errorCode: "CREATE_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { reviewId, rating, comment, visible } = body;

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid review ID is required",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    // Find the existing review to get the veterinarian ID
    const existingReview = await ReviewModel.findById(reviewId);
    if (!existingReview) {
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

    // Update the review
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { rating, comment, visible },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
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

    // Update Veterinarian model with recalculated review statistics
    try {
      await updateVeterinarianReviewStats(existingReview.vetId);
    } catch (updateError) {
      console.error("Error updating veterinarian review stats:", updateError);
    }

    // Populate the updated review
    const populatedReview = await ReviewModel.findById(reviewId)
      .populate("vetId", "name specialization profileImage")
      .populate("parentId", "name profileImage");

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: populatedReview,
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

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { reviewId, ...updateFields } = body;

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid review ID is required",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    // Validate update fields
    const validatedFields = updateReviewSchema.safeParse(updateFields);
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

    // Find the existing review to get the veterinarian ID
    const existingReview = await ReviewModel.findById(reviewId);
    if (!existingReview) {
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

    // Update the review
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      validatedFields.data,
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
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

    // Update Veterinarian model with recalculated review statistics
    try {
      await updateVeterinarianReviewStats(existingReview.vetId);
    } catch (updateError) {
      console.error("Error updating veterinarian review stats:", updateError);
    }

    // Populate the updated review
    const populatedReview = await ReviewModel.findById(reviewId)
      .populate("vetId", "name specialization profileImage")
      .populate("parentId", "name profileImage");

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: populatedReview,
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

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid review ID is required",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    // Find the review to get the veterinarian ID before deletion
    const review = await ReviewModel.findById(reviewId);
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
    const deletedReview = await (ReviewModel as IReviewModel).softDelete(review._id);
    if (!deletedReview) {
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

    // Update Veterinarian model with recalculated review statistics
    try {
      await updateVeterinarianReviewStats(review.vetId, -1, review._id, 'remove');
    } catch (updateError) {
      console.error("Error updating veterinarian review stats:", updateError);
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (error: any) {
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
