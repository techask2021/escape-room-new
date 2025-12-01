/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        // Custom red theme colors
        'escape-red': {
          DEFAULT: '#E62727',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#E62727',
          700: '#DC2626',
          800: '#B91C1C',
          900: '#991B1B',
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
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "slide-in-from-top-2": {
          "0%": {
            transform: "translateY(-0.5rem)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          },
        },
        "pulse": {
          "0%, 100%": {
            opacity: "1"
          },
          "50%": {
            opacity: "0.5"
          },
        },
        "ping": {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0"
          },
        },
        "mystery-float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)"
          },
          "50%": {
            transform: "translateY(-20px) rotate(180deg)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "slide-in-from-top-2": "slide-in-from-top-2 0.2s ease-out",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "mystery-float": "mystery-float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  variants: {
    extend: {
      animation: ['hover', 'focus', 'group-hover'],
    },
  },
}