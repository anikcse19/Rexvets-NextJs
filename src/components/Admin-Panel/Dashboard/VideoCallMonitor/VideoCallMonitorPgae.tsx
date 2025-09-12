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
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { RexVetsAppointment } from "../../lib/rexvets-api";
import { db } from "@/lib/firebase";

interface ActiveCall {
  appointmentId: string;
  roomId: string;
  parentName: string;
  doctorName: string;
  startTime: string;
  duration: string;
  status: "active" | "connecting" | "ended";
  accessCode: string;
}

const VideoMonitoringDashboard = () => {
  const [appointments, setAppointments] = useState<RexVetsAppointment[]>([]);
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'upcoming'
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

    appointments.forEach((appointment: RexVetsAppointment) => {
      if (appointment.roomId && appointment.appointmentDate) {
        const appointmentDate = new Date(appointment.appointmentDate);
        const appointmentTime = appointment.appointmentTime;

        // Parse appointment time (assuming format like "04:00 PM")
        const [time, period] = appointmentTime.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let hour24 = hours;

        if (period === "PM" && hours !== 12) hour24 += 12;
        if (period === "AM" && hours === 12) hour24 = 0;

        appointmentDate.setHours(hour24, minutes, 0, 0);

        // Check if appointment is happening now (within 30 minutes before and 2 hours after start time)
        const timeDiff = now.getTime() - appointmentDate.getTime();
        const thirtyMinutesBefore = -30 * 60 * 1000; // 30 minutes before
        const twoHoursAfter = 2 * 60 * 60 * 1000; // 2 hours after

        if (timeDiff >= thirtyMinutesBefore && timeDiff <= twoHoursAfter) {
          // Calculate duration
          const durationMinutes = Math.floor(timeDiff / (1000 * 60));
          let duration = "";
          let status: "active" | "connecting" | "ended" = "active";

          if (timeDiff < 0) {
            // Appointment hasn't started yet
            duration = `Starts in ${Math.abs(durationMinutes)}m`;
            status = "connecting";
          } else if (durationMinutes < 1) {
            duration = "Just started";
            status = "connecting";
          } else {
            duration = `${durationMinutes}m`;
            status = "active";
          }

          activeCallsData.push({
            appointmentId: appointment.id,
            roomId: appointment.roomId,
            parentName: appointment.parentName,
            doctorName: appointment.doctorName,
            startTime: appointmentDate.toISOString(),
            duration: duration,
            status: status,
            accessCode: appointment.AccessCode || "N/A",
          });
        }
      }
    });

    setActiveCalls(activeCallsData);
  };

  const loadData = async () => {
    try {
      // Fetch appointments directly from Firestore
      const appointmentsRef = collection(db, "Appointments");
      const appointmentsQuery = query(
        appointmentsRef,
        orderBy("AppointmentDate", "desc"),
        limit(100) // Limit to recent 100 appointments
      );

      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsData: RexVetsAppointment[] = [];

      appointmentsSnapshot.forEach((doc: any) => {
        const data = doc.data();
        appointmentsData.push({
          id: doc.id,
          appointmentDate: data.AppointmentDate || "",
          appointmentTime: data.AppointmentTime || "",
          doctorName: data.DoctorName || "Unknown Doctor",
          doctorEmail: data.DoctorEmail || "",
          doctorId: data.DoctorRefID || "",
          doctorType: data.DoctorType || "Veterinarian",
          parentName: data.ParentName || "Unknown Parent",
          parentEmail: data.ParentEmail || "",
          parentId: data.ParentRefID || "",
          petName: data.PetName || "Unknown Pet",
          petId: data.PetRefID || "",
          petConcerns: data.PetConcerns || [],
          meetingLink: data.MeetingLink || "",
          roomId: data.roomId || "", // Add roomId field
          status: data.status || "Unknown",
          state: data.state || "",
          timezone: data.timezone || "",
          createdAt: data.createdAt || null,
          AccessCode: data.AccessCode || "",
        });
      });

      setAppointments(appointmentsData);

      // Get active video calls from appointments that are currently happening
      const now = new Date();
      const activeCallsData: ActiveCall[] = [];

      appointmentsData.forEach((appointment) => {
        if (appointment.roomId && appointment.appointmentDate) {
          const appointmentDate = new Date(appointment.appointmentDate);
          const appointmentTime = appointment.appointmentTime;

          // Parse appointment time (assuming format like "04:00 PM")
          const [time, period] = appointmentTime.split(" ");
          const [hours, minutes] = time.split(":").map(Number);
          let hour24 = hours;

          if (period === "PM" && hours !== 12) hour24 += 12;
          if (period === "AM" && hours === 12) hour24 = 0;

          appointmentDate.setHours(hour24, minutes, 0, 0);

          // Check if appointment is happening now (within 30 minutes before and 2 hours after start time)
          const timeDiff = now.getTime() - appointmentDate.getTime();
          const thirtyMinutesBefore = -30 * 60 * 1000; // 30 minutes before
          const twoHoursAfter = 2 * 60 * 60 * 1000; // 2 hours after

          if (timeDiff >= thirtyMinutesBefore && timeDiff <= twoHoursAfter) {
            // Calculate duration
            const durationMinutes = Math.floor(timeDiff / (1000 * 60));
            let duration = "";
            let status: "active" | "connecting" | "ended" = "active";

            if (timeDiff < 0) {
              // Appointment hasn't started yet
              duration = `Starts in ${Math.abs(durationMinutes)}m`;
              status = "connecting";
            } else if (durationMinutes < 1) {
              duration = "Just started";
              status = "connecting";
            } else {
              duration = `${durationMinutes}m`;
              status = "active";
            }

            activeCallsData.push({
              appointmentId: appointment.id,
              roomId: appointment.roomId,
              parentName: appointment.parentName,
              doctorName: appointment.doctorName,
              startTime: appointmentDate.toISOString(),
              duration: duration,
              status: status,
              accessCode: appointment.AccessCode || "N/A",
            });
          }
        }
      });

      setActiveCalls(activeCallsData);
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

  const openMonitoringLink = (roomId: string) => {
    if (roomId) {
      const monitorLink = `https://rexvet.org/VideoCall/${roomId}/monitor`;
      window.open(monitorLink, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Room ID not available for monitoring");
    }
  };

  const copyMonitoringLink = async (roomId: string) => {
    try {
      if (roomId) {
        const monitorLink = `https://rexvet.org/VideoCall/${roomId}/monitor`;
        await navigator.clipboard.writeText(monitorLink);
        toast.success("Monitoring link copied to clipboard");
      } else {
        toast.error("Room ID not available for monitoring");
      }
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link to clipboard");
    }
  };

  const filteredAppointments = appointments
    .filter((appointment: RexVetsAppointment) => {
      const parentName = appointment.parentName || "";
      const doctorName = appointment.doctorName || "";
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        parentName.toLowerCase().includes(searchLower) ||
        doctorName.toLowerCase().includes(searchLower);
      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      // Date filtering
      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        const appointmentDate = appointment.appointmentDate;

        if (dateFilter === "today") {
          matchesDate = appointmentDate === today;
        } else if (dateFilter === "upcoming") {
          matchesDate = appointmentDate >= today;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a: RexVetsAppointment, b: RexVetsAppointment) => {
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* <Card> */}
        {/* <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent> */}
        {/* </Card> */}
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
                        apt.appointmentDate ===
                        new Date().toISOString().split("T")[0]
                    ).length
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Monitoring</p>
                <p className="text-2xl font-bold">
                  {appointments.filter((apt) => apt.roomId).length}
                </p>
              </div>
              <Video className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Schedule
                </p>
                <p className="text-2xl font-bold">{activeCalls.length}</p>
              </div>
              <Video className="w-8 h-8 text-red-600" />
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
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {call.parentName || "Unknown Parent"} →{" "}
                            {call.doctorName || "Unknown Doctor"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => openMonitoringLink(call.roomId)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Monitor
                        </Button>
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
                        setDateFilter(dateFilter === "today" ? "all" : "today")
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
                        key={appointment.id}
                        className="border rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">
                              {appointment.parentName || "Unknown Parent"} →{" "}
                              {appointment.doctorName || "Unknown Doctor"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.appointmentDate} at{" "}
                              {appointment.appointmentTime}
                            </p>
                          </div>
                        </div>
                        {appointment.roomId && (
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Monitoring Link:
                                </p>
                                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 truncate">
                                  {`https://rexvet.org/VideoCall/${appointment.roomId}/monitor`}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    copyMonitoringLink(appointment.roomId!)
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    openMonitoringLink(appointment.roomId!)
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
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">
                            {appointment.parentName || "Unknown Parent"} →{" "}
                            {appointment.doctorName || "Unknown Doctor"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.appointmentDate} at{" "}
                            {appointment.appointmentTime}
                          </p>
                        </div>
                      </div>

                      {appointment.roomId && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">
                                Monitoring Link:
                              </p>
                              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 truncate">
                                {`https://rexvet.org/VideoCall/${appointment.roomId}/monitor`}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyMonitoringLink(appointment.roomId!)
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openMonitoringLink(appointment.roomId!)
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
  );
};

export default VideoMonitoringDashboard;
