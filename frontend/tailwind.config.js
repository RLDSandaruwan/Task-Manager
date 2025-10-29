/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // make sure Tailwind scans all your React files
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        purpleMain: "#9d0191",
        orangeMain: "#ff7722",
        darkBlue: "#0a1930",
        lightBlue: "#1f93ff",
      },
    },
  },
  plugins: [],
};
