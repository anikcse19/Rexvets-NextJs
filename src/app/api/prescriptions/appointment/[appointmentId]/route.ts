import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { PrescriptionModel } from "@/models/Prescription";
import { NextRequest, NextResponse } from "next/server";
import "@/models/Veterinarian";

export async function GET(
  req: NextRequest,
  { params }: { params: { appointmentId: string } }
) {
  try {
    await connectToDatabase();
    const { appointmentId } = params;

    const prescriptions = await PrescriptionModel.find({
      appointment: appointmentId,
    }).populate("veterinarian", "name licenses");

    if (!prescriptions || prescriptions.length === 0) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Prescription not found",
        errorCode: "NOT_FOUND",
        errors: null,
      };
      return throwAppError(errResp, 500);
    }

    const response: ISendResponse<typeof prescriptions> = {
      success: true,
      data: prescriptions,
      statusCode: 201,
      message: "Prescriptions fetched successfully",
    };
    return sendResponse(response);
  } catch (error: any) {
    const errResp: IErrorResponse = {
      success: false,
      message: "Unexpected server error",
      errorCode: "UNHANDLED_ERROR",
      errors: error?.message ?? error,
    };
    return throwAppError(errResp, 500);
  }
}
