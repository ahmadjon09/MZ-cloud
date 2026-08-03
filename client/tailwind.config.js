/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        telegram: {
          blue: '#2481cc',
          'blue-hover': '#2f88d2',
          'blue-light': '#54a9eb',
          dark: '#17212b',
          'dark-card': '#1e2329',
          'dark-border': '#2b333d',
          'dark-hover': '#232b35',
          light: '#f1f2f6',
          'light-card': '#ffffff',
          'light-border': '#e1e4e8',
          'light-hover': '#e8ecef',
          accent: '#0088cc'
        }
      },
      boxShadow: {
        'telegram-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'telegram-card': '0 2px 8px rgba(0, 0, 0, 0.08)'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
