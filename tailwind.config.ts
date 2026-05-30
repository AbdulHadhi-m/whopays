import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "payspin-blue": "#2563eb",
        "payspin-blue-dark": "#1d4ed8",
        "payspin-purple": "#9333ea",
        "payspin-purple-light": "#a855f7",
        "payspin-yellow": "#fbbf24",
        "payspin-pink": "#ec4899",
        "payspin-green": "#22c55e",
        "payspin-bg": "#f8fafc",
        "payspin-dark-bg": "#0f172a",
        "payspin-dark-card": "#1e293b",
        "payspin-text": "#1e293b",
        "payspin-text-dark": "#f8fafc",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.5)',
      }
    },
  },
  plugins: [],
};

export default config;
