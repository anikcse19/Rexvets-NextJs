"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Doctor } from "./type";
import { getVetSlots } from "./service/get-vet-slots";

interface Slot {
  time: string;
}

interface BookingSystemProps {
  doctorName: string;
  doctorData: Doctor;
  onConfirm: (date: string, time: string, slot: string) => void;
}

export default function BookingSystem({
  doctorName,
  doctorData,
  onConfirm,
}: BookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toLocaleDateString("en-CA") // today initially
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);

  const toLocalDateString = (date: Date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getNextFewDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = toLocalDateString(date);
      days.push({
        date: dateString,
        display:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
      });
    }
    return days;
  };

  // Generate slots from schedule (every 30 mins)
  const generateSlots = (date: string): Slot[] => {
    if (!doctorData?.schedule) return [];

    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const schedule =
      doctorData?.schedule[dayName as keyof typeof doctorData.schedule];
    if (!schedule || !schedule.available) return [];

    const slots: Slot[] = [];
    const [startH, startM] = schedule.start.split(":").map(Number);
    const [endH, endM] = schedule.end.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    for (let mins = startMinutes; mins < endMinutes; mins += 30) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      slots.push({ time: `${hh}:${mm}` });
    }

    return slots;
  };

  const availableDays = getNextFewDays();
  const availableTimeSlots = generateSlots(selectedDate);

  console.log("selectedDate", selectedDate, selectedSlot);

  const fetchVetSlots = async () => {
    const data = await getVetSlots({
      id: doctorData?._id,
      startDate: selectedDate,
      endDate: selectedDate,
    });
    // Sort by startTime (assumes format 'HH:mm')
    const sorted = (data || []).slice().sort((a: any, b: any) => {
      if (!a.formattedStartTime || !b.formattedStartTime) return 0;
      return a.formattedStartTime.localeCompare(b.formattedStartTime);
    });
    setSlots(sorted);
    console.log("fetched slots", sorted);
  };

  useEffect(() => {
    fetchVetSlots();
  }, []);

  return (
    <Card className="shadow-xl border-0 bg-white sticky top-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Book Appointment
        </CardTitle>
        <p className="text-green-100 mt-1">
          Select your preferred date and time
        </p>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Quick Date Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Quick Select (Next 7 Days)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableDays.map((day) => (
                <button
                  key={day.date}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedSlot(null);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedDate === day.date
                      ? "border-green-500 bg-green-50 text-green-900"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  <p className="font-medium">{day.display}</p>
                  {/* <p className="text-sm text-gray-600">
                    {formatDate(day.date)}
                  </p> */}
                </button>
              ))}
            </div>

            {/* Toggle Calendar Button */}
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center justify-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                {showCalendar ? "Hide Calendar" : "Choose Another Date"}
                {showCalendar ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Calendar Selection */}
          {showCalendar && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Pick Any Future Date
              </Label>
              <DayPicker
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const dateString = toLocalDateString(date);
                    setSelectedDate(dateString);
                    setSelectedSlot(null);
                  }
                }}
                disabled={{ before: new Date() }}
                weekStartsOn={1}
                showOutsideDays
                className="border rounded-lg p-3 bg-white"
              />
            </div>
          )}

          {/* Time Slots */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Available Times
            </Label>
            {slots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => {
                      setSelectedSlot(slot._id);
                      setSelectedTime(slot.formattedStartTime);
                    }}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      selectedSlot === slot._id
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    <p className="font-medium">{slot.formattedStartTime}</p>
                    <p className="text-xs text-gray-600">GMT+6</p>
                  </button>
                ))}
              </div>
            ) : (
              selectedDate && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    Dr. {doctorName.split(" ")[1]} is not available on{" "}
                    {formatDate(selectedDate)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Please select another date
                  </p>
                </div>
              )
            )}
          </div>

          {/* Summary */}
          {selectedSlot && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-900">
                  Appointment Selected
                </p>
              </div>
              <p className="text-green-700 text-sm">
                {formatDate(selectedDate)} at {selectedTime} (GMT+6)
              </p>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            onClick={() => {
              if (selectedSlot && selectedTime) {
                onConfirm(selectedDate, selectedTime, selectedSlot);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={!selectedSlot}
            className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedSlot ? "Confirm Booking" : "Select Time Slot"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={className}>{children}</label>;
}
