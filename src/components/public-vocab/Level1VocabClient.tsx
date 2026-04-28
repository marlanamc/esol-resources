"use client";

import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { Level1Shell, UnitCard } from "./level1-ui";

interface Level1VocabClientProps {
  units: PublicLevel1VocabularyUnit[];
}

const UNIT_DEFAULT_ICON = "📘";

function unitIcon(unit: PublicLevel1VocabularyUnit): string {
  return unit.themes?.[0]?.icon ?? UNIT_DEFAULT_ICON;
}

function shortTitle(unit: PublicLevel1VocabularyUnit): string {
  // Strip leading "Unit 1:", "Units 6 & 7:", "Units 1-3:", etc.
  return unit.title.replace(/^Units?\s+[\d\s&,\-and]+:\s*/i, "");
}

export function Level1VocabClient({ units }: Level1VocabClientProps) {
  return (
    <Level1Shell eyebrow="Level 1 Vocabulary" wide>
      {/* Hero */}
      <section className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Level 1 Vocabulary
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
          Learn important English words for everyday life.
        </p>
      </section>

      {/* Section label */}
      <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
        Where do you want to start?
      </h2>

      <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <UnitCard
            key={unit.slug}
            title={shortTitle(unit)}
            description={unit.theme}
            icon={unitIcon(unit)}
            topicCount={unit.themes?.length}
            href={`/vocab/level-1/${unit.slug}`}
          />
        ))}
      </div>
    </Level1Shell>
  );
}
