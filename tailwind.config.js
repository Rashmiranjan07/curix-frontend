/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        curix: {
          teal: '#00A896',
          tealHover: '#079181',
          tealLight: '#0BC2A8',
          tealSoft: '#E6F8F5',
          navy: '#0A1C35',
          navyDark: '#071524',
          navySurface: '#0e2340',
          slateBg: '#F4F8FB',
        },
        hub: {
          navy: '#0A1C35',      // Deep dark navy
          navyHover: '#122b52', // Elevated navy for button hovers
          cyan: '#00A896',      // Clinical teal
          sky: '#0BC2A8',       // Light cyan node accents
          ice: '#E6F8F5',       // Softest sky-blue tint for badges & borders
          surface: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -4px rgba(0, 168, 150, 0.35)',
        'glow-soft': '0 10px 30px -10px rgba(10, 28, 53, 0.08)',
        'card': '0 4px 20px -2px rgba(10, 28, 53, 0.05), 0 2px 6px -1px rgba(10, 28, 53, 0.02)',
        'card-hover': '0 20px 35px -8px rgba(10, 28, 53, 0.09), 0 4px 12px -2px rgba(0, 168, 150, 0.08)',
      }
    },
  },
  plugins: [],
}