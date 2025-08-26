import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Star,
  Stethoscope,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Doctor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DoctorDetailsProps {
  veterinarian: Doctor | null;
  date: string | null;
  time: string | null;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({
  veterinarian,
  date,
  time,
}) => {
  return (
    <Card className="mb-8 border border-gray-200 bg-white backdrop-blur-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          Your Veterinarian
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
              <AvatarImage
                src={veterinarian?.profileImage}
                alt={veterinarian?.name}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                {veterinarian?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {veterinarian?.name}
              </h3>
              <p className="text-xl text-blue-600 font-semibold mb-3">
                {veterinarian?.specialization}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(veterinarian?.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {veterinarian?.rating}/5.0
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {veterinarian?.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">
                    {veterinarian?.state}, {veterinarian?.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-semibold text-gray-900">
                    {veterinarian?.yearsOfExperience}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {date}, {time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">30 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorDetails;
