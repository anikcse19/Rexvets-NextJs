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

  // Check if Push API and Notifications supported
  useEffect(() => {
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setIsSupported(supported);
  }, []);

  // Check notification permission
  useEffect(() => {
    if (!isSupported) return;

    setPermission(Notification.permission);
  }, [isSupported]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    console.log("isSupported", isSupported);
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
      console.log("error", e);
      setError("Failed to request permission");
    }
  }, [isSupported]);

  // Register service worker and subscribe to push
  const subscribeToPush = useCallback(
    async (publicVapidKey: string, backendSaveUrl: string) => {
      if (!isSupported) {
        setError("Push notifications are not supported.");
        return null;
      }
      console.log("backendSaveUrl", backendSaveUrl);
      if (permission !== "granted") {
        setError("Notification permission not granted.");
        return null;
      }
      try {
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // Convert subscription to JSON
        const subJson: PushSubscriptionJSON = subscription.toJSON() as any;

        // Send subscription to your backend for storing & sending push
        // await fetch(backendSaveUrl, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(subJson),
        // });

        setSubscription(subJson);
        setError(null);
        return subJson;
      } catch (e: any) {
        console.error("ERROR:", e);
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
      .replace(/\-/g, "+")
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
