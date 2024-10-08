const { fontFamily } = require("tailwindcss/defaultTheme");
import type { Config } from "tailwindcss";

const generateTailwindColorCombinations = (colors: string[]) => {
  const shades = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ];
  const variants = ["bg", "text", "border"];
  const modifiers = ["", "hover:", "dark:"];

  const combinations: string[] = [];

  colors.forEach((color: string) => {
    shades.forEach((shade) => {
      variants.forEach((variant) => {
        modifiers.forEach((modifier) => {
          combinations.push(`${modifier}${variant}-${color}-${shade}`);
        });
      });
    });
  });

  return combinations;
};

const config = {
  safelist: generateTailwindColorCombinations([
    "blue",
    "green",
    "red",
    "purple",
    "pink"
  ]),
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        slate: {
          920: "#091021",
          930: "#050d1f",
          960: "#010412",
          970: "#00020a",
        },
        pink: {
          990: "#1a000a",
        },
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
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

        inside: {
          DEFAULT: "hsl(var(--inside))",
          foreground: "hsl(var(--inside))",
        },
        outside: {
          DEFAULT: "hsl(var(--outside))",
          foreground: "hsl(var(--outside))",
        },
        casing: {
          DEFAULT: "hsl(var(--casing))",
          foreground: "hsl(var(--casing))",
        },
        heating: {
          DEFAULT: "hsl(var(--heating))",
          foreground: "hsl(var(--heating))",
        },
        cooling: {
          DEFAULT: "hsl(var(--cooling))",
          foreground: "hsl(var(--cooling))",
        },
        in: {
          DEFAULT: "hsl(var(--in))",
          foreground: "hsl(var(--in))",
        },
        battery: {
          DEFAULT: "hsl(var(--battery))",
          foreground: "hsl(var(--battery))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
