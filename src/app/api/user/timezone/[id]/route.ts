import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const session = await getServerSession(authOptions);
    console.log("CALLED TIMEZONE UPDATED API");
    // Check authentication
    if (!session?.user) {
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

    // Find current user data
    const currentUser = await User.findById(new Types.ObjectId(id)).select(
      "timezone"
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

    // Timezone is different, update the database
    const updatedUser = await User.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: { timezone: newTimezone } },
      {
        new: true,
        runValidators: true,
        select: "timezone",
      }
    );

    if (!updatedUser) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "Failed to update timezone",
        errorCode: "UPDATE_FAILED",
        errors: null,
      };
      return throwAppError(errResponse, 500);
    }
    console.log("UPDATED TIMEZONE");
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "Timezone updated successfully",
      data: {
        timezone: updatedUser.timezone,
        updated: true,
        previousTimezone: currentTimezone,
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
