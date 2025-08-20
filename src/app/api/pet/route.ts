import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongoose";
import {
  IErrorResponse,
  sendResponse,
  throwAppError,
} from "@/lib/utils/send.response";
import { PetModel } from "@/models/Pet";
import PetParent from "@/models/PetParent";
import { Types } from "mongoose";
import { NextRequest } from "next/server";

// Create a new pet
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return throwAppError(
        {
          success: false,
          message: "Image is required",
          errorCode: "IMAGE_REQUIRED",
          errors: null,
        },
        400
      );
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile, {
      folder: "pets",
      resource_type: "image",
    });

    // Build pet data
    const petData = {
      name: formData.get("name") as string,
      image: uploadResult.secure_url,
      species: formData.get("species") as string,
      breed: formData.get("breed") as string,
      gender: formData.get("gender") as string,
      primaryColor: formData.get("primaryColor") as string,
      spayedNeutered: formData.get("spayedNeutered") as string,
      weight: Number(formData.get("weight")),
      weightUnit: formData.get("weightUnit") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      parentId: formData.get("parentId") as string,
      allergies: formData.getAll("allergies") as string[],
      medicalConditions: formData.getAll("medicalConditions") as string[],
      currentMedications: formData.getAll("currentMedications") as string[],
      healthStatus: (formData.get("healthStatus") as string) || "Unknown",
      emergencyContact: formData.get("emergencyContact") as string,
      veterinarianNotes: formData.get("veterinarianNotes") as string,
      lastVisit: formData.get("lastVisit") as string,
      nextVaccination: formData.get("nextVaccination") as string,
    };

    const pet = new PetModel(petData);
    await pet.save();

    return sendResponse({
      statusCode: 201,
      success: true,
      message: "Pet created successfully",
      data: pet,
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message || "Failed to create pet",
        errorCode: "CREATE_FAILED",
        errors: null,
      },
      500
    );
  }
}

// Get pets
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);

    const searchQuery = searchParams.get("searchQuery") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Always filter out deleted pets
    const filter: any = { isDeleted: false };

    // Apply search on name OR breed
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { breed: { $regex: searchQuery, $options: "i" } },
        { gender: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [pets, total] = await Promise.all([
      PetModel.find(filter).skip(skip).limit(limit),
      PetModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return sendResponse({
      statusCode: 200,
      success: true,
      message: "Pets fetched successfully",
      data: pets,
      meta: {
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: any) {
    return throwAppError(
      {
        success: false,
        message: error.message || "Failed to fetch pets",
        errorCode: "FETCH_FAILED",
        errors: null,
      },
      500
    );
  }
}
