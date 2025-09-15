"use client";

import React, { useEffect, useState } from "react";
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
import { Doctor } from "@/lib/types";
import { updateVet } from "./Service/update-vet";
import BookingNoticePeriod from "./RatesAndAvailability/BookingNoticePeriod";
import Schedule from "./RatesAndAvailability/Schedule";
import AvailabilityManager from "./RatesAndAvailability/AvailabilityManager";

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

// const initialSchedule: DaySchedule[] = [
//   {
//     day: "Monday",
//     enabled: true,
//     timeSlots: [
//       { id: "1", startTime: "09:00", endTime: "12:00" },
//       { id: "2", startTime: "14:00", endTime: "18:00" },
//     ],
//   },
//   {
//     day: "Tuesday",
//     enabled: true,
//     timeSlots: [
//       { id: "3", startTime: "09:00", endTime: "12:00" },
//       { id: "4", startTime: "14:00", endTime: "18:00" },
//     ],
//   },
//   {
//     day: "Wednesday",
//     enabled: true,
//     timeSlots: [
//       { id: "5", startTime: "09:00", endTime: "12:00" },
//       { id: "6", startTime: "14:00", endTime: "18:00" },
//     ],
//   },
//   {
//     day: "Thursday",
//     enabled: true,
//     timeSlots: [
//       { id: "7", startTime: "09:00", endTime: "12:00" },
//       { id: "8", startTime: "14:00", endTime: "18:00" },
//     ],
//   },
//   {
//     day: "Friday",
//     enabled: true,
//     timeSlots: [
//       { id: "9", startTime: "09:00", endTime: "12:00" },
//       { id: "10", startTime: "14:00", endTime: "18:00" },
//     ],
//   },
//   {
//     day: "Saturday",
//     enabled: true,
//     timeSlots: [{ id: "11", startTime: "10:00", endTime: "14:00" }],
//   },
//   {
//     day: "Sunday",
//     enabled: false,
//     timeSlots: [],
//   },
// ];

export default function RatesAndAvailabilityPage({
  vetData,
}: {
  vetData: Doctor;
}) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const saveChanges = async () => {
    // Here you would make API call to save the changes
    console.log("Saving changes:", { schedule });
    await updateVet(schedule);
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
      {/* <BookingNoticePeriod /> */}

      {/* Weekly Schedule Section */}
      {/* <Schedule
        vetData={vetData}
        schedule={schedule}
        setSchedule={setSchedule}
        getTotalHours={getTotalHours}
      /> */}

      <AvailabilityManager />

      {/* Summary Card */}
      {/* <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-blue-50">
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
      </Card> */}
    </div>
  );
}
