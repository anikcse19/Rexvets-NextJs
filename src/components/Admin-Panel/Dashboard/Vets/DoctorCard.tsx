"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VeterinarianStatus } from "@/lib/constants/veterinarian";
import { Doctor } from "@/lib/types";
import {
  Ban,
  Check,
  Edit,
  Ellipsis,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Rating } from "react-simple-star-rating";

interface DoctorCardProps {
  doctor: Doctor;
  onViewDetails: (doctor: Doctor) => void;
  handleStatusChange: (id: string, status: VeterinarianStatus) => void;
}

export function DoctorCard({
  doctor,
  onViewDetails,
  handleStatusChange,
}: DoctorCardProps) {
  // const activeDays = doctor.Schedule.filter((d) => d.checked).length;

  const statusColor =
    {
      approved: "text-green-600 border-green-300",
      pending: "text-yellow-600 border-yellow-300",
      suspended: "text-red-600 border-red-300",
    }[doctor.status] || "text-gray-600 border-gray-300";

  <Badge variant="outline" className={`mt-1 text-xs ${statusColor}`}>
    {{
      approved: "Approved",
      pending: "Pending",
      suspended: "Suspended",
    }[doctor.status] || ""}
  </Badge>;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 dark:bg-slate-800 bg-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={doctor.profileImage} alt={doctor.firstName} />
              <AvatarFallback className="text-lg dark:text-white">
                {(doctor.firstName?.[0] || '') + (doctor.lastName?.[0] || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold dark:text-gray-100 text-gray-900">
                Dr. {doctor?.firstName} {doctor?.lastName}, {doctor?.degree}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm dark:text-gray-300 text-gray-600">
                  {doctor?.specialization}
                </p>
                <Rating
                  readonly
                  size={18}
                  allowFraction
                  initialValue={doctor?.rating}
                  SVGstyle={{ display: "inline" }}
                  fillColor="#f59e0b" // amber-500
                />
              </div>
              <Badge
                variant="outline"
                className={`mt-1 text-xs ${
                  {
                    approved: "text-green-600 border-green-300",
                    pending: "text-yellow-600 border-yellow-300",
                    suspended: "text-red-600 border-red-300",
                  }[doctor.status] ||
                  "text-gray-600 dark:text-gray-300  border-gray-300"
                }`}
              >
                {{
                  approved: "Approved",
                  pending: "Pending",
                  suspended: "Suspended",
                }[doctor.status] || "Not Set"}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="outline-none" variant="ghost" size="icon">
                <Ellipsis className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="dark:bg-slate-800 dark:border-slate-600"
              align="end"
            >
              <DropdownMenuItem onClick={() => onViewDetails(doctor)}>
                <Eye className="w-4 h-4 mr-2" /> View Details
              </DropdownMenuItem>
              {doctor?.status === VeterinarianStatus.SUSPENDED ||
              doctor?.status === VeterinarianStatus.PENDING ? (
                <DropdownMenuItem
                  onClick={() => {
                    handleStatusChange(doctor?._id, VeterinarianStatus.APPROVED);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" /> Approve Profile
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    handleStatusChange(doctor?._id, VeterinarianStatus.SUSPENDED);
                  }}
                >
                  <Ban className="w-4 h-4 mr-2" /> Suspend Profile
                </DropdownMenuItem>
              )}

              {/* <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                <a
                  href={doctor.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  View CV
                </a>
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <ShieldCheck className="w-4 h-4 mr-2" />
                <a
                  href={doctor.licenses[0]?.licenseFile!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  License #{doctor.licenses[0]?.licenseNumber}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm dark:text-gray-100 text-gray-600">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>{doctor?.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm dark:text-gray-100  text-gray-600">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{doctor?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm dark:text-gray-100  text-gray-600">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>
              {doctor?.city}, {doctor?.state}
            </span>
          </div>
        </div>

        {/* <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-100 ">
              Available Days:
            </span>
            <span className="font-medium dark:text-gray-100 ">
              {activeDays}/7 days
            </span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
