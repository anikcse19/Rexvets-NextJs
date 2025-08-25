import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { PetModel } from "@/models/Pet";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ parentId: string }> }
) {
  try {
    await connectToDatabase();

    const { parentId } = await context.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid parent ID",
          errorCode: "INVALID_PARENT_ID",
          errors: null,
        },
        400
      );
    }

    // Find all pets for the given parentId, only those not deleted
    const pets = await PetModel.find({ parentId, isDeleted: false });

    // if (!pets || pets.length === 0) {
    //   return throwAppError(
    //     {
    //       success: false,
    //       message: "No pets found for this parent",
    //       errorCode: "NOT_FOUND",
    //       errors: null,
    //     },
    //     404
    //   );
    // }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Pets fetched successfully",
      data: pets,
    });
  } catch (error: any) {
    console.error("GET pets by parent error:", error);
    return throwAppError(
      {
        success: false,
        message: error.message || "Failed to fetch pets",
        errorCode: "FETCH_FAILED",
        errors: null,
      },
      500
    );
  }
}
