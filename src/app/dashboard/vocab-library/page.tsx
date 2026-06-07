import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  VOCAB_LIBRARY_TOPICS,
  getVocabLibraryTopic,
  isVocabLibraryTopicSlug,
} from "@/lib/vocab/library-topics";

type PageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function VocabLibraryPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const { topic: rawTopic } = await searchParams;
  const selectedSlug =
    rawTopic && isVocabLibraryTopicSlug(rawTopic) ? rawTopic : null;
  const selectedTopic = selectedSlug ? getVocabLibraryTopic(selectedSlug) : null;

  const allCards = await prisma.vocabCard.findMany({
    select: {
      id: true,
      term: true,
      definition: true,
      example: true,
      topics: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  const counts: Record<string, number> = {};
  for (const t of VOCAB_LIBRARY_TOPICS) counts[t.slug] = 0;
  for (const card of allCards) {
    for (const t of card.topics) {
      if (counts[t] !== undefined) counts[t]++;
    }
  }

  const visibleWords = selectedSlug
    ? allCards.filter((c) => c.topics.includes(selectedSlug))
    : [];

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-4 py-6 pb-24 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-text">Vocab Library</h1>
        <p className="text-text/70">
          Browse vocabulary by topic. Words come from across the year — pick a topic
          to focus on real-world language you&apos;ll use.
        </p>
      </header>

      <section aria-label="Topics" className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-text/60 font-semibold">
          Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {VOCAB_LIBRARY_TOPICS.map((t) => {
            const isActive = t.slug === selectedSlug;
            const count = counts[t.slug] ?? 0;
            return (
              <Link
                key={t.slug}
                href={isActive ? "/dashboard/vocab-library" : `/dashboard/vocab-library?topic=${t.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-[var(--dashboard-surface-start)] text-text border-[var(--dashboard-border)] hover:brightness-95"
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs ${
                    isActive ? "bg-white/20" : "bg-bg-light text-text/70"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {!selectedSlug && (
        <section className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface-start)] p-8 text-center text-text/70">
          <p className="text-base">
            Pick a topic above to see the words in that category.
          </p>
        </section>
      )}

      {selectedSlug && selectedTopic && (
        <section aria-label={`Words tagged ${selectedTopic.label}`} className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-xl font-display font-semibold text-text">
                {selectedTopic.label}
              </h2>
              <p className="text-sm text-text/60">{selectedTopic.description}</p>
            </div>
            <p className="text-sm text-text/60">
              {visibleWords.length} word{visibleWords.length === 1 ? "" : "s"}
            </p>
          </div>

          {visibleWords.length === 0 ? (
            <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface-start)] p-8 text-center text-text/70">
              No words tagged with this topic yet.
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {visibleWords.map((word) => (
                <li
                  key={word.id}
                  className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface-start)] p-4 space-y-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-display font-semibold text-text">
                      {word.term}
                    </h3>
                  </div>
                  <p className="text-sm text-text/80">{word.definition}</p>
                  {word.example && (
                    <p className="text-sm text-text/60 italic">&ldquo;{word.example}&rdquo;</p>
                  )}
                  {word.topics.length > 1 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {word.topics
                        .filter((t) => t !== selectedSlug && isVocabLibraryTopicSlug(t))
                        .map((t) => {
                          const otherTopic = getVocabLibraryTopic(t);
                          if (!otherTopic) return null;
                          return (
                            <Link
                              key={t}
                              href={`/dashboard/vocab-library?topic=${t}`}
                              className="text-xs px-2 py-0.5 rounded-full bg-bg-light text-text/70 hover:bg-bg hover:brightness-95"
                            >
                              {otherTopic.label}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
