import { notFound } from "next/navigation";
import {
  getLevel1PublicVocabUnit,
  LEVEL1_PUBLIC_VOCAB_UNITS,
} from "@/data/public-level1-vocab";
import { vocabImages } from "@/data/vocab-images";
import { UnitMatchingShellClient } from "@/components/public-vocab/UnitMatchingShellClient";
import { Level1Shell } from "@/components/public-vocab/level1-ui";

interface Props {
  params: Promise<{
    unitSlug: string;
  }>;
}

export async function generateStaticParams() {
  return LEVEL1_PUBLIC_VOCAB_UNITS.map((unit) => ({
    unitSlug: unit.slug,
  }));
}

export default async function UnitMatchingPage({ params }: Props) {
  const { unitSlug } = await params;
  const unit = await getLevel1PublicVocabUnit(unitSlug);

  if (!unit) {
    notFound();
  }

  // Enrich with images so the game has pictures to render.
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

  const shortTitle = unit.title.replace(/^Units?\s+[\d\s&,\-and]+:\s*/i, "");

  return (
    <Level1Shell
      backHref={`/vocab/level-1/${unitSlug}`}
      backLabel="Back to topics"
      eyebrow={shortTitle}
    >
      {/* Hero */}
      <section className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#763473]">
          Review Game
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Match pictures and words
        </h1>
      </section>

      <UnitMatchingShellClient unit={enrichedUnit} />
    </Level1Shell>
  );
}
