export const ACCENT_PRESETS = {
  terracotta: {
    label: "Terracotta",
    swatch: "#b05740",
    light: { primary: "#b05740", primaryDark: "#8e4432", primaryLight: "#d08b78" },
    dark:  { primary: "#c97a5e", primaryDark: "#a85840", primaryLight: "#e0a88e" },
  },
  teal: {
    label: "Teal",
    swatch: "#4a8c7a",
    light: { primary: "#4a8c7a", primaryDark: "#366658", primaryLight: "#72b0a0" },
    dark:  { primary: "#6bb8a4", primaryDark: "#4a9080", primaryLight: "#92d0c0" },
  },
  ocean: {
    label: "Ocean",
    swatch: "#3d7fa5",
    light: { primary: "#3d7fa5", primaryDark: "#2b5f7e", primaryLight: "#6aaacb" },
    dark:  { primary: "#6aaacb", primaryDark: "#4a88aa", primaryLight: "#90cce0" },
  },
  plum: {
    label: "Plum",
    swatch: "#7a5c8c",
    light: { primary: "#7a5c8c", primaryDark: "#5c4070", primaryLight: "#a080b8" },
    dark:  { primary: "#b090cc", primaryDark: "#8c6aaa", primaryLight: "#ccb0e8" },
  },
  ember: {
    label: "Ember",
    swatch: "#c07840",
    light: { primary: "#c07840", primaryDark: "#9a5e28", primaryLight: "#e0a870" },
    dark:  { primary: "#e0a060", primaryDark: "#c07840", primaryLight: "#f0c090" },
  },
} as const;

export type AccentKey = keyof typeof ACCENT_PRESETS;

export const ACCENT_KEYS = Object.keys(ACCENT_PRESETS) as AccentKey[];

export function isValidAccentKey(v: unknown): v is AccentKey {
  return typeof v === "string" && v in ACCENT_PRESETS;
}

export function resolveAccentKey(raw: string | null | undefined): AccentKey {
  return isValidAccentKey(raw) ? raw : "terracotta";
}
