import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      screens: {
        1365: "1365px",
        1050: "1050px",
        545: "545px",
      },
      colors: {
        orange: "#EF8225",
        oranget: "#F826",
        blue: "#3AF",
        bluet: "#06E5",
        water: "#33A7FD",
        red: "#F43",
        green: "#56C35C ",
        white: "#D9D9D9",
        lightGrey: "#8C8C8C",
        grey: "#1F1F1F",
        black: "#131313",
        footerbg: "#2C2C2C",
      },
      spacing: {
        0: "0px",
        2: "2px",
        3: "3px",
        4: "4px",
        5: "5px",
        10: "10px",
        15: "15px",
        20: "20px",
        25: "25px",
        30: "30px",
        40: "40px",
        50: "50px",
      },
      width: {
        full: "100%",
        "1/2": "50%",
        "1/4": "25%",
      },
      high: {
        full: "100%",
      },
    },
  },
  plugins: [heroui()],
};
