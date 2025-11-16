export const tokens = {
  colors: {
    // Brand
    'brand-primary': '#0b5fff',
    'brand-primary-600': '#084ee6',
    'on-primary': '#ffffff',

    // Core surfaces / text
    background: '#ffffff',
    surface: '#f7f7f8',
    'text-primary': '#0f172a',
    'text-secondary': '#475569',

    // Neutrals (simple scale)
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // States
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },

  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '24px',
  },

  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },

  shadow: {
    sm: '0 1px 2px rgba(16,24,40,0.04)',
    md: '0 6px 18px rgba(16,24,40,0.08)',
  },

  font: {
    family: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    sizes: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
} as const;

export type Tokens = typeof tokens;

export default tokens;
