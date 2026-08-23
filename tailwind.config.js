/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        reel: {
          bg: "#12141c",
          card: "#1b1e2a",
          card2: "#20242f",
          line: "#31364a",
        },
        marquee: {
          DEFAULT: "#e8a33d",
          soft: "#f2c069",
        },
        teal: {
          stub: "#3ec1a3",
        },
        ink: {
          DEFAULT: "#f2efe9",
          muted: "#9297ad",
          faint: "#5b607a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "18px 18px",
      },
    },
  },
  plugins: [],
};
