import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/lib/types";
import { Calendar, CalendarX2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const TodaysAppointmentList = ({
  todaysAppointmentList,
}: {
  todaysAppointmentList: Appointment[];
}) => {
  console.log("todaysAppointmentList", todaysAppointmentList);
  const router = useRouter();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Today&apos;s Appointments
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {todaysAppointmentList?.length} scheduled
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysAppointmentList?.length <= 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-red-100 rounded-full p-4 mb-4">
                <CalendarX2 className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                No Appointments Available
              </h2>
              <p className="mt-2 text-gray-500 max-w-md">
                It looks like no slots are open right now. Please check back
                later or update your schedule to allow bookings.
              </p>
            </div>
          ) : (
            todaysAppointmentList?.map((appointment, index) => (
              <div
                onClick={() =>
                  router.push(
                    `/dashboard/doctor/appointments/${appointment?._id}`
                  )
                }
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      appointment.status === "completed"
                        ? "bg-green-500"
                        : appointment.status === "upcoming"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">
                      {appointment?.pet?.name}
                    </p>
                    <span className="text-gray-400">•</span>
                    <p className="text-sm text-gray-600">
                      {appointment?.pet?.breed}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Pet Parent: {appointment?.petParent?.name}
                  </p>
                  <p className="text-sm text-blue-600 capitalize font-medium">
                    {appointment?.appointmentType?.replace("_", " ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatDateTime(appointment?.appointmentDate)}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${
                      appointment.status === "completed"
                        ? "border-green-200 text-green-700"
                        : appointment.status === "upcoming"
                        ? "border-blue-200 text-blue-700"
                        : "border-yellow-200 text-yellow-700"
                    }`}
                  >
                    {appointment?.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAppointmentList;
