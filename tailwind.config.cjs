/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        sora: ["Sora", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: [
      'light',
      {
        darken: {
          primary: "#794cff",
          secondary: "#4f359e",
          accent: "#794cff",
          neutral: "#28252d",
          "base-100": "#151519",
          info: "#3bb2d0",
          success: "#00b294",
          warning: "#ffcf33",
          error: "#ef476f",
          white: "#ffffff",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
