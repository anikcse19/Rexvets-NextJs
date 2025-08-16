import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import React from "react";

const WeeklySchedule = () => {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {[
            {
              day: "Monday",
              hours: ["8:00 AM - 12:00 PM", "5:00 PM - 8:00 PM"],
              appointments: 15,
              status: "busy",
            },
            {
              day: "Tuesday",
              hours: ["8:00 AM - 6:00 PM"],
              appointments: 12,
              status: "moderate",
            },
            {
              day: "Wednesday",
              hours: ["8:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"],
              appointments: 18,
              status: "busy",
            },
            {
              day: "Thursday",
              hours: ["8:00 AM - 6:00 PM"],
              appointments: 10,
              status: "light",
            },
            {
              day: "Friday",
              hours: ["9:00 AM - 12:00 PM", "4:00 PM - 7:00 PM"],
              appointments: 14,
              status: "moderate",
            },
            {
              day: "Saturday",
              hours: ["9:00 AM - 2:00 PM"],
              appointments: 8,
              status: "light",
            },
          ].map((schedule, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{schedule.day}</h4>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${
                    schedule.status === "busy"
                      ? "border-red-200 text-red-700"
                      : schedule.status === "moderate"
                      ? "border-yellow-200 text-yellow-700"
                      : "border-green-200 text-green-700"
                  }`}
                >
                  {schedule.status}
                </Badge>
              </div>

              {/* Hours */}
              <div className="flex flex-wrap gap-2 mb-2">
                {schedule.hours.map((time, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium"
                  >
                    {time}
                  </span>
                ))}
              </div>

              <p className="text-sm font-medium text-[#1c1b36">
                {schedule.appointments} appointments
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySchedule;
