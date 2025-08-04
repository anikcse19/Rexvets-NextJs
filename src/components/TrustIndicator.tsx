import React from "react";
const TrustIndicator: React.FC<{
  icon: React.ReactNode;
  text: string;
  highlight?: string;
}> = ({ icon, text, highlight }) => {
  return (
    <div className="flex items-center space-x-2 text-white">
      {icon}
      <span className="text-sm">
        {highlight && (
          <span className="text-yellow-400 font-semibold">{highlight}</span>
        )}
        {text}
      </span>
    </div>
  );
};

export default TrustIndicator;
