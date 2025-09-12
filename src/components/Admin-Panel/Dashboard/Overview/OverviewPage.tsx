/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  Heart,
  Stethoscope,
} from "lucide-react";
// import { Appointment } from "../appoinments/list/page";
import { useTheme } from "next-themes";
import { db } from "@/lib/firebase";
import { Appointment } from "@/lib/types";

const AdminOverviewPage = () => {
  const [parents, setParents] = useState<any[]>([]);
  const [appoinments, setAppoinments] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [doctorsData, setDoctorsData] = useState<any[]>([]);
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const fetchParents = async () => {
    const snapshot = await getDocs(collection(db, "Parents"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setParents(data);
  };
  const fetchAppoinments = async () => {
    const snapshot = await getDocs(collection(db, "Appointments"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAppoinments(data);
  };
  const fetchDonations = async () => {
    const snapshot = await getDocs(collection(db, "Donations"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDonations(data);
  };
  const fetchReviews = async () => {
    const snapshot = await getDocs(collection(db, "Reviews"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setReviews(data);
  };
  const fetchDoctors = async () => {
    const snapshot = await getDocs(
      collection(db, "Doctors", "Veterinarian", "Veterinarian")
    );
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDoctorsData(data);
  };

  console.log("parents =", appoinments);
  useEffect(() => {
    fetchParents();
    fetchAppoinments();
    fetchDonations();
    fetchReviews();
    fetchDoctors();
  }, []);

  // Top doctors
  const sortedDoctors = doctorsData
    .filter((doc) => doc.Approved === "yes")
    .sort((a, b) => {
      const aAppointments = a.Appointments?.length || 0;
      const bAppointments = b.Appointments?.length || 0;

      if (bAppointments !== aAppointments) {
        return bAppointments - aAppointments; // more appointments first
      }

      const aRating = a.averageRating || 0;
      const bRating = b.averageRating || 0;

      return bRating - aRating; // if same appointments, higher rating first
    });

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date();
  const todayData = appoinments.filter(
    (item) => item.AppointmentDate === today.toISOString().split("T")[0]
  );
  // find current months donation
  const currentMonth = today.getMonth(); // 0 = Jan, 6 = July
  const currentYear = today.getFullYear();

  const currentMonthDonations = donations.filter((item) => {
    const donationDate = new Date(item.timestamp.seconds * 1000);
    return (
      donationDate.getFullYear() === currentYear &&
      donationDate.getMonth() === currentMonth
    );
  });

  // Sum the donation amounts
  const totalDonationAmount = currentMonthDonations.reduce((sum, item) => {
    return sum + Number(item.donationAmount);
  }, 0);
  //  calsulate donation type percentage
  const filtered = donations.filter((item) => {
    const date = new Date(item.timestamp.seconds * 1000);
    const isThisMonth =
      date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    const isKnownType =
      item.donationType === "donation" || item.donationType === "booking";
    return isThisMonth && isKnownType;
  });

  // Step 2: Count known types
  let bookingCount = 0;
  let donationCount = 0;

  filtered.forEach((item) => {
    if (item.donationType === "booking") bookingCount++;
    else if (item.donationType === "donation") donationCount++;
  });

  const total = bookingCount + donationCount;

  // Step 3: Calculate percentages
  const bookingPercentage =
    total > 0 ? ((bookingCount / total) * 100).toFixed(2) : "0";
  const donationPercentage =
    total > 0 ? ((donationCount / total) * 100).toFixed(2) : "0%";
  // review count
  const validRatings = reviews
    .map((item) => item.rating)
    .filter((rating) => rating !== null && typeof rating === "number");

  // Calculate average
  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, rating) => sum + rating, 0) /
        validRatings.length
      : 0;

  const appointmentTypes = [
    { name: "Booking", value: parseFloat(bookingPercentage), color: "#3B82F6" },
    {
      name: "Donation",
      value: parseFloat(donationPercentage),
      color: "#10B981",
    },
  ];

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Step 2: Initialize structure
  const weeklyAppointments = [
    { day: "Mon", appointments: 0, completed: 0 },
    { day: "Tue", appointments: 0, completed: 0 },
    { day: "Wed", appointments: 0, completed: 0 },
    { day: "Thu", appointments: 0, completed: 0 },
    { day: "Fri", appointments: 0, completed: 0 },
    { day: "Sat", appointments: 0, completed: 0 },
    { day: "Sun", appointments: 0, completed: 0 },
  ];

  // Step 3: Helper map for weekday index
  const jsDayToIndex: { [key: number]: number } = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    0: 6,
  };

  // Step 4: Process appointments
  appoinments.forEach((appt) => {
    const date = new Date(appt.AppointmentDate);
    if (date >= startOfWeek && date <= endOfWeek) {
      const index = jsDayToIndex[date.getDay()];
      weeklyAppointments[index].appointments++;
      if (appt.status === "completed") {
        weeklyAppointments[index].completed++;
      }
    }
  });
  function formatHourLabel(hour: number): string {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}${period}`; // Example: 13 → "1PM"
  }

  // function getAverageAppointmentsByHour(appointments: Appointment[]) {
  //   const hourCounts: { [hourLabel: string]: number } = {};
  //   const dateSet = new Set<string>();

  //   appointments.forEach((appt) => {
  //     if (appt.AppointmentTimeUTC) {
  //       const date = new Date(appt.AppointmentTimeUTC);
  //       const dateStr = date.toISOString().slice(0, 10); // for day count
  //       const hour = date.getHours(); // 0–23

  //       if (hour >= 9 && hour <= 17) {
  //         const hourLabel = formatHourLabel(hour);
  //         hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1;
  //         dateSet.add(dateStr);
  //       }
  //     }
  //   });

  //   const totalDays = dateSet.size || 1; // avoid division by 0

  //   const workingHours = Array.from({ length: 9 }, (_, i) => 9 + i); // 9–17

  //   const result = workingHours.map((hour) => {
  //     const label = formatHourLabel(hour);
  //     const totalPatients = hourCounts[label] || 0;
  //     const averagePatients = totalPatients / totalDays;

  //     return {
  //       time: label,
  //       patients: Math.round(averagePatients), // or keep as float if needed
  //     };
  //   });

  //   return result;
  // }

  // ✅ Usage
  // const patientFlow = getAverageAppointmentsByHour(appoinments);

  // console.log("patientflow = ", patientFlow);
  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Appointments Today",
      value: "127",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Monthly Revenue",
      value: "$67,420",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Patient Satisfaction",
      value: "4.8/5",
      change: "+2%",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  // const recentActivities: Appointment[] = appoinments
  //   .filter(
  //     (
  //       appt: Appointment
  //     ): appt is Appointment & { AppointmentTimeUTC: string } =>
  //       appt.status === "completed" &&
  //       typeof appt.AppointmentTimeUTC === "string"
  //   )
  //   .sort(
  //     (a, b) =>
  //       new Date(b.AppointmentTimeUTC).getTime() -
  //       new Date(a.AppointmentTimeUTC).getTime()
  //   )
  //   .slice(0, 10);
  // console.log("Recent = ", recentActivities);

  // time deifference
  function getTimeDifferenceString(pastDateTime: string): string {
    const now = new Date();
    const past = new Date(pastDateTime);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-100">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1 dark:text-blue-100">
            Welcome back! Here&#x27;s what&#x27;s happening at your clinic
            today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-4 h-4 mr-1" />
            Live Updates
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md bg-gray-100 transition-shadow duration-200">
          <CardContent className="p-6 dark:bg-[#293549]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium dark:text-gray-100 text-gray-600">
                  Total Parents
                </p>
                <p className="text-3xl font-bold dark:text-white text-gray-900 mt-2">
                  {parents.length}
                </p>
              </div>
              <div className={`bg-blue-100 p-3 rounded-lg`}>
                <Users className={`w-6 h-6 text-blue-500`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md bg-gray-100 transition-shadow duration-200">
          <CardContent className="p-6 dark:bg-[#293549]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium dark:text-gray-100 text-gray-600">
                  Appoinments today
                </p>
                <p className="text-3xl font-bold dark:text-white text-gray-900 mt-2">
                  {todayData.length}
                </p>
              </div>
              <div className={`bg-green-50 p-3 rounded-lg`}>
                <Calendar className={`w-6 h-6 text-green-700`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md bg-gray-100 transition-shadow duration-200">
          <CardContent className="p-6 dark:bg-[#293549]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium dark:text-gray-100 text-gray-600">
                  Monthly Donations
                </p>
                <p className="text-3xl font-bold dark:text-white text-gray-900 mt-2">
                  ${totalDonationAmount}
                </p>
              </div>
              <div className={`bg-green-50 p-3 rounded-lg`}>
                <DollarSign className={`w-6 h-6 text-green-700`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md bg-gray-100 transition-shadow duration-200">
          <CardContent className="p-6 dark:bg-[#293549]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium dark:text-gray-100 text-gray-600">
                  Parent Satisfaction
                </p>
                <p className="text-3xl font-bold dark:text-white text-gray-900 mt-2">
                  {averageRating.toFixed(1)}/5
                </p>
              </div>
              <div className={`bg-yellow-50 p-3 rounded-lg`}>
                <Star className={`w-6 h-6 text-yellow-700`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* top doctor Chart */}
        <Card className="border-0 shadow-sm bg-gray-100 dark:bg-[#293549]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Top Doctors
            </CardTitle>
            <CardDescription className="dark:text-gray-100">
              Based on number of appointments and average rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 ">
              {sortedDoctors?.slice(0, 4).map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-slate-800 rounded-lg"
                >
                  <img
                    src={doctor.profilePictureURL}
                    alt={`${doctor.FirstName} ${doctor.LastName}`}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white text-gray-900 truncate">
                      Dr. {doctor.FirstName} {doctor.LastName},{" "}
                      {doctor.PostNominalLetters}
                    </p>
                    <p className="text-xs dark:text-gray-100 text-gray-500">
                      with {doctor?.DocType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm dark:text-gray-100 text-gray-800">
                      {" "}
                      {doctor?.Appointments?.length} Appointments
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500 hover:bg-yellow-500 text-white text-xs"
                    >
                      {doctor?.averageRating ? doctor.averageRating : 0}/5
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Donation type Types */}
        <Card className="border-0 shadow-sm bg-gray-100 dark:bg-[#293549]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Donation Distribution
            </CardTitle>
            <CardDescription className="text-gray-800 dark:text-gray-100">
              Types of donation this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={appointmentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {appointmentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3 lg:ml-4">
                {appointmentTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm dark:text-gray-100 text-gray-600">
                      {type.name}
                    </span>
                    <span className="text-sm font-medium">{type.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Appointments */}
        <Card className="lg:col-span-2 border-0 bg-gray-100 shadow-sm dark:bg-[#293549]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Weekly Appointments
            </CardTitle>
            <CardDescription className="dark:text-gray-100">
              Scheduled vs completed appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAppointments}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#4B5563" : "#D1D5DB"} // adjust grid color
                  className="opacity-30"
                />
                <XAxis dataKey="day" stroke={isDark ? "#D1D5DB" : "#374151"} />
                <YAxis stroke={isDark ? "#D1D5DB" : "#374151"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#374151" : "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    color: isDark ? "white" : "black",
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill={isDark ? "#A78BFA" : "#8B5CF6"} // purple variant for dark mode
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  fill={isDark ? "#34D399" : "#10B981"} // green variant for dark mode
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 shadow-sm bg-gray-100 dark:bg-[#293549]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Recent Appointments
            </CardTitle>
            <CardDescription className="dark:text-gray-100">
              Latest clinic activities
            </CardDescription>
          </CardHeader>
          {/* <CardContent>
            <div className="space-y-4 h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : activity.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white text-gray-900 truncate">
                      {activity?.ParentName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-200">
                      with {activity?.DoctorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {activity.AppointmentTimeUTC &&
                        getTimeDifferenceString(activity.AppointmentTimeUTC)}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-green-700 hover:bg-green-700 text-white text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent> */}
        </Card>
      </div>

      {/* Patient Flow Chart */}
      <Card className="border-0 shadow-sm bg-gray-100 dark:bg-[#293549]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Daily Patient Flow
          </CardTitle>
          <CardDescription className={isDark ? "text-gray-100" : ""}>
            Patient visits throughout the day
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={patientFlow}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#4B5563" : "#D1D5DB"} // grid color
                className="opacity-30"
              />
              <XAxis dataKey="time" stroke={isDark ? "#D1D5DB" : "#374151"} />
              <YAxis stroke={isDark ? "#D1D5DB" : "#374151"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#374151" : "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  color: isDark ? "white" : "black",
                }}
              />
              <Line
                type="monotone"
                dataKey="patients"
                stroke={isDark ? "#F87171" : "#EF4444"} // lighter red for dark mode
                strokeWidth={3}
                dot={{
                  fill: isDark ? "#F87171" : "#EF4444",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: isDark ? "#F87171" : "#EF4444",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent> */}
      </Card>
    </div>
  );
};

export default AdminOverviewPage;
