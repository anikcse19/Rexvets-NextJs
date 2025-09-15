import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ReviewModel, { IReviewModel } from "@/models/Review";
import VeterinarianModel from "@/models/Veterinarian";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ doctorId: string }> }
) {
  try {
    await connectToDatabase();
    
    const { doctorId } = await params;
    
    // Validate ObjectId format
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
    
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    const includeStats = searchParams.get('stats') === 'true';

    // Verify doctor exists
    const doctor = await VeterinarianModel.findOne({ 
      _id: doctorId, 
      isActive: true, 
      isDeleted: { $ne: true } 
    });

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor not found",
          errorCode: "DOCTOR_NOT_FOUND",
          errors: null
        },
        { status: 404 }
      );
    }

    const query: any = { 
      doctorId: new mongoose.Types.ObjectId(doctorId), 
      isDeleted: { $ne: true },
      visible: true 
    };

    // Filter by rating
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Get reviews with pagination
    const reviews = await ReviewModel.find(query)
      .populate('parentId', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await ReviewModel.countDocuments(query);

    let stats = null;
    if (includeStats) {
      // Get review statistics
      stats = await (ReviewModel as IReviewModel).getReviewStats(new mongoose.Types.ObjectId(doctorId));
    }

    return NextResponse.json({
      success: true,
      message: "Doctor reviews fetched successfully",
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization,
          profileImage: doctor.profileImage,
        },
        reviews,
        stats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching doctor reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch doctor reviews",
        errorCode: "FETCH_ERROR",
        errors: null
      },
      { status: 500 }
    );
  }
}
