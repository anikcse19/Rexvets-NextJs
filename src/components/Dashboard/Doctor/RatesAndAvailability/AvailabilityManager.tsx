"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import AvailabilityScheduler from "@/components/AvailabilityScheduler";
import {
  CreateAvailabilityRequest,
  DateRange,
  ExistsingAvailability as ExistingAvailabilityType,
  SlotPeriod,
} from "@/lib/types";
import { formatDateRange, formatTimeSlot, getDaysBetween } from "@/lib/utils";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import DateRangeCalendar from "./DateRangeCalender";
import ExistingAvailability from "./ExistingSlots";
import TimeSlotCreator from "./TimeSlotCreator";

interface SessionUserWithRefId {
  refId: string;
  id: string;
  role: string;
  email: string;
  name: string;
  image?: string;
}
const todayDateRange: DateRange = {
  start: new Date(),
  end: new Date(),
};
interface IAvailableApiResponseState {
  data: any[] | null;
  error: string | null;
  loading: boolean;
}
const initialApiResponseState: IAvailableApiResponseState = {
  data: null,
  error: null,
  loading: false,
};
export default function AvailabilityManager() {
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(
    todayDateRange
  );
  const [availableSlotsApiResponse, setAvailableSlotsApiResponse] =
    useState<IAvailableApiResponseState>(initialApiResponseState);
  const [existingAvailabilities, setExistingAvailabilities] = useState<
    ExistingAvailabilityType[]
  >([]);

  const { data: session, status } = useSession();

  const user = session?.user as SessionUserWithRefId | undefined;

  console.log("Session status:", status);
  console.log("Session data:", session);
  console.log("Session user:", user);
  
  // Debug log for authenticated user
  if (status === "authenticated" && user) {
    console.log("User role:", user.role);
    console.log("User refId:", user.refId);
    console.log("User id:", user.id);
  }

  const handleSaveSlots = async (slotPeriods: SlotPeriod[]) => {
    if (!selectedRange) return;
    
    // Check if user is authenticated
    if (status === "loading") {
      toast.error("Please wait while we verify your session...");
      return;
    }
    
    if (status === "unauthenticated" || !user?.refId) {
      toast.error("Please sign in to manage availability");
      return;
    }
    
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
  const getAvailableSlots = useCallback(async () => {
    // Require a complete date range and an authenticated user
    if (!selectedRange?.start || !selectedRange?.end) {
      return;
    }
    if (status !== "authenticated" || !user?.refId) {
      return;
    }

    setAvailableSlotsApiResponse((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));
    try {
      const formattedStartDate = format(selectedRange.start, "yyyy-MM-dd");
      const formattedEndDate = format(selectedRange.end, "yyyy-MM-dd");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/slots/slot-summary/${user?.refId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
 
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log(responseData);
      setAvailableSlotsApiResponse((prev) => ({
        ...prev,
        loading: false,
        data: responseData.data,
        error: null,
      }));

      const diff = getDaysBetween(selectedRange);
      console.log("DIFF", diff);
    } catch (error: any) {
      setAvailableSlotsApiResponse((prev) => ({
        ...prev,
        loading: false,
        data: null,
        error: error.message,
      }));
    } finally {
      setAvailableSlotsApiResponse((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, [selectedRange, status, user?.refId]);

  // Auto-fetch whenever inputs are ready/changed
  useEffect(() => {
    // Only fetch when we have a complete range and an authenticated user
    if (selectedRange?.start && selectedRange?.end && status === "authenticated" && user?.refId) {
      getAvailableSlots();
    }
  }, [getAvailableSlots, selectedRange?.start, selectedRange?.end, status, user?.refId]);

  console.log("availablke slots api responser", availableSlotsApiResponse);
  
  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading session...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error state if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Please sign in to access this page</p>
            <Button onClick={() => window.location.href = "/auth/signin"}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
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
