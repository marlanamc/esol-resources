"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { ContextualBackButton } from "@/components/navigation/ContextualBackButton";
import { PointsToast } from "@/components/ui/PointsToast";
import {
  BE_OR_DO_GROUPS,
  BE_OR_DO_TENSE_HINT,
  beOrDoTense,
  type BeOrDoCard,
  type BeOrDoGroup,
  parseBeOrDoRounds,
} from "./matching-game-parse";
import { GameLiveRegion } from "./shared/GameLiveRegion";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2";

/** Per-family colors. Families added later fall back to the neutral style. */
const GROUP_STYLES: Record<string, { text: string; underline: string }> = {
  be: { text: "text-purple-700 dark:text-purple-300", underline: "decoration-purple-500" },
  do: { text: "text-blue-700 dark:text-blue-300", underline: "decoration-blue-500" },
};
const NEUTRAL_STYLE = { text: "text-[var(--color-text)]", underline: "decoration-[var(--color-text)]" };

function groupStyle(groupId: string) {
  return GROUP_STYLES[groupId] ?? NEUTRAL_STYLE;
}

/** Writes the helper into the blank, capitalized only when it starts the question. */
function fillBlank(question: string, word: string): { before: string; word: string; after: string } {
  const index = question.indexOf("___");
  const before = question.slice(0, index);
  const after = question.slice(index).replace(/^_+/, "");
  const startsQuestion = before.trim() === "";
  const cased = startsQuestion
    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    : word.toLowerCase();
  return { before, word: cased, after };
}

/**
 * The helper a learner "said" by picking the wrong family, so we can show the
 * broken question: "___ you tired?" + DO → "Do you tired?".
 */
function brokenWord(card: BeOrDoCard, picked: BeOrDoGroup): string {
  const answer = card.answer.toLowerCase();
  const subject = card.question.split("___")[1]?.trim().split(/\s+/).slice(0, 2).join(" ") ?? "";
  const firstWord = subject.split(" ")[0] ?? "";
  if (beOrDoTense(answer) === "past") {
    if (picked.id === "do") return "Did";
    if (picked.id === "be") {
      // "you / we / they" or a plural noun ("the kids") takes were.
      const plural = /^(you|we|they)$/i.test(firstWord) || /s$/i.test(subject.split(" ")[1] ?? "");
      return plural ? "Were" : "Was";
    }
    return picked.pastForms[0] ?? picked.forms[0] ?? "";
  }
  const thirdPerson = answer === "is" || answer === "does";
  if (picked.id === "do") return thirdPerson ? "Does" : "Do";
  if (picked.id === "be") {
    if (thirdPerson) return "Is";
    return firstWord === "I" ? "Am" : "Are";
  }
  return picked.forms[0] ?? "";
}

/** Renders text with the main verb underlined in the card's family color. */
function withVerb(text: string, verb: string | undefined, groupId: string) {
  if (!verb) return text;
  const index = text.toLowerCase().indexOf(verb.toLowerCase());
  if (index < 0) return text;
  const style = groupStyle(groupId);
  return (
    <>
      {text.slice(0, index)}
      <span className={`underline decoration-[3px] underline-offset-4 ${style.underline}`}>
        {text.slice(index, index + verb.length)}
      </span>
      {text.slice(index + verb.length)}
    </>
  );
}

function FilledQuestion({ card, word, groupId }: { card: BeOrDoCard; word: string; groupId: string }) {
  const parts = fillBlank(card.question, word);
  const style = groupStyle(groupId);
  return (
    <>
      {withVerb(parts.before, card.verb, card.groupId)}
      <span className={`underline decoration-[3px] underline-offset-4 ${style.text} ${style.underline}`}>
        {parts.word}
      </span>
      {withVerb(parts.after, card.verb, card.groupId)}
    </>
  );
}

/** Splits a twin like "Are you tired?" into its helper and the rest. */
function TwinQuestion({ twin }: { twin: string }) {
  const [first = "", ...rest] = twin.split(" ");
  const group = BE_OR_DO_GROUPS.find((g) => g.forms.some((f) => f.toLowerCase() === first.toLowerCase()));
  const style = groupStyle(group?.id ?? "");
  return (
    <>
      <span className={`underline decoration-[3px] underline-offset-4 ${style.text} ${style.underline}`}>{first}</span>{" "}
      {rest.join(" ")}
    </>
  );
}

type Feedback =
  | { kind: "wrong-group"; word: string; hint: string }
  | { kind: "wrong-form"; word: string; hint: string };

export function BeOrDoQuestionsUI({
  contentStr,
  activityId,
  assignmentId,
  vocabType,
}: {
  contentStr: string;
  activityId?: string;
  assignmentId?: string | null;
  vocabType?: string;
}) {
  const rounds = useMemo(() => parseBeOrDoRounds(contentStr), [contentStr]);
  const [roundIndex, setRoundIndex] = useState(0);
  const round = rounds[roundIndex];

  // Cards stay in authored order so each twin card follows its partner.
  const roundCards = useMemo(() => round?.cards ?? [], [round]);

  // Only show the families this game's content actually uses.
  const groups = useMemo(() => {
    const used = new Set(rounds.flatMap((r) => r.cards.map((c) => c.groupId)));
    return BE_OR_DO_GROUPS.filter((g) => used.has(g.id));
  }, [rounds]);

  // Show only the forms for the tenses this round uses (present, past, or both).
  const roundTenses = useMemo(() => new Set(roundCards.map((c) => beOrDoTense(c.answer))), [roundCards]);
  const formsFor = (group: BeOrDoGroup) => group.forms.filter((f) => roundTenses.has(beOrDoTense(f)));

  const totalCards = useMemo(() => rounds.reduce((sum, r) => sum + r.cards.length, 0), [rounds]);
  const cardsBeforeRound = useMemo(
    () => rounds.slice(0, roundIndex).reduce((sum, r) => sum + r.cards.length, 0),
    [rounds, roundIndex]
  );

  const [cardIndex, setCardIndex] = useState(0);
  const [doneInRound, setDoneInRound] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [missedThisCard, setMissedThisCard] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [shakeKey, setShakeKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
  const completedRoundsRef = useRef(new Set<number>());
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  const card = roundCards[cardIndex];
  const overallPercent =
    totalCards > 0 ? Math.round(((cardsBeforeRound + doneInRound) / totalCards) * 100) : 0;
  const roundPercent = roundCards.length > 0 ? Math.round((doneInRound / roundCards.length) * 100) : 0;

  // Save progress after each correct answer
  useEffect(() => {
    if (!activityId || totalCards === 0) return;
    const status = overallPercent >= 100 ? "completed" : "in_progress";
    void saveActivityProgress(activityId, overallPercent, status, undefined, undefined, assignmentId ?? null, undefined, vocabType);
  }, [activityId, overallPercent, totalCards, assignmentId, vocabType]);

  // Save each finished round as its own category so it earns points once
  useEffect(() => {
    if (!activityId || !round || !isRoundComplete) return;
    const roundNumber = round.roundNumber;
    if (completedRoundsRef.current.has(roundNumber)) return;
    completedRoundsRef.current.add(roundNumber);
    const status = overallPercent >= 100 ? "completed" : "in_progress";

    void (async () => {
      const result = await saveActivityProgress(
        activityId,
        100,
        status,
        undefined,
        `round-${roundNumber}`,
        assignmentId ?? null,
        undefined,
        vocabType
      );
      if (result?.pointsAwarded && result.pointsAwarded > 0) {
        setPointsToast({ points: result.pointsAwarded, key: Date.now() });
      }
    })();
  }, [activityId, round, isRoundComplete, assignmentId, overallPercent, vocabType]);

  // Resume at the first round the learner has not finished
  useEffect(() => {
    if (!activityId || rounds.length === 0) return;
    let cancelled = false;

    void (async () => {
      try {
        const qs = new URLSearchParams({ activityId });
        if (assignmentId) qs.set("assignmentId", assignmentId);
        const res = await fetch(`/api/activity/progress?${qs.toString()}`);
        if (!res.ok) return;
        const data = (await res.json()) as { categoryData?: string | null };
        if (!data.categoryData) return;
        const parsed = JSON.parse(data.categoryData) as unknown;
        if (!parsed || typeof parsed !== "object") return;

        const completed = new Set<number>();
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          const match = /^round-(\d+)$/.exec(key);
          if (match && value && typeof value === "object" && (value as { completed?: unknown }).completed === true) {
            completed.add(Number(match[1]));
          }
        }
        if (cancelled) return;
        completedRoundsRef.current = new Set(completed);

        let next = 1;
        while (next <= rounds.length && completed.has(next)) next += 1;
        if (next > rounds.length) {
          setRoundIndex(rounds.length - 1);
          setIsRoundComplete(true);
          setIsGameComplete(true);
          return;
        }
        setRoundIndex(next - 1);
        setCardIndex(0);
        setDoneInRound(0);
        setFirstTryCount(0);
        setMissedThisCard(false);
        setFeedback(null);
        setRevealed(false);
        setIsRoundComplete(false);
        setIsGameComplete(false);
      } catch {
        // best-effort
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activityId, assignmentId, rounds.length]);

  useEffect(() => {
    if (revealed) nextButtonRef.current?.focus({ preventScroll: true });
  }, [revealed]);

  function startRound(index: number) {
    setRoundIndex(index);
    setCardIndex(0);
    setDoneInRound(0);
    setFirstTryCount(0);
    setMissedThisCard(false);
    setFeedback(null);
    setRevealed(false);
    setIsRoundComplete(false);
    setIsGameComplete(false);
  }

  function markWrong(key: string, next: Feedback) {
    setMissedThisCard(true);
    setFeedback(next);
    setShakeKey(key);
    window.setTimeout(() => setShakeKey((current) => (current === key ? null : current)), 400);
  }

  function markRight() {
    if (!missedThisCard) setFirstTryCount((n) => n + 1);
    setDoneInRound((n) => n + 1);
    setFeedback(null);
    setRevealed(true);
  }

  function pickGroup(group: BeOrDoGroup) {
    if (!card || revealed) return;
    if (group.id === card.groupId) {
      markRight();
    } else {
      markWrong(group.id, {
        kind: "wrong-group",
        word: brokenWord(card, group),
        hint: card.hint ?? "Look after the blank. Is there a verb?",
      });
    }
  }

  function pickForm(form: string, group: BeOrDoGroup) {
    if (!card || revealed) return;
    if (form.toLowerCase() === card.answer.toLowerCase()) {
      markRight();
    } else if (group.id === card.groupId) {
      const answerTense = beOrDoTense(card.answer);
      const hint =
        beOrDoTense(form) !== answerTense
          ? BE_OR_DO_TENSE_HINT
          : answerTense === "past"
          ? group.pastAgreementHint
          : group.agreementHint;
      markWrong(form, { kind: "wrong-form", word: form, hint });
    } else {
      markWrong(form, {
        kind: "wrong-group",
        word: form,
        hint: card.hint ?? "Look after the blank. Is there a verb?",
      });
    }
  }

  function goNext() {
    setRevealed(false);
    setMissedThisCard(false);
    setFeedback(null);
    if (cardIndex + 1 >= roundCards.length) {
      setIsRoundComplete(true);
      if (roundIndex + 1 >= rounds.length) setIsGameComplete(true);
    } else {
      setCardIndex((i) => i + 1);
    }
  }

  function handleNextRound() {
    if (roundIndex + 1 >= rounds.length) {
      setIsGameComplete(true);
    } else {
      startRound(roundIndex + 1);
    }
  }

  if (rounds.length === 0 || !round) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <p className="text-text-muted">No question cards available.</p>
      </div>
    );
  }

  const cardGroup = card ? groups.find((g) => g.id === card.groupId) : undefined;
  const liveMessage = feedback && card
    ? `Not quite. ${feedback.hint}`
    : revealed && card
    ? `Correct! ${card.question.replace("___", fillBlank(card.question, card.answer).word)} ${card.reply ?? ""}`
    : isRoundComplete
    ? isGameComplete
      ? "You did it! You completed all rounds."
      : `Great job! Round ${round.roundNumber} complete.`
    : null;

  return (
    <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:w-full md:max-w-5xl md:mx-auto md:bg-[var(--color-bg)] md:px-3 md:py-4">
      <GameLiveRegion message={liveMessage} />
      {pointsToast && (
        <PointsToast key={pointsToast.key} points={pointsToast.points} onComplete={() => setPointsToast(null)} />
      )}

      {/* Header */}
      <div className="flex-shrink-0 bg-[var(--color-surface-elevated)] border-b md:border md:rounded-xl shadow-sm border-[var(--color-border-subtle)] p-3 md:p-4">
        <div className="flex items-start gap-3">
          <ContextualBackButton className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center touch-manipulation" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--color-text)] leading-tight">
                Be or Do?
              </h2>
              <div className="text-sm font-medium text-text-muted whitespace-nowrap tabular-nums">
                <span className="text-green-700 dark:text-green-300 font-bold">{firstTryCount}</span> /{" "}
                {roundCards.length} right on the first try
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mb-1">
              Round {round.roundNumber} of {rounds.length}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text)] mb-3">
              {round.mode === "form" ? "Choose the exact word for the blank." : "Find the verb. Is it BE, or another verb?"}
            </p>
            <div className="h-2.5 w-full bg-[var(--color-bg-light)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                style={{ width: `${roundPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 md:overflow-visible md:overscroll-auto md:px-0 md:py-6 flex flex-col items-center justify-start gap-5"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {round.note && !isRoundComplete && (
          <div className="w-full max-w-2xl">
            <div className="flex items-start gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 p-3 dark:border-amber-500/60 dark:bg-amber-500/10">
              <span className="text-lg leading-none" aria-hidden="true">💡</span>
              <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">{round.note}</p>
            </div>
          </div>
        )}

        {isRoundComplete ? (
          <div className="w-full max-w-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl">
            <div className="text-6xl md:text-7xl mb-4" aria-hidden="true">🎉</div>
            {isGameComplete ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">You did it!</h2>
                <p className="text-lg md:text-xl text-white/90 mb-2">You completed all {rounds.length} rounds!</p>
                <p className="text-sm text-white/80">Find the verb. BE jumps to the front, or DO comes to help. 🏆</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Great job!</h2>
                <p className="text-lg md:text-xl text-white/90 mb-2">
                  {firstTryCount} of {roundCards.length} right on the first try.
                </p>
                <p className="text-sm text-white/80 mb-4">
                  {rounds[roundIndex + 1]?.mode === "form" && round.mode !== "form"
                    ? `Next: Round ${round.roundNumber + 1}. Now you choose the exact word!`
                    : `Ready for Round ${round.roundNumber + 1}?`}
                </p>
                <button
                  onClick={handleNextRound}
                  className={`inline-block px-6 py-3 !bg-white !text-emerald-600 font-bold rounded-lg hover:!bg-gray-100 active:scale-95 transition-[background-color,transform] ${FOCUS_RING}`}
                >
                  Next Round →
                </button>
              </>
            )}
          </div>
        ) : card && revealed ? (
          /* Finished question after a correct pick */
          <div className="w-full max-w-md">
            <div className="rounded-2xl border-4 border-green-400 bg-green-50 p-5 md:p-6 shadow-lg dark:border-green-500/70 dark:bg-green-500/10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">✅</span>
                <span className="text-sm font-bold uppercase tracking-wide text-green-800 dark:text-green-300">
                  {cardGroup ? `${cardGroup.icon} ${cardGroup.label} · ${cardGroup.rule}` : "Correct"}
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-bold leading-snug text-[var(--color-text)]">
                <FilledQuestion card={card} word={card.answer} groupId={card.groupId} />
              </p>
              {card.reply && (
                <p className="self-start rounded-2xl rounded-bl-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-3 py-1.5 font-bold text-[var(--color-text)]">
                  {card.reply}
                </p>
              )}
              {card.why && (
                <p className="text-sm leading-relaxed text-green-900 dark:text-green-100">{card.why}</p>
              )}
              {card.twin && (
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-3 flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Same meaning, different verb
                  </span>
                  <span className="text-lg font-bold text-[var(--color-text)]">
                    <TwinQuestion twin={card.twin} />
                  </span>
                  <span className="text-lg font-bold text-[var(--color-text)]">
                    <FilledQuestion card={card} word={card.answer} groupId={card.groupId} />
                  </span>
                </div>
              )}
              <button
                ref={nextButtonRef}
                onClick={goNext}
                className={`w-full min-h-[44px] rounded-lg !bg-green-600 px-4 py-2 font-semibold !text-white transition-colors hover:!bg-green-700 active:scale-95 touch-manipulation ${FOCUS_RING}`}
              >
                {cardIndex + 1 >= roundCards.length ? "Finish round" : "Next →"}
              </button>
            </div>
          </div>
        ) : card ? (
          <>
            {/* Question card */}
            <div className="w-full max-w-md">
              <div className="p-6 md:p-8 bg-[var(--color-surface-elevated)] rounded-2xl shadow-lg border-4 border-[var(--color-border-subtle)] text-center flex flex-col gap-2">
                {card.twin && (
                  <span className="self-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                    Twin card
                  </span>
                )}
                {card.context && (
                  <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">{card.context}</span>
                )}
                <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] break-words leading-snug">
                  {card.question.split("___").map((part, i, all) => (
                    <span key={i}>
                      {part}
                      {i < all.length - 1 && (
                        <span className="inline-block min-w-[2.4em] border-b-4 border-[var(--color-primary)]" aria-label="blank">
                          &nbsp;
                        </span>
                      )}
                    </span>
                  ))}
                </h3>
              </div>
            </div>

            {/* Wrong-answer panel: the broken question plus a hint */}
            {feedback ? (
              <div className="w-full max-w-md rounded-xl border-2 border-red-300 bg-red-50 p-4 dark:border-red-500/60 dark:bg-red-500/10" role="status">
                <p className="text-lg font-bold text-red-700 line-through decoration-2 dark:text-red-300">
                  {(() => {
                    const p = fillBlank(card.question, feedback.word);
                    return `${p.before}${p.word}${p.after}`;
                  })()}
                </p>
                <p className="mt-1 text-sm text-red-900 dark:text-red-200">
                  {feedback.kind === "wrong-form" ? feedback.hint : `Not quite. ${feedback.hint}`}
                </p>
              </div>
            ) : (
              <p className="text-center text-xs sm:text-sm text-[var(--color-text-muted)]">
                {round.mode === "form" ? "Tap the word that fits the blank" : "Tap BE or DO to finish the question"}
              </p>
            )}

            {round.mode === "form" ? (
              <div className="w-full max-w-2xl flex flex-col gap-3">
                {groups.map((group) => {
                  const style = groupStyle(group.id);
                  return (
                    <div key={group.id} className="flex flex-col gap-1.5">
                      <span className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>
                        <span aria-hidden="true">{group.icon}</span> {group.label} · {group.rule}
                      </span>
                      <div className="flex gap-2 sm:gap-3">
                        {formsFor(group).map((form) => (
                          <button
                            key={form}
                            onClick={() => pickForm(form, group)}
                            className={`flex-1 min-h-[56px] rounded-xl !border-4 !border-dashed px-2 text-xl md:text-2xl font-bold touch-manipulation transition-[border-color,background-color,transform] active:scale-95 ${FOCUS_RING} ${
                              shakeKey === form
                                ? "!border-red-400 !bg-red-500/10"
                                : "!border-[var(--color-border-subtle)] !bg-[var(--color-surface-elevated)] hover:!border-[var(--color-border-strong)]"
                            }`}
                          >
                            <span className={style.text}>{form}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full max-w-2xl grid grid-cols-2 gap-3 md:gap-6">
                {groups.map((group) => {
                  const style = groupStyle(group.id);
                  return (
                    <button
                      key={group.id}
                      onClick={() => pickGroup(group)}
                      className={`min-h-[140px] p-4 md:p-8 rounded-xl !border-4 !border-dashed flex flex-col items-center justify-center gap-1 touch-manipulation transition-[border-color,background-color,transform] active:scale-95 ${FOCUS_RING} ${
                        shakeKey === group.id
                          ? "!border-red-400 !bg-red-500/10"
                          : "!border-[var(--color-border-subtle)] !bg-[var(--color-surface-elevated)] hover:!border-[var(--color-border-strong)]"
                      }`}
                    >
                      <span className="text-3xl md:text-4xl leading-none mb-1" aria-hidden="true">{group.icon}</span>
                      <span className="font-bold text-[var(--color-text)] text-base md:text-lg">{group.label}</span>
                      <span className={`text-lg md:text-xl font-bold ${style.text}`}>{formsFor(group).join(" · ")}</span>
                      <span className={`text-xs font-semibold ${style.text}`}>{group.rule}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>

      {isGameComplete && (
        <div className="flex-shrink-0 flex justify-center px-3 pb-4 md:pb-0">
          <button
            onClick={() => startRound(0)}
            className={`w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 !bg-gray-700 !text-white font-semibold rounded-lg hover:!bg-gray-800 active:!bg-gray-900 transition-[background-color,box-shadow] shadow-lg touch-manipulation text-base md:text-sm ${FOCUS_RING}`}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
