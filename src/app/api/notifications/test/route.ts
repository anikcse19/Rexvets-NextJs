import { sendPushNotification } from "@/lib/firebase/sendPush";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, token, title, body, page } = await req.json();

    console.log("Received request data:", {
      userId,
      token: token ? "present" : "missing",
      title,
      body,
      page,
    });

    // Keys are validated in sendPush; keep basic visibility here
    const envVapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const envVapidPrivate = process.env.VAPID_PRIVATE_KEY;
    console.log("VAPID keys configured:", {
      public: !!envVapidPublic,
      private: !!envVapidPrivate,
    });
    if (!envVapidPublic || !envVapidPrivate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "VAPID keys are not configured. Please add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to your .env.local file.",
        },
        { status: 500 }
      );
    }

    let targetToken = token as string | undefined;

    // If no token provided, try to get from user's saved subscription
    if (!targetToken && userId) {
      const user = await User.findById(userId).select("fcmTokens");
      targetToken = user?.fcmTokens?.web;
      console.log(
        "Retrieved token from user:",
        targetToken ? "present" : "missing"
      );

      if (!targetToken) {
        return NextResponse.json(
          {
            success: false,
            message:
              "No push subscription found for this user. Please enable push notifications first.",
          },
          { status: 400 }
        );
      }
    }

    if (!targetToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No push subscription found. Provide token or userId with saved subscription.",
        },
        { status: 400 }
      );
    }

    console.log("Target token type:", typeof targetToken);
    console.log("Target token length:", targetToken.length);

    // Parse the subscription if it's a JSON string
    let subscription;
    try {
      if (typeof targetToken === "string") {
        subscription = JSON.parse(targetToken);
        console.log("Parsed subscription data:", subscription);
      } else {
        subscription = targetToken;
      }
    } catch (error) {
      console.error("Error parsing subscription:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid push subscription format.",
        },
        { status: 400 }
      );
    }

    // Validate subscription data
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      console.error("Invalid subscription data:", subscription);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid subscription data format.",
        },
        { status: 400 }
      );
    }

    console.log("Sending notification with subscription:", {
      endpoint: subscription.endpoint,
      hasKeys: !!subscription.keys,
      keysPresent: Object.keys(subscription.keys),
    });

    await sendPushNotification({
      token: subscription,
      title: title || "Test Notification",
      body: body || "Hello from Rexvet",
      page,
    });

    return NextResponse.json({ success: true, message: "Notification sent" });
  } catch (error: any) {
    console.error("Error in test notification route:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send notification",
      },
      { status: 500 }
    );
  }
}
