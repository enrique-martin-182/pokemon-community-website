/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'retro-gradient': 'linear-gradient(135deg, rgba(236,72,153,1) 0%, rgba(139,92,246,1) 100%)'
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.45)'
      }
    }
  },
  plugins: []
}