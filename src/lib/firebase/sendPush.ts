// Simple wrapper around web-push (uses FCM legacy for web push)
// If you prefer FCM v1, replace with fetch to https://fcm.googleapis.com/fcm/send
export async function sendPushNotification({
  token,
  title,
  body,
  page,
}: {
  token: string;
  title: string;
  body: string;
  page?: string;
}) {
  if (!process.env.FCM_SERVER_KEY) {
    throw new Error("FCM_SERVER_KEY is not set");
  }

  const payload: any = {
    notification: {
      title,
      body,
      click_action: page || "/",
    },
    to: token,
    data: page ? { page } : undefined,
    priority: "high",
  };

  const res = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${process.env.FCM_SERVER_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`FCM error: ${res.status} ${text}`);
  }

  return res.json();
}
