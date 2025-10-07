/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/app/_components/**/*.{js,ts,jsx,tsx}",
    "../index.html",
    "../src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      colors: {
        red: '#B91C1C',
      },
    },
  },
  plugins: [],
}
