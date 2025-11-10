/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f97316', // orange-500
        secondary: '#fef3c7', // amber-100
      }
    },
  },
  plugins: [],
}

