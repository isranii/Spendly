/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: '#f8f6f0',
        gold: '#d4af37',
        champagne: '#f7e7ce',
        'luxury-black': '#0a0a0a',
        'luxury-gray': '#1a1a1a',
      },
      fontFamily: {
        'luxury': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      spacing: {
        'section': '3rem',
      },
      borderRadius: {
        'container': '1rem',
      },
      backdropBlur: {
        'luxury': '20px',
      },
      boxShadow: {
        'luxury': '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(212, 175, 55, 0.1)',
        'luxury-hover': '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.2)',
      },
      animation: {
        'luxury-shimmer': 'luxuryShimmer 3s ease-in-out infinite',
        'luxury-spin': 'luxurySpin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
