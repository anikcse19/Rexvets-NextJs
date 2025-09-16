"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
    Activity,
    BarChart3,
    Calendar,
    Clock,
    DollarSign,
    Target,
    Timer,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";

interface VetSlotStatistics {
  // Basic counts
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  disabledSlots: number;
  
  // Time statistics
  totalHours: number;
  availableHours: number;
  bookedHours: number;
  disabledHours: number;
  
  // Period statistics
  totalPeriods: number;
  averagePeriodDuration: number;
  
  // Daily breakdown
  dailyStats: Array<{
    date: string;
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    disabledSlots: number;
    totalHours: number;
    periods: number;
    availableTimes: Array<{
      from: string;
      to: string;
    }>;
  }>;
  
  // Utilization metrics
  utilizationRate: number;
  availabilityRate: number;
  
  // Time range analysis
  earliestSlotTime: string;
  latestSlotTime: string;
  mostActiveHour: string;
  
  // Revenue potential
  potentialRevenue: number;
  actualRevenue: number;
  
  // Recent activity
  slotsCreatedToday: number;
  slotsBookedToday: number;
  
  // Timezone info
  timezone: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface VetSlotStatisticsProps {
  data: VetSlotStatistics | null;
  loading: boolean;
  error: string | null;
}

const VetSlotStatistics: React.FC<VetSlotStatisticsProps> = ({ 
  data, 
  loading, 
  error 
}) => {
  if (loading) {
    return <VetSlotStatisticsSkeleton />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <Activity className="w-8 h-8 mx-auto mb-2" />
            <p>Failed to load statistics: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);

  const formatTime = (time: string) => {
    if (time === "N/A") return time;
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Slot Statistics</h2>
          <p className="text-gray-600">
            {format(new Date(data.dateRange.start), 'MMM dd, yyyy')} - {format(new Date(data.dateRange.end), 'MMM dd, yyyy')}
          </p>
          <p className="text-sm text-gray-500">Timezone: {data.timezone}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-3 h-3 mr-1" />
          {data.totalPeriods} periods
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalSlots}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Available: {data.availableSlots}</span>
                <span>Booked: {data.bookedSlots}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalHours}h</p>
              </div>
              <Timer className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Available: {data.availableHours}h</span>
                <span>Booked: {data.bookedHours}h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{data.utilizationRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Progress value={data.utilizationRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.actualRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Potential: {formatCurrency(data.potentialRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slot Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Slot Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{data.availableSlots}</span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({data.availabilityRate}%)
                  </span>
                </div>
              </div>
              <Progress value={data.availabilityRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Booked</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{data.bookedSlots}</span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({data.utilizationRate}%)
                  </span>
                </div>
              </div>
              <Progress value={data.utilizationRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Disabled</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{data.disabledSlots}</span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({((data.disabledSlots / data.totalSlots) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress value={(data.disabledSlots / data.totalSlots) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Earliest Slot</p>
                <p className="font-semibold">{formatTime(data.earliestSlotTime)}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Latest Slot</p>
                <p className="font-semibold">{formatTime(data.latestSlotTime)}</p>
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Most Active Hour</p>
              <p className="font-semibold text-blue-700">{formatTime(data.mostActiveHour)}</p>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Period Duration</p>
              <p className="font-semibold text-green-700">{data.averagePeriodDuration}h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.dailyStats.map((day, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{format(new Date(day.date), 'EEEE, MMM dd, yyyy')}</h4>
                    <p className="text-sm text-gray-500">{day.periods} periods • {day.totalHours}h total</p>
                  </div>
                  <Badge variant="outline">
                    {day.totalSlots} slots
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{day.availableSlots}</p>
                    <p className="text-xs text-gray-500">Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{day.bookedSlots}</p>
                    <p className="text-xs text-gray-500">Booked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{day.disabledSlots}</p>
                    <p className="text-xs text-gray-500">Disabled</p>
                  </div>
                </div>

                {day.availableTimes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Times:</p>
                    <div className="flex flex-wrap gap-2">
                      {day.availableTimes.map((time, timeIndex) => (
                        <Badge key={timeIndex} variant="secondary" className="text-xs">
                          {formatTime(time.from)} - {formatTime(time.to)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-700">{data.slotsCreatedToday}</p>
              <p className="text-sm text-gray-600">Slots Created Today</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-700">{data.slotsBookedToday}</p>
              <p className="text-sm text-gray-600">Slots Booked Today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const VetSlotStatisticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VetSlotStatistics;
