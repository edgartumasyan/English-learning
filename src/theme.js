// Design-system palettes ported from the Lexi mobile redesign. Each key becomes
// a CSS custom property (`--page-bg`, `--accent`, …) set on the app container.
export const THEMES = {
  dark: {
    "page-bg": "#0a0f17",
    "container-bg": "#0d1420",
    surface: "#151f2e",
    "surface-alt": "#0d1420",
    text: "#eef3f9",
    muted: "#93a4bd",
    border: "#1c2635",
    "border-strong": "#2a3850",
    accent: "#38bdf8",
    "accent-ink": "#04141f",
    accent2: "#f472b6",
    "accent2-ink": "#1a0713",
    "reveal-a-bg": "rgba(94,234,212,0.12)",
    "reveal-a-text": "#5eead4",
    "reveal-r-bg": "rgba(249,168,212,0.12)",
    "reveal-r-text": "#f9a8d4",
  },
  light: {
    "page-bg": "#e9edf3",
    "container-bg": "#ffffff",
    surface: "#f2f5f9",
    "surface-alt": "#e9edf3",
    text: "#101828",
    muted: "#64748b",
    border: "#e2e8f0",
    "border-strong": "#cbd5e1",
    accent: "#0284c7",
    "accent-ink": "#ffffff",
    accent2: "#db2777",
    "accent2-ink": "#ffffff",
    "reveal-a-bg": "rgba(13,148,136,0.10)",
    "reveal-a-text": "#0f766e",
    "reveal-r-bg": "rgba(219,39,119,0.08)",
    "reveal-r-text": "#be185d",
  },
};

// Turns a theme palette into a React inline-style object of CSS variables.
export function themeVars(name) {
  const palette = THEMES[name] || THEMES.dark;
  const vars = { colorScheme: name === "dark" ? "dark" : "light" };
  for (const key of Object.keys(palette)) {
    vars[`--${key}`] = palette[key];
  }
  return vars;
}
