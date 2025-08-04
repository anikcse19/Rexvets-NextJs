import React from "react";
import { Badge } from "./ui/badge";
const ServiceBadge: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => {
  return (
    <Badge
      variant="secondary"
      className="bg-slate-700/50 text-white border-slate-600 px-3 py-2 text-sm"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </Badge>
  );
};

export default ServiceBadge;
