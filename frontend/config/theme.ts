export const themeConfig = {
    colors: {
        primary: {
            light: "#3b82f6",
            dark: "#2563eb",
        },
        secondary: {
            light: "#6b7280",
            dark: "#4b5563",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
    },
    fontFamily: {
        sans: "var(--font-inter)",
        mono: "var(--font-mono)",
    },
    borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
    },
};

export type ThemeConfig = typeof themeConfig;