/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        antiquewhite: '#faebd7',
        dusty: '#d2b49f',
        beige: '#F5F5DC',
        brown: {
          50: '#f5f1eb',   // lightest brown
          100: '#e4d7b9',   // lighter brown
          200: '#c79f62',   // medium brown
          300: '#9e7b3e',   // darker brown
          400: '#7a5c2e',   // richer brown
          500: '#5e4624',   // standard brown (main shade)
          600: '#4a3820',   // dark brown
          700: '#392a1a',   // deep brown
          800: '#2e2113',   // very dark brown
          900: '#231613',   // almost black brown
        },
      },
      
    },
  },
  plugins: [],
}
