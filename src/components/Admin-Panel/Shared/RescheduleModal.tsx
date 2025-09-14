"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format, addMonths, parse, compareAsc } from "date-fns";
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

  const fetchSlots = async () => {
    try {
      const vetId = appointment?.veterinarian?._id;
      if (!vetId) return;

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
      } else {
        toast.error("Failed to fetch available slots");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching slots");
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return toast.error("Please select a slot first");

    setIsConfirmLoading(true);
    try {
      const newAppointment = {
        ...appointment,
        AppointmentDate: selectedSlot.formattedDate,
        AppointmentTime: selectedSlot.formattedStartTime,
        originalAppointmentId: appointment.id,
        rescheduledTo: {
          date: selectedSlot.formattedDate,
          from: selectedSlot.formattedStartTime,
          until: selectedSlot.formattedEndTime,
        },
        rescheduledAt: new Date().toISOString(),
      };

      await saveRescheduledAppointment(newAppointment);

      await createNewBookedSlot({
        appointmentId: appointment.id,
        doctorId: appointment.veterinarian._id,
        date: selectedSlot.formattedDate,
        time: selectedSlot.formattedStartTime,
        createdAt: new Date(),
      });

      toast.success("Appointment rescheduled successfully");
      setSelectedSlot(null);
      onClose();
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

  const groupedSlots = slots.reduce((acc: any, slot: any) => {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>
            Reschedule Appointment with Dr {appointment?.veterinarian?.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {sortedDates.length === 0 && (
            <p className="text-gray-500">No available slots found.</p>
          )}

          {sortedDates.map((date) => (
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
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSlot || isConfirmLoading}
          >
            {isConfirmLoading ? "Rescheduling..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
