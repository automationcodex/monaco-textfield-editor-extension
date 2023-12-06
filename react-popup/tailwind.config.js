/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        darkgray: "#181818",
        lightgray :"#212121",
        midgray: "#1F1F1F",
      },
    },
  },
  plugins: [],
}