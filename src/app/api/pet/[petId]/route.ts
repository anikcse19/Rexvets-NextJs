import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { PetModel } from "@/models/Pet";
import mongoose, { Types } from "mongoose";
import { NextRequest } from "next/server";
//  Get single pet
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ petId: string }> }
) {
  try {
    await connectToDatabase();
    const { petId } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid pet ID",
        errorCode: "INVALID_PET_ID",
        errors: null,
      };
      return throwAppError(errResp, 400);
    }

    // ✅ Only return if not deleted
    const pet = await PetModel.findOne({
      _id: petId,
      isDeleted: false,
    });

    if (!pet) {
      return throwAppError(
        {
          success: false,
          message: "Pet not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Pet fetched successfully",
      data: pet,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message || "Failed to fetch pet",
        errorCode: "FETCH_FAILED",
        errors: null,
      },
      500
    );
  }
}

//  Update pet (partial update)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    await connectToDatabase();
    const { petId } = await params;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid pet ID",
          errorCode: "INVALID_PET_ID",
          errors: null,
        },
        400
      );
    }

    const body = await req.json();

    // ✅ Update only if not deleted
    const updatedPet = await PetModel.findOneAndUpdate(
      { _id: petId, isDeleted: false },
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPet) {
      return throwAppError(
        {
          success: false,
          message: "Pet not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Pet updated successfully",
      data: updatedPet,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message || "Failed to update pet",
        errorCode: "UPDATE_FAILED",
        errors: null,
      },
      500
    );
  }
}

// Soft delete pet
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    await connectToDatabase();
    const { petId } = await params;

    // Extract isDeleted from query params, default to false
    const { searchParams } = new URL(req.url);
    const isDeletedQuery = searchParams.get("isDeleted");
    const isDeleted = isDeletedQuery === "true";
    console.log("isDeleted:", isDeleted);
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return throwAppError(
        {
          success: false,
          message: "Invalid pet ID",
          errorCode: "INVALID_PET_ID",
          errors: null,
        },
        400
      );
    }
    console.log("petId", petId);
    // Only update if current isDeleted matches query (prevents duplicate deletion)
    const deletedPet = await PetModel.findOne(
      { _id: petId } // only update if not already in target state
    );
    if (!deletedPet) {
      return throwAppError(
        {
          success: false,
          message: "Pet not found or already in requested deleted state",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }
    deletedPet.isDeleted = isDeleted;
    await deletedPet.save({
      validateBeforeSave: true,
      new: true,
    });
    return sendResponse({
      statusCode: 200,
      success: true,
      message: `Pet ${isDeleted ? "deleted" : "restored"} successfully`,
      data: deletedPet,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message || "Failed to update pet deletion status",
        errorCode: "DELETE_FAILED",
        errors: null,
      },
      500
    );
  }
}
