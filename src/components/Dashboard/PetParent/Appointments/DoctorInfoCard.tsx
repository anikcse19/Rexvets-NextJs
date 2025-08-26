"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Award,
  ExternalLink,
  Star,
  GraduationCap,
  Building,
  Shield,
} from "lucide-react";
import { Doctor } from "@/lib/types";

interface DoctorInfoCardProps {
  doctor: Doctor;
}

export default function DoctorInfoCard({ doctor }: DoctorInfoCardProps) {
  const handleCall = () => {
    window.open(`tel:${doctor.phoneNumber}`, "_self");
  };

  const handleEmail = () => {
    window.open(`mailto:${doctor.email}`, "_self");
  };

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Your Doctor
            </CardTitle>
            <p className="text-blue-100">
              Professional veterinarian information
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Doctor Profile */}
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-blue-100 shadow-lg">
              <AvatarImage
                src={doctor.profileImage}
                alt={doctor.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xl font-bold text-gray-800 bg-gradient-to-br from-blue-100 to-cyan-100">
                {doctor.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {doctor.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(doctor.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {doctor.rating} ({doctor.reviewsCount} reviews)
              </span>
            </div>

            <Badge className="bg-blue-100 text-blue-700 border-blue-300 mb-2">
              {doctor.yearsOfExperience} Experience
            </Badge>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-600" />
              Specialties
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor?.specialties?.map((specialty, index) => (
                <Badge
                  key={index}
                  className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 text-white p-2 rounded-lg flex-shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-purple-900 mb-1">Education</p>
                <p className="text-purple-800 text-sm leading-relaxed">
                  {doctor.education}
                </p>
              </div>
            </div>
          </div>

          {/* License */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white p-2 rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-green-900">License Number</p>
                <p className="text-green-700 font-mono text-sm">
                  {/* {doctor.licenseNumber} */}
                </p>
              </div>
            </div>
          </div>

          {/* Clinic Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              Clinic Information
            </h4>

            <div className="space-y-3">
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                <p className="font-medium text-teal-900">
                  {doctor?.clinic?.name}
                </p>
                <p className="text-teal-700 text-sm mt-1">
                  {doctor?.clinic?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Contact Information
            </h4>

            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white p-2 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{doctor.email}</p>
                </div>
              </div>
              <Button
                onClick={handleEmail}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">
                    {doctor.phoneNumber}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCall}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCall}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              onClick={handleEmail}
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
