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
        {/* Responsive wrapper */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">
                  Pharmacy
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Contact
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Address
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Appointment Date
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Payment
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Submitted
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests &&
                requests?.map((request) => {
                  const StatusIcon = statusConfig[request?.status].icon;
                  return (
                    <TableRow
                      key={request?._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {request?.pharmacyName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {request?.phoneNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {request?.street}
                          <br />
                          {request?.city}, {request?.state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {formatDate(request?.appointment?.appointmentDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(request?.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            paymentStatusConfig[request?.paymentStatus]
                              .className
                          }
                        >
                          {paymentStatusConfig[request?.paymentStatus].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusConfig[request?.status].className
                          } flex items-center gap-1 w-fit`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[request?.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(request?.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
