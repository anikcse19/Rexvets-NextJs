"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Pill,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

interface PetHealthSummaryProps {
  pet: {
    name: string;
    totalVisits: number;
    healthStatus: string;
  };
  history: Array<{
    visitDate: string;
    diagnosis?: string;
    medications?: string[];
    followUpNeeded: boolean;
  }>;
  healthTrend: string;
}

export default function PetHealthSummary({
  pet,
  history,
  healthTrend,
}: PetHealthSummaryProps) {
  const calculateHealthMetrics = () => {
    const totalVisits = history.length;
    const routineVisits = history.filter(
      (h) =>
        !h.diagnosis ||
        h.diagnosis.toLowerCase().includes("routine") ||
        h.diagnosis.toLowerCase().includes("checkup")
    ).length;
    const emergencyVisits = history.filter(
      (h) =>
        h.diagnosis?.toLowerCase().includes("emergency") ||
        h.diagnosis?.toLowerCase().includes("urgent")
    ).length;
    const followUpVisits = history.filter((h) => h.followUpNeeded).length;
    const medicationVisits = history.filter(
      (h) => h.medications && h.medications.length > 0
    ).length;

    return {
      totalVisits,
      routineVisits,
      emergencyVisits,
      followUpVisits,
      medicationVisits,
      routinePercentage:
        totalVisits > 0 ? Math.round((routineVisits / totalVisits) * 100) : 0,
      medicationPercentage:
        totalVisits > 0
          ? Math.round((medicationVisits / totalVisits) * 100)
          : 0,
    };
  };

  const getRecentTrends = () => {
    const recentVisits = history.slice(0, 3);
    const hasRecentIssues = recentVisits.some(
      (visit) =>
        visit.diagnosis?.toLowerCase().includes("infection") ||
        visit.diagnosis?.toLowerCase().includes("injury") ||
        visit.followUpNeeded
    );

    const medicationTrend = recentVisits.filter(
      (v) => v.medications && v.medications.length > 0
    ).length;

    return {
      hasRecentIssues,
      medicationTrend,
      lastVisitDate: history[0]?.visitDate,
    };
  };

  const getCommonConditions = () => {
    const conditions: { [key: string]: number } = {};
    history.forEach((record) => {
      if (record.diagnosis) {
        const diagnosis = record.diagnosis.toLowerCase();
        if (diagnosis.includes("infection"))
          conditions["Infections"] = (conditions["Infections"] || 0) + 1;
        if (diagnosis.includes("checkup") || diagnosis.includes("routine"))
          conditions["Routine Care"] = (conditions["Routine Care"] || 0) + 1;
        if (diagnosis.includes("vaccination"))
          conditions["Vaccinations"] = (conditions["Vaccinations"] || 0) + 1;
        if (diagnosis.includes("injury") || diagnosis.includes("wound"))
          conditions["Injuries"] = (conditions["Injuries"] || 0) + 1;
        if (diagnosis.includes("dental"))
          conditions["Dental Care"] = (conditions["Dental Care"] || 0) + 1;
      }
    });

    return Object.entries(conditions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const metrics = calculateHealthMetrics();
  const trends = getRecentTrends();
  const commonConditions = getCommonConditions();

  return (
    <div className="space-y-8">
      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {metrics.totalVisits}
                </p>
                <p className="text-blue-700 text-sm">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {metrics.routineVisits}
                </p>
                <p className="text-green-700 text-sm">Routine Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {metrics.medicationVisits}
                </p>
                <p className="text-purple-700 text-sm">With Medications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-900">
                  {metrics.followUpVisits}
                </p>
                <p className="text-orange-700 text-sm">Follow-ups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visit Type Distribution */}
        <Card className="shadow-lg border-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Visit Distribution
                </CardTitle>
                <p className="text-indigo-100">Breakdown of visit types</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Routine Care
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {metrics.routinePercentage}%
                  </span>
                </div>
                <Progress value={metrics.routinePercentage} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Medication Required
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {metrics.medicationPercentage}%
                  </span>
                </div>
                <Progress
                  value={metrics.medicationPercentage}
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.routineVisits}
                  </p>
                  <p className="text-green-700 text-sm">Routine</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-2xl font-bold text-red-600">
                    {metrics.emergencyVisits}
                  </p>
                  <p className="text-red-700 text-sm">Emergency</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Conditions */}
        <Card className="shadow-lg border-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Common Conditions
                </CardTitle>
                <p className="text-emerald-100">Most frequent visit reasons</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              {commonConditions.length > 0 ? (
                commonConditions.map(([condition, count], index) => (
                  <div
                    key={condition}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : index === 1
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                            : index === 2
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-gradient-to-r from-orange-500 to-red-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">
                        {condition}
                      </span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-300">
                      {count} visit{count !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No patterns identified yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Trend Analysis */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Health Trend Analysis
              </CardTitle>
              <p className="text-pink-100">
                Overall health pattern and recommendations
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Health Status */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Current Health Status
              </h3>

              <div
                className={`p-6 rounded-2xl border-2 ${
                  healthTrend === "stable"
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      healthTrend === "stable"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {healthTrend === "stable" ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xl font-bold ${
                        healthTrend === "stable"
                          ? "text-green-900"
                          : "text-yellow-900"
                      }`}
                    >
                      {healthTrend === "stable"
                        ? "Stable Health"
                        : "Needs Attention"}
                    </h4>
                    <p
                      className={`${
                        healthTrend === "stable"
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {healthTrend === "stable"
                        ? "Overall health pattern is positive"
                        : "Recent visits indicate need for monitoring"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Last Visit</span>
                    <span className="font-medium text-gray-900">
                      {new Date(trends.lastVisitDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Follow-ups Needed
                    </span>
                    <Badge
                      className={`${
                        metrics.followUpVisits > 0
                          ? "bg-orange-100 text-orange-700 border-orange-300"
                          : "bg-green-100 text-green-700 border-green-300"
                      }`}
                    >
                      {metrics.followUpVisits}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Medication Compliance
                    </span>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                      {metrics.medicationPercentage}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Recommendations
              </h3>

              <div className="space-y-4">
                {healthTrend === "stable" ? (
                  <>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">
                            Continue Current Care
                          </p>
                          <p className="text-green-700 text-sm">
                            Maintain current preventive care routine
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-900">
                            Regular Checkups
                          </p>
                          <p className="text-blue-700 text-sm">
                            Schedule routine visits every 6 months
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-semibold text-yellow-900">
                            Increased Monitoring
                          </p>
                          <p className="text-yellow-700 text-sm">
                            Consider more frequent checkups
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-semibold text-red-900">
                            Preventive Care
                          </p>
                          <p className="text-red-700 text-sm">
                            Focus on preventive measures
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Pill className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-purple-900">
                        Medication Review
                      </p>
                      <p className="text-purple-700 text-sm">
                        Review current medications and effectiveness
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Conditions Chart */}
      {commonConditions.length > 0 && (
        <Card className="shadow-lg border-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Condition Frequency
                </CardTitle>
                <p className="text-teal-100">
                  Most common visit reasons for {pet.name}
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              {commonConditions.map(([condition, count], index) => (
                <div key={condition} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                      index === 0
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                        : index === 1
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                        : index === 2
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-orange-500 to-red-500"
                    }`}
                  >
                    {count}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{condition}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0
                            ? "bg-gradient-to-r from-teal-400 to-cyan-400"
                            : index === 1
                            ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                            : index === 2
                            ? "bg-gradient-to-r from-purple-400 to-pink-400"
                            : "bg-gradient-to-r from-orange-400 to-red-400"
                        }`}
                        style={{
                          width: `${
                            (count /
                              Math.max(...commonConditions.map(([, c]) => c))) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {count} visit{count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
