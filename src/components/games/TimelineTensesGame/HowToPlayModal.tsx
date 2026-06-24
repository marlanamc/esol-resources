'use client';

import { useState, type ReactNode } from 'react';
import {
  MousePointer2,
  Info,
  Keyboard,
  Eye,
  Microscope,
  BookMarked,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';

export type HowToPlayMode = 'build' | 'read' | 'overview' | 'challenge';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: HowToPlayMode;
}

type OverviewTab = 'quick' | 'build' | 'read';

function BuildStampsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
          Understand the Stamps
        </h3>
        <div className="space-y-3">
          <StampCard
            svg={<circle cx={20} cy={15} r={6} fill="#3b82f6" />}
            title="Moment (Dot)"
            desc='Something happened at one specific point in time — and then it was done. → Past Simple, Future Simple'
          />
          <StampCard
            svg={
              <>
                <circle cx={8} cy={15} r={4} fill="#3b82f6" />
                <circle cx={20} cy={15} r={4} fill="#3b82f6" />
                <circle cx={32} cy={15} r={4} fill="#3b82f6" />
              </>
            }
            title="Habit/Fact (Dots)"
            desc='It happens again and again — a routine, a habit, or an always-true fact. → Present Simple'
          />
          <StampCard
            svg={
              <path d="M 8 15 L 32 15" stroke="#3b82f6" strokeWidth={5} strokeLinecap="round" strokeDasharray="8 6" />
            }
            title="Duration (Line)"
            desc='It was happening over a stretch of time — not just once, not just a moment. → Continuous tenses'
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
          Master the Links
        </h3>
        <div className="space-y-3">
          <StampCard
            svg={<path d="M 8 15 Q 20 3 32 15" fill="none" stroke="#3b82f6" strokeWidth={3} />}
            title="Link (Arc)"
            desc='One event is connected to another — the arc shows the bridge between them. The past event still matters now, or it happened before another event. → Perfect tenses'
          />
          <StampCard
            svg={
              <>
                <path d="M 5 15 Q 18 5 32 15" fill="none" stroke="#3b82f6" strokeWidth={4} strokeLinecap="round" strokeDasharray="5 4" />
                <circle cx={5} cy={15} r={3} fill="#3b82f6" />
                <circle cx={32} cy={15} r={3} fill="#3b82f6" />
              </>
            }
            title="Ongoing Link"
            desc='It was happening continuously AND it connects to another moment — you can feel both the duration and the link at the same time. → Perfect Continuous tenses'
          />
        </div>
      </div>
    </div>
  );
}

function BuildPlayCallout() {
  return (
    <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <MousePointer2 className="text-primary" size={20} />
      </div>
      <div>
        <p className="font-bold text-primary text-sm">How to Play</p>
        <p className="text-sm text-text-muted">
          Select a stamp from the toolkit, then tap a zone on the timeline to place it. Tap any placed stamp at the bottom of the screen to remove it.
        </p>
      </div>
    </div>
  );
}

function SplitPastCard() {
  return (
    <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 dark:border-amber-500/25">
      <h4 className="text-sm font-black uppercase tracking-wide text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 shrink-0" />
        Split past (two zones)
      </h4>
      <div className="flex gap-4 flex-col sm:flex-row sm:items-start">
        <div className="w-full sm:w-28 shrink-0 rounded-lg bg-white/80 dark:bg-slate-900/50 border border-border p-2">
          <svg viewBox="0 0 80 36" className="w-full h-10">
            <rect x="4" y="10" width="30" height="18" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            <rect x="46" y="10" width="30" height="18" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
            <text x="19" y="23" textAnchor="middle" fill="#92400e" fontSize="7" fontWeight="700">
              earlier
            </text>
            <text x="61" y="23" textAnchor="middle" fill="#92400e" fontSize="7" fontWeight="700">
              later
            </text>
          </svg>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Sometimes the <strong className="text-text">past</strong> is drawn as <strong className="text-text">two bands</strong>: further back vs closer to now. Where you place a dot or arc matters — earlier past often carries{' '}
          <strong className="text-text">Past Perfect</strong> or long-finished background; the band nearer &ldquo;now&rdquo; can carry <strong className="text-text">Past Simple</strong> or the main story moment.
        </p>
      </div>
    </div>
  );
}

function ReadStampsSection() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
            Read the Shapes
          </h3>
          <div className="space-y-3">
            <StampCard
              svg={<circle cx={20} cy={15} r={6} fill="#f59e0b" />}
              title="Single Dot"
              desc='One specific moment — it happened and it was done. Check the zone: past dot = Past Simple, future dot = Future Simple.'
            />
            <StampCard
              svg={
                <>
                  <circle cx={8} cy={15} r={4} fill="#f59e0b" />
                  <circle cx={20} cy={15} r={4} fill="#f59e0b" />
                  <circle cx={32} cy={15} r={4} fill="#f59e0b" />
                </>
              }
              title="Multiple Dots"
              desc='Happens again and again — a routine, a habit, or an always-true fact. → Present Simple'
            />
            <StampCard
              svg={
                <path d="M 8 15 L 32 15" stroke="#f59e0b" strokeWidth={5} strokeLinecap="round" strokeDasharray="8 6" />
              }
              title="Duration Line"
              desc='Was happening over a stretch of time — not just once. Check the zone to find the tense. → Continuous family'
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
            Read the Connections
          </h3>
          <div className="space-y-3">
            <StampCard
              svg={
                <>
                  <circle cx={8} cy={15} r={4} fill="#f59e0b" />
                  <path d="M 8 15 Q 20 3 32 15" fill="none" stroke="#f59e0b" strokeWidth={3} />
                  <circle cx={32} cy={15} r={4} fill="#10b981" />
                </>
              }
              title="Arc to NOW"
              desc='Something from the past is connected to right now — it still matters, or you can still feel the result. → Present Perfect'
            />
            <StampCard
              svg={
                <>
                  <circle cx={5} cy={15} r={3} fill="#f59e0b" />
                  <path d="M 5 15 Q 18 5 32 15" fill="none" stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" strokeDasharray="5 4" />
                  <circle cx={32} cy={15} r={4} fill="#10b981" />
                </>
              }
              title="Ongoing Arc to NOW"
              desc='It was happening continuously AND it still connects to now — you can feel both the duration and the result. → Perfect Continuous'
            />
            <StampCard
              svg={
                <>
                  <circle cx={8} cy={15} r={4} fill="#f59e0b" />
                  <path d="M 8 15 Q 20 3 32 15" fill="none" stroke="#f59e0b" strokeWidth={3} />
                  <circle cx={32} cy={15} r={4} fill="#f59e0b" />
                </>
              }
              title="Arc between Two Past Events"
              desc='Two things happened in the past — the arc shows which one came first. The earlier event is the "background" to the later one. → Past Perfect'
            />
          </div>
        </div>
      </div>

      <SplitPastCard />

      <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Keyboard className="text-primary" size={20} />
        </div>
        <div>
          <p className="font-bold text-primary text-sm">How to Play</p>
          <p className="text-sm text-text-muted">
            Study the shapes on the timeline and which zone they are in (Past, Now, or Future). Then type the correct verb form into each blank. Press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-border/40 text-xs font-mono">Enter</kbd> to move between blanks.
          </p>
        </div>
      </div>
    </>
  );
}

function QuickTipsContent() {
  return (
    <div className="space-y-5">
      <ul className="space-y-3 text-sm text-text-muted">
        <li className="flex gap-2">
          <span className="text-primary font-black">•</span>
          <span>
            <strong className="text-text">Zones matter:</strong> Past, Now (present), and Future — the same stamp shape can mean different tenses depending on where it sits.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-black">•</span>
          <span>
            <strong className="text-text">Typing:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-border/40 text-xs font-mono">Enter</kbd> to jump to the next blank when a question asks you to type verbs.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-black">•</span>
          <span>
            <strong className="text-text">Build mode:</strong> Pick a stamp, tap a zone on the timeline, tap a stamp in the bottom row to remove it.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-black">•</span>
          <span>
            <strong className="text-text">Formulas:</strong> Use the book icon in the top bar to open tense formulas anytime.
          </span>
        </li>
      </ul>

      <div className="p-4 rounded-2xl border border-secondary/30 bg-secondary/10 dark:bg-secondary/5 flex gap-3">
        <div className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center shrink-0 border border-secondary/20">
          <Microscope className="text-secondary w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-text text-sm flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Tense Tools
          </p>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            On the main screen, open <strong className="text-text">Tense Tools</strong> for the timeline lab, tense walkthrough, and time signals. During a round, tap the{' '}
            <strong className="text-text">microscope</strong> in the top bar — your progress stays when you come back.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChallengeModesContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted leading-relaxed">
        These modes ask you to use tenses in different ways — always read the prompt at the top, then answer in the format shown (click, type, or choose).
      </p>
      <div className="space-y-3">
        <ChallengeRow
          title="Spot the Difference"
          body="Compare two timelines side by side. Pick the one that matches the sentence or meaning clue."
        />
        <ChallengeRow
          title="Transformer"
          body="Rewrite the sentence to match the target tense. Fill in each blank carefully."
        />
        <ChallengeRow
          title="In Context"
          body="Choose the option that fits the situation — often a short dialogue or scenario."
        />
        <ChallengeRow
          title="Fix It"
          body="Find and correct the tense mistake in the sentence or story."
        />
        <ChallengeRow title="Story Builder" body="Fill blanks across several lines so the whole story uses time consistently." />
        <ChallengeRow
          title="Mixed Practice"
          body="You may see more than one question type in a round. Take each question on its own."
        />
      </div>

      <div className="p-4 rounded-2xl border border-border bg-surface-elevated/80 flex gap-3">
        <BookMarked className="text-primary shrink-0 w-5 h-5 mt-0.5" />
        <p className="text-xs text-text-muted leading-relaxed">
          Use the <strong className="text-text">book</strong> icon for formulas, and <strong className="text-text">Tense Tools</strong> (home screen or microscope during a round) when you want extra review without losing your place.
        </p>
      </div>

      <TenseCheatSheet />
    </div>
  );
}

function ChallengeRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-white/50 dark:bg-white/5 px-3 py-2.5">
      <p className="text-sm font-bold text-text">{title}</p>
      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{body}</p>
    </div>
  );
}

function BuildContent({ showCheatSheet = true }: { showCheatSheet?: boolean }) {
  return (
    <>
      <BuildStampsSection />
      <BuildPlayCallout />
      {showCheatSheet && <TenseCheatSheet className="mt-6" />}
    </>
  );
}

function ReadContent({ showCheatSheet = true }: { showCheatSheet?: boolean }) {
  return (
    <>
      <ReadStampsSection />
      {showCheatSheet && <TenseCheatSheet className="mt-6" />}
    </>
  );
}

function StampCard({ svg, title, desc }: { svg: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-3 rounded-xl bg-surface-elevated border border-border">
      <div className="w-12 h-12 flex-shrink-0 bg-white dark:bg-slate-800 rounded-lg border border-border flex items-center justify-center">
        <svg viewBox="0 0 40 30" className="w-10 h-8">
          {svg}
        </svg>
      </div>
      <div>
        <p className="font-bold text-sm text-text">{title}</p>
        <p className="text-xs text-text-muted mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function TenseCheatSheet({ className = '' }: { className?: string }) {
  const rows = [
    { stamp: 'Dot — one moment, then done', tense: 'Past Simple · Future Simple' },
    { stamp: 'Multiple Dots — again and again', tense: 'Present Simple' },
    { stamp: 'Duration Line — over a stretch of time', tense: 'Continuous Family' },
    { stamp: 'Arc — connected to another moment', tense: 'Perfect Family' },
    { stamp: 'Arc + Line — ongoing AND connected', tense: 'Perfect Continuous' },
  ];

  return (
    <div className={`rounded-2xl border border-primary/20 bg-primary/5 p-4 ${className}`}>
      <p className="text-sm font-bold text-primary mb-3">Stamp to Tense Cheat Sheet</p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.stamp}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg bg-white/70 dark:bg-white/5 border border-border/60 px-3 py-2"
          >
            <span className="text-xs sm:text-sm font-bold text-text">{row.stamp}</span>
            <span className="text-xs sm:text-sm font-medium text-text-muted">{row.tense}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const overviewTabs: { id: OverviewTab; label: string }[] = [
  { id: 'quick', label: 'Quick tips' },
  { id: 'build', label: 'Build' },
  { id: 'read', label: 'Read' },
];

export function HowToPlayModal({ isOpen, onClose, mode = 'overview' }: HowToPlayModalProps) {
  const [overviewTab, setOverviewTab] = useState<OverviewTab>('quick');

  const getTitle = () => {
    if (mode === 'build') return 'How to Build';
    if (mode === 'read') return 'How to Read';
    if (mode === 'challenge') return 'Challenge modes';
    return 'How to Play';
  };

  const body = (
    <div className="p-6 md:p-8">
      {mode === 'build' && <BuildContent />}
      {mode === 'read' && <ReadContent />}
      {mode === 'challenge' && <ChallengeModesContent />}
      {mode === 'overview' && (
        <div className="space-y-6">
          <div
            className="flex rounded-2xl border border-border dark:border-white/10 p-1 bg-surface-elevated/80 gap-1"
            role="tablist"
            aria-label="Help sections"
          >
            {overviewTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={overviewTab === tab.id}
                onClick={() => setOverviewTab(tab.id)}
                className={`flex-1 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold transition-colors ${
                  overviewTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-muted hover:text-text hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {overviewTab === 'quick' && <QuickTipsContent />}

          {overviewTab === 'build' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MousePointer2 className="text-secondary" size={18} />
                </div>
                <h3 className="text-base font-bold text-text uppercase tracking-wide">Build the Timeline</h3>
              </div>
              <BuildContent showCheatSheet={false} />
            </>
          )}

          {overviewTab === 'read' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="text-primary" size={18} />
                </div>
                <h3 className="text-base font-bold text-text uppercase tracking-wide">Read the Timeline</h3>
              </div>
              <ReadContent showCheatSheet={false} />
            </>
          )}

          <div className="border-t border-border dark:border-white/10 pt-6">
            <TenseCheatSheet />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      icon={<Info className="text-primary" size={24} aria-hidden />}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          Got it!
        </button>
      }
    >
      {body}
    </Dialog>
  );
}
