// Файл: frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E31E24',
          dark: '#B51519',
          light: '#FF3A40',
        },
        // Цагаан theme-д зориулсан өнгөнүүд
        dark: {
          DEFAULT: '#f4f4f5',       // Үндсэн дэвсгэр — цайвар саарал
          secondary: '#ffffff',     // Card/Navbar — цагаан
          card: '#ffffff',          // Card — цагаан
        },
        gray: {
          850: '#e4e4e7',
          750: '#d4d4d8',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
}