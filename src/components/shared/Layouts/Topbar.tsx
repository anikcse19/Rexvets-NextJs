"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export default function Topbar({
  title = "Dashboard",
  onMenuClick,
  sidebarOpen = false,
}: TopbarProps) {
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
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative text-white hover:bg-slate-700"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            3
          </Badge>
        </Button>

        {/* User profile */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">Dr. Anik Deb</p>
            <p className="text-xs text-muted-foreground">Veterinarian</p>
          </div>

          <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
            <AvatarImage
              src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face"
              alt="Dr. Anik Rahman"
            />
            <AvatarFallback className="text-black font-medium">
              AR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
