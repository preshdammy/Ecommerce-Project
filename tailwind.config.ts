/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Merriweather: ['Merriweather', 'serif'],
        // or if using variable:
        // Merriweather: ['var(--font-merriweather)'],
      },
    },
  },
  plugins: [],
}
