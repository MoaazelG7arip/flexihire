/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  theme: {
    container: {
      center: true, // Centers the container 
      padding: '1rem',
        screens: {
          sm: '540px',
          md: '720px',
          lg: '960px',
          xl: '1140px',
          xxl: '1320px',
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

