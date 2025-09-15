import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Eye, Stethoscope, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getParentAppointments } from "../Service/get-all-appointments";
import { Appointment } from "@/lib/types";
import { toast } from "sonner";

const UpcomingAppointments = () => {
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession({ required: true });

  const parentId = session?.user?.refId as string;

  const fetchAppointments = async () => {
    if (!parentId) return;
    try {
      setLoading(true);
      const data = await getParentAppointments(parentId);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

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
          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center gap-4 p-6 border rounded-2xl bg-gray-50"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded" />
                    <div className="h-8 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Appointments Found */}
          {!loading && appointmentsData.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium">No upcoming appointments</p>
              <p className="text-sm text-gray-400">
                You don’t have any scheduled visits right now.
              </p>
            </div>
          )}

          {/* Appointments List */}
          <div className="space-y-4">
            {!loading &&
              appointmentsData?.map((appointment) => (
                <div key={appointment._id} className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-green-50/30 border border-gray-200/60 hover:border-green-300/60 transition-all duration-300 hover:shadow-xl p-6">
                    <div className="flex items-center gap-4">
                      {/* Pet Avatar */}
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-2 ring-green-100">
                        <AvatarImage
                          src={appointment?.pet?.image}
                          alt={appointment?.pet?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 font-bold">
                          {appointment?.pet?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Appointment Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {appointment?.pet?.name}
                          </h3>
                          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs capitalize">
                            {appointment?.appointmentType?.replace("_", " ")}
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
                          onClick={() =>
                            window.open(appointment?.meetingLink, "_blank")
                          }
                          size="sm"
                          variant="outline"
                          className="border-green-300 text-green-600 hover:bg-green-50 cursor-pointer"
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
