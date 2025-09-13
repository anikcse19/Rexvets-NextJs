import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

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

    const { name, email, phone, accesslist } = await request.json();

    if (!name || !email || !accesslist || !Array.isArray(accesslist)) {
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

    // Generate a temporary password (moderator will need to reset it)
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    console.log("Creating moderator with data:", {
      name,
      email,
      role: "moderator",
      accesslist,
      phone,
    });

    const moderator = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "moderator",
      accesslist,
      phone,
      isEmailVerified: true, // Auto-verify for moderators
      isActive: true,
    });

    console.log("Moderator object created, attempting to save...");
    await moderator.save();
    console.log("Moderator saved successfully");

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

    return NextResponse.json({ 
      moderator: moderatorData,
      tempPassword // Include temp password for admin to share with moderator
    });
  } catch (error) {
    console.error("Error creating moderator:", error);
    return NextResponse.json(
      { error: "Failed to create moderator" },
      { status: 500 }
    );
  }
}
