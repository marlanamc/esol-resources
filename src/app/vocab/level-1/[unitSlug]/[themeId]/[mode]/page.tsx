import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getLevel1PublicVocabUnit,
  getLevel1PublicVocabTheme,
  LEVEL1_PUBLIC_VOCAB_UNITS,
  type VocabTheme,
} from "@/data/public-level1-vocab";
import { vocabImages } from "@/data/vocab-images";
import { getUnitMatchingAvailability } from "@/lib/public-level1-unit-matching";
import { FlashcardsActivityWrapper } from "@/components/public-vocab/FlashcardsActivityWrapper";
import { WordListActivityWrapper } from "@/components/public-vocab/WordListActivityWrapper";
import { FillInBlankActivityWrapper } from "@/components/public-vocab/FillInBlankActivityWrapper";
import { MatchingActivityWrapper } from "@/components/public-vocab/MatchingActivityWrapper";
import { ThemeActivityShell } from "@/components/public-vocab/ThemeActivityShell";

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

  const theme: VocabTheme = {
    ...rawTheme,
    cards: rawTheme.cards.map((card) => ({
      ...card,
      imageUrl: vocabImages[card.term],
    })),
  };

  const { hasPlayableUnitMatching } = getUnitMatchingAvailability(unit);

  return (
    <ThemeActivityShell
      unitSlug={unitSlug}
      themeId={themeId}
      themeTitle={theme.title}
      urlMode={mode}
      unitGameAvailable={hasPlayableUnitMatching}
    >
      {mode === "wordlist" && <WordListActivityWrapper theme={theme} unitSlug={unitSlug} />}
      {mode === "flashcards" && <FlashcardsActivityWrapper theme={theme} unitSlug={unitSlug} />}
      {mode === "fillblank" && <FillInBlankActivityWrapper theme={theme} unitSlug={unitSlug} />}
      {mode === "matching" && <MatchingActivityWrapper theme={theme} unitSlug={unitSlug} />}
    </ThemeActivityShell>
  );
}
