import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLevel1PublicVocabUnit, LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";
import { vocabImages } from "@/data/vocab-images";
import { PublicVocabularyClient } from "@/components/public-vocab/PublicVocabularyClient";
import { UnitTopicsClient } from "@/components/public-vocab/UnitTopicsClient";

interface Props {
  params: Promise<{ unitSlug: string }>;
}

export async function generateStaticParams() {
  return LEVEL1_PUBLIC_VOCAB_UNITS.map((unit) => ({ unitSlug: unit.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unitSlug } = await params;
  const unit = getLevel1PublicVocabUnit(unitSlug);

  if (!unit) {
    return { title: "Level 1 Vocabulary | ESOL Teacher Resources" };
  }

  return {
    title: `${unit.title} - Free Vocabulary Practice`,
    description: `Practice ${unit.theme} vocabulary with flashcards, picture-to-word matching, and fill-in-the-blank exercises. ${unit.totalCards} words with audio pronunciation.`,
  };
}

export default async function Level1VocabularyUnitPage({ params }: Props) {
  const { unitSlug } = await params;
  const unit = getLevel1PublicVocabUnit(unitSlug);

  if (!unit) {
    notFound();
  }

  const hasThemes = unit.themes && unit.themes.length > 0;

  // Enrich cards with photos from vocab-images.
  const enrichedUnit = {
    ...unit,
    categories: unit.categories.map((cat) => ({
      ...cat,
      cards: cat.cards.map((card) => ({
        ...card,
        imageUrl: vocabImages[card.term],
      })),
    })),
    themes: unit.themes?.map((theme) => ({
      ...theme,
      cards: theme.cards.map((card) => ({
        ...card,
        imageUrl: vocabImages[card.term],
      })),
    })),
  };

  if (!hasThemes) {
    // Legacy fallback for units without themes.
    return <PublicVocabularyClient unit={enrichedUnit} />;
  }

  return <UnitTopicsClient unit={enrichedUnit} />;
}
