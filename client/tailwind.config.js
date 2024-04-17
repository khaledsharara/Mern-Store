/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
  "./node_modules/@nextui-org/theme/dist/components/skeleton.js",
],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss"), require("autoprefixer"), nextui()],
};
