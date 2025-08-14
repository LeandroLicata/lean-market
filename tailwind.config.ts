import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navbar: "#053262",
        primary: "#C6F5FC",
        "promo-1": "#7B61FF",
        "promo-2": "#007B83",
        "promo-3": "#3A3F58",
        "gray-light": "#EBEBEB",
        "neon-mint": "#00FF84",
        "sky-bright": "#4DD5FF",
        "sky-hover": "#36B9E6",
        "mint-bright": "#00E6A8",
        "mint-hover": "#00C98F",
      },
    },
  },
  plugins: [],
} satisfies Config;
