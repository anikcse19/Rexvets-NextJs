import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel from "@/models/PetParent";
import VeterinarianModel from "@/models/Veterinarian";
import VetTechModel from "@/models/VetTech";

export async function GET() {
  try {
    // Get session to verify authentication
    const session: Session | null = await getServerSession(authOptions as any);
    
    if (!(session as any)?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to view your profile." },
        { status: 401 }
      );
    }

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    const userEmail = (session as any).user.email.toLowerCase();
    const userRole = (session as any).user.role;

    let userData = null;

    // Find user data based on role
    switch (userRole) {
      case "pet_parent":
        const petParent = await PetParentModel.findOne({ 
          email: userEmail,
          isActive: true 
        }).select('-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken');

        if (petParent) {
          userData = {
            role: "pet_parent",
            name: petParent.name || `${petParent.firstName || ""} ${petParent.lastName || ""}`.trim(),
            email: petParent.email,
            phone: petParent.phoneNumber || "",
            state: petParent.state || "",
            city: petParent.city || "",
            address: petParent.address || "",
          };
        }
        break;

      case "veterinarian":
        const veterinarian = await VeterinarianModel.findOne({ 
          email: userEmail,
          isActive: true 
        }).select('-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken');

        if (veterinarian) {
          userData = {
            role: "veterinarian",
            name: veterinarian.name || `${veterinarian.firstName || ""} ${veterinarian.lastName || ""}`.trim(),
            email: veterinarian.email,
            phone: veterinarian.phone || "",
            state: veterinarian.state || "",
            city: veterinarian.city || "",
            address: veterinarian.address || "",
          };
        }
        break;

      case "technician":
        const vetTech = await VetTechModel.findOne({ 
          email: userEmail,
          isActive: true 
        }).select('-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken');

        if (vetTech) {
          userData = {
            role: "technician",
            name: vetTech.name || `${vetTech.firstName || ""} ${vetTech.lastName || ""}`.trim(),
            email: vetTech.email,
            phone: vetTech.phone || "",
            state: vetTech.state || "",
            city: vetTech.city || "",
            address: vetTech.address || "",
          };
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid user role." },
          { status: 400 }
        );
    }

    if (!userData) {
      return NextResponse.json(
        { error: "User profile not found or inactive." },
        { status: 404 }
      );
    }

    // Return user data for help form
    return NextResponse.json({
      success: true,
      data: userData
    }, { status: 200 });

  } catch (error: any) {
    console.error("User profile retrieval error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
