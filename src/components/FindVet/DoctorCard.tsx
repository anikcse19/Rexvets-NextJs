import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import moment from "moment";

import {
  Award,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Veterinarian } from "./type";

interface DoctorCardProps {
  doctor: Veterinarian & {
    nextAvailableSlots?: Array<{
      _id: string;
      date: string;
      startTime: string;
      endTime: string;
      timezone: string;
      status: string;
      notes?: string;
    }>;
    averageRating?: number;
    reviewCount?: number;
    ratingCount?: number;
  };
  viewMode: "grid" | "list";
}

export default function DoctorCard({ doctor, viewMode }: DoctorCardProps) {
  const formatDate = (dateString: string, timezone?: string) => {
    if (timezone) {
      // Convert the date to user's timezone
      const { formattedDate } = convertTimesToUserTimezone(
        "00:00", // dummy time for date conversion
        "00:00", // dummy time for date conversion
        dateString,
        timezone
      );
      return moment(formattedDate).format("dddd, MMM DD, YYYY");
    }
    return moment(dateString).format("dddd, MMM DD, YYYY");
  };

  const formatTime = (timeString: string) => {
    return timeString; // Already in HH:mm format
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (viewMode === "list") {
    return (
      <article
        itemScope
        itemType="https://schema.org/Veterinary"
        className="group"
      >
        <Link href={`/find-a-vet/${doctor.id || doctor._id}`}>
          <Card className="group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {doctor.profileImage ? (
                      <img
                        src={doctor.profileImage}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-700">
                        {doctor.name
                          .split(" ")
                          .map((n) => n.charAt(0))
                          .join("")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-gray-600">{doctor.specialization}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(doctor.averageRating || 0)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {doctor.averageRating?.toFixed(1) || "0"} (
                        {doctor.reviewCount || 0} reviews)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.state || "Location not specified"}</span>
                    </div>
                    {doctor.yearsOfExperience && (
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{doctor.yearsOfExperience} years</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>${doctor.consultationFee}/consultation</span>
                    </div>
                  </div>

                  {/* Next Available Slots */}
                  {doctor.nextAvailableSlots &&
                    doctor.nextAvailableSlots.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          Next Available Slots
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.nextAvailableSlots
                            .slice(0, 3)
                            .map((slot, index) => (
                              <Badge
                                key={slot._id}
                                variant="secondary"
                                className="gap-1"
                              >
                                <Calendar className="w-3 h-3" />
                                {formatDate(slot.date)} at{" "}
                                {formatTime(slot.startTime)}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Hidden structured data for SEO */}
        <div style={{ display: "none" }}>
          <meta itemProp="name" content={doctor.name} />
          <meta
            itemProp="description"
            content={`Veterinarian ${doctor.name} specializing in ${
              doctor.specialization || "pet care"
            }`}
          />
          <meta
            itemProp="url"
            content={`https://www.rexvet.org/find-a-vet/${
              doctor.id || doctor._id
            }`}
          />
          {doctor.phoneNumber && (
            <meta itemProp="telephone" content={doctor.phoneNumber} />
          )}
          {doctor.state && (
            <meta itemProp="addressRegion" content={doctor.state} />
          )}
          {doctor.specialization && (
            <meta itemProp="specialty" content={doctor.specialization} />
          )}
          {doctor.profileImage && (
            <meta itemProp="image" content={doctor.profileImage} />
          )}
          {doctor.bio && <meta itemProp="description" content={doctor.bio} />}
        </div>
      </article>
    );
  }
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Grid View (default)
  return (
    <article
      itemScope
      itemType="https://schema.org/Veterinary"
      className="group"
    >
      <Link href={`/find-a-vet/${doctor.id || doctor._id}`}>
        <Card className="group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden">
          {/* Header with gradient background */}
          <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Avatar */}
            <div className="absolute bottom-4 left-4">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
                {doctor.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700">
                      {doctor.name
                        .split(" ")
                        .map((n) => n.charAt(0))
                        .join("")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 text-gray-700 border-0 gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {doctor.averageRating?.toFixed(1) || "0"}
              </Badge>
            </div>

            {/* State Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-gray-700 border-0">
                <MapPin className="w-3 h-3 mr-1" />
                {doctor.state || "N/A"}
              </Badge>
            </div>

            {/* Available Now Badge */}
            {doctor.nextAvailableSlots &&
              doctor.nextAvailableSlots.length > 0 && (
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-green-500 text-white border-0 gap-1">
                    <Clock className="w-3 h-3" />
                    Available
                  </Badge>
                </div>
              )}
          </div>

          {/* Content */}
          <CardContent className="p-6 space-y-4">
            {/* Name and Specialization */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {doctor.name}
              </h3>
              <p className="text-gray-600 text-sm">{doctor.specialization}</p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(doctor.averageRating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  ({doctor.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Experience and Location */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {doctor.yearsOfExperience && (
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{doctor.yearsOfExperience} years</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{doctor.state || "Location not specified"}</span>
              </div>
            </div>

            {/* Next Available Slots */}
            {doctor.nextAvailableSlots &&
              doctor.nextAvailableSlots.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Next Available
                  </h4>
                  <div className="space-y-2">
                    {doctor.nextAvailableSlots
                      .slice(0, 2)
                      .map((slot, index) => {
                        const { formattedStartTime, formattedEndTime } =
                          convertTimesToUserTimezone(
                            slot.startTime,
                            slot.endTime,
                            slot.date,
                            slot.timezone || "UTC"
                          );
                        return (
                          <div
                            key={slot._id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <span className="text-green-700 font-medium">
                                {formatDate(slot.date, slot.timezone)}
                              </span>
                            </div>
                            <span className="text-green-600 font-semibold">
                              {formattedStartTime} - {formattedEndTime}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </Link>

      {/* Hidden structured data for SEO */}
      <div style={{ display: "none" }}>
        <meta itemProp="name" content={doctor.name} />
        <meta
          itemProp="description"
          content={`Veterinarian ${doctor.name} specializing in ${
            doctor.specialization || "pet care"
          }`}
        />
        <meta
          itemProp="url"
          content={`https://www.rexvet.org/find-a-vet/${
            doctor.id || doctor._id
          }`}
        />
        {doctor.phoneNumber && (
          <meta itemProp="telephone" content={doctor.phoneNumber} />
        )}
        {doctor.state && (
          <meta itemProp="addressRegion" content={doctor.state} />
        )}
        {doctor.specialization && (
          <meta itemProp="specialty" content={doctor.specialization} />
        )}
        {doctor.profileImage && (
          <meta itemProp="image" content={doctor.profileImage} />
        )}
        {doctor.bio && <meta itemProp="description" content={doctor.bio} />}
      </div>
    </article>
  );
}
