import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import PetParent from "@/models/PetParent";
import User from "@/models/User";
import Veterinarian from "@/models/Veterinarian";
import mongoose, { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const authSession = await getServerSession(authOptions);
    // Check authentication
    if (!authSession?.user) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "Unauthorized access",
        errorCode: "UNAUTHORIZED",
        errors: null,
      };
      return throwAppError(errResponse, 401);
    }

    // Validate ID
    if (!id) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "User ID is required",
        errorCode: "INVALID_ID",
        errors: null,
      };
      return throwAppError(errResponse, 400);
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "Invalid user ID format",
        errorCode: "INVALID_ID_FORMAT",
        errors: null,
      };
      return throwAppError(errResponse, 400);
    }

    // Get request body
    const body = await request.json();
    const { timezone } = body;

    // Validate timezone field
    if (!timezone) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "Timezone is required",
        errorCode: "MISSING_TIMEZONE",
        errors: null,
      };
      return throwAppError(errResponse, 400);
    }

    if (typeof timezone !== "string") {
      const errResponse: IErrorResponse = {
        success: false,
        message: "Timezone must be a string",
        errorCode: "INVALID_TIMEZONE_TYPE",
        errors: null,
      };
      return throwAppError(errResponse, 400);
    }

    // Find current user data with role and references
    const currentUser = await User.findById(new Types.ObjectId(id)).select(
      "timezone role petParentRef veterinarianRef"
    );

    if (!currentUser) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResponse, 404);
    }

    // Check if timezone is different
    const currentTimezone = currentUser.timezone || "";
    const newTimezone = timezone.trim();

    if (currentTimezone === newTimezone) {
      // Timezone is the same, no need to update
      const responseFormat: ISendResponse<any> = {
        statusCode: 200,
        success: true,
        message: "Timezone is already up to date",
        data: {
          timezone: currentTimezone,
          updated: false,
        },
      };
      return sendResponse(responseFormat);
    }

    // Validate role and reference before attempting transaction
    if (
      (currentUser.role === "pet_parent" && !currentUser.petParentRef) ||
      (currentUser.role === "veterinarian" && !currentUser.veterinarianRef)
    ) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "User role reference not found",
        errorCode: "MISSING_ROLE_REFERENCE",
        errors: null,
      };
      return throwAppError(errResponse, 400);
    }

      // For admin and moderator roles, we only update the User model directly
    if (currentUser.role === "admin" || currentUser.role === "moderator") {
      const updatedUser = await User.findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: { timezone: newTimezone } },
        { new: true, runValidators: true, select: "_id timezone role" }
      );

      if (!updatedUser) {
        const errResponse: IErrorResponse = {
          success: false,
          message: "Failed to update user timezone",
          errorCode: "UPDATE_FAILED",
          errors: null,
        };
        return throwAppError(errResponse, 500);
      }

      const responseFormat: ISendResponse<any> = {
        statusCode: 200,
        success: true,
        message: "Timezone updated successfully",
        data: {
          timezone: updatedUser.timezone,
          updated: true,
          role: updatedUser.role,
        },
      };
      return sendResponse(responseFormat);
    }

    // Perform atomic updates using mongoose session
    const dbSession = await mongoose.startSession();
    let domainUpdateOk = false;
    try {
      await dbSession.withTransaction(async () => {
        if (currentUser.role === "pet_parent" && currentUser.petParentRef) {
          const updated = await PetParent.findByIdAndUpdate(
            currentUser.petParentRef,
            { $set: { timezone: newTimezone } },
            { new: true, runValidators: true, select: "_id timezone", session: dbSession }
          );
          if (!updated) throw new Error("PET_PARENT_UPDATE_FAILED");
          domainUpdateOk = true;
        } else if (currentUser.role === "veterinarian" && currentUser.veterinarianRef) {
          const updated = await Veterinarian.findByIdAndUpdate(
            currentUser.veterinarianRef,
            { $set: { timezone: newTimezone } },
            { new: true, runValidators: true, select: "_id timezone", session: dbSession }
          );
          if (!updated) throw new Error("VETERINARIAN_UPDATE_FAILED");
          domainUpdateOk = true;
        }

        // Keep User.timezone in sync
        const u = await User.findByIdAndUpdate(
          new Types.ObjectId(id),
          { $set: { timezone: newTimezone } },
          { new: false, session: dbSession }
        );
        if (!u) throw new Error("USER_UPDATE_FAILED");
      });
    } finally {
      await dbSession.endSession();
    }

    if (!domainUpdateOk) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "Failed to update timezone for role entity",
        errorCode: "ROLE_UPDATE_FAILED",
        errors: null,
      };
      return throwAppError(errResponse, 500);
    }
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Timezone updated successfully",
      data: {
        timezone: newTimezone,
        updated: true,
        previousTimezone: currentTimezone,
        role: currentUser.role,
      },
    };

    return sendResponse(responseFormat);
  } catch (error: any) {
    console.error("PATCH user timezone error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors: Record<string, any> = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      const errResponse: IErrorResponse = {
        success: false,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        errors: validationErrors,
      };
      return throwAppError(errResponse, 400);
    }

    const errResponse: IErrorResponse = {
      success: false,
      message: error.message || "Failed to update timezone",
      errorCode: "TIMEZONE_UPDATE_ERROR",
      errors: null,
    };
    return throwAppError(errResponse, 500);
  }
};
