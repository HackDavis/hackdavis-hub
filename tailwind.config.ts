import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "2xs": "375px",
      xs: "425px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1540px",
      "3xl": "1920px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--gradient-stops))",
        "gradient-primary": "var(--gradient-primary)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "background-primary": "var(--background-primary)",
        "background-secondary": "var(--background-secondary)",
        "background-light": "var(--background-light)",
        "background-dark": "var(--background-dark)",
        "foreground-light": "var(--foreground-light)",
        "foreground-dark": "var(--foreground-dark)",
        "highlight-blue": "var(--highlight-blue)",
        "highlight-yellow": "var(--highlight-yellow)",
        "text-dark": "var(--text-dark)",
        "text-light": "var(--text-light)",
        "text-error": "var(--text-error)",
        "sand-background-dark": "var(--sand-background-dark)",
        "sand-background-light": "var(--sand-background-light)",
        "sky-background": "var(--sky-background)",
        "sea-background": "var(--sea-background)",
        "water-background": "var(--water-background)",
        "grass-background-dark": "var(--grass-background-dark)",
        "grass-background-darker": "var(--grass-background-darker)",
        "grass-background-light": "var(--grass-background-light)",
        "sand-text-color": "var(--sand-text-color)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)"],
        montserrat: ["var(--font-montserrat)"],
        inter: ["var(--font-inter)"],
        metropolis: ["Metropolis", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
