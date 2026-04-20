/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  darkMode: "class",
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "4rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "ui-sans-serif", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-xl": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
      colors: {
        // Ember — brand accent (warm orange)
        brand: {
          50: "#FFF4E6",
          100: "#FFE5C2",
          200: "#FFD199",
          300: "#FFB766",
          400: "#FF9940",
          500: "#FA8112",
          600: "#E0700A",
          700: "#B95905",
          800: "#8A4204",
          900: "#5C2C02",
          DEFAULT: "#FA8112",
        },
        ember: {
          50: "#FFF4E6",
          100: "#FFE5C2",
          200: "#FFD199",
          300: "#FFB766",
          400: "#FF9940",
          500: "#FA8112",
          600: "#E0700A",
          700: "#B95905",
          DEFAULT: "#FA8112",
        },
        // Ink — deep warm dark
        ink: {
          DEFAULT: "#222222",
          muted: "#555555",
          subtle: "#6B655A",
          faint: "#8C8578",
          inverse: "#FAF3E1",
        },
        // Surface — cream paper palette
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#FAF3E1",
          subtle: "#F5E7C6",
          sunken: "#E8DBB6",
          hover: "#F5E7C6",
        },
        line: {
          DEFAULT: "#E8DBB6",
          subtle: "#F0E4C0",
          strong: "#D7C89B",
        },
        danger: "#C0392B",
        success: "#2F7D4C",
        warning: "#E0700A",
        info: "#3A3A3A",
        background: {
          DEFAULT: "#FAF3E1",
          200: "#222222",
          300: "#2E2E2E",
        },
        primary: {
          DEFAULT: "#FA8112",
          50: "#FFF4E6",
          100: "#FFE5C2",
          200: "#FFD199",
          300: "#FFB766",
          400: "#FF9940",
          500: "#FA8112",
          600: "#E0700A",
          700: "#B95905",
          800: "#8A4204",
          900: "#5C2C02",
        },
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(34, 34, 34, 0.04)",
        sm: "0 1px 3px 0 rgba(34, 34, 34, 0.06), 0 1px 2px -1px rgba(34, 34, 34, 0.04)",
        md: "0 4px 12px -2px rgba(34, 34, 34, 0.08), 0 2px 4px -2px rgba(34, 34, 34, 0.04)",
        lg: "0 12px 28px -8px rgba(34, 34, 34, 0.12), 0 4px 10px -4px rgba(34, 34, 34, 0.06)",
        xl: "0 24px 48px -12px rgba(34, 34, 34, 0.16), 0 8px 16px -6px rgba(34, 34, 34, 0.08)",
        glow: "0 0 0 4px rgba(250, 129, 18, 0.18)",
        "glow-lg": "0 0 32px -4px rgba(250, 129, 18, 0.40)",
        ember: "0 14px 32px -12px rgba(250, 129, 18, 0.45), 0 4px 12px -4px rgba(250, 129, 18, 0.25)",
        // kept alias so existing `shadow-aurora` refs still resolve
        aurora: "0 14px 32px -12px rgba(250, 129, 18, 0.45), 0 4px 12px -4px rgba(250, 129, 18, 0.25)",
        "inner-line": "inset 0 0 0 1px rgba(34, 34, 34, 0.06)",
        "3xl": "0 40px 80px -20px rgba(34, 34, 34, 0.25)",
        glass: "0 8px 32px 0 rgba(34, 34, 34, 0.12)",
      },
      backgroundImage: {
        // kept alias names; now solid/monochrome warm gradients
        aurora: "linear-gradient(135deg, #FF9940 0%, #FA8112 55%, #B95905 100%)",
        "aurora-soft":
          "linear-gradient(135deg, rgba(250,129,18,0.12) 0%, rgba(245,231,198,0.8) 60%, rgba(250,243,225,0.95) 100%)",
        "aurora-radial":
          "radial-gradient(circle at 20% 20%, rgba(250,129,18,0.20), transparent 45%), radial-gradient(circle at 85% 80%, rgba(34,34,34,0.06), transparent 50%), radial-gradient(circle at 50% 0%, rgba(245,231,198,0.6), transparent 60%)",
        ember: "linear-gradient(135deg, #FF9940 0%, #FA8112 55%, #B95905 100%)",
        "ember-soft":
          "linear-gradient(135deg, rgba(250,129,18,0.12) 0%, rgba(245,231,198,0.8) 60%, rgba(250,243,225,0.95) 100%)",
        "paper-grid":
          "linear-gradient(rgba(34,34,34,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34,34,34,0.035) 1px, transparent 1px)",
        shine:
          "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
      },
      backgroundSize: {
        "grid-24": "24px 24px",
        "shine-200": "200% 100%",
      },
      animation: {
        "fade-in": "fadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in": "slideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        shake: "shake 0.3s ease-out",
        "pulse-soft": "pulseSoft 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "aurora-pan": "auroraPan 14s ease infinite",
        "ember-pan": "auroraPan 14s ease infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        fadeIn: "fadeIn 0.4s ease-out",
        slideIn: "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        auroraPan: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
