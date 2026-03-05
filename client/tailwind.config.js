/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  '#f5f0e8',
          100: '#e8dfc8',
          200: '#c9a84c',
          300: '#b8922e',
          900: '#0d0d0d',
          950: '#080808',
        },
        surface: {
          DEFAULT: '#161616',
          2: '#1e1e1e',
          3: '#252525',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c97a',
          dark: '#9a7a28',
        },
      },
    },
  },
  plugins: [],
}
