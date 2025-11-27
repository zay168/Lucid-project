/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        midnight: 'rgb(var(--color-midnight) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        accent: '#A78BFA', // Soft Lavender - Keeps same accent for now
        success: '#34D399', // Soft Mint
        muted: '#4B5563',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
}