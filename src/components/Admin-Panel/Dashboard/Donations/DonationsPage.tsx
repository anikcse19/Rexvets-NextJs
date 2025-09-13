"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Search, Trash, FilePenLine } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Removed Firestore imports - now using MongoDB APIs
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IDonation } from "@/models/Donation";
import Pagination from "../../Shared/Pagination";

export default function DonationPage() {
  const [filters, setFilters] = useState({
    donor: "",
    doctor: "",
    status: "",
  });
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donationAmount: "",
    transactionID: "",
    isRecurring: false,
    status: "",
    badgeName: "",
    badgeImageUrl: "",
    donationType: "",
  });
  // const [selectedDonation, setSelectedDonation] = useState<any>(null);
  // const [donations, setDonations] = useState<Donation[]>([]);
  // const itemsPerPage = 10;
  // const [currentPage, setCurrentPage] = useState(1);

  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [donationToDelete, setDonationToDelete] = useState<IDonation | null>(
    null
  );
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(
    null
  );
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const generateAnonymousId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `anon_${timestamp}_${randomStr}`;
  };
  const getDonations = async (searchTerm = "") => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        limit: "1000", // Fetch all donations
      });
      
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/donations?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setDonations(result.data);
      } else {
        console.error("Error fetching donations:", result.error);
        setDonations([]);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      setDonations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDonations();
  }, []);

  // Refetch donations when search filter changes
  useEffect(() => {
    if (filters.donor) {
      getDonations(filters.donor);
    } else {
      getDonations();
    }
  }, [filters.donor]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const donorMatch =
        donation?.donorName
          ?.toLowerCase()
          ?.includes(filters.donor.toLowerCase()) ||
        donation?.donorEmail
          ?.toLowerCase()
          ?.includes(filters.donor.toLowerCase());

      return donorMatch;
    });
  }, [filters, donations]);

  const paginatedDonations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredDonations.slice(start, end);
  }, [filteredDonations, currentPage]);
  const updateDonationStatus = (id: number, newStatus: string) => {
    setDonations((prev) =>
      prev.map((d: any) =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
              adminNote: `Status updated to ${newStatus}`,
            }
          : d
      )
    );
    setSelectedDonation(null);
  };
  const handleAddDonation = async () => {
    try {
      const donationData = {
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        donationAmount: parseFloat(form.donationAmount),
        transactionID: form.transactionID,
        isRecurring: form.isRecurring,
        status: form.isRecurring ? "Active" : "one-time",
        badgeName: form.badgeName,
        badgeImageUrl: form.badgeImageUrl,
        donationType: form.donationType,
        donorDocumentID: generateAnonymousId(), // if needed
      };

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      const result = await response.json();

      if (result.success) {
        await getDonations();
        // Reset form
        setForm({
          donorName: "",
          donorEmail: "",
          donationAmount: "",
          transactionID: "",
          isRecurring: false,
          status: "",
          badgeName: "",
          badgeImageUrl: "",
          donationType: "",
        });
        setAddDialogOpen(false);
      } else {
        console.error("Failed to add donation:", result.error);
      }
    } catch (error) {
      console.error("Failed to add donation:", error);
    }
  };
  const resetForm = () => {
    setForm({
      donorName: "",
      donorEmail: "",
      donationAmount: "",
      isRecurring: false,
      transactionID: "",
      status: "",
      badgeName: "",
      badgeImageUrl: "",
      donationType: "",
    });
  };

  const handleEditDonation = async () => {
    if (!selectedDonationId) return;

    const donation = donations.find((d) => (d as any)._id === selectedDonationId);
    if (!donation) return;

    try {
      const updateData = {
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        donationAmount: parseFloat(form.donationAmount),
        isRecurring: form.isRecurring,
        transactionID: form.transactionID,
        status: form.isRecurring ? "Active" : "one-time",
        badgeName: form.badgeName,
        badgeImageUrl: form.badgeImageUrl,
        donationType: form.donationType,
      };

      const response = await fetch(`/api/donations/${(donation as any)._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        await getDonations(); // Refresh UI
        setEditDialogOpen(false);
        setSelectedDonationId(null);
        resetForm();
      } else {
        console.error("Failed to update donation:", result.error);
      }
    } catch (error) {
      console.error("Failed to update donation:", error);
    }
  };
  const handleDeleteDonation = async () => {
    if (!donationToDelete) return;

    try {
      const response = await fetch(`/api/donations/${(donationToDelete as any)._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        await getDonations(); // Refresh UI
        setDonationToDelete(null);
        setDeleteDialogOpen(false);
      } else {
        console.error("Failed to delete donation:", result.error);
      }
    } catch (error) {
      console.error("Failed to delete donation:", error);
    }
  };

  console.log(filteredDonations);
  return (
    // <RequireAccess permission="Donations">
    <div className="lg:p-6 space-y-6">
      {/* filter section */}
      <Card className="dark:bg-slate-800 bg-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter Donations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search donor/email"
            value={filters.donor}
            onChange={(e) => setFilters({ ...filters, donor: e.target.value })}
            className="dark:bg-gray-700 dark:border-slate-600"
          />
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-800 bg-gray-100">
        <CardHeader className="">
          <div className="flex items-center justify-between w-full">
            <CardTitle>Donation Records</CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="!dark:bg-slate-900 !dark:text-white !bg-[#81d8d0] !text-black !hover:bg-[#63a8a1]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Donation
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-slate-800 dark:border-slate-600">
                <DialogHeader>
                  <DialogTitle>Create Donation</DialogTitle>
                  <DialogDescription>Add new donation.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Donor Name"
                    className="dark:bg-gray-700 dark:border-slate-600"
                    value={form.donorName}
                    onChange={(e) =>
                      setForm({ ...form, donorName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Donor Email"
                    className="dark:bg-gray-700 dark:border-slate-600"
                    value={form.donorEmail}
                    onChange={(e) =>
                      setForm({ ...form, donorEmail: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Donation Amount"
                    className="dark:bg-gray-700 dark:border-slate-600"
                    type="number"
                    value={form.donationAmount}
                    onChange={(e) =>
                      setForm({ ...form, donationAmount: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Transaction ID"
                    className="dark:bg-gray-700 dark:border-slate-600"
                    value={form.transactionID}
                    onChange={(e) =>
                      setForm({ ...form, transactionID: e.target.value })
                    }
                  />

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.isRecurring}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, isRecurring: checked === true })
                      }
                    />
                    <Label>Recurring Donation</Label>
                  </div>

                  {/* <Input
                    placeholder="Badge Name"
                    value={form.badgeName}
                    onChange={(e) =>
                      setForm({ ...form, badgeName: e.target.value })
                    }
                  /> */}
                  <Select
                    value={form.badgeName}
                    onValueChange={(value) =>
                      setForm({ ...form, badgeName: value })
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600">
                      <SelectValue placeholder="Badge Name" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                      <SelectItem value="Friend of Rex Vets">
                        Friend of Rex Vets
                      </SelectItem>
                      <SelectItem value="Community Champion">
                        Community Champion
                      </SelectItem>
                      <SelectItem value="Pet Care Hero">
                        Pet Care Hero
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Badge Image URL"
                    className="dark:bg-gray-700 dark:border-slate-600"
                    value={form.badgeImageUrl}
                    onChange={(e) =>
                      setForm({ ...form, badgeImageUrl: e.target.value })
                    }
                  />
                  <Select
                    value={form.donationType}
                    onValueChange={(value) =>
                      setForm({ ...form, donationType: value })
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600">
                      <SelectValue placeholder="Donation Type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                      <SelectItem value="donation">Donation</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    className="w-full mt-4 bg-blue-700  hover:bg-blue-800 text-white"
                    onClick={handleAddDonation}
                  >
                    Submit Donation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              {paginatedDonations?.length <= 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDonations?.map((donation, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {" "}
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      {donation.donorName ? donation.donorName : "N/A"}
                    </TableCell>
                    <TableCell>{donation.donorEmail}</TableCell>
                    <TableCell>${donation.donationAmount}</TableCell>
                    <TableCell className="capitalize">
                      {donation?.donationType ? donation?.donationType : "N/A"}
                    </TableCell>
                    <TableCell>{donation.transactionID || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium dark:text-gray-100 text-gray-900 whitespace-nowrap">
                          {format(new Date(donation.timestamp), "MMM dd, yyyy")}{" "}
                          <br />
                          {format(new Date(donation.timestamp), "hh:mm a")}
                        </p>
                        {/* <p className="text-sm text-gray-500">
                        {donation.timestamp}
                      </p> */}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <button
                        className=" p-2"
                        onClick={() => {
                          setSelectedDonationId((donation as any)._id);
                          setForm({
                            donorName: donation.donorName,
                            donorEmail: donation.donorEmail,
                            donationAmount: donation.donationAmount.toString(),
                            isRecurring: donation.isRecurring,
                            transactionID: donation.transactionID || "",
                            status: donation?.status || "",
                            badgeName: (donation as any).badgeName || "",
                            badgeImageUrl: (donation as any).badgeImageUrl || "",
                            donationType: donation.donationType,
                          });
                          setEditDialogOpen(true);
                        }}
                      >
                        <FilePenLine />
                      </button>

                      <Dialog
                        open={
                          editDialogOpen && selectedDonationId === (donation as any)._id
                        }
                        onOpenChange={(open) => {
                          setEditDialogOpen(open);
                          if (!open) {
                            setSelectedDonationId(null);
                            resetForm();
                          }
                        }}
                      >
                        <DialogContent className="dark:bg-slate-800 dark:border-slate-600">
                          <DialogHeader>
                            <DialogTitle>Update Donation</DialogTitle>
                            <DialogDescription>
                              Edit the details of this donation record.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <Input
                              className="dark:bg-gray-700 dark:border-slate-600"
                              placeholder="Donor Name"
                              value={form.donorName}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  donorName: e.target.value,
                                })
                              }
                            />
                            <Input
                              className="dark:bg-gray-700 dark:border-slate-600"
                              placeholder="Donor Email"
                              value={form.donorEmail}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  donorEmail: e.target.value,
                                })
                              }
                            />
                            <Input
                              className="dark:bg-gray-700 dark:border-slate-600"
                              placeholder="Amount"
                              type="number"
                              value={form.donationAmount}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  donationAmount: e.target.value,
                                })
                              }
                            />
                            <Input
                              className="dark:bg-gray-700 dark:border-slate-600"
                              placeholder="Transaction ID"
                              value={form.transactionID}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  transactionID: e.target.value,
                                })
                              }
                            />

                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={form.isRecurring}
                                onCheckedChange={(checked) =>
                                  setForm({
                                    ...form,
                                    isRecurring: checked === true,
                                  })
                                }
                              />
                              <Label>Recurring Donation</Label>
                            </div>

                            {/* <Input
                              placeholder="Badge Name"
                              value={form.badgeName}
                              onChange={(e) =>
                                setForm({ ...form, badgeName: e.target.value })
                              }
                            /> */}
                            <Select
                              value={form.badgeName}
                              onValueChange={(value) =>
                                setForm({ ...form, badgeName: value })
                              }
                            >
                              <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600">
                                <SelectValue placeholder="Badge Name" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                                <SelectItem value="Friend of Rex Vets">
                                  Friend of Rex Vets
                                </SelectItem>
                                <SelectItem value="Community Champion">
                                  Community Champion
                                </SelectItem>
                                <SelectItem value="Pet Care Hero">
                                  Pet Care Hero
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              className="dark:bg-gray-700 dark:border-slate-600"
                              placeholder="Badge Image URL"
                              value={form.badgeImageUrl}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  badgeImageUrl: e.target.value,
                                })
                              }
                            />
                            <Select
                              value={form.donationType}
                              onValueChange={(value) =>
                                setForm({ ...form, donationType: value })
                              }
                            >
                              <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600">
                                <SelectValue placeholder="Donation Type" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                                <SelectItem value="donation">
                                  Donation
                                </SelectItem>
                                <SelectItem value="booking">Booking</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              className="w-full mt-2 bg-blue-700  hover:bg-blue-800 text-white"
                              onClick={handleEditDonation}
                            >
                              Update Donation
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <button
                        onClick={() => {
                          setDonationToDelete(donation);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="text-red-600" />
                      </button>

                      <Dialog
                        open={
                          deleteDialogOpen &&
                          (donationToDelete as any)?._id === (donation as any)._id
                        }
                        onOpenChange={(open) => {
                          if (!open) {
                            setDeleteDialogOpen(false);
                            setDonationToDelete(null);
                          }
                        }}
                      >
                        <DialogContent className="dark:bg-slate-800 dark:border-slate-600">
                          <DialogHeader>
                            <DialogTitle>Delete Donation</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete donation by This
                              action is irreversible.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600"
                              onClick={() => {
                                setDeleteDialogOpen(false);
                                setDonationToDelete(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteDonation}
                            >
                              Confirm Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination
            totalItems={filteredDonations.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedDonation}
        onOpenChange={() => setSelectedDonation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Detailed view of the donation by {selectedDonation?.donor}
            </DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-4 text-sm">
              <div>
                <strong>Donor Name:</strong> {selectedDonation.donor}
              </div>
              <div>
                <strong>Email:</strong> {selectedDonation.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedDonation.phone}
              </div>
              <div>
                <strong>Doctor:</strong> {selectedDonation.doctor}
              </div>
              <div>
                <strong>Amount:</strong> ${selectedDonation.amount}
              </div>
              <div>
                <strong>Date:</strong> {selectedDonation.date}
              </div>
              <div>
                <strong>Status:</strong>
                <Select
                  defaultValue={selectedDonation.status}
                  onValueChange={(value) =>
                    setSelectedDonation({
                      ...selectedDonation,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger className="mt-1 w-40">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <strong>Message:</strong> {selectedDonation.message}
              </div>
              <div>
                <strong>Admin Note:</strong> {selectedDonation.adminNote}
              </div>

              <Button
                className="mt-4"
                onClick={() =>
                  updateDonationStatus(
                    selectedDonation.id,
                    selectedDonation.status
                  )
                }
              >
                Save Status
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    // </RequireAccess>
  );
}
