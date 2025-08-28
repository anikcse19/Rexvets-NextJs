import { NextRequest, NextResponse } from "next/server";
import { DataAssessmentPlanModel } from "@/models/DataAssessmentPlan";
import { DataAssessmentPlanStatus } from "@/lib/types/dataAssessmentPlan";
import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const doc: any = await DataAssessmentPlanModel.findById(params.id)
      .populate("veterinarian", "name email")
      .lean();
    if (!doc || doc.isDeleted) {
      const response: IErrorResponse = {
        success: false,
        message: "Data Assessment Plan not found",
        errorCode: "NOT_FOUND",
        errors: null,
      };
      return throwAppError(response);
    }
    const response: ISendResponse<typeof doc> = {
      success: true,
      data: doc,
      statusCode: 201,
      message: "Data Assessment Plan details fetch successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    console.error("Get one DAP error:", err);
    const response: IErrorResponse = {
      success: false,
      message: "Failed to fetch Data Assessment Plan",
      errorCode: "FETCH_FAILED",
      errors: err,
    };
    return throwAppError(response);
  }
}

// PUT fully/partially update (except when already FINALIZED)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const current = await DataAssessmentPlanModel.findById(params.id);
    if (!current || current.isDeleted) {
      const response: IErrorResponse = {
        success: false,
        message: "Data Assessment Plan not found",
        errorCode: "NOT_FOUND",
        errors: null,
      };
      return throwAppError(response);
    }

    if (current.status === DataAssessmentPlanStatus.FINALIZED) {
      const response: IErrorResponse = {
        success: false,
        message:
          "Cannot edit a FINALIZED plan. Use a new document or allow admin override.",
        errorCode: "FINALIZED_NO_EDIT",
        errors: null,
      };
      return throwAppError(response);
    }

    // Only allow these fields to be updated
    const updatable: any = {};
    if (typeof body.data === "string") updatable.data = body.data;
    if (typeof body.assessment === "string")
      updatable.assessment = body.assessment;
    if (typeof body.plan === "string") updatable.plan = body.plan;
    if (typeof body.status === "string") updatable.status = body.status; // allow status change to FINALIZED here if you want

    const updated = await DataAssessmentPlanModel.findByIdAndUpdate(
      params.id,
      updatable,
      { new: true }
    );

    const response: ISendResponse<typeof updated> = {
      success: true,
      data: updated,
      statusCode: 201,
      message: "Data Assessment Plan details Update successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    console.error("Update DAP error:", err);
    const response: IErrorResponse = {
      success: false,
      message: "Failed to update Data Assessment Plan",
      errorCode: "UPDATE_FAILED",
      errors: err,
    };
    return throwAppError(response);
  }
}

// Soft delete
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const doc = await DataAssessmentPlanModel.findByIdAndUpdate(
      params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!doc) {
      const response: IErrorResponse = {
        success: false,
        message: "Data Assessment Plan not found",
        errorCode: "NOT_FOUND",
        errors: null,
      };
      return throwAppError(response);
    }

    const response: ISendResponse<typeof doc> = {
      success: true,
      statusCode: 201,
      message: "Data Assessment Plan deleted successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    console.error("Delete DAP error:", err);
    const response: IErrorResponse = {
      success: false,
      message: "Failed to delete Data Assessment Plan",
      errorCode: "DELETE_FAILED",
      errors: null,
    };
    return throwAppError(response);
  }
}
