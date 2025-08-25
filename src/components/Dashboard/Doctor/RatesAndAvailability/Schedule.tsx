import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Doctor } from "@/lib/types";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { updateVet } from "../Service/update-vet";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface ScheduleProps {
  vetData: Doctor;
  schedule: DaySchedule[];
  setSchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  getTotalHours: (timeSlots: TimeSlot[]) => number;
}

const Schedule: React.FC<ScheduleProps> = ({
  vetData,
  schedule,
  setSchedule,
  getTotalHours,
}) => {
  const [hasChanges, setHasChanges] = useState(false);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  let idCounter = 1;

  const initialSchedule: DaySchedule[] = Object.entries(vetData?.schedule).map(
    ([day, { start, end, available }]) => ({
      day: capitalize(day),
      enabled: available,
      timeSlots: available
        ? [
            {
              id: String(idCounter++),
              startTime: start,
              endTime: end,
            },
          ]
        : [],
    })
  );

  useEffect(() => {
    setSchedule(initialSchedule);
  }, [vetData]);

  const toggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
    if (!newSchedule[dayIndex].enabled) {
      newSchedule[dayIndex].timeSlots = [];
    }
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "10:00",
    };
    newSchedule[dayIndex].timeSlots.push(newSlot);
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots = newSchedule[dayIndex].timeSlots.filter(
      (slot) => slot.id !== slotId
    );
    setSchedule(newSchedule);
    setHasChanges(true);
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSchedule = [...schedule];
    const slotIndex = newSchedule[dayIndex].timeSlots.findIndex(
      (slot) => slot.id === slotId
    );
    if (slotIndex !== -1) {
      newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
      setSchedule(newSchedule);
      setHasChanges(true);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Weekly Schedule
            </CardTitle>
            <p className="text-emerald-100 mt-1">
              Configure your availability for each day of the week
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {schedule.map((daySchedule, dayIndex) => (
            <div key={daySchedule.day} className="group">
              <div
                className={`rounded-2xl border-2 transition-all duration-300 ${
                  daySchedule.enabled
                    ? "border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Day Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          daySchedule.enabled
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {daySchedule.day}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          {daySchedule.enabled ? (
                            <>
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                                {daySchedule.timeSlots.length} time slot
                                {daySchedule.timeSlots.length !== 1 ? "s" : ""}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                {getTotalHours(daySchedule.timeSlots)} hours
                                total
                              </Badge>
                            </>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                              Closed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={daySchedule.enabled}
                        onCheckedChange={() => toggleDay(dayIndex)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {daySchedule.enabled ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                {daySchedule.enabled && (
                  <div className="p-6">
                    <div className="space-y-4">
                      {daySchedule.timeSlots.map((slot) => (
                        <div key={slot.id} className="group/slot">
                          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-2 rounded-lg">
                              <Clock className="w-4 h-4 text-emerald-600" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      dayIndex,
                                      slot.id,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      dayIndex,
                                      slot.id,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                />
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(dayIndex, slot.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 opacity-0 group-hover/slot:opacity-100 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Add Time Slot Button */}
                      <Button
                        variant="outline"
                        onClick={() => addTimeSlot(dayIndex)}
                        className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Time Slot
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default Schedule;
