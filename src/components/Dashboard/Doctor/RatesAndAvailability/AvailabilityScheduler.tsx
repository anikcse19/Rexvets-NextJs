import { useDashboardContext } from "@/hooks/DashboardContext";
import { Slot, SlotStatus } from "@/lib";
import { cn } from "@/lib/utils";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiChevronUp,
  FiClock,
  FiEdit2,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";
import { Button } from "../../../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../../ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../ui/sheet";
import { Switch } from "../../../ui/switch";
import BookingSlotsPeriods from "./BookingSlotsPeriods";

interface Period {
  startTime: string;
  endTime: string;
  totalHours: number;
  slots: Slot[];
}

interface DayAvailability {
  date: {
    start: string;
    end: string;
  };
  periods: Period[];
  numberOfPeriods: number;
  numberOfDays: number;
}

type AvailabilityData = DayAvailability[];

interface Props {
  data?: AvailabilityData | null;
  loading?: boolean;
  error?: string | null;
}

const AvailabilityScheduler: React.FC<Props> = ({
  data = null,
  loading = false,
  error = null,
}) => {
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  // const [selectedSlot, setSelectedSlot] = useState<Slot[] | null>(null);

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
  // console.log("slotStatus", slotStatus);
  const handleSlotSelect = (slot: Slot) => {
    // setSelectedSlotIds((prev) => [...prev, slot._id]);
    // Handle booking logic here
  };
  // Helper functions
  const formatDate = (dateStr: string) => {
    return moment.utc(dateStr).local().format("dddd, MMM DD, YYYY, hh:mm A");
  };

  const formatTime = (dateStr: string) => {
    return moment.utc(dateStr).local().format("hh:mm A");
  };

  const formatDateRange = (periods: AvailabilityData) => {
    if (periods.length === 0) return "";

    const firstDate = periods[0].periods[0]?.startTime;
    const lastDate = periods[periods.length - 1].periods[0]?.startTime;

    if (!firstDate || !lastDate) return "";

    const start = formatDate(firstDate);
    const end = formatDate(lastDate);

    return start === end ? start : `${start} - ${end}`;
  };

  // Calculate summary statistics
  const calculateSummary = (data: AvailabilityData) => {
    const totalDays = data.length;
    const totalPeriods = data.reduce(
      (sum, day) => sum + day.numberOfPeriods,
      0
    );
    const totalHours = data.reduce(
      (sum, day) =>
        sum +
        day.periods.reduce((daySum, period) => daySum + period.totalHours, 0),
      0
    );

    return {
      totalDays,
      totalPeriods,
      totalHours,
      averagePeriodsPerDay: totalPeriods / totalDays || 0,
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

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center text-gray-600">
            <FiCalendar className="text-4xl mx-auto mb-4 text-gray-400" />
            <p>No availability data found for the selected period.</p>
          </div>
        </div>
      </div>
    );
  }

  const summary = calculateSummary(data);
  const dateRange = formatDateRange(data);

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
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            <span className="font-medium">{summary.totalDays} days</span>
          </div>
        </div>

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
              </div>
            </div>
          </div>

          {/* Total Hours */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <FiClock size={14} />
            <span>{summary.totalHours} hours total</span>
          </div>

          {/* Time Slots by Day */}
          <div className="space-y-4">
            {data.map((dayData, dayIndex) => (
              <div
                key={dayIndex}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    {formatDate(dayData.periods[0]?.startTime)}
                  </h4>
                  <div className="text-xs text-gray-500 flex-row items-center  flex">
                    {dayData.numberOfPeriods} period
                    {dayData.numberOfPeriods > 1 ? "s" : ""} •{" "}
                    {dayData.periods.reduce((sum, p) => sum + p.totalHours, 0)}h
                    total
                  </div>
                </div>

                {/* Day's Time Slots */}
                <div className="space-y-2">
                  {dayData.periods.map((period, periodIndex) => (
                    <div
                      key={periodIndex}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Periods: {periodIndex + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatTime(period.startTime)} -{" "}
                          {formatTime(period.endTime)}
                        </span>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                            Available
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-500">
                        {period.totalHours}h
                      </span>
                      <div className=" flex items-center gap-x-3">
                        <div className="flex items-center gap-0 ml-1  gap-x-3">
                          <Switch
                            id="notifications"
                            checked={period.slots.some((slot) =>
                              disabledSlotIds.includes(slot._id)
                            )}
                            onCheckedChange={() => {
                              const slotIds = period?.slots?.map(
                                (slot) => slot?._id
                              );
                              console.log("slotIds:", slotIds);
                              setDisabledSlotIds((prev) => {
                                if (prev) {
                                  return [...prev, ...slotIds];
                                }
                                return slotIds;
                              });
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
                            console.log("slots", period.slots);
                            setSelectedSlot(period.slots);
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
              </div>
              <span className="text-xs text-gray-500">
                {summary.averagePeriodsPerDay.toFixed(1)} periods/day avg
              </span>
            </div>

            {/* Weekly Schedule Pattern */}
            <div className="mt-3 text-xs text-gray-600">
              <span className="font-medium">Pattern:</span> Daily availability
              with {data[0]?.numberOfPeriods || 0} time slots per day
              {data[0]?.periods && (
                <span className="ml-1">
                  ({formatTime(data[0].periods[0]?.startTime)} -{" "}
                  {formatTime(data[0].periods[0]?.endTime)},{" "}
                  {formatTime(data[0].periods[1]?.startTime)} -{" "}
                  {formatTime(data[0].periods[1]?.endTime)})
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
  const { selectedSlot } = useDashboardContext();
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
