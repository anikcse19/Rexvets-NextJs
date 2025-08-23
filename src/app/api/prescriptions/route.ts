import { connectToDatabase } from "@/lib/mongoose";
import { sendResponse, throwAppError } from "@/lib/utils/send.response";
import { Prescription } from "@/models/Prescription";
import { NextRequest } from "next/server";

// CREATE Prescription
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const prescription = await Prescription.create(body);

    return sendResponse({
      statusCode: 201,
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message,
        errorCode: "CREATE_FAILED",
        errors: null,
      },
      500
    );
  }
}
// GET all Prescriptions
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    // Count total documents
    const totalDocs = await Prescription.countDocuments();

    // Fetch prescriptions with pagination
    const prescriptions = await Prescription.find()
      .populate("pet")
      .populate("parent")
      .populate("doctor")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalDocs / limit);

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Prescriptions fetched successfully",
      data: prescriptions,
      meta: { page, limit, totalPages },
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
