"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface ParentInfoCardProps {
  parent: {
    id: string;
    name: string;
    image: string;
    email: string;
    phone: string;
    address: string;
    emergencyContact: string;
    relationshipToPet: string;
    memberSince: string;
  };
}

export default function ParentInfoCard({ parent }: ParentInfoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCall = () => {
    window.open(`tel:${parent.phone}`, "_self");
  };

  const handleEmail = () => {
    window.open(`mailto:${parent.email}`, "_self");
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
              Pet Parent Information
            </CardTitle>
            <p className="text-blue-100">
              Contact details and relationship info
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Parent Profile */}
          <div className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-blue-100 shadow-lg">
              <AvatarImage
                src={parent.image}
                alt={parent.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xl font-bold text-gray-800 bg-gradient-to-br from-blue-100 to-cyan-100">
                {parent.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {parent.name}
            </h3>
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 mb-3">
              {parent.relationshipToPet}
            </Badge>
            <p className="text-sm text-gray-600">
              Member since {formatDate(parent.memberSince)}
            </p>
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
                  <p className="font-semibold text-gray-900">{parent.email}</p>
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
                  <p className="font-semibold text-gray-900">{parent.phone}</p>
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

            {/* Emergency Contact */}
            <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white p-2 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Emergency Contact
                  </p>
                  <p className="font-semibold text-red-900">
                    {parent.emergencyContact}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Address
            </h4>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <p className="text-gray-900 font-medium leading-relaxed">
                {parent.address}
              </p>
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
