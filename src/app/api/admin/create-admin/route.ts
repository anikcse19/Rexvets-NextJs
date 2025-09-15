import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(req: NextRequest) {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Admin creation not allowed in production" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const json = await req.json().catch(() => ({}));
    const parsed = createAdminSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: email.toLowerCase(), 
      role: "admin" 
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Create admin user
    const adminUser = new User({
      email: email.toLowerCase(),
      password,
      name,
      role: "admin",
      isEmailVerified: true, // Auto-verify admin accounts
      isActive: true,
      accesslist: ["Dashboard", "Appointments", "Doctors", "Pet Parents", "Donations", "Reviews", "Support", "Video Monitoring", "System Update", "Settings"],
    });

    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      data: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create admin account" },
      { status: 500 }
    );
  }
}
