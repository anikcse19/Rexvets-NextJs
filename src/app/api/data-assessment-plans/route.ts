import { NextRequest, NextResponse } from "next/server";
import { DataAssessmentPlanModel } from "@/models/DataAssessmentPlan";
import { DataAssessmentPlanStatus } from "@/lib/types/dataAssessmentPlan";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { AppointmentModel } from "@/models";
import Veterinarian from "@/models/Veterinarian";

// POST /api/data-assessment-plans
export async function POST(req: NextRequest) {
  try {
    // 🔹 Step 1: Connect to DB
    try {
      await connectToDatabase();
    } catch (dbError: any) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Database connection failed",
        errorCode: "DB_CONNECTION_ERROR",
        errors: dbError,
      };
      return throwAppError(errResp, 500);
    }

    // 🔹 Step 2: Auth check
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError: any) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Session retrieval failed",
        errorCode: "SESSION_ERROR",
        errors: authError,
      };
      return throwAppError(errResp, 500);
    }

    if (!session?.user) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
        errors: null,
      };
      return throwAppError(errResp, 401);
    }

    // 🔹 Step 3: Parse body
    let body;
    try {
      body = await req.json();
    } catch (parseError: any) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Invalid JSON body",
        errorCode: "INVALID_JSON",
        errors: parseError,
      };
      return throwAppError(errResp, 400);
    }

    const {
      data,
      assessment,
      plan,
      veterinarian, // ObjectId string
      appointment, // ObjectId string
      status, // optional; defaults DRAFT
    } = body;

    // 🔹 Step 4: Validate required fields
    if (!data || !assessment || !plan || !veterinarian || !appointment) {
      const errResp: IErrorResponse = {
        success: false,
        message: "Validation error: Missing required fields",
        errorCode: "VALIDATION_ERROR",
        errors: {
          required: [
            "data",
            "assessment",
            "plan",
            "veterinarian",
            "appointment",
          ],
        },
      };
      return throwAppError(errResp, 400);
    }

    // 🔹 Step 5: Create document

    // ✅ Check if appointment exists
    const appointmentExists = await AppointmentModel.findById(appointment);
    if (!appointmentExists) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    // ✅ Check if veterinarian exists
    const vetExists = await Veterinarian.findById(veterinarian);
    if (!vetExists) {
      return NextResponse.json(
        { success: false, message: "Veterinarian not found" },
        { status: 404 }
      );
    }
    let doc;

    doc = await DataAssessmentPlanModel.create({
      data,
      assessment,
      plan,
      veterinarian,
      appointment,
      status: status ?? DataAssessmentPlanStatus.DRAFT,
    });

    // 🔹 Step 6: Success response
    const response: ISendResponse<typeof doc> = {
      success: true,
      data: doc,
      statusCode: 201,
      message: "Data Assessment Plan created successfully",
    };
    return sendResponse(response);
  } catch (err: any) {
    // 🔹 Final catch-all
    console.error("Unhandled Create DAP error:", err);
    const errResp: IErrorResponse = {
      success: false,
      message: "Unexpected server error",
      errorCode: "UNHANDLED_ERROR",
      errors: err?.message ?? err,
    };
    return throwAppError(errResp, 500);
  }
}

// GET /api/data-assessment-plans?appointment=...&veterinarian=...&status=...
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const appointment = searchParams.get("appointment");
    const veterinarian = searchParams.get("veterinarian");
    const status = searchParams.get(
      "status"
    ) as DataAssessmentPlanStatus | null;

    const filter: any = { isDeleted: false };
    if (appointment) filter.appointment = appointment;
    if (veterinarian) filter.veterinarian = veterinarian;
    if (status) filter.status = status;

    const list = await DataAssessmentPlanModel.find(filter)
      .populate("veterinarian", "name email") // populate vet details
      .sort({ createdAt: -1 })
      .lean();

    const response: ISendResponse<typeof list> = {
      success: true,
      data: list,
      statusCode: 201,
      message: "Data Assessment Plans fetched successfully",
    };
    return sendResponse(response);
  } catch (err) {
    console.error("List DAP error:", err);
    return NextResponse.json(
      { error: "Failed to fetch DataAssessmentPlans" },
      { status: 500 }
    );
  }
}
