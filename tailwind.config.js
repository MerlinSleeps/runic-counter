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

        'rune-fury': '#DC2626',   // Red
        'rune-calm': '#16A34A',   // Green
        'rune-body': '#D97706',   // Orange
        'rune-order': '#EAB308',  // Yellow
        'rune-mind': '#2563EB',   // Blue
        'rune-chaos': '#9333EA',  // Purple
      },
      dropShadow: {
        'glow-fury': '0 0 8px rgba(220, 38, 38, 0.7)',
        'glow-calm': '0 0 8px rgba(22, 163, 74, 0.7)',
        'glow-body': '0 0 8px rgba(217, 119, 6, 0.7)',
        'glow-order': '0 0 8px rgba(234, 179, 8, 0.7)',
        'glow-mind': '0 0 8px rgba(37, 99, 235, 0.7)',
        'glow-chaos': '0 0 8px rgba(147, 51, 234, 0.7)',
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

