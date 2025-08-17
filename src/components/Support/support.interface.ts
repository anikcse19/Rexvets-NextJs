import { JSX, ReactNode } from "react";

export interface ISupportOption {
  icon: JSX.Element;
  title: string;
  description: string;
  action: string;
  link?: string;
  href?: string;
  onClick?: () => void;
}
export interface ISupportStayConnectedData {
  link: string;
  icon: JSX.Element;
}
