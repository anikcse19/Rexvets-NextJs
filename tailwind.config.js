// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}", // if you have pages folder inside src
    "./src/components/**/*.{js,ts,jsx,tsx}", // components inside src
    "./src/app/**/*.{js,ts,jsx,tsx}", // App Router inside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
