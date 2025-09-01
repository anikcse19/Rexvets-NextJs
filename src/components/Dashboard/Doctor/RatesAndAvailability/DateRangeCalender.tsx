"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "@/lib/types";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  format,
  isSameDay,
  isValid,
  isWithinInterval,
  startOfToday,
} from "date-fns";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface DateRangeCalendarProps {
  selectedRange: DateRange | null;
  onRangeSelect: (range: DateRange | null) => void;
}

export default function DateRangeCalendar({
  selectedRange,
  onRangeSelect,
}: DateRangeCalendarProps) {
  const [selectingStart, setSelectingStart] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const today = startOfToday();
  const nextMonth = endOfMonth(addMonths(today, 2));

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !isValid(date)) return;

    if (selectingStart || !selectedRange) {
      onRangeSelect({ start: date, end: date });
      setSelectingStart(false);
    } else {
      const newRange = {
        start: date < selectedRange.start ? date : selectedRange.start,
        end: date > selectedRange.start ? date : selectedRange.start,
      };
      onRangeSelect(newRange);
      setSelectingStart(true);
    }
  };

  const handleClearSelection = () => {
    onRangeSelect(null);
    setSelectingStart(true);
  };

  const isDateInRange = (date: Date) => {
    if (!selectedRange || !isValid(date)) return false;
    return isWithinInterval(date, {
      start: selectedRange.start,
      end: selectedRange.end,
    });
  };

  const isRangeStart = (date: Date) => {
    return (
      selectedRange && isValid(date) && isSameDay(date, selectedRange.start)
    );
  };

  const isRangeEnd = (date: Date) => {
    return selectedRange && isValid(date) && isSameDay(date, selectedRange.end);
  };

  const getDayCount = () => {
    if (!selectedRange) return 0;
    return differenceInDays(selectedRange.end, selectedRange.start) + 1;
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            Select Date Range
          </CardTitle>
          {/* {selectedRange && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          )} */}
        </div>
        {selectedRange && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {format(selectedRange.start, "MMM dd, yyyy")} -{" "}
                  {format(selectedRange.end, "MMM dd, yyyy")}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {getDayCount()} day{getDayCount() > 1 ? "s" : ""} selected
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-600">
                  {selectingStart
                    ? "Click to select new start date"
                    : "Click to select end date"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          {selectedRange && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="flex items-center  justify-end ml-auto cursor-pointer gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          )}
          <Calendar
            mode="single"
            selected={selectedRange?.start}
            onSelect={handleDateSelect}
            fromDate={today}
            toDate={nextMonth}
            className="w-full"
            modifiers={{
              range_start: selectedRange ? [selectedRange.start] : [],
              range_end: selectedRange ? [selectedRange.end] : [],
              range_middle: selectedRange
                ? (date) => {
                    if (!isValid(date)) return false;
                    return (
                      isDateInRange(date) &&
                      !isRangeStart(date) &&
                      !isRangeEnd(date)
                    );
                  }
                : [],
            }}
            modifiersStyles={{
              range_start: {
                backgroundColor: "#2B7FFF !important",
                color: "white !important",
                borderRadius: "8px",
                fontWeight: "600",
              },
              range_end: {
                backgroundColor: "#2B7FFF !important",
                color: "white !important",
                borderRadius: "8px",
                fontWeight: "600",
              },
              range_middle: {
                backgroundColor: "#2B7FFF !important",
                color: "white !important",
                borderRadius: "8px",
              },
            }}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-lg font-semibold text-gray-800",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                             day_selected:
                 "bg-[#2B7FFF] text-white hover:bg-[#2B7FFF] focus:bg-[#2B7FFF]",
              day_today: "bg-accent text-accent-foreground",
              day_outside:
                "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
