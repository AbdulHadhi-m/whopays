import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-purple": "#9d00ff",
        "neon-pink": "#ff007a",
        "neon-cyan": "#00f0ff",
        "neon-green": "#39ff14",
        "dark-bg": "#07050f",
        "dark-card": "#0e0a21",
      },
    },
  },
  plugins: [],
};

export default config;
