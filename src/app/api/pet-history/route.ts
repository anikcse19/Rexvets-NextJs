import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { PetHistoryModel } from "@/models/PetHistory";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json(); // <-- Important in App Router
    const {
      pet,
      veterinarian,
      appointment,
      visitDate,
      diagnosis,
      treatment,
      medications,
      notes,
      followUpNeeded,
      followUpDate,
    } = body;

    // Validate required fields (optional but safer)
    if (!pet || !veterinarian || !appointment || !visitDate) {
      const errResp: IErrorResponse = {
        success: false,
        message: "pet, veterinarian, appointment, and visitDate are required",
        errorCode: "NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 500);
    }

    const history = await PetHistoryModel.create({
      pet,
      veterinarian,
      appointment,
      visitDate,
      diagnosis,
      treatment,
      medications,
      notes,
      followUpNeeded,
      followUpDate,
    });

    const response: ISendResponse<typeof history> = {
      success: true,
      data: history,
      statusCode: 201,
      message: "Pet History created successfully",
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
