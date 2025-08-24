import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { HelpModel } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * GET /api/help/[id]
 *
 * Returns a single help request by ID.
 * Path params:
 * - id: help request ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Help request ID is required",
          errorCode: "MISSING_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid help request ID format",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    const helpRequest = await HelpModel.findOne({
      _id: id,
      isActive: true,
      isDeleted: { $ne: true },
    });

    if (!helpRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Help request not found",
          errorCode: "HELP_REQUEST_NOT_FOUND",
          errors: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Help request retrieved successfully",
      data: {
        id: helpRequest._id,
        role: helpRequest.role,
        name: helpRequest.name,
        email: helpRequest.email,
        phone: helpRequest.phone,
        state: helpRequest.state,
        subject: helpRequest.subject,
        details: helpRequest.details,
        createdAt: helpRequest.createdAt,
        updatedAt: helpRequest.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("GET /api/help/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch help request",
        errorCode: "FETCH_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/help/[id]
 *
 * Soft deletes a help request by ID (admin only).
 * Path params:
 * - id: help request ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please sign in to delete help requests.",
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Help request ID is required",
          errorCode: "MISSING_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid help request ID format",
          errorCode: "INVALID_ID",
          errors: null,
        },
        { status: 400 }
      );
    }

    // Check if help request exists
    const existingHelpRequest = await HelpModel.findOne({
      _id: id,
      isActive: true,
      isDeleted: { $ne: true },
    });

    if (!existingHelpRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Help request not found",
          errorCode: "HELP_REQUEST_NOT_FOUND",
          errors: null,
        },
        { status: 404 }
      );
    }

    // Soft delete the help request
    const deletedHelpRequest = await HelpModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          isDeleted: true, 
          isActive: false,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!deletedHelpRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete help request",
          errorCode: "DELETE_ERROR",
          errors: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Help request deleted successfully",
      data: {
        id: deletedHelpRequest._id,
        role: deletedHelpRequest.role,
        name: deletedHelpRequest.name,
        email: deletedHelpRequest.email,
        phone: deletedHelpRequest.phone,
        state: deletedHelpRequest.state,
        subject: deletedHelpRequest.subject,
        details: deletedHelpRequest.details,
        isDeleted: deletedHelpRequest.isDeleted,
        updatedAt: deletedHelpRequest.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("DELETE /api/help/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete help request",
        errorCode: "DELETE_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
