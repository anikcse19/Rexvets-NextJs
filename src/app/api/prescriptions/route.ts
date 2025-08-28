import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongoose";
import { PrescriptionModel } from "@/models/Prescription";
import {
  IErrorResponse,
  ISendResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";

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

    console.log("Filter:", filter);
    
    // First, let's see what's in the prescription without populate
    const rawPrescriptions = await PrescriptionModel.find(filter).sort({ createdAt: -1 });
    console.log("Raw prescription data:", rawPrescriptions[0] ? {
      id: rawPrescriptions[0]._id,
      veterinarian: rawPrescriptions[0].veterinarian,
      petParent: rawPrescriptions[0].petParent,
      appointment: rawPrescriptions[0].appointment,
      pet: rawPrescriptions[0].pet,
      veterinarianType: typeof rawPrescriptions[0].veterinarian,
      petParentType: typeof rawPrescriptions[0].petParent
    } : "No prescriptions found");
    
    // Check if referenced documents exist
    if (rawPrescriptions[0]) {
      const { VeterinarianModel, PetParentModel, AppointmentModel, PetModel } = await import("@/models");
      
      const vetExists = await VeterinarianModel.findById(rawPrescriptions[0].veterinarian);
      const petParentExists = await PetParentModel.findById(rawPrescriptions[0].petParent);
      const appointmentExists = await AppointmentModel.findById(rawPrescriptions[0].appointment);
      const petExists = await PetModel.findById(rawPrescriptions[0].pet);
      
      console.log("Referenced documents exist:", {
        veterinarian: !!vetExists,
        petParent: !!petParentExists,
        appointment: !!appointmentExists,
        pet: !!petExists
      });
      
      if (!vetExists) console.log("Veterinarian not found:", rawPrescriptions[0].veterinarian);
      if (!petParentExists) console.log("PetParent not found:", rawPrescriptions[0].petParent);
      if (!appointmentExists) console.log("Appointment not found:", rawPrescriptions[0].appointment);
      if (!petExists) console.log("Pet not found:", rawPrescriptions[0].pet);
    }
    
    // Let's check what documents actually exist in each collection
    const { VeterinarianModel, PetParentModel, AppointmentModel, PetModel } = await import("@/models");
    
    const vetCount = await VeterinarianModel.countDocuments();
    const petParentCount = await PetParentModel.countDocuments();
    const appointmentCount = await AppointmentModel.countDocuments();
    const petCount = await PetModel.countDocuments();
    
    console.log("Documents in collections:", {
      veterinarians: vetCount,
      petParents: petParentCount,
      appointments: appointmentCount,
      pets: petCount
    });
    
    // Get a few sample documents from each collection
    const sampleVet = await VeterinarianModel.findOne();
    const samplePetParent = await PetParentModel.findOne();
    const sampleAppointment = await AppointmentModel.findOne();
    const samplePet = await PetModel.findOne();
    
    console.log("Sample documents:", {
      veterinarian: sampleVet ? { id: sampleVet._id, name: sampleVet.name } : null,
      petParent: samplePetParent ? { id: samplePetParent._id, name: samplePetParent.name } : null,
      appointment: sampleAppointment ? { id: sampleAppointment._id, date: sampleAppointment.appointmentDate } : null,
      pet: samplePet ? { id: samplePet._id, name: samplePet.name } : null
    });
    
    // Try populate with explicit model references
    let prescriptions = await PrescriptionModel.find(filter)
      .populate("veterinarian", "name email specialization")
      .populate("petParent", "name email")
      .populate("appointment", "appointmentDate status")
      .populate("pet", "name species breed")
      .sort({ createdAt: -1 });

    const response: ISendResponse<typeof prescriptions> = {
      success: true,
      data: prescriptions,
      statusCode: 201,
      message: "Prescriptions fetched successfully",
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
