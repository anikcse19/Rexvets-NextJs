import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import UserModel from "@/models/User";
import { z } from "zod";

const statusSchema = z.object({
  isOnline: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await req.json();
    const { isOnline } = statusSchema.parse(body);
    
    // Update user's online status
    await UserModel.findByIdAndUpdate(session.user.id, { 
      isOnline,
      ...(isOnline ? { lastLogin: new Date() } : {})
    });
    
    return NextResponse.json({
      success: true,
      message: `User status updated to ${isOnline ? "online" : "offline"}`,
    });
  } catch (error: any) {
    console.error("Error updating online status:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update online status" },
      { status: 500 }
    );
  }
}
