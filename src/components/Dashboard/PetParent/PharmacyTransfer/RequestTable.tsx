"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  History,
} from "lucide-react";
import { PharmacyRequest } from "@/lib/types/pharmacy-transfer";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RequestsTableProps {
  requests: PharmacyRequest[];
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  processing: {
    icon: AlertCircle,
    label: "Processing",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
} as const;

const paymentStatusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  paid: {
    icon: CheckCircle2,
    label: "Paid",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  unpaid: {
    icon: XCircle,
    label: "Unpaid",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  refunded: {
    icon: AlertCircle,
    label: "Refunded",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
} as const;

export function RequestsTable({ requests }: RequestsTableProps) {
  if (requests?.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Transfer Requests
          </h3>
          <p className="text-gray-600">
            You haven&apos;t submitted any prescription transfer requests yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <History className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Transfer Request History
            </CardTitle>
            <CardDescription className="text-gray-600">
              Track the status of your prescription transfer requests
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {requests?.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">
              You haven&apos;t submitted any prescription transfer requests yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block w-full overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Pharmacy</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Appointment Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => {
                    const StatusIcon = statusConfig[request.status].icon;
                    return (
                      <TableRow key={request._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {request.pharmacyName}
                        </TableCell>
                        <TableCell>{request.phoneNumber}</TableCell>
                        <TableCell>
                          {request.street}
                          <br />
                          {request.city}, {request.state}
                        </TableCell>
                        <TableCell>
                          {formatDate(request.appointment?.appointmentDate)}
                        </TableCell>
                        <TableCell>{formatCurrency(request.amount)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              paymentStatusConfig[request.paymentStatus]
                                .className
                            }
                          >
                            {paymentStatusConfig[request.paymentStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              statusConfig[request.status].className
                            } flex items-center gap-1`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[request.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-4 md:hidden">
              {requests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon;
                return (
                  <div
                    key={request._id}
                    className="p-4 bg-white rounded-lg shadow border space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">
                        {request.pharmacyName}
                      </h3>
                      <Badge
                        className={
                          paymentStatusConfig[request.paymentStatus].className
                        }
                      >
                        {paymentStatusConfig[request.paymentStatus].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.street}, {request.city}, {request.state}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Appointment:</span>{" "}
                      {formatDate(request.appointment?.appointmentDate)}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(request.amount)}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${
                          statusConfig[request.status].className
                        } flex items-center gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[request.status].label}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
