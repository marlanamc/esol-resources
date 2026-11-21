'use client';

import { useEffect, type ReactNode } from 'react';
import { Check, Volume2, X } from 'lucide-react';
import type { SoundRulePanel } from '@/lib/sound-path/levels';
import { QUESTION_TYPE_LABEL, correctAnswer, explain, type SoundQuestion } from '@/lib/sound-path/questions';
import { SoundRulePanelCard } from './RuleCardScreen';
import { SURFACE, TONE, VIOLET_BUTTON } from './theme';

interface RoundScreenProps {
  title: string;
  tag: string;
  questions: SoundQuestion[];
  index: number;
  results: boolean[];
  /** The learner's answer for the current question, once given. */
  chosen: string | null;
  rulePanelsFor: (q: SoundQuestion) => SoundRulePanel[] | null;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onQuit: () => void;
  playWord: (word: string) => void;
  speakText: (text: string) => void;
}

type Option = { value: string; label: ReactNode; sub?: string; tone: keyof typeof TONE; aria: string };

const TEAM_OPTIONS: Option[] = [
  { value: 't', label: '/t/', sub: 'whisper', tone: 't', aria: 'Team t, whisper sound' },
  { value: 'd', label: '/d/', sub: 'tiny d', tone: 'd', aria: 'Team d' },
  { value: 'id', label: '/id/', sub: 'extra clap', tone: 'id', aria: 'Team i d, extra clap' },
];

function Dots({ n }: { n: number }) {
  return (
    <span className="flex gap-2" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="h-6 w-6 rounded-full bg-current" />
      ))}
    </span>
  );
}

function optionsFor(q: SoundQuestion): Option[] {
  switch (q.type) {
    case 'clap':
      return [
        { value: 'no-clap', label: <Dots n={1} />, sub: 'No extra clap · walked', tone: 'no-clap', aria: 'No extra clap' },
        { value: 'clap', label: <Dots n={2} />, sub: 'Extra clap · want·ed', tone: 'id', aria: 'Extra clap' },
      ];
    case 'now-or-past':
      return [
        { value: 'base', label: q.verb.base, sub: 'now', tone: 'now', aria: `${q.verb.base}, now` },
        { value: 'past', label: q.verb.past, sub: 'past', tone: 'past', aria: `${q.verb.past}, past` },
      ];
    case 'whisper':
      return TEAM_OPTIONS.slice(0, 2);
    case 'team':
    case 'sentence':
      return TEAM_OPTIONS;
    case 'odd':
      return [];
  }
}

/** Highlight the past verb inside its example sentence. */
function SentenceWithVerb({ sentence, verb }: { sentence: string; verb: string }) {
  const idx = sentence.toLowerCase().indexOf(verb.toLowerCase());
  if (idx < 0) return <>{sentence}</>;
  return (
    <>
      {sentence.slice(0, idx)}
      <u className="decoration-violet-500 decoration-4 underline-offset-8">{sentence.slice(idx, idx + verb.length)}</u>
      {sentence.slice(idx + verb.length)}
    </>
  );
}

export function RoundScreen({
  title,
  tag,
  questions,
  index,
  results,
  chosen,
  rulePanelsFor,
  onAnswer,
  onNext,
  onQuit,
  playWord,
  speakText,
}: RoundScreenProps) {
  const q = questions[index];
  const answered = chosen !== null;
  const right = q ? correctAnswer(q) : '';
  const wasCorrect = answered && chosen === right;

  // Listening questions play by themselves when they appear.
  useEffect(() => {
    if (!q) return;
    if (q.type === 'now-or-past') playWord(q.target === 'past' ? q.verb.past : q.verb.base);
    else if (q.type === 'sentence') speakText(q.verb.example);
    else if (q.type !== 'odd') playWord(q.verb.past);
    // Only when the question changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.id, index]);

  if (!q) return null;

  const replay = () => {
    if (q.type === 'now-or-past') playWord(q.target === 'past' ? q.verb.past : q.verb.base);
    else if (q.type === 'sentence') speakText(q.verb.example);
    else if (q.type !== 'odd') playWord(q.verb.past);
  };

  const optionClass = (value: string, tone: keyof typeof TONE) => {
    if (!answered) return `${TONE[tone].button} border-2!`;
    if (value === right) return 'border-2! border-emerald-600! bg-emerald-50! text-emerald-900! dark:bg-emerald-900/40! dark:text-emerald-100!';
    if (value === chosen) return 'border-2! border-red-500! bg-red-50! text-red-900! dark:bg-red-900/40! dark:text-red-100!';
    return `${TONE[tone].button} border-2! opacity-50`;
  };

  const reminder = answered && !wasCorrect ? rulePanelsFor(q) : null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-3 pb-10 pt-3 sm:px-8 sm:pt-6">
      {/* Top bar */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={onQuit}
          aria-label="Quit this round"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${SURFACE} bg-white! dark:bg-[#162b3d]! border! text-text-muted hover:text-text`}
        >
          <X size={20} />
        </button>
        <span className="hidden shrink-0 text-xl font-black text-text sm:block">{title}</span>
        <span className="hidden shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800 md:inline dark:bg-violet-900/50 dark:text-violet-200">{tag}</span>
        <ol className="flex flex-1 gap-1" aria-label={`Question ${index + 1} of ${questions.length}`}>
          {questions.map((item, i) => (
            <li
              key={`${item.id}-${i}`}
              className={`h-2.5 flex-1 rounded-full sm:h-3 ${
                i < results.length ? (results[i] ? 'bg-emerald-600' : 'bg-red-500') : i === index ? 'bg-violet-600' : 'bg-bg-gray dark:bg-white/10'
              }`}
            />
          ))}
        </ol>
        <span className="shrink-0 text-base font-bold text-text-muted sm:text-lg">
          {index + 1}/{questions.length}
        </span>
      </div>

      <span className="self-start rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
        {QUESTION_TYPE_LABEL[q.type]}
      </span>

      {/* Prompt */}
      {q.type === 'odd' ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black leading-tight text-text sm:text-3xl">
            {q.by === 'clap' ? 'Two words have the same claps. Which one is different?' : 'Two words are on the same team. Which one is different?'}
          </h2>
          <p className="text-base text-text-muted">Tap the speaker to listen. Tap the word to answer.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2 text-center sm:py-6">
          <button
            type="button"
            onClick={replay}
            aria-label="Play again"
            className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-600! text-white! shadow-[0_8px_18px_-10px_rgba(26,32,44,0.4)] transition-transform hover:scale-105 active:scale-95"
          >
            <Volume2 size={40} aria-hidden="true" />
          </button>
          {q.type === 'now-or-past' ? (
            <p className="text-xl font-bold text-text">{answered ? `You heard: ${q.target === 'past' ? q.verb.past : q.verb.base}` : 'Listen. Which word did you hear?'}</p>
          ) : q.type === 'sentence' ? (
            <>
              <p className="text-2xl font-bold leading-snug text-text sm:text-3xl">
                <SentenceWithVerb sentence={q.verb.example} verb={q.verb.past} />
              </p>
              <p className="text-base text-text-muted">Which team is the underlined verb on?</p>
            </>
          ) : (
            <>
              <p className="text-5xl font-black text-text sm:text-6xl">{q.verb.past}</p>
              <p className="text-base text-text-muted">
                {q.type === 'clap' ? 'Say it. Clap it. How many claps?' : q.type === 'whisper' ? 'Is the last sound of the verb a whisper?' : 'Which team?'}
              </p>
            </>
          )}
        </div>
      )}

      {/* Answers */}
      {q.type === 'odd' ? (
        <div className="flex flex-col gap-3">
          {q.verbs.map((verb, i) => (
            <div key={verb.past} className={`flex h-20 items-center gap-3 rounded-2xl px-3 ${optionClass(String(i), 'now')}`}>
              <button
                type="button"
                onClick={() => playWord(verb.past)}
                aria-label={`Listen to ${verb.past}`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100! text-violet-700! dark:bg-violet-900/50! dark:text-violet-200!"
              >
                <Volume2 size={22} aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={answered}
                onClick={() => onAnswer(String(i))}
                className="h-full flex-1 text-left text-3xl font-black text-inherit"
              >
                {verb.past}
                {answered ? <span className="ml-3 text-base font-bold opacity-80">{q.by === 'clap' ? (verb.sound === 'id' ? 'extra clap' : 'no extra clap') : `/${verb.sound}/`}</span> : null}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-3 ${optionsFor(q).length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {optionsFor(q).map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={answered}
              onClick={() => onAnswer(opt.value)}
              aria-label={opt.aria}
              className={`flex min-h-32! flex-col items-center justify-center gap-2 rounded-2xl px-2 py-4 transition-transform enabled:hover:-translate-y-0.5 ${optionClass(opt.value, opt.tone)}`}
            >
              <span className="text-3xl font-black sm:text-4xl">{opt.label}</span>
              {opt.sub ? <span className="text-sm font-bold">{opt.sub}</span> : null}
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      {answered ? (
        <div className={`flex flex-col gap-3 rounded-2xl p-4 ${wasCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'}`} role="status">
          <div className={`flex items-center gap-2 text-xl font-black ${wasCorrect ? 'text-emerald-800 dark:text-emerald-200' : 'text-red-800 dark:text-red-200'}`}>
            {wasCorrect ? <Check size={22} aria-hidden="true" /> : <X size={22} aria-hidden="true" />}
            {wasCorrect ? 'Correct!' : 'Not quite'}
          </div>
          <p className="text-lg text-text">{explain(q)}</p>
          <button type="button" onClick={onNext} className={`${VIOLET_BUTTON} h-14 text-lg`} autoFocus>
            {index + 1 < questions.length ? 'Next' : 'See results'}
          </button>
        </div>
      ) : null}

      {reminder && reminder.length > 0 ? (
        <section aria-label="Rule reminder" className="flex flex-col gap-3">
          <div className="text-sm font-bold uppercase tracking-widest text-text-muted">Remember the rule</div>
          <div className={`grid gap-3 ${reminder.length === 3 ? 'md:grid-cols-3' : reminder.length === 2 ? 'md:grid-cols-2' : ''}`}>
            {reminder.map((panel) => (
              <SoundRulePanelCard key={panel.label} panel={panel} onPlayWord={playWord} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
