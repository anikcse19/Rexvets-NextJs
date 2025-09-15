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
  User,
  UserCircle,
  Video,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import TalkToVetButton from "../TalkToVet";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import IconWrapper from "./IconWrapper";
import {
  default as TopToolbar,
  default as TopToolbarPetParent,
} from "./Toolbar";
import TopToolbarVet from "./ToolbarVet";

const menuItems = {
  "Pet parents": ["Donate", "What we treat"],
  "Vet & techs": ["Become a Rex Vet", "Rex Health Hub", "Support"],
  About: ["Our Mission", "Our Team", "How it Works"],
};

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [badge, setBadge] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isSLotAvailable, setIsSLotAvailable] = useState(false);

  const { data: session, status } = useSession();

  // const session = {
  //   user: {
  //     name: "Anik",
  //     image: "",
  //     role: "user",
  //     email: "anikdebcse@gmail.com",
  //   },
  // };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const getBadgeName = async () => {
      try {
        const res = await fetch("/api/check-category-badge");

        if (!res.ok) {
          // Gracefully ignore not found/unauthorized without logging errors in console
          if (res.status === 404 || res.status === 401) return;
          throw new Error(`Failed to fetch badge (${res.status})`);
        }

        const data = await res.json();
        setBadge(data?.badgeName);
      } catch (error: any) {
        // Avoid noisy logs in production for non-critical UI badge
        if (process.env.NODE_ENV === "development") {
          console.log(error?.message);
        }
      }
    };
    getBadgeName();
  }, []);
  // console.log("session emergency", session);

  const isAppointmentSLotAvailable = async (vetId: string) => {
    if (session?.user?.role !== "veterinarian") {
      return;
    }
    try {
      const response = await fetch(
        `/api/appointments/booking/slot/has-availability?vetId=${vetId}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch appointment slot availability: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("isAppointmentSLotAvailable", data?.data?.hasAvailability);
      setIsSLotAvailable(data?.data?.hasAvailability);
    } catch (error: any) {
      toast.error(
        error.message || "Failed to fetch appointment slot availability"
      );
      console.error("Error fetching appointment slot availability:", error);
    }
  };
  useEffect(() => {
    if (session?.user?.role === "veterinarian" && session?.user?.refId) {
      isAppointmentSLotAvailable(session?.user?.refId);
    }
  }, [session]);

  // Avoid UI flicker while session is loading
  if (status === "loading") {
    return null;
  }

  return (
    <>
      {!session || session?.user?.role === "pet_parent" ? (
        <TopToolbarPetParent visible={visible} setVisible={setVisible} />
      ) : (
        !isSLotAvailable && (
          <TopToolbarVet visible={visible} setVisible={setVisible} />
        )
      )}
      <header
        style={{
          background:
            "linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #0f3460 75%, #002366 100%)",
        }}
        className={`fixed ${
          scrolled || !visible || isSLotAvailable
            ? "top-0"
            : "top-[60px] md:top-[50px]"
        } transition-all duration-300 ease-in-out py-2 ${
          session?.user.role === "veterinarian" ? "md:py-4" : "md:py-2"
        } w-full backdrop-blur-sm px-3 lg:px-7  border-b border-slate-800/50 z-[9998]`}
      >
        <nav className="flex items-center justify-between  mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Homepage">
              <Image
                src="/images/Logo.svg"
                alt="Logo RexVet"
                width={120}
                height={120}
                quality={100}
              />
            </Link>
          </div>

          {/* Desktop_Navigation */}
          <div className="hidden xl:flex items-center justify-center space-x-10 z-[9999]">
            <Link
              aria-label="Homepage"
              className="text-white hover:opacity-60 hover:text-emerald-400 font-bold transition-colors duration-300 text-center"
              href={"/"}
            >
              Home
            </Link>

            {Object.entries(menuItems).map(([label, items]) => {
              // Render "For pet parents" and "For Vet & techs" dropdowns
              if (label === "Pet parents" || label === "Vet & techs") {
                return (
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
                      className="flex hover:opacity-60 font-bold items-center justify-center text-white hover:text-emerald-400 transition-colors duration-300 text-center"
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
                          className="absolute top-full mt-2 w-56 py-3 max-h-80 overflow-y-auto bg-[#2A274F] border border-slate-400 shadow-xl z-[10000] origin-top rounded"
                        >
                          {items.map((item) => (
                            <Link
                              role="menuitem"
                              key={item}
                              href={`/${toSlug(item)}`}
                              className="block mx-1 px-4 py-2 text-white font-garet text-left hover:bg-teal-300 hover:text-black text-sm transition-all duration-200"
                            >
                              {item}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Render "Get a prescription" as standalone link before About
              if (label === "About") {
                return (
                  <React.Fragment key="get-prescription-and-about">
                    <Link
                      className="text-white hover:opacity-60 font-bold hover:text-emerald-400 transition-colors duration-300 text-center"
                      href="/get-a-prescription"
                    >
                      Get A Prescription
                    </Link>
                    <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        aria-haspopup="true"
                        aria-expanded={openMenu === label}
                        aria-controls={`${label}-menu`}
                        className="flex hover:opacity-60 font-bold items-center justify-center text-white hover:text-emerald-400 transition-colors duration-300 text-center"
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
                            className="absolute top-full mt-2 w-56 py-3 max-h-80 overflow-y-auto bg-[#143361] border border-slate-400 shadow-xl z-[10000] origin-top rounded"
                          >
                            {items.map((item) => (
                              <Link
                                role="menuitem"
                                key={item}
                                href={`/${toSlug(item)}`}
                                className="block mx-1 px-4 py-2 text-white font-garet hover:bg-teal-300 hover:text-black text-sm transition-all duration-200 text-left"
                              >
                                {item}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </React.Fragment>
                );
              }

              return null;
            })}
            <Link
              className="text-white hover:opacity-60 font-bold hover:text-emerald-400 transition-colors duration-300 text-center"
              href="/support"
            >
              Support
            </Link>
            <Link
              className="text-white hover:opacity-60 font-bold hover:text-emerald-400 transition-colors duration-300 text-center"
              href="/donate"
            >
              Donate
            </Link>
          </div>

          {/* Right Side (Hamburger for mobile, User Profile and TalkToVetButton for desktop) */}
          <div className="flex items-center space-x-3 z-[9997]">
            <div className="flex items-center space-x-3">
              {/* User Profile Dropdown for Desktop */}
              {session ? (
                <DropdownMenu>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`h-10 w-10 rounded-full hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer ${
                              session.user.role === "veterinarian" && "xl:mr-20"
                            }`}
                          >
                            <div className="relative h-10 w-10">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={(session?.user as any)?.image || ""}
                                  alt={(session?.user as any)?.name || ""}
                                />
                                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold">
                                  {(session?.user as any)?.name
                                    ? getUserInitials(
                                        (session?.user as any).name
                                      )
                                    : "U"}
                                </AvatarFallback>
                              </Avatar>

                              {/* Badge (just a static div, no trigger here) */}
                              {(badge === "Pet Care Hero" ||
                                badge === "Community Champion" ||
                                badge === "Friend of Rex Vet") && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full overflow-hidden border-2 border-white">
                                  <Image
                                    src={`/images/badge/${
                                      badge === "Friend of Rex Vet"
                                        ? "friendBadge3.webp"
                                        : badge === "Community Champion"
                                        ? "championBadge3.webp"
                                        : badge === "Pet Care Hero"
                                        ? "heroBadge4.webp"
                                        : ""
                                    }`}
                                    alt="Badge"
                                    fill
                                    sizes="24px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>

                      {(badge === "Pet Care Hero" ||
                        badge === "Community Champion" ||
                        badge === "Friend of Rex Vet") && (
                        <TooltipContent
                          className="z-[9999]"
                          side="top"
                          align="center"
                        >
                          <p>
                            {badge === "Friend of Rex Vet"
                              ? "Friend of Rex Vet"
                              : badge === "Community Champion"
                              ? "Community Champion"
                              : badge === "Pet Care Hero"
                              ? "Pet Care Hero"
                              : ""}
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <DropdownMenuContent
                    className="w-64 z-[99999] rounded-2xl shadow-lg border border-emerald-100 bg-[#211951] backdrop-blur-md p-2"
                    align="end"
                    forceMount
                  >
                    {/* User Info */}
                    <DropdownMenuLabel className="font-normal px-2 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={(session?.user as any)?.image || ""}
                            alt={(session?.user as any)?.name || ""}
                          />

                          <AvatarFallback className="bg-emerald-500 text-white">
                            {(session?.user as any)?.name
                              ? getUserInitials((session?.user as any).name)
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-white">
                            {(session?.user as any)?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-300 truncate">
                            {(session?.user as any)?.email}
                          </p>
                          <p className="text-xs text-emerald-600 font-medium">
                            {(session?.user as any)?.role
                              ? getRoleDisplayName((session?.user as any).role)
                              : "User"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    {session?.user?.role === "pet_parent" && (
                      <>
                        <DropdownMenuSeparator className="my-2 bg-emerald-100" />
                        <DropdownMenuItem
                          asChild
                          className="group hover:bg-red-50 focus:bg-red-50 data-[highlighted]:bg-red-50 text-blue-200 data-[highlighted]:text-[#211951]"
                        >
                          <Link
                            href={`/find-a-vet`}
                            className="flex items-center px-3 py-2 rounded-lg cursor-pointer"
                          >
                            <Video className="mr-2 h-4 w-4 text-blue-200 group-data-[highlighted]:text-black" />
                            <span className="text-sm group-data-[highlighted]:text-black">
                              Talk to Vet
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="my-2 bg-emerald-100" />

                    {/* Dashboard */}
                    <DropdownMenuItem
                      asChild
                      className="group hover:bg-red-50 focus:bg-red-50 data-[highlighted]:bg-red-50 text-blue-200 data-[highlighted]:text-[#211951]"
                    >
                      <Link
                        href={`/dashboard/${
                          (session?.user as any).role === "veterinarian"
                            ? "doctor"
                            : "pet-parent"
                        }/overview`}
                        className="flex items-center px-3 py-2 rounded-lg cursor-pointer"
                      >
                        <UserCircle className="mr-2 h-4 w-4 text-blue-200 group-data-[highlighted]:text-black" />
                        <span className="text-sm group-data-[highlighted]:text-black">
                          Dashboard
                        </span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2 bg-emerald-100" />

                    {/* Logout */}
                    <DropdownMenuItem
                      className="flex items-center px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 focus:text-red-600 cursor-pointer transition-colors"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-400" />
                      <span className="text-sm">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-emerald-400 cursor-pointer"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              {session?.user.role !== "veterinarian" && (
                <div className="hidden 2xl:block">
                  <TalkToVetButton />
                </div>
              )}
            </div>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="xl:hidden text-white hover:text-emerald-400"
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

                <div className="bg-[#27305A] h-screen flex flex-col">
                  <div className="p-6 pt-11 flex-shrink-0">
                    <div className="flex items-center">
                      <Image
                        src="/images/Logo.svg"
                        alt="Logo RexVet"
                        width={200}
                        height={200}
                        quality={100}
                      />
                    </div>
                  </div>

                  <ScrollArea className="flex-1 px-6">
                    <div className="flex flex-col gap-4 pb-24">
                      <div className="mt-8">
                        <div className="pb-3 border-b border-[#3D456B] text-start">
                          <Link
                            href="/"
                            className="text-white hover:text-emerald-400 font-semibold text-lg block"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Home
                          </Link>
                        </div>
                        {/* <div className="pb-3 border-b border-[#3D456B] text-center">
                      <Link
                        href={"/video-call?isPublisher=false"}
                        className="text-white hover:text-emerald-400 font-semibold text-lg block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Join Video Call
                      </Link>
                    </div> */}
                        {Object.entries(menuItems).map(([label, items]) => {
                          // Render "For pet parents" and "For Vet & techs" collapsible menus
                          if (
                            label === "Pet parents" ||
                            label === "Vet & techs"
                          ) {
                            return (
                              <Collapsible key={label}>
                                <div className="py-4 border-b border-[#3D456B]">
                                  <CollapsibleTrigger className="flex justify-between items-start text-white hover:text-emerald-400 font-semibold text-lg w-full">
                                    {label}
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="pl-4">
                                  {items.map((item) => (
                                    <Link
                                      key={item}
                                      href={`/${toSlug(item)}`}
                                      className="block px-4 py-4 border-b border-[#3D456B] text-white hover:text-emerald-400 hover:bg-[#002a66] text-sm transition-all duration-200"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          }

                          // Render "Get a prescription" as standalone link before About
                          if (label === "About") {
                            return (
                              <React.Fragment key="get-prescription-and-about">
                                <div className="py-4 border-b border-[#3D456B] text-center">
                                  <Link
                                    href="/get-a-prescription"
                                    className="text-white text-start hover:text-emerald-400 font-semibold text-lg block"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    Get a prescription
                                  </Link>
                                </div>
                                <Collapsible key={label}>
                                  <div className="py-4 border-b border-[#3D456B]">
                                    <CollapsibleTrigger className="flex items-start justify-between text-white hover:text-emerald-400 font-semibold text-lg w-full">
                                      {label}
                                      <ChevronDown className="w-4 h-4 ml-1" />
                                    </CollapsibleTrigger>
                                  </div>
                                  <CollapsibleContent className="pl-4">
                                    {items.map((item) => (
                                      <Link
                                        key={item}
                                        href={`/${toSlug(item)}`}
                                        className="block px-4 py-4 border-b text-start border-[#3D456B] text-white hover:text-emerald-400 hover:bg-[#002a66] text-sm transition-all duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {item}
                                      </Link>
                                    ))}
                                  </CollapsibleContent>
                                </Collapsible>
                              </React.Fragment>
                            );
                          }

                          return null;
                        })}
                        <div className="pb-3 border-b border-[#3D456B] text-start">
                          <Link
                            href="/support"
                            className="text-white hover:text-emerald-400 font-semibold text-lg block"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Support
                          </Link>
                        </div>
                        <div className="pb-3 border-b border-[#3D456B] text-start">
                          <Link
                            href="/donate"
                            className="text-white hover:text-emerald-400 font-semibold text-lg block"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Donate
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>

                  {/* Footer - Fixed at bottom */}
                  <div className="flex-shrink-0">
                    <HeaderSmallDeviceFooter />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
};

export default React.memo(Header);

const HeaderSmallDeviceFooter = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center">
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
    </div>
  );
};
