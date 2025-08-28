"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { bottomMenuItems, menuItemsPetParent } from "@/lib";
import { MenuItems } from "@/lib/types";
import { signOut } from "next-auth/react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <aside className="w-64 h-full border-r border-slate-600 flex flex-col bg-[#1C1B36] shadow-xl lg:shadow-none">
      {/* Mobile close button */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-slate-600 lg:justify-center">
        <Link href="/" aria-label="Homepage" className="flex-shrink-0">
          <Image
            src="/images/Logo.svg"
            alt="Logo RexVet"
            width={150}
            height={40}
            quality={100}
            className="object-contain"
          />
        </Link>

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 text-white overflow-y-auto flex flex-col gap-2">
        {menuItemsPetParent.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={pathname === item.href}
            onClick={() => {
              onClose && onClose();
              handleSignOut;
            }}
          />
        ))}
      </nav>

      {/* Bottom Menu Items */}
      <div className="p-4 border-t border-slate-600 space-y-2">
        {bottomMenuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={pathname === item.href}
            onClick={onClose}
          />
        ))}
      </div>
    </aside>
  );
}

interface MenuItemProps {
  item: MenuItems;
  isActive: boolean;
  onClick?: () => void;
}

function MenuItem({ item, isActive, onClick }: MenuItemProps) {
  const Icon = item.icon;

  const content = (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 text-white cursor-pointer transition-colors duration-200",
        "hover:text-white hover:bg-[#6e6cb1]",
        isActive && "bg-[#7573af] text-primary border border-[#7573af]/50"
      )}
      onClick={onClick}
    >
      <Icon className="w-10 h-10 flex-shrink-0" />
      <span className="truncate text-base">{item.label}</span>
      {item.badge && (
        <Badge
          variant="secondary"
          className="ml-auto bg-primary text-primary-foreground"
        >
          {item.badge}
        </Badge>
      )}
    </Button>
  );

  if (item.external_href) {
    return (
      <a
        href={item.external_href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        {content}
      </a>
    );
  }

  return <Link href={item.href || "#"}>{content}</Link>;
}
