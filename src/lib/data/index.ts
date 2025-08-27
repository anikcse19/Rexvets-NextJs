import {
  Calendar,
  Cat,
  FileCheck2,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { FaPrescription } from "react-icons/fa";

import {
  MdFavorite,
  MdHome,
  MdLocalPharmacy,
  MdMonetizationOn,
  MdSchedule,
  MdSchool,
  MdSupport,
} from "react-icons/md";
import featureImage1 from "../../../public/images/Homepage/featureImage1-1.webp";
import featureImage2 from "../../../public/images/Homepage/featureImage2-2.webp";
import featureImage3 from "../../../public/images/Homepage/featureImage3-3.webp";
import marquee1 from "../../../public/images/Homepage/marquee1.webp";
import marquee2 from "../../../public/images/Homepage/marquee2.webp";
import marquee3 from "../../../public/images/Homepage/marquee3.webp";
import marquee4 from "../../../public/images/Homepage/marquee4.webp";
import {
  IBrand,
  IFeature,
  IHomeFeaturesSection,
  ITreatmentCategory,
} from "../interfaces";
import { DonationAmount, MenuItems, Review } from "../types";

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
export const whyChooseFeaturesData: IHomeFeaturesSection[] = [
  {
    id: 1,
    icon: MdMonetizationOn, // 👈 just the component reference
    title: "Affordable Care",
    description:
      "Accessible virtual consultations with licensed veterinarians.",
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
  },
  {
    id: 2,
    icon: MdHome,
    title: "Convenience",
    description: "Get expert advice from the comfort of your home.",
    color: "#2196F3",
    gradient: "linear-gradient(135deg, #2196F3 0%, #1565C0 100%)",
  },
  {
    id: 3,
    icon: MdFavorite,
    title: "Impact",
    description:
      "Every visit and donation helps us serve more pets in need, especially in underserved communities.",
    color: "#E91E63",
    gradient: "linear-gradient(135deg, #E91E63 0%, #AD1457 100%)",
  },
  {
    id: 4,
    icon: MdSupport,
    title: "Supporting a Cause",
    description:
      "Donations fund emergency treatments, giving pets a chance at a healthy life.",
    color: "#FF9800",
    gradient: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
  },
  {
    id: 5,
    icon: MdSchedule,
    title: "24/7 Availability",
    description:
      "Round-the-clock access to consultations, ensuring support at any time.",
    color: "#9C27B0",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)",
  },
  {
    id: 6,
    icon: MdSchool,
    title: "Education",
    description:
      "Empowering pet owners with knowledge to make informed decisions about their pets' health.",
    color: "#00BCD4",
    gradient: "linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)",
  },
];
export const BlogsData = [
  {
    id: 1,
    slug: "how-online-vet-care-is-transforming-pet-health",
    date: "13 July 2024",
    by: "Laiba Ahmed",
    title: "How Online Vet Care is Transforming Pet Health",
    mainImage: "/images/Blogs/Blog1/MainImage.webp",
    description: [
      {
        paragraph:
          "Today's fast-paced world requires pet owners to have dependable and practical solutions for the medical care of their animal pets. Online vet care is revolutionizing the way you access veterinary services and prescriptions. This innovative approach ensures your pet receives the greatest care without the inconvenience of frequent vet visits by bringing professional medical care right to your home.",
      },
      {
        titleBig: "Why Choose Online Vet Care?",
      },
      {
        title: "Convenience at Your Fingertips ",
        paragraph:
          "Imagine being able to speak with a qualified veterinarian from the comfort of your own home. You may get medicines, make appointments, and get professional guidance all online with online veterinary care. This not only saves time but also reduces the stress on your pets, making the whole experience more comfortable for them.",
        image: "/images/Blogs/Blog1/img1.webp",
      },
      {
        title: "Access to Expert Vet Anytime, Anywhere ",
        paragraph:
          "Whether you're at home, on vacation, or anywhere in between, online vet care guarantees that skilled veterinarian care is always accessible. Platforms link you with qualified veterinarians who can give advice and assistance on a wide range of pet health concerns, from simple diseases to more serious conditions.",
        image: "/images/Blogs/Blog1/img2.webp",
      },
      {
        titleBig: "Comprehensive Vet Care Services",
      },
      {
        title: "Online Consultations",
        paragraph:
          "Online consultation services enable you to discuss your pet's health issues with a qualified veterinarian via video call. Whether it's a sudden sickness or a normal check-up, veterinarians can help.",
        image: "/images/Blogs/Blog1/img3.webp",
      },
      {
        title: "Prescription Services",
        paragraph:
          "Does your pet's prescription need to be refilled? Prescriptions can be easily obtained online without the need to visit the vet clinic. Delivering your pet's medication directly to your door is made feasible by the simple procedure.",
        image: "/images/Blogs/Blog1/img4.webp",
      },
      {
        title: "Health and Wellness Plans ",
        paragraph:
          "For the long-term health of your pet, preventive care is essential. Comprehensive wellness treatments customized to your pet's individual needs are available with online veterinary care. A proactive approach to pet health includes routine examinations, shots, and wellness tests.",
        image: "/images/Blogs/Blog1/img5.webp",
      },
      {
        titleBig: "Join Our Community",
        paragraph:
          "Online vet care is more than just a service; it's a community of pet owners committed to the wellbeing of their furry family members. Participate in seminars and workshops to learn insightful things about nutrition, training, and pet care. In order to provide your animals the best care possible, these activities aim to inform and empower you.",
      },
      {
        titleBig: "Call to Action",
        paragraph:
          "Transform your pet's health care experience today. Visit Rex Vet today to see how our online veterinary care services can improve your pet's life. Participate in our activities, become a member of our community, and allow us to assist you in maintaining the wellbeing and health of your animal companions. For more information, visit our website and start your journey with Rex Vet now!",
      },
    ],
  },
  {
    id: 2,
    slug: "the-importance-of-regular-vet-check-ups-for-your-beloved-pet",
    date: "2nd January 2025",
    by: "Max Rose",
    title: "The Importance of Regular Vet Check-ups for Your Beloved Pet",
    mainImage: "/images/Blogs/Blog2/MainImage.webp",
    description: [
      {
        paragraph:
          "We all want the best for our animal buddies as pet owners. Keeping them happy and healthy is our first goal, and routine veterinary examinations are among the best methods to do this. We at Rex Vet, your trusted source for online and on-demand veterinarian services and medicines, recognize the importance of regular veterinary checkups in maintaining your pet's health.",
      },
      {
        titleBig: "Why Regular Vet Check-ups Matter",
      },
      {
        title: "Early Detection of Health Issues",
        paragraph:
          "Regular vet checkups enable the early detection of potential health issues. Pets, like humans, can get illnesses that do not produce noticeable symptoms until they become serious. Routine examinations can detect these issues early, making therapy more tolerable and successful. This preventive strategy helps keep minor difficulties from turning into serious health concerns.",
        image: "/images/Blogs/Blog2/img1webp",
      },
      {
        title: "Preventive Care",
        paragraph:
          "Preventive treatment is essential for maintaining good pet health. Vaccinations, parasite management, dental care, and nutritional guidance are all included in a routine vet check-up. These preventive actions can protect your pet from diseases and health issues, allowing them to live a long and healthy life.",
        image: "/images/Blogs/Blog2/img2webp",
      },
      {
        title: "Monitoring Chronic Conditions",
        paragraph:
          "Regular vet check-ups are essential for pets suffering from chronic diseases such as diabetes, arthritis, or heart disease. These visits allow your veterinarian to monitor the condition and modify the medication as needed. Consistent treatment allows you to efficiently manage your pet's condition, improving their quality of life.",
        image: "/images/Blogs/Blog2/img3webp",
      },
      {
        title: "Behavioral Insights",
        paragraph:
          "Veterinarians can also provide vital information about your pet's behavior. Changes in behavior might occasionally suggest underlying health difficulties. Discussing your pet's behavior at a check-up might reveal hints about their overall health and well-being, allowing for early intervention when necessary.",
        image: "/images/Blogs/Blog2/img4webp",
      },
      {
        titleBig: "What to Expect During a Vet Check-up",
        paragraph:
          "Online vet care is more than just a service; it's a community of pet owners committed to the wellbeing of their furry family members. Participate in seminars and workshops to learn insightful things about nutrition, training, and pet care. In order to provide your animals the best care possible, these activities aim to inform and empower you.",
      },
      {
        titleBig: "Schedule Your Pet’s Check-up Today",
        paragraph:
          "Don't wait for an issue to arise. Make sure your pet receives the care they need by scheduling routine check-ups with Rex Vet. No matter your schedule, maintaining your pet's health is simple with our on-demand and online veterinary care services. Visit Rex Vet to book your appointment and take the first step towards a healthier, happier pet.",
      },
      {
        titleBig: "Call to Action",
        paragraph:
          "Rex Vet provides skilled veterinary care and medicines online and on demand. Join our pet care classes, attend our events, and become a part of a community that prioritizes pet health. Visit Rex Vet today to find the best veterinarian treatment for your beloved pets.",
      },
    ],
  },
  {
    id: 3,
    slug: "essential-vaccinations-for-pets-what-you-need-to-know",
    date: "15 July 2025",
    by: "Cristina Lee",
    title: "Essential Vaccinations for Pets: What You Need to Know?",
    mainImage: "/images/Blogs/Blog3/MainImage.webp",
    description: [
      {
        paragraph:
          "One of our most important obligations as pet owners is to keep our beloved pets healthy and free of avoidable ailments. Vaccinations are essential for protecting your pet's health, avoiding the transmission of infectious diseases, and improving general well-being. At Rex Vet, your reliable source for online and on-demand vet care and prescriptions, we are dedicated to providing you with the information and services you require to keep your pets healthy and content.",
      },
      {
        titleBig: "Why Vaccinations Matter?",
      },
      {
        title: "Protection from Deadly Diseases",
        paragraph:
          "Vaccinations protect pets from a number of potentially fatal diseases, including rabies, distemper, and parvovirus. These illnesses can cause serious sickness or even death, but they are avoidable with the proper vaccines. Keeping your pet up to date on vaccinations is an important step in giving them a long, healthy life.",
        image: "/images/Blogs/Blog3/img1webp",
      },
      {
        title: "Herd Immunity",
        paragraph:
          "Herd immunity develops when a large proportion of the pet population gets vaccinated. This implies that even pets that are unable to be vaccinated due to medical reasons benefit from some protection because disease transmission is limited overall. Vaccinating your pet helps to improve the overall health and safety of the pet community.",
        image: "/images/Blogs/Blog3/img2webp",
      },
      {
        title: "Legal Requirements",
        paragraph:
          "In many places, certain vaccinations are legally compulsory. Rabies vaccinations, for example, are required in the majority of places due to the disease's serious public health danger. Keeping up on your pet's vaccines helps you comply with local rules and regulations.",
        image: "/images/Blogs/Blog3/img3webp",
      },
      {
        titleBig: "Core Vaccinations for Dogs and Cats",
      },
      {
        title: "For Dogs:",
        paragraph:
          "1. Rabies: It protects against the fatal rabies virus, which may infect humans as well as animals.[BR]2. Distemper: Protects against a highly infectious viral infection that affects the respiratory, digestive, and neurological systems.[BR]3. Parvovirus: Protects against a highly contagious virus which leads to severe vomiting and diarrhea and is potentially fatal.[BR]4. Adenovirus (Hepatitis): Protects against infectious canine hepatitis, which damages the liver and other organs.",
      },
      {
        title: "For Cats:",
        paragraph:
          "1. Rabies: As with dogs, this is critical for preventing the spread of rabies.[BR]2. Feline Distemper (Panleukopenia): Protects against a potentially fatal viral disease.[BR]3. Feline Herpesvirus (Rhinotracheitis): Protects against the virus that causes respiratory infections.[BR]4. Feline Calicivirus: Protects against a virus that can infect the respiratory tract, mouth, intestines, and musculoskeletal system.",
      },
      {
        titleBig: "Non-Core Vaccinations",
        paragraph:
          "Depending on your pet's lifestyle and surroundings, your veterinarian may suggest extra non-core vaccinations. These could include vaccines against Bordetella (kennel cough) in dogs and feline leukemia virus (FeLV) in cats. Discuss your pet's individual requirements with your veterinarian to identify the best vaccination strategy.",
      },
      {
        titleBig: "When to Vaccinate Your Pet?",
        paragraph:
          "Puppies and kittens usually start their vaccination series at six to eight weeks of age, with booster doses every few weeks until they are around 16 weeks old. Adult dogs will require frequent boosters after the initial course of vaccinations to maintain immunity. Your veterinarian will create a schedule that is specifically customized to your pet's requirements.",
      },
      {
        titleBig: "How Rex Vet Can Help?",
        paragraph:
          "Rex Vet' online and on-demand vet care services make it easy and convenient to maintain your pet's vaccines up to date. Our knowledgeable veterinarians can walk you through the vaccination procedure, ensuring that your pet gets the essential doses at the appropriate times.",
      },
      {
        titleBig: "Schedule Your Pet’s Vaccination Appointment Today",
        paragraph:
          "Don't wait any longer to protect your pet from dangerous infections; schedule a vaccination appointment with Rex Vet immediately. Visit our website to schedule an appointment and explore our comprehensive range of services. ",
      },
      {
        titleBig: "Call to Action",
        paragraph:
          "Rex Vet provides skilled veterinary care and medicines online and on demand. Join our pet care sessions, attend our events, and become a part of a community that values pet health. Visit rexVet.com today to guarantee your pets receive the greatest veterinarian care.[BR][BR]Staying proactive and knowledgeable on your pet's vaccination needs is an important step toward preserving their long-term health and happiness. Trust Rex Vet to be your partner in delivering excellent care for your beloved pets. ",
      },
    ],
  },
  {
    id: 4,
    slug: "how-online-vet-care-is-transforming-pet-health",
    date: "13 July 2024",
    by: "Maria Smith",
    title: "How Online Vet Care is Transforming Pet Health",
    mainImage: "/images/Blogs/Blog1/petBlogImage4.webp",
    description: [
      {
        paragraph:
          "Today's fast-paced world requires pet owners to have dependable and practical solutions for the medical care of their animal pets. Online vet care is revolutionizing the way you access veterinary services and prescriptions. This innovative approach ensures your pet receives the greatest care without the inconvenience of frequent vet visits by bringing professional medical care right to your home.",
      },
      {
        titleBig: "Why Choose Online Vet Care?",
      },
      {
        title: "Convenience at Your Fingertips ",
        paragraph:
          "Imagine being able to speak with a qualified veterinarian from the comfort of your own home. You may get medicines, make appointments, and get professional guidance all online with online veterinary care. This not only saves time but also reduces the stress on your pets, making the whole experience more comfortable for them.",
        image: "/images/Blogs/Blog1/img1webp",
      },
      {
        title: "Access to Expert Vet Anytime, Anywhere ",
        paragraph:
          "Whether you're at home, on vacation, or anywhere in between, online vet care guarantees that skilled veterinarian care is always accessible. Platforms link you with qualified veterinarians who can give advice and assistance on a wide range of pet health concerns, from simple diseases to more serious conditions.",
        image: "/images/Blogs/Blog1/img2webp",
      },
      {
        titleBig: "Comprehensive Vet Care Services",
      },
      {
        title: "Online Consultations",
        paragraph:
          "Online consultation services enable you to discuss your pet's health issues with a qualified veterinarian via video call. Whether it's a sudden sickness or a normal check-up, veterinarians can help.",
        image: "/images/Blogs/Blog1/img3webp",
      },
      {
        title: "Prescription Services",
        paragraph:
          "Does your pet's prescription need to be refilled? Prescriptions can be easily obtained online without the need to visit the vet clinic. Delivering your pet's medication directly to your door is made feasible by the simple procedure.",
        image: "/images/Blogs/Blog1/img4webp",
      },
      {
        title: "Health and Wellness Plans ",
        paragraph:
          "For the long-term health of your pet, preventive care is essential. Comprehensive wellness treatments customized to your pet's individual needs are available with online veterinary care. A proactive approach to pet health includes routine examinations, shots, and wellness tests.",
        image: "/images/Blogs/Blog1/img5webp",
      },
      {
        titleBig: "Join Our Community",
        paragraph:
          "Online vet care is more than just a service; it's a community of pet owners committed to the wellbeing of their furry family members. Participate in seminars and workshops to learn insightful things about nutrition, training, and pet care. In order to provide your animals the best care possible, these activities aim to inform and empower you.",
      },
      {
        titleBig: "Call to Action",
        paragraph:
          "Transform your pet's health care experience today. Visit Rex Vet today to see how our online veterinary care services can improve your pet's life. Participate in our activities, become a member of our community, and allow us to assist you in maintaining the wellbeing and health of your animal companions. For more information, visit our website and start your journey with Rex Vet now!",
      },
    ],
  },
  {
    id: 5,
    slug: "the-importance-of-regular-vet-check-ups-for-your-beloved-pet",
    date: "14 July 2024",
    by: "Kate Johnson",
    title: "The Importance of Regular Vet Check-ups for Your Beloved Pet",
    mainImage: "/images/Blogs/Blog1/petBlogImage5.webp",
    description: [
      {
        paragraph:
          "We all want the best for our animal buddies as pet owners. Keeping them happy and healthy is our first goal, and routine veterinary examinations are among the best methods to do this. We at Rex Vet, your trusted source for online and on-demand veterinarian services and medicines, recognize the importance of regular veterinary checkups in maintaining your pet's health.",
      },
      {
        titleBig: "Why Regular Vet Check-ups Matter",
      },
      {
        title: "Early Detection of Health Issues",
        paragraph:
          "Regular vet checkups enable the early detection of potential health issues. Pets, like humans, can get illnesses that do not produce noticeable symptoms until they become serious. Routine examinations can detect these issues early, making therapy more tolerable and successful. This preventive strategy helps keep minor difficulties from turning into serious health concerns.",
        image: "/images/Blogs/Blog2/img1webp",
      },
      {
        title: "Preventive Care",
        paragraph:
          "Preventive treatment is essential for maintaining good pet health. Vaccinations, parasite management, dental care, and nutritional guidance are all included in a routine vet check-up. These preventive actions can protect your pet from diseases and health issues, allowing them to live a long and healthy life.",
        image: "/images/Blogs/Blog2/img2webp",
      },
      {
        title: "Monitoring Chronic Conditions",
        paragraph:
          "Regular vet check-ups are essential for pets suffering from chronic diseases such as diabetes, arthritis, or heart disease. These visits allow your veterinarian to monitor the condition and modify the medication as needed. Consistent treatment allows you to efficiently manage your pet's condition, improving their quality of life.",
        image: "/images/Blogs/Blog2/img3webp",
      },
      {
        title: "Behavioral Insights",
        paragraph:
          "Veterinarians can also provide vital information about your pet's behavior. Changes in behavior might occasionally suggest underlying health difficulties. Discussing your pet's behavior at a check-up might reveal hints about their overall health and well-being, allowing for early intervention when necessary.",
        image: "/images/Blogs/Blog2/img4webp",
      },
      {
        titleBig: "What to Expect During a Vet Check-up",
        paragraph:
          "Online vet care is more than just a service; it's a community of pet owners committed to the wellbeing of their furry family members. Participate in seminars and workshops to learn insightful things about nutrition, training, and pet care. In order to provide your animals the best care possible, these activities aim to inform and empower you.",
      },
      {
        titleBig: "Schedule Your Pet’s Check-up Today",
        paragraph:
          "Don't wait for an issue to arise. Make sure your pet receives the care they need by scheduling routine check-ups with Rex Vet. No matter your schedule, maintaining your pet's health is simple with our on-demand and online veterinary care services. Visit Rex Vet to book your appointment and take the first step towards a healthier, happier pet.",
      },
      {
        titleBig: "Call to Action",
        paragraph:
          "Rex Vet provides skilled veterinary care and medicines online and on demand. Join our pet care classes, attend our events, and become a part of a community that prioritizes pet health. Visit Rex Vet today to find the best veterinarian treatment for your beloved pets.",
      },
    ],
  },
  {
    id: 6,
    slug: "essential-vaccinations-for-pets-what-you-need-to-know",
    date: "15 July 2024",
    by: "Laiba Ahmed",
    title: "Essential Vaccinations for Pets: What You Need to Know?",
    mainImage: "/images/Blogs/Blog1/petBlogImage6.webp",
    description: [
      {
        paragraph:
          "One of our most important obligations as pet owners is to keep our beloved pets healthy and free of avoidable ailments. Vaccinations are essential for protecting your pet's health, avoiding the transmission of infectious diseases, and improving general well-being. At Rex Vet, your reliable source for online and on-demand vet care and prescriptions, we are dedicated to providing you with the information and services you require to keep your pets healthy and content.",
      },
      {
        titleBig: "Why Vaccinations Matter?",
      },
      {
        title: "Protection from Deadly Diseases",
        paragraph:
          "Vaccinations protect pets from a number of potentially fatal diseases, including rabies, distemper, and parvovirus. These illnesses can cause serious sickness or even death, but they are avoidable with the proper vaccines. Keeping your pet up to date on vaccinations is an important step in giving them a long, healthy life.",
        image: "/images/Blogs/Blog3/img1webp",
      },
      {
        title: "Herd Immunity",
        paragraph:
          "Herd immunity develops when a large proportion of the pet population gets vaccinated. This implies that even pets that are unable to be vaccinated due to medical reasons benefit from some protection because disease transmission is limited overall. Vaccinating your pet helps to improve the overall health and safety of the pet community.",
        image: "/images/Blogs/Blog3/img2webp",
      },
      {
        title: "Legal Requirements",
        paragraph:
          "In many places, certain vaccinations are legally compulsory. Rabies vaccinations, for example, are required in the majority of places due to the disease's serious public health danger. Keeping up on your pet's vaccines helps you comply with local rules and regulations.",
        image: "/images/Blogs/Blog3/img3webp",
      },
      {
        titleBig: "Core Vaccinations for Dogs and Cats",
      },
      {
        title: "For Dogs:",
        paragraph:
          "1. Rabies: It protects against the fatal rabies virus, which may infect humans as well as animals.[BR]2. Distemper: Protects against a highly infectious viral infection that affects the respiratory, digestive, and neurological systems.[BR]3. Parvovirus: Protects against a highly contagious virus which leads to severe vomiting and diarrhea and is potentially fatal.[BR]4. Adenovirus (Hepatitis): Protects against infectious canine hepatitis, which damages the liver and other organs.",
      },
      {
        title: "For Cats:",
        paragraph:
          "1. Rabies: As with dogs, this is critical for preventing the spread of rabies.[BR]2. Feline Distemper (Panleukopenia): Protects against a potentially fatal viral disease.[BR]3. Feline Herpesvirus (Rhinotracheitis): Protects against the virus that causes respiratory infections.[BR]4. Feline Calicivirus: Protects against a virus that can infect the respiratory tract, mouth, intestines, and musculoskeletal system.",
      },
      {
        titleBig: "Non-Core Vaccinations",
        paragraph:
          "Depending on your pet's lifestyle and surroundings, your veterinarian may suggest extra non-core vaccinations. These could include vaccines against Bordetella (kennel cough) in dogs and feline leukemia virus (FeLV) in cats. Discuss your pet's individual requirements with your veterinarian to identify the best vaccination strategy.",
      },
      {
        titleBig: "When to Vaccinate Your Pet?",
        paragraph:
          "Puppies and kittens usually start their vaccination series at six to eight weeks of age, with booster doses every few weeks until they are around 16 weeks old. Adult dogs will require frequent boosters after the initial course of vaccinations to maintain immunity. Your veterinarian will create a schedule that is specifically customized to your pet's requirements.",
      },
      {
        titleBig: "How Rex Vet Can Help?",
        paragraph:
          "Rex Vet' online and on-demand vet care services make it easy and convenient to maintain your pet's vaccines up to date. Our knowledgeable veterinarians can walk you through the vaccination procedure, ensuring that your pet gets the essential doses at the appropriate times.",
      },
      {
        titleBig: "Schedule Your Pet’s Vaccination Appointment Today",
        paragraph:
          "Don't wait any longer to protect your pet from dangerous infections; schedule a vaccination appointment with Rex Vet immediately. Visit our website to schedule an appointment and explore our comprehensive range of services. ",
      },
      {
        titleBig: "Call to Action",
        paragraph:
          "Rex Vet provides skilled veterinary care and medicines online and on demand. Join our pet care sessions, attend our events, and become a part of a community that values pet health. Visit rexVet.com today to guarantee your pets receive the greatest veterinarian care.[BR][BR]Staying proactive and knowledgeable on your pet's vaccination needs is an important step toward preserving their long-term health and happiness. Trust Rex Vet to be your partner in delivering excellent care for your beloved pets. ",
      },
    ],
  },
];
export const treatmentServices: ITreatmentCategory[] = [
  {
    id: 1,
    title: "Allergies",
    description:
      "Comprehensive allergy treatment with immediate relief and long-term skin repair solutions.",
    image: "/images/homePage/twoPuppy.webp",
    color: "bg-blue-500",
    symptoms: [
      "Excessive itching",
      "Skin infections",
      "Ear problems",
      "Digestive issues",
    ],
  },
  {
    id: 2,
    title: "Anxiety",
    description:
      "Holistic anxiety treatment combining medication and behavior modification techniques.",
    image: "/images/what-we-treat/anxiety.webp",
    color: "bg-purple-500",
    symptoms: [
      "Trembling or shaking",
      "Excessive barking",
      "Destructive behavior",
      "Hiding",
    ],
  },
  {
    id: 3,
    title: "Arthritis & Joint Pain",
    description:
      "Advanced joint pain management to improve mobility and quality of life.",
    image: "/images/what-we-treat/joint.webp",
    color: "bg-[#27C08D]",
    symptoms: [
      "Difficulty getting up",
      "Stiffness",
      "Reluctance to move",
      "Swollen joints",
    ],
  },
  {
    id: 4,
    title: "Coughing",
    description:
      "Expert diagnosis and treatment for persistent coughs and respiratory issues.",
    image: "/images/what-we-treat/cough.webp",
    color: "bg-yellow-500",
    symptoms: [
      "Persistent cough",
      "Breathing difficulty",
      "Night coughing",
      "Wheezing",
    ],
  },
  {
    id: 5,
    title: "Diarrhea",
    description:
      "Comprehensive digestive health care addressing various causes of diarrhea.",
    image: "/images/what-we-treat/dai.webp",
    color: "bg-red-500",
    symptoms: [
      "Loose stools",
      "Dehydration",
      "Loss of appetite",
      "Abdominal pain",
    ],
  },
  {
    id: 6,
    title: "Diet & Nutrition",
    description:
      "Personalized nutrition plans to maintain optimal health and prevent obesity.",
    image: "/images/what-we-treat/diet.webp",
    color: "bg-cyan-500",
    symptoms: [
      "Weight gain",
      "Low energy",
      "Poor coat quality",
      "Digestive issues",
    ],
  },
  {
    id: 7,
    title: "Preventative Care",
    description:
      "Comprehensive wellness exams and preventive care for long-term health.",
    image: "/images/what-we-treat/mission.webp",
    color: "bg-lime-500",
    symptoms: [
      "Regular checkups",
      "Vaccinations",
      "Health monitoring",
      "Early detection",
    ],
  },
  {
    id: 8,
    title: "Urinary Health",
    description:
      "Expert care for urinary tract health and related complications.",
    image: "/images/what-we-treat/health.webp",
    color: "bg-pink-500",
    symptoms: [
      "Frequent urination",
      "Blood in urine",
      "Straining",
      "Accidents",
    ],
  },
];

export const menuItemsDoctor: MenuItems[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/doctor/overview",
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: FileCheck2,
    href: "/dashboard/doctor/appointments",
  },

  {
    id: "rates-and-availability",
    label: "Rates & Availability",
    icon: Calendar,
    href: "/dashboard/doctor/rates-and-availability",
  },
  {
    id: "prescription",
    label: "Prescription",
    icon: FaPrescription,
    href: "",
    external_href: "https://practice.securevetsource.com/login",
  },
  {
    id: "account",
    label: "Account",
    icon: Settings,
    href: "/dashboard/doctor/account",
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    href: "/dashboard/doctor/help",
  },
];

export const menuItemsPetParent: MenuItems[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/pet-parent/overview",
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: FileCheck2,
    href: "/dashboard/pet-parent/appointments",
  },
  {
    id: "pharmacy-transfer",
    label: "Pharmacy Transfer",
    icon: MdLocalPharmacy,
    href: "/dashboard/pet-parent/pharmacy-transfer",
  },
  {
    id: "my-pets",
    label: "My Pets",
    icon: Cat,
    href: "/dashboard/pet-parent/my-pets",
  },
  {
    id: "account",
    label: "Account",
    icon: Settings,
    href: "/dashboard/pet-parent/account",
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    href: "/dashboard/pet-parent/help",
  },
];

export const bottomMenuItems: MenuItems[] = [
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
    href: "/",
  },
];

// Mock data for the account page
export const mockDoctorData = {
  personalInfo: {
    firstName: "Anik",
    lastName: "Deb",
    email: "anik@gmail.com",
    phone: "+8801234567890",
    dateOfBirth: "1985-03-15",
    gender: "male" as const,
    address: "123 Veterinary Street, Medical District",
    city: "Dhaka",
    state: "Dhaka Division",
    zipCode: "1000",
    country: "Bangladesh",
    profileImage:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face",
  },

  professionalInfo: {
    licenseNumber: "VET-BD-2012-001234",
    yearsOfExperience: 12,
    education:
      "DVM from Bangladesh Agricultural University, PhD in Veterinary Medicine from University of Dhaka",
    certifications: [
      "Board Certified Veterinary Surgeon",
      "Advanced Animal Cardiology",
      "Emergency Veterinary Medicine",
      "Small Animal Internal Medicine",
    ],
    clinicName: "RexVet Animal Hospital",
    clinicAddress: "456 Pet Care Avenue, Gulshan, Dhaka 1212",
    emergencyContact: "+8801987654321",
  },

  areasOfInterest: {
    specialties: [
      "Small Animal Surgery",
      "Emergency Medicine",
      "Cardiology",
      "Dermatology",
      "Orthopedics",
      "Oncology",
      "Dental Care",
      "Nutrition",
    ],
    interests: [
      "Animal Behavior",
      "Exotic Pet Medicine",
      "Wildlife Conservation",
      "Veterinary Research",
    ],
    researchAreas: [
      "Canine Heart Disease",
      "Feline Diabetes Management",
      "Pain Management in Animals",
    ],
  },

  speciesTreated: [
    { name: "Dogs", experience: "expert" as const, yearsOfExperience: 12 },
    { name: "Cats", experience: "expert" as const, yearsOfExperience: 12 },
    { name: "Birds", experience: "advanced" as const, yearsOfExperience: 8 },
    { name: "Rabbits", experience: "advanced" as const, yearsOfExperience: 7 },
    {
      name: "Hamsters",
      experience: "intermediate" as const,
      yearsOfExperience: 5,
    },
    {
      name: "Guinea Pigs",
      experience: "intermediate" as const,
      yearsOfExperience: 5,
    },
    {
      name: "Ferrets",
      experience: "intermediate" as const,
      yearsOfExperience: 4,
    },
    { name: "Reptiles", experience: "beginner" as const, yearsOfExperience: 2 },
  ],

  securitySettings: {
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    lastPasswordChange: "2024-11-15",
    loginSessions: [
      {
        device: "Chrome on Windows",
        location: "Dhaka, Bangladesh",
        lastActive: "2025-01-14 10:30 AM",
      },
      {
        device: "Safari on iPhone",
        location: "Dhaka, Bangladesh",
        lastActive: "2025-01-13 08:45 PM",
      },
    ],
  },
};

export const availableSpecialties = [
  "Small Animal Surgery",
  "Large Animal Surgery",
  "Emergency Medicine",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Oncology",
  "Dental Care",
  "Nutrition",
  "Radiology",
  "Anesthesiology",
  "Pathology",
  "Behavioral Medicine",
  "Exotic Animal Medicine",
  "Wildlife Medicine",
  "Laboratory Medicine",
];

export const availableSpecies = [
  "Dogs",
  "Cats",
  "Birds",
  "Rabbits",
  "Hamsters",
  "Guinea Pigs",
  "Ferrets",
  "Reptiles",
  "Fish",
  "Horses",
  "Cattle",
  "Sheep",
  "Goats",
  "Pigs",
  "Chickens",
  "Exotic Birds",
  "Primates",
  "Wildlife",
];

export const experienceLevels = [
  {
    value: "beginner",
    label: "Beginner (0-2 years)",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "intermediate",
    label: "Intermediate (2-5 years)",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "advanced",
    label: "Advanced (5-10 years)",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "expert",
    label: "Expert (10+ years)",
    color: "bg-green-100 text-green-700",
  },
];

export const speciesWithBreeds = {
  dog: [
    "Golden Retriever",
    "Labrador Retriever",
    "German Shepherd",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Dachshund",
    "Siberian Husky",
    "Boxer",
    "Border Collie",
    "Chihuahua",
    "Shih Tzu",
    "Boston Terrier",
    "Mixed Breed",
  ],
  cat: [
    "Persian",
    "Siamese",
    "Maine Coon",
    "British Shorthair",
    "Ragdoll",
    "Bengal",
    "Abyssinian",
    "Russian Blue",
    "Scottish Fold",
    "Sphynx",
    "American Shorthair",
    "Birman",
    "Oriental",
    "Manx",
    "Mixed Breed",
  ],
  bird: [
    "Budgerigar",
    "Cockatiel",
    "Canary",
    "Lovebird",
    "Conure",
    "African Grey",
    "Macaw",
    "Cockatoo",
    "Finch",
    "Parakeet",
  ],
  rabbit: [
    "Holland Lop",
    "Netherland Dwarf",
    "Mini Rex",
    "Lionhead",
    "Flemish Giant",
    "English Angora",
    "Dutch",
    "New Zealand",
    "Californian",
    "Mixed Breed",
  ],
  hamster: [
    "Syrian",
    "Dwarf Campbell",
    "Dwarf Winter White",
    "Roborovski",
    "Chinese",
  ],
  "guinea-pig": [
    "American",
    "Peruvian",
    "Abyssinian",
    "Silkie",
    "Texel",
    "Skinny Pig",
  ],
  ferret: ["Domestic Ferret", "Angora Ferret", "European Polecat"],
  reptile: [
    "Bearded Dragon",
    "Leopard Gecko",
    "Ball Python",
    "Corn Snake",
    "Iguana",
    "Turtle",
    "Tortoise",
    "Chameleon",
    "Monitor Lizard",
  ],
  fish: [
    "Goldfish",
    "Betta",
    "Guppy",
    "Angelfish",
    "Neon Tetra",
    "Discus",
    "Cichlid",
    "Catfish",
    "Koi",
    "Molly",
  ],
  other: ["Other"],
};

export const colorOptions = [
  "Black",
  "White",
  "Brown",
  "Golden",
  "Gray",
  "Silver",
  "Cream",
  "Red",
  "Blue",
  "Chocolate",
  "Tan",
  "Brindle",
  "Merle",
  "Spotted",
  "Striped",
  "Calico",
  "Tortoiseshell",
  "Tabby",
  "Solid",
  "Mixed Colors",
];

export const mockDoctors: any[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    profileImage:
      "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400",
    degree: "DVM, MS",
    rating: 4.9,
    reviewCount: 124,
    license: "VET-2019-CA-5431",
    prescriptionBadge: true,
    state: "California",
    specialties: ["Small Animal Medicine", "Surgery", "Emergency Care"],
    bio: "Dr. Sarah Johnson is a passionate veterinarian with over 8 years of experience in small animal medicine. She specializes in emergency care and surgical procedures, with a particular interest in minimally invasive techniques.",
    address: "123 Pet Care Blvd, San Francisco, CA 94105",
    speciesTreated: ["Dogs", "Cats", "Rabbits", "Guinea Pigs"],
    availableSlots: [
      { id: "1", date: "2025-01-20", time: "09:00", available: true },
      { id: "2", date: "2025-01-20", time: "10:30", available: true },
      { id: "3", date: "2025-01-20", time: "14:00", available: true },
      { id: "4", date: "2025-01-21", time: "11:00", available: true },
      { id: "5", date: "2025-01-21", time: "15:30", available: true },
    ],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    image:
      "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=400",
    degree: "DVM, PhD",
    rating: 4.8,
    reviewCount: 89,
    license: "VET-2020-CA-7823",
    prescriptionBadge: true,
    state: "California",
    specialties: ["Exotic Animals", "Dermatology", "Oncology"],
    bio: "Dr. Michael Chen brings expertise in exotic animal care and veterinary dermatology. With a PhD in Veterinary Medicine, he has published numerous research papers on animal oncology.",
    address: "456 Healing Paws Ave, Los Angeles, CA 90210",
    speciesTreated: ["Dogs", "Cats", "Birds", "Reptiles", "Small Mammals"],
    availableSlots: [
      { id: "6", date: "2025-01-20", time: "08:30", available: true },
      { id: "7", date: "2025-01-20", time: "13:00", available: true },
      { id: "8", date: "2025-01-21", time: "09:30", available: true },
      { id: "9", date: "2025-01-22", time: "10:00", available: true },
    ],
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    image:
      "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=400",
    degree: "DVM",
    rating: 4.7,
    reviewCount: 156,
    license: "VET-2018-CA-3321",
    prescriptionBadge: true,
    state: "California",
    specialties: ["Behavioral Medicine", "Preventive Care", "Nutrition"],
    bio: "Dr. Emily Rodriguez focuses on preventive veterinary medicine and animal behavior. She believes in building strong relationships with both pets and their families to ensure long-term health and happiness.",
    address: "789 Compassion St, San Diego, CA 92101",
    speciesTreated: ["Dogs", "Cats"],
    availableSlots: [
      { id: "10", date: "2025-01-20", time: "11:00", available: true },
      { id: "11", date: "2025-01-20", time: "16:00", available: true },
      { id: "12", date: "2025-01-21", time: "14:30", available: true },
    ],
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    image:
      "https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=400",
    degree: "DVM, DACVS",
    rating: 4.9,
    reviewCount: 203,
    license: "VET-2017-CA-8901",
    prescriptionBadge: true,
    state: "California",
    specialties: ["Orthopedic Surgery", "Sports Medicine", "Rehabilitation"],
    bio: "Dr. James Wilson is a board-certified veterinary surgeon specializing in orthopedic procedures. He has extensive experience in treating sports injuries in working dogs and rehabilitation therapy.",
    address: "321 Healing Hands Dr, Oakland, CA 94607",
    speciesTreated: ["Dogs", "Cats", "Horses"],
    availableSlots: [],
  },
];

export const mockReviews: { [doctorId: string]: Review[] } = {
  "1": [
    {
      id: "1",
      patientName: "Maria Garcia",
      rating: 5,
      comment:
        "Dr. Johnson was amazing with my anxious rescue dog. She took the time to explain everything and made both me and my pet feel comfortable.",
      date: "2025-01-15",
      petType: "Dog",
    },
    {
      id: "2",
      patientName: "John Smith",
      rating: 5,
      comment:
        "Excellent care for my cat's emergency surgery. Dr. Johnson's expertise saved my pet's life.",
      date: "2025-01-10",
      petType: "Cat",
    },
    {
      id: "3",
      patientName: "Lisa Brown",
      rating: 4,
      comment:
        "Very professional and knowledgeable. The clinic is clean and well-organized.",
      date: "2025-01-08",
      petType: "Rabbit",
    },
    {
      id: "4",
      patientName: "David Lee",
      rating: 5,
      comment:
        "Dr. Johnson went above and beyond to help my senior dog. Highly recommend!",
      date: "2025-01-05",
      petType: "Dog",
    },
    {
      id: "5",
      patientName: "Anna Wilson",
      rating: 5,
      comment:
        "Great communication and follow-up care. My pet is doing much better now.",
      date: "2025-01-03",
      petType: "Cat",
    },
  ],
  "2": [
    {
      id: "6",
      patientName: "Robert Chen",
      rating: 5,
      comment:
        "Dr. Chen is the best exotic animal vet in the area. My parrot loves him!",
      date: "2025-01-12",
      petType: "Bird",
    },
    {
      id: "7",
      patientName: "Sophie Davis",
      rating: 4,
      comment:
        "Very knowledgeable about reptile care. Helped my iguana recover quickly.",
      date: "2025-01-09",
      petType: "Reptile",
    },
  ],
  "3": [
    {
      id: "8",
      patientName: "Carlos Rodriguez",
      rating: 5,
      comment:
        "Dr. Rodriguez helped with my dog's behavioral issues. Saw improvement within weeks!",
      date: "2025-01-14",
      petType: "Dog",
    },
  ],
  "4": [
    {
      id: "9",
      patientName: "Jennifer Thompson",
      rating: 5,
      comment:
        "Exceptional surgical skills. My dog's recovery was faster than expected.",
      date: "2025-01-11",
      petType: "Dog",
    },
  ],
};

export const donationAmounts: DonationAmount[] = [
  { value: 25, label: "$25", description: "Feeds 2 street dogs for a week" },
  {
    value: 50,
    label: "$50",
    description: "Provides basic medical care for 1 dog",
  },
  {
    value: 100,
    label: "$100",
    description: "Covers vaccination for 5 street dogs",
  },
  {
    value: 200,
    label: "$200",
    description: "Emergency medical treatment for 1 dog",
  },
  { value: 500, label: "$500", description: "Sponsors a full health program" },
];
export const faqData = [
  {
    title: "General",
    items: [
      {
        question: "Who is Rex Vet?",
        answer: [
          "At Rex Vet, we're leading the way in online veterinary telehealth, and we've achieved this by collaborating closely with veterinarians. We employ a science-backed approach to provide much-needed relief for pets dealing with both common physical and behavioral health issues.",
          "Our platform seamlessly connects you with licensed veterinarians through video calls and messaging, allowing you to access care for your beloved dog or cat swiftly and conveniently, regardless of your location. Say goodbye to the stress and expense of a traditional vet visit.",
          "In applicable states, we even offer prescription medication and over-the-counter treatments. It's important to note that Rex Vet is not a veterinary practice or pharmacy. Instead, we serve as a dedicated facilitator, ensuring that pet parents like you can access essential veterinary care with ease and convenience. We're here to make high-quality veterinary care accessible to all.",
        ],
      },
      {
        question: "Who is Rex Vet for?",
        answer: [
          "Rex Vet is designed for dog and cat parents seeking a faster, more convenient, and cost-effective solution for addressing common pet issues. We cater to those who value accessible pet care by connecting them with licensed veterinarians through video calls and messaging, sparing them from unnecessary and stressful in-person vet visits.",
          "In states that permit virtual prescription, our veterinarians can diagnose your pet's condition and formulate a comprehensive treatment plan. This may encompass prescription and non-prescription medications, as well as advice on behavioral modifications, dietary adjustments, and enriching your pet's life.",
          "In areas where virtual prescription isn't allowed, our veterinarians still offer general guidance and recommend over-the-counter treatment options. Rex Vet strives to make quality pet care accessible to all, regardless of location or state regulations.",
        ],
      },
      {
        question: "What is a visit with Rex Vet like?",
        answer: [
          "When you schedule a video call with a Rex Vet veterinarian, you'll start by answering a few questions about your pet's health concern. Depending on the nature of the issue, you might also complete a detailed questionnaire about their symptoms and share photographs to provide our veterinarians with a comprehensive understanding of the situation. You'll then select a convenient appointment time.",
          "During the video call, one of our licensed veterinarians will discuss your pet's symptoms with you, ask relevant questions, review the provided medical history, and address any concerns you may have. The vet will request to see your pet and its surroundings, and if necessary, guide you through simple checks.",
          "Following the video call, the veterinarian will send you a message containing a customized treatment plan designed to help your pet recover. This plan may include recommendations to purchase any prescribed or over-the-counter medications.",
        ],
      },
      {
        question: "What is veterinary telemedicine?",
        answer: [
          "Veterinary telemedicine is a modern and innovative way to provide healthcare for your pet. It involves sharing your pet's medical information with a licensed veterinarian, even if they're located in a different place. Through electronic communication, veterinarians can evaluate, diagnose, consult, and recommend treatment for your pet, ensuring their well-being.",
          "This approach can be in real-time, using methods such as phone calls and video chats, allowing you to have a direct conversation with the veterinarian. Additionally, it can be conducted asynchronously via email, text messages, or by uploading photos and videos of your pet.",
          "At Rex Vet, we facilitate this process by connecting you with our veterinarians through video chat for immediate assistance. We also offer messaging, making it convenient for you to seek professional advice whenever you need it.",
          "In some cases, our veterinarians may request photos and videos of your pet in their home environment to better understand the situation and provide a comprehensive evaluation. This new approach to pet care offers flexibility, accessibility, and expert guidance without the need for in-person visits.",
        ],
      },
      {
        question: "What are the benefits of veterinary telemedicine?",
        answer: [
          "Veterinary telemedicine offers a range of advantages that enhance the overall pet care experience. It provides unmatched convenience and accessibility, making it easier for pet owners to access veterinary care, often outside of traditional office hours.",
          "This can be especially beneficial for pets who find in-person visits stressful and for those residing in areas with a shortage of veterinarians. Veterinary telemedicine eliminates the need for physical travel to a vet's office, saving time and costs for pet parents. This innovative approach to pet healthcare is designed to cater to the diverse needs of pet owners, offering both practical and emotional relief.",
        ],
      },
      {
        question: "What are the risks of veterinary telemedicine?",
        answer: [
          "While veterinary telemedicine offers convenience, there are potential risks associated with its use. Delays in medical evaluation and treatment might occur due to equipment failures or information transmission issues, such as poor image resolution.",
          "Breach of privacy is a concern, especially if there are security breaches, potentially compromising personally identifiable information. Additionally, risks include adverse drug interactions, allergic reactions, complications, or errors in treatment due to incomplete medical information provided by pet owners.",
          "It's crucial to understand that telemedicine might not be suitable for all cases. If our veterinarians determine that an in-person visit is necessary for your pet's best interest, they will refer you to a local veterinarian. Rest assured, the health and safety of pets remain our utmost priority.",
        ],
      },
      {
        question: "Can I use Rex Vet for a pet health emergency?",
        answer: [
          "No. Rex Vet is intended exclusively for non-emergency situations. If your pet is facing an urgent or life-threatening condition, we strongly advise seeking immediate, in-person emergency veterinary care.",
        ],
      },
      {
        question: "Is veterinary telemedicine legal?",
        answer: [
          "Yes, veterinary telemedicine is legal. Most states require what’s known as a veterinary-client-patient relationship (VCPR) to be established in order for a veterinarian to diagnose and prescribe medications for them. A VCPR basically means that the vet has examined an animal and understands their condition well enough to diagnose and treat them.",
          "In several states, veterinarians are allowed to establish a VCPR remotely and prescribe medication if they have enough information to do so safely. However, some states require veterinarians to physically see the animal before diagnosing or prescribing medication. In these cases, veterinarians can provide general advice and suggest non-prescription treatment options remotely.",
          "At Rex Vet, our telemedicine technologies enable veterinarians to care for pets remotely. If you are in a state where a VCPR can be established virtually and you opt for a prescription appointment, the licensed veterinarian you work with will comply with state laws. However, in states where a VCPR cannot be established virtually or for advice appointments, the veterinarian can provide general advice along with non-prescription treatment options.",
        ],
      },
      {
        question: "What conditions does Rex Vet offer treatment for?",
        answer: [
          "Our licensed veterinarians at Rex Vet are equipped to provide virtual care for a wide range of pet health issues, such as anxiety, allergies, ear problems, urinary tract infections (UTIs), flea and tick concerns, upset stomach, behavioral issues, and more.",
          "Following your video call with the vet, you'll receive a personalized treatment plan, which may include prescription medications, over-the-counter treatments, behavior therapy, and dietary or enrichment recommendations. We do, however, strongly recommend that every pet parent maintain an ongoing relationship with a local veterinarian for routine check-ups and other pet medical needs. Rest assured, we are more than happy to share your pet's medical records with your local vet to ensure comprehensive care.",
        ],
      },
      {
        question: "Can you send electronic health records to my vet?",
        answer: [
          "Yes, our Rex Vet-affiliated veterinarians can electronically transfer your pet's health records to your local veterinarian. All we need is your vet's contact information to facilitate this seamless communication.",
        ],
      },
      {
        question: "What if Rex Vet can’t treat my pet?",
        answer: [
          "In some instances, certain pet conditions may be too complex for treatment through telemedicine. Rest assured, our veterinarians always prioritize your pet's well-being, and if they determine that a condition requires more specialized or urgent care, they may recommend in-person veterinary care to ensure the best possible treatment.",
        ],
      },
    ],
  },
  {
    title: "Account and Billing",
    items: [
      {
        question:
          "Who do I contact if I have issues with my Rex Vet account, subscription, or billing?",
        answer: [
          "Please reach out to support@rexVet.com and we'll get back to you within 1 business day. You can also manage your account directly by logging in at rexVet.com/registration.",
        ],
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: [
          "Go to the Rex Vet login page and hit the forgot password link. Then head to your email where you'll receive an email with instructions to reset your password.",
        ],
      },
    ],
  },
  {
    title: "Pharmacy",
    items: [
      {
        question: "Can I get prescriptions through Rex Vet?",
        answer: [
          "Prescription services through Rex Vet depend on the regulations in your state. In states where virtual prescribing is permitted, you can book an appointment with a licensed veterinarian on the Rex Vet platform, who can prescribe medication for your pet when necessary.",
          "In states where virtual prescribing is not allowed, a Rex Vet appointment provides access to veterinarians who can offer guidance on various health and behavioral issues, preventive care, and over-the-counter treatment options—all from the convenience of your home. This service can help you avoid unnecessary vet visits and reduce stress for both you and your pet.",
        ],
      },
    ],
  },
  {
    title: "Pricing",
    items: [
      {
        question: "How much will it cost for Rex Vet to treat my pet?",
        answer: [
          "At Rex Vet, we offer low-cost access to our veterinarians through video chat and messaging for your pet. Say goodbye to lengthy appointment wait times and unexpected bills.",
          "It's important to note that our veterinarians may recommend prescription or over-the-counter medications for your pet, which are to be paid separately.",
        ],
      },
    ],
  },
  {
    title: "Safety",
    items: [
      {
        question: "Is telehealth a safe way for my pet to receive treatment?",
        answer: [
          "Telehealth is a safe and effective way to treat many common pet conditions. It can be especially helpful for pets who experience stress or anxiety during visits to a traditional veterinary office. However, it's important to recognize that telehealth has its limitations and cannot entirely replace the need for a local veterinarian. Local veterinarians are essential for annual check-ups, vaccinations, testing, and issues that demand a physical examination or procedure.",
          "Rest assured, the well-being of pets is our top priority at Rex Vet. If one of our veterinarians determines that an in-person visit is in the best interest of your pet, they will refer you to a local veterinarian for the necessary care.",
        ],
      },
      {
        question: "If my pet experiences side effects, who should I contact?",
        answer: [
          "Your veterinarian will provide you with a comprehensive list of treatment benefits and discuss any potential side effects before starting any treatment plan or medication. If your pet experiences unexpected side effects or if you have any questions, you can easily get in touch with your vet via messaging or by scheduling a follow-up appointment, all included in your membership at no extra cost. Our memberships come with unlimited access to video calls and messaging with veterinarians.",
          "However, in cases where your pet is in an urgent or life-threatening condition, we strongly recommend seeking immediate in-person emergency veterinary care.",
        ],
      },
    ],
  },
  {
    title: "Treatment and Side Effects",
    items: [
      {
        question:
          "What happens if my pet experiences a bad reaction from the medication?",
        answer: [
          "If you believe your pet is experiencing an emergency due to a reaction to medications, it's essential to seek immediate assistance from an emergency veterinary clinic. For non-emergency concerns, you can easily follow up with your Rex Vet-affiliated vet by logging into your Rex Vet account and sending a message for guidance and support.",
        ],
      },
      {
        question: "Does every pet get the same treatment?",
        answer: [
          "Each pet's health and needs are unique, and our veterinarians provide personalized treatment recommendations after examining your pet during the visit. The treatment plan is tailored to your pet's specific health condition and may include prescription medication, over-the-counter treatments, behavior therapy, as well as dietary and enrichment advice. Your pet's well-being is our priority, and our Vet ensure that each pet receives the most suitable care.",
        ],
      },
      {
        question: "What if Rex Vet can’t treat my pet?",
        answer: [
          "In some instances, certain pet conditions may be too complex for treatment through telemedicine. Rest assured, our veterinarians always prioritize your pet's well-being, and if they determine that a condition requires more specialized or urgent care, they may recommend in-person veterinary care to ensure the best possible treatment.",
        ],
      },
      {
        question:
          "How long will it take before I see results after my pet starts medication?",
        answer: [
          "The timeframe for seeing results from your pet's treatment can vary depending on the condition and medication prescribed. Some treatments may show results within as little as 24 hours, while others may take 4–6 weeks. Your veterinarian will provide you with a more precise estimate during your consultation, taking into consideration the specific condition and medication selected.",
        ],
      },
      {
        question:
          "My pet has diarrhea after starting medication. What should I do?",
        answer: [
          "Diarrhea is a common side effect of some treatments. Please consult your treatment plan for recommendations and message our Vet for further advice.",
        ],
      },
      {
        question:
          "My pet has lost their appetite after starting medication. What should I do?",
        answer: [
          "Loss of appetite is a common side effect of some treatments. Please consult your treatment plan for recommendations and message our Vet for further advice.",
        ],
      },
      {
        question: "What if my pet's initial treatment plan doesn't work?",
        answer: [
          "Every pet is unique, and their response to treatment can vary. If your pet's initial treatment plan doesn't produce the desired results, it's not uncommon, and our goal is to find the most effective approach for your pet's specific needs and genetic makeup. Rest assured, all follow-up consultations are included in your Rex Vet membership, allowing us to make necessary adjustments to the treatment plan over time. If your pet's treatment isn't working as expected or if you have any questions, simply reach out to your vet by messaging or scheduling a follow-up call.",
        ],
      },
    ],
  },
  {
    title: "Veterinary",
    items: [
      {
        question:
          "Are licensed veterinarians responsible for evaluating the health condition of your dog or cat and devising a personalized treatment plan?",
        answer: [
          "Yes, at Rex Vet, all care is provided by licensed veterinarians, guaranteeing the highest level of service and care for your pet. Our commitment to your pet's well-being is unwavering, and we strictly adhere to professional standards. In states where we are authorized to prescribe medications online, you will consistently consult with a veterinarian licensed in your state. In states where online prescribing is not permitted, you may be connected with a veterinarian licensed in a different state who can offer general advice and non-prescription treatment options.",
        ],
      },
      {
        question:
          "Is it necessary for me to inform my regular veterinarian about the services my pet receives from Rex Vet?",
        answer: [
          "While we strongly advise that you inform your primary veterinarian about all treatments and medications your pet is receiving, the decision ultimately rests with you. You can request the transfer of your pet's medical records from Rex Vet to your local veterinarian at any time by contacting support@rexVet.com.",
        ],
      },
      {
        question: "How is the vet matched with me?",
        answer: [
          "We collaborate with licensed veterinarians across the United States, and your vet will be selected based on their availability during your preferred video call time. If you require a prescription and your state permits online prescription by veterinarians, we will pair you with a vet licensed in your state. In case you're seeking advice only, or you reside in a state where online prescription isn't allowed, you might be matched with a veterinarian licensed in a different state.",
        ],
      },
      {
        question: "Where are your veterinarians based?",
        answer: [
          "Our network includes licensed veterinarians from across the country. If you reside in a state where we can provide prescriptions, you will consistently interact with a veterinarian licensed in your state. In states where online prescription services are restricted, you may be connected with a veterinarian licensed in a different state.",
        ],
      },
      {
        question:
          "How soon will I receive the treatment plan from my vet after the appointment?",
        answer: [
          "Usually, your treatment plan is prepared and sent by the vet within one business day.",
        ],
      },
      {
        question: "How can I contact a vet?",
        answer: [
          "You can arrange a video appointment with a vet by logging in at rexVet.com. After scheduling an appointment, you can send a message to your vet through your Rex Vet account.",
        ],
      },
      {
        question: "Is Rex Vet a substitute for a local veterinary hospital?",
        answer: [
          "No, Rex Vet is not intended to replace your local veterinary hospital. While our veterinarians can provide guidance on improving your pet's quality of life, help you understand their well-being, address specific issues, and prescribe medications for certain conditions, they cannot conduct physical examinations, blood tests, administer vaccinations, perform surgeries, or handle other hands-on medical procedures. We strongly recommend that you maintain your relationship with your current vet for all other needs, including routine check-ups, vaccinations, and emergency care. Our Vet can assist you in determining if your pet requires urgent attention for non-life-threatening issues. However, if your pet is experiencing symptoms such as shortness of breath, collapse, seizures, bleeding, or other life-threatening conditions, it is essential to seek immediate care at an emergency veterinary clinic.",
        ],
      },
      {
        question:
          "How frequently should I have follow-up appointments with the vet?",
        answer: [
          "We recommend that you reach out to your vet or schedule a new appointment whenever you have inquiries or require ongoing care.",
        ],
      },
      {
        question:
          "I am a licensed veterinarian. How can I become a part of the Rex Vet team?",
        answer: [
          "We are continually seeking licensed veterinarians to join us. If you possess a valid veterinary license in one or more states, we are eager to discuss potential opportunities with you. In states where we provide prescription services, you will also need a valid DEA license to prescribe gabapentin. To gather more information and get in touch with our recruitment team, please visit https://rexvets-nextjs.vercel.app or initiate a conversation by emailing support@rexvet.org.",
        ],
      },
    ],
  },
  {
    title: "Donations & Support",
    items: [
      {
        question: "How can I support Rex Vet's mission?",
        answer: [
          "We greatly appreciate your interest in supporting our mission to make veterinary care accessible to all pets and their families. There are several ways you can contribute:",
          "1. Make a financial donation to our Care Fund, which helps provide services to pets in low-income households",
          "2. Spread awareness about Rex Vet services to other pet owners",
          "3. Participate in our referral program",
          "4. Follow us on social media and share our content",
          "Your support helps us continue providing affordable, accessible veterinary care to pets who need it most.",
        ],
      },
      {
        question: "What is the Rex Vet Care Fund?",
        answer: [
          "The Rex Vet Care Fund is a charitable program that provides subsidized veterinary care to pets from low-income households and supports animal welfare organizations. Through this fund:",
          "- We offer discounted telehealth consultations to qualified pet owners",
          "- We partner with local shelters and rescue organizations to provide care for animals in need",
          "- We support community spay/neuter programs and vaccination clinics",
          "Donations to the Care Fund are tax-deductible, and 100% of contributions go directly to helping animals in need.",
        ],
      },
      {
        question: "How do I make a donation?",
        answer: [
          "You can make a donation to support Rex Vet's mission in several ways:",
          "1. Online: Visit our website at rexvet.com/donate and use our secure payment portal",
          "2. By phone: Call our support team at 1-800-REX-VETS during business hours",
          "3. By mail: Send a check payable to 'Rex Vet Care Fund' to our headquarters address",
          "4. During checkout: Add a donation to your purchase when booking a consultation",
          "We accept one-time donations, monthly recurring donations, and can process matching gifts from employers.",
        ],
      },
      {
        question: "Are donations to Rex Vet tax-deductible?",
        answer: [
          "Yes, donations made to the Rex Vet Care Fund (a 501(c)(3) nonprofit organization) are tax-deductible to the extent allowed by law. You will receive a receipt for your donation that can be used for tax purposes.",
          "Regular payments for veterinary services are not tax-deductible, as they are payments for services rendered.",
        ],
      },
      {
        question: "Can I donate in honor or memory of a pet?",
        answer: [
          "Absolutely. We offer tribute donations to honor or memorialize beloved pets. When making your donation:",
          "- You can specify that your gift is in honor or memory of a pet",
          "- We can send a personalized acknowledgment card to the recipient you designate",
          "- The donation amount will remain confidential unless you specify otherwise",
          "These meaningful gifts help ensure other pets receive the care they need while paying tribute to special animal companions.",
        ],
      },
      {
        question: "How are donations used?",
        answer: [
          "Donations to the Rex Vet Care Fund are used exclusively to support our charitable programs:",
          "- 60% provides subsidized telehealth consultations for low-income pet owners",
          "- 20% supports shelter and rescue partnership programs",
          "- 15% funds community education and prevention programs",
          "- 5% covers administrative costs associated with running the fund",
          "We publish an annual report detailing our financials and impact, which is available on our website.",
        ],
      },
      {
        question: "Does Rex Vet accept corporate sponsorships?",
        answer: [
          "Yes, we welcome corporate partnerships and sponsorships. We offer several partnership levels with various benefits:",
          "- Program Sponsors: Support specific initiatives like spay/neuter clinics or vaccination drives",
          "- Event Sponsors: Help underwrite educational webinars or community events",
          "- Care Partners: Provide ongoing support for our core telehealth assistance program",
          "Corporate partners receive recognition on our website, in our annual report, and through other channels. For more information, please contact our development team at partnerships@rexvet.com.",
        ],
      },
    ],
  },
];
