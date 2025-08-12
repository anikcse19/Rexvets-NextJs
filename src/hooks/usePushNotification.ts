"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

interface PushSubscriptionJSON {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const usePushNotification = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscriptionJSON | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Check if Push API and Notifications are supported
  useEffect(() => {
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setIsSupported(supported);
  }, []);

  // Get notification permission state
  useEffect(() => {
    if (!isSupported) return;
    setPermission(Notification.permission);
  }, [isSupported]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError("Push notifications are not supported in this browser.");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setError("Permission not granted for notifications.");
      } else {
        setError(null);
      }
    } catch (e) {
      console.error("Permission request error:", e);
      setError("Failed to request permission");
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(
    async (publicVapidKey: string, backendSaveUrl?: string) => {
      if (!isSupported) {
        setError("Push notifications are not supported.");
        return null;
      }
      if (permission !== "granted") {
        setError("Notification permission not granted.");
        return null;
      }

      try {
        // Register service worker
        await navigator.serviceWorker.register("/service-worker.js");

        // ✅ Wait for service worker to be active
        const registration = await navigator.serviceWorker.ready;

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        const subJson: PushSubscriptionJSON = subscription.toJSON() as any;

        // Optional: Send subscription to backend
        if (backendSaveUrl) {
          await fetch(backendSaveUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subJson),
          });
        }

        setSubscription(subJson);
        setError(null);
        return subJson;
      } catch (e: any) {
        console.error("Subscription error:", e);
        setError(e.message || "Subscription failed");
        return null;
      }
    },
    [isSupported, permission]
  );

  // Utility: Convert VAPID key from base64 string to Uint8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return {
    isSupported,
    permission,
    error,
    subscription,
    requestPermission,
    subscribeToPush,
  };
};

export default usePushNotification;
