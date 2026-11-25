import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', '"Open Sans"', "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Official Forte Brandbook Palette (forte.kz/en/logo)
        forte: {
          50: "#fdf2f7",
          100: "#fbe4ef",
          200: "#f7cae0",
          300: "#fc9385", // Coral Sunshine accent
          400: "#f99184", // Sunrise highlight
          500: "#f03785", // Secondary gradient end (Pink)
          600: "#b8335f", // Icon mid stop
          700: "#a31551", // Master Forte Magenta
          800: "#820232", // Deep magenta hover
          900: "#4a0221", // Dark Magenta
          950: "#270111", // Deepest Plum
          coral: "#fc9385",
          ink: "#1d1d1d",
          charcoal: "#2b2d35",
          muted: "#69758b",
          border: "#eaebef",
          surface: "#f7f6f6",
          subtle: "#f1f2f3",
        },
        brand: {
          50: "#fdf2f7",
          100: "#fbe4ef",
          200: "#f7cae0",
          300: "#fc9385",
          400: "#f99184",
          500: "#f03785",
          600: "#b8335f",
          700: "#a31551",
          800: "#820232",
          900: "#4a0221",
          950: "#270111",
        },
      },
      boxShadow: {
        forte: "0 4px 20px rgba(74, 2, 33, 0.06)",
        "forte-hover": "0 10px 30px rgba(74, 2, 33, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
