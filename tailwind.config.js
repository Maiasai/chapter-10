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
      colors: { // カラーコードで指定可能
        red: {
          500: '#B91C1C',
        },
        blue: {
          500: '#1D4ED8',
        },
        yellow: {
          500: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
}
