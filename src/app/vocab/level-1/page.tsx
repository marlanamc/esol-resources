import Link from "next/link";
import type { Metadata } from "next";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";

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
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEVEL1_PUBLIC_VOCAB_UNITS.map((unit) => {
            const themeCount = unit.themes?.length || 0;
            const hasThemes = themeCount > 0;

            return (
              <Link
                key={unit.slug}
                href={`/vocab/level-1/${unit.slug}`}
                className="group relative rounded-[1.5rem] border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--tone-vocabulary-accent)]/50 hover:shadow-lg"
              >
                {/* Unit Number Badge */}
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--tone-vocabulary-chip-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--tone-vocabulary-chip-text)]">
                  {unit.slug.replace(/-/g, " ")}
                </div>

                {/* Title */}
                <h2 className="font-display text-xl font-bold text-text transition-colors group-hover:text-[var(--tone-vocabulary-accent-strong)] sm:text-2xl">
                  {unit.title.replace(/^Unit \d+:\s*/, "")}
                </h2>

                {/* Theme Description */}
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {unit.theme}
                </p>

                {/* Stats */}
                <div className="mt-5 flex items-center gap-4 border-t border-[var(--color-border-subtle)] pt-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl" aria-hidden>📖</span>
                    <span className="font-semibold tabular-nums text-[var(--tone-vocabulary-accent-strong)]">
                      {unit.totalCards}
                    </span>
                    <span className="text-text-muted">words</span>
                  </div>
                  {hasThemes && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl" aria-hidden>🎯</span>
                      <span className="font-semibold tabular-nums text-[var(--tone-vocabulary-accent-strong)]">
                        {themeCount}
                      </span>
                      <span className="text-text-muted">
                        {themeCount === 1 ? "theme" : "themes"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 text-[var(--tone-vocabulary-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
