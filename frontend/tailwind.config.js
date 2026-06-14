/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aw: {
          bg:        '#0f0f13',
          surface:   '#16161d',
          card:      '#1e1e28',
          border:    '#2a2a38',
          purple:    '#7c3aed',
          violet:    '#8b5cf6',
          pink:      '#a855f7',
          text:      '#e2e2f0',
          muted:     '#8888aa',
          badge:     '#252535',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}