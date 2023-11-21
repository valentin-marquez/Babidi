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
    darktheme: "darken",
    themes: [
      'light',
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#794cff",
          secondary: "#4f359e",
          accent: "#794cff",
          neutral: "#28252d",
          "base-100": "#151519",
          active: "#794cff"
        },
      },
      {
        darken: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#794cff",
          secondary: "#4f359e",
          accent: "#794cff",
          neutral: "#6a6e8f",
          "base-100": "#141527",
          "base-200": "#1c1e35",
          "base-300": "#252944",
          active: "#794cff",
          "text-white": "#fbfcfc",
          "focus-content": "#7f00ff",
        },

      },
    ],
  },
  plugins: [require("daisyui")],
};
