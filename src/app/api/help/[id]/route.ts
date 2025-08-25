import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { helpUpdateSchema } from "@/lib/validation/help";
import { HelpModel } from "@/models";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

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
    if ((session as any).user.role !== "admin") {
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
          updatedAt: new Date(),
        },
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

/**
 * PUT /api/help/[id]
 *
 * Updates a help request by ID.
 * Path params:
 * - id: help request ID
 * Body: Partial help request data (name, phone, state, subject, details)
 */
export async function PUT(
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
          message: "Unauthorized. Please sign in to update help requests.",
          errorCode: "UNAUTHORIZED",
          errors: null,
        },
        { status: 401 }
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

    const body = await req.json();

    // Validate request body
    const validatedData = helpUpdateSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors: validatedData.error.issues.reduce((acc, issue) => {
            const field = issue.path.join(".");
            acc[field] = issue.message;
            return acc;
          }, {} as Record<string, string>),
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

    // Check if user is authorized to update this help request
    // Allow admin to update any help request, or user to update their own
    const isAdmin = (session as any).user.role === "admin";
    const isOwner =
      existingHelpRequest.email.toLowerCase() ===
      (session as any).user.email.toLowerCase();

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. You can only update your own help requests.",
          errorCode: "FORBIDDEN",
          errors: null,
        },
        { status: 403 }
      );
    }

    // Update the help request
    const updatedHelpRequest = await HelpModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...validatedData.data,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedHelpRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update help request",
          errorCode: "UPDATE_ERROR",
          errors: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Help request updated successfully",
      data: {
        id: updatedHelpRequest._id,
        role: updatedHelpRequest.role,
        name: updatedHelpRequest.name,
        email: updatedHelpRequest.email,
        phone: updatedHelpRequest.phone,
        state: updatedHelpRequest.state,
        subject: updatedHelpRequest.subject,
        details: updatedHelpRequest.details,
        createdAt: updatedHelpRequest.createdAt,
        updatedAt: updatedHelpRequest.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("PUT /api/help/[id] error:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors: Record<string, string> = {};
      Object.values(error.errors).forEach((err: any) => {
        validationErrors[err.path] = err.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errorCode: "VALIDATION_ERROR",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update help request",
        errorCode: "UPDATE_ERROR",
        errors: null,
      },
      { status: 500 }
    );
  }
}
