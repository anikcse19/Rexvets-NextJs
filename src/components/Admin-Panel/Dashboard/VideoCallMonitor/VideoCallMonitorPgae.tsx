"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Video,
  Users,
  Clock,
  Calendar,
  Search,
  RefreshCw,
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
// Removed Firestore imports - now using MongoDB APIs
import { IAppointment } from "@/models/Appointment";
import RequireAccess from "../../Shared/RequireAccess";

interface ActiveCall {
  appointmentId: string;
  meetingLink: string;
  parentName: string;
  doctorName: string;
  petName: string;
  startTime: string;
  duration: string;
  status: "active" | "connecting" | "ended" | "scheduled";
  appointmentType: string;
  concerns: string[];
  feeUSD: number;
  paymentStatus: string;
}

interface VideoCallMetrics {
  totalCalls: number;
  activeCalls: number;
  completedCalls: number;
  averageDuration: number;
  totalRevenue: number;
}

const VideoMonitoringDashboard = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [metrics, setMetrics] = useState<VideoCallMetrics>({
    totalCalls: 0,
    activeCalls: 0,
    completedCalls: 0,
    averageDuration: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'upcoming'
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);

  useEffect(() => {
    initializeMonitoring();
  }, []);

  // Refresh active calls every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        updateActiveCalls();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [appointments, loading]);

  const initializeMonitoring = async () => {
    try {
      setLoading(true);
      await loadData();
    } catch (error) {
      console.error("Failed to initialize monitoring:", error);
      toast.error("Failed to initialize monitoring system");
    } finally {
      setLoading(false);
    }
  };

  const updateActiveCalls = () => {
    const now = new Date();
    const activeCallsData: ActiveCall[] = [];

    appointments.forEach((appointment: IAppointment) => {
      if (appointment.meetingLink && appointment.appointmentDate) {
        const appointmentDate = new Date(appointment.appointmentDate);

        // Check if appointment is happening now (within 30 minutes before and 2 hours after start time)
        const timeDiff = now.getTime() - appointmentDate.getTime();
        const thirtyMinutesBefore = -30 * 60 * 1000; // 30 minutes before
        const twoHoursAfter = 2 * 60 * 60 * 1000; // 2 hours after

        if (timeDiff >= thirtyMinutesBefore && timeDiff <= twoHoursAfter) {
          // Calculate duration
          const durationMinutes = Math.floor(timeDiff / (1000 * 60));
          let duration = "";
          let status: "active" | "connecting" | "ended" | "scheduled" =
            "active";

          if (timeDiff < 0) {
            // Appointment hasn't started yet
            duration = `Starts in ${Math.abs(durationMinutes)}m`;
            status = "scheduled";
          } else if (durationMinutes < 1) {
            duration = "Just started";
            status = "connecting";
          } else {
            duration = `${durationMinutes}m`;
            status = "active";
          }

          activeCallsData.push({
            appointmentId: (appointment as any)._id,
            meetingLink: appointment.meetingLink,
            parentName:
              (appointment as any).petParent?.name || "Unknown Parent",
            doctorName:
              (appointment as any).veterinarian?.name || "Unknown Doctor",
            petName: (appointment as any).pet?.name || "Unknown Pet",
            startTime: appointmentDate.toISOString(),
            duration: duration,
            status: status,
            appointmentType: appointment.appointmentType || "General Checkup",
            concerns: appointment.concerns || [],
            feeUSD: appointment.feeUSD || 0,
            paymentStatus: appointment.paymentStatus || "Unknown",
          });
        }
      }
    });

    setActiveCalls(activeCallsData);
  };

  const loadData = async () => {
    try {
      // Fetch appointments from MongoDB API
      const response = await fetch("/api/appointments?limit=1000");
      const result = await response.json();

      if (result.success) {
        setAppointments(result.data);

        // Calculate metrics
        const totalCalls = result.data.length;
        const activeCallsCount = result.data.filter(
          (apt: IAppointment) =>
            apt.meetingLink && new Date(apt.appointmentDate) <= new Date()
        ).length;
        const completedCalls = result.data.filter(
          (apt: IAppointment) => apt.status === "completed"
        ).length;
        const totalRevenue = result.data.reduce(
          (sum: number, apt: IAppointment) => sum + (apt.feeUSD || 0),
          0
        );

        setMetrics({
          totalCalls,
          activeCalls: activeCallsCount,
          completedCalls,
          averageDuration: 0, // Will be calculated from actual call data
          totalRevenue,
        });
      } else {
        console.error("Error fetching appointments:", result.error);
        toast.error("Failed to load appointments");
      }
    } catch (error) {
      console.error("Error loading monitoring data:", error);
      toast.error("Failed to load monitoring data");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    updateActiveCalls(); // Also update active calls
    setIsRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  const generateMonitorLink = (meetingLink: string) => {
    if (!meetingLink) return null;

    // Extract appointmentId from the meeting link
    const url = new URL(meetingLink);
    const appointmentId = url.searchParams.get("appointmentId");
    const vetId = url.searchParams.get("vetId");
    const petId = url.searchParams.get("petId");
    const petParentId = url.searchParams.get("petParentId");

    if (!appointmentId || !vetId) return null;

    // Generate monitoring URL with /monitor path
    const baseUrl = window.location.origin;
    return `${baseUrl}/VideoCall/${appointmentId}/monitor?vetId=${vetId}&petId=${petId}&petParentId=${petParentId}`;
  };

  const openVideoCall = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Meeting link not available");
    }
  };

  const openMonitorCall = (meetingLink: string) => {
    const monitorLink = generateMonitorLink(meetingLink);
    if (monitorLink) {
      window.open(monitorLink, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Unable to generate monitoring link");
    }
  };

  const copyMeetingLink = async (meetingLink: string) => {
    try {
      if (meetingLink) {
        await navigator.clipboard.writeText(meetingLink);
        toast.success("Meeting link copied to clipboard");
      } else {
        toast.error("Meeting link not available");
      }
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link to clipboard");
    }
  };

  const copyMonitorLink = async (meetingLink: string) => {
    try {
      const monitorLink = generateMonitorLink(meetingLink);
      if (monitorLink) {
        await navigator.clipboard.writeText(monitorLink);
        toast.success("Monitoring link copied to clipboard");
      } else {
        toast.error("Unable to generate monitoring link");
      }
    } catch (error) {
      console.error("Failed to copy monitoring link:", error);
      toast.error("Failed to copy monitoring link to clipboard");
    }
  };

  const filteredAppointments = appointments
    .filter((appointment: IAppointment) => {
      const parentName = (appointment as any).petParent?.name || "";
      const doctorName = (appointment as any).veterinarian?.name || "";
      const petName = (appointment as any).pet?.name || "";
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        parentName.toLowerCase().includes(searchLower) ||
        doctorName.toLowerCase().includes(searchLower) ||
        petName.toLowerCase().includes(searchLower) ||
        appointment.concerns?.some((concern) =>
          concern.toLowerCase().includes(searchLower)
        );

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      // Date filtering
      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        const appointmentDate = new Date(appointment.appointmentDate)
          .toISOString()
          .split("T")[0];

        if (dateFilter === "today") {
          matchesDate = appointmentDate === today;
        } else if (dateFilter === "upcoming") {
          matchesDate = appointmentDate >= today;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a: IAppointment, b: IAppointment) => {
      // Sort by appointment date in descending order (newest first)
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return dateB.getTime() - dateA.getTime();
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <RequireAccess permission="Video Monitoring">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Video Call Monitoring
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage video call appointments in real-time
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="dark:bg-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Appointments
                  </p>
                  <p className="text-2xl font-bold">{metrics.totalCalls}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Today&apos;s Appointments
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      appointments.filter(
                        (apt) =>
                          new Date(apt.appointmentDate)
                            .toISOString()
                            .split("T")[0] ===
                          new Date().toISOString().split("T")[0]
                      ).length
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-4"
        >
          <TabsList className="dark:bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">All Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Calls Current Schedule
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"
                      title="Real-time updates"
                    ></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeCalls.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No Scheduled Calls</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeCalls.slice(0, 5).map((call) => (
                        <div
                          key={call.appointmentId}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  call.status === "active"
                                    ? "bg-green-500"
                                    : call.status === "connecting"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                              <p className="font-medium">
                                {call.parentName} → {call.doctorName}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                ({call.petName})
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{call.duration}</span>
                              <span>{call.appointmentType}</span>
                              <span className="text-green-600 font-medium">
                                ${call.feeUSD}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyMeetingLink(call.meetingLink)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyMonitorLink(call.meetingLink)}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Copy Monitor
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openVideoCall(call.meetingLink)}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openMonitorCall(call.meetingLink)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Monitor
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Appointments
                      </CardTitle>
                      <CardDescription>
                        Latest scheduled appointments (
                        {filteredAppointments.length} shown)
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={dateFilter === "all" ? "default" : "outline"}
                        onClick={() => setDateFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        size="sm"
                        variant={dateFilter === "today" ? "default" : "outline"}
                        onClick={() =>
                          setDateFilter(
                            dateFilter === "today" ? "all" : "today"
                          )
                        }
                      >
                        Today
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          dateFilter === "upcoming" ? "default" : "outline"
                        }
                        onClick={() =>
                          setDateFilter(
                            dateFilter === "upcoming" ? "all" : "upcoming"
                          )
                        }
                      >
                        Upcoming
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[600px] overflow-y-auto">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAppointments.map((appointment) => (
                        <div
                          key={(appointment as any)._id}
                          className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    appointment.status === "completed"
                                      ? "bg-green-500"
                                      : appointment.status === "upcoming"
                                      ? "bg-blue-500"
                                      : appointment.status === "cancelled"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                  }`}
                                ></div>
                                <p className="font-medium">
                                  {(appointment as any).petParent?.name ||
                                    "Unknown Parent"}{" "}
                                  →{" "}
                                  {(appointment as any).veterinarian?.name ||
                                    "Unknown Doctor"}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  (
                                  {(appointment as any).pet?.name ||
                                    "Unknown Pet"}
                                  )
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  appointment.appointmentDate
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                  appointment.appointmentDate
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          {appointment.meetingLink && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="mb-2">
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Monitor Link:
                                    </p>
                                    <p className="text-xs font-mono text-purple-600 dark:text-purple-400 truncate">
                                      {generateMonitorLink(
                                        appointment.meetingLink!
                                      ) || "Unable to generate"}
                                    </p>
                                  </div>
                                  {appointment.concerns &&
                                    appointment.concerns.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-muted-foreground mb-1">
                                          Concerns:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {appointment.concerns
                                            .slice(0, 3)
                                            .map((concern, idx) => (
                                              <span
                                                key={idx}
                                                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                                              >
                                                {concern}
                                              </span>
                                            ))}
                                          {appointment.concerns.length > 3 && (
                                            <span className="text-xs text-muted-foreground">
                                              +{appointment.concerns.length - 3}{" "}
                                              more
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      copyMonitorLink(appointment.meetingLink!)
                                    }
                                    className="h-8 w-8 p-0"
                                    title="Copy monitoring link"
                                  >
                                    <Shield className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      openVideoCall(appointment.meetingLink!)
                                    }
                                  >
                                    <Video className="h-3 w-3 mr-1" />
                                    Join
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      openMonitorCall(appointment.meetingLink!)
                                    }
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Monitor
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card className="dark:bg-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>
                      Complete list of appointments with monitoring capabilities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by patient or doctor name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 h-[600px] overflow-y-auto">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        No Appointments Found
                      </h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <div
                        key={(appointment as any)._id}
                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  appointment.status === "completed"
                                    ? "bg-green-500"
                                    : appointment.status === "upcoming"
                                    ? "bg-blue-500"
                                    : appointment.status === "cancelled"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                              ></div>
                              <h3 className="font-medium">
                                {(appointment as any).petParent?.name ||
                                  "Unknown Parent"}{" "}
                                →{" "}
                                {(appointment as any).veterinarian?.name ||
                                  "Unknown Doctor"}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                (
                                {(appointment as any).pet?.name ||
                                  "Unknown Pet"}
                                )
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                appointment.appointmentDate
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                appointment.appointmentDate
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        {appointment.meetingLink && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="mb-2">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Monitor Link:
                                  </p>
                                  <p className="text-xs font-mono text-purple-600 dark:text-purple-400 truncate">
                                    {generateMonitorLink(
                                      appointment.meetingLink!
                                    ) || "Unable to generate"}
                                  </p>
                                </div>
                                {appointment.concerns &&
                                  appointment.concerns.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-muted-foreground mb-1">
                                        Concerns:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {appointment.concerns
                                          .slice(0, 3)
                                          .map((concern, idx) => (
                                            <span
                                              key={idx}
                                              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                                            >
                                              {concern}
                                            </span>
                                          ))}
                                        {appointment.concerns.length > 3 && (
                                          <span className="text-xs text-muted-foreground">
                                            +{appointment.concerns.length - 3}{" "}
                                            more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    copyMonitorLink(appointment.meetingLink!)
                                  }
                                  className="h-8 w-8 p-0"
                                  title="Copy monitoring link"
                                >
                                  <Shield className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    openVideoCall(appointment.meetingLink!)
                                  }
                                >
                                  <Video className="h-3 w-3 mr-1" />
                                  Join
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    openMonitorCall(appointment.meetingLink!)
                                  }
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Monitor
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAccess>
  );
};

export default VideoMonitoringDashboard;
