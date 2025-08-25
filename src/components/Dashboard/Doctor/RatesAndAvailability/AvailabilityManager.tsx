"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  DateRange,
  SlotPeriod,
  CreateAvailabilityRequest,
  ExistsingAvailability as ExistingAvailabilityType,
} from "@/lib/types";
import { formatDateRange, formatTimeSlot } from "@/lib/utils";
import DateRangeCalendar from "./DateRangeCalender";
import TimeSlotCreator from "./TimeSlotCreator";
import ExistingAvailability from "./ExistingSlots";
import { useSession } from "next-auth/react";

interface SessionUserWithRefId {
  refId: string;
  // other user properties can be added here
}

export default function AvailabilityManager() {
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const [existingAvailabilities, setExistingAvailabilities] = useState<
    ExistingAvailabilityType[]
  >([]);

  const { data: session } = useSession();

  const user = session?.user as SessionUserWithRefId | undefined;

  const handleSaveSlots = async (slotPeriods: SlotPeriod[]) => {
    if (!selectedRange) return;

    try {
      // Prepare the API request data
      const requestData: CreateAvailabilityRequest = {
        dateRange: formatDateRange(selectedRange.start, selectedRange.end),
        slotPeriods: slotPeriods.map((slot) => ({
          start: formatTimeSlot(
            selectedRange.start,
            slot.start.toTimeString().slice(0, 5)
          ),
          end: formatTimeSlot(
            selectedRange.start,
            slot.end.toTimeString().slice(0, 5)
          ),
        })),
      };

      console.log("API Request Data:", JSON.stringify(requestData, null, 2));

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Doctor Availability
        </h1>
        <p className="text-muted-foreground">
          Manage your appointment slots by selecting date ranges and setting up
          time periods.
        </p>
      </div>

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
          <ExistingAvailability
            availabilities={existingAvailabilities}
            onEdit={handleEditAvailability}
            onDelete={handleDeleteAvailability}
          />
        </div>
      </div>
    </div>
  );
}
