"use client";

import React from "react";

interface RexHealthHubStatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  index?: number;
}

const RexHealthHubStatsCard: React.FC<RexHealthHubStatsCardProps> = ({
  label,
  value,
  icon,
}) => (
  <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 text-center will-change-transform">
    <div className="flex justify-center mb-2">{icon}</div>
    <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
  </div>
);
export default React.memo(RexHealthHubStatsCard);
