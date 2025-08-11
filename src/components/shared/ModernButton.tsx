import clsx from "clsx";
import React from "react";

type ModernButtonProps = {
  variant?: "gradient" | "glass";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ModernButton: React.FC<ModernButtonProps> = ({
  variant = "gradient",
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-[16px] px-8 py-4 text-[1.1rem] font-semibold relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu",
        variant === "gradient" &&
          "text-white bg-gradient-to-br from-[#1976d2] to-[#9c27b0] shadow-[0_8px_32px_-8px_rgba(25,118,210,0.38)] hover:from-[#115293] hover:to-[#6d1b7b] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-8px_rgba(25,118,210,0.44)]",
        variant === "glass" &&
          "bg-[#ffffff]/90 backdrop-blur-[20px] border border-[#1976d2]/30 text-[#1976d2] hover:bg-[#ffffff]/95 hover:border-[#1976d2]/30 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-8px_rgba(25,118,210,0.19)]",
        className
      )}
    >
      {children}
    </button>
  );
};
export default React.memo(ModernButton);
