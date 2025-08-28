import { connectToDatabase } from "@/lib/mongoose";
import { PrescriptionModel } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  try {
    await connectToDatabase();


    const prescriptions = await PrescriptionModel.find({
      appointment: appointmentId,
    });

    if (!prescriptions || prescriptions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No prescriptions found for this appointment",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: prescriptions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
