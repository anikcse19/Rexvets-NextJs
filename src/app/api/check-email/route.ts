import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import VeterinarianModel from "@/models/Veterinarian";
import PetParentModel from "@/models/PetParent";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check in both Veterinarian and PetParent collections
    const [existingVet, existingPetParent] = await Promise.all([
      VeterinarianModel.findOne({ email }),
      PetParentModel.findOne({ email })
    ]);

    const isAvailable = !existingVet && !existingPetParent;

    return NextResponse.json({
      available: isAvailable,
      email: email
    });

  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
