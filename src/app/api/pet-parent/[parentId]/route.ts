import { connectToDatabase } from "@/lib/mongoose";
import { PetModel } from "@/models/Pet";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { parentId: string } }
) {
  try {
    await connectToDatabase();

    const { parentId } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return NextResponse.json({ error: "Invalid parent ID" }, { status: 400 });
    }

    // Find all pets for the given parentId
    const pets = await PetModel.find({ parentId, isDeleted: false });

    if (!pets || pets.length === 0) {
      return NextResponse.json(
        { error: "No pets found for this parent" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, pets }, { status: 200 });
  } catch (err) {
    console.error("GET pets by parent error:", err);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}
