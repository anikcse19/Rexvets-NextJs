import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { PetHistoryModel } from "@/models/PetHistory";
import "@/models/Veterinarian";
import "@/models/Appointment";
import "@/models/PetParent";
import "@/models/Pet";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  // Get query params from URL
  const url = new URL(req.url);
  const petId = url.searchParams.get("petId");
  const veterinarianId = url.searchParams.get("veterinarianId");

  if (!petId || !veterinarianId) {
    return NextResponse.json(
      { error: "petId and veterinarianId are required" },
      { status: 400 }
    );
  }

  // Validate ObjectId
  if (
    !mongoose.Types.ObjectId.isValid(petId) ||
    !mongoose.Types.ObjectId.isValid(veterinarianId)
  ) {
    const errResp: IErrorResponse = {
      success: false,
      message: "Invalid petId or veterinarianId",
      errorCode: "UNHANDLED_ERROR",
      errors: null,
    };
    return throwAppError(errResp, 500);
  }

  try {
    const history = await PetHistoryModel.find({
      pet: new mongoose.Types.ObjectId(petId),
      veterinarian: new mongoose.Types.ObjectId(veterinarianId),
    })
      .populate("pet")
      .populate("petParent")
      .populate("veterinarian", "name email")
      .populate("appointment")
      .sort({ visitDate: -1 });

    const response: ISendResponse<typeof history> = {
      success: true,
      data: history,
      statusCode: 201,
      message: "Pet history fetch successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    const errResp: IErrorResponse = {
      success: false,
      message: "Unexpected server error",
      errorCode: "UNHANDLED_ERROR",
      errors: err?.message ?? err,
    };
    return throwAppError(errResp, 500);
  }
}
