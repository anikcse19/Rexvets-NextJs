"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange, SlotPeriod } from "@/lib/types";
import { formatDisplayTime, generateTimeOptions } from "@/lib/utils";
import { Clock, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

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
  // start with one empty slot
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: "1", startTime: "", endTime: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const timeOptions = generateTimeOptions();

  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "",
      endTime: "",
    };
    setSlots([...slots, newSlot]);
  };

  const removeSlot = (id: string) => {
    setSlots(slots.filter((slot) => slot.id !== id));
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
    for (const slot of slots) {
      if (!slot.startTime || !slot.endTime) return false;
      if (slot.startTime >= slot.endTime) return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!selectedRange || !validateSlots()) return;

    setIsLoading(true);

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
    setIsLoading(false);
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
            <div className="space-y-3">
              {slots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl bg-white shadow-sm"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Start Time
                      </label>
                      <Select
                        value={slot.startTime}
                        onValueChange={(value) =>
                          updateSlot(slot.id, "startTime", value)
                        }
                      >
                        <SelectTrigger>
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
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        End Time
                      </label>
                      <Select
                        value={slot.endTime}
                        onValueChange={(value) =>
                          updateSlot(slot.id, "endTime", value)
                        }
                      >
                        <SelectTrigger>
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
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant={isValidSlot(slot) ? "default" : "destructive"}
                      className={`text-xs ${
                        isValidSlot(slot)
                          ? "bg-green-100 text-green-700 border-green-200"
                          : ""
                      }`}
                    >
                      Slot {index + 1}
                    </Badge>
                    {slots.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSlot(slot.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={addSlot}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </Button>
              <Button
                onClick={handleSave}
                disabled={!validateSlots() || isLoading}
                className="flex items-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Creating..." : "Create Availability"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
