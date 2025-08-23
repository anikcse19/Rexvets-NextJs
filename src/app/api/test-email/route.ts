import { NextResponse } from "next/server";
import { testEmailConfiguration } from "@/lib/email";

export async function GET() {
  try {
    const isConfigured = await testEmailConfiguration();
    
    if (isConfigured) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Email configuration is valid and ready to use!" 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email configuration is not set up. Please configure EMAIL_USER and EMAIL_PASS environment variables.",
          instructions: [
            "1. Set EMAIL_USER environment variable (your email address)",
            "2. Set EMAIL_PASS environment variable (your email password or app password)",
            "3. For Gmail, use an App Password instead of your regular password",
            "4. Restart your development server after setting environment variables"
          ]
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Email configuration test error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to test email configuration",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

