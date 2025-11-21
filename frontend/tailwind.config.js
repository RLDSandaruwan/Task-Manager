/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // make sure Tailwind scans all your React files
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        purpleMain: "#9d0191",
        orangeMain: "#ff7722",
        darkBlue: "#0a1930",
        lightBlue: "#1f93ff",
        todoist: {
          red: '#dc4c3e',
          bg: '#fafaf9',
          sidebar: '#fcfaf8',
          border: '#e8e5e1',
          text: '#202020',
          textLight: '#6a6a6a',
        },
      },
    },
  },
  plugins: [],
};
