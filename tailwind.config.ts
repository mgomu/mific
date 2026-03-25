import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#f9f9ff",
          dim: "#d3daef",
          bright: "#f9f9ff",
          container: {
            DEFAULT: "#e9edff",
            lowest: "#ffffff",
            low: "#f1f3ff",
            high: "#e1e8fd",
            highest: "#dce2f7",
          },
          variant: "#dce2f7",
          tint: "#0053db",
        },
        primary: {
          DEFAULT: "#004ac6",
          container: "#2563eb",
          fixed: { DEFAULT: "#dbe1ff", dim: "#b4c5ff" },
        },
        secondary: {
          DEFAULT: "#712ae2",
          container: "#8a4cfc",
          fixed: { DEFAULT: "#eaddff", dim: "#d2bbff" },
        },
        tertiary: {
          DEFAULT: "#006242",
          container: "#007d55",
          fixed: { DEFAULT: "#6ffbbe", dim: "#4edea3" },
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-surface": {
          DEFAULT: "#141b2b",
          variant: "#434655",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#eeefff",
          fixed: { DEFAULT: "#00174b", variant: "#003ea8" },
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#fffbff",
          fixed: { DEFAULT: "#25005a", variant: "#5a00c6" },
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#bdffdb",
          fixed: { DEFAULT: "#002113", variant: "#005236" },
        },
        "on-error": { DEFAULT: "#ffffff", container: "#93000a" },
        outline: { DEFAULT: "#737686", variant: "#c3c6d7" },
        inverse: {
          surface: "#293040",
          "on-surface": "#edf0ff",
          primary: "#b4c5ff",
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
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        ambient: "0 12px 40px rgba(20, 27, 43, 0.06)",
        "ambient-up": "0 -4px 12px rgba(20, 27, 43, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
