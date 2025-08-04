"use client";

import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200); // Delay before closing
  };

  return (
    <header className="min-h-[70px] bg-gradient-to-r from-[#1D1C37] to-[#0D3261] backdrop-blur-sm px-6 py-3 border-b border-slate-800/50">
      <nav className="flex items-center justify-between mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/LogoR-BwtRiloc.webp"
            alt="Logo RexVets"
            width={40}
            height={40}
            quality={100}
          />
          <h1 className={styles.main_logo}>exVets</h1>
        </div>

        {/* Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <a
            className="text-white hover:text-emerald-400 font-semibold"
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
              <button className="flex items-center text-white hover:text-emerald-400 font-semibold transition-colors">
                {label}
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {openMenu === label && (
                <div className="absolute top-full mt-2 w-56 max-h-80 overflow-y-auto bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50 opacity-100 scale-100 transition-all duration-200 origin-top">
                  {items.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-4 py-2 text-white hover:bg-slate-700 hover:text-emerald-400 text-sm transition"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <a
            className="text-white hover:text-emerald-400 font-semibold"
            href="#"
          >
            Support
          </a>
          <a
            className="text-white hover:text-emerald-400 font-semibold"
            href="#"
          >
            Donate
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition cursor-pointer">
            <User className="w-4 h-4 text-slate-300" />
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg transition-all duration-200 hover:shadow-emerald-500/25">
            <span className="mr-2">💬</span>
            Talk to a Vet
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Header);
