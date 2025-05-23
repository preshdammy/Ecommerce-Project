const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        merriweather: ['var(--font-merriweather)'],
      },
    },
  },
}
