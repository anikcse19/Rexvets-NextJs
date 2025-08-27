import { NextResponse } from "next/server";
import { DataAssessmentPlanModel } from "@/models/DataAssessmentPlan";
import { connectToDatabase } from "@/lib/mongoose";
import { ISendResponse, sendResponse } from "@/lib/utils/send.response";

export async function GET(
  _req: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    await connectToDatabase();
    const { appointmentId } = params;

    console.log("Fetching plans for appointment:", appointmentId);

    const list = await DataAssessmentPlanModel.find({
      appointment: appointmentId,
      isDeleted: false,
    })
      .populate("veterinarian", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const response: ISendResponse<typeof list> = {
      success: true,
      data: list,
      statusCode: 201,
      message: "Data Assessment Plan fetch successfully",
    };
    return sendResponse(response);
  } catch (err) {
    console.error("Get by appointment error:", err);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
