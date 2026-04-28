"use client";

import type { ReactNode } from "react";
import { Level1Shell, BottomModeNav, type ModeKey } from "./level1-ui";

interface ThemeActivityShellProps {
  unitSlug: string;
  themeId: string;
  themeTitle: string;
  /** Active mode in URL: "wordlist" | "flashcards" | "fillblank" | "matching" */
  urlMode: string;
  /** Whether the unit-wide matching game is playable */
  unitGameAvailable: boolean;
  children: ReactNode;
}

const URL_MODE_TO_KEY: Record<string, ModeKey> = {
  wordlist: "learn",
  flashcards: "cards",
  fillblank: "quiz",
  matching: "game",
};

export function ThemeActivityShell({
  unitSlug,
  themeId,
  themeTitle,
  urlMode,
  unitGameAvailable,
  children,
}: ThemeActivityShellProps) {
  const active: ModeKey | undefined = URL_MODE_TO_KEY[urlMode];

  const hrefFor = (mode: ModeKey): string | null => {
    switch (mode) {
      case "learn":
        return `/vocab/level-1/${unitSlug}/${themeId}/wordlist`;
      case "cards":
        return `/vocab/level-1/${unitSlug}/${themeId}/flashcards`;
      case "quiz":
        return `/vocab/level-1/${unitSlug}/${themeId}/fillblank`;
      case "game":
        return unitGameAvailable ? `/vocab/level-1/${unitSlug}/matching` : null;
    }
  };

  return (
    <Level1Shell
      backHref={`/vocab/level-1/${unitSlug}/${themeId}`}
      backLabel="Back to topic"
      eyebrow={themeTitle}
      bottomSlot={<BottomModeNav active={active} hrefFor={hrefFor} />}
    >
      {children}
    </Level1Shell>
  );
}
