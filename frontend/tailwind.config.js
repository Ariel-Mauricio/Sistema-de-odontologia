const tailwindConfig = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        dental: {
          50: '#f0f9ff',
          500: '#0284c7',
          900: '#0c2d42',
        }
      }
    },
  },
  plugins: [],
};

module.exports = tailwindConfig;
