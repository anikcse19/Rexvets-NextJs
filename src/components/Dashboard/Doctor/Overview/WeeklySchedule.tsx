"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlotStatus } from "@/lib";
import { getUserTimezone, getWeekRange } from "@/lib/timezone";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

const WeeklySchedule = () => {
  const { data: session } = useSession();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [daysData, setDaysData] = useState<any[]>([]);
  const refId = session?.user?.refId;

  const getSlots = useCallback(
    async (startDate: string, endDate: string, refId: string) => {
      if (!refId) {
        return;
      }
      try {
        setLoading(true);
        const apiUrl = `/api/appointments/slots/slot-summary/${refId}?startDate=${startDate}&endDate=${endDate}&status=${SlotStatus.ALL}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
        }
        const responseData = await res.json();
        const periods = responseData?.data?.periods || [];
        setSlots(periods);

        const userTz = getUserTimezone();

        // 1) Transform API groups → day aggregates
        const transformed = periods.map((group: any) => {
          const periodsArr = Array.isArray(group?.periods) ? group.periods : [];
          const allSlots = periodsArr.flatMap((p: any) => p?.slots || []);

          const counts = allSlots.reduce(
            (acc: any, s: any) => {
              if (s?.status === "available" || s?.status === SlotStatus.AVAILABLE) acc.available += 1;
              else if (s?.status === "booked" || s?.status === SlotStatus.BOOKED) acc.booked += 1;
              else if (s?.status === "disabled" || s?.status === SlotStatus.DISABLED) acc.disabled += 1;
              return acc;
            },
            { available: 0, booked: 0, disabled: 0 }
          );

          const totalHours = periodsArr.reduce(
            (sum: number, p: any) => sum + (typeof p?.totalHours === "number" ? p.totalHours : 0),
            0
          );

          const dateObj = new Date(group?.date?.start || group?.date);
          const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: userTz }).format(dateObj); // Mon
          const dateLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: userTz }).format(dateObj); // Sep 15

          const windows: string[] = periodsArr.map((p: any) => {
            const start = p?.formattedStartTime || p?.startTime;
            const end = p?.formattedEndTime || p?.endTime;
            return `${start} - ${end}`;
          });

          const totals = counts.available + counts.booked + counts.disabled;

          return {
            key: `${dayLabel}-${dateLabel}`,
            day: dayLabel,
            date: dateLabel,
            available: counts.available,
            booked: counts.booked,
            disabled: counts.disabled,
            totalSlots: totals,
            hours: Number(totalHours.toFixed(2)),
            windows,
          };
        });

        // 2) Build 7 days from today (inclusive) → ensure exactly 7 tiles
        const base: any[] = [];
        const now = new Date();
        for (let i = 0; i < 7; i++) {
          const d = new Date(now);
          d.setDate(now.getDate() + i);
          const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: userTz }).format(d);
          const dateLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: userTz }).format(d);
          base.push({
            key: `${dayLabel}-${dateLabel}`,
            day: dayLabel,
            date: dateLabel,
            available: 0,
            booked: 0,
            disabled: 0,
            totalSlots: 0,
            hours: 0,
            windows: [],
          });
        }

        // 3) Merge transformed into base by key
        const map = new Map(transformed.map((t: any) => [t.key, t]));
        const normalized = base.map((b) => ({ ...b, ...(map.get(b.key) || {}) }));

        setDaysData(normalized);
      } catch (error) {
        console.error("Error in getAvailableSlots:", error);
      } finally {
        setLoading(false);
      }
    },
    [refId]
  );

  useEffect(() => {
    if (refId) {
      // Always fetch 7 days starting today
      const weeklyRange = getWeekRange();
      const startDate = format(new Date(weeklyRange.start), "yyyy-MM-dd");
      const endDate = format(new Date(weeklyRange.end), "yyyy-MM-dd");
      getSlots(startDate, endDate, refId);
    }
  }, [getSlots]);

  const getUtilization = (booked: number, total: number) => {
    if (!total) return 0;
    return Math.round((booked / total) * 100);
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading weekly schedule...</p>
              </div>
            </div>
          ) : daysData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-purple-100 rounded-full p-4 mb-4">
                <Clock className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">No Slots Found</h2>
              <p className="mt-2 text-gray-500 max-w-md">Adjust your availability to allow bookings.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {daysData.map((d, idx) => {
                const utilization = getUtilization(d.booked, d.totalSlots);
                const total = Math.max(d.totalSlots, 1);
                const availablePct = Math.round((d.available / total) * 100);
                const bookedPct = Math.round((d.booked / total) * 100);
                const disabledPct = Math.max(0, 100 - availablePct - bookedPct);

                return (
                  <motion.div
                    key={d.key}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:border-purple-200 hover:shadow-md transition-colors"
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-gray-900">{d.day}</h4>
                        <p className="text-xs text-gray-500">{d.date}</p>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {d.hours} hrs
                      </Badge>
                    </div>

                    {/* Stacked utilization bar */}
                    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden mb-3">
                      <motion.div className="h-full bg-green-500 inline-block" style={{ width: `${availablePct}%` }} layoutId={`avail-${idx}`} />
                      <motion.div className="h-full bg-blue-500 inline-block" style={{ width: `${bookedPct}%` }} layoutId={`booked-${idx}`} />
                      <motion.div className="h-full bg-amber-500 inline-block" style={{ width: `${disabledPct}%` }} layoutId={`disabled-${idx}`} />
                    </div>

                    {/* Legend with counts */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-gray-700">Available</span>
                        <Badge variant="outline" className="text-[10px] border-green-200 text-green-700">
                          {d.available}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-700">Booked</span>
                        <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700">
                          {d.booked}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-gray-700">Disabled</span>
                        <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700">
                          {d.disabled}
                        </Badge>
                      </div>
                    </div>

                    {/* Windows (periods) */}
                    {Array.isArray(d.windows) && d.windows.length > 0 && (
                      <motion.div className="flex flex-wrap gap-2" initial={false}>
                        {d.windows.map((w: string, idx2: number) => (
                          <motion.span
                            key={idx2}
                            className="px-2 py-1 rounded-md bg-white border text-xs text-gray-700"
                            whileHover={{ scale: 1.03 }}
                          >
                            {w}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}

                    {/* Footer stats */}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>Total slots: {d.totalSlots}</span>
                      <motion.span className="font-medium text-purple-700" initial={false} animate={{ opacity: 1 }}>
                        Utilization: {utilization}%
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySchedule;
