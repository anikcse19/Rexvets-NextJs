import { NextRequest } from "next/server";

import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongoose";
import { PrescriptionModel } from "@/models";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import "@/models/Veterinarian";
import "@/models/PetParent";
import "@/models/Pet";
import "@/models/Appointment";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);

    const filter: any = {};
    if (searchParams.get("appointment")) {
      const appointmentId = searchParams.get("appointment");
      if (appointmentId && /^[0-9a-fA-F]{24}$/.test(appointmentId)) {
        filter.appointment = appointmentId;
      }
    }
    if (searchParams.get("veterinarian")) {
      const veterinarianId = searchParams.get("veterinarian");
      if (veterinarianId && /^[0-9a-fA-F]{24}$/.test(veterinarianId)) {
        filter.veterinarian = veterinarianId;
      }
    }
    if (searchParams.get("pet")) {
      const petId = searchParams.get("pet");
      if (petId && /^[0-9a-fA-F]{24}$/.test(petId)) {
        filter.pet = petId;
      }
    }
    if (searchParams.get("petParent")) {
      const petParentId = searchParams.get("petParent");
      if (petParentId && /^[0-9a-fA-F]{24}$/.test(petParentId)) {
        filter.petParent = petParentId;
      }
    }

    // Check if we should filter out orphaned prescriptions
    const excludeOrphaned = searchParams.get("excludeOrphaned") === "true";

    const prescriptions = await PrescriptionModel.find(filter)
      .populate("veterinarian")
      .populate("petParent")
      .populate("appointment")
      .populate("pet")
      .sort({ createdAt: -1 });

    // Filter out prescriptions with missing references if requested
    let finalPrescriptions = prescriptions;
    if (excludeOrphaned) {
      finalPrescriptions = prescriptions.filter(
        (prescription) =>
          prescription.veterinarian &&
          prescription.petParent &&
          prescription.appointment &&
          prescription.pet
      );
    }

    const orphanedCount = prescriptions.length - finalPrescriptions.length;
    const message =
      orphanedCount > 0
        ? `Prescriptions fetched successfully. ${orphanedCount} prescriptions have missing references.`
        : "Prescriptions fetched successfully";

    const response: ISendResponse<typeof finalPrescriptions> = {
      success: true,
      data: finalPrescriptions,
      statusCode: 201,
      message,
    };
    return sendResponse(response);
  } catch (error: any) {
    console.error("Error fetching prescriptions:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: "Unexpected server error",
      errorCode: "UNHANDLED_ERROR",
      errors: error?.message ?? error,
    };
    return throwAppError(errResp, 500);
  }
}

export async function POST(req: NextRequest) {
  console.log("Received POST request to create prescription");
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const pdfFile = formData.get("pdf") as File | null;

    const prescriptionData: any = {
      veterinarian: formData.get("veterinarian"),
      petParent: formData.get("petParent"),
      appointment: formData.get("appointment"),
      pet: formData.get("pet"),
      medication_details: JSON.parse(
        formData.get("medication_details") as string
      ),
      usage_instruction: JSON.parse(
        formData.get("usage_instruction") as string
      ),
      pharmacy: JSON.parse(formData.get("pharmacy") as string),
    };

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

      prescriptionData.pdfLink = uploadRes.secure_url;
      prescriptionData.pdfPublicId = uploadRes.public_id;
    }

    console.log("Creating prescription with data:", prescriptionData);

    const created = await PrescriptionModel.create(prescriptionData);
    const response: ISendResponse<typeof created> = {
      success: true,
      data: created,
      statusCode: 201,
      message: "Prescription created successfully",
    };
    return sendResponse(response);
  } catch (error: any) {
    console.log("Error creating prescription:", error);
    const errResp: IErrorResponse = {
      success: false,
      message: "Unexpected server error",
      errorCode: "UNHANDLED_ERROR",
      errors: error?.message ?? error,
    };
    return throwAppError(errResp, 500);
  }
}
