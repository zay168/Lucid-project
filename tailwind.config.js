/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
<<<<<<< HEAD
    "./**/*.{js,ts,jsx,tsx}",
=======
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
>>>>>>> e4bc5e8 (big maj)
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#05050A',
        surface: '#0F121E',
        accent: '#A78BFA', // Soft Lavender
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