import { connectToDatabase } from "@/lib/mongoose";
import { PetModel } from "@/models/Pet";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { petId: string } }
) {
  try {
    await connectToDatabase();

    const { petId } = params;

    // // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return NextResponse.json({ error: "Invalid pet ID" }, { status: 400 });
    }

    const pet = await PetModel.findById(petId);

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, pet: { id: petId } },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch pet" }, { status: 500 });
  }
}
