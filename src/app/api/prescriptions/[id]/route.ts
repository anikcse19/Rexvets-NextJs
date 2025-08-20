import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { Prescription } from "@/models/Prescription";
import { NextRequest } from "next/server";

// GET one
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const prescription = await Prescription.findById(id)
      .populate("pet")
      .populate("parent")
      .populate("doctor");

    if (!prescription) {
      return throwAppError(
        {
          success: false,
          message: "Prescription not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Prescription fetched successfully",
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
    const prescription = await Prescription.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!prescription) {
      return throwAppError(
        {
          success: false,
          message: "Prescription not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Prescription updated successfully",
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

    const prescription = await Prescription.findByIdAndDelete(id);

    if (!prescription) {
      return throwAppError(
        {
          success: false,
          message: "Prescription not found",
          errorCode: "NOT_FOUND",
          errors: null,
        },
        404
      );
    }

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Prescription deleted successfully",
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
