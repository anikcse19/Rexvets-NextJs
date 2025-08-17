"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Plus, X } from "lucide-react";
import { Schedule } from "@/lib/types";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib";

interface ScheduleStepProps {
  onNext: (schedule: Schedule) => void;
  onBack: () => void;
  initialData?: Schedule;
}

export default function ScheduleStep({
  onNext,
  onBack,
  initialData,
}: ScheduleStepProps) {
  const [schedule, setSchedule] = useState<Schedule>(initialData || {});

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { startTime: "", endTime: "" }],
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateTimeSlot = (
    day: string,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]:
        prev[day]?.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ) || [],
    }));
  };

  const validateSchedule = (): boolean => {
    const hasValidSlots = Object.values(schedule).some((daySlots) =>
      daySlots.some(
        (slot) =>
          slot.startTime && slot.endTime && slot.startTime < slot.endTime
      )
    );
    return hasValidSlots;
  };

  const handleSubmit = () => {
    if (validateSchedule()) {
      // Filter out empty time slots
      const cleanedSchedule = Object.keys(schedule).reduce((acc, day) => {
        const validSlots = schedule[day].filter(
          (slot) => slot.startTime && slot.endTime
        );
        if (validSlots.length > 0) {
          acc[day] = validSlots;
        }
        return acc;
      }, {} as Schedule);

      onNext(cleanedSchedule);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Set Your Schedule
          </CardTitle>
          <p className="text-muted-foreground">
            Define your available consultation hours
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {day}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot(day)}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Time Slot
                </Button>
              </div>

              {schedule[day]?.length ? (
                <div className="space-y-3">
                  {schedule[day].map((timeSlot, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground">
                          From
                        </Label>
                        <Select
                          value={timeSlot.startTime}
                          onValueChange={(value) =>
                            updateTimeSlot(day, index, "startTime", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((slot) => (
                              <SelectItem key={slot.value} value={slot.value}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground">
                          To
                        </Label>
                        <Select
                          value={timeSlot.endTime}
                          onValueChange={(value) =>
                            updateTimeSlot(day, index, "endTime", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.filter(
                              (slot) => slot.value > timeSlot.startTime
                            ).map((slot) => (
                              <SelectItem key={slot.value} value={slot.value}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(day, index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic text-center py-4">
                  No time slots added for {day}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!validateSchedule()}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Continue to Profile Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
