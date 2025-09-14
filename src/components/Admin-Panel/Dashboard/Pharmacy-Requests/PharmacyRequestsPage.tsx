"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, FileText, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Pagination from "../../Shared/Pagination";
import { Prescription } from "@/lib/types";
import { sendPharmacyAcceptedEmail } from "@/lib/email";
// import { FaRegFilePdf } from "react-icons/fa6";

interface PharmacyRequest {
  _id: string;
  pharmacyName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  appointment: {
    _id: string;
    petParent: {
      _id: string;
      name: string;
      email: string;
    };
    pet: {
      _id: string;
      name: string;
    };
    appointmentDate: string;
  };
  petParentId: {
    _id: string;
    name: string;
    email: string;
  };
  appointmentDate?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  prescriptions: string[];
  amount: number;
  transactionID?: string;
  paymentIntentId?: string;
  stripeCustomerId?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export default function PharmacyRequestsPage() {
  const [requests, setRequests] = useState<PharmacyRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PharmacyRequest[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [isAcceptedLoading, setIsAcceptedLoading] = useState({
    id: "",
    loading: false,
  });
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pharmacy-transfer");

      if (!response.ok) {
        throw new Error("Failed to fetch pharmacy requests");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch pharmacy requests");
      }

      const data = result.data as PharmacyRequest[];
      console.log("Fetched pharmacy requests:", data.length);
      console.log("Sample request:", data[0]);
      console.log("PetParentId structure:", data[0]?.petParentId);
      console.log("Appointment structure:", data[0]?.appointment);

      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Error fetching pharmacy requests:", error);
      toast.error("Failed to fetch pharmacy requests");
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (request: PharmacyRequest) => {
    try {
      console.log("request", request);
      setIsAcceptedLoading({ id: request._id, loading: true });

      const emailBody = {
        to: request.petParentId?.email || "",
        name: request.petParentId?.name || "",
        transactionId: request.transactionID || "",
        amount: request.amount || 0,
        pharmacyName: request.pharmacyName || "",
        pharmacyAddress: request.street || "",
        pharmacyCity: request.city || "",
        pharmacyState: request.state || "",
        date: request.createdAt
          ? new Date(request.createdAt).toLocaleDateString()
          : "",
      };

      // Update status via API
      const response = await fetch("/api/pharmacy-transfer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: request._id,
          status: "approved",
          emailBody,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to update request status");
      }

      // Refresh the requests list
      await fetchRequests();
      toast.success("Request approved and email sent successfully");

      // Send email notification
      // await fetch(
      //   "https://rexvetsemailserver.up.railway.app/sendRequestAccpetedEmail",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       to: request.petParentId?.email || "",
      //       name: request.petParentId?.name || "",
      //       transactionId: request.transactionID || "",
      //       amount: request.amount || 0,
      //       pharmacyName: request.pharmacyName || "",
      //       pharmacyAddress: request.street || "",
      //       pharmacyCity: request.city || "",
      //       pharmacyState: request.state || "",
      //       date: request.createdAt
      //         ? new Date(request.createdAt).toLocaleDateString()
      //         : "",
      //     }),
      //   }
      // );
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to approve request");
    } finally {
      setIsAcceptedLoading({ id: "", loading: false });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = [...requests];
    if (search) {
      filtered = filtered.filter(
        (r) =>
          (r.petParentId?.name || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (r.petParentId?.email || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (r.pharmacyName || "").toLowerCase().includes(search.toLowerCase()) ||
          (r.city || "").toLowerCase().includes(search.toLowerCase()) ||
          (r.state || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    setFilteredRequests(filtered);
  }, [search, statusFilter, requests]);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredRequests.slice(start, end);
  }, [filteredRequests, currentPage]);

  return (
    // <RequireAccess permission="Pharmacy Request">
    <Card className=" mt-10 shadow-lg lg:p-6 dark:bg-slate-800 bg-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold dark:text-blue-500 text-[#002366]">
          Pharmacy Transfer Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search by name, email, pharmacy, city, or state"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 dark:bg-gray-700 dark:border-slate-600"
          />
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val)}
          >
            <SelectTrigger className="w-full sm:w-1/4 dark:bg-gray-700 dark:border-slate-600">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-slate-600 ">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#f0f4ff] dark:bg-slate-800 dark:text-blue-400 text-[#002366]">
              <TableCell className="font-bold">Parent</TableCell>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell className="font-bold">Pharmacy</TableCell>
              <TableCell className="font-bold">Amount</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold">Prescription</TableCell>
              <TableCell className="font-bold">Date</TableCell>
              <TableCell className="font-bold">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="h-24">
                <TableCell colSpan={7} align="center">
                  <Loader2 />
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.petParentId?.name || "N/A"}</TableCell>
                  <TableCell>{req.petParentId?.email || "N/A"}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {req.pharmacyName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {req.street || ""}, {req.city || ""}, {req.state || ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${(req.amount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {req.status || "unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(req.prescriptions) &&
                    req.prescriptions.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-[#dee8fa] border-[#002366] border-2 text-[#002366] gap-2 hover:text-white hover:bg-[#1a3a80] cursor-pointer"
                          >
                            Available Prescriptions
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-gray-700 dark:border-slate-600 space-y-1 p-2">
                          {req.prescriptions.map((pdfUrl: any, index) => (
                            <DropdownMenuItem
                              key={index}
                              asChild
                              className="py-0 px-2 cursor-pointer hover:outline-none" // remove default padding for cleaner look
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full flex justify-between items-center gap-2"
                                onClick={() => window.open(pdfUrl)}
                              >
                                Download Prescription {index + 1}
                                <FileText className="w-4 h-4" />
                              </Button>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <>Not Available</>
                    )}
                  </TableCell>

                  <TableCell>
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {req.status === "pending" ? (
                      <Button
                        size="sm"
                        className="bg-[#002366] text-white hover:bg-[#1a3a80]"
                        onClick={() => handleAccept(req)}
                      >
                        {isAcceptedLoading.id === req._id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <Pagination
        totalItems={filteredRequests.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </Card>
    // </RequireAccess>
  );
}
