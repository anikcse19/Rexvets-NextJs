import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ReviewModel from "@/models/Review";
import { z } from "zod";
import mongoose from "mongoose";

// Validation schema for creating a review
const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
  appointmentDate: z.string(),
  doctorId: z.string().min(1).refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid doctor ID format"
  }),
  parentId: z.string().min(1).refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid parent ID format"
  }),
  visible: z.boolean().optional().default(true),
});

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const parentId = searchParams.get('parentId');
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: { $ne: true } };

    // Filter by doctor
    if (doctorId) {
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid doctor ID format",
            errorCode: "INVALID_ID",
            errors: null
          },
          { status: 400 }
        );
      }
      query.doctorId = new mongoose.Types.ObjectId(doctorId);
    }

    // Filter by parent
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid parent ID format",
            errorCode: "INVALID_ID",
            errors: null
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
      .populate('doctorId', 'name specialization profileImage')
      .populate('parentId', 'name profileImage')
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
        errors: null
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
      
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors
        },
        { status: 400 }
      );
    }

    const { rating, comment, appointmentDate, doctorId, parentId, visible } = validatedFields.data;

    // Convert string IDs to ObjectIds
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);
    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    // Check if review already exists for this appointment
    const existingReview = await ReviewModel.findOne({
      doctorId: doctorObjectId,
      parentId: parentObjectId,
      appointmentDate,
      isDeleted: { $ne: true }
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "A review already exists for this appointment",
          errorCode: "DUPLICATE_REVIEW",
          errors: null
        },
        { status: 409 }
      );
    }

    // Create new review
    const review = new ReviewModel({
      rating,
      comment,
      appointmentDate,
      doctorId: doctorObjectId,
      parentId: parentObjectId,
      visible,
    });

    await review.save();

    // Populate the review with doctor and parent details
    const populatedReview = await ReviewModel.findById(review._id)
      .populate('doctorId', 'name specialization profileImage')
      .populate('parentId', 'name profileImage');

    return NextResponse.json({
      success: true,
      message: "Review created successfully",
      data: populatedReview,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);
    
    if (error.name === 'ValidationError') {
      const errors: any = {};
      Object.values(error.errors).forEach((err: any) => {
        errors[err.path] = err.message;
      });
      
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create review",
        errorCode: "CREATE_ERROR",
        errors: null
      },
      { status: 500 }
    );
  }
}
