// app/api/pharmacy-transfer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PharmacyTransferRequestModel } from "@/models/PharmacyTransferRequest";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const request = await PharmacyTransferRequestModel.create(body);
    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const requests = await PharmacyTransferRequestModel.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
