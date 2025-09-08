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
import pusherClient from "@/lib/pusherClient";
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

  // Function to mark a notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!res.ok) {
        console.error("Failed to mark notification as read");
        return;
      }

      // Refresh notifications to update the count
      getMessageNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to delete a notification
  const deleteNotification = async (notification: INotification) => {
    try {
      const notificationId = (notification as any)._id;
      if (!notificationId) {
        console.error("No notification ID found", notification);
        toast.error("Notification ID not found");
        return;
      }

      // Optimistically remove from UI immediately
      setNotifications((prev) =>
        prev.filter((n) => (n as any)._id !== notificationId)
      );
      setMessageNotifications((prev) =>
        prev.filter((n) => (n as any)._id !== notificationId)
      );

      console.log("Deleting notification with ID:", notificationId);

      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to delete notification:", res.status, errorData);
        toast.error(`Failed to delete notification: ${res.status}`);

        // Revert the optimistic update on error
        getMessageNotifications();
        getNotifications();
        return;
      }

      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");

      // Revert the optimistic update on error
      getMessageNotifications();
      getNotifications();
    }
  };

  useEffect(() => {
    if (session) {
      getNotifications();
      getMessageNotifications();

      // subscribe for realtime notifications
      const channel = pusherClient.subscribe(`user-${session.user.id}`);
      const refresh = () => {
        getNotifications();
        getMessageNotifications();
      };
      channel.bind("new-notification", refresh);
      return () => {
        channel.unbind("new-notification", refresh);
        pusherClient.unsubscribe(`user-${session.user.id}`);
      };
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
        {/* Messages Button - Shows chat message notifications */}
        <Button
          variant="ghost" // Transparent background button style
          size="sm" // Small button size
          onClick={() => {
            // When clicked, open the notification panel
            setOpen(true);
            // Hide general notifications section
            setIsNotifications(false);
            // Show messages section in the panel
            setIsMessages(true);
          }}
          className="relative text-white hover:bg-slate-700" // White text, dark hover effect, relative positioning for badge
        >
          {/* Message circle icon */}
          <MessageCircle className="w-5 h-5" />

          {/* Red badge showing unread message count */}
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {/* Display count of unread message notifications, default to 0 if none */}
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
          className="relative cursor-pointer text-white hover:bg-slate-700"
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
        <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col h-full">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>
              {isMessages
                ? "Messages"
                : isNotifications
                ? "Notifications"
                : "Notifications"}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex flex-col flex-1 min-h-0">
            {/* Message Notifications */}
            {isMessages && messageNotifications?.length > 0 && (
              <div className="flex flex-col flex-1 min-h-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2 flex-shrink-0">
                  Messages ({messageNotifications?.length})
                </h3>
                <div className="space-y-3 overflow-y-auto flex-1 pr-2 pb-8 min-h-0">
                  {messageNotifications?.map(
                    (notification: INotification, index: number) => (
                      <SystemNotification
                        key={`msg-${index}`}
                        notification={notification}
                        onClick={() => {
                          // Mark notification as read when clicked
                          if ((notification as any)._id) {
                            markNotificationAsRead((notification as any)._id);
                          }
                          // Close the notification panel when clicking on a message notification
                          setOpen(false);
                        }}
                        onDelete={deleteNotification}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Other Notifications */}
            {isNotifications && notifications?.length > 0 && (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="space-y-3 overflow-y-auto flex-1 pr-2 pb-8 min-h-0">
                  {notifications?.map(
                    (notification: INotification, index: number) => (
                      <SystemNotification
                        onClose={() => {
                          setOpen(false);
                          setIsNotifications(false);
                          setIsMessages(false);
                        }}
                        key={`notif-${index}`}
                        notification={notification}
                        onDelete={deleteNotification}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* No notifications message */}
            {((isMessages && !messageNotifications?.length) ||
              (isNotifications && !notifications?.length)) && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-500 text-center py-8">
                  No notifications yet.
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
