"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  Stethoscope,
  Clock,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Doctor } from "@/lib/types";
import { updateDoctorStatus } from "../../Actions/vets";
import { DoctorDetailsModal } from "./DoctorDetailsModal";
import { DoctorCard } from "./DoctorCard";
import RequireAccess from "../../Shared/RequireAccess";

export default function VetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] =
    useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);

  const getDoctors = async () => {
    try {
      const res = await fetch("/api/veterinarian");

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      setDoctorsData(data?.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);
  console.log("doctor ", doctorsData);

  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesSearch =
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || doctor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: doctorsData.length,
    active: doctorsData.filter((d) => d.status === "approved").length,
    pending: doctorsData.filter((d) => d.status === "pending").length,
    suspended: doctorsData.filter((d) => d.status === "suspended").length,
  };

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "approved" | "suspended" | "pending"
  ) => {
    const res = await updateDoctorStatus(id, newStatus);
    if (res.success) {
      getDoctors(); // refresh list
      toast.success(`Veterinarian status updated to ${newStatus} successfully`);
    } else {
      toast.error("Failed to Update Technician Status");
    }
  };

  return (
    <RequireAccess permission="Doctors">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-100">
              Doctors Management
            </h1>
            <p className="text-gray-600 dark:text-blue-100">
              Manage registered veterinarians and their profiles
            </p>
          </div>
          {/* <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="dark:bg-slate-900 dark:text-white bg-[#81d8d0] text-black hover:bg-[#63a8a1]">
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="dark:bg-slate-800 bg-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Doctors
              </CardTitle>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-600 dark:text-blue-500 font-bold">
                {stats.total}
              </div>
              <p className="text-xs dark:text-gray-300 text-muted-foreground">
                Registered Doctors
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800 bg-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Doctors
              </CardTitle>
              <Stethoscope className="h-8 w-8 dark:text-green-400 text-green-600 " />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-green-400 text-green-600">
                {stats.active}
              </div>
              <p className="text-xs dark:text-gray-300 text-muted-foreground">
                Currently practicing
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800 bg-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approval
              </CardTitle>
              <Clock className="h-8 w-8 dark:text-yellow-400 text-yellow-600 " />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-yellow-400 text-yellow-600">
                {stats.pending}
              </div>
              <p className="text-xs dark:text-gray-300 text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800 bg-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Suspend Doctors
              </CardTitle>
              <Clock className="h-8 w-8 dark:text-red-500 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-red-500 text-red-600">
                {stats.suspended}
              </div>
              <p className="text-xs dark:text-gray-300 text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="dark:bg-slate-800 bg-gray-100">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 dark:text-gray-200 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search doctors by name, email, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:placeholder:text-gray-200 dark:bg-gray-700 dark:border-slate-600"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-700 dark:border-slate-600">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm dark:text-gray-200 text-gray-600">
            Showing {filteredDoctors.length} of {filteredDoctors.length} doctors
          </p>
          {(searchTerm ||
            statusFilter !== "all" ||
            specializationFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSpecializationFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewDetails={handleViewDetails}
              handleStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card className="dark:bg-slate-800 bg-gray-200">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Doctor Details Modal */}
        <div className="">
          <DoctorDetailsModal
            doctor={selectedDoctor}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
          />
        </div>
      </div>
    </RequireAccess>
  );
}
