"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserTimezone } from "@/lib/timezone";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { DateRange, SlotPeriod } from "@/lib/types";
import { formatDisplayTime, generateTimeOptions } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface TimeSlotCreatorProps {
  selectedRange: DateRange | null;
  onSaveSlots: (slots: SlotPeriod[]) => Promise<void>;
  hasExistingSlots?: boolean;
  existingPeriods?: Array<{
    startTime: string;
    endTime: string;
    totalHours: number;
    slots: any[];
    timezone?: string;
  }>;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isExisting?: boolean;
  isSelected?: boolean;
  date?: Date;
}

export default function TimeSlotCreator({
  selectedRange,
  onSaveSlots,
  hasExistingSlots = false,
  existingPeriods = [],
}: TimeSlotCreatorProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      startTime: "09:00",
      endTime: "17:00",
      isExisting: false,
      isSelected: false,
      date: selectedRange?.start,
    },
  ]);
  console.log("existingPeriods", existingPeriods);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openPopover, setOpenPopover] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);

  // Memoize the processed existing periods to avoid recalculation
  const processedExistingPeriods = useMemo(() => {
    if (!hasExistingSlots || !existingPeriods.length) return [];
    return existingPeriods.map((period, index) => ({
      id: `existing-${index + 1}`,
      startTime: period.startTime,
      endTime: period.endTime,
      isExisting: true,
      isSelected: false,
      date: period?.slots[0]?.formattedDate,
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
          endTime: "17:00",
          isExisting: false,
          isSelected: false,
          date: selectedRange?.start,
        },
      ]);
    }
  }, [hasExistingSlots, processedExistingPeriods]);

  const timeOptions = generateTimeOptions();

  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00", // Default start time
      endTime: "17:00", // Default end time
      isExisting: false,
      isSelected: false,
      date: selectedRange?.start,
    };
    setSlots([...slots, newSlot]);
  };

  const removeSlot = (id: string) => {
    // Don't allow removing the last slot
    if (slots.length > 1) {
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

  const handleBulkDelete = () => {
    const selectedSlots = slots.filter((slot) => slot.isSelected);
    if (selectedSlots.length === 0) {
      toast.error("No slots selected for deletion");
      return;
    }

    if (selectedSlots.length === slots.length) {
      toast.error("Cannot delete all slots. At least one slot must remain.");
      return;
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

  const updateSlot = (
    id: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSlots(
      slots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const validateSlots = (): boolean => {
    // Check if we have at least one valid slot
    if (slots.length === 0) return false;

    for (const slot of slots) {
      if (!slot.startTime || !slot.endTime) return false;
      if (slot.startTime >= slot.endTime) return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!selectedRange || !validateSlots()) {
      toast.error(
        "Please select a date range and ensure all time slots are valid"
      );
      return;
    }

    setIsLoading(true);

    try {
      const slotPeriods: SlotPeriod[] = slots.map((slot) => {
        const [startH, startM] = slot.startTime.split(":").map(Number);
        const [endH, endM] = slot.endTime.split(":").map(Number);

        const start = new Date(selectedRange.start);
        start.setHours(startH, startM, 0, 0);

        const end = new Date(selectedRange.start);
        end.setHours(endH, endM, 0, 0);

        return { start, end };
      });

      console.log("Saving slots:", slots);
      console.log("Slot periods:", slotPeriods);

      await onSaveSlots(slotPeriods);

      // Reset slots after successful save
      if (hasExistingSlots && processedExistingPeriods.length > 0) {
        setSlots(processedExistingPeriods);
      } else {
        setSlots([
          {
            id: "1",
            startTime: "09:00",
            endTime: "17:00",
            isExisting: false,
            isSelected: false,
          },
        ]);
      }
      setSelectAll(false);
    } catch (error: any) {
      console.error("Error saving slots:", error);
      toast.error("Failed to save availability slots", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidSlot = (slot: TimeSlot): boolean => {
    return (
      typeof slot.startTime === "string" &&
      slot.startTime !== "" &&
      typeof slot.endTime === "string" &&
      slot.endTime !== "" &&
      slot.startTime < slot.endTime
    );
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
            {/* Availability Section */}
            <div className="xl:col-span-2">
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
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={addSlot}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Add Period
                    </Button>
                  </div>
                </div>

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
                        className="bg-red-500 hover:bg-red-600 text-white border border-red-500 px-4 py-2 rounded-lg transition-all duration-200"
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
                    console.log("slot", slot);
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
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
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
                            {slot.isExisting ? "Existing" : "New"} #{index + 1}
                          </h3>
                        </div>

                        {/* Date Display */}
                        {formattedDate && (
                          <div className="text-center mb-3">
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-medium text-sm text-gray-700">
                              {formattedDate}
                            </p>
                          </div>
                        )}

                         {/* Time Display */}
                         <div className="space-y-1 mb-3">
                           <div className="text-center">
                             <p className="text-xs text-gray-500">Time</p>
                             <p className="font-medium text-sm text-gray-800">
                               {formatTime(slot.startTime, slot.date?.toString() || '', getUserTimezone())} -{" "}
                               {formatTime(slot.endTime, slot.date?.toString() || '', getUserTimezone())}
                             </p>
                           </div>

                          <div className="text-center">
                            <p className="text-xs text-gray-500">Duration</p>
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

                        {/* Time Selectors */}
                        <div className="space-y-2 mb-3">
                          <div className="grid grid-cols-2 gap-1">
                             <Select
                               value={slot.startTime}
                               onValueChange={(value) =>
                                 updateSlot(slot.id, "startTime", value)
                               }
                             >
                               <SelectTrigger className="h-8 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-emerald-500 text-xs">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-white border-gray-200">
                                 {timeOptions.map((time) => (
                                   <SelectItem
                                     key={time}
                                     value={time}
                                     className="text-gray-800 hover:bg-gray-100 text-xs"
                                   >
                                     {formatTime(time, slot.date?.toString() || '', getUserTimezone())}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>

                             <Select
                               value={slot.endTime}
                               onValueChange={(value) =>
                                 updateSlot(slot.id, "endTime", value)
                               }
                             >
                               <SelectTrigger className="h-8 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-emerald-500 text-xs">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-white border-gray-200">
                                 {timeOptions.map((time) => (
                                   <SelectItem
                                     key={time}
                                     value={time}
                                     className="text-gray-800 hover:bg-gray-100 text-xs"
                                   >
                                     {formatTime(time, slot.date?.toString() || '', getUserTimezone())}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          {!isValidSlot(slot) && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              <span className="text-xs">Invalid</span>
                            </div>
                          )}

                          {slots.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSlot(slot.id)}
                              className="ml-auto h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-all duration-200"
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

            {/* Overview Section */}
            <div className="xl:col-span-1">
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
                            Selected Date
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            {new Date(selectedRange.start).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
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

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={!validateSlots() || isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Schedule...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Save className="w-6 h-6" />
                      <span>Save & Launch Schedule</span>
                    </div>
                  )}
                </Button>

                {/* Quick Actions */}
                {slots.length > 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Quick Actions</p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSelectAll}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {selectAll ? (
                          <X className="w-4 h-4 mr-2" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        {selectAll ? "Deselect All" : "Select All"}
                      </Button>
                      {selectedCount > 0 && (
                        <Button
                          onClick={handleBulkDelete}
                          variant="outline"
                          size="sm"
                          className="bg-red-500 border-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
