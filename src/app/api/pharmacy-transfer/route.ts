// app/api/pharmacy-transfer/route.ts
import { sendPharmacyAcceptedEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongoose";
import { PrescriptionModel } from "@/models";
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
    // Fetch transfer requests with related appointment & parent/pet populated
    const requests = await PharmacyTransferRequestModel.find({
      isDeleted: false,
    })
      .populate("appointment", "petParent pet appointmentDate")
      .populate("petParentId", "name email")
      .populate({
        path: "appointment",
        populate: [
          { path: "petParent", select: "name email" },
          { path: "pet", select: "name" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean(); // use lean so we can easily modify objects

    // For each request, fetch prescriptions for the appointment
    const requestsWithPrescriptions = await Promise.all(
      requests.map(async (req) => {
        const prescriptions = await PrescriptionModel.find({
          appointment: req.appointment?._id,
        }).select("pdfLink");

        // Attach just pdfLinks array to request object
        return {
          ...req,
          prescriptions: prescriptions.map((p) => p.pdfLink),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: requestsWithPrescriptions,
    });
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
    const { id, status, emailBody } = await req.json();

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
      .populate("appointment", "petParent pet appointmentDate")
      .populate("petParentId", "name email")
      .populate({
        path: "appointment",
        populate: {
          path: "petParent",
          select: "name email",
        },
      })
      .populate({
        path: "appointment",
        populate: {
          path: "pet",
          select: "name",
        },
      });

    if (!request) {
      return NextResponse.json(
        { success: false, message: "Pharmacy request not found" },
        { status: 404 }
      );
    }

    await sendPharmacyAcceptedEmail(emailBody);

    return NextResponse.json({ success: true, data: request });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
