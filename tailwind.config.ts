import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#f7f9fb",
          dim: "#d8dadc",
          bright: "#f7f9fb",
          container: {
            DEFAULT: "#eceef0",
            lowest: "#ffffff",
            low: "#f2f4f6",
            high: "#e6e8ea",
            highest: "#e0e3e5",
          },
          variant: "#e0e3e5",
          tint: "#4059aa",
        },
        primary: {
          DEFAULT: "#00236f",
          container: "#1e3a8a",
          fixed: { DEFAULT: "#dce1ff", dim: "#b6c4ff" },
        },
        secondary: {
          DEFAULT: "#006a61",
          container: "#86f2e4",
          fixed: { DEFAULT: "#89f5e7", dim: "#6bd8cb" },
        },
        tertiary: {
          DEFAULT: "#4b1c00",
          container: "#6e2c00",
          fixed: { DEFAULT: "#ffdbcb", dim: "#ffb691" },
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-surface": {
          DEFAULT: "#191c1e",
          variant: "#444651",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#90a8ff",
          fixed: { DEFAULT: "#00164e", variant: "#264191" },
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#006f66",
          fixed: { DEFAULT: "#00201d", variant: "#005049" },
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#f39461",
          fixed: { DEFAULT: "#341100", variant: "#773205" },
        },
        "on-error": { DEFAULT: "#ffffff", container: "#93000a" },
        outline: { DEFAULT: "#757682", variant: "#c5c5d3" },
        inverse: {
          surface: "#2d3133",
          "on-surface": "#eff1f3",
          primary: "#b6c4ff",
        },
        chart: {
          1: "#2563eb",
          2: "#7C3AED",
          3: "#F59E0B",
          4: "#10B981",
          5: "#EF4444",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        ambient: "0 12px 40px rgba(0, 35, 111, 0.06)",
        "ambient-up": "0 -4px 12px rgba(0, 35, 111, 0.08)",
        "ambient-hover": "0 24px 48px rgba(0, 35, 111, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
