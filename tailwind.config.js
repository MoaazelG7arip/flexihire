/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  theme: {
    container: {
      center: true, // Centers the container 
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },   
    },
    extend: {

    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
}

