import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLevel1PublicVocabUnit,
  getLevel1PublicVocabTheme,
  LEVEL1_PUBLIC_VOCAB_UNITS,
  type VocabTheme,
} from "@/data/public-level1-vocab";
import { vocabImages } from "@/data/vocab-images";
import { FlashcardsActivityWrapper } from "@/components/public-vocab/FlashcardsActivityWrapper";
import { WordListActivityWrapper } from "@/components/public-vocab/WordListActivityWrapper";
import { FillInBlankActivityWrapper } from "@/components/public-vocab/FillInBlankActivityWrapper";
import { MatchingActivityWrapper } from "@/components/public-vocab/MatchingActivityWrapper";
import { MobileActivityDropdown } from "@/components/public-vocab/MobileActivityDropdown";

interface Props {
  params: Promise<{
    unitSlug: string;
    themeId: string;
    mode: string;
  }>;
}

const VALID_MODES = ["wordlist", "flashcards", "matching", "fillblank"] as const;
type ValidMode = (typeof VALID_MODES)[number];

function isValidMode(mode: string): mode is ValidMode {
  return VALID_MODES.includes(mode as ValidMode);
}

export async function generateStaticParams() {
  const params: Array<{ unitSlug: string; themeId: string; mode: string }> = [];

  for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
    if (unit.themes) {
      for (const theme of unit.themes) {
        for (const mode of VALID_MODES) {
          params.push({
            unitSlug: unit.slug,
            themeId: theme.id,
            mode,
          });
        }
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unitSlug, themeId, mode } = await params;
  const unit = getLevel1PublicVocabUnit(unitSlug);
  const theme = getLevel1PublicVocabTheme(unitSlug, themeId);

  if (!unit || !theme) {
    return { title: "Level 1 Vocabulary" };
  }

  const modeTitle = mode.charAt(0).toUpperCase() + mode.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2");
  const modePhrase =
    mode === "matching" ? "picture-to-word matching" : modeTitle.toLowerCase();

  return {
    title: `${theme.title} - ${modeTitle} | ${unit.title}`,
    description: `Practice ${theme.title} vocabulary with ${modePhrase}. ${theme.cards.length} words from ${unit.title}.`,
  };
}

export default async function ThemeActivityPage({ params }: Props) {
  const { unitSlug, themeId, mode } = await params;

  if (!isValidMode(mode)) {
    notFound();
  }

  const unit = getLevel1PublicVocabUnit(unitSlug);
  const rawTheme = getLevel1PublicVocabTheme(unitSlug, themeId);

  if (!unit || !rawTheme) {
    notFound();
  }

  // Enrich cards from vocab-images (generated + optional overrides).
  // Abstract words may have no image URL.
  const theme: VocabTheme = {
    ...rawTheme,
    cards: rawTheme.cards.map((card) => ({
      ...card,
      imageUrl: vocabImages[card.term],
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Activity Mode Tabs - Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Link */}
            <Link
              href="/vocab/level-1"
              className="flex items-center gap-2 text-sm font-medium text-[var(--tone-vocabulary-accent-strong)] transition hover:gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="hidden sm:inline">Back to units</span>
              <span className="sm:hidden">Back</span>
            </Link>

            {/* Theme Title */}
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>{theme.icon}</span>
              <span className="hidden text-sm font-bold text-text sm:inline">{theme.title}</span>
            </div>

            {/* Mode Tabs - Mobile: Dropdown, Desktop: Inline */}
            <div className="flex items-center gap-2">
              {/* Desktop Tabs */}
              <div className="hidden gap-1 sm:flex">
                <Link
                  href={`/vocab/level-1/${unitSlug}/${themeId}/wordlist`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    mode === "wordlist"
                      ? "bg-[var(--tone-vocabulary-accent)] text-white"
                      : "text-text-muted hover:bg-[var(--color-bg-light)] hover:text-text"
                  }`}
                >
                  📄 List
                </Link>
                <Link
                  href={`/vocab/level-1/${unitSlug}/${themeId}/flashcards`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    mode === "flashcards"
                      ? "bg-[var(--tone-vocabulary-accent)] text-white"
                      : "text-text-muted hover:bg-[var(--color-bg-light)] hover:text-text"
                  }`}
                >
                  🎴 Cards
                </Link>
                <Link
                  href={`/vocab/level-1/${unitSlug}/${themeId}/matching`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    mode === "matching"
                      ? "bg-[var(--tone-vocabulary-accent)] text-white"
                      : "text-text-muted hover:bg-[var(--color-bg-light)] hover:text-text"
                  }`}
                >
                  🧩 Match
                </Link>
                <Link
                  href={`/vocab/level-1/${unitSlug}/${themeId}/fillblank`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    mode === "fillblank"
                      ? "bg-[var(--tone-vocabulary-accent)] text-white"
                      : "text-text-muted hover:bg-[var(--color-bg-light)] hover:text-text"
                  }`}
                >
                  ✍️ Fill
                </Link>
              </div>

              {/* Mobile Dropdown */}
              <MobileActivityDropdown unitSlug={unitSlug} themeId={themeId} currentMode={mode} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="pb-8">
        {mode === "flashcards" && (
          <FlashcardsActivityWrapper theme={theme} unitSlug={unitSlug} />
        )}
        {mode === "wordlist" && (
          <WordListActivityWrapper theme={theme} unitSlug={unitSlug} />
        )}
        {mode === "matching" && <MatchingActivityWrapper theme={theme} unitSlug={unitSlug} />}
        {mode === "fillblank" && (
          <FillInBlankActivityWrapper theme={theme} unitSlug={unitSlug} />
        )}
      </div>
    </div>
  );
}
