import { connectToDatabase } from "@/lib/mongoose";
import { PrescriptionModel } from "@/models/Prescription";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { veterinarianId: string } }
) {
  try {
    await connectToDatabase();
    const { veterinarianId } = params;

    const prescriptions = await PrescriptionModel.find({
      veterinarian: veterinarianId,
    });

    if (!prescriptions || prescriptions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No prescriptions found for this veterinarian",
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
