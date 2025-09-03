import webpush from "web-push";

// Load VAPID keys from environment
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as
  | string
  | undefined;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY as string | undefined;

// Debug logging
console.log("VAPID keys configured:", {
  public: !!VAPID_PUBLIC_KEY,
  private: !!VAPID_PRIVATE_KEY,
});

// Configure web-push with VAPID details
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:notifications@rexvet.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

// Define subscription data interface for server-side use
interface SubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function sendPushNotification({
  token,
  title,
  body,
  page,
}: {
  token: string | SubscriptionData | any; // Allow any for parsed objects
  title: string;
  body: string;
  page?: string;
}) {
  console.log("sendPushNotification called with:", {
    token,
    title,
    body,
    page,
  });
  console.log("Token type:", typeof token);

  if (!VAPID_PRIVATE_KEY || !VAPID_PUBLIC_KEY) {
    const error =
      "VAPID keys are not configured. Please add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to your .env.local file.";
    console.error(error);
    throw new Error(error);
  }

  // Create notification payload
  const payload = {
    title,
    body,
    icon: "/favicon-32x32.png", // Your app icon
    badge: "/favicon-32x32.png",
    tag: "notification",
    data: {
      page: page || "/",
      timestamp: Date.now(),
    },
    actions: [
      {
        action: "open",
        title: "Open",
        icon: "/favicon-32x32.png",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  try {
    // Convert token to web-push subscription format
    let subscriptionData: SubscriptionData;

    if (typeof token === "string") {
      // Parse string token
      try {
        subscriptionData = JSON.parse(token);
        console.log(
          "Parsed string token to subscription data:",
          subscriptionData
        );
      } catch (error) {
        throw new Error("Invalid push subscription format");
      }
    } else if (typeof token === "object" && token !== null) {
      // Check if it's a subscription object with required properties
      if (token.endpoint && token.keys && token.keys.p256dh && token.keys.auth) {
        subscriptionData = {
          endpoint: token.endpoint,
          keys: {
            p256dh: token.keys.p256dh,
            auth: token.keys.auth,
          },
        };
        console.log("Using token as subscription data:", subscriptionData);
      } else {
        throw new Error("Invalid subscription data format");
      }
    } else {
      throw new Error("Invalid token type");
    }

    // Validate subscription data
    if (
      !subscriptionData ||
      !subscriptionData.endpoint ||
      !subscriptionData.keys ||
      !subscriptionData.keys.p256dh ||
      !subscriptionData.keys.auth
    ) {
      console.error("Invalid subscription data:", subscriptionData);
      throw new Error("Invalid subscription data format");
    }

    console.log("Final subscription data for web-push:", subscriptionData);

    const result = await webpush.sendNotification(
      subscriptionData,
      JSON.stringify(payload)
    );
    console.log("Web push success:", result);
    return result;
  } catch (error: any) {
    console.error("Error sending web push notification:", error);

    // Handle specific web push errors
    if (error.statusCode === 410) {
      // Token is no longer valid
      throw new Error(
        "Push token is no longer valid. User may have unsubscribed."
      );
    } else if (error.statusCode === 429) {
      // Rate limited
      throw new Error("Too many requests. Please try again later.");
    } else if (error.statusCode === 400) {
      // Bad request
      throw new Error("Invalid request data.");
    } else {
      // Generic error
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }
}

// Helper function to generate VAPID keys
export function generateVAPIDKeys() {
  try {
    const vapidKeys = webpush.generateVAPIDKeys();
    return {
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey,
    };
  } catch (error) {
    console.error("Error generating VAPID keys:", error);
    throw new Error("Failed to generate VAPID keys");
  }
}

// Export VAPID public key for client-side use
export { VAPID_PUBLIC_KEY };

