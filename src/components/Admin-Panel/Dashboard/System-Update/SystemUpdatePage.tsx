"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import {
  Trash2,
  PencilLine,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const updateTypes = [
  { value: "new", label: "New Feature", color: "bg-green-100 text-green-800" },
  {
    value: "improvement",
    label: "Improvement",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "announcement",
    label: "Announcement",
    color: "bg-purple-100 text-purple-800",
  },
];

const receivers = ["Doctor", "Parent"];

export default function SystemUpdatesPage() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all"); // Updated default value
  const [receiverFilter, setReceiverFilter] = useState<string[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    receiver: [] as string[],
    title: "",
    details: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Firestore subscription
  useEffect(() => {
    const q = collection(db, "Settings", "System Update", "Items");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUpdates(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...updates];
    if (typeFilter !== "all")
      filtered = filtered.filter((u) => u.type === typeFilter);
    if (receiverFilter.length)
      filtered = filtered.filter((u) =>
        receiverFilter.some((r) => u.receiver.includes(r))
      );
    if (searchTitle)
      filtered = filtered.filter((u) =>
        u.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    setFilteredUpdates(filtered);
  }, [typeFilter, receiverFilter, searchTitle, updates]);

  const handleReceiverToggle = (val: string) => {
    setReceiverFilter((prev) =>
      prev.includes(val) ? prev.filter((r) => r !== val) : [...prev, val]
    );
  };

  const clearFilters = () => {
    setTypeFilter("all"); // Updated default value
    setReceiverFilter([]);
    setSearchTitle("");
  };

  const handleDialogSubmit = async () => {
    const { type, receiver, title, details } = formData;
    if (!type || !receiver.length || !title || !details) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (isEditMode && editId) {
        const docRef = doc(db, "Settings", "System Update", "Items", editId);
        await updateDoc(docRef, { type, receiver, title, details });
        toast.success("Update successfully edited");
      } else {
        const collectionRef = collection(
          db,
          "Settings",
          "System Update",
          "Items"
        );
        await addDoc(collectionRef, {
          type,
          receiver,
          title,
          details,
          createdAt: new Date(),
          reactions: {},
        });
        toast.success("Update successfully added");
      }
      closeDialog();
    } catch (e) {
      console.error(e);
      toast.error("Error saving data");
    }
  };

  const openEditDialog = (update: any) => {
    setFormData({
      type: update.type,
      receiver: update.receiver,
      title: update.title,
      details: update.details,
    });
    setEditId(update.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({ type: "", receiver: [], title: "", details: "" });
    setEditId(null);
    setIsEditMode(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "Settings", "System Update", "Items", deleteId));
      toast.success("Update deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete update");
    }
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const getTypeConfig = (type: string) => {
    return updateTypes.find((t) => t.value === type) || updateTypes[0];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Updates</h1>
          <p className="text-muted-foreground">
            Manage and track system updates and announcements
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Add Update
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Updates</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Update Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {updateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Receiver Filter */}
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <div className="flex flex-wrap gap-2">
                {receivers.map((role) => (
                  <Badge
                    key={role}
                    variant={
                      receiverFilter.includes(role) ? "default" : "outline"
                    }
                    onClick={() => handleReceiverToggle(role)}
                    className="cursor-pointer hover:bg-primary/80"
                  >
                    <Users className="mr-1 h-3 w-3" />
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(typeFilter !== "all" ||
            receiverFilter.length > 0 ||
            searchTitle) && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {typeFilter !== "all" && (
                <Badge variant="secondary">
                  Type: {getTypeConfig(typeFilter).label}
                </Badge>
              )}
              {receiverFilter.map((receiver) => (
                <Badge key={receiver} variant="secondary">
                  {receiver}
                </Badge>
              ))}
              {searchTitle && (
                <Badge variant="secondary">Search: {searchTitle}</Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Updates Grid */}
      {filteredUpdates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No updates found</h3>
            <p className="text-muted-foreground mb-4">
              {updates.length === 0
                ? "Get started by creating your first system update."
                : "Try adjusting your filters to see more results."}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Update
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUpdates.map((update) => {
            const typeConfig = getTypeConfig(update.type);
            return (
              <Card
                key={update.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className={`${typeConfig.color} border-0`}>
                      {typeConfig.label}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(update)}
                        className="h-8 w-8 p-0"
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleteId(update.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {update.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <CardDescription className="line-clamp-3 mb-4">
                    {update.details}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {update.receiver.map((receiver: string) => (
                      <Badge
                        key={receiver}
                        variant="outline"
                        className="text-xs"
                      >
                        <Users className="mr-1 h-3 w-3" />
                        {receiver}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {update.createdAt?.toDate?.().toLocaleDateString?.() ||
                      "Unknown date"}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit System Update" : "Create System Update"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Update Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(val) =>
                  setFormData((f) => ({ ...f, type: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select update type" />
                </SelectTrigger>
                <SelectContent>
                  {updateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience *</Label>
              <div className="flex flex-wrap gap-2">
                {receivers.map((role) => (
                  <Badge
                    key={role}
                    variant={
                      formData.receiver.includes(role) ? "default" : "outline"
                    }
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        receiver: prev.receiver.includes(role)
                          ? prev.receiver.filter((r) => r !== role)
                          : [...prev.receiver, role],
                      }))
                    }
                    className="cursor-pointer hover:bg-primary/80"
                  >
                    <Users className="mr-1 h-3 w-3" />
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Enter update title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details *</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, details: e.target.value }))
                }
                rows={4}
                placeholder="Enter update details"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit}>
              {isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete System Update</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this system update? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
