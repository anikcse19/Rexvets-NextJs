import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/lib/types";
import { Calendar } from "lucide-react";
import React from "react";

const TodaysAppointmentList = ({
  todaysAppointmentList,
}: {
  todaysAppointmentList: Appointment[];
}) => {
  console.log("todaysAppointmentList", todaysAppointmentList);

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
          {todaysAppointmentList?.map((appointment, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAppointmentList;
