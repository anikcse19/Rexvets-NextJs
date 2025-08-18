import React, { useState } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

import {
  format,
  addDays,
  subDays,
  startOfWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import { Doctor, TimeSlots } from "@/lib/types";
import { formatTimeToUserTimezone } from "@/lib/timezone";

interface BookingSystemProps {
  doctor: Doctor;
  onBookSlot: (slot: TimeSlots) => void;
}

const BookingSystem: React.FC<BookingSystemProps> = ({
  doctor,
  onBookSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));

  const getAvailableSlotsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return doctor.availableSlots.filter(
      (slot) => slot.available && slot.date === dateStr
    );
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    return days;
  };

  const weekDays = getWeekDays();
  const selectedDateSlots = getAvailableSlotsForDate(selectedDate);
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  const isToday = (date: Date) => {
    return format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  };

  const isPast = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        Book Appointment
      </h3>

      {/* Calendar Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">
            {format(currentWeek, "MMMM yyyy")}
          </h4>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}

          {weekDays.map((date, index) => {
            const dateSlots = getAvailableSlotsForDate(date);
            const isSelected = format(date, "yyyy-MM-dd") === selectedDateStr;
            const isCurrentDay = isToday(date);
            const isPastDate = isPast(date);

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                disabled={isPastDate}
                className={`
                  p-2 text-sm rounded-lg transition-all duration-200 relative
                  ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : isPastDate
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-blue-50"
                  }
                  ${
                    isCurrentDay && !isSelected
                      ? "bg-blue-100 font-semibold"
                      : ""
                  }
                `}
              >
                {format(date, "d")}
                {dateSlots.length > 0 && !isPastDate && (
                  <div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isSelected ? "bg-white" : "bg-green-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">
            Available Times for {format(selectedDate, "EEEE, MMMM d")}
          </span>
        </div>

        {selectedDateSlots.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedDateSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => onBookSlot(slot)}
                className="px-4 py-3 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium"
              >
                {formatTimeToUserTimezone(slot.time)}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">
              Dr. {doctor.name.split(" ")[1]} is not available on this date
            </p>
            <p className="text-sm">Please select another date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSystem;
