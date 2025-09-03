import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { PharmacyTransferRequestModel } from "@/models/PharmacyTransferRequest";
import "@/models/Appointment";

interface Params {
  petParentId: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ petParentId: string }> }
) {
  await connectToDatabase();

  try {
    const { petParentId } = await params;

    if (!petParentId) {
      return NextResponse.json(
        { success: false, message: "Pet parent ID is required" },
        { status: 400 }
      );
    }

    const requests = await PharmacyTransferRequestModel.find({ petParentId })
      .populate([
        {
          path: "appointment",
          populate: [{ path: "veterinarian", model: "Veterinarian" }],
        },
        { path: "petParentId", model: "PetParent" },
      ])
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
