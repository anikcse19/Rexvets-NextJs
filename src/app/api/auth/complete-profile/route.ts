import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import PetParentModel from "@/models/PetParent";
import VeterinarianModel from "@/models/Veterinarian";
import VetTechModel from "@/models/VetTech";
import { z } from "zod";

// Validation schema for profile completion
const profileCompletionSchema = z.object({
  phoneNumber: z.string().optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      relationship: z.string().optional(),
    })
    .optional(),
  preferences: z
    .object({
      notifications: z.object({
        email: z.boolean(),
        sms: z.boolean(),
        push: z.boolean(),
      }),
      language: z.string(),
      timezone: z.string(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const session: Session | null = await getServerSession(authOptions as any);

    if (!(session?.user as any)?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validation = profileCompletionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      phoneNumber,
      state,
      city,
      address,
      zipCode,
      emergencyContact,
      preferences,
    } = validation.data;

    // Connect to database
    await connectToDatabase();

    // Find the user in the appropriate collection
    let user = await PetParentModel.findOne({
      email: (session?.user as any)?.email,
    });
    let userRole = "pet_parent";

    if (!user) {
      user = await VeterinarianModel.findOne({
        email: (session?.user as any)?.email,
      });
      userRole = "veterinarian";
    }

    if (!user) {
      user = await VetTechModel.findOne({
        email: (session?.user as any)?.email,
      });
      userRole = "technician";
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user profile with the provided information
    user.phoneNumber = phoneNumber;
    user.state = state;
    user.city = city || "";
    user.address = address || "";
    user.zipCode = zipCode || "";

    // Update emergency contact if provided
    if (emergencyContact) {
      user.emergencyContact = {
        name: emergencyContact.name || "",
        phone: emergencyContact.phone || "",
        relationship: emergencyContact.relationship || "",
      };
    }

    // Update preferences if provided
    if (preferences) {
      user.preferences = {
        notifications: {
          email: preferences.notifications.email,
          sms: preferences.notifications.sms,
          push: preferences.notifications.push,
        },
        language: preferences.language,
        timezone: preferences.timezone,
      };
    }

    // Save the updated user
    await user.save();

    console.log(
      `Profile completed for user: ${
        (session?.user as any)?.email
      } (${userRole})`
    );

    return NextResponse.json(
      {
        message: "Profile completed successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: userRole,
          phoneNumber: user.phoneNumber,
          state: user.state,
          city: user.city,
          address: user.address,
          zipCode: user.zipCode,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile completion error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    // Handle database connection errors
    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoServerSelectionError"
    ) {
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 503 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Failed to complete profile. Please try again." },
      { status: 500 }
    );
  }
}
