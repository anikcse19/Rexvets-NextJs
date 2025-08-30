"use client";

import AvailabilityScheduler from "@/components/Dashboard/Doctor/RatesAndAvailability/AvailabilityScheduler";
import { useDashboardContext } from "@/hooks/DashboardContext";
import { getTodayUTC, getUserTimezone } from "@/lib/timezone";
import {
  CreateAvailabilityRequest,
  DateRange,
  SlotPeriod,
} from "@/lib/types";
import { format } from "date-fns";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import DateRangeCalendar from "./DateRangeCalender";
import TimeSlotCreator from "./TimeSlotCreator";

interface SessionUserWithRefId {
  refId: string;
  // other user properties can be added here
}

const AvailabilityManager: React.FC = () => {
  const {
    getAvailableSlots,
    availableSlotsApiResponse,
    selectedRange,
    setSelectedRange,
    slotStatus,
  } = useDashboardContext();

  const { data: session } = useSession();
  const user = session?.user as SessionUserWithRefId | undefined;

  const [userTimezone, setUserTimezone] = useState<string>("");

  // Get user's timezone on component mount
  useEffect(() => {
    const timezone = getUserTimezone();
    setUserTimezone(timezone);
  }, []);

  const handleSaveSlots = async (slotPeriods: SlotPeriod[]) => {
    if (!selectedRange || !user?.refId) {
      toast.error("Please select a date range and ensure you are logged in");
      return;
    }

    try {
      // Convert SlotPeriod[] to CreateAvailabilityRequest
      const requestData: CreateAvailabilityRequest = {
        dateRange: {
          start: format(selectedRange.start, "yyyy-MM-dd"),
          end: format(selectedRange.end, "yyyy-MM-dd"),
        },
        slotPeriods: slotPeriods.map((slot) => ({
          start: slot.start.toTimeString().slice(0, 5), // Format as "HH:mm"
          end: slot.end.toTimeString().slice(0, 5), // Format as "HH:mm"
        })),
        timezone: userTimezone, // Include user's timezone
      };

      const response = await fetch(
        `/api/appointments/generate-appointment-slot/${user?.refId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create availability slots");
      }

      const result = await response.json();
      toast.success("Availability slots created successfully!");

      // Refresh the available slots after creating new ones
      if (selectedRange) {
        await fetchAvailableSlots();
      }
    } catch (error: any) {
      console.error("Error creating availability slots:", error);
      toast.error("Failed to create availability slots", {
        description: error.message || "Please try again.",
      });
    }
  };

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedRange || !user?.refId) {
      return;
    }

    try {
      const startDate = format(selectedRange.start, "yyyy-MM-dd");
      const endDate = format(selectedRange.end, "yyyy-MM-dd");

      await getAvailableSlots(startDate, endDate, user.refId, userTimezone);

      const diff = getDaysBetween(selectedRange);
      console.log("Days between selected range:", diff);
    } catch (error: any) {
      console.error("Error fetching available slots:", error);
      toast.error("Failed to fetch availability data", {
        description: "Please try refreshing the page or contact support.",
      });
    }
  }, [selectedRange, user?.refId, userTimezone, getAvailableSlots]);

  // console.log("selectedRange", selectedRange);
  useEffect(() => {
    // Only fetch if we have both selectedRange and user refId
    if (selectedRange && user?.refId && userTimezone) {
      fetchAvailableSlots();
    }
  }, [selectedRange, user?.refId, slotStatus, userTimezone, fetchAvailableSlots]);

  // Initialize with today's date when component mounts and user is available
  useEffect(() => {
    if (user?.refId && !selectedRange) {
      // Use timezone-agnostic date to ensure slots are always visible
      // regardless of the user's current timezone
      const todayUTC = getTodayUTC();
      
      setSelectedRange({
        start: todayUTC,
        end: todayUTC,
      });
    }
  }, [user?.refId, selectedRange, setSelectedRange]);

  console.log("selectedRange", selectedRange);
  console.log("availableSlotsApiResponse", availableSlotsApiResponse);
  console.log("User refId:", user?.refId);
  console.log("User timezone:", userTimezone);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Debug Information */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Debug Info:
          </h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>User refId: {user?.refId || "Not available"}</p>
            <p>User timezone: {userTimezone || "Not available"}</p>
            <p>
              Selected Range:{" "}
              {selectedRange
                ? `${format(selectedRange.start, "yyyy-MM-dd")} to ${format(
                    selectedRange.end,
                    "yyyy-MM-dd"
                  )}`
                : "None"}
            </p>
            <p>
              API Loading: {availableSlotsApiResponse.loading ? "Yes" : "No"}
            </p>
            <p>API Error: {availableSlotsApiResponse.error || "None"}</p>
            <p>
              API Data:{" "}
              {availableSlotsApiResponse.data
                ? `${availableSlotsApiResponse.data.periods?.length || 0} periods`
                : "None"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DateRangeCalendar
            selectedRange={selectedRange}
            onRangeSelect={setSelectedRange}
          />
          <TimeSlotCreator
            selectedRange={selectedRange}
            onSaveSlots={handleSaveSlots}
          />
        </div>

        <div>
          <AvailabilityScheduler
            data={availableSlotsApiResponse.data}
            error={availableSlotsApiResponse.error}
            loading={availableSlotsApiResponse.loading}
          />
          {/* <ExistingAvailability
            availabilities={existingAvailabilities}
            onEdit={handleEditAvailability}
            onDelete={handleDeleteAvailability}
          /> */}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate days between dates
const getDaysBetween = (dateRange: DateRange): number => {
  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
};

export default AvailabilityManager;
