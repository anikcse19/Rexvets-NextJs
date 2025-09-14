"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  CreditCard,
  FileText,
  Star,
  Settings,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  UserPlus,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  X,
  Building2,
  LogOut,
  LifeBuoy,
  MonitorCog,
  Video,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import SidebarMenuSkeleton from "./SidebarSkeletonMenu";
import Logo from "../../../../public/images/Logo.svg";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["doctors"]);
  const { data: session, status } = useSession();
  const accessList = session?.user?.accesslist || [];
  const role = session?.user?.role || "";
  // const role = "admin";

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/overview",
    },
    {
      title: "Appointments",
      icon: Calendar,
      href: "/admin/appointments",
      children: [
        { title: "All Appointments", href: "/admin/appointments/list" },
        {
          title: "Reschedule Appointments",
          href: "/admin/appointments/reschedule-appointments/list",
        },
      ],
    },
    {
      title: "Doctors",
      icon: Stethoscope,
      href: "/admin/dashboard/doctors",
      children: [
        { title: "Vets", href: "/admin/doctors/vets" },
        // { title: "Technician", href: "/admin/doctors/technician" },
      ],
    },
    {
      title: "Pet Parents",
      icon: Users,
      href: "/admin/pet-parents/list",
      // children: [{ title: "All Parents", href: "/admin/pet-parents/list" }],
    },

    {
      title: "Donations",
      icon: CreditCard,
      href: "/admin/donations",
    },
    {
      title: "Pharmacy Request",
      icon: ClipboardList,
      href: "/admin/pharmacy-requests",
    },

    {
      title: "Reviews",
      icon: Star,
      href: "/admin/reviews",
    },
    {
      title: "Support",
      icon: LifeBuoy,
      href: "/admin/support",
    },
    {
      title: "Video Monitoring",
      icon: Video,
      href: "/admin/video-call-monitoring",
    },
    {
      title: "System Update",
      icon: MonitorCog,
      href: "/admin/system-update",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      children: [
        { title: "Moderator", href: "/admin/settings/moderator" },
        // { title: "Site Settings", href: "/admin/settings/site-settings" },
      ],
    },
  ];

  const renderMenuItem = (item: any, level = 0, parentVisible = false) => {
    const hasAccess = role === "admin" || accessList.includes(item.title);

    // Only enforce access check at top-level
    if (!hasAccess && !parentVisible) return null;

    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.title.toLowerCase());
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <Collapsible
          key={item.title}
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.title.toLowerCase())}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer",
                level === 0 ? "px-3 py-2 mb-1" : "px-6 py-1.5 text-sm",
                level === 1 ? "ml-4" : "",
                isActive && "bg-blue-100 text-blue-700 font-medium"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  {Icon && level === 0 && <Icon className="h-4 w-4 mr-3" />}
                  <span>{item.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children.map(
              (child: any) => renderMenuItem(child, level + 1, true) // mark child as under visible parent
            )}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link key={item.href} href={item.href} onClick={onClose}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer",
            level === 0 ? "px-3 py-2 mb-1" : "px-6 py-1.5 text-sm",
            level === 1 ? "ml-4" : "",
            level === 2 ? "ml-8" : "",
            isActive && "bg-blue-100 text-blue-700 font-medium"
          )}
        >
          {Icon && level === 0 && <Icon className="h-4 w-4 mr-3" />}
          <span>{item.title}</span>
        </Button>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-blue-900 dark:bg-slate-800 text-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between",
          "lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-200">
          <div className="flex items-center justify-center space-x-2 w-full">
            <div className=" rounded-lg flex items-center justify-center">
              <Image width={150} height={150} src={Logo} alt="LogoWhite" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden cursor-pointer"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {status === "loading" ? (
              <SidebarMenuSkeleton />
            ) : (
              menuItems.map((item) => renderMenuItem(item))
            )}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-blue-200 bg-blue-900/80 dark:bg-slate-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-700  hover:bg-blue-800 text-white font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-xs text-blue-100 text-center mt-3">
            © {new Date().getFullYear()} RexVets. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
