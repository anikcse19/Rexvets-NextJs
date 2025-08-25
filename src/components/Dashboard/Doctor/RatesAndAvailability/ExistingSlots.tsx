"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ExistsingAvailability, SlotPeriod } from "@/lib/types";

interface ExistingAvailabilityProps {
  availabilities: ExistsingAvailability[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Mock data for demonstration
const mockAvailabilities: ExistsingAvailability[] = [];

export default function ExistingAvailability({
  availabilities = mockAvailabilities,
  onEdit,
  onDelete,
}: ExistingAvailabilityProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const formatTimeRange = (slot: SlotPeriod) => {
    return `${format(slot.start, "h:mm a")} - ${format(slot.end, "h:mm a")}`;
  };

  const getTotalHours = (slots: SlotPeriod[]) => {
    return slots.reduce((total, slot) => {
      const hours =
        (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  };

  if (availabilities.length === 0) {
    return (
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            Existing Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              No availability created yet
            </p>
            <p className="text-gray-500 max-w-sm mx-auto">
              Create your first availability slot using the calendar above to
              get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            Existing Availability
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 border-green-200"
          >
            {availabilities.length} date{availabilities.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {availabilities.map((availability) => {
              const isExpanded = expandedIds.has(availability.id);
              const totalHours = getTotalHours(availability.slots);
              const dateRange = availability.dateRange;
              const dayCount = dateRange
                ? differenceInDays(dateRange.end, dateRange.start) + 1
                : 1;

              return (
                <Collapsible key={availability.id}>
                  <div className="border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-200">
                    <CollapsibleTrigger
                      className="w-full p-4 text-left"
                      onClick={() => toggleExpanded(availability.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {dateRange
                                ? `${format(
                                    dateRange.start,
                                    "MMM dd"
                                  )} - ${format(dateRange.end, "MMM dd, yyyy")}`
                                : format(
                                    availability.date,
                                    "EEEE, MMMM dd, yyyy"
                                  )}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {availability.slots.length} slot
                              {availability.slots.length > 1 ? "s" : ""}
                            </Badge>
                            {dateRange && dayCount > 1 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                              >
                                {dayCount} days
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {totalHours.toFixed(1)} hours total
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(availability.id);
                            }}
                            className="h-9 w-9 p-0 hover:bg-blue-50 hover:border-blue-200"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(availability.id);
                            }}
                            className="h-9 w-9 p-0 hover:bg-red-50 hover:border-red-200"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="pt-4 space-y-3">
                          {availability.slots.map((slot, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gray-100 text-gray-700"
                                >
                                  Slot {index + 1}
                                </Badge>
                                <span className="font-medium text-sm text-gray-800">
                                  {formatTimeRange(slot)}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {(
                                  (slot.end.getTime() - slot.start.getTime()) /
                                  (1000 * 60 * 60)
                                ).toFixed(1)}
                                h
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
