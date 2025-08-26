"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Appointment } from "@/lib/types";
import { Input } from "@/components/ui/input";
import AppointmentCard from "./Appointments/AppointmentCard";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getParentAppointments } from "./Service/get-all-appointments";

type AppointmentCategory = "upcoming" | "past";

export default function PetParentAppointmentsListPage() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [appointmentsData, setAppointmentsData] = useState<
    Record<AppointmentCategory, Appointment[]>
  >({
    upcoming: [],
    past: [],
  });
  const { data: session } = useSession();

  const parentId = session?.user?.refId as string;

  const fetchAppointments = async () => {
    if (!parentId) return;
    try {
      const data = await getParentAppointments(parentId);

      console.log("Fetched appointments:", data);

      const now = new Date();
      const grouped = {
        upcoming: data?.data?.filter(
          (a: Appointment) =>
            new Date(a.appointmentDate) >= now && a.status !== "completed"
        ),
        past: data?.data?.filter(
          (a: Appointment) =>
            new Date(a.appointmentDate) < now || a.status === "completed"
        ),
      };

      setAppointmentsData(grouped);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  // Function to filter appointments based on search and date
  const filterAppointments = (appointments: Appointment[]) => {
    console.log("appointments", appointments);
    return appointments.filter((appointment) => {
      const matchesSearch = appointment.pet.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // ||
      // appointment.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = filterDate
        ? appointment.appointmentDate === filterDate
        : true;

      return matchesSearch && matchesDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Appointments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your clinic appointments and schedule.
          </p>
        </div>
      </div>

      {/* Search and Date Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by pet name or owner name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="sm:w-48"
        />
        {filterDate || searchTerm ? (
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
            }}
          >
            Clear Filters
          </Button>
        ) : null}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger
            value="upcoming"
            className="flex items-center gap-2 cursor-pointer"
          >
            Upcoming
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 text-xs"
            >
              {/* {mockAppointments.upcoming.length} */}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="flex items-center gap-2 cursor-pointer"
          >
            Past
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 text-xs"
            >
              {/* {mockAppointments.past.length} */}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {Object.entries(appointmentsData).map(([tabKey, appointments]) => {
          const filtered = filterAppointments(appointments);

          return (
            <TabsContent key={tabKey} value={tabKey} className="mt-6">
              <div className="grid grid-cols-3 gap-4">
                {filtered.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">
                      No appointments found in this category.
                    </p>
                  </Card>
                ) : (
                  filtered.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
