"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { toSlug } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import TalkToVetButton from "../TalkToVet";
import styles from "./Header.module.css";
import IconWrapper from "./IconWrapper";

const menuItems = {
  "For pet parents": ["Donate", "What we treat", "Get a prescription"],
  "For Vet & techs": ["Become a Rex Vet", "Rex Health Hub", "Support"],
  About: ["Our Mission", "Our Team", "How it Works"],
};

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session, status } = useSession();

<<<<<<< HEAD
  console.log(session, "session");

=======
>>>>>>> 2b7c745eabfc5a93474d57df707b6c66bef50b33
  // const session = {
  //   user: {
  //     name: "Anik",
  //     image: "",
  //     role: "user",
  //     email: "anikdebcse@gmail.com",
  //   },
  // };

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "pet_parent":
        return "Pet Parent";
      case "veterinarian":
        return "Veterinarian";
      case "technician":
        return "Vet Technician";
      // default:
      //   return "User";
    }
  };

  return (
    <header
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #0f3460 75%, #002366 100%)",
      }}
      className=" relative py-3 h-auto md:py-1   w-full  backdrop-blur-sm px-3  border-b border-slate-800/50 z-[9998]"
    >
      <nav className="flex items-center justify-between  mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" aria-label="Homepage">
            <Image
              src="/images/Logo.svg"
              alt="Logo RexVet"
              width={120}
              height={100}
              quality={100}
            />
          </Link>
        </div>

        {/* Desktop_Navigation */}
        <div className="hidden lg:flex items-center space-x-8 z-[9999]">
          <Link
            aria-label="Homepage"
            className="text-white  mx-[10px] hover:opacity-60 hover:text-emerald-400 font-bold transition-colors duration-300"
            href={"/"}
          >
            Home
          </Link>
          <Link
            aria-label="Homepage"
            className="text-white  mx-[10px] hover:opacity-60 hover:text-emerald-400 font-bold transition-colors duration-300"
            href={"/video-call?isPublisher=false"}
          >
            Join Video Call
          </Link>

          {Object.entries(menuItems).map(([label, items]) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(label)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                aria-haspopup="true"
                aria-expanded={openMenu === label}
                aria-controls={`${label}-menu`}
                className="flex hover:opacity-60 mx-[10px] font-bold items-center hover:opacity-0.8  text-white hover:text-emerald-400 transition-colors duration-300"
              >
                {label}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              <AnimatePresence>
                {openMenu === label && (
                  <motion.div
                    id={`${label}-menu`}
                    role="menu"
                    aria-label={`${label} submenu`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full mt-2 w-56 py-3 max-h-80 overflow-y-auto bg-[#002366]  shadow-xl z-[10000] origin-top"
                  >
                    {items.map((item) => (
                      <Link
                        role="menuitem"
                        key={item}
                        href={`/${toSlug(item)}`}
                        className="block px-4 py-2  text-white font-garet hover:text-emerald-400 hover:opacity-60 text-sm transition-all duration-200"
                      >
                        {item}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <Link
            className="text-white hover:opacity-60 mx-[10px] font-bold hover:text-emerald-400 transition-colors duration-300"
            href="/support"
          >
            Support
          </Link>
          <Link
            className="text-white hover:opacity-60 mx-[10px] font-bold hover:text-emerald-400  transition-colors duration-300"
            href="/donate"
          >
            Donate
          </Link>
        </div>

        {/* Right Side (Hamburger for mobile, User Profile and TalkToVetButton for desktop) */}
        <div className="flex items-center space-x-3 z-[9997]">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-emerald-400"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[80%] bg-[#001a4d] z-[10000] sheet-close-white"
            >
              <VisuallyHidden asChild>
                <DialogTitle>Main Menu</DialogTitle>
              </VisuallyHidden>

              <div className="bg-[#27305A] p-6 pt-11 h-screen overflow-y-auto">
                <div className="flex items-center">
                  <Image
                    src="/images/Logo.svg"
                    alt="Logo RexVet"
                    width={200}
                    height={200}
                    quality={100}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="mt-16">
                    {/* User Profile Section for Mobile */}
                    {session ? (
                      <div className="pb-4 border-b border-[#3D456B] mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={session.user?.image || ""} />
                            <AvatarFallback className="bg-emerald-500 text-white">
                              {session.user?.name
                                ? getUserInitials(session.user.name)
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">
                              {session.user?.name || "User"}
                            </p>
                            <p className="text-white/70 text-xs">
                              {session.user?.role
                                ? getRoleDisplayName(session.user.role)
                                : "User"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Link
                            href="/dashboard"
                            className="block text-white/80 hover:text-emerald-400 text-sm transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              handleSignOut();
                              setMobileMenuOpen(false);
                            }}
                            className="block text-white/80 hover:text-red-400 text-sm transition-colors w-full text-left"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pb-4 border-b border-[#3D456B] mb-4">
                        <Link
                          href="/auth/signin"
                          className="text-white hover:text-emerald-400 font-semibold text-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                      </div>
                    )}

                    <div className="pb-3 border-b border-[#3D456B]">
                      <Link
                        href="/"
                        className="text-white hover:text-emerald-400 font-semibold text-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </div>
                    <Link
                      aria-label="Homepage"
                      className="text-white  mx-[10px] hover:opacity-60 hover:text-emerald-400 font-bold transition-colors duration-300"
                      href={"/video-call?isPublisher=false"}
                    >
                      Join Video Call
                    </Link>
                    {Object.entries(menuItems).map(([label, items]) => (
                      <Collapsible key={label}>
                        <div className="py-4 border-b border-[#3D456B]">
                          <CollapsibleTrigger className="flex items-center text-white hover:text-emerald-400 font-semibold text-lg w-full">
                            {label}
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="pl-4">
                          {items.map((item) => (
                            <a
                              key={item}
                              href="#"
                              className="block px-4 py-4 border-b border-[#3D456B] text-white hover:text-emerald-400 hover:bg-[#002a66] text-sm transition-all duration-200"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item}
                            </a>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    <Link
                      href="/support"
                      className="text-white hover:text-emerald-400 font-semibold text-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Support
                    </Link>
                    <Link
                      href="/donate"
                      className="text-white hover:text-emerald-400 font-semibold text-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Donate
                    </Link>
                  </div>
                </div>
                {/* ================Footer================= */}
                <HeaderSmallDeviceFooter />
              </div>
            </SheetContent>
          </Sheet>

          <div className="lg:flex hidden items-center space-x-3">
            {/* User Profile Dropdown for Desktop */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold">
                        {session.user?.name
                          ? getUserInitials(session.user.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-64 z-[99999] rounded-2xl shadow-lg border border-emerald-100 bg-white/95 backdrop-blur-md p-2"
                  align="end"
                  forceMount
                >
                  {/* User Info */}
                  <DropdownMenuLabel className="font-normal px-2 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || ""}
                        />
                        <AvatarFallback className="bg-emerald-500 text-white">
                          {session.user?.name
                            ? getUserInitials(session.user.name)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-900">
                          {session.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">
                          {session.user?.role
                            ? getRoleDisplayName(session.user.role)
                            : "User"}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-2 bg-emerald-100" />

                  {/* Dashboard */}
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/${
                        session.user.role === "doctor" ? "doctor" : "pet-parent"
                      }/overview`}
                      className="flex items-center px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <UserCircle className="mr-2 h-4 w-4 text-emerald-600" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2 bg-emerald-100" />

                  {/* Logout */}
                  <DropdownMenuItem
                    className="flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 focus:text-red-600 cursor-pointer transition-colors"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="text-white hover:text-emerald-400"
                >
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            <div className="hidden 2xl:block">
              <TalkToVetButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Header);
const HeaderSmallDeviceFooter = () => {
  return (
    <div className=" flex-col items-center justify-center">
      <div className="absolute bottom-24 w-full flex flex-col items-center">
        {/* Divider */}
        <div className="w-[200px] h-px bg-white/20 mb-6" />

        {/* Social Icons */}
        <div className="flex gap-6">
          <IconWrapper>
            <FaFacebookF className="text-white text-lg" />
          </IconWrapper>
          <IconWrapper>
            <FaTiktok className="text-white text-lg" />
          </IconWrapper>
          <IconWrapper>
            <FaInstagram className="text-white text-lg" />
          </IconWrapper>
        </div>

        {/* Floating Chat Icon */}
        <div className="absolute right-11 -bottom-8 bg-[#041E89] p-3 rounded-full shadow-lg cursor-pointer">
          <BsChatLeftTextFill className="text-white text-xl" />
        </div>
      </div>
    </div>
  );
};
