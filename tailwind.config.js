/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold:  { DEFAULT: '#D4AF37', light: '#F0C848', dark: '#A08020' },
        ink:   {
          900: '#080808', 800: '#111111', 700: '#161616',
          600: '#1a1a1a', 500: '#222222', 400: '#333333', 300: '#555555'
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
