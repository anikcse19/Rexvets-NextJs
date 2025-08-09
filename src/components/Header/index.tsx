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
  "For pet parents": [
    "Book Consultation",
    "Emergency Care",
    "Pet Health Resources",
    "Pricing & Plans",
    "FAQ",
  ],
  "For vets & techs": [
    "Join Our Team",
    "Veterinarian Portal",
    "Continuing Education",
    "Resources & Tools",
    "Support Center",
  ],
  About: [
    "Our Mission",
    "Our Team",
    "Impact Stories",
    "Partnerships",
    "News & Press",
  ],
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
    // Updated header classes for fixed positioning
    <header className="  left-0 right-0 w-full bg-gradient-to-r from-[#1D1C37] to-[#0D3261] backdrop-blur-sm px-6 py-3 border-b border-slate-800/50 z-[9998]">
      <nav className="flex items-center justify-between mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/Logo (Gradient).svg"
              alt="Logo RexVets"
              width={120}
              height={120}
              quality={100}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8 z-[9999]">
          <a
            className="text-white hover:text-emerald-400 font-semibold transition-colors duration-300"
            href="#"
          >
            Home
          </a>

          {Object.entries(menuItems).map(([label, items]) => (
            <div
              key={label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(label)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center text-white hover:text-emerald-400 font-semibold transition-colors duration-300">
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
                    className="absolute top-full mt-2 w-56 max-h-80 overflow-y-auto bg-[#001a4d] rounded-md shadow-xl z-[10000] origin-top"
                  >
                    {items.map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="block px-4 py-2 text-white hover:text-emerald-400 hover:bg-[#002a66] text-sm transition-all duration-200"
                      >
                        {item}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <a
            className="text-white hover:text-emerald-400 font-semibold transition-colors duration-300"
            href="#"
          >
            Support
          </a>
          <a
            className="text-white hover:text-emerald-400 font-semibold transition-colors duration-300"
            href="#"
          >
            Donate
          </a>
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
                    alt="Logo RexVets"
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
