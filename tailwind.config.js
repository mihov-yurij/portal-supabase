/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ЭТА СТРОКА ОБЯЗАТЕЛЬНА
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-fade-in': {
          '0%': { opacity: '0', transform: 'scale(1.06) translateX(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateX(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -20px, 0) scale(1.05)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.82', transform: 'scale(1.06)' },
        },
        'sheen': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        'slide-fade-in': 'slide-fade-in 460ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        sheen: 'sheen 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
