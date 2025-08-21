import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ReviewModel from "@/models/Review";
import PetParentModel from "@/models/PetParent";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parentId: string }> }
) {
  try {
    await connectToDatabase();
    
    const { parentId } = await params;
    
    // Validate ObjectId format
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
    
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Verify parent exists
    const parent = await PetParentModel.findOne({ 
      _id: parentId, 
      isActive: true, 
      isDeleted: { $ne: true } 
    });

    if (!parent) {
      return NextResponse.json(
        {
          success: false,
          message: "Pet parent not found",
          errorCode: "PARENT_NOT_FOUND",
          errors: null
        },
        { status: 404 }
      );
    }

    let query: any = { 
      parentId: new mongoose.Types.ObjectId(parentId), 
      isDeleted: { $ne: true } 
    };

    // Filter by rating
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Get reviews with pagination
    const reviews = await ReviewModel.find(query)
      .populate('doctorId', 'name specialization profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await ReviewModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      message: "Parent reviews fetched successfully",
      data: {
        parent: {
          id: parent._id,
          name: parent.name,
          profileImage: parent.profileImage,
        },
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
    console.error("Error fetching parent reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch parent reviews",
        errorCode: "FETCH_ERROR",
        errors: null
      },
      { status: 500 }
    );
  }
}
