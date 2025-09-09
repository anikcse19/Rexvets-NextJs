"use client";

import AvailabilityScheduler from "@/components/Dashboard/Doctor/RatesAndAvailability/AvailabilityScheduler";
import BookingNoticePeriod from "@/components/shared/BookingNoticePeriod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDashboardContext } from "@/hooks/DashboardContext";
import {
  getMonthRange,
  getTimezoneOffset,
  getTimezones,
  getTodayUTC,
  getUserTimezone,
  getWeekRange,
} from "@/lib/timezone";
import { CreateAvailabilityRequest, DateRange, SlotPeriod } from "@/lib/types";
import { format } from "date-fns";
import { AlertTriangle, Calendar, Clock, Globe } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import DateRangeCalendar from "./DateRangeCalender";

const TimeSlotCreator = dynamic(() => import("./TimeSlotCreator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Processing....</p>
      </div>
    </div>
  ),
});

interface SessionUserWithRefId {
  refId: string;
  timezone?: string;
  // other user properties can be added here
}

interface TimezoneModalState {
  isOpen: boolean;
  userTimezone: string;
  currentTimezone: string;
  slotPeriods: SlotPeriod[];
  onConfirm: (selectedTimezone: string) => Promise<void>;
}

const AvailabilityManager: React.FC = () => {
  const {
    getAvailableSlots,
    availableSlotsApiResponse,
    selectedRange,
    setSelectedRange,
    slotStatus,
  } = useDashboardContext();
  const [isTimePeriodsOpen, setIsTimePeriodOpen] = useState(false);
  const [mountCreator, setMountCreator] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as SessionUserWithRefId | undefined;
  const [hasExistingSlots, setHasExistingSlots] = useState(false);
  // const { requestPermission, getFcmToken } = useFCM();
  // useEffect(() => {
  //   getFcmToken();
  //   requestPermission();
  // }, []);
  const userTimezone = user?.timezone || "";
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Timezone modal state
  const [timezoneModal, setTimezoneModal] = useState<TimezoneModalState | null>(
    null
  );

  // Get user's timezone on component mount
  // useEffect(() => {
  //   const timezone = getUserTimezone();
  //   setUserTimezone(timezone);
  // }, []);

  const handleSaveSlots = async (slotPeriods: SlotPeriod[]): Promise<void> => {
    if (!selectedRange || !user?.refId) {
      toast.error("Please select a date range and ensure you are logged in");
      throw new Error("Missing required data");
    }

    // Check if timezones are different
    if (userTimezone && currentTimeZone && userTimezone !== currentTimeZone) {
      // Show timezone selection modal
      setTimezoneModal({
        isOpen: true,
        userTimezone,
        currentTimezone: currentTimeZone,
        slotPeriods,
        onConfirm: async (selectedTimezone?: string) => {
          try {
            if (hasExistingSlots) {
              await updateSlotPeriod(slotPeriods, user.refId, selectedRange);
            } else {
              await createSlots(slotPeriods, selectedTimezone as any);
            }
            setTimezoneModal(null);
          } catch (error) {
            throw error;
          }
        },
      });
    } else {
      // If timezones are the same or user has no timezone, proceed normally
      if (hasExistingSlots) {
        await updateSlotPeriod(slotPeriods, user.refId, selectedRange);
      } else {
        await createSlots(slotPeriods, userTimezone || currentTimeZone);
      }
    }
  };
  const updateSlotPeriod = async (
    slotPeriods: SlotPeriod[],
    userRefId: string,
    selectedRange: { start: Date; end: Date }
  ) => {
    try {
      const requestData: CreateAvailabilityRequest = {
        dateRange: {
          start: format(selectedRange.start, "yyyy-MM-dd"),
          end: format(selectedRange.end, "yyyy-MM-dd"),
        },
        slotPeriods: slotPeriods.map((slot) => ({
          start: format(slot.start, "HH:mm"),
          end: format(slot.end, "HH:mm"),
        })),
      };

      console.log("request PATCH DATA", requestData);

      const response = await fetch(
        `/api/appointments/generate-appointment-slot/${userRefId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update slots: ${response.statusText}`
        );
      }

      const result = await response.json();
      toast.success("Availability slots updated successfully!");

      // Refresh the available slots after updating
      if (selectedRange) {
        await fetchAvailableSlots();
      }

      return result;
    } catch (error: any) {
      console.error("Error updating availability slots:", error);
      toast.error("Failed to update availability slots", {
        description: error.message || "Please try again.",
      });
      throw error;
    }
  };

  const createSlots = async (slotPeriods: SlotPeriod[], timezone: string) => {
    try {
      // Convert SlotPeriod[] to CreateAvailabilityRequest
      const requestData: CreateAvailabilityRequest = {
        dateRange: {
          start: format(selectedRange!.start, "yyyy-MM-dd"),
          end: format(selectedRange!.end, "yyyy-MM-dd"),
        },
        slotPeriods: slotPeriods.map((slot) => ({
          start: slot.start.toTimeString().slice(0, 5), // Format as "HH:mm"
          end: slot.end.toTimeString().slice(0, 5), // Format as "HH:mm"
        })),
        timezone: timezone, // Use selected timezone
      };
      console.log("requestData", requestData);
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
        throw new Error(
          errorData.message || "Failed to create availability slots"
        );
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
      throw new Error("Missing required data");
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
      toast.error(error?.message || "Failed to fetch availability data", {
        description: "Please try refreshing the page or contact support.",
      });
    }
  }, [selectedRange, user?.refId, userTimezone, getAvailableSlots]);

  // console.log("selectedRange", selectedRange);
  useEffect(() => {
    // Only fetch if we have both selectedRange and user refId
    if (selectedRange && user?.refId) {
      fetchAvailableSlots();
    }
  }, [
    selectedRange,
    user?.refId,
    slotStatus,
    userTimezone,
    fetchAvailableSlots,
  ]);
  useEffect(() => {
    if (availableSlotsApiResponse.data) {
      setHasExistingSlots(availableSlotsApiResponse.data.periods.length > 0);
    }
  }, [availableSlotsApiResponse.data]);
  // Initialize with today's date when component mounts and user is available
  useEffect(() => {
    if (user?.refId && !selectedRange) {
      // Use timezone-agnostic date to ensure slots are always visible
      // regardless of the user's current timezone
      const weekDateRange = getWeekRange();
      setSelectedRange({
        start: new Date(weekDateRange.start),
        end: new Date(weekDateRange.end),
      });
    }
  }, [user?.refId, selectedRange, setSelectedRange]);
  // Memoize the existing periods to avoid recalculating on every render
  const existingPeriods = useMemo(() => {
    if (!availableSlotsApiResponse.data?.periods) return [];
    return availableSlotsApiResponse.data.periods.flatMap(
      (dateGroup) => dateGroup.periods
    );
  }, [availableSlotsApiResponse.data?.periods]);

  // Defer large arrays to avoid blocking rendering
  const deferredExistingPeriods = useDeferredValue(existingPeriods);

  // console.log("deferredExistingPeriods", deferredExistingPeriods);
  return (
    <div className="container mx-auto p-2 md:p-6 space-y-6">
      <BookingNoticePeriod vetId={user?.refId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DateRangeCalendar
            selectedRange={selectedRange}
            onRangeSelect={setSelectedRange}
          />
          <div className=" flex items-center justify-end">
            <Button
              className="  cursor-pointer"
              disabled={availableSlotsApiResponse.loading}
              variant="outline"
              onClick={() => setIsTimePeriodOpen(true)}
            >
              {hasExistingSlots
                ? "Update Availability Slots"
                : "Create Availability Slots"}
            </Button>
          </div>

          {/* <TimeSlotCreator
          // selectedRange={selectedRange}
          // onSaveSlots={handleSaveSlots}
          /> */}
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

      {/* Timezone Selection Modal */}
      {timezoneModal && (
        <Dialog
          open={timezoneModal.isOpen}
          onOpenChange={(open) => !open && setTimezoneModal(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Different Timezone Detected
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                We detected that your current timezone is different from your
                saved timezone. Please choose which timezone you'd like to use
                for creating your availability slots.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-6">
              {/* User's Saved Timezone */}
              <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Your Saved Timezone
                        </h3>
                        <p className="text-sm text-gray-600">
                          {timezoneModal.userTimezone} (
                          {getTimezoneOffset(timezoneModal.userTimezone)})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Current time:{" "}
                          {moment
                            .tz(timezoneModal.userTimezone)
                            .format("h:mm A")}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        timezoneModal.onConfirm(timezoneModal.userTimezone)
                      }
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Use This
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Detected Timezone */}
              <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Current Detected Timezone
                        </h3>
                        <p className="text-sm text-gray-600">
                          {timezoneModal.currentTimezone} (
                          {getTimezoneOffset(timezoneModal.currentTimezone)})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Current time:{" "}
                          {moment
                            .tz(timezoneModal.currentTimezone)
                            .format("h:mm A")}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        timezoneModal.onConfirm(timezoneModal.currentTimezone)
                      }
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      Use This
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timezone Difference Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Timezone Difference
                </h4>
                <p className="text-sm text-gray-600">
                  The time difference between these timezones is{" "}
                  <span className="font-medium">
                    {moment
                      .tz(timezoneModal.currentTimezone)
                      .diff(
                        moment.tz(timezoneModal.userTimezone),
                        "hours"
                      )}{" "}
                    hours
                  </span>
                  . This means your availability slots will appear at different
                  times depending on which timezone you choose.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setTimezoneModal(null)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Sheet open={isTimePeriodsOpen} onOpenChange={setIsTimePeriodOpen}>
        <SheetContent side="right" className="w-full ">
          <ScrollArea className="h-[96vh]">
            <SheetHeader>
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <SheetTitle className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                  Time Slot Creator
                </SheetTitle>
              </div>
            </SheetHeader>
            <div>
              <TimeSlotCreator
                selectedRange={selectedRange}
                onSaveSlots={handleSaveSlots}
                hasExistingSlots={hasExistingSlots}
                existingPeriods={deferredExistingPeriods}
                onClose={() => setIsTimePeriodOpen(false)}
                vetId={user?.refId}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
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
