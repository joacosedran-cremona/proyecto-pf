import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        'orange': '#EF8225',
        'blue': '#33A7FD',
        'green': '#54C42D',
        'white': '#D9D9D9',
        'lightGray' : '#8C8C8C',
        'gray': '#1F1F1F',
        'black': '#131313',
        'footerbg': '#2C2C2C',
      },
      spacing: {
        '0' : '0px',
        '20' : '20px',
      },
      width : {
        'full' : '100%',
        '1/2' : '50%',
        '30' : '30%',
      },
      high : {
        'full' : '100%'
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
