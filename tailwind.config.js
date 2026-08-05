/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc8c7',
          300: '#ffa19f',
          400: '#ff6b67',
          500: '#ee2824', // Switch Fiber Primary Red
          600: '#d61f1c',
          700: '#b31513',
          800: '#941513',
          900: '#7a1816',
          950: '#430706',
          dark: '#08090c',
          card: '#12141d',
          border: 'rgba(238, 40, 36, 0.2)'
        }
      }
    },
  },
  plugins: [],
}
