import { useDashboardContext } from "@/hooks/DashboardContext";
import { Slot, SlotStatus } from "@/lib";
import { getTimezoneOffset, getUserTimezone } from "@/lib/timezone";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { cn } from "@/lib/utils";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiGlobe,
  FiLoader,
} from "react-icons/fi";
import { Sheet, SheetContent } from "../../../ui/sheet";
import { Switch } from "../../../ui/switch";
import BookingSlotsPeriods from "./BookingSlotsPeriods";

interface Period {
  startTime: string;
  endTime: string;
  totalHours: number;
  slots: Slot[];
  timezone?: string; // Add timezone information
}

interface DayAvailability {
  date: {
    start: string;
    end: string;
  };
  periods: Period[];
  numberOfPeriods: number;
  numberOfDays: number;
  timezone?: string; // Add timezone information
}

interface SessionUserWithRefId {
  refId: string;
  timezone?: string;
  // other user properties can be added here
}

interface Props {
  data?: {
    periods: DayAvailability[];
    meta: {
      page?: number;
      limit?: number;
      totalPages?: number;
      totalItems: number;
    };
    filters: {
      dateRange: {
        start: Date;
        end: Date;
      };
      status?: SlotStatus | "ALL";
      search?: string;
      timezone?: string;
    };
  } | null;
  loading?: boolean;
  error?: string | null;
}

const AvailabilityScheduler: React.FC<Props> = ({
  data = null,
  loading = false,
  error = null,
}) => {
  const {
    setSelectedSlot,
    setSlotStatus,
    slotStatus,
    enabled,
    setEnabled,
    open,
    setOpen,
    disabledSlotIds,
    setDisabledSlotIds,
  } = useDashboardContext();

  const { data: session } = useSession();
  const user = session?.user as SessionUserWithRefId | undefined;

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Helper functions for timezone-aware formatting using convertTimesToUserTimezone
  const formatDate = (dateStr: string, timezone?: string) => {
    if (timezone) {
      // Convert the date to user's timezone
      const { formattedDate } = convertTimesToUserTimezone(
        "00:00", // dummy time for date conversion
        "00:00", // dummy time for date conversion
        dateStr,
        timezone
      );
      return moment(formattedDate).format("dddd, MMM DD, YYYY");
    }
    return moment(dateStr).format("dddd, MMM DD, YYYY");
  };

  const formatTime = (timeStr: string, dateStr: string, timezone?: string) => {
    if (timezone) {
      // Use convertTimesToUserTimezone for proper timezone conversion
      const { formattedStartTime } = convertTimesToUserTimezone(
        timeStr,
        timeStr, // same time for start and end since we only need start
        dateStr,
        timezone
      );
      return formattedStartTime;
    }
    return moment(`2000-01-01 ${timeStr}`).format("h:mm A");
  };

  const formatDateRange = (periods: DayAvailability[]) => {
    if (periods?.length === 0) return "";

    const firstPeriod = periods?.[0]?.periods?.[0];
    const lastPeriod = periods?.[periods.length - 1]?.periods?.[0];

    if (!firstPeriod || !lastPeriod) return "";

    const firstDate = periods?.[0]?.date?.start;
    const lastDate = periods?.[periods.length - 1]?.date?.start;
    const timezone = periods?.[0]?.timezone;

    if (!firstDate || !lastDate) return "";

    const start = formatDate(firstDate, timezone);
    const end = formatDate(lastDate, timezone);

    return start === end ? start : `${start} - ${end}`;
  };

  // Calculate summary statistics
  const calculateSummary = (periods: DayAvailability[]) => {
    const totalDays = periods?.length || 0;
    const totalPeriods =
      periods?.reduce((sum, day) => sum + (day?.numberOfPeriods || 0), 0) || 0;
    const totalHours =
      periods?.reduce(
        (sum, day) =>
          sum +
          (day?.periods?.reduce(
            (daySum, period) => daySum + (period?.totalHours || 0),
            0
          ) || 0),
        0
      ) || 0;

    return {
      totalDays,
      totalPeriods,
      totalHours,
      averagePeriodsPerDay: totalDays > 0 ? totalPeriods / totalDays : 0,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center">
            <FiLoader className="animate-spin text-blue-500 text-2xl mr-3" />
            <span className="text-gray-600">Loading availability data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">
              ⚠️ Error Loading Data
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filterButtons = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-6 mt-1 px-3">
        {Object.values(SlotStatus).map((status) => (
          <button
            key={status}
            onClick={() => {
              setSlotStatus(status);
              console.log("slotStatus", status);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              slotStatus === status
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  // Extract periods from API response data
  const periods = data?.periods || [];
  const currentUserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // No data state
  if (!data || !periods || periods.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {filterButtons()}
          <div className="text-center text-gray-600">
            <FiCalendar className="text-4xl mx-auto mb-4 text-gray-400" />
            <p>No availability data found for the selected period.</p>
          </div>
        </div>
      </div>
    );
  }

  const summary = calculateSummary(periods);
  const dateRange = formatDateRange(periods);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-green-500 text-lg" />
            <h2 className="text-lg font-semibold text-gray-800">
              Existing Availability
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              <span className="font-medium">{summary.totalDays} days</span>
            </div>
            {userTimezone && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                <FiGlobe className="w-3 h-3" />
                <span className="font-medium">{userTimezone}</span>
                <span className="text-xs opacity-75">
                  ({getTimezoneOffset(userTimezone)})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        {filterButtons()}

        {/* Availability Group */}
        <div className="p-4">
          {/* Group Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900">{dateRange}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {summary.totalPeriods} slot
                  {summary.totalPeriods > 1 ? "s" : ""}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {summary.totalDays} days
                </span>
                {periods?.[0]?.timezone && periods[0].timezone !== currentUserTimezone && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                    Timezone: {periods[0].timezone} → {currentUserTimezone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Total Hours */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <FiClock size={14} />
            <span>{summary.totalHours} hours total</span>
            {periods?.[0]?.timezone && (
              <span className="ml-2 text-xs text-gray-400">
                (in {periods[0].timezone} timezone)
              </span>
            )}
          </div>

          {/* Time Slots by Day */}
          <div className="space-y-4">
            {periods?.map((dayData, dayIndex) => (
              <div
                key={dayIndex}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    {formatDate(dayData?.date?.start || "", dayData?.timezone)}
                  </h4>
                  <div className="text-xs text-gray-500 flex-row items-center flex">
                    {dayData?.numberOfPeriods || 0} period
                    {(dayData?.numberOfPeriods || 0) > 1 ? "s" : ""} •{" "}
                    {dayData?.periods?.reduce(
                      (sum, p) => sum + (p?.totalHours || 0),
                      0
                    ) || 0}
                    h total
                    {dayData?.timezone && (
                      <span className="ml-1">• {dayData.timezone}</span>
                    )}
                  </div>
                </div>

                {/* Day's Time Slots */}
                <div className="space-y-2">
                  {dayData?.periods?.map((period, periodIndex) => (
                    <div
                      key={periodIndex}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Periods: {periodIndex + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatTime(
                            period?.startTime || "",
                            dayData?.date?.start || "",
                            period?.timezone
                          )}{" "}
                          -{" "}
                          {formatTime(
                            period?.endTime || "",
                            dayData?.date?.start || "",
                            period?.timezone
                          )}
                        </span>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                            Available
                          </span>
                          {period?.timezone &&
                            period.timezone !== userTimezone && (
                              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                {period.timezone}
                              </span>
                            )}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-500">
                        {period?.totalHours || 0}h
                      </span>
                      <div className="flex items-center gap-x-3">
                        <div className="flex items-center gap-0 ml-1 gap-x-3">
                          <Switch
                            id="notifications"
                            checked={
                              period?.slots?.some((slot) =>
                                disabledSlotIds?.includes(slot?._id || "")
                              ) || false
                            }
                            onCheckedChange={() => {
                              const slotIds =
                                period?.slots
                                  ?.map((slot) => slot?._id)
                                  ?.filter(Boolean) || [];
                              console.log("slotIds:", slotIds);
                              setDisabledSlotIds(slotIds);
                              setEnabled(!enabled);
                            }}
                            className={cn(
                              "peer rounded-full border-2 transition-colors duration-300 cursor-pointer",
                              "data-[state=unchecked]:bg-gray-300", // background when OFF
                              "data-[state=checked]:bg-green-500" // background when ON
                            )}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setOpen(true);
                            console.log("slots", period?.slots);
                            setSelectedSlot(period?.slots || []);
                          }}
                          className="p-1.5 cursor-pointer text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Total Periods:{" "}
                  <span className="font-medium text-gray-900">
                    {summary.totalPeriods}
                  </span>
                </span>
                <span className="text-gray-600">
                  Total Hours:{" "}
                  <span className="font-medium text-gray-900">
                    {summary.totalHours}h
                  </span>
                </span>
                {periods?.[0]?.timezone && (
                  <span className="text-gray-600">
                    Timezone:{" "}
                    <span className="font-medium text-gray-900">
                      {periods[0].timezone}
                    </span>
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {summary.averagePeriodsPerDay.toFixed(1)} periods/day avg
              </span>
            </div>

                         {/* Weekly Schedule Pattern */}
             <div className="mt-3 text-xs text-gray-600">
               <span className="font-medium">Pattern:</span> Daily availability
               with {periods?.[0]?.numberOfPeriods || 0} time slots per day
               {periods?.[0]?.periods && (
                 <span className="ml-1">
                   (
                   {(() => {
                     const firstPeriod = periods[0].periods[0];
                     if (!firstPeriod) return "";
                     
                     const { formattedStartTime, formattedEndTime } = convertTimesToUserTimezone(
                       firstPeriod.startTime,
                       firstPeriod.endTime,
                       periods[0].date.start,
                       periods[0].timezone || "UTC"
                     );
                     
                     let patternText = `${formattedStartTime} - ${formattedEndTime}`;
                     
                     // Add second period if it exists
                     if (periods[0].periods[1]) {
                       const secondPeriod = periods[0].periods[1];
                       const { formattedStartTime: secondStart, formattedEndTime: secondEnd } = convertTimesToUserTimezone(
                         secondPeriod.startTime,
                         secondPeriod.endTime,
                         periods[0].date.start,
                         periods[0].timezone || "UTC"
                       );
                       patternText += `, ${secondStart} - ${secondEnd}`;
                     }
                     
                     return patternText;
                   })()}
                   )
                 </span>
               )}
               {periods?.[0]?.timezone && periods[0].timezone !== currentUserTimezone && (
                 <span className="ml-1 text-blue-600">
                   • Times converted from {periods[0].timezone} to {currentUserTimezone}
                 </span>
               )}
             </div>
          </div>
        </div>
      </div>
      <RightDrawer
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          setSelectedSlot(null);
        }}
      />
    </div>
  );
};

export default AvailabilityScheduler;

interface IRightProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RightDrawer: React.FC<IRightProps> = ({ open, onOpenChange }) => {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        {/* Sheet Content */}
        <SheetContent
          side="right" // opens from right
          className="w-[400px] sm:w-[540px] bg-white shadow-lg p-4"
        >
          {/* <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>
              This sheet slides in from the right and covers 80% of width.
            </SheetDescription>
          </SheetHeader> */}

          <div className="flex-1 mt-4">
            <BookingSlotsPeriods />
          </div>

          {/* <SheetFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </>
  );
};
