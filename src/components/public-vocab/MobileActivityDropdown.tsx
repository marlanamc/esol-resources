"use client";

import { useRouter } from "next/navigation";

interface MobileActivityDropdownProps {
  unitSlug: string;
  themeId: string;
  currentMode: string;
}

/**
 * Mobile dropdown for switching between activity modes
 * Uses client-side routing to navigate
 */
export function MobileActivityDropdown({
  unitSlug,
  themeId,
  currentMode,
}: MobileActivityDropdownProps) {
  const router = useRouter();

  const handleModeChange = (newMode: string) => {
    router.push(`/vocab/level-1/${unitSlug}/${themeId}/${newMode}`);
  };

  return (
    <select
      className="sm:hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] px-3 py-1.5 text-xs font-medium text-text"
      value={currentMode}
      onChange={(e) => handleModeChange(e.target.value)}
    >
      <option value="wordlist">📄 Word List</option>
      <option value="flashcards">🎴 Flashcards</option>
      <option value="matching">🧩 Matching</option>
      <option value="fillblank">✍️ Fill in Blank</option>
    </select>
  );
}

export default MobileActivityDropdown;
