"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { adjustDateRange, getUserTimezone } from "@/lib/timezone";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { DateRange } from "@/lib/types";
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addSinglePeriod, deleteSlotsByIds } from "../services/delete-periods";

interface TimeSlotCreatorProps {
  selectedRange: DateRange | null;
  hasExistingSlots?: boolean;
  existingPeriods?: Array<{
    startTime: string;
    endTime: string;
    totalHours: number;
    slots: any[];
    timezone?: string;
  }>;
  refetch: () => void;
  onClose?: () => void;
  vetId?: string;
  timezone: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isExisting?: boolean;
  isSelected?: boolean;
  date?: Date;
  slotIDs?: string[]; // Array of actual slot IDs from database
}

const TimeSlotCreator = ({
  selectedRange,
  hasExistingSlots = false,
  existingPeriods = [],
  onClose,
  vetId,
  refetch,
  timezone,
}: TimeSlotCreatorProps) => {
  console.log("selectedRange", selectedRange);

  const [slots, setSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      startTime: "09:00",
      endTime: "12:00",
      isExisting: false,
      isSelected: false,
      date: selectedRange?.start ? new Date(selectedRange.start) : undefined,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openPopover, setOpenPopover] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Memoize the processed existing periods to avoid recalculation
  const processedExistingPeriods = useMemo(() => {
    if (!hasExistingSlots || !existingPeriods.length) return [];
    return existingPeriods.map((period, index) => ({
      id: `existing-${index + 1}`,
      startTime: period.startTime,
      endTime: period.endTime,
      isExisting: true,
      isSelected: false,
      date: period?.slots[0]?.formattedDate
        ? new Date(period.slots[0].formattedDate)
        : undefined,
      slotIDs: period.slots.map((slot) => slot._id),
    }));
  }, [hasExistingSlots, existingPeriods]);

  // Reinitialize slots when processed periods change
  useEffect(() => {
    if (hasExistingSlots && processedExistingPeriods.length > 0) {
      setSlots(processedExistingPeriods);
    } else {
      setSlots([
        {
          id: "1",
          startTime: "09:00",
          endTime: "12:00",
          isExisting: false,
          isSelected: false,
          date: selectedRange?.start
            ? new Date(selectedRange.start)
            : undefined,
        },
      ]);
    }
  }, [hasExistingSlots, processedExistingPeriods, selectedRange]);

  const addSlot = () => {
    // Clear any error messages when adding a new slot
    setErrorMessage("");

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "12:00",
      isExisting: false,
      isSelected: false,
      date: selectedRange?.start ? new Date(selectedRange.start) : undefined,
    };
    setSlots([...slots, newSlot]);
  };

  const removeSlot = async (id: string) => {
    // Don't allow removing the last slot
    if (slots.length > 1) {
      const slotToRemove = slots.find((slot) => slot.id === id);

      // If it's an existing slot and we have slotIDs, delete from database
      if (
        slotToRemove?.isExisting &&
        slotToRemove.slotIDs &&
        slotToRemove.slotIDs.length > 0
      ) {
        try {
          await deleteSlotsByIds({
            slotIds: slotToRemove.slotIDs,
          });

          toast.success(
            `Period deleted successfully (${slotToRemove.slotIDs.length} slots removed)`
          );
          refetch && refetch();
          onClose && onClose();
        } catch (error: any) {
          console.error("Error deleting period:", error);
          const errorMsg = `Failed to delete period: ${
            error.message || "Please try again."
          }`;
          setErrorMessage(errorMsg);
          toast.error("Failed to delete period", {
            description: error.message || "Please try again.",
          });
          return; // Don't remove from UI if database deletion failed
        }
      }

      setSlots(slots.filter((slot) => slot.id !== id));
    }
  };

  const toggleSlotSelection = (id: string) => {
    setSlots(
      slots.map((slot) =>
        slot.id === id ? { ...slot, isSelected: !slot.isSelected } : slot
      )
    );
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSlots(slots.map((slot) => ({ ...slot, isSelected: newSelectAll })));
  };

  const handleBulkDelete = async () => {
    const selectedSlots = slots.filter((slot) => slot.isSelected);
    console.log("selectedSlots", selectedSlots);
    if (selectedSlots.length === 0) {
      toast.error("No slots selected for deletion");
      return;
    }

    if (selectedSlots.length === slots.length) {
      toast.error("Cannot delete all slots. At least one slot must remain.");
      return;
    }

    // If we have existing slots with slotIDs, delete from database
    const existingSelectedSlots = selectedSlots.filter(
      (slot) => slot.isExisting && slot.slotIDs && slot.slotIDs.length > 0
    );

    if (existingSelectedSlots.length > 0) {
      try {
        // Collect all slot IDs from selected periods
        const allSlotIds = existingSelectedSlots.flatMap(
          (slot) => slot.slotIDs || []
        );

        const result = await deleteSlotsByIds({
          slotIds: allSlotIds,
        });

        toast.success(
          `Successfully deleted ${result.deletedCount} slots from ${existingSelectedSlots.length} periods`
        );
      } catch (error: any) {
        console.error("Error deleting periods in bulk:", error);
        const errorMsg = `Failed to delete periods: ${
          error.message || "Please try again."
        }`;
        setErrorMessage(errorMsg);
        toast.error("Failed to delete periods", {
          description: error.message || "Please try again.",
        });
        return; // Don't remove from UI if database deletion failed
      }
    }

    setSlots(slots.filter((slot) => !slot.isSelected));
    setSelectAll(false);
    toast.success(`${selectedSlots.length} slot(s) deleted successfully`);
  };

  const selectedCount = slots.filter((slot) => slot.isSelected).length;

  // Sync selectAll state with actual selections
  useEffect(() => {
    if (slots.length === 0) {
      setSelectAll(false);
    } else {
      const allSelected = slots.every((slot) => slot.isSelected);
      const noneSelected = slots.every((slot) => !slot.isSelected);
      if (allSelected) {
        setSelectAll(true);
      } else if (noneSelected) {
        setSelectAll(false);
      }
    }
  }, [slots]);

  // Save individual new period
  const saveIndividualPeriod = async (slotId: string) => {
    setErrorMessage("");
    setSavingSlotId(slotId);

    const slot = slots.find((s) => s.id === slotId);
    if (!slot || slot.isExisting) {
      setSavingSlotId(null);
      return;
    }

    if (!selectedRange || !vetId) {
      toast.error("Missing required information");
      setSavingSlotId(null);
      return;
    }

    if (!isValidSlot(slot)) {
      toast.error("Invalid time slot configuration");
      setSavingSlotId(null);
      return;
    }

    try {
      const normalizeDates = adjustDateRange(selectedRange as any, timezone);
      if (!normalizeDates.start || !normalizeDates.end) {
        throw new Error("Invalid date range");
      }
      console.log("selectedRange", selectedRange);
      console.log("normalizeDates", normalizeDates);
      // Use granular single-period creation to avoid date-range conflict errors
      const result = await addSinglePeriod({
        vetId,
        dateRange: normalizeDates,
        period: { start: slot.startTime, end: slot.endTime },
        slotDuration: 30,
        bufferBetweenSlots: 0,
      });

      toast.success(
        `Period saved successfully (${result.data.createdSlotsCount} slots created)`
      );
      refetch && refetch();
      onClose && onClose();
      // Mark this slot as existing
      setSlots(
        slots.map((s) => (s.id === slotId ? { ...s, isExisting: true } : s))
      );
    } catch (error: any) {
      console.error("Error saving individual period:", error);
      setErrorMessage(error.message || "Please try again.");
      toast.error("Failed to save period", {
        description: error.message || "Please try again.",
      });
    } finally {
      setSavingSlotId(null);
    }
  };

  const isValidSlot = (slot: TimeSlot): boolean => {
    if (
      !(
        typeof slot.startTime === "string" &&
        slot.startTime !== "" &&
        typeof slot.endTime === "string" &&
        slot.endTime !== "" &&
        slot.startTime < slot.endTime
      )
    ) {
      return false;
    }

    // Existing periods are always considered valid regardless of duration
    if (slot.isExisting) {
      return true;
    }

    // For new periods, enforce 3-hour minimum
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    const start = new Date(
      `2000-01-01T${String(sh).padStart(2, "0")}:${String(sm).padStart(
        2,
        "0"
      )}:00`
    );
    const end = new Date(
      `2000-01-01T${String(eh).padStart(2, "0")}:${String(em).padStart(
        2,
        "0"
      )}:00`
    );
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return durationHours >= 3;
  };

  const getTotalHours = (): number => {
    return slots.reduce((total, slot) => {
      if (!isValidSlot(slot)) return total;
      const [sh, sm] = slot.startTime.split(":").map(Number);
      const [eh, em] = slot.endTime.split(":").map(Number);

      const start = new Date(
        `2000-01-01T${String(sh).padStart(2, "0")}:${String(sm).padStart(
          2,
          "0"
        )}:00`
      );
      const end = new Date(
        `2000-01-01T${String(eh).padStart(2, "0")}:${String(em).padStart(
          2,
          "0"
        )}:00`
      );

      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  };

  const formatDuration = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };
  const formatDate = (date: Date | string | undefined, timezone?: string) => {
    if (!date) return "";

    if (timezone && typeof date === "string") {
      // Convert the date to user's timezone
      const { formattedDate } = convertTimesToUserTimezone(
        "00:00", // dummy time for date conversion
        "00:00", // dummy time for date conversion
        date,
        timezone
      );
      return moment(formattedDate).format("dddd, MMM DD, YYYY");
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;
    return moment(dateObj).format("dddd, MMM DD, YYYY");
  };
  const formatTime = (timeStr: string, dateStr: string, timezone?: string) => {
    if (timezone) {
      // Use convertTimesToUserTimezone for proper timezone conversion
      const { formattedStartTime, formattedEndTime } =
        convertTimesToUserTimezone(
          timeStr,
          timeStr, // same time for start and end since we only need start
          dateStr,
          timezone
        );
      return formattedStartTime;
    }
    return moment(`2000-01-01 ${timeStr}`).format("h:mm A");
  };

  const formatDateRange = (
    startDate: Date,
    endDate: Date,
    timezone?: string
  ) => {
    const userTz = timezone || getUserTimezone();

    if (timezone) {
      // Convert dates to user's timezone
      const startMoment = moment.tz(startDate, userTz);
      const endMoment = moment.tz(endDate, userTz);

      if (startMoment.format("YYYY-MM-DD") === endMoment.format("YYYY-MM-DD")) {
        // Same date
        return startMoment.format("dddd, MMMM DD, YYYY");
      } else {
        // Different dates
        return `${startMoment.format("MMM DD")} - ${endMoment.format(
          "MMM DD, YYYY"
        )}`;
      }
    }

    // Fallback to moment without timezone
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);

    if (startMoment.format("YYYY-MM-DD") === endMoment.format("YYYY-MM-DD")) {
      return startMoment.format("dddd, MMMM DD, YYYY");
    } else {
      return `${startMoment.format("MMM DD")} - ${endMoment.format(
        "MMM DD, YYYY"
      )}`;
    }
  };

  return (
    <div className="w-full min-h-screen  p-6">
      {!selectedRange ? (
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl ">
            <CardContent className="p-16 text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32  rounded-full mx-auto flex items-center justify-center shadow-xl">
                  <Clock className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Begin?
              </h2>
              <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                Select your available dates from the calendar above to unlock
                the time slot designer
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Overview Section - First on mobile */}
            <div className="xl:col-span-1 xl:order-2 order-1">
              <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg sticky top-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Schedule Overview
                  </h2>
                  <p className="text-gray-600">Your availability summary</p>
                </div>

                {/* Stats Cards */}
                <div className="space-y-4 mb-8">
                  {/* Date Card */}
                  {selectedRange && (
                    <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl p-6 border border-indigo-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-indigo-600 font-medium">
                            Selected Date Range
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            {formatDateRange(
                              new Date(selectedRange.start),
                              new Date(selectedRange.end),
                              getUserTimezone()
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedRange.start === selectedRange.end
                              ? "Single day"
                              : `${Math.ceil(
                                  (new Date(selectedRange.end).getTime() -
                                    new Date(selectedRange.start).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )} days`}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-indigo-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">
                          Active Periods
                        </p>
                        <p className="text-3xl font-bold text-gray-800">
                          {slots.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedCount > 0 && `${selectedCount} selected`}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-emerald-600 font-medium">
                          Total Duration
                        </p>
                        <p className="text-3xl font-bold text-gray-800">
                          {formatDuration(getTotalHours())}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {isValidSlot(slots[0])
                            ? "Valid schedule"
                            : "Check time ranges"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {selectedCount > 0 && (
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">
                            Selected for Action
                          </p>
                          <p className="text-3xl font-bold text-gray-800">
                            {selectedCount}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Ready to delete
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                          <Check className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="xl:col-span-2 xl:order-1 order-2">
              <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {hasExistingSlots ? "Available" : "New"} Periods
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        Design your schedule with precision
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-x-3 items-center">
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={addSlot}
                        disabled={savingSlotId !== null}
                        className={`font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base ${
                          savingSlotId !== null
                            ? "bg-gray-400 cursor-not-allowed text-gray-200"
                            : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                        }`}
                      >
                        {savingSlotId !== null ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        )}
                        {savingSlotId !== null ? "Saving..." : "Add Period"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Professional Scheduling Info */}
                {process.env.NODE_ENV !== "production" && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-blue-700 mt-1">
                          🕐 3-hour minimum periods • ⏰ 1-hour buffer between
                          blocks • 🚫 No conflicts possible •
                        </p>
                        <div className="mt-2 text-xs text-blue-600">
                          <p>
                            📊 Current Status:{" "}
                            {slots.filter((s) => s.isExisting).length} existing
                            periods, {slots.filter((s) => !s.isExisting).length}{" "}
                            new periods
                          </p>

                          <p>
                            🚫 All periods cannot overlap with each other (1hr
                            buffer enforced)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message Display */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-red-800">
                          Error
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bulk Actions */}
                {slots.length > 1 && (
                  <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          className="data-[state=checked]:bg-emerald-500 cursor-pointer data-[state=checked]:border-emerald-500"
                        />
                        <label
                          htmlFor="select-all"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Select All ({slots.length})
                        </label>
                      </div>
                      {selectedCount > 0 && (
                        <div className="flex items-center space-x-2 text-emerald-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {selectedCount} selected
                          </span>
                        </div>
                      )}
                    </div>
                    {selectedCount > 0 && (
                      <Button
                        onClick={handleBulkDelete}
                        variant="destructive"
                        className="bg-red-500 cursor-pointer hover:bg-red-600 text-white border border-red-500 px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected
                      </Button>
                    )}
                  </div>
                )}

                {/* Period Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {slots.map((slot, index) => {
                    const formattedDate = formatDate(
                      slot.date,
                      getUserTimezone()
                    );
                    return (
                      <div
                        key={slot.id}
                        className={`group relative rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-[1.02] ${
                          slot.isSelected
                            ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-500/20"
                            : slot.isExisting
                            ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                            : "border-blue-400 bg-blue-50 hover:border-blue-500 hover:shadow-md"
                        } ${
                          !isValidSlot(slot) ? "border-red-300 bg-red-50" : ""
                        }`}
                      >
                        {/* Selection Checkbox */}
                        <div className="absolute top-3 right-3">
                          <Checkbox
                            checked={slot.isSelected}
                            onCheckedChange={() => toggleSlotSelection(slot.id)}
                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 w-4 h-4"
                          />
                        </div>

                        {/* Header */}
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              slot.isExisting
                                ? "bg-blue-400"
                                : isValidSlot(slot)
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-red-400"
                            }`}
                          ></div>
                          <h3 className="font-semibold text-sm text-gray-800 truncate">
                            {slot.isExisting
                              ? "Period/Slot"
                              : "New-Period/Slot"}{" "}
                            #{index + 1}
                          </h3>
                        </div>

                        {/* Date Display */}
                        {formattedDate && (
                          <div className="text-center mb-3">
                            <p className="font-medium text-sm text-gray-700">
                              {formattedDate}
                            </p>
                          </div>
                        )}

                        {/* Time Display */}
                        <div className="space-y-1 mb-3">
                          <div className="text-center">
                            <p className="font-medium text-sm text-gray-800">
                              {formatTime(
                                slot.startTime,
                                slot.date?.toString() || "",
                                getUserTimezone()
                              )}{" "}
                              -{" "}
                              {formatTime(
                                slot.endTime,
                                slot.date?.toString() || "",
                                getUserTimezone()
                              )}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="font-medium text-sm text-gray-800">
                              {isValidSlot(slot)
                                ? formatDuration(
                                    (() => {
                                      const [sh, sm] = slot.startTime
                                        .split(":")
                                        .map(Number);
                                      const [eh, em] = slot.endTime
                                        .split(":")
                                        .map(Number);
                                      const start = new Date(
                                        `2000-01-01T${String(sh).padStart(
                                          2,
                                          "0"
                                        )}:${String(sm).padStart(2, "0")}:00`
                                      );
                                      const end = new Date(
                                        `2000-01-01T${String(eh).padStart(
                                          2,
                                          "0"
                                        )}:${String(em).padStart(2, "0")}:00`
                                      );
                                      return (
                                        (end.getTime() - start.getTime()) /
                                        (1000 * 60 * 60)
                                      );
                                    })()
                                  )
                                : "Invalid"}
                            </p>
                          </div>
                        </div>

                        {/* Time Block Selector - Only show for new periods */}
                        {!slot.isExisting && (
                          <div className="space-y-2 mb-3">
                            <div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-gray-600 block mb-1">
                                    Start Time
                                  </label>
                                  <input
                                    type="time"
                                    value={slot.startTime || "09:00"}
                                    onChange={(e) => {
                                      setSlots((prev) =>
                                        prev.map((s) =>
                                          s.id === slot.id
                                            ? {
                                                ...s,
                                                startTime: e.target.value,
                                              }
                                            : s
                                        )
                                      );
                                    }}
                                    disabled={savingSlotId === slot.id}
                                    className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                      savingSlotId === slot.id
                                        ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                                        : "bg-white border-gray-300"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600 block mb-1">
                                    End Time
                                  </label>
                                  <input
                                    type="time"
                                    value={slot.endTime || "12:00"}
                                    onChange={(e) => {
                                      setSlots((prev) =>
                                        prev.map((s) =>
                                          s.id === slot.id
                                            ? { ...s, endTime: e.target.value }
                                            : s
                                        )
                                      );
                                    }}
                                    disabled={savingSlotId === slot.id}
                                    className={`w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                      savingSlotId === slot.id
                                        ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                                        : "bg-white border-gray-300"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {!isValidSlot(slot) && (
                              <div className="flex items-center space-x-1 text-red-600">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  Invalid time range
                                </span>
                              </div>
                            )}

                            {/* Individual Save Button - Only for new slots */}
                            {isValidSlot(slot) && !slot.isExisting && (
                              <Button
                                variant="default"
                                size="sm"
                                disabled={savingSlotId === slot.id}
                                onClick={() => {
                                  saveIndividualPeriod(slot.id);
                                }}
                                className={`inline-flex items-center justify-center px-3 py-1.5 h-7 rounded-md text-white text-xs font-medium shadow-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${
                                  savingSlotId === slot.id
                                    ? "opacity-60 cursor-not-allowed"
                                    : ""
                                }`}
                                title={
                                  savingSlotId === slot.id
                                    ? "Saving..."
                                    : "Save new period"
                                }
                              >
                                {savingSlotId === slot.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <span>Create Periods</span>
                                )}
                              </Button>
                            )}
                          </div>

                          {slots.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={savingSlotId === slot.id}
                              onClick={() => {
                                console.log("SLOT PERIOD:", slot);
                                removeSlot(slot.id);
                              }}
                              className={`h-6 w-6 p-0 rounded-md transition-all duration-200 ${
                                savingSlotId === slot.id
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              }`}
                              title={
                                savingSlotId === slot.id
                                  ? "Cannot delete while saving"
                                  : "Delete period"
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default React.memo(TimeSlotCreator);
