"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, isBefore, parse } from "date-fns";
import { toast } from "sonner";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import {
  createNewBookedSlot,
  fetchDoctorBookedTimeSlots,
  fetchDoctorSchedule,
  saveRescheduledAppointment,
} from "../Actions/apointment";
import { DateTime } from "luxon";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookedTimes, setBookedTimes] = useState<any[]>([]);
  const [isConrimLoading, setIsConfirmLoading] = useState<boolean>(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (appointment) {
      fetchDoctorSchedule(appointment.DoctorRefID).then((res) => {
        const formattedSlots = res.flatMap((slot: any) =>
          slot.checked
            ? slot.timings
                .filter((t: any) => t.from && t.until)
                .flatMap((t: any, i: number) => {
                  // Parse time strings into Date objects
                  const slots: any[] = [];
                  const day = slot.day;
                  const from = parse(t.from, "hh:mm a", new Date());
                  const until = parse(t.until, "hh:mm a", new Date());

                  let current = new Date(from);
                  while (current < until) {
                    const next = new Date(current.getTime() + 30 * 60000); // +30 min
                    if (next <= until) {
                      slots.push({
                        id: `${day}-${i}-${current.toTimeString()}`,
                        day,
                        from: format(current, "hh:mm a"),
                        until: format(next, "hh:mm a"),
                      });
                    }
                    current = next;
                  }
                  return slots;
                })
            : []
        );
        setSlots(formattedSlots);
      });
    } else {
      console.log("No appointment found");
    }
  }, [appointment]);

  useEffect(() => {
    fetchDoctorBookedTimeSlots(appointment?.DoctorRefID, selectedDate).then(
      (res) => {
        setBookedTimes(res);
      }
    );
  }, [appointment, selectedDate]);

  // Extract available weekdays from slots
  const allowedDays = useMemo(() => {
    return Array.from(new Set(slots.map((s) => s.day)));
    // e.g. ["Monday", "Tuesday"]
  }, [slots]);

  const isDateAllowed = (date: Date) => {
    const weekday = format(date, "EEEE"); // e.g. "Monday"
    return allowedDays.includes(weekday);
  };

  const convertNYToLocal = (time: string, date: any) => {
    const formatted = format(date, "yyyy-MM-dd");

    const nyTime = DateTime.fromFormat(
      `${formatted} ${time}`,
      "yyyy-MM-dd hh:mm a",
      {
        zone: "America/New_York",
      }
    );

    const userTime = nyTime.setZone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    return userTime.toFormat("hh:mm a");
  };

  const sendRescheduleConfirmationMail = async () => {
    if (!selectedSlot || !selectedDate) return;
    const doctorRef = doc(
      db,
      "Doctors",
      "Veterinarian",
      "Veterinarian",
      appointment.DoctorRefID
    );

    const doctorSnap = await getDoc(doctorRef);
    const doctorDetails = doctorSnap.exists() ? doctorSnap.data() : {};

    // Get parent details
    const parentRef = doc(db, "Parents", appointment.ParentRefID);
    const parentSnap = await getDoc(parentRef);
    const parentDetails = parentSnap.exists() ? parentSnap.data() : {};

    // Get pet details
    const petRef = doc(collection(parentRef, "pets"), appointment.PetRefID);
    const petSnap = await getDoc(petRef);
    const petDetails = petSnap.exists() ? petSnap.data() : {};

    const meetingLink = `https://rexvet.org/VideoCall/${user?.uid.slice(
      0,
      5
    )}${doctorDetails?.uid.slice(0, 5)}${format(
      selectedDate,
      "yyyy-MM-dd"
    )}${selectedSlot.from.replace(/\s/g, "").replace(/:/g, "")}`;

    if (
      doctorDetails.EmailAddress &&
      parentDetails.EmailAddress &&
      petDetails.Name
    ) {
      const localDateTime = `${format(selectedDate, "yyyy-MM-dd")} ${
        selectedSlot.from
      }`;
      const appointmentTimeUTC = new Date(localDateTime).toISOString(); // might still fail without AM/PM

      try {
        console.log("match requirements");
        const res = await fetch(
          "https://rexvetsemailserver.up.railway.app/sendRescheduleAppointmentConfirmation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doctorEmail: doctorDetails.EmailAddress,
              doctorName: `Dr. ${doctorDetails.FirstName} ${doctorDetails.LastName}`,
              parentEmail: parentDetails.EmailAddress,
              parentName: parentDetails.Name,
              petName: petDetails.Name,
              appointmentDate: format(selectedDate, "yyyy-MM-dd"),
              appointmentTime: selectedSlot.from, // Doctor's timezone
              appointmentTimeUTC: appointmentTimeUTC,
              userDisplayTime: convertNYToLocal(
                selectedSlot.from,
                selectedDate
              ), // User's timezone
              doctorTimezone: appointment.DoctorTimezone,
              userTimezone: appointment.UserTimezone,
              meetingLink: meetingLink,
              oldTime: appointment.AppointmentTime,
              oldDate: appointment?.AppointmentDate,
            }),
          }
        );
        const result = await res.json();

        console.log(result, "check mail");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedDate) return;

    setIsConfirmLoading(true);
    try {
      const newAppointment = {
        ...appointment,
        AppointmentDate: format(selectedDate, "yyyy-MM-dd"),
        AppointmentTime: selectedSlot.from,
        originalAppointmentId: appointment.id,
        rescheduledTo: {
          date: format(selectedDate, "yyyy-MM-dd"),
          day: selectedSlot.day,
          from: selectedSlot.from,
          until: selectedSlot.until,
        },
        rescheduledAt: new Date().toISOString(),
      };

      await saveRescheduledAppointment(newAppointment);

      const bookedTime = {
        appointmentId: appointment.id,
        doctorId: appointment.DoctorRefID,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedSlot.from,
        createdAt: new Date(),
      };

      await createNewBookedSlot(bookedTime);
      onClose();
      toast.success("Rescheduled Appointment Successfully");
      await sendRescheduleConfirmationMail();
    } catch (error) {
      toast.error("Something Wents Wrong");
    } finally {
      setSelectedDate(undefined);
      setSelectedSlot(null);
      setIsConfirmLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>

        {/* Calendar */}
        <div className="mb-4 shrink-0 flex flex-col justify-center items-center">
          <p className="text-sm font-medium mb-2">Choose a Date:</p>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            className="rounded-md shadow"
            disabled={(date) =>
              isBefore(date, new Date()) || !isDateAllowed(date)
            }
          />
        </div>

        {/* Scrollable Slot List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {slots
            .filter((slot) => {
              if (!selectedDate) return false;
              const dayOfSelected = format(selectedDate, "EEEE");
              return slot.day === dayOfSelected;
            })
            .map((slot) => {
              const isBooked = bookedTimes?.some((bt) => bt.time === slot.from);
              return (
                <Button
                  key={slot.id}
                  variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full justify-start ${
                    isBooked ? "border border-red-500" : ""
                  }`}
                  disabled={isBooked}
                >
                  {slot.day} - {convertNYToLocal(slot.from, selectedDate)} to{" "}
                  {convertNYToLocal(slot.until, selectedDate)}
                  {isBooked && " -- Booked"}
                </Button>
              );
            })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4 shrink-0">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedSlot}>
            {isConrimLoading ? "Loading..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
