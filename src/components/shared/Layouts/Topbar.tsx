"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bell, Menu, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AnnouncementsDrawer from "../AnnouncementDrawer";
import SystemNotification, { INotification } from "../SystemNotification";

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export default function Topbar({
  title = "Dashboard",
  onMenuClick,
}: // sidebarOpen = false,
TopbarProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [messageNotifications, setMessageNotifications] = useState<
    INotification[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isNotifications, setIsNotifications] = useState(false);
  const [isMessages, setIsMessages] = useState(false);
  const getNotifications = async () => {
    try {
      if (!session?.user?.id) return;
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.set("recipientId", session?.user?.id);
      queryParams.set("isRead", "false");
      const res = await fetch(`/api/notifications?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to fetch notifications", error);
        throw new Error(error?.message);
      }
      const data = await res.json();
      console.log(data);
      // Filter out NEW_MESSAGE type on client side
      const filteredNotifications =
        data?.data?.filter(
          (notification: INotification) => notification.type !== "NEW_MESSAGE"
        ) || [];
      setNotifications(filteredNotifications);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const getMessageNotifications = async () => {
    try {
      if (!session?.user?.id) return;
      const queryParams = new URLSearchParams();
      queryParams.set("recipientId", session?.user?.id);
      queryParams.set("type", "NEW_MESSAGE");
      queryParams.set("isRead", "false");
      const res = await fetch(`/api/notifications?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to fetch message notifications", error);
        throw new Error(error?.message);
      }
      const data = await res.json();
      console.log("Message notifications:", data);
      setMessageNotifications(data?.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch message notifications");
    }
  };

  useEffect(() => {
    if (session) {
      getNotifications();
      getMessageNotifications();
    }
  }, [session]);
  console.log("notifications", notifications);
  return (
    <header className="h-16 lg:h-20 bg-[#1C1B36] border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 text-white shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden text-white hover:bg-slate-700"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <h2 className="text-lg lg:text-xl font-semibold truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Messages Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOpen(true);
            setIsNotifications(false);
            setIsMessages(true);
          }}
          className="relative text-white hover:bg-slate-700"
        >
          <MessageCircle className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {messageNotifications?.length || 0}
          </Badge>
        </Button>

        {/* Notifications Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOpen(true);
            setIsNotifications(true);
            setIsMessages(false);
          }}
          className="relative text-white hover:bg-slate-700"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-blue-500 text-white text-xs">
            {notifications?.length || 0}
          </Badge>
        </Button>

        {session?.user?.refId && session?.user?.role && (
          <AnnouncementsDrawer
            userId={session.user.refId}
            role={session.user.role}
          />
        )}

        {/* User profile */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">
              {session?.user?.role !== "pet_parent" && "Dr. "}
              {session?.user?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {session?.user?.role?.replace("_", " ") ?? "user"}
            </p>
          </div>

          <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
            <AvatarImage
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? ""}
            />
            <AvatarFallback className="text-black font-medium">
              {session?.user?.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              {isMessages
                ? "Messages"
                : isNotifications
                ? "Notifications"
                : "Notifications"}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-6">
            {/* Message Notifications */}
            {isMessages && messageNotifications?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">
                  Messages ({messageNotifications?.length})
                </h3>
                <div className="space-y-3">
                  {messageNotifications?.map(
                    (notification: INotification, index: number) => (
                      <SystemNotification
                        key={`msg-${index}`}
                        notification={notification}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Other Notifications */}
            {isNotifications && notifications?.length > 0 && (
              <div>
                <div className="space-y-3">
                  {notifications?.map(
                    (notification: INotification, index: number) => (
                      <SystemNotification
                        key={`notif-${index}`}
                        notification={notification}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* No notifications message */}
            {((isMessages && !messageNotifications?.length) ||
              (isNotifications && !notifications?.length)) && (
              <p className="text-sm text-gray-500 text-center py-8">
                No notifications yet.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
