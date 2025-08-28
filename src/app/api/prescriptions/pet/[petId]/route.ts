import { connectToDatabase } from "@/lib/mongoose";
import { PrescriptionModel } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { petId: string } }
) {
  try {
    await connectToDatabase();
    const { petId } = params;

    const prescriptions = await PrescriptionModel.find({ pet: petId });
    if (!prescriptions || prescriptions.length === 0) {
      return NextResponse.json(
        { success: false, message: "No prescriptions found for this pet" },
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
