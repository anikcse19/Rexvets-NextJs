"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import AvailabilityScheduler from "@/components/Dashboard/Doctor/RatesAndAvailability/AvailabilityScheduler";
import { useDashboardContext } from "@/hooks/DashboardContext";
import {
  CreateAvailabilityRequest,
  ExistsingAvailability as ExistingAvailabilityType,
  SlotPeriod,
} from "@/lib/types";
import { formatDateRange, getDaysBetween } from "@/lib/utils";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import DateRangeCalendar from "./DateRangeCalender";
import TimeSlotCreator from "./TimeSlotCreator";

interface SessionUserWithRefId {
  refId: string;
  // other user properties can be added here
}

export default function AvailabilityManager() {
  const [existingAvailabilities, setExistingAvailabilities] = useState<
    ExistingAvailabilityType[]
  >([]);

  const { data: session } = useSession();
  const {
    availableSlotsApiResponse,
    getAvailableSlots,
    selectedRange,
    setSelectedRange,
  } = useDashboardContext();

  const user = session?.user as SessionUserWithRefId | undefined;

  console.log("Session data:", session);
  console.log("Session user:", user);
  console.log("Selected range:", selectedRange);
  console.log("User refId:", user?.refId);

  const handleSaveSlots = async (slotPeriods: SlotPeriod[]) => {
    if (!selectedRange) return;
    console.log("slots from final save", slotPeriods);
    try {
      // Prepare the API request data
      const requestData: CreateAvailabilityRequest = {
        dateRange: formatDateRange(selectedRange.start, selectedRange.end),
        slotPeriods: slotPeriods.map((slot) => ({
          start: slot.start.toTimeString().slice(0, 5), // Format as "HH:mm"
          end: slot.end.toTimeString().slice(0, 5), // Format as "HH:mm"
        })),
      };

      console.log("API Request Data:", JSON.stringify(requestData, null, 2));
      console.log("User refId:", user?.refId);
      // Here you would make the actual API call
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

      console.log("API Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast.error("Failed to create availability", {
          description: errorData.message || "Unknown error",
        });
        return;
      }
      // For now, simulate success and add to existing availabilities
      const newAvailability: ExistingAvailabilityType = {
        id: Date.now().toString(),
        date: selectedRange.start,
        dateRange: selectedRange,
        slots: slotPeriods,
      };

      setExistingAvailabilities((prev) => [...prev, newAvailability]);
      setSelectedRange(null);

      toast.success("Availability created successfully!", {
        description: `Created ${slotPeriods.length} time slot${
          slotPeriods.length > 1 ? "s" : ""
        } for the selected date range.`,
      });
    } catch (error) {
      console.error("Error creating availability:", error);
      toast.error("Failed to create availability", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    }
  };

  const handleEditAvailability = (id: string) => {
    toast.info("Edit functionality", {
      description: "Edit functionality would be implemented here.",
    });
  };

  const handleDeleteAvailability = (id: string) => {
    setExistingAvailabilities((prev) => prev.filter((item) => item.id !== id));
    toast.success("Availability deleted successfully!");
  };

  // GET available slots based on selected range
  const fetchAvailableSlots = async () => {
    try {
      if (!selectedRange?.end || !selectedRange?.start) {
        console.log("No valid date range selected");
        return;
      }
      if (!user?.refId) {
        console.error("User refId is missing");
        return;
      }
      const formattedStartDate = format(selectedRange.start, "yyyy-MM-dd");
      const formattedEndDate = format(selectedRange.end, "yyyy-MM-dd");

      console.log(
        "Fetching slots for date range:",
        formattedStartDate,
        "to",
        formattedEndDate
      );
      await getAvailableSlots(formattedStartDate, formattedEndDate, user.refId);

      const diff = getDaysBetween(selectedRange);
      console.log("DIFF", diff);
    } catch (error: any) {
      console.error("Error fetching available slots:", error);
    }
  };

  // console.log("selectedRange", selectedRange);
  useEffect(() => {
    // Only fetch if we have both selectedRange and user refId
    if (selectedRange && user?.refId) {
      fetchAvailableSlots();
    }
  }, [selectedRange, user?.refId]);

  // Initialize with today's date when component mounts and user is available
  useEffect(() => {
    if (user?.refId && !selectedRange) {
      const today = new Date();
      setSelectedRange({
        start: today,
        end: today,
      });
    }
  }, [user?.refId, selectedRange, setSelectedRange]);

  console.log("selectedRange", selectedRange);
  return (
    <div className="container mx-auto p-6 space-y-6">
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
}
