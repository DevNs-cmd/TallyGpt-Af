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
        primary: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
          light: "#F4F0FF",
        },
        secondary: {
          DEFAULT: "#0B2343",
          hover: "#081A32",
          light: "#E7ECF3",
        },
        cardbg: "#FFFFFF",
      },
      borderRadius: {
        "18px": "18px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(11, 35, 67, 0.05), 0 2px 8px -1px rgba(11, 35, 67, 0.03)",
        premium: "0 12px 36px -4px rgba(124, 58, 237, 0.06), 0 4px 16px -2px rgba(11, 35, 67, 0.03)",
      },
    },
  },
  plugins: [],
} satisfies Config;
