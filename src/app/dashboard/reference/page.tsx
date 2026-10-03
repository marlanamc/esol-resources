'use client';

import Link from 'next/link';
import { ComparisonTable } from '@/components/grammar-reader/ComparisonTable';
import { TipBox } from '@/components/grammar-reader/TipBox';
import { TimelineCanvas } from '@/components/games/TimelineTensesGame/TimelineCanvas';
import { PrepositionIcon } from '@/components/reference/PrepositionIcon';
import type { TimelineElement, TimelineZone } from '@/types/activity';
import { sanitizeHtml } from '@/utils/sanitize';
import {
  REFERENCE_SECTIONS,
  REFERENCE_FAMILIES,
  getModalCertaintyColor,
  type ReferenceSection,
  type ModalScaleEntry,
} from '@/content/reference-sheets/esol-3b-grammar';

/** Box + dot/arrow "picture" grid for prepositions of space/movement. */
function PrepositionGrid({ icons }: { icons: NonNullable<ReferenceSection['prepositionIcons']> }) {
  return (
    <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {icons.map(({ kind, label }) => (
        <div key={kind} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-bg-light p-2 text-center">
          <PrepositionIcon kind={kind} size={64} />
          <span className="text-xs font-semibold text-text">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Full present/future vs. past modal table (restores the original PDF's main modals table). */
function ModalsTable({ rows }: { rows: NonNullable<ReferenceSection['modalsTable']> }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-light">
            <th className="px-3 py-2 text-left font-semibold">Modal</th>
            <th className="px-3 py-2 text-left font-semibold">Present / Future</th>
            <th className="px-3 py-2 text-left font-semibold">Past</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.modal} className="border-t border-border">
              <td className="px-3 py-2 font-semibold text-text">{row.modal}</td>
              <td className="px-3 py-2 text-text">{row.present}</td>
              <td className="px-3 py-2 text-text">{row.past}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Labeled verb/word-group lists (gerund/infinitive verbs, reporting verbs, etc.). */
function WordLists({ lists }: { lists: NonNullable<ReferenceSection['wordLists']> }) {
  return (
    <div className="my-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {lists.map((list) => (
        <div key={list.title} className="rounded-xl border border-border bg-bg-light p-3">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">{list.title}</h5>
          <p className="text-sm text-text">{list.words.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

/** Builds a plain-language description of a game timeline diagram for screen readers. */
function describeTimelineElements(elements: TimelineElement[], title: string): string {
  const zoneLabel: Record<TimelineZone, string> = {
    past: 'the past',
    'past-earlier': 'an earlier point in the past',
    'past-later': 'a later point in the past',
    present: 'now',
    future: 'the future',
  };
  const typeLabel: Record<TimelineElement['type'], string> = {
    'single-dot': 'a single moment',
    'multiple-dots': 'a repeated, habitual action',
    'solid-line': 'an action in progress',
    'solid-to-now': 'an action in progress leading up to now',
    'solid-to-point': 'an action in progress leading up to a point',
    arc: 'a connection to another point in time',
    'arc-dashed': 'a connection to another point in time',
    'dashed-line': 'an action in progress',
  };
  const parts = elements.map((el) => `${typeLabel[el.type] ?? 'a marker'} in ${zoneLabel[el.zone]}`);
  return `Timeline diagram for ${title}: shows ${parts.join(', and ')}, on the Past–Now–Future line.`;
}

/** The 3-row Affirmative / Negative / Question formula table — real game data, not re-authored. */
function FormulaTriplet({ formulas }: { formulas: { affirmative: string; negative: string; question: string } }) {
  const rows: [string, string][] = [
    ['Affirmative', formulas.affirmative],
    ['Negative', formulas.negative],
    ['Question', formulas.question],
  ];
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-border last:border-0">
              <td className="w-28 bg-bg-light px-3 py-2 font-semibold text-text-muted">{label}</td>
              <td className="px-3 py-2 font-mono text-text">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Modal certainty/obligation scale (low → high). Color darkens with percent,
 * but the percent number and position on the bar are the primary signal, so
 * this still works for colorblind readers and in grayscale.
 */
function CertaintyScale({ entries }: { entries: ModalScaleEntry[] }) {
  return (
    <div className="my-6" role="img" aria-label={`Certainty and obligation scale from ${entries[0].percent}% to ${entries[entries.length - 1].percent}%: ${entries.map((e) => `${e.word} at ${e.percent}%`).join(', ')}.`}>
      <div className="relative h-2 rounded-full bg-gradient-to-r from-[#e0a870] to-[#9a5e28] mb-3" aria-hidden="true" />
      <ul className="space-y-2">
        {entries.map((entry) => {
          const color = getModalCertaintyColor(entry.percent);
          return (
            <li key={entry.word} className="flex items-start gap-3 text-sm sm:text-base">
              <span
                className="mt-0.5 inline-flex min-w-[3.5rem] justify-center rounded-full border px-2 py-0.5 text-xs font-bold shrink-0"
                style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
              >
                {entry.percent}%
              </span>
              <span className="text-text">
                <span className="font-bold" style={{ color }}>{entry.word}</span>
                {' — '}
                {entry.example}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Sections without a `formula` (parts of speech, adverbs of frequency, etc.)
 * author their own inline <b> emphasis in content data, so they render here
 * via sanitizeHtml rather than ExampleBox's plain-text path (which is reserved
 * for examples paired with a `formula`, where the matching word is auto-bolded).
 */
function RichExampleList({ examples }: { examples: string[] }) {
  return (
    <div className="my-6 space-y-2">
      <h4 className="text-base font-bold text-text">Examples</h4>
      <ul className="space-y-2">
        {examples.map((example, index) => (
          <li
            key={index}
            className="rounded-xl border-l-4 border-success px-4 py-3 text-sm sm:text-base text-text"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(example) }}
          />
        ))}
      </ul>
    </div>
  );
}

function FamilyBadge({ familyId }: { familyId: ReferenceSection['familyId'] }) {
  const family = REFERENCE_FAMILIES[familyId];
  if (!family) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        color: family.textColor,
        borderColor: `${family.color}55`,
        backgroundColor: `${family.color}14`,
      }}
    >
      <span aria-hidden="true" style={{ color: family.color }}>{family.shape}</span>
      {family.label}
    </span>
  );
}

function ReferenceCard({ section }: { section: ReferenceSection }) {
  const family = REFERENCE_FAMILIES[section.familyId];

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="rounded-2xl border-2 bg-[var(--color-surface-elevated)] p-5 sm:p-6 shadow-sm"
      style={{ borderColor: `${family?.color ?? 'var(--border)'}33` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 id={`${section.id}-heading`} className="flex items-center gap-2 text-xl font-bold text-text font-display">
          <span aria-hidden="true">{section.icon}</span>
          {section.title}
        </h2>
        <FamilyBadge familyId={section.familyId} />
      </div>

      <p className="text-sm sm:text-base text-text-muted mb-2">{section.rule}</p>

      {section.timelineElements && (
        <div
          role="img"
          aria-label={describeTimelineElements(section.timelineElements, section.title)}
          className="my-4 max-w-md mx-auto"
        >
          <TimelineCanvas elements={section.timelineElements} showLabels />
        </div>
      )}

      {section.formulas && <FormulaTriplet formulas={section.formulas} />}
      {section.examples && <RichExampleList examples={section.examples} />}
      {section.prepositionIcons && <PrepositionGrid icons={section.prepositionIcons} />}
      {section.modalsTable && <ModalsTable rows={section.modalsTable} />}
      {section.certaintyScale && <CertaintyScale entries={section.certaintyScale} />}
      {section.comparison && <ComparisonTable comparison={section.comparison} />}
      {section.extraComparisons?.map((c) => <ComparisonTable key={c.title} comparison={c} />)}
      {section.wordLists && <WordLists lists={section.wordLists} />}
      {section.tip && <TipBox tip={section.tip} />}

      {section.quickCheck && (
        <p className="mt-2 text-sm text-text-muted">
          <span className="font-semibold text-text">Quick check:</span> {section.quickCheck}
        </p>
      )}

      {section.fullGuideSlug && (
        <Link
          href={`/grammar-reader/${section.fullGuideSlug}`}
          className="mt-4 inline-block text-sm font-semibold underline underline-offset-2"
          style={{ color: family?.textColor }}
        >
          Need more practice? Open the full guide →
        </Link>
      )}
    </section>
  );
}

export default function ReferenceSheetPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-4 py-8 sm:py-10"
      style={{ fontFamily: 'var(--font-legible)' }}
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text font-display mb-2">ESOL 3B Quick Reference</h1>
        <p className="text-text-muted">
          Your pocket grammar guide — the same colors and timelines you see in the tenses game, condensed to one page per topic.
        </p>
        <nav aria-label="Jump to topic" className="mt-4 flex flex-wrap gap-2">
          {REFERENCE_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-muted hover:text-text hover:border-primary/40"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-6">
        {REFERENCE_SECTIONS.map((section) => (
          <ReferenceCard key={section.id} section={section} />
        ))}
      </div>
    </main>
  );
}
