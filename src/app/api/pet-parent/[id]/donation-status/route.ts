import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import PetParent from "@/models/PetParent";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const { id } = await params;

    if (!id) {
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

    const petParent = await PetParent.findById(id).select('donationPaid lastDonationDate lastDonationAmount');
    
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

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Donation status retrieved successfully",
      data: {
        donationPaid: petParent.donationPaid,
        lastDonationDate: petParent.lastDonationDate,
        lastDonationAmount: petParent.lastDonationAmount,
      },
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: "Failed to retrieve donation status",
        errorCode: "FETCH_ERROR",
        errors: error?.errors || { message: error.message },
      },
      500
    );
  }
}
