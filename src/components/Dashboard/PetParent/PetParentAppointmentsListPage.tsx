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
import { Skeleton } from "@/components/ui/skeleton";

type AppointmentCategory = "upcoming" | "past";

function AppointmentCardSkeleton() {
  return (
    <Card className="p-4 space-y-4">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </Card>
  );
}

export default function PetParentAppointmentsListPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [appointmentsData, setAppointmentsData] = useState<
    Record<AppointmentCategory, Appointment[]>
  >({
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  const parentId = session?.user?.refId as string;

  console.log("parentId ---------- in appointments list page", parentId);

  const fetchAppointments = async () => {
    if (!parentId) return;
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
      const customDate = appointment.appointmentDate.split("T")[0];

      console.log("filterDate", filterDate);
      console.log("date", customDate);

      const matchesDate = filterDate ? customDate === filterDate : true;

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
            Manage your appointments.
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
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              setFilterDate(value);
            } else {
              setFilterDate("");
            }
          }}
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
            className="flex items-center gap-2 cursor-pointer bg-blue-100"
          >
            Upcoming
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 text-xs"
            >
              {appointmentsData.upcoming.length}
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
              {appointmentsData.past.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {Object.entries(appointmentsData).map(([tabKey, appointments]) => {
          const filtered = filterAppointments(appointments);

          return (
            <TabsContent key={tabKey} value={tabKey} className="mt-6">
              <div className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:items-stretch">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-full max-w-[320px] sm:min-w-[280px]">
                      <AppointmentCardSkeleton />
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                  <Card className="p-8 text-center w-full max-w-[320px] sm:col-span-full">
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
