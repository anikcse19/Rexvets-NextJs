import {
  MdFavorite,
  MdHome,
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
import { IBrand, IFeature, IHomeFeaturesSection } from "../interfaces";
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
