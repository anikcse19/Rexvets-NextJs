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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  Id: number;
  docId: string;
  Name: string;
  Email: string;
  Password: string;
  Phone: string;
  AccessList: string[];
};

export default function AdminModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Moderator, "Id">>({
    Name: "",
    docId: "",
    Email: "",
    Password: "",
    Phone: "",
    AccessList: ["Dashboard"],
  });
  const [selectedModeratorId, setSelectedModeratorId] = useState<number | null>(
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
      const q = query(
        collection(db, "Users"),
        where("Role", "==", "moderator")
      );
      const snapshot = await getDocs(q);

      const mods: Moderator[] = snapshot.docs.map((doc, idx) => {
        const data = doc.data();
        return {
          Id: idx + 1,
          docId: doc.id,
          Name: data.Name,
          Email: data.Email,
          Password: data.Password || "",
          Phone: data.Phone,
          AccessList: data.AccessList || [],
        };
      });

      setModerators(mods);
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
      const newMod = {
        Name: form.Name,
        Email: form.Email,
        Password: form.Password,
        Phone: form.Phone,
        Role: "moderator",
        AccessList: form.AccessList,
      };

      // Add to Firestore
      await addDoc(collection(db, "Users"), newMod);

      // Refresh local list
      await fetchModerators();

      // Reset form and close
      setForm({
        Name: "",
        Email: "",
        docId: "",
        Password: "",
        Phone: "",
        AccessList: [],
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
      const moderator = moderators.find(
        (mod) => mod.Id === selectedModeratorId
      );
      if (!moderator) return;

      try {
        const docRef = doc(db, "Users", moderator.docId);
        await updateDoc(docRef, {
          AccessList: form.AccessList,
        });

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
      Name: "",
      Email: "",
      Password: "",
      docId: "",
      Phone: "",
      AccessList: [],
    });
  };

  const handleDeleteModerator = async () => {
    if (moderatorToDelete) {
      try {
        const docRef = doc(db, "Users", moderatorToDelete.docId);
        await deleteDoc(docRef);

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
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                className="dark:bg-slate-800"
              />
              <Input
                placeholder="Email"
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
                className="dark:bg-slate-800"
              />
              <Input
                placeholder="Password"
                type="password"
                value={form.Password}
                onChange={(e) => setForm({ ...form, Password: e.target.value })}
                className="dark:bg-slate-800"
              />
              <Input
                placeholder="Phone"
                value={form.Phone}
                onChange={(e) => setForm({ ...form, Phone: e.target.value })}
                className="dark:bg-slate-800"
              />
              <Separator />
              <Label className="text-sm">Access List</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {adminMenus.map((menu) => (
                  <label key={menu} className="flex gap-2 items-center">
                    <Checkbox
                      checked={form.AccessList.includes(menu)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setForm({
                            ...form,
                            AccessList: [...form.AccessList, menu],
                          });
                        } else {
                          setForm({
                            ...form,
                            AccessList: form.AccessList.filter(
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
                  <TableRow key={mod.Id} className="dark:hover:bg-slate-700">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{mod.Name}</TableCell>
                    <TableCell>{mod.Email}</TableCell>
                    <TableCell>{mod.Phone}</TableCell>
                    <TableCell>
                      <ul className="text-sm list-disc pl-4">
                        {mod.AccessList.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog
                        open={editDialogOpen && selectedModeratorId === mod.Id}
                        onOpenChange={(open) => {
                          setEditDialogOpen(open);
                          if (!open) {
                            setSelectedModeratorId(null);
                            setForm({
                              Name: "",
                              Email: "",
                              docId: "",
                              Password: "",
                              Phone: "",
                              AccessList: [],
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
                              setSelectedModeratorId(mod.Id);
                              setForm({
                                Name: mod.Name,
                                docId: mod.docId,
                                Email: mod.Email,
                                Phone: mod.Phone,
                                Password: mod.Password,
                                AccessList: mod.AccessList,
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
                                    checked={form.AccessList.includes(menu)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setForm({
                                          ...form,
                                          AccessList: [
                                            ...form.AccessList,
                                            menu,
                                          ],
                                        });
                                      } else {
                                        setForm({
                                          ...form,
                                          AccessList: form.AccessList.filter(
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
                          deleteDialogOpen && moderatorToDelete?.Id === mod.Id
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
                              <strong>{mod.Name}</strong>? This action cannot be
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
