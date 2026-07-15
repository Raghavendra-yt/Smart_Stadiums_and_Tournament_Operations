/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        stadium: {
          dark: '#070913',
          card: '#0f172a',
          emerald: '#10b981',
          cyan: '#06b6d4',
          gold: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
