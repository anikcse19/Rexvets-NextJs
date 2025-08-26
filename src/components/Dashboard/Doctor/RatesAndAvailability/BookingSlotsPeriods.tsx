"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useDashboardContext } from "@/hooks/DashboardContext";
import { Slot, SlotStatus } from "@/lib";
import { Check, ChevronDown } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";

interface BookingSlotsProps {
  className?: string;
}

const BookingSlotsPeriods: React.FC<BookingSlotsProps> = ({
  className = "",
}) => {
  const {
    selectedSlot,
    slotStatus,
    setSelectedSlotIds,
    selectedSlotIds,
    onUpdateSelectedSlotStatus,
    isUpdating,
    setSlotStatus,
  } = useDashboardContext();

  const [selectedStatus, setSelectedStatus] = useState<SlotStatus | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getSlotStyles = (status: SlotStatus) => {
    const baseStyles =
      "px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer text-sm font-medium w-full";

    switch (status) {
      case SlotStatus.AVAILABLE:
        return `${baseStyles} border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100`;
      case SlotStatus.BOOKED:
        return `${baseStyles} border-red-200 bg-red-50 text-red-700 cursor-not-allowed opacity-75`;
      case SlotStatus.BLOCKED:
        return `${baseStyles} border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-75`;
      case SlotStatus.PENDING:
        return `${baseStyles} border-yellow-200 bg-yellow-50 text-yellow-700 cursor-not-allowed opacity-75`;
      default:
        return `${baseStyles} border-gray-200 bg-white text-gray-700 hover:border-gray-300`;
    }
  };

  const getStatusBadgeStyles = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return "bg-green-100 text-green-800 border-green-200";
      case SlotStatus.BOOKED:
        return "bg-red-100 text-red-800 border-red-200";
      case SlotStatus.BLOCKED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case SlotStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDisplayName = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return "Available";
      case SlotStatus.BOOKED:
        return "Booked";
      case SlotStatus.BLOCKED:
        return "Blocked";
      case SlotStatus.PENDING:
        return "Pending";
      default:
        return status;
    }
  };

  const filteredSlots =
    slotStatus === SlotStatus.ALL
      ? selectedSlot
      : selectedSlot?.filter((slot) => slot.status === slotStatus);

  const handleSlotClick = (slot: Slot) => {
    // Only allow clicking for available slots
    if (slot.status === SlotStatus.AVAILABLE) {
      const isSelected = selectedSlotIds.includes(slot._id);
      if (isSelected) {
        setSelectedSlotIds((prev) => prev.filter((id) => id !== slot._id));
      } else {
        setSelectedSlotIds((prev) => [...prev, slot._id]);
      }
    }
  };

  // Handle checkbox selection for available slots
  const handleCheckboxChange = (slotId: string, checked: boolean) => {
    if (checked) {
      setSelectedSlotIds((prev) => [...prev, slotId]);
    } else {
      setSelectedSlotIds((prev) => prev.filter((id) => id !== slotId));
    }
  };

  // Handle checkbox click to prevent slot click when clicking checkbox
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleStatusSelect = (status: SlotStatus) => {
    setSelectedStatus(status);
    setIsDropdownOpen(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedSlotIds.length === 0) {
      return;
    }

    try {
      // Get current date range from the selectedSlot data
      let startDate: string | undefined;
      let endDate: string | undefined;
      
      if (selectedSlot && selectedSlot.length > 0) {
        // Get the first and last dates from the selected slots
        const dates = selectedSlot.map(slot => slot.formattedDate).sort();
        startDate = dates[0];
        endDate = dates[dates.length - 1];
      } else {
        // Fallback to current date if no slots available
        const currentDate = new Date();
        startDate = currentDate.toISOString().split('T')[0];
        endDate = startDate;
      }

      await onUpdateSelectedSlotStatus(selectedStatus, startDate, endDate);
      setSelectedStatus(null);
      setSelectedSlotIds([]);
    } catch (error) {
      console.error("Failed to update slot status:", error);
    }
  };

  const groupSlotsByDate = (slots: Slot[] | null) => {
    return slots?.reduce((groups, slot) => {
      const date = slot.formattedDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    }, {} as Record<string, Slot[]>);
  };

  const groupedSlots = groupSlotsByDate(filteredSlots ?? null);

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const convertUtcToLocal = (utcTime: string): string => {
    const utcMoment = moment.utc(utcTime, "HH:mm");
    const localMoment = utcMoment.local();
    return localMoment.format("hh:mm A");
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {slotStatus?.charAt(0)?.toUpperCase() + slotStatus?.slice(1)} Time
          Slots
        </h2>

        {/* Filter Buttons */}
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
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedSlotIds.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                <span className="font-medium">{selectedSlotIds.length}</span>{" "}
                slot{selectedSlotIds.length !== 1 ? "s" : ""} selected
              </p>

              <div className="flex items-center gap-3">
                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="text-sm">
                      {selectedStatus
                        ? getStatusDisplayName(selectedStatus)
                        : "Select Status"}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      {Object.values(SlotStatus).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusSelect(status)}
                          className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="text-sm">
                            {getStatusDisplayName(status)}
                          </span>
                          {selectedStatus === status && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus || isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slots Display */}
      <div className="space-y-8 w-full ">
        {Object.keys(groupedSlots ?? {})?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No slots found for the selected filter.
            </div>
          </div>
        ) : (
          Object.entries(groupedSlots ?? {})
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, dateSlots]) => (
              <div key={date} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  {formatDateForDisplay(date)}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3">
                  {dateSlots
                    .sort((a, b) =>
                      a.formattedStartTime.localeCompare(b.formattedStartTime)
                    )
                    .map((slot) => {
                      const isSelected = selectedSlotIds.includes(slot._id);

                      return (
                        <div
                          key={slot._id}
                          onClick={() => handleSlotClick(slot)}
                          className={getSlotStyles(slot.status as SlotStatus)}
                        >
                          <div className="flex flex-col items-center space-y-1 relative">
                            {slot.status === SlotStatus.AVAILABLE && (
                              <div
                                className="absolute -top-[10px] right-[-18px] p-1"
                                onClick={handleCheckboxClick}
                              >
                                <Checkbox
                                  className={`z-50 ${
                                    isSelected
                                      ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                      : "border-gray-300 bg-white"
                                  }`}
                                  id={`checkbox-${slot._id}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(
                                      slot._id,
                                      checked as boolean
                                    )
                                  }
                                />
                              </div>
                            )}

                            <div className="font-semibold">
                              {convertUtcToLocal(slot.formattedStartTime)}
                            </div>
                            <div className="text-xs opacity-75">
                              {convertUtcToLocal(slot.formattedEndTime)}
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs border ${getStatusBadgeStyles(
                                slot.status as SlotStatus
                              )}`}
                            >
                              {slot.status}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default BookingSlotsPeriods;
