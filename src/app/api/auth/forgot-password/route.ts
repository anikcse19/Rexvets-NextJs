import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { sendPasswordReset } from "@/lib/email";

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const json = await req.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    // Always respond success to prevent email enumeration
    const genericSuccess = NextResponse.json({ success: true });

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return genericSuccess;
    }

    // Generate reset token and persist
    const token = user.generatePasswordResetToken();
    await user.save();

    try {
      await sendPasswordReset(email, token, user.name || email);
    } catch (err) {
      // Do not leak email delivery errors to the client
      console.error("Failed to dispatch reset email:", err);
    }

    return genericSuccess;
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json(
      { success: true },
      // Still return 200 to avoid user enumeration on server failures
      { status: 200 }
    );
  }
}


