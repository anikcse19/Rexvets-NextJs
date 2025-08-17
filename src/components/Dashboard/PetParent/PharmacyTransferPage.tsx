"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, FileText, History } from "lucide-react";
import {
  PharmacyFormData,
  PharmacyRequest,
} from "@/lib/types/pharmacy-transfer";
import {
  mockAppointments,
  mockPharmacyRequests,
} from "@/lib/data/pharmacy-request";
import { toast } from "sonner";
import { PharmacyForm } from "./PharmacyTransfer/PharmcayForm";
import { RequestsTable } from "./PharmacyTransfer/RequestTable";

export default function PharmacyTransferPage() {
  const [requests, setRequests] =
    useState<PharmacyRequest[]>(mockPharmacyRequests);

  const handleFormSubmit = (data: PharmacyFormData) => {
    // Find the selected appointment
    const selectedAppointment = mockAppointments.find(
      (apt) => apt.id === data.appointmentId
    );

    if (!selectedAppointment) {
      toast("Selected appointment not found");
      return;
    }

    // Create new request
    const newRequest: PharmacyRequest = {
      id: `req-${Date.now()}`,
      pharmacyName: data.pharmacyName,
      phoneNumber: data.phoneNumber,
      street: data.street,
      city: data.city,
      state: data.state,
      appointmentId: data.appointmentId,
      appointmentDate: selectedAppointment.date,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentStatus: "paid",
      amount: 19.99,
    };

    // Add to requests
    setRequests((prev) => [newRequest, ...prev]);

    toast(
      `Your prescription transfer request has been sent to ${data.pharmacyName}. You will receive updates on the status.`
    );
  };

  return (
    <div className="container mx-auto">
      {/* Main Content */}
      <Tabs defaultValue="history" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white shadow-sm border">
          <TabsTrigger
            value="request"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4" />
            New Request
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <History className="h-4 w-4" />
            Request History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="animate-slide-up">
          <RequestsTable requests={requests} />
        </TabsContent>

        <TabsContent value="request" className="animate-slide-up">
          <PharmacyForm onSubmit={handleFormSubmit} />
        </TabsContent>
      </Tabs>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Quick & Easy
          </h3>
          <p className="text-gray-600">
            Submit your prescription transfer request in just a few minutes
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure Payment
          </h3>
          <p className="text-gray-600">
            Safe and encrypted payment processing with industry-standard
            security
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
            <History className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Track Progress
          </h3>
          <p className="text-gray-600">
            Monitor the status of your transfer requests in real-time
          </p>
        </div>
      </div>
    </div>
  );
}
