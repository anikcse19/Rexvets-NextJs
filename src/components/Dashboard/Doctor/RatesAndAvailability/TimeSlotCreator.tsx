"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  CheckCircle,
  ChevronDown,
  Clock,
  Plus,
  Save,
  Timer,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface TimeSlotCreatorProps {
  selectedRange: DateRange | null;
  onSaveSlots: (slots: SlotPeriod[]) => void;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export default function TimeSlotCreator({
  selectedRange,
  onSaveSlots,
}: TimeSlotCreatorProps) {
  // start with one slot with default times (9 AM to 5 PM)
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: "1", startTime: "09:00", endTime: "17:00" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openPopover, setOpenPopover] = useState<{
    [key: string]: boolean;
  }>({});

  const timeOptions = generateTimeOptions();

  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00", // Default start time
      endTime: "17:00", // Default end time
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

      await onSaveSlots(slotPeriods);

      // Reset slots to default after successful save
      setSlots([{ id: "1", startTime: "09:00", endTime: "17:00" }]);
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
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            Time Slots
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-sm bg-purple-100 text-purple-700 border-purple-200"
          >
            Total: {getTotalHours().toFixed(1)}h
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedRange ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Clock className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Select a date range first
            </p>
            <p className="text-gray-500">
              Choose your available dates from the calendar above to create time
              slots.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <div>
                  <div className="space-y-3">
                    {slots.map((slot, index) => (
                      <div
                        key={slot.id}
                        className="group relative bg-white border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {/* Slot Number Badge */}
                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                          Time Slot {index + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              Start Time
                            </label>
                            <Select
                              value={slot.startTime}
                              onValueChange={(value) =>
                                updateSlot(slot.id, "startTime", value)
                              }
                            >
                              <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors">
                                <SelectValue placeholder="Select start time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {formatDisplayTime(time)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              End Time
                            </label>
                            <Select
                              value={slot.endTime}
                              onValueChange={(value) =>
                                updateSlot(slot.id, "endTime", value)
                              }
                            >
                              <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-purple-500 transition-colors">
                                <SelectValue placeholder="Select end time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {formatDisplayTime(time)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Duration Display */}
                        {isValidSlot(slot) && (
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Timer className="w-4 h-4" />
                              Duration:{" "}
                              {formatDuration(
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
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {isValidSlot(slot) ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Valid
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Invalid
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Delete Button */}
                        {slots.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSlot(slot.id)}
                            className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {/* Add Period Button */}
                    <div className="flex justify-center my-8">
                      <Button
                        variant="outline"
                        onClick={addSlot}
                        className="group flex items-center gap-3 bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-indigo-50 text-slate-700 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:text-blue-700 transition-all duration-300 px-8 py-4 rounded-2xl shadow-sm hover:shadow-md transform hover:-translate-y-1"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Plus className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-lg">
                          Add New Time Period
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-4">
                <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        Active Slots
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {slots.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        Total Duration
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {formatDuration(getTotalHours())}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Timer className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Create Availability Button */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                      <Save className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        Ready to Create?
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        {validateSlots()
                          ? `${slots.length} time slot${
                              slots.length !== 1 ? "s" : ""
                            } configured`
                          : "Please configure valid time slots"}
                      </p>
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={!validateSlots() || isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold py-3"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Create Availability
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
