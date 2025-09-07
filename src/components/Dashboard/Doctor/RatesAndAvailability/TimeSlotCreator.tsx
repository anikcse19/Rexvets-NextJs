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
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {!selectedRange ? (
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/60 backdrop-blur-xl">
            <CardContent className="p-16 text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center shadow-xl">
                  <Clock className="h-16 w-16 text-gray-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Begin?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Select your available dates from the calendar above to unlock
                the time slot designer
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-violet-400 to-purple-400 rounded mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className=" container mx-auto">
          <div className="flex flex-col  lg:flex-row gap-8">
            {/* Time Slots Section */}
            <div className="w-full md:w-[50%] space-y-6">
              {slots.map((slot, index) => (
                <Card
                  key={slot.id}
                  className="group relative border-0 shadow-xl bg-white/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-0.5">
                    <div className="w-full h-full bg-white rounded-3xl"></div>
                  </div>

                  <div className="relative p-8">
                    {/* Floating Slot Number */}
                    <div className="absolute -top-4 left-8 z-10">
                      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="font-bold text-sm">
                            SLOT {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    {slots.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSlot(slot.id)}
                        className="absolute top-6 right-6 h-10 w-10 p-0 bg-red-50/80 backdrop-blur border-red-200 hover:bg-red-100 hover:border-red-300 text-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      {/* Start Time */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <span>Start Time</span>
                        </label>
                        <Select
                          value={slot.startTime}
                          onValueChange={(value) =>
                            updateSlot(slot.id, "startTime", value)
                          }
                        >
                          <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-violet-300 focus:border-violet-500 rounded-2xl bg-white/80 backdrop-blur transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                            {timeOptions.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                className="rounded-lg hover:bg-violet-50 focus:bg-violet-100 text-base py-3"
                              >
                                {formatDisplayTime(time)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* End Time */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg flex items-center justify-center">
                            <Timer className="w-4 h-4 text-white" />
                          </div>
                          <span>End Time</span>
                        </label>
                        <Select
                          value={slot.endTime}
                          onValueChange={(value) =>
                            updateSlot(slot.id, "endTime", value)
                          }
                        >
                          <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-violet-300 focus:border-violet-500 rounded-2xl bg-white/80 backdrop-blur transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl">
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                            {timeOptions.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                className="rounded-lg hover:bg-violet-50 focus:bg-violet-100 text-base py-3"
                              >
                                {formatDisplayTime(time)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Duration & Status */}
                    {isValidSlot(slot) && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <Timer className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Duration
                              </p>
                              <p className="text-xl font-bold text-gray-800">
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
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 px-4 py-2 text-sm font-bold shadow-lg">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Valid Slot
                          </Badge>
                        </div>
                      </div>
                    )}

                    {!isValidSlot(slot) && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-600">
                              Invalid Configuration
                            </p>
                            <p className="text-sm text-red-500">
                              End time must be after start time
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {/* Add New Slot Button */}
              <div className="flex justify-center py-8">
                <Button
                  onClick={addSlot}
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-800 rounded-xl px-8 py-3 font-medium transition-all duration-200 hover:shadow-md"
                >
                  Add Time Slot
                </Button>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="w-full md:w-[50%] ">
              <div className="flex md:flex-row  flex-col gap-x-4">
                {/* Overview Card */}
                <Card className="border-0 shadow-2xl w-full md:w-[40%] bg-white/70 backdrop-blur-xl overflow-hidden">
                  <div className="h-[270px] p-6 flex flex-col justify-start">
                    <h3 className="text-black font-bold text-lg flex items-center mb-4">
                      <Target className="w-5 h-5 mr-2" />
                      Overview
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-blue-600">
                          Active Slots
                        </p>
                        <p className="text-2xl font-bold text-blue-800">
                          {slots.length}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-emerald-600">
                          Total Duration
                        </p>
                        <p className="text-2xl font-bold text-emerald-800">
                          {formatDuration(getTotalHours())}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Action Card */}
                <Card className="border w-full  md:w-[40%] border-gray-200 shadow-lg bg-gray-900">
                  <div className="h-[270px] p-6 flex flex-col items-center justify-center text-white">
                    <h3 className="text-lg font-bold mb-2 text-center">
                      Ready to Launch?
                    </h3>
                    <Button
                      onClick={handleSave}
                      disabled={!validateSlots() || isLoading}
                      className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Create Availability</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
