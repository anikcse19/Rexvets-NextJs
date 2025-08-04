import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className="min-h-[70px] bg-gradient-to-r overflow-visible from-[#1D1C37] to-[#0D3261] backdrop-blur-sm px-6 py-3 border-b border-slate-800/50">
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

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <a
            href="#"
            className="text-white hover:text-emerald-400 transition-colors text-[16px] font-[600]"
          >
            Home
          </a>

          {/* For Pet Parents Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[16px] font-[600] text-white hover:text-emerald-400 transition-colors flex items-center py-2 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0">
                For pet parents
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50 overflow-visible">
              {[
                "Book Consultation",
                "Emergency Care",
                "Pet Health Resources",
                "Pricing & Plans",
                "FAQ",
              ].map((item) => (
                <DropdownMenuItem
                  key={item}
                  className="text-white hover:bg-slate-700 hover:text-emerald-400 focus:bg-slate-700 focus:text-emerald-400"
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* For Vets & Techs Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[16px] font-[600] text-white hover:text-emerald-400 transition-colors flex items-center py-2 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0">
                For vets & techs
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-80  overflow-y-auto bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50">
              {[
                "Join Our Team",
                "Veterinarian Portal",
                "Continuing Education",
                "Resources & Tools",
                "Support Center",
              ].map((item) => (
                <DropdownMenuItem
                  key={item}
                  className="text-white z-50 hover:bg-slate-700 hover:text-emerald-400 focus:bg-slate-700 focus:text-emerald-400"
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* About Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[16px] font-[600] text-white hover:text-emerald-400 transition-colors flex items-center py-2 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0">
                About
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 max-h-80 overflow-y-auto bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50">
              {[
                "Our Mission",
                "Our Team",
                "Impact Stories",
                "Partnerships",
                "News & Press",
              ].map((item) => (
                <DropdownMenuItem
                  key={item}
                  className="text-white hover:bg-slate-700 hover:text-emerald-400 focus:bg-slate-700 focus:text-emerald-400"
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <a
            href="#"
            className="text-[16px] font-[600] text-white hover:text-emerald-400 transition-colors"
          >
            Support
          </a>
          <a
            href="#"
            className="text-[16px] font-[600] text-white hover:text-emerald-400 transition-colors"
          >
            Donate
          </a>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* User Icon */}
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer">
            <User className="w-4 h-4 text-slate-300" />
          </div>

          {/* Talk to a Vet Button */}
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg transition-all duration-200 hover:shadow-emerald-500/25">
            <span className="mr-2">💬</span>
            Talk to a Vet
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
