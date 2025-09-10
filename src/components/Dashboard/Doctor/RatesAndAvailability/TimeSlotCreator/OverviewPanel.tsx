"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserTimezone } from "@/lib/timezone";
import { DateRange } from "@/lib/types";
import { Calendar, Check, Clock } from "lucide-react";
import React from "react";
import { TimeSlot } from "./types";
import { formatDateRange, formatDuration, getTotalHours, isValidSlot } from "./utils";

type Props = {
  selectedRange: DateRange;
  slots: TimeSlot[];
  selectedCount: number;
};

export default function OverviewPanel({ selectedRange, slots, selectedCount }: Props) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg sticky top-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Schedule Overview</h2>
        <p className="text-gray-600">Your availability summary</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl p-6 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Selected Date Range</p>
              <p className="text-lg font-bold text-gray-800">
                {formatDateRange(selectedRange.start, selectedRange.end, getUserTimezone())}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedRange.start === selectedRange.end
                  ? "Single day"
                  : `${Math.ceil((new Date(selectedRange.end).getTime() - new Date(selectedRange.start).getTime()) / (1000 * 60 * 60 * 24))} days`}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Active Periods</p>
              <p className="text-3xl font-bold text-gray-800">{slots.length}</p>
              <p className="text-xs text-gray-500 mt-1">{selectedCount > 0 && `${selectedCount} selected`}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Total Duration</p>
              <p className="text-3xl font-bold text-gray-800">{formatDuration(getTotalHours(slots))}</p>
              <p className="text-xs text-gray-500 mt-1">{isValidSlot(slots[0] as any) ? "Valid schedule" : "Check time ranges"}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Selected for Action</p>
                <p className="text-3xl font-bold text-gray-800">{selectedCount}</p>
                <p className="text-xs text-gray-500 mt-1">Ready to delete</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


