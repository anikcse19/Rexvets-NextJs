"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import {
  Inbox,
  Loader2,
  Megaphone,
  Meh,
  Mic2,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  TrendingUpDown,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Announcement {
  _id: string;
  kind: string;
  title: string;
  details: string;
  createdAt: string;
  reactions: Array<{
    user: string;
    role: string;
    value: "positive" | "negative" | "neutral";
  }>;
}

interface Props {
  userId: string;
  role: string;
  announcements?: Announcement[];
  refetch?: () => void;
}

export default function AnnouncementsDrawer({
  userId,
  role,
  announcements = [],
  refetch,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReaction = async (
    id: string,
    value: "positive" | "negative" | "neutral"
  ) => {
    try {
      console.log("Reacting to announcement:", id, "with value:", value);
      console.log("Current user:", userId, "role:", role);

      const response = await fetch(`/api/announcement/${id}/react`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      const data = await response.json();
      console.log("Reaction response:", data);

      if (data.success) {
        console.log("Reaction successful, calling refetch...");
        // Update parent component
        if (refetch) {
          refetch();
        } else {
          console.log("No refetch function provided");
        }
        toast.success("Reaction updated successfully");
      } else {
        console.log("Reaction failed:", data.message);
        toast.error(data.message || "Failed to update reaction");
      }
    } catch (err) {
      toast.error("Failed to update reaction");
      console.error("Error updating reaction:", err);
    }
  };

  const handleRefresh = () => {
    refetch && refetch();
    // fetchAnnouncements(true);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Mic2 className="cursor-pointer" />
      </SheetTrigger>

      <SheetContent side="right" className="p-4 w-[400px] sm:w-[500px]">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white p-1.5 rounded-md">
              <TrendingUpDown />
            </div>
            <SheetTitle className="text-xl font-bold">Announcements</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex justify-end">
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 cursor-pointer"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 mt-4">
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <Inbox className="w-12 h-12 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700">
                No announcements yet
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                There are currently no announcements for you. Check back later
                to see new updates, features, or improvements.
              </p>
            </div>
          ) : (
            announcements.map((a) => {
            const userReaction = a.reactions.find((r) => {
              const userMatch =
                (r.user.toString ? r.user.toString() : r.user) === userId;
              const roleMatch = r.role === role;
              return userMatch && roleMatch;
            });

              return (
                <Card key={a._id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {a.kind === "announcement" && (
                        <Megaphone className="w-5 h-5 text-blue-500" />
                      )}
                      {a.kind === "improvement" && (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      )}
                      {a.kind === "new_feature" && (
                        <Zap className="w-5 h-5 text-yellow-500" />
                      )}
                      <p
                        className={`capitalize text-blue-800 font-medium ${
                          a.kind === "announcement"
                            ? "text-purple-600"
                            : a.kind === "improvement"
                            ? "text-blue-600"
                            : "text-teal-600"
                        }`}
                      >
                        {a.kind.replace("_", " ")} .
                      </p>
                    </div>

                    <CardTitle>{a.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {format(new Date(a.createdAt), "PPP p")}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-700">{a.details}</p>

                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReaction(a._id, "positive")}
                        className={
                          userReaction?.value === "positive"
                            ? "text-green-600 cursor-pointer"
                            : "text-gray-400 cursor-pointer"
                        }
                      >
                        <ThumbsUp className="h-10 w-10 cursor-pointer" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReaction(a._id, "negative")}
                        className={
                          userReaction?.value === "negative"
                            ? "text-red-600 cursor-pointer"
                            : "text-gray-400 cursor-pointer"
                        }
                      >
                        <ThumbsDown className="h-10 w-10" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReaction(a._id, "neutral")}
                        className={
                          userReaction?.value === "neutral"
                            ? "text-yellow-600 cursor-pointer"
                            : "text-gray-400 cursor-pointer"
                        }
                      >
                        <Meh className="h-10 w-10" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
