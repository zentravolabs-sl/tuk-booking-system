import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#164B35",
          deep: "#0B3024",
          cream: "#FFF8ED",
          gold: "#E8B44C",
          dark: "#202820"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        premium: "0 20px 50px -12px rgba(11, 48, 36, 0.14)",
        card: "0 10px 30px -10px rgba(22, 75, 53, 0.08)"
      }
    }
  },
  plugins: []
};
export default config;

