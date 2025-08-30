import { IUser } from "@/lib";
import { authOptions } from "@/lib/auth";
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

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    // const session = await getServerSession(authOptions);
    // if (!session?.user) {
    //   throw new Error("Unauthorized access");
    // }
    console.log(id);
    if (!id) {
      throw new Error("ID is required");
    }
    const user = await User.findOne({ _id: new Types.ObjectId(id) }).select(
      "-password"
    );
    if (!user) {
      throw new Error("User not found");
    }
    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "User fetched successfully",
      data: user,
    };
    return sendResponse(responseFormat);
  } catch (error: any) {
    const errResponse: IErrorResponse = {
      success: false,
      message: error.message || "Failed to fetch user",
      errorCode: "FETCH_ERROR",
      errors: null,
    };
    console.log("erorr", error);
    return throwAppError(errResponse, 500);
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
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

    // Remove password field from update data for security
    const { password, ...updateData } = body;

    // Define allowed fields for update (excluding sensitive fields)
    const allowedFields = [
      'name',
      'profileImage',
      'timezone',
      'fcmTokens',
      'isActive',
      'lastLogin',
      'googleAccessToken',
      'googleRefreshToken',
      'googleExpiresAt',
      'googleTokenType',
      'googleScope'
    ];

    // Filter out non-allowed fields
    const filteredUpdateData: any = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    // Check if there are any fields to update
    if (Object.keys(filteredUpdateData).length === 0) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "No valid fields provided for update",
        errorCode: "NO_VALID_FIELDS",
        errors: null,
      };
      return throwAppError(errResponse, 400);
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: filteredUpdateData },
      { 
        new: true, 
        runValidators: true,
        select: '-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken'
      }
    );

    if (!updatedUser) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResponse, 404);
    }

    const responseFormat: ISendResponse<any> = {
      statusCode: 200,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };

    return sendResponse(responseFormat);

  } catch (error: any) {
    console.error("PATCH user error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, any> = {};
      Object.keys(error.errors).forEach(key => {
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

    // Handle duplicate key errors
    if (error.code === 11000) {
      const errResponse: IErrorResponse = {
        success: false,
        message: "Duplicate field value",
        errorCode: "DUPLICATE_ERROR",
        errors: null,
      };
      return throwAppError(errResponse, 400);
    }

    const errResponse: IErrorResponse = {
      success: false,
      message: error.message || "Failed to update user",
      errorCode: "UPDATE_ERROR",
      errors: null,
    };
    return throwAppError(errResponse, 500);
  }
};
