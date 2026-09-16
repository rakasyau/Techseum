import type { Config } from "tailwindcss";

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: rgb("--ink"),
        "ink-soft": rgb("--ink-soft"),
        "ink-muted": rgb("--ink-muted"),
        "ink-faint": rgb("--ink-faint"),
        "ink-ghost": rgb("--ink-ghost"),
        paper: rgb("--paper"),
        "paper-alt": rgb("--paper-alt"),
        "paper-sink": rgb("--paper-sink"),
        line: rgb("--line"),
        "line-strong": rgb("--line-strong"),
        "line-dash": rgb("--line-dash"),
        accent: {
          DEFAULT: rgb("--accent"),
          deep: rgb("--accent-deep"),
          soft: rgb("--accent-soft"),
          ink: rgb("--accent-ink"),
        },
        signal: {
          DEFAULT: rgb("--signal"),
          soft: rgb("--signal-soft"),
        },
        success: {
          DEFAULT: rgb("--success"),
          soft: rgb("--success-soft"),
        },
        danger: {
          DEFAULT: rgb("--danger"),
          soft: rgb("--danger-soft"),
        },
        warn: {
          DEFAULT: rgb("--warn"),
          soft: rgb("--warn-soft"),
        },
      },
      borderRadius: {
        xl: "var(--radius-sm)",
        "2xl": "var(--radius)",
        "3xl": "32px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        pop: "var(--shadow-pop)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
      },
      maxWidth: {
        measure: "68ch",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.7)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(2.1)", opacity: "0" },
        },
        dash: {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "marquee 38s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        dash: "dash 1.2s linear infinite",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
