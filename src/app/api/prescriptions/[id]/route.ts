import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { PrescriptionModel } from "@/models/Prescription";
import { NextRequest } from "next/server";

// GET one
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const prescription = await PrescriptionModel.findById(id)
      .populate("pet")
      .exec();

    if (!prescription) {
      return throwAppError(
        {
          success: false,
          message: "PrescriptionModel not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "PrescriptionModel fetched successfully",
      data: prescription,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message,
        errorCode: "FETCH_FAILED",
        errors: null,
      },
      500
    );
  }
}

// UPDATE
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    // partial update
    const prescription = await PrescriptionModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!prescription) {
      return throwAppError(
        {
          success: false,
          message: "PrescriptionModel not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "PrescriptionModel updated successfully",
      data: prescription,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message,
        errorCode: "UPDATE_FAILED",
        errors: null,
      },
      500
    );
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const prescription = await PrescriptionModel.findByIdAndDelete(id);

    if (!prescription) {
      return throwAppError(
        {
          success: false,
          message: "PrescriptionModel not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "PrescriptionModel deleted successfully",
      data: null,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message,
        errorCode: "DELETE_FAILED",
        errors: null,
      },
      500
    );
  }
}
