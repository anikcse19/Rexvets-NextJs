"use client";

import { PetParent } from "@/lib/types";
import React, { useEffect, useState } from "react";
import PersonalInfoSection from "./Account/PersonalInfoSection";

export default function AccountPage({ doctorData }: { doctorData: PetParent }) {
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
