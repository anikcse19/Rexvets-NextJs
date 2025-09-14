"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { addMonths, compareAsc, format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createNewBookedSlot,
  saveRescheduledAppointment,
} from "../Actions/apointment";
import { getVetSlots } from "../Actions/vets";

export default function RescheduleModal({
  open,
  onClose,
  appointment,
}: {
  open: boolean;
  onClose: () => void;
  appointment: any;
}) {
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState<boolean>(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  console.log("appointment", appointment);
  const fetchSlots = async () => {
    try {
      const vetId = appointment?.veterinarian?._id;
      if (!vetId) return;

      setIsLoadingSlots(true);
      const startDate = format(new Date(), "yyyy-MM-dd");
      const endDate = format(addMonths(new Date(), 1), "yyyy-MM-dd");

      const res = await getVetSlots(vetId, startDate, endDate);
      if (res?.success) {
        // sort slots by date then by start time
        const sorted = [...res.data].sort((a, b) => {
          const dateCompare = compareAsc(
            new Date(a.formattedDate),
            new Date(b.formattedDate)
          );
          if (dateCompare !== 0) return dateCompare;
          return a.formattedStartTime.localeCompare(b.formattedStartTime);
        });
        setSlots(sorted);
        setCurrentPage(1); // Reset to first page when new slots are fetched
      } else {
        toast.error("Failed to fetch available slots");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching slots");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handlRescheduleAppointment = async () => {
    if (!selectedSlot) return toast.error("Please select a slot first");

    setIsConfirmLoading(true);
    try {
      const payload = {
        appointment,
        selectedSlot: selectedSlot._id,
      };
      console.log("payload", payload);

      // toast.success("Appointment rescheduled successfully");
      // setSelectedSlot(null);
      // onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule appointment");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchSlots();
  }, [open]);

  // Pagination logic
  const totalSlots = slots.length;
  const totalPages = Math.ceil(totalSlots / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSlots = slots.slice(startIndex, endIndex);

  const groupedSlots = paginatedSlots.reduce((acc: any, slot: any) => {
    acc[slot.formattedDate] = acc[slot.formattedDate] || [];
    acc[slot.formattedDate].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSlots).sort((a, b) =>
    compareAsc(new Date(a), new Date(b))
  );

  const to12Hr = (time: string) => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "hh:mm a");
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at once

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis for large page counts
      if (currentPage <= 3) {
        // Show first 4 pages + ellipsis + last page
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 4 pages
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>
            Reschedule Appointment with Dr {appointment?.veterinarian?.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingSlots ? (
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading available slots...
              </p>
            </div>
          ) : sortedDates.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No available slots found.
            </p>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="border rounded-xl p-3">
                <p className="font-medium mb-2">
                  {format(new Date(date), "EEE, MMM dd, yyyy")}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {groupedSlots[date].map((slot: any) => {
                    const isSelected = selectedSlot?._id === slot._id;
                    return (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`border rounded-lg p-2 text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-all ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-white dark:bg-slate-700"
                        }`}
                      >
                        {to12Hr(slot.formattedStartTime)} -{" "}
                        {to12Hr(slot.formattedEndTime)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoadingSlots && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {/* Page Numbers */}
              {generatePageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-2 py-1 text-sm text-gray-500">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className="min-w-[32px]"
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        {!isLoadingSlots && totalPages > 1 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, totalSlots)} of{" "}
            {totalSlots} slots
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlRescheduleAppointment}
            disabled={!selectedSlot || isConfirmLoading || isLoadingSlots}
          >
            {isConfirmLoading ? "Rescheduling..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
