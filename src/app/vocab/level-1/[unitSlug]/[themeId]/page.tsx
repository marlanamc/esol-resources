import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLevel1PublicVocabUnit,
  getLevel1PublicVocabTheme,
  LEVEL1_PUBLIC_VOCAB_UNITS,
} from "@/data/public-level1-vocab";
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

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <Link
            href={`/vocab/level-1/${unitSlug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--tone-vocabulary-accent-strong)] transition hover:gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="hidden sm:inline">Back to {unit.title.replace(/^Unit \d+:\s*/, "")}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ActivityPickerClient
          unitSlug={unitSlug}
          themeId={themeId}
          themeTitle={theme.title}
          themeIcon={theme.icon}
        />
      </div>
    </div>
  );
}
