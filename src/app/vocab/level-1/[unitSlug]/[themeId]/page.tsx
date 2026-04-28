import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getLevel1PublicVocabUnit,
  getLevel1PublicVocabTheme,
  LEVEL1_PUBLIC_VOCAB_UNITS,
} from "@/data/public-level1-vocab";
import { getUnitMatchingAvailability } from "@/lib/public-level1-unit-matching";
import { ActivityPickerClient } from "@/components/public-vocab/ActivityPickerClient";

interface Props {
  params: Promise<{ unitSlug: string; themeId: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ unitSlug: string; themeId: string }> = [];

  for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
    if (unit.themes) {
      for (const theme of unit.themes) {
        params.push({ unitSlug: unit.slug, themeId: theme.id });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unitSlug, themeId } = await params;
  const unit = getLevel1PublicVocabUnit(unitSlug);
  const theme = getLevel1PublicVocabTheme(unitSlug, themeId);

  if (!unit || !theme) {
    return { title: "Level 1 Vocabulary" };
  }

  return {
    title: `${theme.title} - Activities | ${unit.title}`,
    description: `Practice ${theme.title} with word list, flashcards, picture-to-word matching, and fill-in-the-blank. ${theme.cards.length} words.`,
  };
}

export default async function ThemeActivityPickerPage({ params }: Props) {
  const { unitSlug, themeId } = await params;

  const unit = getLevel1PublicVocabUnit(unitSlug);
  const theme = getLevel1PublicVocabTheme(unitSlug, themeId);

  if (!unit || !theme) {
    notFound();
  }

  const { hasPlayableUnitMatching } = getUnitMatchingAvailability(unit);

  return (
    <ActivityPickerClient
      unitSlug={unitSlug}
      themeId={themeId}
      themeTitle={theme.title}
      themeIcon={theme.icon}
      unitGameAvailable={hasPlayableUnitMatching}
    />
  );
}
