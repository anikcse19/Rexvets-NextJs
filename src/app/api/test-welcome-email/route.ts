import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    console.log("[TEST] Testing welcome email to:", email);
    
    await sendWelcomeEmail(email, name);
    
    return NextResponse.json({
      message: "Welcome email sent successfully",
      email: email
    });
  } catch (error: unknown) {
    console.error("[TEST] Failed to send welcome email:", error);
    return NextResponse.json(
      { 
        error: "Failed to send welcome email",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}