"use client";

import AvailabilityScheduler from "@/components/Dashboard/Doctor/RatesAndAvailability/AvailabilityScheduler";
import AnimatedDateTabs from "@/components/shared/AnimatedDateTabs";
import BookingNoticePeriod from "@/components/shared/BookingNoticePeriod";
import TimezoneUpdateModal from "@/components/TimezoneUpdateModal";
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
  getTimezoneInfo,
  getTimezoneOffset,
  getUserTimezone,
  getVeterinarianTimezoneWithFallback,
  updateTimezoneWithValidation,
} from "@/lib/timezone";
import { DateRange, SlotPeriod } from "@/lib/types";
import { format } from "date-fns";
import { AlertTriangle, Calendar, Clock, Globe } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const TimeSlotCreator = dynamic(
  () => import("./TimeSlotCreator/TimeSlotCreator"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Processing....</p>
        </div>
      </div>
    ),
  }
);

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
    getSlots,
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
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [detectedTimezone, setDetectedTimezone] = useState<string>("");
  const [vetTimezone, setVetTimezone] = useState<string>("");
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  const [timezoneError, setTimezoneError] = useState<string>("");
  const [showTimezoneUpdateModal, setShowTimezoneUpdateModal] = useState(false);
  const [timezoneModalDismissed, setTimezoneModalDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const userTimezone = user?.timezone || "";
  const currentTimeZone = isClient
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "UTC";

  // Only log on client side to prevent hydration issues
  useEffect(() => {
    if (isClient) {
      console.log(
        "currentTimeZone=======timezone",
        `${currentTimeZone} vet timezone:${user?.timezone}`
      );
    }
  }, [isClient, currentTimeZone, user?.timezone]);
  // Timezone modal state
  const [timezoneModal, setTimezoneModal] = useState<TimezoneModalState | null>(
    null
  );

  // Function to update veterinarian timezone
  const updateVetTimezone = async (newTimezone: string) => {
    setTimezoneLoading(true);
    setTimezoneError("");

    try {
      const result = await updateTimezoneWithValidation(newTimezone);

      if (result.success) {
        setVetTimezone(newTimezone);
        toast.success("Timezone updated successfully");
        console.log("Timezone updated to:", newTimezone);
      } else {
        setTimezoneError(result.error || "Failed to update timezone");
        toast.error(result.message || "Failed to update timezone");
      }
    } catch (error) {
      console.error("Error updating timezone:", error);
      setTimezoneError("Failed to update timezone");
      toast.error("Failed to update timezone");
    } finally {
      setTimezoneLoading(false);
    }
  };

  // Handler for timezone update modal
  const handleTimezoneUpdate = async () => {
    await updateVetTimezone(detectedTimezone);
    setShowTimezoneUpdateModal(false);
    // Mark as dismissed for this session
    setTimezoneModalDismissed(true);
  };

  // Handler for dismissing timezone modal
  const handleTimezoneDismiss = () => {
    setShowTimezoneUpdateModal(false);
    setTimezoneModalDismissed(true);
    // Store dismissal in localStorage to remember user's choice
    localStorage.setItem("timezone-modal-dismissed", "true");
  };

  // Handler for closing timezone modal
  const handleTimezoneClose = () => {
    setShowTimezoneUpdateModal(false);
  };

  const fetchSlots = useCallback(async () => {
    if (!selectedRange || !user?.refId) {
      throw new Error("Missing required data");
    }

    try {
      const startDate = format(selectedRange.start, "yyyy-MM-dd");
      const endDate = format(selectedRange.end, "yyyy-MM-dd");

      // Always use vetTimezone from DB, never use local timezone
      const timezoneToUse = vetTimezone || "UTC";
      console.log("Using timezone for slots:", timezoneToUse);
      await getSlots(startDate, endDate, user.refId, timezoneToUse);

      const diff = getDaysBetween(selectedRange);
      console.log("Days between selected range:", diff);
    } catch (error: any) {
      console.error("Error fetching available slots:", error);
      toast.error(error?.message || "Failed to fetch availability data", {
        description: "Please try refreshing the page or contact support.",
      });
    }
  }, [selectedRange, user?.refId, vetTimezone, getSlots]);

  useEffect(() => {
    // Only fetch if we have both selectedRange and user refId
    if (selectedRange && user?.refId) {
      fetchSlots();
    }
  }, [selectedRange, user?.refId, slotStatus, vetTimezone, fetchSlots]);
  useEffect(() => {
    if (availableSlotsApiResponse.data) {
      setHasExistingSlots(availableSlotsApiResponse.data.periods.length > 0);
    }
  }, [availableSlotsApiResponse.data]);

  const existingPeriods = useMemo(() => {
    if (!availableSlotsApiResponse.data?.periods) return [];
    return availableSlotsApiResponse.data.periods.flatMap(
      (dateGroup) => dateGroup.periods
    );
  }, [availableSlotsApiResponse.data?.periods]);

  // Defer large arrays to avoid blocking rendering
  const deferredExistingPeriods = useDeferredValue(existingPeriods);

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch veterinarian timezone from API
  useEffect(() => {
    const getVetTimezoneFromDB = async () => {
      if (!user?.refId || !isClient) return;

      setTimezoneLoading(true);
      setTimezoneError("");

      try {
        const timezoneInfo = await getTimezoneInfo();

        if (timezoneInfo.timezone) {
          setVetTimezone(timezoneInfo.timezone);
          setDetectedTimezone(currentTimeZone);

          console.log("Veterinarian timezone loaded:", {
            timezone: timezoneInfo.timezone,
            source: timezoneInfo.source,
            offset: timezoneInfo.offset,
            isValid: timezoneInfo.isValid,
          });

          // Check if there's a difference between vet DB timezone and current browser timezone
          const isDifferent = timezoneInfo.timezone !== currentTimeZone;
          const hasBeenDismissed =
            localStorage.getItem("timezone-modal-dismissed") === "true";

          if (isDifferent && !hasBeenDismissed && !timezoneModalDismissed) {
            console.log("Timezone difference detected:", {
              vetTimezone: timezoneInfo.timezone,
              currentTimezone: currentTimeZone,
            });
            setShowTimezoneUpdateModal(true);
          }
        } else {
          // Fallback to user's browser timezone
          const fallbackTimezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone;
          setVetTimezone(fallbackTimezone);
          setDetectedTimezone(fallbackTimezone);
          console.log("Using fallback timezone:", fallbackTimezone);
        }
      } catch (error) {
        console.error("Error fetching veterinarian timezone:", error);
        setTimezoneError("Failed to load timezone");
        // Fallback to user's browser timezone
        const fallbackTimezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        setVetTimezone(fallbackTimezone);
        setDetectedTimezone(fallbackTimezone);
      } finally {
        setTimezoneLoading(false);
      }
    };

    getVetTimezoneFromDB();
  }, [user?.refId, currentTimeZone, timezoneModalDismissed, isClient]);
  return (
    <div className="container mx-auto p-2 md:p-6 space-y-6">
      {process.env.NODE_ENV !== "production" && isClient && (
        <>
          <p>VET ID:{user?.refId}</p>
          <p>start time :{selectedRange?.start}</p>
          <p>end time :{selectedRange?.end}</p>
          <p>Vet Timezone: {vetTimezone || "Loading..."}</p>
          <p>User Timezone: {userTimezone}</p>
          <p>Current Browser Timezone: {currentTimeZone}</p>
          {timezoneError && (
            <p className="text-red-500">Timezone Error: {timezoneError}</p>
          )}
          {timezoneLoading && (
            <p className="text-blue-500">Loading timezone...</p>
          )}
        </>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6 relative">
          <AnimatedDateTabs />

          <div className=" flex items-center justify-end absolute top-[178px] right-3 md:top-[190px] md:right-7 z-50">
            <Button
              className="cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={availableSlotsApiResponse.loading}
              variant="default"
              onClick={() => setIsTimePeriodOpen(true)}
            >
              {hasExistingSlots
                ? "Update Availability Slots"
                : "Create Availability Slots"}
            </Button>
          </div>
          <AvailabilityScheduler
            data={availableSlotsApiResponse.data}
            error={availableSlotsApiResponse.error}
            loading={availableSlotsApiResponse.loading}
          />
        </div>

        <div>
          <BookingNoticePeriod vetId={user?.refId} autoSave />
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
                      onClick={async () => {
                        await updateVetTimezone(timezoneModal.userTimezone);
                        timezoneModal.onConfirm(timezoneModal.userTimezone);
                      }}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      disabled={timezoneLoading}
                    >
                      {timezoneLoading ? "Updating..." : "Use This"}
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
                      onClick={async () => {
                        await updateVetTimezone(timezoneModal.currentTimezone);
                        timezoneModal.onConfirm(timezoneModal.currentTimezone);
                      }}
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                      disabled={timezoneLoading}
                    >
                      {timezoneLoading ? "Updating..." : "Use This"}
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
                refetch={async () => {
                  if (selectedRange) {
                    await fetchSlots();
                  }
                }}
                selectedRange={selectedRange}
                timezone={getUserTimezone() || "UTC"}
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
