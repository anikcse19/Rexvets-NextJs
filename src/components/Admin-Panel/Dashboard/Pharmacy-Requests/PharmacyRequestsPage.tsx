"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "../../Shared/Pagination";
// import { FaRegFilePdf } from "react-icons/fa6";

interface PharmacyRequest {
  id: string;
  ParentName: string;
  ParentEmail: string;
  PharmacyName: string;
  PharmacyAddress: string;
  PharmacyCity: string;
  PharmacyState: string;
  amount: number;
  status: string;
  prescriptionPDF: string;
  created_at: string;
  PaymentMethod?: {
    id: string;
  };
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
    const q = query(
      collection(db, "TransferPharmacyRequest"),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as PharmacyRequest)
    );
    setRequests(data);
    setFilteredRequests(data);
    setLoading(false);
  };

  const handleAccept = async (request: PharmacyRequest) => {
    try {
      setIsAcceptedLoading({ id: request.id, loading: true });
      const docRef = doc(db, "TransferPharmacyRequest", request.id);
      await updateDoc(docRef, { status: "accepted" });

      fetchRequests();
      toast.success("Request accepted and email sent successfully");

      await fetch(
        "https://rexvetsemailserver.up.railway.app/sendRequestAccpetedEmail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: request.ParentEmail,
            name: request.ParentName,
            transactionId: request.PaymentMethod?.id,
            amount: request.amount,
            pharmacyName: request.PharmacyName,
            pharmacyAddress: request.PharmacyAddress,
            pharmacyCity: request.PharmacyCity,
            pharmacyState: request.PharmacyState,
            date: new Date(request.created_at).toLocaleDateString(),
          }),
        }
      );
    } catch (error) {
      console.error("Error accepting request:", error);
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
          r.ParentName.toLowerCase().includes(search.toLowerCase()) ||
          r.ParentEmail.toLowerCase().includes(search.toLowerCase()) ||
          r.PharmacyName.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search by name, email, or pharmacy"
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
              <SelectItem value="accepted">Accepted</SelectItem>
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
                <TableRow key={req.id}>
                  <TableCell>{req.ParentName}</TableCell>
                  <TableCell>{req.ParentEmail}</TableCell>
                  <TableCell>{req.PharmacyName}</TableCell>
                  <TableCell>${req.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(req.prescriptionPDF) &&
                    req.prescriptionPDF.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-[#dee8fa] border-[#002366] border-2 text-[#002366] gap-2 hover:text-white hover:bg-[#1a3a80]"
                          >
                            Available Prescriptions
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-gray-700 dark:border-slate-600 space-y-1 p-2">
                          {req.prescriptionPDF.map((pdfUrl, index) => (
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
                    {new Date(req.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {req.status === "pending" ? (
                      <Button
                        size="sm"
                        className="bg-[#002366] text-white hover:bg-[#1a3a80]"
                        onClick={() => handleAccept(req)}
                      >
                        {isAcceptedLoading.id === req.id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          "Accept"
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
