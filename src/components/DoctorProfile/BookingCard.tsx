"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/hooks/StateContext";
import { getUserTimezone } from "@/lib/timezone";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

  vetTimezone: string;
}

export default function BookingSystem({
  doctorName,
  doctorData,
  onConfirm,
  vetTimezone,
}: BookingSystemProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selectedDate") ||
        new Date().toLocaleDateString("en-CA")
      );
    }
    return new Date().toLocaleDateString("en-CA"); // fallback for SSR
  });

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const { appState, setAppState } = useAppContext();
  const { slotDate: selectedSlotDate, slotId: selectedSlotId } = appState;
  // console.log("selectedSlotId", selectedSlotId);
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

  const fetchVetSlots = async () => {
    if (!doctorData?._id) {
      console.error("Doctor ID is missing");
      return;
    }
    setIsLoading(true);
    const date = parseISO(selectedSlotDate ?? selectedDate);
    const formatted = format(date, "yyyy-MM-dd");
    const payload = {
      id: doctorData._id,
      startDate: formatted,
      endDate: formatted,
    };
    try {
      const data = await getVetSlots(payload);

      // Sort by startTime (assumes format 'HH:mm')
      const sorted = (data || []).slice().sort((a: any, b: any) => {
        if (!a.startTime || !b.startTime) return 0;
        return a.startTime.localeCompare(b.startTime);
      });
      setSlots(sorted);
      if (data && data.length > 0) {
        setVeterinarianTimezone(data[0]?.timezone || "UTC");
      }
    } catch (error: any) {
      console.error("Error fetching vet slots:", error);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVetSlots();
  }, [selectedDate, selectedSlotDate, selectedSlotId]);

  // console.log("slots", slots);

  useEffect(() => {
    const date = localStorage.getItem("selectedDate");
    const time = localStorage.getItem("selectedTime");
    const slot = localStorage.getItem("selectedSlot");

    if (date) setSelectedDate(date);
    if (time) setSelectedTime(time);
    if (slot) setSelectedSlot(slot);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedSlotDate, slots.length]);
  useEffect(() => {
    if (selectedSlotDate && selectedSlotId) {
      const date = parseISO(selectedSlotDate);

      const formatted = format(date, "yyyy-MM-dd");
      setSelectedDate(formatted);
      if (slots.length > 0) {
        const findSlot = slots.find((slot) => slot._id === selectedSlotId);
        // console.log("findSlot", findSlot);
        if (findSlot) {
          // console.log("FIND SLOT TIME:", findSlot.startTime);
          setSelectedTime(findSlot?.startTime);
          setSelectedSlot(findSlot?._id);
        }
      }
    }
  }, [selectedSlotDate, selectedSlotId, slots]);

  console.log(
    "selectedDate",
    selectedDate,
    "time",
    selectedTime,
    "slot",
    selectedSlot
  );
  function formatDateToDayMonth(dateString: string): string {
    if (!dateString) return "";

    const date = parseISO(dateString);
    const day = format(date, "d");
    const month = format(date, "MMMM");

    // Add ordinal suffix (st, nd, rd, th)
    const suffix =
      day.endsWith("1") && day !== "11"
        ? "st"
        : day.endsWith("2") && day !== "12"
        ? "nd"
        : day.endsWith("3") && day !== "13"
        ? "rd"
        : "th";

    return `${day}${suffix} ${month}`;
  }
  return (
    <Card className="shadow-xl rounded-md p-0 border-0 bg-white sticky top-6">
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
                    setAppState((prev) => ({
                      ...prev,
                      slotDate: null,
                      slotId: null,
                    }));
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
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-600">
                  Available Times slots…
                </span>
              </div>
            ) : slots.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((slot) => {
                      const {
                        formattedEndTime,
                        formattedStartTime,
                        formattedDate,
                      } = convertTimesToUserTimezone(
                        slot.startTime,
                        slot.endTime,
                        slot.date,
                        getUserTimezone()
                      );

                      const isSelected =
                        (selectedSlot || selectedSlotId) === slot._id;

                      return (
                        <button
                          key={slot._id}
                          onClick={() => {
                            setSelectedSlot(slot._id);
                            setSelectedTime(slot.startTime);
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
                            {/* Intentionally empty for clean layout */}
                          </div>

                          {/* Duration */}
                          <div
                            className={`text-sm flex flex-col items-center justify-center w-full ${
                              isSelected ? "text-blue-600" : "text-gray-600"
                            }`}
                          >
                            <p className="block md:hidden">
                              {formatDateToDayMonth(formattedDate)}
                            </p>
                            <div className="flex flex-row md:flex-col items-center justify-center gap-2 md:gap-0">
                              <p className="text-sm font-medium inline">
                                {formattedStartTime}{" "}
                              </p>
                              <p className="text-xs inline">
                                to {formattedEndTime}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
                {slots.length > pageSize && (
                  <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="cursor-pointer"
                    >
                      Prev
                    </Button>
                    {Array.from(
                      { length: Math.ceil(slots.length / pageSize) },
                      (_, index) => {
                        const pageNumber = index + 1;
                        const isActive = pageNumber === currentPage;
                        return (
                          <Button
                            key={pageNumber}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                            className={
                              isActive
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "cursor-pointer"
                            }
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        currentPage === Math.ceil(slots.length / pageSize)
                      }
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(Math.ceil(slots.length / pageSize), p + 1)
                        )
                      }
                      className="cursor-pointer"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
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
              localStorage.setItem("selectedDate", selectedDate);
              localStorage.setItem("selectedTime", selectedTime as string);
              localStorage.setItem("selectedSlot", selectedSlot as string);

              if (selectedSlot && selectedTime) {
                if (session?.user) {
                  onConfirm(selectedDate, selectedTime, selectedSlot);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  const redirectedLink = `/find-a-vet/${doctorData?._id}`;
                  router.push(
                    `/auth/signin?redirect=${encodeURIComponent(
                      redirectedLink
                    )}`
                  );
                }
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
