import type { CSSProperties } from "react";

export interface CourseMapUnitTone {
  month: string;
  accent: string;
  chipBg: string;
  surface: string;
  button: string;
}

/** School-year rainbow: September = red through June = gold. Hex lives in globals.css so dark mode can lighten accents. */
const UNIT_MONTHS = [
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
] as const;

function unitIndex(unitNumber: number): number {
  return unitNumber >= 1 && unitNumber <= UNIT_MONTHS.length ? unitNumber : 1;
}

export function getCourseMapUnitTone(unitNumber: number): CourseMapUnitTone {
  const n = unitIndex(unitNumber);
  return {
    month: UNIT_MONTHS[n - 1],
    accent: `var(--unit-${n}-accent)`,
    chipBg: `var(--unit-${n}-chip-bg)`,
    surface: `var(--unit-${n}-surface)`,
    button: `var(--unit-${n}-button)`,
  };
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
