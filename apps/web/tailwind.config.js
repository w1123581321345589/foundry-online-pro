
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { accent: '#0A84FF' },
      borderRadius: { 'xl': '12px' },
      boxShadow: { card: '0 6px 16px rgba(0,0,0,0.06)' },
    },
  },
  plugins: [],
};
