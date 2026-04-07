import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getLevel1PublicVocabUnit, LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";
import { vocabImages } from "@/data/vocab-images";
import { PublicVocabularyClient } from "@/components/public-vocab/PublicVocabularyClient";

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

  // If unit has themes, show theme selection page
  // Otherwise, fall back to old category-based interface
  const hasThemes = unit.themes && unit.themes.length > 0;

  // Enrich cards with photos from vocab-images (generated + optional overrides). Abstract
  // words may have no URL and show no image.
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
    // Fallback to old interface for units without themes
    return <PublicVocabularyClient unit={enrichedUnit} />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/vocab/level-1"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--tone-vocabulary-accent-strong)] transition hover:gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to all units
        </Link>

        {/* Unit Header */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tone-vocabulary-chip-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--tone-vocabulary-chip-text)]">
            {unit.slug.replace(/-/g, " ")}
          </div>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">
            {unit.title.replace(/^Unit \d+:\s*/, "")}
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-text-muted">
            {unit.theme}
          </p>
          <div className="mt-4 flex items-center gap-6 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>📖</span>
              <span className="text-[var(--tone-vocabulary-accent-strong)]">{unit.totalCards} words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>🎯</span>
              <span className="text-[var(--tone-vocabulary-accent-strong)]">
                {unit.themes?.length || 0} {unit.themes?.length === 1 ? "theme" : "themes"}
              </span>
            </div>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-text-muted">
            Choose a Theme to Practice
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {unit.themes?.map((theme) => (
              <Link
                key={theme.id}
                href={`/vocab/level-1/${unit.slug}/${theme.id}`}
                className="group relative flex min-h-[220px] flex-col rounded-2xl border border-[var(--tone-vocabulary-border)] bg-gradient-to-br from-[var(--color-surface-contrast)] to-[var(--color-surface-base)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--tone-vocabulary-accent)]/50 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--tone-vocabulary-accent)]/20 to-[var(--tone-vocabulary-accent)]/10 text-3xl ring-1 ring-[var(--tone-vocabulary-accent)]/20">
                  {theme.icon}
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-text transition-colors group-hover:text-[var(--tone-vocabulary-accent-strong)]">
                  {theme.title}
                </h3>

                {/* Description */}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                  {theme.description}
                </p>

                {/* Stats */}
                <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4 text-xs font-semibold text-[var(--tone-vocabulary-accent-strong)]">
                  {theme.cards.length} words
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 text-[var(--tone-vocabulary-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
