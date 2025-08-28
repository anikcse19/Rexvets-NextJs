import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongoose";
import { PrescriptionModel } from "@/models";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const prescription = await PrescriptionModel.findById(params.id);
  if (!prescription)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(prescription);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const formData = await req.formData();
  const pdfFile = formData.get("pdf") as File | null;

  const updateData: any = {};
  if (formData.get("medication_details"))
    updateData.medication_details = JSON.parse(
      formData.get("medication_details") as string
    );
  if (formData.get("usage_instruction"))
    updateData.usage_instruction = JSON.parse(
      formData.get("usage_instruction") as string
    );
  if (formData.get("pharmacy"))
    updateData.pharmacy = JSON.parse(formData.get("pharmacy") as string);

  const existing = await PrescriptionModel.findById(params.id);
  if (!existing)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  if (pdfFile) {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "prescriptions", resource_type: "auto" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    updateData.pdfLink = uploadRes.secure_url;
    updateData.pdfPublicId = uploadRes.public_id;

    // delete old PDF if exists
    if (existing.pdfPublicId) {
      await cloudinary.uploader.destroy(existing.pdfPublicId, {
        resource_type: "auto",
      });
    }
  }

  const updated = await PrescriptionModel.findByIdAndUpdate(
    params.id,
    updateData,
    {
      new: true,
    }
  );
  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const existing = await PrescriptionModel.findById(params.id);
  if (!existing)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  if (existing.pdfPublicId) {
    await cloudinary.uploader.destroy(existing.pdfPublicId, {
      resource_type: "auto",
    });
  }

  await existing.deleteOne();
  return NextResponse.json({ message: "Deleted" });
}
