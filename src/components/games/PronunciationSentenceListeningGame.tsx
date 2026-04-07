'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Ear, Headphones, Mic, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { saveActivityProgress } from '@/lib/activityProgress';
import { PointsToast } from '@/components/ui/PointsToast';
import { getPronunciationActivityDescriptor } from '@/lib/pronunciation-activity';
import { PRONUNCIATION_SENTENCE_LISTENING_SETS } from '@/data/pronunciation-sentence-listening';
import type {
  PronunciationSentenceListeningContent,
  PronunciationSentenceListeningQuestion,
  SoundExplainer,
} from '@/types/activity';

interface Props {
  contentStr: string;
  activityId?: string;
  assignmentId?: string | null;
}

type GamePhase = 'menu' | 'learn' | 'practice' | 'complete';

type SayItState = 'waiting' | 'ready' | 'done';

interface PracticeState {
  phase: GamePhase;
  questions: PronunciationSentenceListeningQuestion[];
  currentIndex: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  sayItState: SayItState;
  answers: Array<{ id: string; correct: boolean }>;
  pointsToast: { points: number; key: number } | null;
  activeSetKey: string | null;
  soundExplainer: SoundExplainer | null;
}

function extractTargetWord(prompt?: string | null) {
  if (!prompt) return null;
  const patterns = [
    /word\s+([A-Za-z'-]+),/i,
    /start of\s+([A-Za-z'-]+)/i,
    /middle of\s+([A-Za-z'-]+)/i,
    /end of\s+([A-Za-z'-]+)/i,
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function highlightWord(transcript: string, word: string | null) {
  if (!word) return <>{transcript}</>;
  const idx = transcript.toLowerCase().indexOf(word.toLowerCase());
  if (idx === -1) return <>{transcript}</>;
  return (
    <>
      {transcript.slice(0, idx)}
      <mark className="rounded bg-teal-100 px-0.5 font-black text-teal-900 not-italic">
        {transcript.slice(idx, idx + word.length)}
      </mark>
      {transcript.slice(idx + word.length)}
    </>
  );
}

function safeParseContent(contentStr: string): PronunciationSentenceListeningContent | null {
  try {
    const parsed = JSON.parse(contentStr) as PronunciationSentenceListeningContent;
    return parsed?.type === 'pronunciation-listening' && Array.isArray(parsed.sentences) ? parsed : null;
  } catch {
    return null;
  }
}

function shuffleArray<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function getAvailableSets(content: PronunciationSentenceListeningContent) {
  const configuredKeys = content.setKeys ?? [];
  if (configuredKeys.length === 0) {
    return [{ key: content.targetSound, content }];
  }
  return configuredKeys
    .map((key) => {
      const set = PRONUNCIATION_SENTENCE_LISTENING_SETS[key as keyof typeof PRONUNCIATION_SENTENCE_LISTENING_SETS];
      if (!set) return null;
      return {
        key,
        content: {
          type: 'pronunciation-listening' as const,
          ...set,
        },
      };
    })
    .filter((entry): entry is { key: string; content: PronunciationSentenceListeningContent } => Boolean(entry));
}

export default function PronunciationSentenceListeningGame({ contentStr, activityId, assignmentId }: Props) {
  const content = useMemo(() => safeParseContent(contentStr), [contentStr]);
  const availableSets = useMemo(() => (content ? getAvailableSets(content) : []), [content]);
  const descriptor = useMemo(
    () => getPronunciationActivityDescriptor({ id: activityId, content: contentStr }),
    [activityId, contentStr]
  );
  const [isAudioSupported, setIsAudioSupported] = useState(true);
  const [state, setState] = useState<PracticeState>({
    phase: 'menu',
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    showFeedback: false,
    sayItState: 'waiting',
    answers: [],
    pointsToast: null,
    activeSetKey: null,
    soundExplainer: null,
  });

  useEffect(() => {
    setIsAudioSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const playAudio = useCallback(
    async (text: string, promptId: string) => {
      const audioPath = `/audio/pronunciation-sentences/${promptId}.mp3`;
      try {
        const audio = new Audio(audioPath);
        await new Promise<void>((resolve, reject) => {
          audio.oncanplaythrough = () => resolve();
          audio.onerror = () => reject();
          audio.load();
        });
        await audio.play();
        return;
      } catch {
        // fall back to browser TTS
      }
      if (!isAudioSupported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.76;
      utterance.lang = 'en-US';
      const voices = window.speechSynthesis.getVoices();
      const americanVoice = voices.find(
        (v) => v.lang.startsWith('en-US') || v.name.includes('US') || v.name.includes('American')
      );
      if (americanVoice) utterance.voice = americanVoice;
      window.speechSynthesis.speak(utterance);
    },
    [isAudioSupported]
  );

  const startTrack = useCallback(
    (setKey?: string) => {
      if (!content) return;
      const chosenEntry = setKey
        ? availableSets.find((e) => e.key === setKey)
        : availableSets[0];
      const chosenContent = chosenEntry?.content ?? content;
      const roundSize = chosenContent.roundSize ?? chosenContent.sentences.length;
      const questions = shuffleArray(chosenContent.sentences).slice(0, roundSize);
      const explainer = chosenContent.soundExplainer ?? null;
      const resolvedKey = setKey ?? availableSets[0]?.key ?? content.targetSound;

      setState({
        phase: explainer ? 'learn' : 'practice',
        questions,
        currentIndex: 0,
        selectedAnswer: null,
        showFeedback: false,
        sayItState: 'waiting',
        answers: [],
        pointsToast: null,
        activeSetKey: resolvedKey,
        soundExplainer: explainer,
      });
    },
    [availableSets, content]
  );

  const startPractice = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'practice' }));
  }, []);

  const resetToMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'menu',
      questions: [],
      currentIndex: 0,
      selectedAnswer: null,
      showFeedback: false,
      sayItState: 'waiting',
      answers: [],
      activeSetKey: null,
      soundExplainer: null,
    }));
  }, []);

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const activeSet = availableSets.find((e) => e.key === state.activeSetKey)?.content ?? content;
  const targetWord = currentQuestion ? extractTargetWord(currentQuestion.prompt) : null;
  const correctChoice =
    currentQuestion?.choices[currentQuestion.correctChoiceIndex] ?? null;

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (!currentQuestion || state.showFeedback) return;
      const correct = selectedIndex === currentQuestion.correctChoiceIndex;
      setState((prev) => ({
        ...prev,
        selectedAnswer: selectedIndex,
        showFeedback: true,
        sayItState: 'ready',
        answers: [...prev.answers, { id: currentQuestion.id, correct }],
      }));
    },
    [currentQuestion, state.showFeedback]
  );

  const handleSaidIt = useCallback(async () => {
    if (!currentQuestion) return;
    const isLastQuestion = state.currentIndex >= state.questions.length - 1;

    if (isLastQuestion) {
      const accuracy =
        state.questions.length > 0
          ? Math.round(([...state.answers, { id: currentQuestion.id, correct: state.selectedAnswer === currentQuestion.correctChoiceIndex }].filter((a) => a.correct).length / state.questions.length) * 100)
          : 0;
      setState((prev) => ({ ...prev, phase: 'complete', sayItState: 'done' }));

      if (activityId) {
        const result = await saveActivityProgress(
          activityId,
          100,
          'completed',
          accuracy,
          `pronunciation-set:${state.activeSetKey ?? descriptor.targetLabel ?? 'sentences'}`,
          assignmentId
        );
        if (result?.pointsAwarded && result.pointsAwarded > 0) {
          setState((prev) => ({
            ...prev,
            pointsToast: { points: result.pointsAwarded!, key: Date.now() },
          }));
        }
      }
      return;
    }

    setState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      selectedAnswer: null,
      showFeedback: false,
      sayItState: 'waiting',
    }));
  }, [
    activityId,
    assignmentId,
    currentQuestion,
    descriptor.targetLabel,
    state.activeSetKey,
    state.answers,
    state.currentIndex,
    state.questions.length,
    state.selectedAnswer,
  ]);

  if (!content) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Invalid pronunciation activity content.
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      {state.pointsToast ? <PointsToast points={state.pointsToast.points} key={state.pointsToast.key} /> : null}

      {/* ── MENU ── */}
      {state.phase === 'menu' ? (
        <section className="rounded-2xl border border-slate-300/60 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.65),_rgba(255,255,255,0.96)_40%,_rgba(241,245,249,0.98)_100%)] px-4 py-5 text-slate-950 shadow-lg sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Ear className="h-5 w-5 shrink-0 text-teal-700" aria-hidden />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Sound Workshop</p>
              </div>
              <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                {descriptor.friendlyTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {content.instructions ?? descriptor.useThisFor}
              </p>
            </div>
            {availableSets.length > 1 ? (
              <div
                className="flex shrink-0 items-start gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2.5 text-xs text-slate-700 shadow-sm sm:max-w-[220px]"
                role="note"
              >
                <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
                <div className="leading-snug">
                  <p className="font-bold text-slate-900">How it works</p>
                  <ol className="mt-1.5 list-decimal space-y-0.5 pl-4 text-[11px] text-slate-600 sm:text-xs">
                    <li>Learn how to make the sounds.</li>
                    <li>Hear each sound in a real sentence.</li>
                    <li>Say the sentence yourself.</li>
                  </ol>
                </div>
              </div>
            ) : null}
          </div>

          {availableSets.length > 1 ? (
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {availableSets.length} sound contrasts — choose one to start
            </p>
          ) : null}

          {availableSets.length > 1 ? (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {availableSets.map((entry, index) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => startTrack(entry.key)}
                  aria-label={`${entry.content.meta?.targetLabel ?? entry.content.targetSound}. Track ${index + 1} of ${availableSets.length}.`}
                  className="group flex w-full flex-col rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-3 text-left shadow-sm transition hover:border-teal-400/80 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex shrink-0 items-center rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-teal-800">
                      {index + 1}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-600"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-2 text-sm font-bold leading-snug text-slate-900 sm:text-[15px]">
                    {entry.content.meta?.targetLabel ?? entry.content.targetSound}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {entry.content.meta?.targetDescription ?? 'Practice these sounds inside real sentences.'}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => startTrack()}
              className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              Start workshop
            </button>
          )}
        </section>
      ) : null}

      {/* ── LEARN ── */}
      {state.phase === 'learn' && state.soundExplainer ? (
        <section className="rounded-[32px] border border-slate-200 bg-white px-5 py-6 shadow-xl sm:px-8 sm:py-8">
          <button
            type="button"
            onClick={resetToMenu}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back
          </button>

          <div className="mt-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-600" aria-hidden />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Before you listen</p>
          </div>
          <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            How to make these sounds
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {activeSet?.meta?.targetLabel ?? activeSet?.targetSound}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {state.soundExplainer.sounds.map((sound, i) => (
              <div
                key={i}
                className="rounded-2xl border border-teal-100 bg-teal-50/60 px-5 py-4"
              >
                <p className="text-base font-black text-teal-900">{sound.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{sound.tip}</p>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  Examples:{' '}
                  <span className="font-bold text-slate-700">{sound.examples}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">Common mistake</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{state.soundExplainer.commonMistake}</p>
          </div>

          <button
            type="button"
            onClick={startPractice}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-500"
          >
            Start practicing
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </section>
      ) : null}

      {/* ── PRACTICE ── */}
      {state.phase === 'practice' && currentQuestion && activeSet ? (
        <section className="rounded-[32px] border border-slate-200 bg-white px-5 py-6 shadow-xl sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={resetToMenu}
              className="inline-flex max-w-[min(100%,16rem)] items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-left text-sm font-semibold leading-snug text-slate-600 sm:max-w-none"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Back to workshop
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Sentence {state.currentIndex + 1} of {state.questions.length}
            </p>
          </div>

          {/* Transcript (always shown upfront) */}
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Read this sentence</p>
            <p className="mt-2 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
              {highlightWord(currentQuestion.transcript, targetWord)}
            </p>
            {targetWord ? (
              <p className="mt-2 text-xs text-slate-500">
                Focus on the word{' '}
                <span className="font-bold text-slate-700">{targetWord}</span>
              </p>
            ) : null}
          </div>

          {/* Play + identify */}
          <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/50 px-4 py-4 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              {activeSet.meta?.targetLabel ?? activeSet.targetSound}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {targetWord ? (
                <>
                  Play the sentence, then choose the sound you hear in{' '}
                  <span className="font-black text-slate-900">{targetWord}</span>.
                </>
              ) : (
                currentQuestion.prompt ?? 'Play the sentence, then choose the key sound.'
              )}
            </p>

            <button
              type="button"
              onClick={() => void playAudio(currentQuestion.audioPrompt, currentQuestion.id)}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-500"
            >
              <Volume2 className="h-4 w-4 shrink-0" aria-hidden />
              Play sentence
            </button>

            {!state.showFeedback ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={`${currentQuestion.id}-${index}`}
                    type="button"
                    onClick={() => handleAnswer(index)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-teal-200 hover:bg-teal-50/50"
                  >
                    <span className="block text-base font-black text-slate-800 sm:text-lg">{choice.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Feedback + Say it */}
          <AnimatePresence initial={false}>
            {state.showFeedback ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-5 flex flex-col gap-4"
              >
                {/* Answer feedback */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-start gap-3">
                    {state.selectedAnswer === currentQuestion.correctChoiceIndex ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {state.selectedAnswer === currentQuestion.correctChoiceIndex
                          ? 'Nice catch'
                          : 'Listen for this sound next time'}
                      </p>
                      {correctChoice ? (
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          You heard <span className="font-black">{correctChoice.label}</span>
                          {targetWord ? (
                            <>
                              {' '}in <span className="font-black">{targetWord}</span>
                            </>
                          ) : null}
                          {correctChoice.cue ? <> — {correctChoice.cue}.</> : '.'}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm font-semibold text-slate-800">{currentQuestion.revealFocus}</p>
                      )}
                      {currentQuestion.coachingTip ? (
                        <p className="mt-2 text-sm text-slate-600">{currentQuestion.coachingTip}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Say it yourself */}
                <div className="rounded-3xl border border-teal-200 bg-teal-50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 shrink-0 text-teal-700" aria-hidden />
                    <p className="text-sm font-bold text-teal-900">Now say it yourself</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Read the sentence aloud, focusing on{' '}
                    {targetWord ? (
                      <span className="font-bold text-slate-900">{targetWord}</span>
                    ) : (
                      'the key sound'
                    )}
                    . Replay if you want to hear it again first.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void playAudio(currentQuestion.audioPrompt, currentQuestion.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
                    >
                      <Volume2 className="h-4 w-4" aria-hidden />
                      Replay sentence
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSaidIt()}
                      className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-teal-500"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      {state.currentIndex >= state.questions.length - 1 ? 'I said it — finish' : 'I said it ✓'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      ) : null}

      {/* ── COMPLETE ── */}
      {state.phase === 'complete' && activeSet ? (
        <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" aria-hidden />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Workshop complete</p>
          </div>
          <h2 className="mt-3 text-3xl font-black text-slate-900">
            You practiced {state.questions.length} sentence{state.questions.length !== 1 ? 's' : ''}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
            Keep practicing these sounds in real conversations.{' '}
            {activeSet.meta?.targetDescription
              ? `This track focused on ${activeSet.meta.targetDescription}.`
              : null}
          </p>

          {/* Sentence review list */}
          {state.questions.length > 0 ? (
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Sentences you practiced</p>
              <ul className="mt-3 flex flex-col gap-2">
                {state.questions.map((q) => {
                  const word = extractTargetWord(q.prompt);
                  const answerRecord = state.answers.find((a) => a.id === q.id);
                  return (
                    <li
                      key={q.id}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      {answerRecord?.correct ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden />
                      )}
                      <p className="text-sm leading-relaxed text-slate-700">
                        {highlightWord(q.transcript, word)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => startTrack(state.activeSetKey ?? undefined)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Replay this track
            </button>
            <button
              type="button"
              onClick={resetToMenu}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Choose another track
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
