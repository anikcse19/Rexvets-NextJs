import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { HelpModel } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * POST /api/help/bulk
 *
 * Bulk delete help requests (admin only).
 * Body: { action: 'delete', ids: string[] }
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please sign in to perform bulk operations.",
          errorCode: "UNAUTHORIZED",
          errors: null,
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    if ((session as any).user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin privileges required.",
          errorCode: "FORBIDDEN",
          errors: null,
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const { action, ids } = body;

    // Validate required fields
    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Action and IDs array are required",
          errorCode: "VALIDATION_ERROR",
          errors: {
            action: !action ? "Action is required" : undefined,
            ids: !ids ? "IDs array is required" : !Array.isArray(ids) ? "IDs must be an array" : ids.length === 0 ? "IDs array cannot be empty" : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length !== ids.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Some IDs are invalid",
          errorCode: "VALIDATION_ERROR",
          errors: {
            ids: "Some provided IDs are not valid ObjectId format",
          },
        },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      // Bulk soft delete
      const result = await HelpModel.updateMany(
        { 
          _id: { $in: validIds },
          isActive: true,
          isDeleted: { $ne: true }
        },
        { 
          $set: { 
            isDeleted: true, 
            isActive: false,
            updatedAt: new Date()
          } 
        }
      );

      return NextResponse.json({
        success: true,
        message: "Bulk delete operation completed successfully",
        data: {
          action,
          processedCount: result.modifiedCount,
          totalRequested: ids.length,
          successRate: `${((result.modifiedCount / ids.length) * 100).toFixed(1)}%`,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Only 'delete' is supported",
          errorCode: "VALIDATION_ERROR",
          errors: {
            action: "Action must be 'delete'",
          },
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("POST /api/help/bulk error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to perform bulk operation",
        errorCode: "BULK_OPERATION_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
