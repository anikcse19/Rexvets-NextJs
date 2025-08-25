import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Info, Timer } from "lucide-react";
import React, { useState } from "react";

const BookingNoticePeriod = () => {
  const [bookingNotice, setBookingNotice] = useState<15 | 30>(15);
  const [hasChanges, setHasChanges] = useState(false);

  const handleBookingNoticeChange = (minutes: 15 | 30) => {
    setBookingNotice(minutes);
    setHasChanges(true);
  };

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Booking Notice Period
            </CardTitle>
            <p className="text-blue-100 mt-1">
              Set how far in advance appointments can be booked
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Information Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full p-1.5 flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  How Booking Notice Works
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  The booking notice period determines when appointment slots
                  become unavailable for booking. This gives you time to prepare
                  for appointments and prevents last-minute bookings.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700">
                      <strong>15 minutes:</strong> A 10:00 AM slot closes at
                      9:45 AM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700">
                      <strong>30 minutes:</strong> A 10:00 AM slot closes at
                      9:30 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notice Period Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                bookingNotice === 15
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
              // onClick={() => handleBookingNoticeChange(15)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      bookingNotice === 15
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      15 Minutes
                    </h3>
                    <p className="text-sm text-gray-600">Quick turnaround</p>
                  </div>
                </div>
                {bookingNotice === 15 && (
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700">
                Allows more flexibility for patients while giving you a brief
                preparation window.
              </p>
            </div>

            <div
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                bookingNotice === 30
                  ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg"
                  : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
              }`}
              // onClick={() => handleBookingNoticeChange(30)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      bookingNotice === 30
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      30 Minutes
                    </h3>
                    <p className="text-sm text-gray-600">
                      More preparation time
                    </p>
                  </div>
                </div>
                {bookingNotice === 30 && (
                  <div className="bg-purple-500 text-white rounded-full p-1">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700">
                Provides more time to prepare for appointments and review
                patient history.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingNoticePeriod;
