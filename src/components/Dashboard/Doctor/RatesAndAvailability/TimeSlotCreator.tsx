"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange, SlotPeriod } from "@/lib/types";
import { formatDisplayTime, generateTimeOptions } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Plus,
  Save,
  Target,
  Timer,
  Trash2,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface TimeSlotCreatorProps {
  selectedRange: DateRange | null;
  onSaveSlots: (slots: SlotPeriod[]) => void;
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
}

export default function TimeSlotCreator({
  selectedRange,
  onSaveSlots,
  hasExistingSlots = false,
  existingPeriods = [],
}: TimeSlotCreatorProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: "1", startTime: "09:00", endTime: "17:00", isExisting: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openPopover, setOpenPopover] = useState<{
    [key: string]: boolean;
  }>({});

  // Memoize the processed existing periods to avoid recalculation
  const processedExistingPeriods = useMemo(() => {
    if (!hasExistingSlots || !existingPeriods.length) return [];
    return existingPeriods.map((period, index) => ({
      id: `existing-${index + 1}`,
      startTime: period.startTime,
      endTime: period.endTime,
      isExisting: true,
    }));
  }, [hasExistingSlots, existingPeriods]);

  // Reinitialize slots when processed periods change
  useEffect(() => {
    if (hasExistingSlots && processedExistingPeriods.length > 0) {
      setSlots(processedExistingPeriods);
    } else {
      setSlots([
        { id: "1", startTime: "09:00", endTime: "17:00", isExisting: false },
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
    };
    setSlots([...slots, newSlot]);
  };

  const removeSlot = (id: string) => {
    // Don't allow removing the last slot
    if (slots.length > 1) {
      setSlots(slots.filter((slot) => slot.id !== id));
    }
  };

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

      onSaveSlots(slotPeriods);

      // Reset slots after successful save
      if (hasExistingSlots && processedExistingPeriods.length > 0) {
        setSlots(processedExistingPeriods);
      } else {
        setSlots([
          { id: "1", startTime: "09:00", endTime: "17:00", isExisting: false },
        ]);
      }
    } catch (error) {
      console.error("Error saving slots:", error);
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
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Availability Section */}
            <div className="md:col-span-2">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        Availability
                      </h2>
                      <p className="text-sm">
                        Manage your schedule periods
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={addSlot}
                    className="font-semibold px-6 py-2 rounded-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Period
                  </Button>
                </div>

                {/* Period Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {slots.map((slot, index) => (
                    <div
                      key={slot.id}
                      className="group relative rounded-2xl p-4 border border-gray-300 hover:border-purple-400/50 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        {/* Status Dot and Title */}
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                          <h3 className="font-bold text-lg">
                            {slot.isExisting ? "Existing Period" : "New Period"}{" "}
                            {index + 1}
                          </h3>
                        </div>

                        {/* Period Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {formatDisplayTime(slot.startTime)} -{" "}
                              {formatDisplayTime(slot.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4" />
                            <span className="text-sm font-medium">
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
                            </span>
                          </div>
                        </div>

                        {/* Time Selectors */}
                        <div className="flex items-center space-x-2">
                          <Select
                            value={slot.startTime}
                            onValueChange={(value) =>
                              updateSlot(slot.id, "startTime", value)
                            }
                          >
                            <SelectTrigger className="w-20 h-8 border border-gray-300 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                >
                                  {formatDisplayTime(time)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-xs">to</span>
                          <Select
                            value={slot.endTime}
                            onValueChange={(value) =>
                              updateSlot(slot.id, "endTime", value)
                            }
                          >
                            <SelectTrigger className="w-20 h-8 border border-gray-300 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                >
                                  {formatDisplayTime(time)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Delete Button */}
                        {slots.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSlot(slot.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Error Message */}
                        {!isValidSlot(slot) && (
                          <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="text-red-300 text-xs">
                                End time must be after start time
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="md:col-span-1">
              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold">Overview</h2>
                  <p className="text-sm">Your schedule summary</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="rounded-xl p-4 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Active Periods</p>
                        <p className="text-2xl font-bold">
                          {slots.length}
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Total Duration</p>
                        <p className="text-2xl font-bold">
                          {formatDuration(getTotalHours())}
                        </p>
                      </div>
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={!validateSlots() || isLoading}
                  className="w-full font-bold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Save className="w-5 h-5" />
                      <span>Save & Launch</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
