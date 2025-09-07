"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getUserTimezone } from "@/lib/timezone";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getVetSlots } from "./service/get-vet-slots";
import { Doctor } from "./type";

interface Slot {
  _id: string;
  vetId: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone?: string; // Timezone of the appointment slot
  status: string;
  createdAt: string;
  __v: number;
  updatedAt: string;
  formattedDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
  displayTimezone?: string; // Timezone used for display conversion
  slotTime: string;
}

interface BookingSystemProps {
  doctorName: string;
  doctorData: Doctor;
  onConfirm: (date: string, time: string, slot: string) => void;
  selectedSlotDate: string | null;
  selectedSlotId: string | null;
  vetTimezone: string;
}

export default function BookingSystem({
  doctorName,
  doctorData,
  onConfirm,
  selectedSlotDate,
  selectedSlotId,
  vetTimezone,
}: BookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toLocaleDateString("en-CA") // today initially
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [veterinarianTimezone, setVeterinarianTimezone] = useState("");
  const toLocalDateString = (date: Date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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

  const availableDays = getNextFewDays();

  console.log("selectedDate", selectedDate, selectedSlot);

  const fetchVetSlots = async () => {
    const date = parseISO(selectedSlotDate ?? selectedDate);
    const userTimezone = getUserTimezone();
    const formatted = format(date, "yyyy-MM-dd");
    const data = await getVetSlots({
      id: doctorData?._id,
      startDate: formatted,
      endDate: formatted,
      timezone: vetTimezone || userTimezone,
    });
    // Sort by startTime (assumes format 'HH:mm')
    const sorted = (data || []).slice().sort((a: any, b: any) => {
      if (!a.startTime || !b.startTime) return 0;
      return a.startTime.localeCompare(b.startTime);
    });
    setSlots(sorted);
    if (data && data.length > 0) {
      setVeterinarianTimezone(data[0]?.timezone || "UTC");
    }
  };

  useEffect(() => {
    fetchVetSlots();
  }, [selectedDate, selectedSlotDate, selectedSlotId]);
  console.log("slots", slots);
  useEffect(() => {
    if (selectedSlotDate && selectedSlotId) {
      const date = parseISO(selectedSlotDate);

      const formatted = format(date, "yyyy-MM-dd");
      setSelectedDate(formatted);
      if (slots.length > 0) {
        const findSlot = slots.find((slot) => slot._id === selectedSlotId);
        if (findSlot) {
          setSelectedTime(findSlot?.formattedStartTime);
          setSelectedSlot(findSlot?._id);
        }
      }
    }
  }, [selectedSlotDate, selectedSlotId, slots]);
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
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Available Times
              </Label>
              {/* <div className="text-right">
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Your Timezone:{" "}
                  <span className="text-blue-600 font-semibold">
                    {currentTimezone}
                  </span>
                </Label>
                {veterinarianTimezone && (
                  <Label className="text-xs text-gray-500">
                    Vet Timezone: {veterinarianTimezone}
                  </Label>
                )}
              </div> */}
            </div>
            {slots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((slot) => {
                  const {
                    formattedEndTime,
                    formattedStartTime,
                    formattedDate,
                  } = convertTimesToUserTimezone(
                    slot.startTime,
                    slot.endTime,
                    slot.date,
                    slot.timezone || "UTC"
                  );

                  const isSelected =
                    (selectedSlot || selectedSlotId) === slot._id;

                  return (
                    <button
                      key={slot._id}
                      onClick={() => {
                        setSelectedSlot(slot._id);
                        setSelectedTime(slot.formattedStartTime);
                      }}
                      className={`
                relative p-4 rounded-xl items-center  justify-center flex flex-col border-2 text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                }
              `}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Time display */}
                      <div className="flex items-center justify-center w-full mb-2">
                        {/* <Clock
                          className={`w-4 h-4 mr-2 ${
                            isSelected ? "text-blue-600" : "text-gray-500"
                          }`}
                        /> */}
                      </div>

                      {/* Duration */}
                      <div
                        className={`text-sm flex flex-col items-center justify-center w-full ${
                          isSelected ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        <p className="text-sm font-medium">
                          {formattedStartTime}
                        </p>
                        <p className="text-xs">to {formattedEndTime}</p>
                      </div>
                    </button>
                  );
                })}
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
                {formatDate(selectedDate)} at {selectedTime}
              </p>
              <p className="text-green-600 text-xs mt-1">
                Times shown in your local timezone ({currentTimezone})
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
