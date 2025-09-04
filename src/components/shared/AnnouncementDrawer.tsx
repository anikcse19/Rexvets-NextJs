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
}

export default function AnnouncementsDrawer({ userId, role }: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const fetchAnnouncements = async () => {
    if (open) {
      await fetch("/api/announcement")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setAnnouncements(data.data);
        });
    }
  };
  useEffect(() => {
    fetchAnnouncements();
  }, [open]);

  const handleReaction = async (
    id: string,
    value: "positive" | "negative" | "neutral"
  ) => {
    await fetch(`/api/announcement/${id}/react`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    // refresh list
    fetchAnnouncements();
  };

  const hanldeRefresh = () => {
    setIsSpinning(true);
    fetchAnnouncements();
    setTimeout(() => {
      setIsSpinning(false);
      // put your refresh logic here (e.g., fetch announcements)
    }, 1500);
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
            onClick={hanldeRefresh}
          >
            <RefreshCw
              className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 mt-4">
          {announcements.map((a) => {
            const userReaction = a.reactions.find(
              (r) => r.user === userId && r.role === role
            );

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
          })}

          {announcements.length === 0 && (
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
