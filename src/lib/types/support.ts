export interface HelpTicket {
  id: string;
  createdAt: string;
  emailAddress: string;
  fullName: string;
  image: string;
  message: string;
  phoneNo: string;
  state: string;
  subject: string;
  userID: string;
  userType: string;
  status: string;
}

export interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  originalTicket: HelpTicket;
  isFirstReply: boolean;
}
