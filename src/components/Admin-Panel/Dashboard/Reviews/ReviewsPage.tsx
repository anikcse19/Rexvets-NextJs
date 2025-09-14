"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash, FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils"; // Optional: Tailwind helper
import { Reviews } from "@/lib/types/reviews";
import { Doctor } from "@/lib/types";
import Pagination from "../../Shared/Pagination";
import {
  createReview,
  deleteReview,
  updateReview,
  updateReviewStatus,
} from "../../Actions/reviews";
import RequireAccess from "../../Shared/RequireAccess";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [form, setForm] = useState({
    doctorName: "",
    doctorId: "",
    parentName: "",
    parentId: "",
    reviewText: "",
    rating: "",
    visible: false,
    appointmentDate: undefined as Date | undefined,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);
  const [filters, setFilters] = useState({
    reviewer: "",
    reviewed: "",
    visibility: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsData, setDoctorsData] = useState<Doctor[]>([]);
  // fetching parents
  const [parents, setParents] = useState<any[]>([]);

  const fetchPetParents = async () => {
    try {
      const res = await fetch(`/api/pet-parents?page=1&limit=10000`);
      const data = await res.json();
      if (data.success) {
        setParents(data.data);
        console.log("pet parents", data?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPetParents();
  }, []);

  console.log("parents =", parents);
  // fetching doctor data

  const getDoctors = async () => {
    try {
      const res = await fetch("/api/veterinarian");

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      console.log("doctorss", data?.data);

      setDoctorsData(data?.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // console.log("darents =", doctorsData)

  const getDoctorsReviews = async () => {
    try {
      const res = await fetch(`/api/reviews`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data?.reviews);
        console.log("reviews", data?.data?.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDoctorsReviews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, reviews]);

  const toggleVisibility = async (id: string) => {
    try {
      // Find the current review
      const review = reviews.find((r: Reviews) => r._id === id);
      if (!review) return;

      await updateReviewStatus(id, !review.visible);

      // Update local state
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, visible: !r.visible } : r))
      );
      toast.success("Visibility updated!");
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const reviewerName =
        typeof review.parentId === "object" && review.parentId?.name
          ? review.parentId.name
          : review.parentName || "";

      const reviewedName =
        typeof review.vetId === "object" && review.vetId?.name
          ? review.vetId.name
          : review.doctorName || "";

      const reviewerMatch =
        filters.reviewer === "" ||
        reviewerName.toLowerCase().includes(filters.reviewer.toLowerCase());

      const reviewedMatch =
        filters.reviewed === "" ||
        reviewedName.toLowerCase().includes(filters.reviewed.toLowerCase());

      const visibilityMatch =
        filters.visibility === ""
          ? true
          : filters.visibility === "shown"
          ? Boolean(review.visible)
          : !Boolean(review.visible);

      return reviewerMatch && reviewedMatch && visibilityMatch;
    });
  }, [filters, reviews]);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredReviews.slice(start, end);
  }, [filteredReviews, currentPage]);

  const resetForm = () => {
    setForm({
      doctorId: "",
      doctorName: "",
      parentId: "",
      parentName: "",
      reviewText: "",
      rating: "",
      visible: true,
      appointmentDate: undefined,
    });
  };

  const handleAddReview = async () => {
    try {
      const newReview = {
        vetId: form.doctorId,
        parentId: form.parentId,
        appointmentDate: form.appointmentDate
          ? format(form.appointmentDate, "MMMM d, yyyy") // ✅ e.g., "July 13, 2025"
          : "",
        comment: form.reviewText,
        rating: parseInt(form.rating),
        visible: form.visible,
      };
      console.log("New ==", newReview);

      const res = await createReview(newReview);

      if (res.success) {
        toast.success("Review submitted successfully!");
      } else {
        toast.error(res.message || "Failed to submit review");
        console.log(res.errors); // optional: show field errors
      }

      // await addDoc(collection(db, "Reviews"), newReview);
      await getDoctorsReviews();

      resetForm();
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  const handleUpdateReview = async () => {
    if (!selectedReviewId) return;

    try {
      const newReview = {
        vetId: form.doctorId,
        parentId: form.parentId,
        appointmentDate: form.appointmentDate
          ? format(form.appointmentDate, "MMMM d, yyyy") // ✅ e.g., "July 13, 2025"
          : "",
        comment: form.reviewText,
        rating: parseInt(form.rating),
        visible: form.visible,
      };
      const data = await updateReview(selectedReviewId, newReview);

      console.log("review delete", data);

      await getDoctorsReviews(); // Refresh list
      resetForm();
      setEditDialogOpen(false);
      setSelectedReviewId(null);
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      const res = await deleteReview(reviewToDelete.id);

      if (res?.success) {
        await getDoctorsReviews();
        setReviewToDelete(null);
        setDeleteDialogOpen(false);
        toast.success("Deleted Successfully");
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  console.log("reviews", reviews);

  return (
    <RequireAccess permission="Reviews">
      <div className="lg:p-6 space-y-6">
        <Card className="dark:bg-slate-800 bg-gray-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filter Reviews</CardTitle>
              {filters.reviewer ||
                (filters.visibility && (
                  <Button
                    className="dark:bg-gray-700 dark:border-slate-600"
                    variant="outline"
                    onClick={() =>
                      setFilters({ reviewer: "", reviewed: "", visibility: "" })
                    }
                  >
                    Clear
                  </Button>
                ))}
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              className="dark:bg-gray-700 dark:border-slate-600"
              placeholder="Search reviewer"
              value={filters.reviewer}
              onChange={(e) =>
                setFilters({ ...filters, reviewer: e.target.value })
              }
            />

            <Select
              onValueChange={(value) =>
                setFilters({ ...filters, visibility: value })
              }
              value={filters.visibility}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600">
                <SelectValue placeholder="Select Visibility" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                <SelectItem value="shown">Shown</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 bg-gray-100">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Pet Parent Reviews Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Approve or hide reviews submitted by pet parents for vets or
                  products.
                </p>
              </div>

              {/* Add review modal */}
              <Button
                className="!dark:bg-slate-900 !dark:text-white !bg-[#81d8d0] !text-black !hover:bg-[#63a8a1]"
                onClick={() => setAddDialogOpen(true)}
              >
                Add Review
              </Button>

              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="dark:bg-slate-800 dark:border-slate-600">
                  <DialogHeader>
                    <DialogTitle>Add Review</DialogTitle>
                    <DialogDescription>Submit a new review.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Doctor Select */}
                    <div className="space-y-4">
                      <Label>Reviewed</Label>
                      <Select
                        onValueChange={(value) => {
                          const selected = doctorsData.find(
                            (doc) => doc._id === value
                          );
                          if (selected) {
                            setForm({
                              ...form,
                              doctorName: `${selected.firstName} ${selected.lastName}`,
                              doctorId: selected._id,
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600 w-full">
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                          {doctorsData.map((doc) => (
                            <SelectItem key={doc._id} value={doc._id}>
                              {doc.firstName} {doc.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reviewer Select */}
                    <div className="space-y-4">
                      <Label>Reviewer</Label>
                      <Select
                        onValueChange={(value) => {
                          const selected = parents.find((p) => p._id === value);
                          if (selected) {
                            setForm({
                              ...form,
                              parentId: selected._id,
                              parentName: selected.Name,
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600 w-full">
                          <SelectValue placeholder="Select Parent" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                          {parents.map((p) => (
                            <SelectItem key={p._id} value={p._id}>
                              {p.name} {p._id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Review Text */}
                    <div>
                      <Textarea
                        className="dark:bg-gray-700 dark:border-slate-600"
                        placeholder="Write review..."
                        value={form.reviewText}
                        onChange={(e) =>
                          setForm({ ...form, reviewText: e.target.value })
                        }
                      />
                    </div>

                    {/* Rating Select */}
                    <div>
                      <Select
                        value={form.rating}
                        onValueChange={(value) =>
                          setForm({ ...form, rating: value })
                        }
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600 w-full">
                          <SelectValue placeholder="Select Rating" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} Star{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-4">
                      <Label>Appointment Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-slate-600",
                              !form.appointmentDate && "text-muted-foreground"
                            )}
                          >
                            {form.appointmentDate
                              ? format(form.appointmentDate, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 dark:bg-slate-800 dark:border-slate-600"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={form.appointmentDate}
                            onSelect={(date) => {
                              setForm({ ...form, appointmentDate: date });
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <Button
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                        onClick={handleAddReview}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="text-right">Action</TableHead>
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
                {paginatedReviews?.length <= 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReviews.map((review, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{review?.vetId?.name}</TableCell>
                      <TableCell>{review?.parentId?.name}</TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {review.rating ? review.rating : 5} / 5
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {review?.comment}
                      </TableCell>
                      <TableCell>
                        {review?.createdAt ? (
                          <div>
                            <p className="font-medium dark:text-gray-100 text-gray-900 whitespace-nowrap">
                              {format(
                                new Date(review?.createdAt),
                                "MMM dd, yyyy"
                              )}{" "}
                              <br />
                              {format(new Date(review?.createdAt), "hh:mm a")}
                            </p>
                          </div>
                        ) : (
                          <></>
                        )}

                        {/* {review.appointmentDate} */}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={review.visible}
                          onCheckedChange={() => toggleVisibility(review._id)}
                          className={cn(
                            "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-400",
                            "dark:data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-slate-400"
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={
                            editDialogOpen && selectedReviewId === review._id
                          }
                          onOpenChange={(open) => {
                            setEditDialogOpen(open);
                            if (!open) {
                              setSelectedReviewId(null);
                              resetForm();
                            }
                          }}
                        >
                          <DialogTrigger className="mr-2" asChild>
                            <Button
                              variant="outline"
                              className="dark:bg-gray-700 dark:border-slate-600"
                              size="sm"
                              onClick={() => {
                                setSelectedReviewId(review._id);
                                setForm({
                                  doctorId: review?.vetId?._id,
                                  doctorName: review.doctorName,
                                  parentId: review?.parentId?._id,
                                  parentName: review.parentName,
                                  reviewText: review.comment,
                                  rating: review.rating.toString(),
                                  visible: review.visible,
                                  appointmentDate: review.appointmentDate
                                    ? new Date(review.appointmentDate)
                                    : undefined,
                                });
                                setEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="dark:bg-slate-800 dark:border-slate-600">
                            <DialogHeader>
                              <DialogTitle>Edit Review</DialogTitle>
                              <DialogDescription>
                                Update the selected review details.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Doctor Selector */}
                              <div className="space-y-4">
                                <Label>Reviewed</Label>
                                <Select
                                  value={form.doctorId}
                                  onValueChange={(value) => {
                                    const selected = doctorsData.find(
                                      (doc) => doc._id === value
                                    );
                                    if (selected) {
                                      setForm({
                                        ...form,
                                        doctorName: `${selected.firstName} ${selected.lastName}`,
                                        doctorId: selected._id,
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600 w-full">
                                    <SelectValue placeholder="Select Doctor" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                                    {doctorsData.map((doc) => (
                                      <SelectItem key={doc._id} value={doc._id}>
                                        {doc.firstName} {doc.lastName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Reviewer Selector */}
                              <div className="space-y-4">
                                <Label>Reviewer</Label>
                                <Select
                                  value={form.parentId}
                                  onValueChange={(value) => {
                                    const selected = parents.find(
                                      (p) => p._id === value
                                    );
                                    if (selected) {
                                      setForm({
                                        ...form,
                                        parentId: selected._id,
                                        parentName: selected.name,
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600 w-full">
                                    <SelectValue placeholder="Select Parent" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                                    {parents.map((p) => (
                                      <SelectItem key={p._id} value={p._id}>
                                        {p.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Review Textarea */}
                              <div>
                                <Textarea
                                  className="dark:bg-gray-700 dark:border-slate-600"
                                  placeholder="Write review..."
                                  value={form.reviewText}
                                  onChange={(e) =>
                                    setForm({
                                      ...form,
                                      reviewText: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              {/* Rating Select */}
                              <div className="space-y-4">
                                <Label>Rating</Label>
                                <Select
                                  value={form.rating}
                                  onValueChange={(value) =>
                                    setForm({ ...form, rating: value })
                                  }
                                >
                                  <SelectTrigger className="dark:bg-gray-700 dark:border-slate-600 w-full">
                                    <SelectValue placeholder="Select Rating" />
                                  </SelectTrigger>
                                  <SelectContent className="dark:bg-gray-700 dark:border-slate-600">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                      <SelectItem key={n} value={n.toString()}>
                                        {n} Star{n > 1 ? "s" : ""}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Appointment Date Picker */}
                              <div className="space-y-4">
                                <Label>Appointment Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-slate-600",
                                        !form.appointmentDate &&
                                          "text-muted-foreground"
                                      )}
                                    >
                                      {form.appointmentDate
                                        ? format(form.appointmentDate, "PPP")
                                        : "Pick a date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 dark:bg-gray-700 dark:border-slate-600"
                                    align="start"
                                  >
                                    <Calendar
                                      className="dark:bg-gray-700 dark:border-slate-600"
                                      mode="single"
                                      selected={form.appointmentDate}
                                      onSelect={(date) =>
                                        setForm({
                                          ...form,
                                          appointmentDate: date,
                                        })
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              {/* Submit Button */}
                              <div>
                                <Button
                                  className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                                  onClick={handleUpdateReview}
                                >
                                  Update Review
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={
                            deleteDialogOpen &&
                            reviewToDelete?._id === review._id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setDeleteDialogOpen(false);
                              setReviewToDelete(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setReviewToDelete(review);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="dark:bg-slate-800 dark:border-slate-600">
                            <DialogHeader>
                              <DialogTitle>Delete Review</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this review for{" "}
                                <strong>{review.doctorName}</strong>?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                className="dark:bg-gray-700 dark:border-slate-600"
                                onClick={() => {
                                  setDeleteDialogOpen(false);
                                  setReviewToDelete(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteReview}
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
              totalItems={filteredReviews.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>
      //{" "}
    </RequireAccess>
  );
}
