import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import PetParent from "@/models/PetParent";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { petParentId, donationPaid, lastDonationAmount, lastDonationDate } = body;

    if (!petParentId) {
      return throwAppError(
        {
          success: false,
          message: "Pet parent ID is required",
          errorCode: "MISSING_PET_PARENT_ID",
          errors: null,
        },
        400
      );
    }

    const petParent = await PetParent.findById(petParentId);
    if (!petParent) {
      return throwAppError(
        {
          success: false,
          message: "Pet parent not found",
          errorCode: "PET_PARENT_NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    // Update donation status
    petParent.donationPaid = donationPaid;
    if (lastDonationAmount) {
      petParent.lastDonationAmount = lastDonationAmount;
    }
    if (lastDonationDate) {
      petParent.lastDonationDate = new Date(lastDonationDate);
    }

    await petParent.save();

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Donation status updated successfully",
      data: {
        donationPaid: petParent.donationPaid,
        lastDonationAmount: petParent.lastDonationAmount,
        lastDonationDate: petParent.lastDonationDate,
      },
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: "Failed to update donation status",
        errorCode: "UPDATE_ERROR",
        errors: error?.errors || { message: error.message },
      },
      500
    );
  }
}
