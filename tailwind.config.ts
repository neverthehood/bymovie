import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        anybody: ["Anybody", "sans-serif"],
        anybodyCondensed: ["Anybody Condensed", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
