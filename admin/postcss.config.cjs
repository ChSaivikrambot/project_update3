// postcss.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),  // Use @tailwindcss/postcss instead of tailwindcss
    require('autoprefixer'),
  ],
};
