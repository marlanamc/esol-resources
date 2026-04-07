import type { Metadata } from "next";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";
import { Level1VocabClient } from "@/components/public-vocab/Level1VocabClient";

export const metadata: Metadata = {
  title: "Level 1 Vocabulary | ESOL Teacher Resources",
  description: "Level 1 English vocabulary practice with audio, flashcards, picture-to-word matching, and fill-in-the-blank exercises.",
};

export default function Level1VocabularyIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--tone-vocabulary-border)] bg-gradient-to-br from-[var(--tone-vocabulary-surface)] to-[var(--color-surface-contrast)] p-8 shadow-[0_10px_30px_rgba(38,138,130,0.10)] sm:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-35"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--tone-vocabulary-accent) 30%, transparent), transparent 70%)" }}
          />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--tone-vocabulary-accent)]/35 bg-[var(--tone-vocabulary-chip-bg)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--tone-vocabulary-chip-text)]">
              <span aria-hidden>📚</span>
              Level 1 Vocabulary
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">
              Level 1 Vocabulary
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
              Choose a unit to get started!
            </p>
          </div>
        </section>

        {/* Units Grid */}
        <Level1VocabClient units={LEVEL1_PUBLIC_VOCAB_UNITS} />

      </div>
    </div>
  );
}
