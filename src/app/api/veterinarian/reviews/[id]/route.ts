import { connectToDatabase } from "@/lib/mongoose";
import { ReviewModel } from "@/models";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const vetId = id;
    if (!vetId || !mongoose.Types.ObjectId.isValid(vetId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid veterinarian id",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "20", 10), 1),
      100
    );

    const doctorObjectId = new mongoose.Types.ObjectId(vetId);

    const filter = {
      vetId: doctorObjectId,
      visible: true,
      isDeleted: { $ne: true },
    } as const;

    const [reviews, total, stats] = await Promise.all([
      ReviewModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit).populate("parentId", "name profileImage"),
      ReviewModel.countDocuments(filter),
      ReviewModel.aggregate([
        { $match: filter as any },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const averageRating =
      stats.length > 0
        ? Math.round((stats[0].averageRating || 0) * 10) / 10
        : 0;
    const reviewCount = stats.length > 0 ? stats[0].reviewCount || 0 : 0;

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
        stats: {
          averageRating,
          reviewCount,
        },
      },
    });
  } catch (error: any) {
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
