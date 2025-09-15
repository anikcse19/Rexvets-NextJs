"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { SlotStatus } from "@/lib";
import { VeterinarianStatus } from "@/lib/constants/veterinarian";
import { db } from "@/lib/firebase";
import { getWeekRange } from "@/lib/timezone";
import { Doctor } from "@/lib/types";
import {
  Clock,
  Download,
  Filter,
  Plus,
  Search,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateDoctorStatus } from "../../Actions/vets";
import RequireAccess from "../../Shared/RequireAccess";
import { DoctorCard } from "./DoctorCard";
import { DoctorDetailsModal } from "./DoctorDetailsModal";

export default function VetsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] =
    useState<string>("all");
  console.log("statusFilter", statusFilter);
  const searchParams = useSearchParams();
  const vetId = searchParams.get("vetId");
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const isFetchingRef = useRef(false);

  const getStats = async () => {
    try {
      setIsStatsLoading(true);
      const res = await fetch("/api/veterinarian/stats");

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      setStats(data?.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch statistics");
    } finally {
      setIsStatsLoading(false);
    }
  };

  const getDoctors = async () => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);
      if (specializationFilter && specializationFilter !== "all")
        params.append("specialization", specializationFilter);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      params.append("skipSlotFilter", "true"); // Skip slot filtering for admin panel
      if (vetId) params.append("vetId", vetId);

      const res = await fetch(`/api/veterinarian?${params.toString()}`);

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      // If vetId is present, filter by _id locally to ensure exact match
      const rawDoctors: Doctor[] = data?.data || [];
      const filteredByVetId = vetId
        ? rawDoctors.filter((d: any) => (d?._id || d?.id) === vetId)
        : rawDoctors;

      setDoctorsData(filteredByVetId);
      if (vetId) {
        // Override pagination for single vet view
        setPagination({
          page: 1,
          limit: 6,
          total: filteredByVetId.length,
          pages: 1,
          hasNext: false,
          hasPrev: false,
        });
      } else if (data?.pagination) {
        setPagination({
          page: data.pagination.page || 1,
          limit: data.pagination.limit || 6,
          total: data.pagination.total || 0,
          pages: data.pagination.pages || 0,
          hasNext: data.pagination.hasNext || false,
          hasPrev: data.pagination.hasPrev || false,
        });
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors data");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    getStats();
    getDoctors();
  }, []);

  // Refetch data when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    getDoctors();
  }, [debouncedSearchTerm, statusFilter, specializationFilter, vetId]);

  // Refetch data when pagination changes
  useEffect(() => {
    getDoctors();
  }, [pagination.page]);

  console.log("doctor ", doctorsData);

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: VeterinarianStatus
  ) => {
    try {
      setIsLoading(true);
      const res = await updateDoctorStatus(id, newStatus);
      if (res.success) {
        await Promise.all([getStats(), getDoctors()]); // refresh both stats and list
        toast.success(
          `Veterinarian status updated to ${newStatus} successfully`
        );
      } else {
        toast.error("Failed to Update Technician Status");
      }
    } catch (error) {
      console.error("Error updating doctor status:", error);
      toast.error("Failed to update doctor status");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while data is being fetched
  if ((isLoading && doctorsData.length === 0) || isStatsLoading) {
    return (
      <RequireAccess permission="Doctors">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Loading Doctors
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the doctors data...
            </p>
          </div>
        </div>
      </RequireAccess>
    );
  }

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
                {isStatsLoading ? <LoadingSpinner size="sm" /> : stats.total}
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
                {isStatsLoading ? <LoadingSpinner size="sm" /> : stats.active}
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
                {isStatsLoading ? <LoadingSpinner size="sm" /> : stats.pending}
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
                {isStatsLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  stats.suspended
                )}
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
                  <SelectItem value={VeterinarianStatus.APPROVED}>
                    Approved
                  </SelectItem>
                  <SelectItem value={VeterinarianStatus.PENDING}>
                    Pending
                  </SelectItem>
                  <SelectItem value={VeterinarianStatus.SUSPENDED}>
                    Suspended
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm dark:text-gray-200 text-gray-600">
            Showing {doctorsData.length} of {pagination.total || 0} doctors
            {(pagination.pages || 0) > 1 &&
              ` (Page ${pagination.page || 1} of ${pagination.pages || 0})`}
          </p>
          <div className="flex items-center gap-2">
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
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                Clear Filters
              </Button>
            )}
            {(vetId || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Reset local filters
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSpecializationFilter("all");
                  setPagination((prev) => ({ ...prev, page: 1 }));

                  // Clear URL params
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("vetId");
                  params.delete("search");
                  params.delete("status");
                  params.delete("specialization");
                  params.delete("page");
                  params.delete("limit");
                  const query = params.toString();
                  router.replace(query ? `${pathname}?${query}` : pathname);
                }}
                className="text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                Clear link & filters
              </Button>
            )}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && doctorsData.length > 0 ? (
            <div className="col-span-full flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            doctorsData.map((doctor, index) => (
              <DoctorCard
                key={index}
                doctor={doctor}
                onViewDetails={handleViewDetails}
                handleStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>

        {!isLoading && doctorsData.length === 0 && (
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

        {/* Pagination Controls */}
        {(pagination.pages || 0) > 1 && (
          <div className="flex items-center justify-center space-x-1 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: (prev.page || 1) - 1,
                }))
              }
              disabled={!pagination.hasPrev || isLoading}
              className="px-3"
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {(() => {
                const currentPage = pagination.page || 1;
                const totalPages = pagination.pages || 0;
                const pages = [];

                // Always show first page
                pages.push(
                  <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: 1 }))
                    }
                    disabled={isLoading}
                    className="w-10 h-10"
                  >
                    1
                  </Button>
                );

                // Show ellipsis if current page is far from start
                if (currentPage > 4) {
                  pages.push(
                    <span key="ellipsis-start" className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                // Show pages around current page
                const startPage = Math.max(2, currentPage - 1);
                const endPage = Math.min(totalPages - 1, currentPage + 1);

                for (let i = startPage; i <= endPage; i++) {
                  if (i !== 1 && i !== totalPages) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page: i }))
                        }
                        disabled={isLoading}
                        className="w-10 h-10"
                      >
                        {i}
                      </Button>
                    );
                  }
                }

                // Show ellipsis if current page is far from end
                if (currentPage < totalPages - 3) {
                  pages.push(
                    <span key="ellipsis-end" className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                // Always show last page (if more than 1 page)
                if (totalPages > 1) {
                  pages.push(
                    <Button
                      key={totalPages}
                      variant={
                        currentPage === totalPages ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: totalPages }))
                      }
                      disabled={isLoading}
                      className="w-10 h-10"
                    >
                      {totalPages}
                    </Button>
                  );
                }

                return pages;
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: (prev.page || 1) + 1,
                }))
              }
              disabled={!pagination.hasNext || isLoading}
              className="px-3"
            >
              Next
            </Button>
          </div>
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
