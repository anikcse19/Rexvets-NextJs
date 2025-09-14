import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";

// GET /api/admin/moderators - Fetch all moderators
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const moderators = await UserModel.find({ 
      role: "moderator",
      isDeleted: { $ne: true }
    }).select("-password -emailVerificationToken -passwordResetToken -googleAccessToken -googleRefreshToken");

    return NextResponse.json({ moderators });
  } catch (error) {
    console.error("Error fetching moderators:", error);
    return NextResponse.json(
      { error: "Failed to fetch moderators" },
      { status: 500 }
    );
  }
}

// POST /api/admin/moderators - Create a new moderator
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, phone, accesslist, password } = await request.json();

    console.log("Received data:", { name, email, phone, accesslist, password: password ? "***" : "undefined" });

    if (!password || typeof password !== "string" || password.length < 8) {
      console.log("Password validation failed:", { password, type: typeof password, length: password?.length });
      return NextResponse.json(
        { error: "Password is required and must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!name || !email || !accesslist || !Array.isArray(accesslist)) {
      console.log("Missing required fields validation failed:", {
        name: !!name,
        email: !!email,
        accesslist: !!accesslist,
        isArray: Array.isArray(accesslist)
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Debug: Check the schema enum values
    const rolePath = UserModel.schema.paths.role as any;
    console.log("User schema role enum values:", rolePath.enumValues);

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log("Creating moderator with data:", {
      name,
      email,
      role: "moderator",
      accesslist,
      phone,
      passwordLength: password.length
    });

    const moderator = new UserModel({
      name,
      email,
      password: password, // Let the pre-save hook handle hashing
      role: "moderator",
      accesslist,
      phone,
      isEmailVerified: true, // Auto-verify for moderators
      isActive: true,
    });

    console.log("Moderator object created, attempting to save...");
    try {
      await moderator.save();
      console.log("Moderator saved successfully");
    } catch (saveError) {
      console.error("Error saving moderator:", saveError);
      throw saveError;
    }
    
    // Verify the moderator was saved correctly
    const savedModerator = await UserModel.findById(moderator._id).select("+password");
    console.log("Verification - saved moderator:", {
      id: savedModerator?._id,
      email: savedModerator?.email,
      role: savedModerator?.role,
      isActive: savedModerator?.isActive,
      isEmailVerified: savedModerator?.isEmailVerified,
      hasPassword: !!savedModerator?.password
    });

    // Return moderator without sensitive data
    const moderatorData = {
      _id: moderator._id,
      name: moderator.name,
      email: moderator.email,
      phone: moderator.phone,
      accesslist: moderator.accesslist,
      isActive: moderator.isActive,
      createdAt: moderator.createdAt,
      updatedAt: moderator.updatedAt,
    };

    return NextResponse.json({ moderator: moderatorData, success: true });
  } catch (error) {
    console.error("Error creating moderator:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: "Failed to create moderator", details: error.message },
      { status: 500 }
    );
  }
}
