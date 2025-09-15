"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SlotStatus } from "@/lib";
import { getWeekRange } from "@/lib/timezone";
import { Doctor } from "@/lib/types";
import { format } from "date-fns";
import {
  Award,
  Building,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Timing {
  from: string;
  until: string;
}

interface ScheduleEntry {
  day: string;
  checked: boolean;
  timings: Timing[];
}

export function DoctorDetailsModal({
  doctor,
  open,
  onOpenChange,
}: DoctorDetailsModalProps) {
  const [slots, setSlots] = useState<any[]>([]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getSlotStatusClasses = (status: string) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
      case SlotStatus.BOOKED:
        return "bg-red-50 text-red-700 border-red-200 line-through opacity-70";
      case SlotStatus.DISABLED:
        return "bg-gray-100 text-gray-500 border-gray-200 opacity-70";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getSlots = useCallback(
    async (startDate: string, endDate: string, refId: string) => {
      if (!refId) {
        return;
      }
      try {
        console.log(startDate, endDate, "vet slotsss date");
        // const timezoneParam = timezone ? `&timezone=${encodeURIComponent(timezone)}` : '';
        const apiUrl = `/api/appointments/slots/slot-summary/${refId}?startDate=${startDate}&endDate=${endDate}&status=${SlotStatus.ALL}`;
        console.log("Fetching from API:", apiUrl);

        const res = await fetch(apiUrl);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error Response:", errorText);
          throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
        }

        const responseData = await res.json();
        setSlots(responseData?.data?.periods);
        console.log("API Response Data:", responseData);
      } catch (error: any) {
        console.error("Error in getAvailableSlots:", error);
      } finally {
      }
    },
    [doctor]
  );

  useEffect(() => {
    if (doctor?._id) {
      const weeklyRange = getWeekRange();
      const startDate = format(weeklyRange.start, "yyyy-MM-dd");
      const endDate = format(weeklyRange.end, "yyyy-MM-dd");
      getSlots(startDate, endDate, doctor._id);
    }
  }, [getSlots]);
  console.log("Slots", slots);
  if (!doctor) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg md:!max-w-5xl max-h-[90vh] overflow-y-auto dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle>Doctor Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 dark:bg-slate-800">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="dark:bg-slate-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage
                      src={doctor.profileImage}
                      alt={doctor.firstName}
                    />
                    <AvatarFallback className="text-2xl">
                      {doctor.lastName}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{doctor.firstName}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {doctor.specialities}
                    </p>
                  </div>
                  {/* <Badge
                    className={getStatusColor(
                      doctor.Approved === "yes" ? "Approved" : "Pending"
                    )}
                  >
                    {doctor.Approved === "yes" ? "Approved" : "Pending"}
                  </Badge> */}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">
                        {doctor?.licenses?.map((url) => (
                          <p key={url.licenseNumber}>{url?.licenseNumber}</p>
                        ))}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        License Number
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="dark:bg-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{doctor.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>
                    {doctor.city}, {doctor.state}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Chamber Information */}
            <Card className="dark:bg-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Chamber Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{doctor?.clinic?.name}</p>
                <p>{doctor?.clinic?.address}</p>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="dark:bg-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!slots || slots.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No slots found for this week.</p>
                ) : (
                  <div className="space-y-5">
                    {slots.map((group: any, groupIdx: number) => {
                      const dateLabel = group?.date?.start
                        ? format(new Date(group.date.start), "EEE, MMM d")
                        : `Day ${groupIdx + 1}`;
                      return (
                        <div key={groupIdx} className="border rounded-lg p-4 dark:border-slate-600">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="font-semibold">{dateLabel}</span>
                            {group?.timezone && (
                              <span className="ml-2 text-xs text-slate-500">{group.timezone}</span>
                            )}
                          </div>

                          {group?.periods?.length ? (
                            <div className="space-y-3">
                              {group.periods.map((period: any, pIdx: number) => (
                                <div key={pIdx} className="">
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>
                                      {period.startTime} - {period.endTime}
                                    </span>
                                    {typeof period.totalHours === "number" && (
                                      <span className="ml-2">({period.totalHours.toFixed(1)} hrs)</span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {period?.slots?.map((slot: any) => (
                                      <div
                                        key={slot._id}
                                        className={`text-xs px-2.5 py-1 rounded-full border transition ${getSlotStatusClasses(
                                          slot.status
                                        )}`}
                                        title={`${slot.formattedStartTime || slot.startTime} - ${slot.formattedEndTime || slot.endTime} (${slot.status})`}
                                      >
                                        {(slot.formattedStartTime || slot.startTime) + " - " + (slot.formattedEndTime || slot.endTime)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No periods for this day.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
