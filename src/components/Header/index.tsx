"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import { toSlug } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import TalkToVetButton from "../TalkToVet";
import styles from "./Header.module.css";

const menuItems = {
  "For pet parents": ["Donate", "What we treat", "Get a prescription"],
  "For Vet & techs": ["Become a Rex Vet", "Rex's Health Hub", "Support"],
  About: ["Our Mission", "Our Team", "How it Works"],
};

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
  };

  return (
    <header
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #24243e 25%, #302b63 50%, #0f3460 75%, #002366 100%)",
      }}
      className=" relative h-auto py-1   w-full  backdrop-blur-sm px-3  border-b border-slate-800/50 z-[9998]"
    >
      <nav className="flex items-center justify-between  mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/Logo (Gradient).svg"
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
            className="text-white  mx-[10px] hover:opacity-60 hover:text-emerald-400 font-bold transition-colors duration-300"
            href={"/"}
          >
            Home
          </Link>

          {Object.entries(menuItems).map(([label, items]) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(label)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex hover:opacity-60 mx-[10px] font-bold items-center hover:opacity-0.8  text-white hover:text-emerald-400 transition-colors duration-300">
                {label}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              <AnimatePresence>
                {openMenu === label && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full mt-2 w-56 py-3 max-h-80 overflow-y-auto bg-[#002366]  shadow-xl z-[10000] origin-top"
                  >
                    {items.map((item) => (
                      <Link
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

        {/* Right Side (Hamburger for mobile, TalkToVetButton and User for desktop) */}
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
                    src="/images/Logo (Gradient).svg"
                    alt="Logo RexVet"
                    width={200}
                    height={200}
                    quality={100}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="mt-16">
                    <div className="pb-3 border-b border-[#3D456B]">
                      <a
                        href="#"
                        className="text-white hover:text-emerald-400 font-semibold text-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </a>
                    </div>
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
                    <a
                      href="#"
                      className="text-white hover:text-emerald-400 font-semibold text-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Support
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-emerald-400 font-semibold text-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Donate
                    </a>
                  </div>
                </div>
                {/* ================Footer================= */}
                <HeaderSmallDeviceFooter />
              </div>
            </SheetContent>
          </Sheet>
          <div className="lg:flex hidden items-center space-x-3">
            <button className={styles.user_icon_btn}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "5px",
                  opacity: 0.5,
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              >
                <User color="black" size={20} />
              </div>
            </button>
            <TalkToVetButton />
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
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-[#1BC5A3] hover:scale-110 transition-transform duration-300 p-3 rounded-full cursor-pointer shadow-md">
    {children}
  </div>
);
