import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { PetParentModel } from "@/models";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import { checkSubscriptionQuota } from "../subcription.utils";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const petParentId = searchParams.get("petParentId");
    const calendarYear = searchParams.get("calendarYear");

    // Validate required parameters
    if (!petParentId) {
      return throwAppError(
        {
          success: false,
          message: "petParentId is required",
          errorCode: "MISSING_PET_PARENT_ID",
          errors: { petParentId: "This field is required" },
        },
        400
      );
    }
    if (!Types.ObjectId.isValid(petParentId)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid petParentId",
          errorCode: "INVALID_PET_PARENT_ID",
          errors: { petParentId: "Invalid petParentId" },
        },
        400
      );
    }
    const existPetParent = await PetParentModel.findOne({
      _id: new Types.ObjectId(petParentId),
    });
    if (!existPetParent) {
      return throwAppError(
        {
          success: false,
          message: "Pet parent not found",
          errorCode: "PET_PARENT_NOT_FOUND",
          errors: { petParentId: "This field is required" },
        },
        400
      );
    }
    // Use current year if not provided
    const year = calendarYear
      ? parseInt(calendarYear)
      : new Date().getFullYear();

    // Check if year is valid
    if (isNaN(year) || year < 2020 || year > 2030) {
      return throwAppError(
        {
          success: false,
          message: "Invalid calendar year",
          errorCode: "INVALID_CALENDAR_YEAR",
          errors: {
            calendarYear: "Year must be between 2020 and 2030",
          },
        },
        400
      );
    }

    // Check subscription quota
    const hasQuota = await checkSubscriptionQuota(petParentId, year);

    return sendResponse({
      statusCode: 200,
      success: true,
      message: hasQuota
        ? "Subscription quota is available"
        : "No subscription quota available",
      data: {
        petParentId,
        calendarYear: year,
        hasQuota,
        quotaStatus: hasQuota ? "available" : "unavailable",
      },
    });
  } catch (error) {
    console.error("Error checking subscription quota:", error);
    return throwAppError(
      {
        success: false,
        message: "Failed to check subscription quota",
        errorCode: "SUBSCRIPTION_QUOTA_CHECK_FAILED",
        errors: {
          details:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      },
      500
    );
  }
};
