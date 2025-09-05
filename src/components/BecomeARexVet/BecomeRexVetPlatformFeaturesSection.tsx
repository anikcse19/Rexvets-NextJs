"use client";
import BecomeRexVetPlatformFeaturesSectionCard from "./BecomeRexVetPlatformFeaturesSectionCard";

interface SectionHeaderProps {
  title: string;
  description: string;
  titleGradientClass?: string;
}

// Reusable SectionHeader component
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  titleGradientClass = "bg-gradient-to-r from-gray-900 to-blue-600",
}) => (
  <div className="max-w-[1200px] mx-auto px-4 text-center">
    <h2
      className={`text-3xl md:text-[40px] leading-[44px] font-bold ${titleGradientClass} bg-clip-text text-transparent mb-4`}
    >
      {title}
    </h2>
    <p className="text-[24px] text-gray-600 max-w-2xl mx-auto mt-5">
      {description}
    </p>
  </div>
);

interface PlatformFeaturesSectionProps {
  isVisible: boolean;
}

const BecomeRexVetPlatformFeaturesSection: React.FC<
  PlatformFeaturesSectionProps
> = ({ isVisible }) => {
  const features = [
    {
      title: "Secure Client Interaction",
      items: [
        {
          title: "Video & Chat Built for Vet",
          description:
            "Connect with clients securely using integrated tools designed specifically for veterinary care—no third-party apps or tech confusion.",
        },
        {
          title: "Streamlined Records & Notes",
          description:
            "Easily document consults, upload photos, manage SOAPs, and access histories in one place.",
        },
        {
          title: "Client-Friendly Messaging",
          description:
            "Message clients directly for updates or follow-up. Our interface keeps communication organized, private, and accessible.",
        },
      ],
      imageSrc: "/images/become-a-rex-vet/secure-client.webp",
      imageAlt: "Video consultation",
      titleGradientClass: "bg-gradient-to-r from-blue-600 to-purple-600",
      imageGradientClass: "bg-gradient-to-br from-blue-200/20 to-purple-200/20",
      iconBgClass: "bg-[#44A148]",
      reverseOrder: false,
    },
    {
      title: "Control Your Availability",
      items: [
        {
          title: "",
          description:
            "Set your own schedule and consult when it works for you.",
        },
        {
          title: "",
          description:
            "We handle the logistics—no pricing setup or client coordination needed.",
        },
        {
          title: "",
          description: "Pause your availability anytime you need a break.",
        },
      ],
      imageSrc: "/images/become-a-rex-vet/control-your-availability.svg",
      imageAlt: "Control availability",
      titleGradientClass: "bg-gradient-to-r from-cyan-600 to-purple-600",
      imageGradientClass: "bg-gradient-to-br from-cyan-200/20 to-purple-200/20",
      iconBgClass: "bg-[#44A148]",
      reverseOrder: true,
    },
    {
      title: "Create & Manage Medical Records",
      items: [
        { title: "", description: "View appointment history and treatments" },
        { title: "", description: "Add, edit, and review notes" },
        {
          title: "",
          description:
            "Collaborate with pet owners to upload files, videos, and images",
        },
      ],
      imageSrc: "/images/become-a-rex-vet/create-manage-medical-records.webp",
      imageAlt: "Medical records",
      titleGradientClass: "bg-gradient-to-r from-blue-400 to-orange-600",
      imageGradientClass: "bg-gradient-to-br from-blue-200/20 to-orange-200/20",
      iconBgClass: "bg-[#44A148]",
      reverseOrder: false,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <SectionHeader
        title="Everything You Need to Practice Virtually"
        description="From secure video calls to integrated scheduling, everything you need is built right in."
      />
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 mt-8">
          {features.map((feature, index) => (
            <BecomeRexVetPlatformFeaturesSectionCard
              key={index}
              title={feature.title}
              items={feature.items}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
              isVisible={isVisible}
              titleGradientClass={feature.titleGradientClass}
              imageGradientClass={feature.imageGradientClass}
              iconBgClass={feature.iconBgClass}
              reverseOrder={feature.reverseOrder}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BecomeRexVetPlatformFeaturesSection;
