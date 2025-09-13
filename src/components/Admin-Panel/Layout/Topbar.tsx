"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, LogOut, Sun, Moon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/lib/firebase";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: session } = useSession();
  console.log("data", session);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const markAsRead = async (notification: any) => {
    const ref = doc(
      db,
      notification.type === "doctor"
        ? "Doctors"
        : notification.type === "parent"
        ? "Parents"
        : notification.type === "donation"
        ? "Donations"
        : "",
      notification.id
    );
    await updateDoc(ref, { read: true });

    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);

    await Promise.all(
      unread.map((n) =>
        updateDoc(
          doc(
            db,
            n.type === "doctor"
              ? "Doctors"
              : n.type === "parent"
              ? "Parents"
              : n.type === "donation"
              ? "Donations"
              : "",
            n.id
          ),
          {
            read: true,
          }
        )
      )
    );

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    const doctorsQuery = query(
      collection(db, "Doctors"),
      orderBy("RegistrationTime", "asc")
    );
    const parentsQuery = query(
      collection(db, "Parents"),
      orderBy("RegistrationTime", "asc")
    );
    const donationsQuery = query(
      collection(db, "Donations"),
      orderBy("timestamp", "asc")
    );
    const unsubscribeDoctors = onSnapshot(doctorsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (change.type === "added" || change.type === "modified") {
          setNotifications((prev) => {
            const updated = [
              {
                id: change.doc.id,
                type: "doctor",
                name: data.Name,
                time: data.RegistrationTime?.toDate?.() || new Date(),
                read: data.read ?? false,
              },
              ...prev.filter(
                (n) => !(n.id === change.doc.id && n.type === "doctor")
              ),
            ];

            return updated.sort((a, b) => b.time.getTime() - a.time.getTime());
          });
        }
      });
    });

    const unsubscribeParents = onSnapshot(parentsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (change.type === "added" || change.type === "modified") {
          setNotifications((prev) => {
            const updated = [
              {
                id: change.doc.id,
                type: "parent",
                name: data.Name,
                time: data.RegistrationTime?.toDate?.() || new Date(),
                read: data.read ?? false,
              },
              ...prev.filter(
                (n) => !(n.id === change.doc.id && n.type === "parent")
              ),
            ];

            return updated.sort((a, b) => b.time.getTime() - a.time.getTime());
          });
        }
      });
    });
    const unsubscribeDonations = onSnapshot(donationsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        console.log("donation change data = ", data);
        if (change.type === "added" || change.type === "modified") {
          setNotifications((prev) => {
            const updated = [
              {
                id: change.doc.id,
                type: "donation",
                amount: data.donationAmount,
                name: data.donorName,
                time: data.timestamp?.toDate?.() || new Date(),
                read: data.read ?? false,
              },
              ...prev.filter(
                (n) => !(n.id === change.doc.id && n.type === "donation")
              ),
            ];

            return updated.sort((a, b) => b.time.getTime() - a.time.getTime());
          });
        }
      });
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeParents();
      unsubscribeDonations();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-[18px] dark:bg-slate-800 dark:border-blue-900 transition-colors">
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

              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 p-4">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 transition-colors duration-200 border-b last:border-b-0 dark:border-slate-700 ${
                      !notification.read
                        ? "bg-slate-100 dark:bg-slate-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {notification.type === "doctor"
                        ? `A new doctor named ${notification.name} has joined RexVets.`
                        : notification.type === "parent"
                        ? `A new pet parent named ${notification.name} has joined RexVets.`
                        : notification.type === "donation"
                        ? `A new $${notification.amount} donation has come from ${notification.name}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(notification.time, {
                        addSuffix: true,
                      })}
                    </p>
                    {!notification.read && (
                      <Button
                        variant="link"
                        className="text-xs text-blue-600 hover:underline p-0 mt-1"
                        onClick={() => markAsRead(notification)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                ))
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
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"
                    alt="Dr. Admin"
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

export default Topbar;
