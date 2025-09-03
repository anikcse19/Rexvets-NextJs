import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Stethoscope,
  Video,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getParentAppointments } from "../Service/get-all-appointments";
import { Appointment } from "@/lib/types";
import { toast } from "sonner";

const UpcomingAppointments = () => {
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const { data: session } = useSession();

  const parentId = session?.user?.refId as string;

  console.log("parentId ---------- in appointments list page", parentId);

  const fetchAppointments = async () => {
    if (!parentId) return;
    try {
      const data = await getParentAppointments(parentId);
      console.log("Fetched appointments:", data);

      const now = new Date();

      const upcomingAppointments = data?.data?.filter((appointment: any) => {
        if (!appointment?.appointmentDate) return false;

        const appointmentDateTime = new Date(appointment?.appointmentDate);
        return appointmentDateTime > now; // only future appointments
      });

      setAppointmentsData(upcomingAppointments);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session]);

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

  return (
    <div>
      <Card className="shadow-xl border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Upcoming Appointments
              </CardTitle>
              <p className="text-green-100 mt-1">
                Your scheduled veterinary visits
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {appointmentsData?.map((appointment) => (
              <div key={appointment.id} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-green-50/30 border border-gray-200/60 hover:border-green-300/60 transition-all duration-300 hover:shadow-xl p-6">
                  {/* Status indicator line */}
                  {/* <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      appointment.status === "confirmed"
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    }`}
                  /> */}

                  <div className="flex items-center gap-4">
                    {/* Pet Avatar */}
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-2 ring-green-100">
                        <AvatarImage
                          src={appointment?.pet?.image}
                          alt={appointment?.pet?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 font-bold">
                          {appointment?.pet?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {/* <div
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg ${
                          appointment.status === "confirmed"
                            ? "bg-gradient-to-br from-green-400 to-green-600"
                            : "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div> */}
                    </div>

                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {appointment?.pet?.name}
                        </h3>
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-xs capitalize">
                          {appointment?.appointmentType.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">
                            {formatDate(appointment?.appointmentDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700">
                            {formatTime(appointment?.appointmentDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">
                            Dr. {appointment?.veterinarian?.name}
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <Badge
                            className={`${
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-yellow-100 text-yellow-700 border-yellow-300"
                            } text-xs`}
                          >
                            {appointment.status.toUpperCase()}
                          </Badge>
                        </div> */}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/dashboard/pet-parent/appointments/${appointment._id}`}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingAppointments;
