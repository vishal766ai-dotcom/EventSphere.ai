/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f3',
          100: '#fbe8e6',
          200: '#f7d5d1',
          300: '#f0b5ad',
          400: '#e5887c',
          500: '#d75d4e',
          600: '#c24233',
          700: '#a33326',
          800: '#872e23',
          900: '#712b23',
        },
        emeraldEco: {
          50: '#ecfdf5',
          500: '#10b981',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
