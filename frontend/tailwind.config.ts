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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Official Forte Brand System Palette
        forte: {
          50: "#fdf2f7",
          100: "#fbe4ef",
          200: "#f7cae0",
          300: "#f1a1c6",
          400: "#e56aa4",
          500: "#d33d83",
          600: "#b82467",
          700: "#a31551", // Forte signature magenta
          800: "#820232",
          900: "#4a0221", // Forte deep burgundy
          950: "#270111", // Forte dark plum
        },
        brand: {
          50: "#fdf2f7",
          100: "#fbe4ef",
          200: "#f7cae0",
          300: "#f1a1c6",
          400: "#e56aa4",
          500: "#d33d83",
          600: "#b82467",
          700: "#a31551", // Forte signature magenta
          800: "#820232",
          900: "#4a0221", // Forte deep burgundy
          950: "#270111", // Forte dark plum
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
