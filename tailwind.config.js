/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "mobile-small": {
          raw: "(min-width: 320px) and (max-width: 320px) and (max-height: 709px)",
        },
      },
      fontFamily: {
        garet: ["var(--font-garet)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
