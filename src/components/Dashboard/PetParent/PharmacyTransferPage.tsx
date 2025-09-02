"use client";

import { useEffect, useState } from "react";

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
import { useSession } from "next-auth/react";

export default function PharmacyTransferPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<PharmacyRequest[]>();
  const [changesData, setChangesData] = useState(false);

  const fetchPharmacyTransferRequest = async () => {
    try {
      const res = await fetch(
        `/api/pharmacy-transfer/pet-parent/${session?.user?.refId}`
      );
      if (!res?.ok) {
        throw new Error();
      }

      const data = await res.json();
      setRequests(data?.data);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPharmacyTransferRequest();
    }
  }, [session, changesData]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Content */}
      <Tabs defaultValue="history" className="space-y-6 sm:space-y-8">
        {/* Responsive Tabs */}
        <TabsList className="flex flex-col sm:flex-row w-full max-w-full sm:max-w-md mx-auto bg-white shadow-sm border rounded-lg overflow-hidden">
          <TabsTrigger
            value="request"
            className="flex items-center justify-center gap-2 w-full py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">New Request</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center justify-center gap-2 w-full py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Request History</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="history" className="animate-slide-up">
          <RequestsTable requests={requests!} />
        </TabsContent>

        <TabsContent value="request" className="animate-slide-up">
          <PharmacyForm setChangesData={setChangesData} />
        </TabsContent>
      </Tabs>

      {/* Features Section */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Quick & Easy
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
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
          <p className="text-gray-600 text-sm sm:text-base">
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
          <p className="text-gray-600 text-sm sm:text-base">
            Monitor the status of your transfer requests in real-time
          </p>
        </div>
      </div>
    </div>
  );
}
