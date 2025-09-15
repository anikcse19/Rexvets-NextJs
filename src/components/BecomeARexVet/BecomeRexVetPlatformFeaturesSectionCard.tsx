import Image from "next/image";
import React from "react";
import { Card, CardContent } from "../ui/card";
import BecomeRexVetPlatformFeaturesSectionCardItem from "./BecomeRexVetPlatformFeaturesSectionCardItem";

interface IProps {
  title: string;
  items: { title: string; description: string }[];
  imageSrc: string;
  imageAlt: string;
  isVisible: boolean;
  titleGradientClass: string;
  cardBgClass?: string;
  imageGradientClass?: string;
  iconBgClass?: string;
  reverseOrder?: boolean;
}

const BecomeRexVetPlatformFeaturesSectionCard: React.FC<IProps> = ({
  title,
  items,
  imageSrc,
  imageAlt,
  isVisible,
  titleGradientClass,
  cardBgClass = "bg-[linear-gradient(135deg,rgba(99,102,241,0.05),rgba(6,182,212,0.05))]",
  imageGradientClass = "bg-gradient-to-br from-blue-200/20 to-purple-200/20",
  iconBgClass,
  reverseOrder = false,
}) => {
  return (
    <Card
      className={`rounded-[16px] border border-[rgba(99,102,241,0.1)] shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-[10px] ${cardBgClass} hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
    >
      <CardContent className="p-6 md:p-8">
        <div
          className={`flex flex-col md:items-center gap-6 ${
            reverseOrder ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          {/* Left content */}
          <div className="flex-1">
            <h1
              className={`w-full text-[24px] md:text-[32px] leading-[40px] text-start font-bold ${titleGradientClass} bg-clip-text text-transparent mb-7`}
            >
              {title}
            </h1>

            <div className="space-y-4">
              {items.map((item, index) => (
                <BecomeRexVetPlatformFeaturesSectionCardItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  isVisible={isVisible}
                  index={index}
                  iconBgClass={iconBgClass}
                />
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="relative flex-1">
            <div
              className={`absolute inset-0 ${imageGradientClass} rounded-2xl blur-xl`}
            />
            <Image
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-auto rounded-2xl shadow-md relative z-10"
              width={500}
              height={300}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BecomeRexVetPlatformFeaturesSectionCard;
