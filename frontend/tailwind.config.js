/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    colors: {
      white: "#fff",
      black: {
        5:"#000",
        25:"#121212",
        50:"#232329"
      },
      transparent: "#ffffff00",
      grey:{
           5:"#f5f5f5",
           25:"#e9ecef",
           50:"#ced4da",
           75:"#adb5bd"
      },
      blue:{
        25:"#6965db",
        50:"#5b57d1",
        75:"#4a47b1",
        100:"#190064",
        125:"#030064",
        150:"#726dff",
        175:"#bbb8ff"
      }
    },
    extend: {
      screens: {
        'custom-sm': '420px',
        'custom-lg': '1400px',
        'custom-md' : '1280px'
      },
    },
  },
  plugins: [],
}