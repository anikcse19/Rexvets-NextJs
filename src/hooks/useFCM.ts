"use client";
import { getToken, messaging } from "@/config/firebase.config";
import { useCallback, useState } from "react";

interface UseFCMOptions {
  vapidKey?: string; // NEXT_PUBLIC_FIREBASE_VAPID_KEY
}

export default function useFCM(options: UseFCMOptions = {}) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window === "undefined" ? "default" : Notification.permission
  );
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return "default";
    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm;
  }, []);

  const getFcmToken = useCallback(async () => {
    if (!messaging) {
      setError("Messaging not initialized");
      return null;
    }
    try {
      setLoading(true);
      const vapid = options.vapidKey || process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
      const t = await getToken(messaging, { vapidKey: vapid });
      setToken(t || null);
      setError(null);
      return t || null;
    } catch (e: any) {
      setError(e?.message || "Failed to get FCM token");
      return null;
    } finally {
      setLoading(false);
    }
  }, [options.vapidKey]);

  const saveToken = useCallback(async (userId: string, t?: string | null) => {
    const tokenToSave = t ?? token;
    if (!tokenToSave) return false;
    const res = await fetch("/api/notifications/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token: tokenToSave, platform: "web" }),
    });
    return res.ok;
  }, [token]);

  return { permission, token, error, loading, requestPermission, getFcmToken, saveToken };
}
