/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./clampbox/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--ff-d)", "Georgia", "serif"],
        sans: ["var(--ff-b)", "system-ui", "sans-serif"],
        mono: ["var(--ff-m)", "monospace"]
      },
      colors: {
        brand: {
          DEFAULT: "#1B3A6B",
          mid: "#2B52A0",
          bg: "#EEF3FB"
        },
        math: {
          DEFAULT: "#0066CC",
          bg: "#EBF3FF"
        },
        forkline: {
          DEFAULT: "#92400E",
          mid: "#B45309",
          bg: "#FEF7EC",
          border: "rgba(180, 83, 9, 0.14)"
        },
        lattice: {
          DEFAULT: "#1B3A6B",
          mid: "#0066CC",
          bg: "#EEF3FB",
          border: "rgba(27, 58, 107, 0.14)"
        },
        zinc: {
          150: "#eaeaea",
          250: "#d4d4d8",
          450: "#8e8e93",
          550: "#636366",
          650: "#48484a",
          750: "#2c2c2e"
        }
      }
    }
  },
  plugins: [],
}
