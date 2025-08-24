"use client";

import React from "react";
import PersonalInfoSection from "./Account/PersonalInfoSection";

import { Doctor } from "@/lib/types";

export default function AccountPage({ doctorData }: { doctorData: Doctor }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Account Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information, professional details, and account
          preferences.
        </p>
      </div>

      {/* Account Sections */}
      <div className="space-y-8">
        <PersonalInfoSection />
      </div>
    </div>
  );
}
