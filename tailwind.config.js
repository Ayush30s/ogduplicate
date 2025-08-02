/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        bebas: ["Bebas Neue", "cursive"], // Custom font Bebas Neue
        montserrat: ["Montserrat", "sans-serif"], // Custom font Montserrat
        lcase: ["DM Sans", "sans-serif"], // Custom font DM Sans
        rcase: ["Orbitron", "sans-serif"], // Custom font Orbitron
      },
      screens: {
        sm: "640px", // Small devices (phones)
        md: "768px", // Medium devices (tablets)
        lg: "1024px", // Large devices (laptops/desktops)
        xl: "1280px", // Extra large devices (large desktops)
        "2xl": "1536px", // 2X large devices (very large desktops)
      },
      writingMode: {
        "vertical-lr": "vertical-lr",
      },
      colors: {
        "blue-500": "#3B82F6",
        "blue-600": "#2563EB",
      },
      spacing: {
        5: "1.25rem",
        8: "2rem",
      },
    },
  },
  content: [
    "./index.html", // Main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All JavaScript/TypeScript files in src directory
  ],
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".writing-mode-vertical-lr": {
          writingMode: "vertical-lr", 
        },
      });
    }),
  ],
};
