"use client";

import Link from "next/link";
import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { Level1Shell, GlassCard, TopicCard } from "./level1-ui";
import { getUnitMatchingAvailability } from "@/lib/public-level1-unit-matching";

interface UnitTopicsClientProps {
  unit: PublicLevel1VocabularyUnit;
}

function shortTitle(unit: PublicLevel1VocabularyUnit): string {
  return unit.title.replace(/^Units?\s+[\d\s&,\-and]+:\s*/i, "");
}

export function UnitTopicsClient({ unit }: UnitTopicsClientProps) {
  const themes = unit.themes ?? [];
  const { hasPlayableUnitMatching } = getUnitMatchingAvailability(unit);
  const title = shortTitle(unit);

  return (
    <Level1Shell backHref="/vocab/level-1" backLabel="Back" eyebrow={title}>
      {/* Hero */}
      <section className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
          {unit.theme}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-white/70 px-3 py-1 text-sm font-semibold text-[#0a6b62]">
          <span aria-hidden>📖</span>
          {unit.totalCards} words
        </div>
      </section>

      {/* Topics */}
      <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
        Choose a Topic
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {themes.map((theme) => (
          <TopicCard
            key={theme.id}
            title={theme.title}
            icon={theme.icon}
            wordCount={theme.cards.length}
            href={`/vocab/level-1/${unit.slug}/${theme.id}`}
            description={theme.description}
          />
        ))}
      </div>

      {/* Whole-section review game */}
      {hasPlayableUnitMatching ? (
        <Link
          href={`/vocab/level-1/${unit.slug}/matching`}
          className="mt-5 block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
          aria-label="Play review game"
        >
          <GlassCard
            className="p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,168,0.10), rgba(255,255,255,0.85))",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{ background: "rgba(168,85,168,0.18)" }}
              >
                🎮
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#763473]">
                  Bonus
                </p>
                <p className="mt-0.5 text-base font-bold text-slate-900">
                  Play a review game
                </p>
                <p className="mt-0.5 text-sm text-slate-600">
                  Match pictures and words from all topics
                </p>
              </div>
            </div>
          </GlassCard>
        </Link>
      ) : null}
    </Level1Shell>
  );
}
