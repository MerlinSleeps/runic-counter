const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arcane-dark': '#0A1428',
        'arcane-plate': '#1A2E4F',
        'arcane-gold': '#C89B3C',
        'hextech-blue': '#00BFFF',
      },
      fontFamily: {
        arcane: ['Arcane Nine', 'sans-serif'],
        numeric: ['Arcane Nine', 'serif']
      },
      textShadow: {
        'glow-blue': '0 0 10px #00BFFF, 0 0 20px #00BFFF', // font-blue
        'glow-gold': '0 0 8px #C89B3C', // font-gold
      },
      boxShadow: {
        'glow-blue': '0 0 20px 8px rgba(0, 191, 255, 0.4)', // hextech-blue
        'glow-gold': '0 0 15px 5px rgba(200, 155, 60, 0.3)', // arcane-gold
      },
      backgroundImage: {
        'gradient-arcane': 'radial-gradient(circle at center, #0A1428 70%, #000000 100%)',
      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
}

