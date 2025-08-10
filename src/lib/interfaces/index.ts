import { StaticImageData } from "next/image";
import { IconType } from "react-icons/lib";

export interface NavItem {
  label: string;
  href?: string;
  items?: { label: string; href?: string; onClick?: () => void }[];
}
export interface HeaderProps {
  logoSrc: string;
  title?: string;
  navItems: NavItem[];
  actions?: React.ReactNode;
}
export enum UserRole {
  PetOwner = "petOwner",
  Vet = "vet",
  Admin = "admin",
}
export interface IPet {
  name: string;
  species: PetSpecies;
  breed?: string;
  age: number;
  medicalHistory?: string[];
}
export enum PetSpecies {
  Dog = "dog",
  Cat = "cat",
  Rabbit = "rabbit",
  Bird = "bird",
  Reptile = "reptile",
  Fish = "fish",
  Hamster = "hamster",
  GuineaPig = "guineaPig",
  Turtle = "turtle",
  Ferret = "ferret",
  Horse = "horse",
  Other = "other",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;

  // Authentication
  password?: string; // Only on server-side or signup
  isEmailVerified?: boolean;

  // Role-based access
  role: UserRole;

  // pets?: IPet[];
  specialization?: string; // For Vet only
  available?: boolean; // Vet availability status
  consultationFee?: number; // For transparency
  // FCM tokens (to support web & mobile)
  fcmTokens: {
    web?: string;
    mobile?: string;
  };
}
export interface IBrand {
  imageUrl: StaticImageData;
  name: string;
  id: number;
}
export interface IFeature {
  title: string;
  description: string;
  image: StaticImageData;
  icon: string;
  color: string;
  chip: string;
  number: string;
}
export interface IHomeAboutSectionFooter {
  title: string;
  tabs: string[];
}
export interface IHomeFeaturesSection {
  id: number;
  icon: IconType;
  title: string;
  description: string;
  color: string;
  gradient: string;
}
export interface IBlog {
  id: number;
  slug: string;
  mainImage: string;
  title: string;
  date: string;
  by: string;
}
export interface ITestimonial {
  name: string;
  text: string;
  image: string;
  date: string;
  rating: number;
  source: "google" | "curated";
  index: number;
}
export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  state: string;
  password: string;
  confirmPassword: string;
}
