"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Settings,
  Timer,
  Save,
  Info,
} from "lucide-react";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

const initialSchedule: DaySchedule[] = [
  {
    day: "Monday",
    enabled: true,
    timeSlots: [
      { id: "1", startTime: "09:00", endTime: "12:00" },
      { id: "2", startTime: "14:00", endTime: "18:00" },
    ],
  },
  {
    day: "Tuesday",
    enabled: true,
    timeSlots: [
      { id: "3", startTime: "09:00", endTime: "12:00" },
      { id: "4", startTime: "14:00", endTime: "18:00" },
    ],
  },
  {
    day: "Wednesday",
    enabled: true,
    timeSlots: [
      { id: "5", startTime: "09:00", endTime: "12:00" },
      { id: "6", startTime: "14:00", endTime: "18:00" },
    ],
  },
  {
    day: "Thursday",
    enabled: true,
    timeSlots: [
      { id: "7", startTime: "09:00", endTime: "12:00" },
      { id: "8", startTime: "14:00", endTime: "18:00" },
    ],
  },
  {
    day: "Friday",
    enabled: true,
    timeSlots: [
      { id: "9", startTime: "09:00", endTime: "12:00" },
      { id: "10", startTime: "14:00", endTime: "18:00" },
    ],
  },
  {
    day: "Saturday",
    enabled: true,
    timeSlots: [{ id: "11", startTime: "10:00", endTime: "14:00" }],
  },
  {
    day: "Sunday",
    enabled: false,
    timeSlots: [],
  },
];

export default function RatesAndAvailabilityPage() {
  const [bookingNotice, setBookingNotice] = useState<15 | 30>(15);
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [hasChanges, setHasChanges] = useState(false);

  const handleBookingNoticeChange = (minutes: 15 | 30) => {
    setBookingNotice(minutes);
    setHasChanges(true);
  };

  const toggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
    if (!newSchedule[dayIndex].enabled) {
      newSchedule[dayIndex].timeSlots = [];
    }
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "10:00",
    };
    newSchedule[dayIndex].timeSlots.push(newSlot);
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots = newSchedule[dayIndex].timeSlots.filter(
      (slot) => slot.id !== slotId
    );
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedule = [...schedule];
    const slotIndex = newSchedule[dayIndex].timeSlots.findIndex(
      (slot) => slot.id === slotId
    );
    if (slotIndex !== -1) {
      newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
      setSchedule(newSchedule);
      setHasChanges(true);
    }
  };

  const saveChanges = () => {
    // Here you would make API call to save the changes
    console.log("Saving changes:", { bookingNotice, schedule });
    setHasChanges(false);
    // Show success message
  };

  const getTotalHours = (timeSlots: TimeSlot[]) => {
    return timeSlots.reduce((total, slot) => {
      const start = new Date(`2000-01-01T${slot.startTime}:00`);
      const end = new Date(`2000-01-01T${slot.endTime}:00`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Rates & Availability
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your booking settings and weekly schedule.
          </p>
        </div>

        {hasChanges && (
          <Button
            onClick={saveChanges}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Booking Notice Period Section */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Booking Notice Period
              </CardTitle>
              <p className="text-blue-100 mt-1">
                Set how far in advance appointments can be booked
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Information Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full p-1.5 flex-shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    How Booking Notice Works
                  </h4>
                  <p className="text-blue-800 text-sm leading-relaxed mb-3">
                    The booking notice period determines when appointment slots
                    become unavailable for booking. This gives you time to
                    prepare for appointments and prevents last-minute bookings.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700">
                        <strong>15 minutes:</strong> A 10:00 AM slot closes at
                        9:45 AM
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700">
                        <strong>30 minutes:</strong> A 10:00 AM slot closes at
                        9:30 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notice Period Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  bookingNotice === 15
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
                onClick={() => handleBookingNoticeChange(15)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        bookingNotice === 15
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        15 Minutes
                      </h3>
                      <p className="text-sm text-gray-600">Quick turnaround</p>
                    </div>
                  </div>
                  {bookingNotice === 15 && (
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  Allows more flexibility for patients while giving you a brief
                  preparation window.
                </p>
              </div>

              <div
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  bookingNotice === 30
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                }`}
                onClick={() => handleBookingNoticeChange(30)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        bookingNotice === 30
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        30 Minutes
                      </h3>
                      <p className="text-sm text-gray-600">
                        More preparation time
                      </p>
                    </div>
                  </div>
                  {bookingNotice === 30 && (
                    <div className="bg-purple-500 text-white rounded-full p-1">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  Provides more time to prepare for appointments and review
                  patient history.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule Section */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Weekly Schedule
              </CardTitle>
              <p className="text-emerald-100 mt-1">
                Configure your availability for each day of the week
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            {schedule.map((daySchedule, dayIndex) => (
              <div key={daySchedule.day} className="group">
                <div
                  className={`rounded-2xl border-2 transition-all duration-300 ${
                    daySchedule.enabled
                      ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {/* Day Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            daySchedule.enabled
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {daySchedule.day}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            {daySchedule.enabled ? (
                              <>
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                                  {daySchedule.timeSlots.length} time slot
                                  {daySchedule.timeSlots.length !== 1
                                    ? "s"
                                    : ""}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                  {getTotalHours(daySchedule.timeSlots)} hours
                                  total
                                </Badge>
                              </>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                                Closed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          checked={daySchedule.enabled}
                          onCheckedChange={() => toggleDay(dayIndex)}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {daySchedule.enabled ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  {daySchedule.enabled && (
                    <div className="p-6">
                      <div className="space-y-4">
                        {daySchedule.timeSlots.map((slot) => (
                          <div key={slot.id} className="group/slot">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-2 rounded-lg">
                                <Clock className="w-4 h-4 text-emerald-600" />
                              </div>

                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                  </label>
                                  <input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) =>
                                      updateTimeSlot(
                                        dayIndex,
                                        slot.id,
                                        "startTime",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time
                                  </label>
                                  <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) =>
                                      updateTimeSlot(
                                        dayIndex,
                                        slot.id,
                                        "endTime",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                  />
                                </div>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeTimeSlot(dayIndex, slot.id)
                                }
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 opacity-0 group-hover/slot:opacity-100 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {/* Add Time Slot Button */}
                        <Button
                          variant="outline"
                          onClick={() => addTimeSlot(dayIndex)}
                          className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Time Slot
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-3 rounded-xl">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Schedule Summary
              </h3>
              <p className="text-gray-600">
                Overview of your weekly availability
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-emerald-600">
                {schedule.filter((day) => day.enabled).length}
              </div>
              <div className="text-sm text-gray-600">Working Days</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {schedule.reduce(
                  (total, day) => total + day.timeSlots.length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Time Slots</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {schedule.reduce(
                  (total, day) => total + getTotalHours(day.timeSlots),
                  0
                )}
                h
              </div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                {bookingNotice}min
              </div>
              <div className="text-sm text-gray-600">Notice Period</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
