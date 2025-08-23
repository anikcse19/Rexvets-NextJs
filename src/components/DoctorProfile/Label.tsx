import React from "react";
import { LucideIcon } from "lucide-react";

interface LabelProps {
  icon?: LucideIcon;
  text: string;
}

export default function Label({ icon: Icon, text }: LabelProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      <span>{text}</span>
    </div>
  );
}
