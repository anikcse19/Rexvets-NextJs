"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SlotStatus } from "@/lib";
import {
  formatTimeToUserTimezone,
  getUserTimezone,
  getWeekRange,
} from "@/lib/timezone";
import { Doctor } from "@/lib/types";
import { format } from "date-fns";
import {
  Award,
  Bell,
  Building,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Loader2,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    availableSlots: number;
    bookedSlots: number;
    disabledSlots: number;
    totalPeriods: number;
    totalSlotHours: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0); // paginate by period

  const tz = getUserTimezone();
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
        setLoading(true);
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
        setLoading(false);
      }
    },
    [doctor]
  );

  const getSlotStats = useCallback(
    async (startDate: string, endDate: string, refId: string) => {
      if (!refId) return;
      try {
        setStatsLoading(true);
        const apiUrl = `/api/appointments/slots/slot-stats?vetId=${refId}&startDate=${startDate}&endDate=${endDate}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status} - ${errorText}`);
        }
        const responseData = await res.json();
        setStats(responseData?.data || null);
      } catch (e) {
        console.error("getSlotStats error", e);
        setStats(null);
      } finally {
        setStatsLoading(false);
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
      getSlotStats(startDate, endDate, doctor._id);
    }
  }, [getSlots, getSlotStats]);
  console.log("Slots", slots);

  // Flatten slots per period to paginate one period at a time
  const flattenedPeriods: Array<{
    dateStart: Date | null;
    dateTzLabel: string;
    timezone?: string;
    period: any;
  }> = (slots || []).flatMap((group: any) => {
    const dateStart = group?.date?.start ? new Date(group.date.start) : null;
    const dateTzLabel = dateStart
      ? new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: tz,
        }).format(dateStart)
      : "";
    return (group?.periods || []).map((p: any) => ({
      dateStart,
      dateTzLabel,
      timezone: group?.timezone,
      period: p,
    }));
  });

  const totalPages = flattenedPeriods.length;
  const currentItem = flattenedPeriods[currentPage] || null;

  const goToPage = (idx: number) => {
    if (idx < 0 || idx >= totalPages) return;
    setCurrentPage(idx);
  };

  const buildPageNumbers = () => {
    const pages: Array<number | string> = [];
    const maxShown = 7; // mobile-first concise
    if (totalPages <= maxShown) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      if (start > 0) {
        pages.push(0, 1, "...");
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) {
        pages.push("...", totalPages - 2, totalPages - 1);
      }
    }
    return pages;
  };

  const renderStatusBadge = (status: string) => {
    const base = "px-2 py-0.5 text-[10px] rounded-full border";
    const cls = getSlotStatusClasses(status);
    return <span className={`${base} ${cls}`}>{status}</span>;
  };
  console.log("doctor", doctor);

  const [sending, setSending] = useState<boolean>(false);
  const sendNotification = async (message: string) => {
    if (!doctor?._id) return;
    try {
      setSending(true);
      const res = await fetch(`/api/notifications/vet-profile-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vetId: doctor._id, reason: message }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Failed: ${res.status} ${t}`);
      }
      alert("Notification sent.");
    } catch (e: any) {
      console.error(e);
      alert("Failed to send notification.");
    } finally {
      setSending(false);
    }
  };
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
                      src={doctor.profileImage || ""}
                      alt={doctor.firstName || "Doctor"}
                    />
                    <AvatarFallback className="text-2xl">
                      {(doctor?.firstName?.[0] || "D") +
                        (doctor?.lastName?.[0] || "R")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {doctor.firstName || "Name not provided"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {doctor?.specialities?.length
                        ? doctor.specialities.join(", ")
                        : "Specialities not provided"}
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
                      <div className="font-semibold space-y-1">
                        {doctor?.licenses?.length ? (
                          doctor.licenses.map((url) => (
                            <div key={url.licenseNumber || url.id}>
                              {url?.licenseNumber || "License # not provided"}
                            </div>
                          ))
                        ) : (
                          <>
                            <div>No licenses provided</div>
                            <Button
                              className="mt-2"
                              variant="outline"
                              size="sm"
                              disabled={sending}
                              onClick={() =>
                                sendNotification(
                                  `Hi ${
                                    doctor?.firstName || "Doctor"
                                  }, please add your license details to complete your profile.`
                                )
                              }
                            >
                              Send notification to vet
                            </Button>
                          </>
                        )}
                      </div>
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
                <div className="mt-2">
                  <Button size="sm" className="gap-2">
                    <Bell className="w-4 h-4" />
                    Send Notification
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{doctor.phoneNumber || "Phone not provided"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{doctor.email || "Email not provided"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>
                    {doctor?.city || "City not provided"},{" "}
                    {doctor?.state || "State not provided"}
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
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="truncate">
                      Clinic: {doctor?.clinic?.name || "Name not provided"}
                    </p>
                    <p className="truncate">
                      Address: {doctor?.clinic?.address || "Address not provided"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={sending}
                    onClick={() => {
                      const missing: string[] = [];
                      if (!doctor?.clinic?.name) missing.push("clinicName");
                      if (!doctor?.clinic?.address) missing.push("clinicAddress");
                      const reasonParts: string[] = [];
                      if (missing.includes("clinicName")) reasonParts.push("clinic name");
                      if (missing.includes("clinicAddress")) reasonParts.push("clinic address");
                      const reasonText = reasonParts.length
                        ? `Hi ${doctor?.firstName || "Doctor"}, please provide your ${reasonParts.join(" and ")}.`
                        : `Hi ${doctor?.firstName || "Doctor"}, please review your clinic information.`;
                      sendNotification(reasonText);
                      // Also send missing fields to API
                      fetch(`/api/notifications/vet-profile-info`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ vetId: doctor?._id, reason: reasonText, missingFields: missing }),
                      }).catch(() => {});
                    }}
                  >
                    Check & notify
                  </Button>
                </div>
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
                {loading ? (
                  <div className="w-full flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
                  </div>
                ) : !slots || slots.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No slots found for this week.
                  </p>
                ) : !currentItem ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No period to display.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {statsLoading ? (
                        <div className="col-span-full w-full flex items-center justify-center py-2">
                          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                        </div>
                      ) : stats ? (
                        <>
                          <div className="rounded-lg border p-3 text-center">
                            <div className="text-xs text-slate-500">
                              Available
                            </div>
                            <div className="text-lg font-semibold text-green-600">
                              {stats.availableSlots}
                            </div>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <div className="text-xs text-slate-500">Booked</div>
                            <div className="text-lg font-semibold text-red-600">
                              {stats.bookedSlots}
                            </div>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <div className="text-xs text-slate-500">
                              Disabled
                            </div>
                            <div className="text-lg font-semibold text-slate-600">
                              {stats.disabledSlots}
                            </div>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <div className="text-xs text-slate-500">
                              Periods
                            </div>
                            <div className="text-lg font-semibold">
                              {stats.totalPeriods}
                            </div>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <div className="text-xs text-slate-500">
                              Slot Hours
                            </div>
                            <div className="text-lg font-semibold">
                              {stats.totalSlotHours}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-full text-center text-xs text-slate-500">
                          No stats available
                        </div>
                      )}
                    </div>
                    {/* Header: Date */}
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold">
                          {currentItem.dateTzLabel}
                        </span>
                        {currentItem?.timezone && (
                          <span className="ml-2 text-xs text-slate-500">
                            {currentItem.timezone}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {currentPage + 1} of {totalPages}
                      </span>
                    </div>

                    {/* Period meta */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {formatTimeToUserTimezone(
                          currentItem.period.startTime,
                          tz
                        )}{" "}
                        -{" "}
                        {formatTimeToUserTimezone(
                          currentItem.period.endTime,
                          tz
                        )}
                      </span>
                      {typeof currentItem.period.totalHours === "number" && (
                        <span className="ml-2">
                          ({currentItem.period.totalHours.toFixed(1)} hrs)
                        </span>
                      )}
                    </div>

                    {/* Slots list */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 justify-items-center">
                      {currentItem.period?.slots?.map((slot: any) => (
                        <div
                          key={slot._id}
                          className={`flex flex-col items-start gap-1 rounded-xl border p-2 text-xs shadow-sm transition hover:shadow ${getSlotStatusClasses(
                            slot.status
                          )}`}
                          title={`${formatTimeToUserTimezone(
                            slot.formattedStartTime || slot.startTime,
                            tz
                          )} - ${formatTimeToUserTimezone(
                            slot.formattedEndTime || slot.endTime,
                            tz
                          )} (${slot.status})`}
                        >
                          <span className="font-semibold">
                            {formatTimeToUserTimezone(
                              slot.formattedStartTime || slot.startTime,
                              tz
                            )}
                          </span>
                          <span className="opacity-80">
                            {formatTimeToUserTimezone(
                              slot.formattedEndTime || slot.endTime,
                              tz
                            )}
                          </span>
                          {renderStatusBadge(slot.status)}
                        </div>
                      ))}
                    </div>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-1 sm:gap-2 pt-2">
                        <button
                          className="px-2 sm:px-3 py-1 rounded border text-xs disabled:opacity-50"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          Prev
                        </button>
                        {buildPageNumbers().map((p, idx) =>
                          typeof p === "string" ? (
                            <span
                              key={idx}
                              className="px-2 text-xs text-slate-500"
                            >
                              {p}
                            </span>
                          ) : (
                            <button
                              key={idx}
                              className={`px-2 sm:px-3 py-1 rounded border text-xs ${
                                p === currentPage
                                  ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                                  : "bg-white dark:bg-slate-700"
                              }`}
                              onClick={() => goToPage(p)}
                            >
                              {p + 1}
                            </button>
                          )
                        )}
                        <button
                          className="px-2 sm:px-3 py-1 rounded border text-xs disabled:opacity-50"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage >= totalPages - 1}
                        >
                          Next
                        </button>
                      </div>
                    )}
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
