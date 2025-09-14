export interface HelpTicket {
  _id: string;
  role: "veterinarian" | "pet_parent"; // if always veterinarian, keep literal type, else string
  name: string;
  email: string;
  phone: string;
  state: string;
  subject: string;
  details: string;
  status: string; // adjust if there are more statuses
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  id: string;
}

export interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  originalTicket: HelpTicket;
  isFirstReply: boolean;
}
