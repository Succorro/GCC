/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.jsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        Veranda: ["Veranda", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
      }
    },
  },
  plugins: [],
}
