/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#59a7ff",
          500: "#3385ff",
          600: "#1c66f5",
          700: "#1551e0",
          800: "#1843b6",
          900: "#1a3d8f",
          950: "#15275a",
        },
      },
    },
  },
  plugins: [],
};
