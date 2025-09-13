// app/api/pharmacy-transfer/route.ts
import { connectToDatabase } from "@/lib/mongoose";
import { PharmacyTransferRequestModel } from "@/models/PharmacyTransferRequest";
import { NextRequest, NextResponse } from "next/server";

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
    })
    .populate('appointment', 'petParent pet appointmentDate')
    .populate('petParentId', 'name email')
    .populate({
      path: 'appointment',
      populate: {
        path: 'petParent',
        select: 'name email'
      }
    })
    .populate({
      path: 'appointment',
      populate: {
        path: 'pet',
        select: 'name'
      }
    })
    .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  await connectToDatabase();
  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status are required" },
        { status: 400 }
      );
    }

    const request = await PharmacyTransferRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
    .populate('appointment', 'petParent pet appointmentDate')
    .populate('petParentId', 'name email')
    .populate({
      path: 'appointment',
      populate: {
        path: 'petParent',
        select: 'name email'
      }
    })
    .populate({
      path: 'appointment',
      populate: {
        path: 'pet',
        select: 'name'
      }
    });

    if (!request) {
      return NextResponse.json(
        { success: false, message: "Pharmacy request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: request });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
