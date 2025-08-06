/** @type {import('tailwindcss').Config} */
const { twMerge } = require("tailwind-merge");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "7xl-custom": "15px", // 👈 your custom class
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        garet: ["var(--font-garet)", "sans-serif"],
      },
    },
  },
  plugins: [twMerge],
};
