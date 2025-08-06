import featureImage1 from "../../../public/images/Homepage/featureImage1-1.webp";
import featureImage2 from "../../../public/images/Homepage/featureImage2-2.webp";
import featureImage3 from "../../../public/images/Homepage/featureImage3-3.webp";
import marquee1 from "../../../public/images/Homepage/marquee1.webp";
import marquee2 from "../../../public/images/Homepage/marquee2.webp";
import marquee3 from "../../../public/images/Homepage/marquee3.webp";
import marquee4 from "../../../public/images/Homepage/marquee4.webp";
import { IBrand, IFeature } from "../interfaces";
export const brands: IBrand[] = [
  { id: 2, name: "HUFFPOST", imageUrl: marquee4 },
  { id: 3, name: "TechCrunch", imageUrl: marquee3 },
  { id: 4, name: "yahoo!news", imageUrl: marquee1 },
  { id: 5, name: "THE GLOBE AND MAIL", imageUrl: marquee2 },
];
export const doubledBrands = [...brands, ...brands];
export const features: IFeature[] = [
  {
    title: "Find the Right Vet",
    description:
      "Browse verified vet profiles, read authentic reviews, and choose the perfect match for your pet's unique needs and personality.",
    image: featureImage1,
    icon: "🔍",
    color: "#3b82f6",
    chip: "Verified Profiles",
    number: "01",
  },
  {
    title: "Expert Care 24/7",
    description:
      "Connect with licensed veterinarians anytime through secure messaging, video consultations, or emergency support.",
    image: featureImage2,
    icon: "🩺",
    color: "#8b5cf6",
    chip: "Always Available",
    number: "02",
  },
  {
    title: "Online Prescriptions",
    description:
      "Access hundreds of medications through RexRx with fast delivery options or convenient local pharmacy pickup.",
    image: featureImage3,
    icon: "💊",
    color: "#06b6d4",
    chip: "Fast Delivery",
    number: "03",
  },
];
