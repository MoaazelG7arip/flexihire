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
      colors: {
        "custom-blue": "rgba(162, 204, 217)",
        "dark-blue": "rgb(115 153 165)",
      },
    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
}

