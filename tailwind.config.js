/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-red': '#991b1b',
        'mid-red': '#b91c1c',
        'beige': '#d4a574',
        'light-beige': '#efe3d1',
        'cream': '#faf9f6',
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out",
        "bounce-slow": "bounce 2s infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        }
      }
    },
  },
  plugins: [],
}
