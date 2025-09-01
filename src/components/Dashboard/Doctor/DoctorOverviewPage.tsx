"use client";
import React, { useEffect, useState } from "react";
import WelcomeSection from "./Overview/WelcomeSection";
import StatCard from "./Overview/StatsCard";
import { Activity, Calendar, Cat, Heart } from "lucide-react";
import TodaysAppointmentList from "./Overview/TodaysAppointmentList";
import WeeklySchedule from "./Overview/WeeklySchedule";
import DoctorProfileOverview from "./Overview/DoctorProfileOverview";
import SpecialitiesAndSpecies from "./Overview/SpecialitiesAndSpecies";
import { useSession } from "next-auth/react";
import { getVetByIdDashboard } from "./Service/get-vet-by-id";
import { Appointment, Doctor } from "@/lib/types";
import { getVeterinarianAppointments } from "./Service/get-all-appointments";

interface DoctorOverviewPageProps {
  veterinarian: Doctor;
}

const DoctorOverviewPage = ({ veterinarian }: DoctorOverviewPageProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todaysAppointmentList, setTodaysAppointmentList] = useState<
    Appointment[]
  >([]);

  const isVeterinarian = true;
  const todayAppointmentsCount = 5;
  const todaySchedule = true;
  const totalAppointments = 50;

  const getSpecialtyCount = () => {
    return veterinarian?.specialities?.length;
  };
  const getSpeciesCount = () => {
    return 5;
  };

  const fetchAppointments = async () => {
    if (!session?.user?.refId) {
      return;
    }

    try {
      setIsLoading(true);

      const data = await getVeterinarianAppointments(session?.user?.refId);

      console.log("Fetched appointments:", data);

      setAppointments(data?.data);
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch appointments when veterinarian data is available
  useEffect(() => {
    if (session?.user?.refId) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.refId]);

  useEffect(() => {
    if (appointments?.length) {
      const todayDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      const todaysAppointments = appointments.filter((appointment) => {
        const apptDate = new Date(appointment?.appointmentDate)
          .toISOString()
          .split("T")[0];
        return apptDate === todayDate;
      });

      console.log("todayDate:", todayDate);
      console.log("todaysAppointments:", todaysAppointments);

      setTodaysAppointmentList(todaysAppointments);
    }
  }, [appointments]);

  console.log("appointments from overview", appointments);
  return (
    <div>
      <WelcomeSection vet={veterinarian} />
      <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Calendar size={24} className="text-white" />}
          title="Today's Appointments ***"
          value={todaysAppointmentList?.length}
          subtitle={`${todaySchedule ? "Available" : "No schedule"} today`}
          color="#0284c7" // icon bg color (text-blue-600)
          bgColor="#0e7490" // card bg color
          textColor="#fff"
        />

        <StatCard
          icon={<Heart size={24} className="text-black" />}
          title="Total Appointments"
          value={appointments?.length}
          subtitle="All time bookings"
          color="#f87171" // icon bg color (red-500)
          bgColor="#fef2f2" // card bg color (red-50)
          textColor="black"
        />

        <StatCard
          icon={<Activity size={24} className="text-white" />}
          title={isVeterinarian ? "Specialties" : "Specializations"}
          value={getSpecialtyCount()}
          subtitle="Areas of expertise"
          color="#22c55e" // icon bg color (green-500)
          bgColor="#065f46" // card bg color
          textColor="#fff"
        />

        <StatCard
          icon={<Cat size={24} className="text-white" />}
          title={isVeterinarian ? "Species Treated" : "Skills"}
          value={getSpeciesCount()}
          subtitle={
            isVeterinarian ? "Different animal types" : "Professional skills"
          }
          color="#a78bfa" // icon bg color (purple-400)
          bgColor="#7c3aed" // card bg color (purple-600)
          textColor="#fff"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TodaysAppointmentList
            todaysAppointmentList={todaysAppointmentList}
          />
          <WeeklySchedule />
        </div>

        <div className="space-y-8">
          <DoctorProfileOverview vet={veterinarian} />
          <SpecialitiesAndSpecies vet={veterinarian} />
        </div>
      </div>
    </div>
  );
};

export default DoctorOverviewPage;
