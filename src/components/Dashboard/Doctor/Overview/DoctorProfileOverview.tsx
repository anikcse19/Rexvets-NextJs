import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Users } from "lucide-react";
import React from "react";


const DoctorProfileOverview = () => {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Profile Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage
              src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face"
              alt="Dr. Anik Rahman"
            />
            <AvatarFallback className="text-lg font-bold text-gray-800">
              AR
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-gray-900">Dr. Anik Rahman</h3>
          <p className="text-sm text-gray-600">
            DVM, PhD in Veterinary Medicine
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Experience</span>
            <span className="font-semibold text-gray-900">12 Years</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Success Rate</span>
            <span className="font-semibold text-green-600">98.5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Patient Satisfaction</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">4.9/5</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Monthly Goal</span>
              <span className="text-sm font-semibold text-gray-900">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileOverview;
