/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hub: {
          navy: '#101d36',      // Deep dark navy from primary button & heading
          navyHover: '#182b4d', // Elevated navy for button hovers
          cyan: '#0ea5e9',      // Bright medical cyan for network lines & dots
          sky: '#38bdf8',       // Light cyan node accents
          ice: '#eaf5fc',       // Softest sky-blue tint for badges & borders
          surface: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}