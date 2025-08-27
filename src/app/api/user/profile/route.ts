import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel from "@/models/PetParent";
import VeterinarianModel from "@/models/Veterinarian";
import VetTechModel from "@/models/VetTech";

export async function GET() {
  try {
    const session: Session | null = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const email = (session as any).user.email.toLowerCase();

    // Try each role collection by email
    const [petParent, veterinarian, vetTech] = await Promise.all([
      PetParentModel.findOne({ email }).lean(),
      VeterinarianModel.findOne({ email }).lean(),
      VetTechModel.findOne({ email }).lean(),
    ]);

    let data: any = null;

    if (petParent) {
      data = {
        role: "pet_parent",
        name:
          (petParent as any).name ||
          `${(petParent as any).firstName || ""} ${(petParent as any).lastName || ""}`.trim(),
        email: (petParent as any).email,
        phone: (petParent as any).phoneNumber || "",
        state: (petParent as any).state || "",
      };
    } else if (veterinarian) {
      data = {
        role: "veterinarian",
        name:
          (veterinarian as any).name ||
          `${(veterinarian as any).firstName || ""} ${(veterinarian as any).lastName || ""}`.trim(),
        email: (veterinarian as any).email,
        phone: (veterinarian as any).phone || "",
        state: (veterinarian as any).state || "",
      };
    } else if (vetTech) {
      data = {
        role: "technician",
        name:
          (vetTech as any).name ||
          `${(vetTech as any).firstName || ""} ${(vetTech as any).lastName || ""}`.trim(),
        email: (vetTech as any).email,
        phone: (vetTech as any).phone || "",
        state: (vetTech as any).state || "",
      };
    }

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("/api/user/profile error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



