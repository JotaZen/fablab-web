export const tokens = {
  colors: {
    main: "#cc0000",
  },

  palettes: {
    main: {
      50: "#ffe5e5",
      100: "#ffb2b2",
      200: "#ff8080",
      300: "#ff4d4d",
      400: "#ff1a1a",
      500: "#cc0000",
      600: "#990000",
      700: "#660000",
      800: "#330000",
      900: "#1a0000",
    },
    complementary: {
      50: "#e5f0ff",
      100: "#b2d1ff",
      200: "#80b1ff",
      300: "#4d92ff",
      400: "#1a72ff",
      500: "#0058e6",
      600: "#0044b3",
      700: "#003080",
      800: "#001c4d",
      900: "#000f26",
    },
    positive: {
      50: "#e6f9f0",
      100: "#b3f0d6",
      200: "#80e6bb",
      300: "#4ddca1",
      400: "#1ad286",
      500: "#00b36b",
      600: "#00804e",
      700: "#005033",
      800: "#002016",
      900: "#00100b",
    },
    negative: {
      50: "#ffe5e5",
      100: "#ffb2b2",
      200: "#ff8080",
      300: "#ff4d4d",
      400: "#ff1a1a",
      500: "#e60000",
      600: "#b30000",
      700: "#800000",
      800: "#4d0000",
      900: "#260000",
    },

    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  },

  gradients: {},

  shadow: {
    sm: "0 1px 2px rgba(16,24,40,0.04)",
    md: "0 6px 18px rgba(16,24,40,0.08)",
  },

  font: {
    family:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    sizes: {
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
  },
} as const;

export type Tokens = typeof tokens;

export default tokens;

export const colors = tokens.colors;
export const palettes = tokens.palettes;
