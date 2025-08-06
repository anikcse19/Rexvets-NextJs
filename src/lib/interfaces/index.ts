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
  specialization?: string; // For vets only
  available?: boolean; // Vet availability status
  consultationFee?: number; // For transparency
  // FCM tokens (to support web & mobile)
  fcmTokens: {
    web?: string;
    mobile?: string;
  };
}
