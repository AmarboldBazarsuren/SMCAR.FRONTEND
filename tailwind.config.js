// Файл: frontend/tailwind.config.js
// Үүрэг: Tailwind CSS тохиргоо - өнгө, фонт тодорхойлох

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SMCar.mn брэндийн өнгөнүүд
        primary: {
          DEFAULT: '#E31E24', // Улаан - үндсэн өнгө
          dark: '#B51519',
          light: '#FF3A40',
        },
        dark: {
          DEFAULT: '#111111',
          secondary: '#1C1C1C',
          card: '#232323',
        },
        gray: {
          850: '#1a1a1a',
          750: '#2a2a2a',
        }
      },
      fontFamily: {
        // Монгол хэлэнд тохирсон фонт
        sans: ['Pretendard', 'Noto Sans', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
}