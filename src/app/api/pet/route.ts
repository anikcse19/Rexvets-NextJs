import { NextRequest, NextResponse } from "next/server";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { IPet } from "@/lib/interfaces";
import { connectToDatabase } from "@/lib/mongoose";
import { PetModel } from "@/models/Pet";
import { Types } from "mongoose";
const validatePet = (data: Partial<IPet>) => {
  const requiredFields = [
    "name",
    "image",
    "species",
    "breed",
    "gender",
    "primaryColor",
    "spayedNeutered",
    "weight",
    "weightUnit",
    "dateOfBirth",
    "parentId",
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof IPet]) {
      return `${field} is required`;
    }
  }

  if (!Types.ObjectId.isValid(data.parentId as any)) {
    return "Invalid parentId";
  }

  return null;
};

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile, {
      folder: "pets", // optional folder in Cloudinary
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

    return NextResponse.json({ success: true, pet });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create pet" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const petId = searchParams.get("petId");
    const searchQuery = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (petId) {
      if (!Types.ObjectId.isValid(petId)) {
        return NextResponse.json({ error: "Invalid pet ID" }, { status: 400 });
      }

      const pet = await PetModel.findById(petId).populate("parentId");
      if (!pet)
        return NextResponse.json({ error: "Pet not found" }, { status: 404 });

      return NextResponse.json({ pet });
    }

    // Build search filter
    const filter: any = {};
    if (searchQuery) {
      // case-insensitive search by name
      filter.name = { $regex: searchQuery, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [pets, total] = await Promise.all([
      PetModel.find(filter).populate("parentId").skip(skip).limit(limit),
      PetModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      pets,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("id");
    if (!petId || !Types.ObjectId.isValid(petId)) {
      return NextResponse.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    const body = await req.json();
    const error = validatePet({
      ...body,
      parentId: body.parentId || new Types.ObjectId(),
    });
    if (error) return NextResponse.json({ error }, { status: 400 });

    const updatedPet = await PetModel.findByIdAndUpdate(petId, body, {
      new: true,
    }).populate("parentId");

    if (!updatedPet)
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    return NextResponse.json({ success: true, pet: updatedPet });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update pet" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("id");
    if (!petId || !Types.ObjectId.isValid(petId)) {
      return NextResponse.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    const deletedPet = await PetModel.findByIdAndDelete(petId);
    if (!deletedPet)
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      message: "Pet deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete pet" },
      { status: 500 }
    );
  }
}
