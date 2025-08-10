import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const toSlug = (input: string): string => {
  return input.toLowerCase().trim().split(/\s+/).join("-");
};
