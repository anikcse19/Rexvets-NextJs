import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The function `cn` in TypeScript merges multiple class values using `clsx` and `twMerge`.
 * @param {ClassValue[]} inputs - The `inputs` parameter in the `cn` function is a rest parameter that
 * allows you to pass any number of arguments of type `ClassValue`. These arguments can be strings,
 * arrays, or objects representing CSS class names or class name mappings. The function then merges and
 * processes these class values using the
 * @returns The `cn` function is returning the result of merging the class names passed as arguments
 * using the `clsx` function and then applying Tailwind CSS utility classes using the `twMerge`
 * function.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * The `toSlug` function takes a string input, converts it to lowercase, removes leading and trailing
 * spaces, splits it by spaces, and joins the parts with hyphens to create a slug.
 * @param {string} input - The `toSlug` function takes a string input and converts it into a slug
 * format. The input string is first converted to lowercase, trimmed of any leading or trailing
 * whitespace, and then any consecutive whitespace characters are replaced with a single hyphen `-`.
 * @returns The `toSlug` function is being returned.
 */
export const toSlug = (input: string): string => {
  return input.toLowerCase().trim().split(/\s+/).join("-");
};
