/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        trinetra: {
          bg: "#0a0a0a",
          panel: "#111111",
          border: "#262626",
          saffron: "#ff9933",
          saffronDim: "#c97a29",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
