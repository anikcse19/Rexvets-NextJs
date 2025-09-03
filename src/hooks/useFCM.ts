"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseFCMOptions {
  vapidKey?: string; // NEXT_PUBLIC_VAPID_PUBLIC_KEY
}

export default function useFCM(options: UseFCMOptions = {}) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window === "undefined" ? "default" : Notification.permission
  );
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Check if push notifications are supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);
      
      if (!supported) {
        setError("Push notifications are not supported in this browser");
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return "default";
    
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setError("Failed to request notification permission");
      return "denied";
    }
  }, []);

  const getFcmToken = useCallback(async () => {
    if (typeof window === "undefined") return null;

    try {
      setLoading(true);
      setError(null);

      // Check if service worker is registered
      if (!isSupported) {
        throw new Error("Push notifications are not supported in this browser");
      }

      // Get the VAPID public key
      const vapidKey = options.vapidKey || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error("VAPID public key is not configured");
      }

      // Register service worker if not already registered
      let registration: ServiceWorkerRegistration;
      
      try {
        const existingRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        if (!existingRegistration) {
          console.log("Registering service worker...");
          registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log("Service worker registered successfully");
        } else {
          registration = existingRegistration;
          console.log("Service worker already registered");
        }
      } catch (swError) {
        console.error("Service worker registration failed:", swError);
        throw new Error("Failed to register service worker");
      }

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      console.log("Service worker is ready");

      // Check if we already have a subscription
      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        console.log("Found existing push subscription");
        setSubscription(existingSubscription);
        return existingSubscription;
      }

      // Helper: convert base64url public key string to Uint8Array
      const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

      // Create new subscription
      console.log("Creating new push subscription...");
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      console.log("New push subscription created:", newSubscription);
      setSubscription(newSubscription);
      setError(null);
      return newSubscription;
    } catch (e: any) {
      console.error("Error getting push subscription:", e);
      const errorMessage = e?.message || "Failed to get push subscription";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.vapidKey, isSupported]);

  const saveToken = useCallback(
    async (userId: string, sub?: PushSubscription | null) => {
      try {
        const subscriptionToSave = sub ?? subscription;
        if (!subscriptionToSave) {
          const errorMsg = "No push subscription available";
          toast.error(errorMsg);
          setError(errorMsg);
          return false;
        }

        // Convert subscription to a string format for storage
        const subscriptionData = {
          endpoint: subscriptionToSave.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscriptionToSave.getKey("p256dh")!)
              )
            ),
            auth: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscriptionToSave.getKey("auth")!)
              )
            ),
          },
        };

        console.log("Saving subscription data:", subscriptionData);

        const res = await fetch("/api/notifications/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            token: JSON.stringify(subscriptionData),
            platform: "web",
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          const errorMsg = error.message || "Failed to save push subscription";
          toast.error(errorMsg);
          setError(errorMsg);
          return false;
        }

        const result = await res.json();
        console.log("Subscription saved successfully:", result);
        toast.success("Push subscription saved successfully");
        setError(null);
        return true;
      } catch (error: any) {
        const errorMsg = error?.message || "Failed to save push subscription";
        console.error("Error saving subscription:", error);
        toast.error(errorMsg);
        setError(errorMsg);
        return false;
      }
    },
    [subscription]
  );

  // Get subscription as string for backward compatibility
  const token = subscription ? JSON.stringify(subscription) : null;

  return {
    permission,
    token,
    subscription,
    error,
    loading,
    isSupported,
    requestPermission,
    getFcmToken,
    saveToken,
  };
}
