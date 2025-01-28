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
        '1' : '1px',
        '5' : '5px',
        '10' : '10px',
        '15' : '15px',
        '20' : '20px',
        '25' : '25px',
        '30' : '30px',
        '40' : '40px',
        '50' : '50px',
        '60' : '60px',
        '70' : '70px',
        '80' : '80px',
        '90' : '90px',
        '1h' : '1vh',
        '2h' : '2vh',
        '3h' : '3vh',
        '4h' : '4vh',
        '5h' : '5vh',
        '6h' : '6vh',
        '1w' : '1vw',
        '2w' : '2vw',
        '3w' : '3vw',
        '4w' : '4vw',
        '5w' : '5vw',
        '6w' : '6vw',
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
