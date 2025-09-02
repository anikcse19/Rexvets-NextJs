import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, token, platform } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (platform === "mobile") updates["fcmTokens.mobile"] = token;
    else updates["fcmTokens.web"] = token;

    await User.updateOne({ _id: userId }, { $set: updates });

    return NextResponse.json({ success: true, message: "Token saved" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save token" },
      { status: 500 }
    );
  }
}
