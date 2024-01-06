/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        first: "#000000",
        second: "#1263ff",
        third: "#1ea1ff",
        fourth: "#ffffff",
        fifth: "#19b616",
        sixth: "#135bc8"
      }
    },
  },
  plugins: [],
}