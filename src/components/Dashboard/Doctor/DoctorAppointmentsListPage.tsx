"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import AppointmentCard from "./Appointments/AppointmentCard";
import { Appointment } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { appointmentsService, TransformedAppointment } from "./Service/appointments.service";
import { useVeterinarian } from "@/hooks/useVeterinarian";
import { Alert, AlertDescription } from "@/components/ui/alert";



export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [appointments, setAppointments] = useState<Record<string, TransformedAppointment[]>>({
    upcoming: [],
    past: [],
    actionNeeded: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { veterinarian, isLoading: isVetLoading, error: vetError } = useVeterinarian();

  // Fetch appointments function
  const fetchAppointments = async () => {
    if (!veterinarian?.refId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const categorizedAppointments = await appointmentsService.getVeterinarianAppointmentsByCategory(
        veterinarian.refId
      );
      
      setAppointments(categorizedAppointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch appointments when veterinarian data is available
  useEffect(() => {
    if (veterinarian?.refId) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [veterinarian?.refId]);

  // Function to filter appointments based on search and date
  const filterAppointments = (appointmentList: TransformedAppointment[]) => {
    return appointmentList.filter((appointment) => {
      const matchesSearch =
        appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = filterDate
        ? appointment.appointmentDate === filterDate
        : true;

      return matchesSearch && matchesDate;
    });
  };

  // Show loading state while fetching veterinarian data or appointments
  if (isVetLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (vetError || error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {vetError || error || "Failed to load appointments"}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    );
  }

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
        <Button
          onClick={fetchAppointments}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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

      {/* Show message if no appointments at all */}
      {appointments.upcoming.length === 0 && 
       appointments.past.length === 0 && 
       appointments.actionNeeded.length === 0 && 
       !isLoading && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No appointments yet</h3>
              <p className="text-gray-600 mt-2">
                You don't have any appointments scheduled. Appointments will appear here once patients book with you.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      {(appointments.upcoming.length > 0 || appointments.past.length > 0 || appointments.actionNeeded.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger
            value="upcoming"
            className="flex items-center gap-2 cursor-pointer"
          >
            Upcoming
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 text-xs"
            >
              {appointments.upcoming.length}
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
              {appointments.past.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="actionNeeded"
            className="flex items-center gap-2 cursor-pointer"
          >
            Action Needed
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-700 text-xs"
            >
              {appointments.actionNeeded.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {Object.entries(appointments).map(([tabKey, appointmentList]) => {
          const filtered = filterAppointments(appointmentList);

          return (
            <TabsContent key={tabKey} value={tabKey} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.length === 0 ? (
                  <div className="col-span-full">
                    <Card className="p-8 text-center">
                      <p className="text-gray-500">
                        No appointments found in this category.
                      </p>
                      {(searchTerm || filterDate) && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search or date filter.
                        </p>
                      )}
                    </Card>
                  </div>
                ) : (
                  filtered.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment as unknown as Appointment}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
        </Tabs>
      )}
    </div>
  );
}
