import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value?: string | number;
  subtitle?: string;
  color?: string; // background color for icon box
  bgColor?: string; // background color for card
  textColor?: string; // text color
  borderColor?: string; // border color for card
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value = 0,
  subtitle,
  color = "#3B82F6", // default Tailwind blue-500 hex
  bgColor = "#FFFFFF",
  textColor = "#1F2937", // Tailwind gray-800 hex
  borderColor = "#3B82F6",
}) => {
  return (
    <div
      className="rounded-xl p-4 transition-shadow hover:shadow-lg"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <div className="flex justify-between items-center">
        {/* Text Content */}
        <div>
          <p className="text-sm font-medium" style={{ color: textColor }}>
            {title}
          </p>
          <p className="text-xl font-bold mt-1" style={{ color: textColor }}>
            {value}
          </p>
          {subtitle && (
            <span className="text-xs mt-1 block" style={{ color: textColor }}>
              {subtitle}
            </span>
          )}
        </div>

        {/* Icon Box */}
        <div
          className="rounded-lg p-2.5 flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
