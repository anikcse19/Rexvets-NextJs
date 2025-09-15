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
  errors?: Record<string, string>;
}

const defaultSchedule: Schedule = {
  monday: { start: "", end: "", available: false },
  tuesday: { start: "", end: "", available: false },
  wednesday: { start: "", end: "", available: false },
  thursday: { start: "", end: "", available: false },
  friday: { start: "", end: "", available: false },
  saturday: { start: "", end: "", available: false },
  sunday: { start: "", end: "", available: false },
};

export default function ScheduleStep({
  onNext,
  onBack,
  initialData = defaultSchedule,
}: ScheduleStepProps) {
  const [schedule, setSchedule] = useState<Schedule>(initialData);

  const addTimeSlot = (day: keyof Schedule) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...((prev[day] as any) || []), { startTime: "", endTime: "" }],
    }));
  };

  const removeTimeSlot = (day: keyof Schedule, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]:
        (prev[day] as any)?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  const updateTimeSlot = (
    day: keyof Schedule,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]:
        (prev[day] as any)?.map((slot: any, i: number) =>
          i === index ? { ...slot, [field]: value } : slot
        ) || [],
    }));
  };

  const validateSchedule = (): boolean => {
    const hasValidSlots = Object.values(schedule).some(
      (daySlots: any) =>
        Array.isArray(daySlots) &&
        daySlots.some(
          (slot: any) =>
            slot.startTime && slot.endTime && slot.startTime < slot.endTime
        )
    );
    return hasValidSlots;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSchedule()) {
      // Filter out empty time slots
      const cleanedSchedule = Object.keys(schedule).reduce((acc: any, day) => {
        const daySlots = (schedule as any)[day];
        if (Array.isArray(daySlots)) {
          const validSlots = daySlots.filter(
            (slot: any) => slot.startTime && slot.endTime
          );
          if (validSlots.length > 0) {
            acc[day] = validSlots;
          }
        }
        return acc;
      }, {} as Schedule);

      console.log("Submitting schedule:", cleanedSchedule);

      onNext(cleanedSchedule);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Set Your Schedule
          </CardTitle>
          <p className="text-gray-300 ">
            Define your available consultation hours
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  {day}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot(day as keyof Schedule)}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Time Slot
                </Button>
              </div>

              {(schedule as any)[day]?.length ? (
                <div className="space-y-3">
                  {(schedule as any)[day].map(
                    (timeSlot: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-3 backdrop-blur-xl bg-white/20 border-white/20 rounded-lg"
                      >
                        <div className="flex-1">
                          <Label className="text-sm text-white">From</Label>
                          <Select
                            value={timeSlot.startTime}
                            onValueChange={(value) =>
                              updateTimeSlot(
                                day as keyof Schedule,
                                index,
                                "startTime",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="mt-1 text-white placeholder:text-white">
                              <SelectValue
                                placeholder="Start time"
                                className="placeholder:text-white"
                              />
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
                          <Label className="text-sm text-white">To</Label>
                          <Select
                            value={timeSlot.endTime}
                            onValueChange={(value) =>
                              updateTimeSlot(
                                day as keyof Schedule,
                                index,
                                "endTime",
                                value
                              )
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
                          onClick={() =>
                            removeTimeSlot(day as keyof Schedule, index)
                          }
                          className="text-red-500 hover:text-red-700 bg-red-50 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )
                  )}
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
