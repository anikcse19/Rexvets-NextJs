"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment, Pet, PetParent } from "@/lib/types";
import {
  Calendar,
  Clock,
  FileText,
  Filter,
  Heart,
  MapPin,
  MoreHorizontal,
  Palette,
  PawPrint,
  Phone,
  Scale,
  Search,
  Stethoscope,
  Trash2,
  User,
  Users,
} from "lucide-react";
import moment from "moment-timezone";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteParent, updateParentStatus } from "../../Actions/pet-parents";
import RequireAccess from "../../Shared/RequireAccess";

type DateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "last90days";

export default function PetParentsPage() {
  const [parents, setParents] = useState<PetParent[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    inactive: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAppointmentsLoading, setIsAppointmentLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const fetchIdRef = useRef(0);

  // Search states

  const isDateInRange = (date: string | Date, filter: DateFilter): boolean => {
    const d = new Date(date); // convert input to Date
    if (filter === "all") return true;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // start of today
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // start of yesterday
    const last7days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last90days = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case "today":
        // d is after start of today and before tomorrow
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return d >= today && d < tomorrow;
      case "yesterday":
        return d >= yesterday && d < today;
      case "last7days":
        return d >= last7days;
      case "last30days":
        return d >= last30days;
      case "last90days":
        return d >= last90days;
      default:
        return true;
    }
  };

  const fetchPetParents = async () => {
    setLoading(true);
    const fetchId = ++fetchIdRef.current;
    try {
      // Build query params for server-side filtering & pagination
      const params = new URLSearchParams();
      params.append("page", String(pagination.page));
      params.append("limit", String(pagination.limit));
      if (searchTerm) {
        params.append("name", searchTerm); // backward compatibility
        params.append("search", searchTerm); // broader search (name/email/phone)
      }
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);

      // Date filter using browser timezone via moment-timezone
      if (dateFilter !== "all") {
        const tz = moment.tz.guess();
        const nowTz = moment.tz(tz);
        let start: moment.Moment | null = null;
        let end: moment.Moment | null = null;
        if (dateFilter === "today") {
          start = nowTz.clone().startOf("day");
          end = nowTz.clone().endOf("day");
        } else if (dateFilter === "yesterday") {
          start = nowTz.clone().subtract(1, "day").startOf("day");
          end = nowTz.clone().subtract(1, "day").endOf("day");
        } else if (dateFilter === "last7days") {
          start = nowTz.clone().subtract(7, "day").startOf("day");
          end = nowTz.clone().endOf("day");
        } else if (dateFilter === "last30days") {
          start = nowTz.clone().subtract(30, "day").startOf("day");
          end = nowTz.clone().endOf("day");
        } else if (dateFilter === "last90days") {
          start = nowTz.clone().subtract(90, "day").startOf("day");
          end = nowTz.clone().endOf("day");
        }
        if (start && end) {
          params.append("startDate", start.toDate().toISOString());
          params.append("endDate", end.toDate().toISOString());
        }
      }

      const res = await fetch(`/api/pet-parents?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        // Guard against race conditions: ignore stale responses
        if (fetchId !== fetchIdRef.current) return;
        setParents(data.data);
        const total = data.total || 0;
        const pages =
          data.totalPages || Math.ceil(total / pagination.limit) || 0;
        setPagination((prev) => ({
          ...prev,
          total,
          pages,
          hasPrev: (prev.page || 1) > 1,
          hasNext: pages > (prev.page || 1),
        }));
        // If requested page has no results but there are pages, fallback to page 1
        if (
          (data.data?.length ?? 0) === 0 &&
          ((prev) => prev)(pagination).page > 1 &&
          pages > 0
        ) {
          setPagination((prev) => ({ ...prev, page: 1 }));
        }
        console.log("pet parents", data?.data);
        setHasFetched(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/pet-parents/stats`);
      const data = await res.json();
      if (data?.success && data?.data) {
        setStats({
          total: data.data.total ?? 0,
          active: data.data.active ?? 0,
          inactive: data.data.inactive ?? 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch pet parent stats", error);
    }
  };

  useEffect(() => {
    fetchPetParents();
    fetchStats();
  }, []);

  // Refetch when filters change; reset to page 1
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchPetParents();
  }, [searchTerm, statusFilter, dateFilter]);

  // Refetch when page changes
  useEffect(() => {
    fetchPetParents();
  }, [pagination.page]);

  const openAppointments = async (parent: any) => {
    setAppointments(parent?.appointments);
    setIsAppointmentLoading(false);
  };

  const openPets = async (parent: any) => {
    setPets(parent?.pets);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "active" | "inactive"
  ) => {
    const actionStatus = newStatus === "active" ? "activate" : "deactivate";
    const res = await updateParentStatus(id, actionStatus);
    if (res.success) {
      setParents((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, Status: newStatus } : doc
        )
      );
      toast.success(`Parent Status Updated to ${newStatus} Successfully`);
      fetchPetParents();
      fetchStats();
    } else {
      toast.error("Failed to Update Parent Status");
    }
  };

  const handleDeleteParent = async () => {
    if (!parentToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteParent(parentToDelete._id);

      if (!result.success) {
        throw new Error();
      }

      // Update local state
      setParents((prev) =>
        prev.filter((parent) => parent._id !== parentToDelete._id)
      );

      toast.success(`Parent "${parentToDelete.name}" deleted successfully`);
      setDeleteModalOpen(false);
      setParentToDelete(null);
      fetchStats();
    } catch (error) {
      console.error("Error deleting parent:", error);
      toast.error("Failed to delete parent. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const statusCounts = stats ?? {
    total: parents.length,
    active: 0,
    inactive: 0,
  };

  // console.log("pagination", pagination);

  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);

    // Day with ordinal (1st, 2nd, 3rd, 4th, etc.)
    const day = date.getDate();
    const ordinal =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Time
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // convert 0 → 12

    return `${day}${ordinal} ${month}, ${year} at ${formattedHours}.${minutes} ${ampm}`;
  }

  // Animated loader during initial fetch
  // if (loading && parents.length === 0) {
  //   return (
  //     <RequireAccess permission="Pet Parents">
  //       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
  //         <LoadingSpinner size="lg" />
  //         <div className="text-center">
  //           <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
  //             Loading Pet Parents
  //           </h3>
  //           <p className="text-sm text-gray-500 dark:text-gray-400">
  //             Please wait while we fetch the pet parents data...
  //           </p>
  //         </div>
  //       </div>
  //     </RequireAccess>
  //   );
  // }

  // Derived UI states for clear rendering logic
  const isInitialLoading = !hasFetched || (loading && parents.length === 0);
  const isEmptyAfterFetch =
    hasFetched &&
    !loading &&
    parents.length === 0 &&
    (pagination.total || 0) === 0;
  const isTableLoading = loading && parents.length > 0;

  return (
    <RequireAccess permission="Pet Parents">
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-8">
              <div
                style={{
                  background: "linear-gradient(to right,#002366,#1a8693)",
                }}
                className="p-3 rounded-xl shadow-lg"
              >
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#002366] to-[#1a8693] bg-clip-text text-transparent">
                  Pet Parents Directory
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">
                  Manage and view all registered pet parents
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Total Parents
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {statusCounts.total}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border border-green-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Active Parents
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {statusCounts.active}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border border-red-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Inactive Parents
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {statusCounts.inactive}
                      </p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Filtered Results
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {pagination.total}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <Select
                value={dateFilter}
                onValueChange={(value: DateFilter) => setDateFilter(value)}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("all");
                  setStatusFilter("all");
                }}
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {isInitialLoading ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner size="lg" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Loading pet parents...
                </span>
              </div>
            </div>
          ) : isEmptyAfterFetch ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No parents found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <Card className="bg-white dark:bg-slate-800 shadow-lg border-0">
              <CardContent className="p-0 relative">
                {isTableLoading && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <LoadingSpinner size="lg" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Loading pet parents...
                      </span>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Parent Info
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Contact
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Location
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Joined Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parents.map((parent) => (
                        <TableRow
                          key={parent._id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-600"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-r from-[#002366] to-[#1a8693] rounded-lg">
                                {parent?.profileImage ? (
                                  <Image
                                    src={
                                      parent.profileImage || "/placeholder.svg"
                                    }
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                ) : (
                                  <User className="w-8 h-8 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {parent.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {parent.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {parent.phoneNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {parent.state}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-gray-700 dark:text-gray-300">
                              {formatDateTime(parent?.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={
                                  (parent?.status || "active") === "active"
                                }
                                onCheckedChange={(checked) =>
                                  handleStatusChange(
                                    parent._id,
                                    checked ? "active" : "inactive"
                                  )
                                }
                              />
                              <Badge
                                variant={
                                  (parent?.status || "active") === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  (parent?.status || "active") === "active"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                                }
                              >
                                {(parent?.status || "active") === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      onClick={() => {
                                        setIsAppointmentLoading(true);
                                        setAppointments([]);
                                        setSelectedParent(parent);
                                        openAppointments(parent);
                                      }}
                                    >
                                      <Calendar className="w-4 h-4 mr-2" />
                                      View Appointments
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent className="md:max-w-5xl sm:max-w-xl max-w-xs max-h-[80vh] overflow-hidden dark:bg-slate-800">
                                    <DialogHeader
                                      style={{
                                        background:
                                          "linear-gradient(to right,#002366,#1a8693)",
                                      }}
                                      className="text-white -m-6 p-6 mb-4"
                                    >
                                      <DialogTitle className="flex items-center gap-3 text-xl">
                                        <Calendar className="w-6 h-6" />
                                        Appointments for {selectedParent?.Name}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="overflow-y-auto max-h-[calc(80vh-120px)] pr-2">
                                      {isAppointmentsLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                          <span className="ml-3 text-gray-600 dark:text-gray-300">
                                            Loading appointments...
                                          </span>
                                        </div>
                                      ) : appointments?.length <= 0 ? (
                                        <div className="text-center py-12">
                                          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            No Appointments Found
                                          </h3>
                                          <p className="text-gray-500 dark:text-gray-400">
                                            This parent has not scheduled any
                                            appointments yet.
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="space-y-4">
                                          {appointments.map((appt, i) => (
                                            <div
                                              key={i}
                                              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 border border-blue-200 dark:border-slate-500 p-6 rounded-xl shadow-sm"
                                            >
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                  <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-blue-500" />
                                                    <div>
                                                      <p className="font-semibold text-gray-800 dark:text-white">
                                                        {appt.appointmentDate}
                                                      </p>
                                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        Appointment Date
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-purple-500" />
                                                    <div>
                                                      <p className="font-semibold text-gray-800 dark:text-white">
                                                        {appt.appointmentDate}
                                                      </p>
                                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        Scheduled Time
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="space-y-3">
                                                  <div className="flex items-center gap-3">
                                                    <Stethoscope className="w-5 h-5 text-green-500" />
                                                    <div>
                                                      <p className="font-semibold text-gray-800 dark:text-white">
                                                        {
                                                          appt?.veterinarian
                                                            ?.degree
                                                        }
                                                      </p>
                                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        Doctor Type
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-start gap-3">
                                                    <Heart className="w-5 h-5 text-red-500 mt-1" />
                                                    <div>
                                                      <p className="font-semibold text-gray-800 dark:text-white">
                                                        {appt?.concerns?.join(
                                                          ", "
                                                        )}
                                                      </p>
                                                      <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        Pet Concerns
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              {appt?.notes && (
                                                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-slate-500">
                                                  <div className="flex items-start gap-3">
                                                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                                                    <div>
                                                      <p className="font-semibold text-gray-800 dark:text-white mb-1">
                                                        Additional Details
                                                      </p>
                                                      <p className="text-gray-700 dark:text-gray-300">
                                                        {appt?.notes}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      onClick={() => {
                                        setSelectedParent(parent);
                                        openPets(parent);
                                      }}
                                    >
                                      <PawPrint className="w-4 h-4 mr-2" />
                                      View Pets
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent className="md:max-w-5xl sm:max-w-xl max-w-xs max-h-[80vh] overflow-hidden dark:bg-slate-800">
                                    <DialogHeader
                                      style={{
                                        background:
                                          "linear-gradient(to right,#002366,#1a8693)",
                                      }}
                                      className="text-white -m-6 p-6 mb-4"
                                    >
                                      <DialogTitle className="flex items-center gap-3 text-xl">
                                        <PawPrint className="w-6 h-6" />
                                        Pets of {selectedParent?.name}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="overflow-y-auto max-h-[calc(80vh-120px)] pr-2">
                                      {pets.length === 0 ? (
                                        <div className="text-center py-12">
                                          <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            No Pets Found
                                          </h3>
                                          <p className="text-gray-500 dark:text-gray-400">
                                            This parent has not registered any
                                            pets yet.
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                          {pets.map((pet, i) => (
                                            <div
                                              key={i}
                                              className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                            >
                                              <div className="relative">
                                                {pet?.image ? (
                                                  <Image
                                                    src={
                                                      pet.image ||
                                                      "/placeholder.svg"
                                                    }
                                                    alt="Pet"
                                                    width={300}
                                                    height={200}
                                                    className="w-full h-48 object-cover"
                                                  />
                                                ) : (
                                                  <Image
                                                    src="/image/petImage.png"
                                                    alt="Pet"
                                                    width={300}
                                                    height={200}
                                                    className="w-full h-48 object-cover"
                                                  />
                                                )}
                                                <div className="absolute top-3 right-3">
                                                  <Badge className="bg-white/90 dark:bg-slate-600 text-gray-700 dark:text-white border-0">
                                                    {pet.gender}
                                                  </Badge>
                                                </div>
                                              </div>
                                              <div className="p-4">
                                                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3">
                                                  {pet.name}
                                                </h3>
                                                <div className="space-y-2">
                                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <PawPrint className="w-4 h-4 text-purple-500" />
                                                    <span className="text-sm">
                                                      {pet.breed}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Palette className="w-4 h-4 text-pink-500" />
                                                    <span className="text-sm">
                                                      {pet.primaryColor}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Scale className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm">
                                                      {pet.weight}{" "}
                                                      {pet.weightUnit}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setParentToDelete(parent);
                                    setDeleteModalOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Parent
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="sm:max-w-md dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                Delete Parent
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {parentToDelete?.Name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Warning:</strong> This will permanently delete the
                  parent record and all associated data including appointments
                  and pets.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setParentToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteParent}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Parent
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Server-side Pagination Controls */}
        {(pagination.pages || 0) > 1 && (
          <div className="flex items-center justify-center space-x-1 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, (prev.page || 1) - 1),
                }))
              }
              disabled={!pagination.hasPrev || loading}
              className="px-3"
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {(() => {
                const currentPage = pagination.page || 1;
                const totalPages = pagination.pages || 0;
                const pages: React.ReactNode[] = [];

                // First page
                pages.push(
                  <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: 1 }))
                    }
                    disabled={loading}
                    className="w-10 h-10"
                  >
                    1
                  </Button>
                );

                if (currentPage > 4) {
                  pages.push(
                    <span key="ellipsis-start" className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

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
                        disabled={loading}
                        className="w-10 h-10"
                      >
                        {i}
                      </Button>
                    );
                  }
                }

                if (currentPage < totalPages - 3) {
                  pages.push(
                    <span key="ellipsis-end" className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

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
                      disabled={loading}
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
              disabled={!pagination.hasNext || loading}
              className="px-3"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </RequireAccess>
  );
}
