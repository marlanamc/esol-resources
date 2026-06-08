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
import {
  buildVocabLibraryHref,
  filterVocabLibraryCards,
  parseVocabLibrarySort,
  resolveVocabLibraryTopicSlug,
  sortVocabLibraryCards,
} from "@/lib/vocab/library";
import {
  VocabLibraryTopicChip,
  buildTopicChipHref,
} from "@/components/vocab-library/VocabLibraryTopicChip";
import { VocabLibraryWordCard } from "@/components/vocab-library/VocabLibraryWordCard";
import { hasVocabAudioFile } from "@/lib/vocab-audio-available";

type PageProps = {
  searchParams: Promise<{ topic?: string; sort?: string }>;
};

export default async function VocabLibraryPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const { topic: rawTopic, sort: rawSort } = await searchParams;
  const selectedSlug = resolveVocabLibraryTopicSlug(rawTopic);
  const selectedTopic = selectedSlug ? getVocabLibraryTopic(selectedSlug) : null;
  const sort = parseVocabLibrarySort(rawSort);
  const isAllView = !selectedSlug;

  const allCards = await prisma.vocabCard.findMany({
    select: {
      id: true,
      term: true,
      definition: true,
      example: true,
      pos: true,
      topics: true,
      sortOrder: true,
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

  const visibleWords = sortVocabLibraryCards(
    filterVocabLibraryCards(allCards, selectedSlug),
    sort
  );

  const sectionLabel = isAllView
    ? "All topics"
    : selectedTopic
      ? `Words tagged ${selectedTopic.label}`
      : "Vocabulary";

  return (
    <main
      id="main-content"
      className="mx-auto max-w-5xl space-y-4 px-3 py-4 pb-24 sm:space-y-6 sm:px-4 sm:py-6"
    >
      <header className="space-y-1 sm:space-y-2">
        <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">Vocab Library</h1>
        <p className="text-sm leading-snug text-text/70 sm:text-base sm:leading-normal">
          <span className="sm:hidden">Browse words by real-world topic.</span>
          <span className="hidden sm:inline">
            Browse vocabulary by topic. Words come from across the year — pick a topic
            to focus on real-world language you&apos;ll use.
          </span>
        </p>
      </header>

      <section aria-label="Topics" className="space-y-2 sm:space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text/60 sm:text-sm">
          Topics
        </h2>
        <div className="-mx-3 border-b border-[var(--dashboard-border)]/60 bg-bg/95 px-3 pb-3 backdrop-blur-sm sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:backdrop-blur-none">
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:snap-none">
            <VocabLibraryTopicChip
              href={buildTopicChipHref(null, sort)}
              isActive={isAllView}
              label="All"
              count={allCards.length}
            />
            {VOCAB_LIBRARY_TOPICS.map((t) => (
              <VocabLibraryTopicChip
                key={t.slug}
                href={buildTopicChipHref(t.slug, sort)}
                isActive={t.slug === selectedSlug}
                label={t.label}
                shortLabel={t.shortLabel}
                count={counts[t.slug] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-label={sectionLabel} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          {!isAllView && selectedTopic ? (
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold text-text sm:text-xl">
                {selectedTopic.label}
              </h2>
              <p className="text-sm text-text/60">{selectedTopic.description}</p>
            </div>
          ) : (
            <div className="flex items-baseline justify-between gap-2 sm:block">
              <h2 className="font-display text-lg font-semibold text-text sm:text-xl">
                All words
              </h2>
              <p className="text-xs text-text/60 sm:hidden">
                {visibleWords.length} words
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
            <div
              className="inline-flex rounded-full border border-[var(--dashboard-border)] bg-[var(--dashboard-surface-start)] p-0.5"
              role="group"
              aria-label="Sort words"
            >
              <Link
                href={buildVocabLibraryHref({
                  topic: selectedSlug ?? undefined,
                  sort: "curriculum",
                })}
                aria-current={sort === "curriculum" ? "true" : undefined}
                className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                  sort === "curriculum"
                    ? "bg-primary text-white"
                    : "text-text/70 hover:text-text"
                }`}
              >
                <span className="sm:hidden">By unit</span>
                <span className="hidden sm:inline">Curriculum order</span>
              </Link>
              <Link
                href={buildVocabLibraryHref({
                  topic: selectedSlug ?? undefined,
                  sort: "alpha",
                })}
                aria-current={sort === "alpha" ? "true" : undefined}
                className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                  sort === "alpha"
                    ? "bg-primary text-white"
                    : "text-text/70 hover:text-text"
                }`}
              >
                A–Z
              </Link>
            </div>
            <p className="hidden text-sm text-text/60 sm:block">
              {visibleWords.length} word{visibleWords.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {visibleWords.length === 0 ? (
          <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-surface-start)] p-6 text-center text-sm text-text/70 sm:p-8 sm:text-base">
            {selectedSlug
              ? "No words tagged with this topic yet."
              : "No vocabulary words in the library yet."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 md:gap-6 md:p-0">
            {visibleWords.map((word, index) => {
              const topicLinks = word.topics
                .filter((t) => t !== selectedSlug && isVocabLibraryTopicSlug(t))
                .map((t) => getVocabLibraryTopic(t))
                .filter((t): t is NonNullable<typeof t> => t !== null);

              return (
                <VocabLibraryWordCard
                  key={word.id}
                  index={index}
                  term={word.term}
                  definition={word.definition}
                  example={word.example}
                  pos={word.pos}
                  hasAudio={hasVocabAudioFile(word.term)}
                  topicLinks={topicLinks}
                  sort={sort}
                />
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
