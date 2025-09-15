import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

const resetSchema = z.object({
  token: z.string().min(10),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include upper, lower, number, and special character"
    ),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const json = await req.json().catch(() => ({}));
    const parsed = resetSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const user = await (User as any).findByPasswordResetToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.password = password;
    user.passwordResetToken = undefined as unknown as string;
    user.passwordResetExpires = undefined as unknown as Date;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}


