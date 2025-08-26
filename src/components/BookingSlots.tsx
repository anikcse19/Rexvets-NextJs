"use client";

import { Slot, SlotStatus } from "@/lib";
import moment from "moment";
import React, { useState } from "react";

interface BookingSlotsProps {
  slots: Slot[] | null;
  onSlotSelect?: (slot: Slot) => void;
  selectedSlotId?: string;
  className?: string;
  status?: SlotStatus;
}

const BookingSlots: React.FC<BookingSlotsProps> = ({
  slots,
  onSlotSelect,
  selectedSlotId,
  className = "",
  status = SlotStatus.AVAILABLE,
}) => {
  const [filterStatus, setFilterStatus] = useState<SlotStatus>(status);

  const getSlotStyles = (status: SlotStatus, isSelected: boolean) => {
    const baseStyles =
      "px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer text-sm font-medium w-full";

    if (isSelected) {
      return `${baseStyles} border-blue-500 bg-blue-50 text-blue-700 shadow-md`;
    }

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

  const filteredSlots =
    filterStatus === SlotStatus.ALL
      ? slots
      : slots?.filter((slot) => slot.status === filterStatus);

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === SlotStatus.AVAILABLE && onSlotSelect) {
      onSlotSelect(slot);
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
          Available Time Slots
        </h2>

        {/* Filter Buttons */}

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
                    .map((slot) => (
                      <div
                        key={slot._id}
                        onClick={() => handleSlotClick(slot)}
                        className={getSlotStyles(
                          slot.status as SlotStatus,
                          selectedSlotId === slot._id
                        )}
                      >
                        <div className="flex flex-col items-center space-y-1">
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
                    ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Selected Slot Info */}
      {selectedSlotId && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Selected Slot:</h4>
          {(() => {
            const selectedSlot = slots?.find(
              (slot) => slot._id === selectedSlotId
            );
            return selectedSlot ? (
              <div className="text-blue-800">
                <p>Date: {formatDateForDisplay(selectedSlot.formattedDate)}</p>
                <p>
                  Time: {selectedSlot.formattedStartTime} -{" "}
                  {selectedSlot.formattedEndTime}
                </p>
                <p>Status: {selectedSlot.status}</p>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default BookingSlots;
