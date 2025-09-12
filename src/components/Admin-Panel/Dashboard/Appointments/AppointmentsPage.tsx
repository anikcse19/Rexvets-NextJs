"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
  Stethoscope,
  Pen,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import RescheduleModal from "../../Shared/RescheduleModal";
import Pagination from "../../Shared/Pagination";
import { DateTime } from "luxon";

export interface Appointment {
  id: string;
  ParentName: string;
  PetRefID?: string;
  DoctorName: string;
  DoctorRefID: string;
  AppointmentDate: string;
  AppointmentTimeUTC?: string | undefined;
  AppointmentTime: string;
  MoreDetails: string;
  notes: string[];
  PetConcerns: string[];
  status: string;
  contactNumber: string;
  ParentEmail: string;
}

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const today = format(new Date(), "yyyy-MM-dd");

  const getUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Appointments"));

      if (snapshot.empty) {
        console.log("No appointments found");
        setAppointmentsData([]);
        return;
      }

      const appointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];

      const now = new Date();

      // Step 1: Split into upcoming and past
      const upcoming: Appointment[] = [];
      const past: Appointment[] = [];

      appointments.forEach((apt) => {
        const dateTime = new Date(
          `${apt.AppointmentDate} ${apt.AppointmentTime}`
        );
        if (dateTime >= now) {
          upcoming.push(apt);
        } else {
          past.push(apt);
        }
      });

      // Step 2: Sort
      const sortByDateAsc = (a: Appointment, b: Appointment) =>
        new Date(`${a.AppointmentDate} ${a.AppointmentTime}`).getTime() -
        new Date(`${b.AppointmentDate} ${b.AppointmentTime}`).getTime();

      const sortByDateDesc = (a: Appointment, b: Appointment) =>
        new Date(`${b.AppointmentDate} ${b.AppointmentTime}`).getTime() -
        new Date(`${a.AppointmentDate} ${a.AppointmentTime}`).getTime();

      const sortedUpcoming = upcoming.sort(sortByDateAsc);
      const sortedPast = past.sort(sortByDateDesc);

      // Step 3: Combine
      const finalSortedAppointments = [...sortedUpcoming, ...sortedPast];

      setAppointmentsData(finalSortedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, doctorFilter, dateFilter]);

  // Filter appointments based on search and filters
  const filteredAppointments = useMemo(() => {
    return appointmentsData.filter((appointment: any) => {
      const matchesSearch =
        appointment.ParentName.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        appointment.DoctorName.toLowerCase().includes(searchTerm.toLowerCase());

      const appointmentDateTime = new Date(
        `${appointment.AppointmentDate} ${appointment.AppointmentTime}`
      );
      const now = new Date();
      let derivedStatus = "Upcoming";

      if (appointmentDateTime < now) {
        derivedStatus =
          appointment.status?.toLowerCase() === "complete"
            ? "Complete"
            : "Incomplete";
      }
      const matchesStatus =
        statusFilter === "all" ||
        statusFilter?.toLocaleLowerCase() === derivedStatus.toLocaleLowerCase();

      const matchesDoctor =
        doctorFilter === "all" || appointment.DoctorName === doctorFilter;

      const matchesDate =
        !dateFilter ||
        format(new Date(appointment.AppointmentDate), "yyyy-MM-dd") ===
          format(dateFilter, "yyyy-MM-dd");

      return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
    });
  }, [searchTerm, statusFilter, doctorFilter, dateFilter, appointmentsData]);

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAppointments.slice(start, end);
  }, [filteredAppointments, currentPage]);

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "default",
      confirmed: "secondary",
      "in-progress": "destructive",
      completed: "default",
      cancelled: "outline",
      "no-show": "destructive",
    } as const;

    const colors = {
      Upcoming: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      Incomplete: "bg-green-100 text-green-800 hover:bg-green-200",
      "in-progress": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      Complete: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
      "no-show": "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status?.replace("-", " ")}
      </Badge>
    );
  };

  const handleRefresh = () => {
    getUsers();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDoctorFilter("all");
    setDateFilter(undefined);
  };

  const uniqueDoctors = Array.from(
    new Set(appointmentsData.map((apt: any) => apt.DoctorName))
  );
  // const uniqueTypes = Array.from(
  //   new Set(appointments.map((apt) => apt.appointmentType))
  // );

  const handleRescheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleMonitorClick = (appointment: any) => {
    // Generate monitoring link based on appointment data
    const appointmentDateTime = new Date(
      `${appointment.AppointmentDate} ${appointment.AppointmentTime}`
    );
    const now = new Date();

    // Check if appointment is currently active (within 30 minutes of start time)
    const timeDiff = Math.abs(appointmentDateTime.getTime() - now.getTime());
    const isActive = timeDiff <= 30 * 60 * 1000; // 30 minutes

    if (isActive) {
      // For active appointments, construct the monitoring link
      const roomId = appointment.id || appointment.AppointmentRefID;
      const monitorLink = `https://rexvet.org/VideoCall/${roomId}/monitor`;
      window.open(monitorLink, "_blank", "noopener,noreferrer");
    } else {
      // For future appointments, show a message
      alert(
        "Monitoring is only available for active appointments (within 30 minutes of start time)"
      );
    }
  };

  const convertNYToLocal = (time: string, date: any) => {
    const formatted = format(date, "yyyy-MM-dd");

    const nyTime = DateTime.fromFormat(
      `${formatted} ${time}`,
      "yyyy-MM-dd hh:mm a",
      {
        zone: "America/New_York",
      }
    );

    const userTime = nyTime.setZone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    return userTime.toFormat("hh:mm a");
  };
  return (
    // <RequireAccess permission="Appointments">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-100">
            Appointments
          </h1>
          <p className="text-gray-600 mt-1 dark:text-blue-100">
            Manage and track all patient appointments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="dark:bg-gray-700 dark:border-slate-600"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-[#293549] bg-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm dark:text-white text-gray-600">
                  Total Today
                </p>
                <p className="text-2xl font-bold dark:text-blue-400 text-blue-600">
                  {
                    appointmentsData.filter(
                      (apt: any) => apt.AppointmentDate === today
                    ).length
                  }
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 dark:text-blue-400 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-[#293549] bg-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm dark:text-white text-gray-600">
                  Upcoming
                </p>
                <p className="text-2xl font-bold dark:text-green-400 text-green-600">
                  {
                    appointmentsData.filter(
                      (apt: any) => apt.status === "Upcoming"
                    ).length
                  }
                </p>
              </div>
              <User className="w-8 h-8 dark:text-green-400 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-[#293549] bg-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm dark:text-white text-gray-600">
                  Incomplete
                </p>
                <p className="text-2xl font-bold dark:text-yellow-400 text-yellow-600">
                  {
                    appointmentsData.filter(
                      (apt: any) => apt.status === "Incomplete"
                    ).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 dark:text-yellow-400 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-[#293549] bg-gray-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm dark:text-white text-gray-600">
                  Completed
                </p>
                <p className="text-2xl font-bold dark:text-emerald-400 text-emerald-600">
                  {
                    appointmentsData.filter(
                      (apt: any) => apt.status === "completed"
                    ).length
                  }
                </p>
              </div>
              <Stethoscope className="w-8 h-8 dark:text-emerald-400 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="dark:bg-[#293549] bg-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white h-4 w-4 " />
                <Input
                  placeholder="Search patients, doctors, or appointment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:text-white dark:placeholder:text-gray-200 dark:bg-gray-700 dark:border-slate-600"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Incomplete">Incomplete</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="complete">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            {/* <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="dark:bg-slate-900">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900">
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            {/* Doctor Filter */}
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600">
                <SelectValue placeholder="Doctor" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                <SelectItem value="all">All Doctors</SelectItem>
                {uniqueDoctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Popover>
              <PopoverTrigger
                className="dark:bg-gray-700 dark:border-slate-600"
                asChild
              >
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter
                    ? format(dateFilter, "MMM dd, yyyy")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 dark:bg-slate-900"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="dark:bg-[#293549] bg-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appointments List</CardTitle>
              <CardDescription className="mt-1 dark:text-gray-100">
                Showing 10 of {appointmentsData.length} appointments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="dark:text-gray-100">
                  <TableHead className="dark:text-gray-200">SL</TableHead>
                  <TableHead className="dark:text-gray-200">Patient</TableHead>
                  <TableHead className="dark:text-gray-200">Doctor</TableHead>
                  <TableHead className="dark:text-gray-200">
                    Date & Time
                  </TableHead>
                  <TableHead className="dark:text-gray-200">Status</TableHead>
                  <TableHead className="dark:text-gray-200">Contact</TableHead>
                  <TableHead className="text-right dark:text-gray-200">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDataLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        {Array.from({ length: 7 }).map((_, cellIdx) => (
                          <TableCell key={cellIdx}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center py-12">
                        <CalendarIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          No appointments found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                          Try adjusting your search or filter criteria.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAppointments.map((appointment, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell className="dark:text-gray-100">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {appointment.ParentName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.PetRefID}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {appointment.DoctorName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.DoctorRefID}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                            {convertNYToLocal(
                              appointment?.AppointmentTime,
                              appointment?.AppointmentDate
                            )}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                            {format(
                              new Date(appointment.AppointmentDate),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        {(() => {
                          const appointmentDateTime = new Date(
                            `${appointment.AppointmentDate} ${appointment.AppointmentTime}`
                          );
                          const now = new Date();
                          let derivedStatus = "Upcoming";

                          if (appointmentDateTime < now) {
                            derivedStatus =
                              appointment.status?.toLowerCase() === "complete"
                                ? "Complete"
                                : "Incomplete";
                          }

                          return getStatusBadge(derivedStatus);
                        })()}
                      </TableCell>
                      <TableCell className="dark:text-gray-100">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="w-3 h-3 mr-1" />
                          {appointment.ParentEmail}
                        </div>
                      </TableCell>
                      <TableCell className="text-right dark:text-gray-100">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 dark:text-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="dark:bg-gray-800 dark:text-gray-100"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleRescheduleClick(appointment)}
                              className="dark:hover:bg-gray-700"
                            >
                              <Pen className="mr-2 h-4 w-4" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMonitorClick(appointment)}
                              className="dark:hover:bg-gray-700"
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Monitor Call
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination
            totalItems={filteredAppointments.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
      {/* Modal */}
      {selectedAppointment && (
        <RescheduleModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            getUsers();
          }}
          appointment={selectedAppointment}
        />
      )}
    </div>
    // </RequireAccess>
  );
};

export default AppointmentsPage;
