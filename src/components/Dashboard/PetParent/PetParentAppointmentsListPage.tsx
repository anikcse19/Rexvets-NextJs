"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
} from "lucide-react";
import { Appointment } from "@/lib/types";
import { Input } from "@/components/ui/input";
import AppointmentCard from "./Appointments/AppointmentCard";

const mockAppointments: Record<string, Appointment[]> = {
  upcoming: [
    {
      id: "1",
      petName: "Max",
      petImage:
        "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      petType: "Golden Retriever",
      parentName: "Sarah Johnson",
      parentImage:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      appointmentDate: "2025-01-15",
      appointmentTime: "10:30 AM",
      timezone: "GMT+6",
      status: "confirmed",
      bookingTime: "2025-01-10 2:15 PM",
      seenBefore: true,
      service: "Routine Checkup",
    },
    {
      id: "2",
      petName: "Bella",
      petImage:
        "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      petType: "Persian Cat",
      parentName: "Mike Chen",
      parentImage:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      appointmentDate: "2025-01-15",
      appointmentTime: "2:00 PM",
      timezone: "GMT+6",
      status: "pending",
      bookingTime: "2025-01-12 9:30 AM",
      seenBefore: false,
      service: "Vaccination",
    },
    {
      id: "3",
      petName: "Charlie",
      petImage:
        "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      petType: "Beagle",
      parentName: "Emma Davis",
      parentImage:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      appointmentDate: "2025-01-16",
      appointmentTime: "11:15 AM",
      timezone: "GMT+6",
      status: "confirmed",
      bookingTime: "2025-01-11 4:45 PM",
      seenBefore: true,
      service: "Dental Cleaning",
    },
    {
      id: "4",
      petName: "Luna",
      petImage:
        "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      petType: "Siamese Cat",
      parentName: "James Wilson",
      parentImage:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      appointmentDate: "2025-01-17",
      appointmentTime: "3:30 PM",
      timezone: "GMT+6",
      status: "confirmed",
      bookingTime: "2025-01-08 11:20 AM",
      seenBefore: false,
      service: "Surgery Consultation",
    },
  ],
  past: [
    {
      id: "5",
      petName: "Rocky",
      petImage:
        "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      petType: "German Shepherd",
      parentName: "Lisa Brown",
      parentImage:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      appointmentDate: "2025-01-10",
      appointmentTime: "9:00 AM",
      timezone: "GMT+6",
      status: "completed",
      bookingTime: "2025-01-05 3:30 PM",
      seenBefore: true,
      service: "Emergency Check",
      // notes: "Minor injury treated successfully",
    },
    {
      id: "6",
      petName: "Milo",
      petImage:
        "https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      petType: "Tabby Cat",
      parentName: "David Kim",
      parentImage:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      appointmentDate: "2025-01-08",
      appointmentTime: "1:45 PM",
      timezone: "GMT+6",
      status: "completed",
      bookingTime: "2025-01-03 10:15 AM",
      seenBefore: false,
      service: "Health Checkup",
    },
    {
      id: "7",
      petName: "Buddy",
      petImage:
        "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      petType: "Labrador",
      parentName: "Anna Martinez",
      parentImage:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      appointmentDate: "2025-01-05",
      appointmentTime: "4:20 PM",
      timezone: "GMT+6",
      status: "no-show",
      bookingTime: "2024-12-30 2:10 PM",
      seenBefore: true,
      service: "Vaccination",
    },
  ],
};

export default function PetParentAppointmentsListPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Function to filter appointments based on search and date
  const filterAppointments = (appointments: Appointment[]) => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.parentName.toLowerCase().includes(searchTerm.toLowerCase());

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
              {mockAppointments.upcoming.length}
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
              {mockAppointments.past.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        {Object.entries(mockAppointments).map(([tabKey, appointments]) => {
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
                      key={appointment.id}
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
