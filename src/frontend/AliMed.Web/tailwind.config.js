/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'alimed-blue': '#1673b2',
        'alimed-light-blue': '#4cb4e3',
        'alimed-green': '#acd045',
      },
    },
  },
  plugins: [],
}
