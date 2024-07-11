import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '576px',
      'md': '1280px',
      'lg': '1440px',
    },
    extend: {
    },
  },
  patterns: {
    opacities: {
      100: "1",
      80: ".80",
      60: ".60",
      40: ".40",
      20: ".20",
      10: ".10",
      5: ".05",
    },
    sizes: {
      1: "0.25rem",
      2: "0.5rem",
      4: "1rem",
      6: "1.5rem",
      8: "2rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      32: "8rem",
    },
  },
  daisyui: {
    themes: [
      {
        simtech: {
          primary: "#015CAB",
          secondary: "#00beff",
          accent: "#00cdb7",
          neutral: "#DDDDDD",
          "base-100": "#1f2937",
          info: "#00BEFF",
          success: "#9affdc",
          warning: "#ffbe00",
          error: "#ff5861",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require("@igorkowalczyk/is-browser"),
    require("tailwind-scrollbar-hide"),
  ],
};
export default config;
