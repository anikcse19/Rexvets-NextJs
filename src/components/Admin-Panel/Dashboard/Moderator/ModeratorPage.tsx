"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

const adminMenus = [
  "Dashboard",
  "Appointments",
  "Doctors",
  "Parents",
  "Support",
  "Pharmacy Request",
  "Reviews",
  "Donations",
  "Settings",
];

type Moderator = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  accesslist: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Moderator, "_id" | "isActive" | "createdAt" | "updatedAt">>({
    name: "",
    email: "",
    phone: "",
    accesslist: ["Dashboard"],
  });
  const [selectedModeratorId, setSelectedModeratorId] = useState<string | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moderatorToDelete, setModeratorToDelete] = useState<Moderator | null>(
    null
  );
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isCreateAccessLoading, setIsCreateAccessLoading] = useState(false);

  const fetchModerators = async () => {
    try {
      const response = await fetch("/api/admin/moderators");
      if (!response.ok) {
        throw new Error("Failed to fetch moderators");
      }
      const data = await response.json();
      setModerators(data.moderators || []);
    } catch (error) {
      console.error("Failed to fetch moderators:", error);
    }
  };

  useEffect(() => {
    fetchModerators();
  }, []);

  const handleAddModerator = async () => {
    setIsCreateAccessLoading(true);
    try {
      const response = await fetch("/api/admin/moderators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          accesslist: form.accesslist,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create moderator");
      }

      // Refresh local list
      await fetchModerators();

      // Reset form and close
      setForm({
        name: "",
        email: "",
        phone: "",
        accesslist: ["Dashboard"],
      });
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add moderator:", error);
    } finally {
      setIsCreateAccessLoading(false);
    }
  };

  const handleEditAccessList = async () => {
    setIsUpdateLoading(true);
    if (selectedModeratorId !== null) {
      try {
        const response = await fetch(`/api/admin/moderators/${selectedModeratorId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accesslist: form.accesslist,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update moderator access list");
        }

        // Refresh list from DB
        await fetchModerators();
      } catch (error) {
        console.error("Failed to update moderator access list:", error);
      } finally {
        setIsUpdateLoading(false);
      }
    }

    setEditDialogOpen(false);
    setSelectedModeratorId(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      accesslist: ["Dashboard"],
    });
  };

  const handleDeleteModerator = async () => {
    if (moderatorToDelete) {
      try {
        const response = await fetch(`/api/admin/moderators/${moderatorToDelete._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete moderator");
        }

        // Refresh list from DB
        await fetchModerators();
      } catch (error) {
        console.error("Failed to delete moderator:", error);
      }

      setModeratorToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    // <RequireAccess permission="Settings">
    <div className="lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Moderator Management</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="!dark:bg-slate-900 !dark:text-white !bg-[#81d8d0] !text-black !hover:bg-[#63a8a1]">
              <Plus className="w-4 h-4 mr-2" />
              Add Moderator
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-slate-700">
            <DialogHeader>
              <DialogTitle>Create Moderator</DialogTitle>
              <DialogDescription>
                Add new moderator with access permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="dark:bg-slate-800"
              />
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="dark:bg-slate-800"
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="dark:bg-slate-800"
              />
              <Separator />
              <Label className="text-sm">Access List</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {adminMenus.map((menu) => (
                  <label key={menu} className="flex gap-2 items-center">
                    <Checkbox
                      checked={form.accesslist.includes(menu)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setForm({
                            ...form,
                            accesslist: [...form.accesslist, menu],
                          });
                        } else {
                          setForm({
                            ...form,
                            accesslist: form.accesslist.filter(
                              (item) => item !== menu
                            ),
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{menu}</span>
                  </label>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={handleAddModerator}>
                {isCreateAccessLoading ? "Creating.." : "Create Moderator"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Moderator Table */}
      <Card className="dark:bg-slate-800 bg-gray-100">
        <CardHeader>
          <CardTitle>Moderators List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Access List</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moderators.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground dark:text-white py-6"
                  >
                    No moderators found.
                  </TableCell>
                </TableRow>
              ) : (
                moderators.map((mod, index) => (
                  <TableRow key={mod._id} className="dark:hover:bg-slate-700">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{mod.name}</TableCell>
                    <TableCell>{mod.email}</TableCell>
                    <TableCell>{mod.phone || "N/A"}</TableCell>
                    <TableCell>
                      <ul className="text-sm list-disc pl-4">
                        {mod.accesslist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog
                        open={editDialogOpen && selectedModeratorId === mod._id}
                        onOpenChange={(open) => {
                          setEditDialogOpen(open);
                          if (!open) {
                            setSelectedModeratorId(null);
                            setForm({
                              name: "",
                              email: "",
                              phone: "",
                              accesslist: ["Dashboard"],
                            });
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="dark:bg-gray-700 dark:border-slate-600"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedModeratorId(mod._id);
                              setForm({
                                name: mod.name,
                                email: mod.email,
                                phone: mod.phone || "",
                                accesslist: mod.accesslist,
                              });
                              setEditDialogOpen(true);
                            }}
                          >
                            Edit Access
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="dark:bg-slate-800">
                          <DialogHeader>
                            <DialogTitle>Update Access List</DialogTitle>
                            <DialogDescription>
                              Modify the access privileges for this moderator.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                              {adminMenus.map((menu) => (
                                <label
                                  key={menu}
                                  className="flex gap-2 items-center"
                                >
                                  <Checkbox
                                    checked={form.accesslist.includes(menu)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setForm({
                                          ...form,
                                          accesslist: [
                                            ...form.accesslist,
                                            menu,
                                          ],
                                        });
                                      } else {
                                        setForm({
                                          ...form,
                                          accesslist: form.accesslist.filter(
                                            (item) => item !== menu
                                          ),
                                        });
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{menu}</span>
                                </label>
                              ))}
                            </div>
                            <Button
                              className="w-full mt-2"
                              onClick={handleEditAccessList}
                            >
                              {isUpdateLoading
                                ? "Updating..."
                                : " Update Access"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog
                        open={
                          deleteDialogOpen && moderatorToDelete?._id === mod._id
                        }
                        onOpenChange={(open) => {
                          if (!open) {
                            setDeleteDialogOpen(false);
                            setModeratorToDelete(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setModeratorToDelete(mod);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Moderator</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete moderator{" "}
                              <strong>{mod.name}</strong>? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setDeleteDialogOpen(false);
                                setModeratorToDelete(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteModerator}
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
        </CardContent>
      </Card>
    </div>
    // </RequireAccess>
  );
}
