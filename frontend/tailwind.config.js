/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "#fff",
      black: "#000",
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
        125:"#030064"
      }
    },
    extend: {},
  },
  plugins: [],
}