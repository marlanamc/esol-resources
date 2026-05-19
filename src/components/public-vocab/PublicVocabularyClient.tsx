"use client";

import Link from "next/link";
import { useState } from "react";
import FlashcardCarousel from "@/components/games/FlashcardCarousel";
import { VocabWordImage } from "@/components/public-vocab/VocabWordImage";
import { ImageWordMatchingGame, type ImageWordPair } from "@/components/public-vocab/ImageWordMatchingGame";
import type { PublicLevel1VocabularyUnit } from "@/data/public-level1-vocab";
import { Level1AudioSpeedToggle } from "@/components/public-vocab/level1-ui/Level1AudioSpeedToggle";
import { useLevel1AudioSpeedOptional } from "@/components/public-vocab/level1-ui/Level1AudioSpeedContext";
import { applyLevel1VocabPlaybackRate, playLevel1VocabAudio } from "@/lib/level1-vocab-audio";
import { generateLevel1FillBlankOptions } from "@/lib/level1-fill-blank-options";

type PublicVocabMode = "word-list" | "flashcards" | "matching" | "fill-blank";
type FillBlankSentence = {
  id: string;
  text: string;
  correctAnswers: string[];
  options: string[];
  explanation?: string;
};
type CategoryOption = {
  label: string;
  spanishLabel: string;
  count: number;
};

const VIEW_ALL = "__all__";

function PublicVocabStepLabel({ step, label, id }: { step: number; label: string; id?: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-white">
        {step}
      </span>
      <span id={id} className="text-xs font-black uppercase tracking-[0.18em] text-text-muted/80">
        {label}
      </span>
    </div>
  );
}

const MODE_CARDS: Array<{
  id: PublicVocabMode;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  accentColor: string;
  iconBg: string;
  borderHover: string;
  ringColor: string;
}> = [
  {
    id: "word-list",
    title: "Word List",
    description: "Review the whole unit or focus on one category.",
    icon: "📄",
    gradient: "from-white to-amber-50/80",
    accentColor: "bg-amber-500",
    iconBg: "bg-amber-100",
    borderHover: "hover:border-amber-300",
    ringColor: "focus-visible:ring-amber-400",
  },
  {
    id: "flashcards",
    title: "Flash Cards",
    description: "Study the full unit first, then switch by category if needed.",
    icon: "🎴",
    gradient: "from-white to-rose-50/80",
    accentColor: "bg-rose-500",
    iconBg: "bg-rose-100",
    borderHover: "hover:border-rose-300",
    ringColor: "focus-visible:ring-rose-400",
  },
  {
    id: "matching",
    title: "Matching",
    description: "Match pictures to English words in one category at a time.",
    icon: "🧩",
    gradient: "from-white to-emerald-50/80",
    accentColor: "bg-emerald-500",
    iconBg: "bg-emerald-100",
    borderHover: "hover:border-emerald-300",
    ringColor: "focus-visible:ring-emerald-400",
  },
  {
    id: "fill-blank",
    title: "Fill in the Blank",
    description: "Practice short category chunks with sentence support.",
    icon: "✍️",
    gradient: "from-white to-violet-50/80",
    accentColor: "bg-violet-500",
    iconBg: "bg-violet-100",
    borderHover: "hover:border-violet-300",
    ringColor: "focus-visible:ring-violet-400",
  },
];

export function PublicVocabularyClient({ unit }: { unit: PublicLevel1VocabularyUnit }) {
  const [mode, setMode] = useState<PublicVocabMode>("word-list");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(VIEW_ALL);
  const categoryOptions = unit.categories.map((group) => ({
    label: group.label,
    spanishLabel: group.spanishLabel,
    count: group.cards.length,
  }));

  const selectedCategoryGroup =
    selectedCategory && selectedCategory !== VIEW_ALL
      ? unit.categories.find((group) => group.label === selectedCategory) ?? null
      : null;

  const categoryMatchingPairs: ImageWordPair[] = selectedCategoryGroup
    ? selectedCategoryGroup.cards.reduce<ImageWordPair[]>((acc, card) => {
        if (!card.imageUrl) return acc;
        acc.push({
          id: acc.length + 1,
          term: card.term,
          imageUrl: card.imageUrl,
        });
        return acc;
      }, [])
    : [];

  const wordListUnit = selectedCategoryGroup
    ? { ...unit, categories: [selectedCategoryGroup], totalCards: selectedCategoryGroup.cards.length }
    : unit;
  const flashcardUnit = selectedCategoryGroup
    ? { ...unit, categories: [selectedCategoryGroup], totalCards: selectedCategoryGroup.cards.length }
    : unit;

  const categoryFillBlankSentences: FillBlankSentence[] = selectedCategoryGroup
    ? (() => {
        const distractorUseCount = new Map<string, number>();
        const cardsWithCategory = selectedCategoryGroup.cards.map((card) => ({
          term: card.term,
          category: selectedCategoryGroup.label,
        }));
        return selectedCategoryGroup.cards.map((card, index) => {
          const answerDisplay = extractMatchedTermVariant(card.example, card.term) ?? card.term;
          const blankedExample = replaceTermWithBlank(card.example, card.term);
          const rawOptions = generateLevel1FillBlankOptions(
            { term: card.term, category: selectedCategoryGroup.label },
            cardsWithCategory,
            blankedExample,
            `${unit.slug}:${selectedCategoryGroup.label}:${index}:${card.term}`,
            distractorUseCount
          );
          const options = rawOptions.map((option) =>
            option === card.term ? answerDisplay : applyTermCaseTemplate(option, answerDisplay)
          );
          return {
            id: `${slugifyLabel(selectedCategoryGroup.label)}-blank-${index + 1}`,
            text: blankedExample,
            correctAnswers: [answerDisplay],
            options,
            explanation: `${card.englishDefinition} / ${card.spanishDefinition}`,
          };
        });
      })()
    : [];

  const isStudyMode = mode === "word-list" || mode === "flashcards";
  const needsExactCategory = mode === "matching" || mode === "fill-blank";

  const categoryForUi = isStudyMode ? (selectedCategory ?? VIEW_ALL) : (selectedCategory ?? "");

  const canShowPractice =
    isStudyMode ||
    (needsExactCategory && selectedCategory !== null && selectedCategory !== VIEW_ALL);

  const handleModeChange = (nextMode: PublicVocabMode) => {
    setMode(nextMode);
    if (nextMode === "matching" || nextMode === "fill-blank") {
      if (selectedCategory === VIEW_ALL) {
        setSelectedCategory(null);
      }
    } else if (selectedCategory === null) {
      setSelectedCategory(VIEW_ALL);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="relative mb-4 overflow-hidden rounded-[2rem] border border-[var(--tone-vocabulary-border)] bg-gradient-to-br from-[var(--tone-vocabulary-surface)] to-[var(--color-surface-contrast)] px-4 py-5 shadow-[0_10px_30px_rgba(38,138,130,0.10)] sm:px-7 sm:py-6">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--tone-vocabulary-accent) 35%, transparent), transparent 70%)" }}
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="absolute right-0 top-0 sm:relative sm:order-2 sm:shrink-0">
              <Level1AudioSpeedToggle />
            </div>
            <div className="space-y-3 sm:order-1 sm:pr-36">
              <Link
                href="/vocab/level-1"
                className="inline-flex items-center rounded-full border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] px-4 py-2 text-sm font-semibold text-[var(--tone-vocabulary-accent-strong)] shadow-sm transition hover:bg-[var(--tone-vocabulary-surface-muted)]"
              >
                ← Back to Level 1
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tone-vocabulary-accent)]/35 bg-[var(--tone-vocabulary-chip-bg)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--tone-vocabulary-chip-text)]">
                <span aria-hidden>📚</span>
                Free preview · Vocabulary practice
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">{unit.title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
                  {unit.theme}. Same practice as class activities — open access, progress not saved.
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-full border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] px-4 py-2 text-sm font-semibold text-[var(--tone-vocabulary-accent-strong)] shadow-sm tabular-nums">
              {unit.totalCards} words
            </div>
          </div>
        </header>

        <div className="rounded-[2rem] border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] p-4 shadow-[var(--shadow-lg)] sm:p-6 md:p-8">
          <p className="mb-8 text-sm leading-relaxed text-text-muted">
            Pick your words and activity below — it works like the timeline tenses menu: all steps stay on one page, and the practice area updates when you change a choice.
          </p>

          <div className="space-y-10">
            <section aria-labelledby="public-vocab-step-words">
              <PublicVocabStepLabel id="public-vocab-step-words" step={1} label="Choose words" />
              <p className="-mt-2 mb-4 text-sm font-medium text-text-muted">
                {isStudyMode
                  ? "Use the full unit or narrow to one topic."
                  : "Matching and fill-in-the-blank use one topic at a time (no “view all”)."}
              </p>
              <CategorySwitcher
                categories={categoryOptions}
                selectedCategory={categoryForUi}
                onSelectCategory={setSelectedCategory}
                includeViewAll={isStudyMode}
                modeLabel="Words"
                title={isStudyMode ? "Topics in this unit" : "Pick a topic for this activity"}
                totalUnitWords={unit.totalCards}
              />
            </section>

            <section aria-labelledby="public-vocab-step-activity">
              <PublicVocabStepLabel id="public-vocab-step-activity" step={2} label="Choose activity" />
              <p className="-mt-2 mb-4 text-sm font-medium text-text-muted">
                Same four modes students see in class — switch anytime; your topic choice above is kept when it can be.
              </p>
              <ModeSwitchRow mode={mode} onSelectMode={handleModeChange} />
            </section>

            <section aria-labelledby="public-vocab-step-practice">
              <PublicVocabStepLabel id="public-vocab-step-practice" step={3} label="Practice" />
              <p className="-mt-2 mb-4 text-sm font-medium text-text-muted">
                {canShowPractice ? "Your set updates from steps 1 and 2." : "Choose a topic in step 1 to load this game."}
              </p>

              {canShowPractice ? (
                <div className="space-y-6">
                  {mode === "word-list" ? (
                    <WordListMode unit={wordListUnit} />
                  ) : mode === "flashcards" ? (
                    <FlashcardsMode unit={flashcardUnit} />
                  ) : mode === "matching" ? (
                    <ImageWordMatchingGame
                      pairs={categoryMatchingPairs}
                      pairSignature={
                        selectedCategoryGroup
                          ? `${selectedCategoryGroup.label}:${categoryMatchingPairs.map((p) => p.term).join("|")}`
                          : ""
                      }
                    />
                  ) : (
                    <FillBlankMode sentences={categoryFillBlankSentences} />
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-surface-muted)] px-5 py-10 text-center">
                  <p className="text-sm font-medium text-text">
                    Select a topic in step 1 to start {mode === "matching" ? "matching" : "fill-in-the-blank"}.
                  </p>
                  <p className="mt-2 text-sm text-text-muted">
                    These modes stay small on purpose — pick one group (for example Personal Information or Pronouns).
                  </p>
                </div>
              )}
            </section>
          </div>

          <div className="mt-10 hidden border-t border-[var(--tone-vocabulary-border)] pt-6 md:block">
            <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-r from-accent-light/30 to-accent/20 p-5 dark:from-amber-900/30 dark:to-amber-800/20 dark:border-amber-700/50">
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-accent/20 blur-xl" />
              <div className="relative flex flex-row items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/30 dark:bg-amber-800/50">
                  <span className="text-lg" aria-hidden>
                    💡
                  </span>
                </div>
                <p className="min-w-0 flex-1 text-sm font-medium text-text">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">Students in class</span> open the same activities from their dashboard — log in to save progress and earn points.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function slugifyLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function extractMatchedTermVariant(example: string, term: string): string | null {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "i");
  const match = example.match(pattern);
  return match?.[0] ?? null;
}

function applyTermCaseTemplate(candidate: string, template: string): string {
  if (template === template.toLowerCase()) return candidate.toLowerCase();
  if (template === template.toUpperCase()) return candidate.toUpperCase();
  return candidate;
}

function replaceTermWithBlank(example: string, term: string): string {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "i");
  if (pattern.test(example)) {
    return example.replace(pattern, "_____");
  }
  return example;
}

function ModeSwitchRow({
  mode,
  onSelectMode,
}: {
  mode: PublicVocabMode;
  onSelectMode: (mode: PublicVocabMode) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-surface-muted)] p-2">
      <div className="flex flex-wrap gap-1.5 sm:gap-2" role="tablist" aria-label="Practice mode">
        {MODE_CARDS.map((item) => {
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectMode(item.id)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                active
                  ? "bg-primary text-white shadow-sm dark:bg-primary"
                  : "border border-transparent bg-[var(--color-surface-contrast)] text-text-muted hover:border-[var(--tone-vocabulary-border)] hover:text-text"
              }`}
            >
              <span aria-hidden className="text-base leading-none">
                {item.icon}
              </span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategorySwitcher({
  categories,
  selectedCategory,
  onSelectCategory,
  includeViewAll = false,
  title,
  modeLabel,
  totalUnitWords,
}: {
  categories: CategoryOption[];
  /** `""` means no topic selected (e.g. matching mode before picking). */
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  includeViewAll?: boolean;
  title: string;
  modeLabel: string;
  totalUnitWords: number;
}) {
  const selectedMeta =
    selectedCategory === VIEW_ALL
      ? { label: "View All", spanish: "Ver todo", wordCount: totalUnitWords }
      : selectedCategory
        ? (() => {
            const c = categories.find((x) => x.label === selectedCategory);
            return c ? { label: c.label, spanish: c.spanishLabel, wordCount: c.count } : null;
          })()
        : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--tone-vocabulary-chip-text)]">{modeLabel}</p>
          <p className="mt-1 text-sm font-medium text-text">{title}</p>
        </div>
        {selectedMeta ? (
          <p className="text-sm text-text-muted">
            <span className="font-semibold text-text">{selectedMeta.label}</span>
            <span className="text-text-muted"> · {selectedMeta.spanish}</span>
            <span className="ml-2 inline-flex rounded-full border border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-chip-bg)] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[var(--tone-vocabulary-chip-text)]">
              {selectedMeta.wordCount} words
            </span>
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {includeViewAll ? (
          <CategoryChip
            label="View All"
            spanishLabel="Ver todo"
            count={0}
            active={selectedCategory === VIEW_ALL}
            onClick={() => onSelectCategory(VIEW_ALL)}
            compactMeta="Full unit"
          />
        ) : null}
        {categories.map((category) => (
          <CategoryChip
            key={category.label}
            label={category.label}
            spanishLabel={category.spanishLabel}
            count={category.count}
            active={selectedCategory === category.label}
            onClick={() => onSelectCategory(category.label)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  spanishLabel,
  count,
  active,
  onClick,
  compactMeta,
}: {
  label: string;
  spanishLabel: string;
  count: number;
  active: boolean;
  onClick: () => void;
  compactMeta?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`w-full min-w-0 rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-[var(--tone-vocabulary-accent-strong)] bg-[var(--tone-vocabulary-surface)] ring-2 ring-[color:var(--tone-vocabulary-accent)]/35 dark:bg-[var(--tone-vocabulary-surface-muted)]"
          : "border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] text-text hover:border-[var(--tone-vocabulary-accent)]/50 hover:bg-[var(--tone-vocabulary-surface-muted)]"
      }`}
    >
      <p className={`text-sm font-semibold ${active ? "text-[var(--tone-vocabulary-accent-strong)]" : "text-text"}`}>{label}</p>
      <p className={`mt-1 text-xs ${active ? "text-[var(--tone-vocabulary-chip-text)]" : "text-text-muted"}`}>{spanishLabel}</p>
      <p className={`mt-2 text-xs font-medium ${active ? "text-[var(--tone-vocabulary-chip-text)]" : "text-text-muted"}`}>
        {compactMeta ?? `${count} words`}
      </p>
    </button>
  );
}

function WordListMode({ unit }: { unit: PublicLevel1VocabularyUnit }) {
  const level1Audio = useLevel1AudioSpeedOptional();

  const playWordListAudio = (term: string) => {
    const speed = level1Audio?.speed ?? "normal";
    const audio = playLevel1VocabAudio(term, speed);
    const startPlayback = () => {
      applyLevel1VocabPlaybackRate(audio, speed);
      void audio.play().catch(() => {
        // Missing file or autoplay restrictions
      });
    };
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      startPlayback();
    } else {
      audio.addEventListener("loadedmetadata", startPlayback, { once: true });
      audio.load();
    }
  };

  return (
    <div className="space-y-8">
      {unit.categories.map((group) => (
        <section
          key={group.label}
          className="rounded-2xl border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] p-5 shadow-[var(--shadow-md)] sm:p-6"
        >
          <div className="flex flex-col gap-2 border-b border-[var(--tone-vocabulary-border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">{group.label}</h2>
              <p className="mt-1 text-base text-text-muted">{group.spanishLabel}</p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-[var(--tone-vocabulary-border)] bg-[var(--tone-vocabulary-chip-bg)] px-3 py-1 text-xs font-semibold tabular-nums text-[var(--tone-vocabulary-chip-text)]">
              {group.cards.length} {group.cards.length === 1 ? "word" : "words"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {group.cards.map((card, idx) => (
              <article
                key={`${group.label}-${card.term}`}
                className="group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-contrast)] p-4 shadow-sm transition-[box-shadow,border-color,transform] duration-300 hover:border-[var(--tone-vocabulary-accent)]/40 hover:shadow-lg md:rounded-2xl md:p-6 md:hover:-translate-y-0.5"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 hidden h-32 w-32 rounded-full bg-[var(--tone-vocabulary-accent)]/10 transition-transform duration-500 group-hover:scale-150 md:block"
                  aria-hidden
                />

                <div className="hidden md:flex absolute right-0 top-0 justify-end p-4">
                  <span className="select-none font-black tabular-nums text-5xl leading-none text-[var(--color-bg-light)] transition-colors group-hover:text-[var(--tone-vocabulary-accent)]/15 dark:text-white/10">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="mb-3 flex flex-wrap items-baseline gap-2 md:gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-2xl font-bold tracking-tight text-text md:text-3xl">{card.term}</h3>
                      <button
                        type="button"
                        onClick={() => playWordListAudio(card.term)}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--color-bg-light)] p-2 text-text-muted shadow-sm transition hover:bg-[var(--color-border-subtle)] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                        aria-label={`Play pronunciation for ${card.term}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden
                        >
                          <path d="M11 5L6 9H3v6h3l5 4V5z" />
                          <path d="M15.54 8.46a5 5 0 010 7.07" />
                          <path d="M18.07 5.93a9 9 0 010 12.73" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {card.imageUrl && (
                    <div className="mb-3">
                      <VocabWordImage src={card.imageUrl} alt={card.term} variant="banner" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="rounded-xl border border-primary/35 bg-primary/10 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-primary/40 dark:bg-primary/15 dark:shadow-none md:px-4 md:py-3.5">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">English</p>
                      <p className="text-sm font-medium leading-relaxed text-text md:text-base">{card.englishDefinition}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Español</p>
                      <p className="text-sm leading-relaxed text-text-muted md:text-[15px]">{card.spanishDefinition}</p>
                    </div>

                    {card.example ? (
                      <div className="rounded-lg border border-accent/25 bg-accent-light/35 p-3 dark:border-amber-700/40 dark:bg-amber-900/25 md:p-4">
                        <p className="text-sm italic leading-relaxed text-text-muted">
                          <span className="not-italic font-semibold text-amber-800 dark:text-amber-200">Example: </span>
                          <span className="text-text">&ldquo;{card.example}&rdquo;</span>
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FlashcardsMode({ unit }: { unit: PublicLevel1VocabularyUnit }) {
  const cards = unit.categories.flatMap((group) => group.cards);
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] shadow-[var(--shadow-lg)]">
      <FlashcardCarousel
        cards={cards.map((card, index) => ({
          id: `public-card-${index + 1}`,
          term: card.term,
          definition: `${card.englishDefinition}\nEspañol: ${card.spanishDefinition}`,
          example: card.example,
          imageUrl: card.imageUrl,
        }))}
      />
    </div>
  );
}

function FillBlankMode({ sentences }: { sentences: FillBlankSentence[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const sentence = sentences[index];

  if (!sentence) return null;

  const isComplete = index === sentences.length - 1 && selected !== null;
  const isCorrect = selected !== null && selected === sentence.correctAnswers[0];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] p-5 shadow-[var(--shadow-md)]">
      <div className="mb-5 flex items-center justify-between gap-3 text-sm font-medium text-text-muted">
        <span>
          Question {index + 1} of {sentences.length}
        </span>
        <span className="tabular-nums">
          Score {score} / {sentences.length}
        </span>
      </div>

      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--tone-vocabulary-surface-muted)] p-6">
        <p className="text-2xl font-semibold leading-9 text-text">{sentence.text}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {sentence.options.map((option) => {
            const correct = option === sentence.correctAnswers[0];
            const active = selected === option;
            const answered = selected !== null;
            return (
              <button
                key={`${sentence.id}-${option}`}
                type="button"
                disabled={answered}
                onClick={() => {
                  setSelected(option);
                  if (correct) setScore((value) => value + 1);
                }}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  answered && correct
                    ? "border-secondary/40 bg-secondary/15 text-[var(--secondary-color-dark)] dark:text-secondary"
                    : answered && active && !correct
                      ? "border-[var(--warning-color)]/50 bg-[color-mix(in_srgb,var(--warning-color)_12%,transparent)] text-text"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-surface-contrast)] hover:border-[var(--tone-vocabulary-accent)]/50"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selected ? (
          <div
            className={`mt-5 rounded-2xl border p-4 ${
              isCorrect ? "border-secondary/40 bg-secondary/10" : "border-[var(--warning-color)]/40 bg-[color-mix(in_srgb,var(--warning-color)_10%,transparent)]"
            }`}
          >
            <p className="font-semibold text-text">{isCorrect ? "Correct" : "Not quite"}</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">{sentence.explanation}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setSelected(null);
            setScore(0);
          }}
          className="rounded-full border border-[var(--tone-vocabulary-border)] bg-[var(--color-surface-contrast)] px-4 py-2 text-sm font-semibold text-[var(--tone-vocabulary-accent-strong)] transition hover:bg-[var(--tone-vocabulary-surface-muted)]"
        >
          Restart
        </button>

        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (isComplete) {
              setIndex(0);
              setSelected(null);
              setScore(0);
              return;
            }
            setIndex((value) => value + 1);
            setSelected(null);
          }}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isComplete ? "Start Again" : "Next"}
        </button>
      </div>
    </div>
  );
}
