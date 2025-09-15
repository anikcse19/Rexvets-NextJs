"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationType } from "@/models/Notification";
import { formatDistanceToNow } from "date-fns";
import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TopbarProps {
  onMenuClick: () => void;
}

interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  body?: string;
  subTitle?: string;
  recipientId: string;
  actorId?: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminTopBar = ({ onMenuClick }: TopbarProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  console.log("data", session);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch both types of notifications
      const [donationResponse, signupResponse] = await Promise.all([
        fetch("/api/notifications?type=NEW_DONATION&limit=25"),
        fetch("/api/notifications?type=NEW_SIGNUP&limit=25"),
      ]);

      const [donationResult, signupResult] = await Promise.all([
        donationResponse.json(),
        signupResponse.json(),
      ]);

      const allNotifications = [
        ...(donationResult.success ? donationResult.data || [] : []),
        ...(signupResult.success ? signupResult.data || [] : []),
      ];

      // Sort by creation date (newest first)
      allNotifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(allNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification: Notification) => {
    try {
      const response = await fetch(`/api/notifications/${notification._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => !n.isRead)
        .map((n) => n._id);

      if (unreadIds.length === 0) return;

      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // // Set up polling to fetch notifications every 30 seconds
    // const interval = setInterval(fetchNotifications, 30000);

    // return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-[12px] dark:bg-slate-800 dark:border-blue-900 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-blue-700 dark:text-blue-100"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-blue-700 dark:text-blue-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-80 max-h-96 overflow-y-auto rounded-xl shadow-xl bg-gray-100 dark:bg-slate-800 border dark:border-slate-700"
              align="end"
            >
              <DropdownMenuLabel className="flex justify-between items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="link"
                    className="text-xs text-blue-600 hover:underline p-0"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {loading ? (
                <p className="text-sm text-gray-500 p-4">
                  Loading notifications...
                </p>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-gray-500 p-4">No notifications</p>
              ) : (
                notifications?.map((notification) => {
                  const isNotificationDonation =
                    notification?.type === NotificationType.NEW_DONATION;
                  const isNotificationSignup =
                    notification?.type === NotificationType.NEW_SIGNUP;
                  const vetId =
                    isNotificationSignup && notification?.data?.veterinarianId
                      ? notification?.data?.veterinarianId
                      : "";
                  if (isNotificationSignup) {
                    console.log("notification", notification);
                  }
                  const petParentId =
                    isNotificationSignup && notification?.data?.petParentId
                      ? notification?.data?.petParentId
                      : "";

                  return (
                    <div
                      key={notification._id}
                      className={`px-4 py-3 transition-colors duration-200 border-b last:border-b-0 dark:border-slate-700 ${
                        !notification?.isRead
                          ? "bg-slate-100 dark:bg-slate-700"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                      }`}
                    >
                      {!isNotificationDonation ? (
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                              {notification?.title}
                            </p>
                            {notification.body && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                {notification.body}
                              </p>
                            )}
                          </div>
                          {(isNotificationSignup && petParentId) || vetId ? (
                            // <Link
                            //   href={vetId ? `/admin/vets/${vetId}` : "/admin/vets"}
                            //   className="shrink-0"
                            // >
                            <Button
                              onClick={() => {
                                if (vetId) {
                                  router.push(
                                    `/admin/doctors/vets?vetId=${vetId}`
                                  );
                                  return;
                                }
                                if (petParentId) {
                                  router.push(
                                    `/admin/pet-parents/list?parentId=${petParentId}`
                                  );
                                }
                              }}
                              size="sm"
                              variant="outline"
                              className=" cursor-pointer text-blue-700 border-blue-200 hover:bg-blue-50"
                            >
                              Visit vet profile
                            </Button>
                          ) : // </Link>
                          null}
                        </div>
                      ) : (
                        <>
                          <p>
                            A new ${notification?.data?.donationAmount} donation
                            has come from{" "}
                            {notification?.data?.donorName || "----"}
                          </p>
                        </>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {!notification.isRead && (
                        <Button
                          variant="link"
                          className="text-xs text-blue-600 hover:underline p-0 mt-1"
                          onClick={() => markAsRead(notification)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="max-w-[140px] truncate font-medium text-gray-800 dark:text-gray-900 bg-gray-200 px-2 py-1 rounded">
            {session?.user?.name}
          </p>

          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-blue-700 dark:text-blue-100"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full shadow-2xl"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://cdn-icons-png.flaticon.com/512/9322/9322133.png"
                    alt="Dr. Admin"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {session?.user?.name
                      ? session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "DA"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name || "Dr. Admin"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
