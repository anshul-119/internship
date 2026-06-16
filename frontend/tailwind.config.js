/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7dcff',
          300: '#9ec0ff',
          400: '#6b9cff',
          500: '#3b76f6', // Dynamic royal brand blue
          600: '#2556d6',
          700: '#1d43ab',
          800: '#1c398c',
          900: '#1b3273',
          950: '#111c47',
        },
        dark: {
          50: '#f6f6f7',
          100: '#ececed',
          200: '#d5d5d8',
          300: '#b0b1b7',
          400: '#83858f',
          500: '#62636e',
          600: '#4d4e57',
          700: '#27272a', // zinc-800 border
          800: '#18181b', // zinc-900 background dark card
          900: '#09090b', // zinc-950 deep background body
          950: '#030303',
        },
        accent: {
          violet: '#8b5cf6',
          fuchsia: '#d946ef',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
