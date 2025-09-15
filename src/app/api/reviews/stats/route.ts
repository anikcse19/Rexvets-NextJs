import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ReviewModel, { IReviewModel } from "@/models/Review";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (doctorId) {
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
      
      // Get stats for specific doctor
      const stats = await (ReviewModel as IReviewModel).getReviewStats(new mongoose.Types.ObjectId(doctorId));
      
      return NextResponse.json({
        success: true,
        message: "Review statistics fetched successfully",
        data: stats,
      });
    } else {
      // Get overall platform stats
      const [
        totalReviews,
        averageRating,
        ratingDistribution,
        recentReviews
      ] = await Promise.all([
        ReviewModel.countDocuments({ isDeleted: { $ne: true }, visible: true }),
        ReviewModel.aggregate([
          { $match: { isDeleted: { $ne: true }, visible: true } },
          { $group: { _id: null, averageRating: { $avg: '$rating' } } }
        ]),
        ReviewModel.aggregate([
          { $match: { isDeleted: { $ne: true }, visible: true } },
          { $group: { _id: '$rating', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]),
        ReviewModel.find({ isDeleted: { $ne: true }, visible: true })
          .populate('doctorId', 'name specialization')
          .populate('parentId', 'name')
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

      const avgRating = averageRating.length > 0 ? Math.round(averageRating[0].averageRating * 10) / 10 : 0;
      
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratingDistribution.forEach((item: any) => {
        distribution[item._id as keyof typeof distribution] = item.count;
      });

      return NextResponse.json({
        success: true,
        data: {
          totalReviews,
          averageRating: avgRating,
          ratingDistribution: distribution,
          recentReviews,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch review statistics",
        errorCode: "FETCH_ERROR",
        errors: null
      },
      { status: 500 }
    );
  }
}
