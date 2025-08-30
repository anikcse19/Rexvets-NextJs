import { NextResponse } from "next/server";
import { DataAssessmentPlanModel } from "@/models/DataAssessmentPlan";
import { DataAssessmentPlanStatus } from "@/lib/types/dataAssessmentPlan";
import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();

    const doc = await DataAssessmentPlanModel.findById(id);
    if (!doc || doc.isDeleted) {
      const response: IErrorResponse = {
        success: false,
        message: "Data Assessment Plan not found",
        errorCode: "NOT_FOUND",
        errors: null,
      };
      return throwAppError(response);
    }

    if (doc.status === DataAssessmentPlanStatus.FINALIZED) {
      const response: ISendResponse<typeof doc> = {
        success: true,
        data: doc,
        statusCode: 201,
        message: "Already finalized",
      };
      return sendResponse(response); // already finalized
    }

    doc.status = DataAssessmentPlanStatus.FINALIZED;
    await doc.save();

    const response: ISendResponse<typeof doc> = {
      success: true,
      data: doc,
      statusCode: 201,
      message: "Data Assessment Plan finalized successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    console.error("Finalize DAP error:", err);
    const response: IErrorResponse = {
      success: false,
      message: "Failed to finalize Data Assessment Plan",
      errorCode: "FINALIZE_FAILED",
      errors: err,
    };
    return throwAppError(response);
  }
}
