import type { CSSProperties } from "react";

export interface CourseMapUnitTone {
  month: string;
  accent: string;
  chipBg: string;
  surface: string;
  button: string;
}

/** School-year rainbow: September = red through June = gold. */
const UNIT_TONES: CourseMapUnitTone[] = [
  { month: "September", accent: "#c44d3a", chipBg: "#fae8e5", surface: "rgba(196, 77, 58, 0.09)", button: "#a83d2c" },
  { month: "October", accent: "#c9732a", chipBg: "#faecd8", surface: "rgba(201, 115, 42, 0.09)", button: "#a85e1f" },
  { month: "November", accent: "#b8860b", chipBg: "#faf3d8", surface: "rgba(184, 134, 11, 0.1)", button: "#946f09" },
  { month: "December", accent: "#4a7c59", chipBg: "#e8f0ea", surface: "rgba(74, 124, 89, 0.09)", button: "#3a6347" },
  { month: "January", accent: "#2d7a8a", chipBg: "#e0f2f5", surface: "rgba(45, 122, 138, 0.09)", button: "#236270" },
  { month: "February", accent: "#3d6ba8", chipBg: "#e8eef8", surface: "rgba(61, 107, 168, 0.09)", button: "#31568a" },
  { month: "March", accent: "#5b4d9a", chipBg: "#eceaf5", surface: "rgba(91, 77, 154, 0.09)", button: "#4a3e7c" },
  { month: "April", accent: "#8b4596", chipBg: "#f5eaf7", surface: "rgba(139, 69, 150, 0.09)", button: "#72377a" },
  { month: "May", accent: "#b84d6f", chipBg: "#fae8ef", surface: "rgba(184, 77, 111, 0.09)", button: "#9a3f5d" },
  { month: "June", accent: "#c49a1a", chipBg: "#faf5e0", surface: "rgba(196, 154, 26, 0.1)", button: "#a07f15" },
];

const DEFAULT_TONE = UNIT_TONES[0];

export function getCourseMapUnitTone(unitNumber: number): CourseMapUnitTone {
  return UNIT_TONES[unitNumber - 1] ?? DEFAULT_TONE;
}

export function courseMapUnitToneStyle(unitNumber: number): CSSProperties {
  const tone = getCourseMapUnitTone(unitNumber);
  return {
    "--unit-accent": tone.accent,
    "--unit-chip-bg": tone.chipBg,
    "--unit-surface": tone.surface,
    "--unit-button": tone.button,
  } as CSSProperties;
}
