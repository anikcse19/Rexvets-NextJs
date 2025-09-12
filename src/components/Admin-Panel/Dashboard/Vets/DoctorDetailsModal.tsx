"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Building,
  Award,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/lib/types";

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
  if (!doctor) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

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
              {/* <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {doctor?.Schedule?.map((schedule: ScheduleEntry) => (
                    <div
                      key={schedule.day}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <span className="font-medium">{schedule?.day}</span>
                      {schedule?.checked ? (
                        <div className="flex flex-col gap-2">
                          {schedule?.timings?.map(
                            (timing: Timing, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-green-600"
                              >
                                <Clock className="w-4 h-4" />
                                <span>
                                  {timing?.from} - {timing?.until}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-red-600">Unavailable</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent> */}
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
