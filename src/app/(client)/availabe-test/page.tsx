"use client";
import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiChevronUp,
  FiClock,
  FiEdit2,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";

interface Period {
  start: string;
  end: string;
  durationHours: number;
  slotCount: number;
  availableSlots: number;
  bookedSlots: number;
}

interface DayPeriod {
  date: {
    start: string;
    end: string;
  };
  totalDays: number;
  periods: Period[];
  totalPeriods: number;
  totalSlots: number;
  totalHours: number;
}

interface AvailabilityData {
  periods: DayPeriod[];
  summary: {
    totalDays: number;
    daysWithSlots: number;
    totalPeriods: number;
    totalSlots: number;
    totalHours: number;
    averagePeriodsPerDay: number;
    utilizationRate: number;
  };
}

const AvailabilityScheduler: React.FC = () => {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/slots/slot-summary/68a9477e0cc6dcbf64cbaf5c?startDate=2025-08-24&endDate=2025-08-30`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log(responseData);
      return responseData;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getData();
        setData(result.data || result); // Handle both data.data and direct data structure
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateRange = (periods: DayPeriod[]) => {
    if (periods.length === 0) return "";

    const firstDate = periods[0].periods[0]?.start;
    const lastDate = periods[periods.length - 1].periods[0]?.start;

    if (!firstDate || !lastDate) return "";

    const start = formatDate(firstDate);
    const end = formatDate(lastDate);

    return start === end ? start : `${start} - ${end}`;
  };

  // Group consecutive periods into ranges for display
  const groupedPeriods = (availabilityData: AvailabilityData) => {
    if (availabilityData.periods.length <= 7) {
      // Single group for week or less
      return [
        {
          dateRange: formatDateRange(availabilityData.periods),
          periods: availabilityData.periods,
          totalSlots: availabilityData.summary.totalSlots,
          totalHours: availabilityData.summary.totalHours,
          totalDays: availabilityData.summary.totalDays,
        },
      ];
    }

    // For larger datasets, could group by weeks/months
    return [
      {
        dateRange: formatDateRange(availabilityData.periods),
        periods: availabilityData.periods,
        totalSlots: availabilityData.summary.totalSlots,
        totalHours: availabilityData.summary.totalHours,
        totalDays: availabilityData.summary.totalDays,
      },
    ];
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
  if (!data || !data.periods || data.periods.length === 0) {
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

  const groups = groupedPeriods(data);

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
            <span className="font-medium">{data.summary.totalDays} days</span>
          </div>
        </div>

        {/* Availability Groups */}
        <div className="divide-y divide-gray-100">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="p-4">
              {/* Group Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">
                    {group.dateRange}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {data.summary.totalPeriods} slot
                      {data.summary.totalPeriods > 1 ? "s" : ""}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {group.totalDays} days
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors">
                    <FiEdit2 size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <FiChevronUp size={16} />
                  </button>
                </div>
              </div>

              {/* Total Hours */}
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                <FiClock size={14} />
                <span>{group.totalHours} hours total</span>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {group.periods.map((dayPeriod, dayIndex) =>
                  dayPeriod.periods.map((period, periodIndex) => (
                    <div
                      key={`${dayIndex}-${periodIndex}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          {formatDate(period.start)}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatTime(period.start)} - {formatTime(period.end)}
                        </span>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                            {period.availableSlots}/{period.slotCount} slots
                          </span>
                          {period.bookedSlots > 0 && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">
                              {period.bookedSlots} booked
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-500">
                        {period.durationHours}h
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Summary Stats */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Total Slots:{" "}
                      <span className="font-medium text-gray-900">
                        {group.totalSlots}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Utilization:{" "}
                      <span className="font-medium text-gray-900">
                        {Math.round(data.summary.utilizationRate * 100)}%
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {data.summary.averagePeriodsPerDay} period/day avg
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityScheduler;
