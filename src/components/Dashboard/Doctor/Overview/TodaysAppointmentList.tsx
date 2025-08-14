import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import React from "react";

const TodaysAppointmentList = () => {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Today's Appointments
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            12 scheduled
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              time: "09:00 AM",
              pet: "Max",
              owner: "Sarah Johnson",
              type: "Golden Retriever",
              service: "Routine Checkup",
              status: "completed",
            },
            {
              time: "10:30 AM",
              pet: "Bella",
              owner: "Mike Chen",
              type: "Persian Cat",
              service: "Vaccination",
              status: "completed",
            },
            {
              time: "11:15 AM",
              pet: "Charlie",
              owner: "Emma Davis",
              type: "Beagle",
              service: "Dental Cleaning",
              status: "in-progress",
            },
            {
              time: "02:00 PM",
              pet: "Luna",
              owner: "James Wilson",
              type: "Siamese Cat",
              service: "Surgery Consultation",
              status: "upcoming",
            },
            {
              time: "03:30 PM",
              pet: "Rocky",
              owner: "Lisa Brown",
              type: "German Shepherd",
              service: "Emergency Check",
              status: "upcoming",
            },
          ].map((appointment, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0">
                <div
                  className={`w-3 h-3 rounded-full ${
                    appointment.status === "completed"
                      ? "bg-green-500"
                      : appointment.status === "in-progress"
                      ? "bg-blue-500"
                      : appointment.status === "urgent"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">
                    {appointment.pet}
                  </p>
                  <span className="text-gray-400">•</span>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Owner: {appointment.owner}
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  {appointment.service}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{appointment.time}</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    appointment.status === "completed"
                      ? "border-green-200 text-green-700"
                      : appointment.status === "in-progress"
                      ? "border-blue-200 text-blue-700"
                      : appointment.status === "urgent"
                      ? "border-red-200 text-red-700"
                      : "border-yellow-200 text-yellow-700"
                  }`}
                >
                  {appointment.status.replace("-", " ")}
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
