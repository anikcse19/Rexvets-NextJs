import { sendPushNotification } from "@/lib/firebase/sendPush";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, token, title, body, page } = await req.json();

    let targetToken = token as string | undefined;
    if (!targetToken && userId) {
      const user = await User.findById(userId).select("fcmTokens");
      targetToken = user?.fcmTokens?.web;
    }

    if (!targetToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No token found. Provide token or userId with saved token.",
        },
        { status: 400 }
      );
    }

    await sendPushNotification({
      token: targetToken,
      title: title || "Test Notification",
      body: body || "Hello from Rexvets",
      page,
    });

    return NextResponse.json({ success: true, message: "Notification sent" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send notification" },
      { status: 500 }
    );
  }
}
