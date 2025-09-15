"use client";

import performanceMonitor from "@/lib/performanceMonitor";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TimezoneUpdateModal from "./TimezoneUpdateModal";

interface PerformanceMonitorProps {
  children?: React.ReactNode;
}

export default function PerformanceMonitor({
  children,
}: PerformanceMonitorProps) {
  const { data: session } = useSession();
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [detectedTimezone, setDetectedTimezone] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.init();
  }, []);

  useEffect(() => {
    // alert("RENDER");
    // Check timezone difference and show modal if needed
    const checkTimezoneDifference = () => {
      if (!session?.user?.id) return;

      // Get current timezone
      const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!currentTimezone) {
        console.warn("Could not detect user timezone");
        return;
      }

      setDetectedTimezone(currentTimezone);
      const userTimezone = session.user.timezone;

      // Check if timezones are different
      if (userTimezone && userTimezone !== currentTimezone) {
        // Check localStorage for dismissed state
        const dismissedKey = `timezone_dismissed_${session.user.id}`;
        const dismissedData = localStorage.getItem(dismissedKey);

        if (dismissedData) {
          const { timestamp } = JSON.parse(dismissedData);
          const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

          // If dismissed less than a week ago, don't show modal
          if (Date.now() - timestamp < oneWeekInMs) {
            return;
          }
        }

        // Show modal if timezones are different and not recently dismissed
        setShowTimezoneModal(true);
      }
    };

    // Check timezone when session is available
    if (session?.user?.id) {
      checkTimezoneDifference();
    }
  }, [session?.user?.id, session?.user?.timezone]);
  useEffect(() => {
    if (
      session?.user?.id &&
      detectedTimezone.length > 0 &&
      !session?.user?.timezone
    ) {
      const addedTimezone = async () => {
        await fetch(`/api/user/timezone/${session.user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timezone: detectedTimezone,
            refId: session.user.refId,
          }),
        });
      };
      addedTimezone();
    }
  }, [detectedTimezone]);

  const handleUpdateTimezone = async () => {
    if (!session?.user?.id || !detectedTimezone) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/user/timezone/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timezone: detectedTimezone,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        console.log("🕐 Timezone updated:", result.data);
        await signOut({ callbackUrl: "/" });
        setShowTimezoneModal(false);
      } else {
        console.warn("⚠️ Timezone update failed:", result.message);
      }
    } catch (error) {
      console.error("❌ Error updating timezone:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismissTimezone = () => {
    if (!session?.user?.id) return;

    // Save dismissal to localStorage for one week
    const dismissedKey = `timezone_dismissed_${session.user.id}`;
    localStorage.setItem(
      dismissedKey,
      JSON.stringify({
        timestamp: Date.now(),
        dismissedTimezone: detectedTimezone,
      })
    );

    setShowTimezoneModal(false);
  };
  return (
    <>
      {children}
      <TimezoneUpdateModal
        isOpen={showTimezoneModal}
        onClose={() => setShowTimezoneModal(false)}
        onUpdate={handleUpdateTimezone}
        onDismiss={handleDismissTimezone}
        currentTimezone={session?.user?.timezone || ""}
        detectedTimezone={detectedTimezone}
        isUpdating={isUpdating}
      />
    </>
  );
}
