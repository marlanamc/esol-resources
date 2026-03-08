'use client';

import React from 'react';
import { TenseTimeline, getTenseTimelineConfig } from './TenseTimeline';

type MotifKind =
  | 'podium'
  | 'quotes'
  | 'articles'
  | 'map-clock'
  | 'fork-path'
  | 'question'
  | 'megaphone'
  | 'word-pills'
  | 'spotlight'
  | 'briefcase-arrows'
  | 'workflow'
  | 'punctuation'
  | 'paragraph'
  | 'rewind-choice'
  | 'lab-reaction'
  | 'branch'
  | 'mosaic';

type GrammarGuideVisualSpec =
  | {
      kind: 'timeline';
    }
  | {
      kind: 'motif';
      motif: MotifKind;
      color: string;
    };

const MOTIF_VISUALS: Array<{ pattern: RegExp; motif: MotifKind; color: string }> = [
  { pattern: /\bsuperlatives?\b|\bquantifiers?\b/i, motif: 'podium', color: '#d97706' },
  { pattern: /\breported speech\b/i, motif: 'quotes', color: '#2563eb' },
  { pattern: /\barticles?\b/i, motif: 'articles', color: '#0f766e' },
  { pattern: /\bprepositions? of time\s*&\s*place\b/i, motif: 'map-clock', color: '#0891b2' },
  { pattern: /\bgerunds?\b|\binfinitives?\b/i, motif: 'fork-path', color: '#7c3aed' },
  { pattern: /\binformation questions?\b/i, motif: 'question', color: '#0284c7' },
  { pattern: /\bimperatives?\b|\bdeclaratives?\b/i, motif: 'megaphone', color: '#ea580c' },
  { pattern: /\bparts of speech\b/i, motif: 'word-pills', color: '#7c3aed' },
  { pattern: /\bpassive voice\b/i, motif: 'spotlight', color: '#64748b' },
  { pattern: /\bworkplace phrasal verbs\b/i, motif: 'briefcase-arrows', color: '#0f766e' },
  { pattern: /\bpunctuation\b|\bcapitalization\b/i, motif: 'punctuation', color: '#dc2626' },
  { pattern: /\bparagraph format\b/i, motif: 'paragraph', color: '#2563eb' },
  { pattern: /\bused to\b|\bwould rather\b/i, motif: 'rewind-choice', color: '#b45309' },
  { pattern: /\bzero\s*&\s*first conditionals?\b/i, motif: 'lab-reaction', color: '#0ea5a4' },
  { pattern: /\bsecond\s*&\s*third conditionals?\b/i, motif: 'branch', color: '#16a34a' },
  { pattern: /\breview\b|\boverview\b|\bcycle 1\b/i, motif: 'mosaic', color: '#a16207' },
  { pattern: /\bmodals?\b/i, motif: 'workflow', color: '#7c3aed' },
];

function getGrammarGuideVisualSpec(title: string): GrammarGuideVisualSpec | null {
  if (getTenseTimelineConfig(title)) {
    return { kind: 'timeline' };
  }

  const normalizedTitle = title.replace(/\s*guide\s*$/i, '').trim();
  const match = MOTIF_VISUALS.find(({ pattern }) => pattern.test(normalizedTitle));

  if (!match) return null;

  return {
    kind: 'motif',
    motif: match.motif,
    color: match.color,
  };
}

function MotifCanvas({ motif, color }: { motif: MotifKind; color: string }) {
  const soft = `${color}22`;
  const mid = `${color}55`;

  return (
    <svg width="100%" height="54" viewBox="0 0 100 54" className="overflow-visible" aria-hidden="true">
      {motif === 'podium' && (
        <>
          <rect x="18" y="30" width="18" height="12" rx="3" fill={mid} />
          <rect x="40" y="22" width="20" height="20" rx="3" fill={color} />
          <rect x="64" y="27" width="18" height="15" rx="3" fill={mid} />
          <circle cx="50" cy="16" r="6" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M46 16h8M50 12v8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'quotes' && (
        <>
          <path d="M20 28c0-7 6-12 14-12h10v12H32c-1 0-2 1-2 2v6H20v-8z" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M56 18c0-6 5-10 12-10h12v11H69c-1 0-2 1-2 2v7H56v-10z" fill="white" stroke={color} strokeWidth="2" />
          <path d="M34 22h0M66 15h0" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <path d="M41 22h0M73 15h0" stroke={color} strokeWidth="4" strokeLinecap="round" />
          <path d="M43 34c5 0 8-2 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'articles' && (
        <>
          <rect x="18" y="18" width="18" height="18" rx="4" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="41" y="14" width="18" height="22" rx="4" fill="white" stroke={color} strokeWidth="2" />
          <rect x="64" y="18" width="18" height="18" rx="4" fill={soft} stroke={color} strokeWidth="2" />
          <text x="27" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>A</text>
          <text x="50" y="29" textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>AN</text>
          <text x="73" y="30" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={color}>THE</text>
        </>
      )}

      {motif === 'map-clock' && (
        <>
          <circle cx="31" cy="24" r="9" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M31 19v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M64 14c-6 0-10 4-10 9 0 8 10 18 10 18s10-10 10-18c0-5-4-9-10-9z" fill="white" stroke={color} strokeWidth="2" />
          <circle cx="64" cy="23" r="3.5" fill={mid} />
          <path d="M18 39h64" stroke={color} strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'fork-path' && (
        <>
          <path d="M50 39V20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 20C50 13 42 10 32 10" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M50 20C50 13 58 10 68 10" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="32" cy="10" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="68" cy="10" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <text x="32" y="13" textAnchor="middle" fontSize="7" fontWeight="700" fill={color}>-ing</text>
          <text x="68" y="13" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={color}>to</text>
        </>
      )}

      {motif === 'question' && (
        <>
          <circle cx="50" cy="20" r="14" fill={soft} />
          <path d="M43 18c0-4 3-7 8-7 4 0 7 2 7 6 0 6-7 6-7 11" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="51" cy="34" r="2.5" fill={color} />
          <path d="M22 40h56" stroke={color} strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'megaphone' && (
        <>
          <path d="M24 28l22-10v20L24 28z" fill={soft} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M46 20c8 0 14-4 20-8v32c-6-4-12-8-20-8" fill="white" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M71 18c4 2 6 6 6 10s-2 8-6 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'word-pills' && (
        <>
          <rect x="18" y="12" width="22" height="10" rx="5" fill={soft} stroke={color} strokeWidth="1.8" />
          <rect x="44" y="22" width="18" height="10" rx="5" fill="white" stroke={color} strokeWidth="1.8" />
          <rect x="64" y="12" width="18" height="10" rx="5" fill={soft} stroke={color} strokeWidth="1.8" />
          <rect x="30" y="34" width="20" height="10" rx="5" fill="white" stroke={color} strokeWidth="1.8" />
          <path d="M40 18h24M53 22v10M39 34l-8-12" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.5" />
        </>
      )}

      {motif === 'spotlight' && (
        <>
          <path d="M42 10h16l8 12H34l8-12z" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M38 22h24l-9 18H47L38 22z" fill="white" stroke={color} strokeWidth="2" />
          <circle cx="50" cy="31" r="5" fill={mid} />
        </>
      )}

      {motif === 'briefcase-arrows' && (
        <>
          <rect x="18" y="18" width="22" height="16" rx="3.5" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M25 18v-3.5c0-2 1.5-3.5 3.5-3.5h1c2 0 3.5 1.5 3.5 3.5V18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />

          <rect x="58" y="20" width="22" height="16" rx="3.5" fill="white" stroke={color} strokeWidth="2" />
          <path d="M65 20v-3.5c0-2 1.5-3.5 3.5-3.5h1c2 0 3.5 1.5 3.5 3.5V20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />

          <path d="M42 26h10" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M49 22l5 4-5 4" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

          <path d="M56 40c-4 2-8 3-12 3-6 0-10-2-14-6" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'workflow' && (
        <>
          <rect x="18" y="20" width="16" height="12" rx="3" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="42" y="12" width="16" height="12" rx="3" fill="white" stroke={color} strokeWidth="2" />
          <rect x="66" y="24" width="16" height="12" rx="3" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M34 26h8M58 18h8M58 18l-3-3M58 18l-3 3M82 30l-3-3M82 30l-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {motif === 'punctuation' && (
        <>
          <path d="M18 38h64" stroke={color} strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
          <text x="30" y="24" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>?</text>
          <text x="50" y="25" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>!</text>
          <text x="68" y="24" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>A</text>
          <path d="M63 28h10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}

      {motif === 'paragraph' && (
        <>
          <rect x="22" y="10" width="56" height="30" rx="5" fill="white" stroke={color} strokeWidth="2" />
          <path d="M32 18h36M32 24h30M32 30h34M32 36h24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.55" />
          <rect x="22" y="10" width="8" height="30" rx="5" fill={soft} />
        </>
      )}

      {motif === 'rewind-choice' && (
        <>
          <path d="M32 36c-8-2-13-8-13-15 0-7 5-12 13-14" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M25 7l7 0-4-5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 36V18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 18c0-5 5-8 12-8" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 18c0-5 7-2 16 4" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="65" cy="10" r="4" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="72" cy="24" r="4" fill={soft} stroke={color} strokeWidth="2" />
        </>
      )}

      {motif === 'lab-reaction' && (
        <>
          <path d="M26 12v10l-8 14c-1.5 2.5.2 5 3.2 5h17.6c3 0 4.7-2.5 3.2-5l-8-14V12" fill="white" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M21 29h16" stroke={color} strokeOpacity="0.3" strokeWidth="2" />
          <path d="M24 33c3-2 5 1 8-1s4 1 6 0" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="28" cy="25" r="1.7" fill={mid} />
          <circle cx="33" cy="21" r="1.4" fill={mid} />
          <path d="M46 27h12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M55 23l5 4-5 4" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M64 17c0-4 3-7 8-7 4 0 7 2 7 6 0 5-6 5-6 9" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="73" cy="33" r="2.2" fill={color} />
        </>
      )}

      {motif === 'branch' && (
        <>
          <path d="M50 40V22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 22C50 15 40 12 28 12" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M50 22C50 15 60 12 72 12" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="28" cy="12" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="72" cy="12" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M26 12l1.5 1.5 3-3" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M69 9l6 6M75 9l-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}

      {motif === 'mosaic' && (
        <>
          <rect x="24" y="10" width="14" height="10" rx="3" fill={soft} stroke={color} strokeWidth="1.8" />
          <rect x="42" y="10" width="14" height="10" rx="3" fill="white" stroke={color} strokeWidth="1.8" />
          <rect x="60" y="10" width="14" height="10" rx="3" fill={soft} stroke={color} strokeWidth="1.8" />
          <rect x="33" y="24" width="14" height="10" rx="3" fill="white" stroke={color} strokeWidth="1.8" />
          <rect x="51" y="24" width="14" height="10" rx="3" fill={soft} stroke={color} strokeWidth="1.8" />
          <path d="M38 20l2 4M49 20v4M60 20l-2 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.5" />
        </>
      )}
    </svg>
  );
}

export function GrammarGuideVisual({
  title,
  isCompleted = false,
}: {
  title: string;
  isCompleted?: boolean;
}) {
  const spec = getGrammarGuideVisualSpec(title);
  if (!spec) return null;

  if (spec.kind === 'timeline') {
    const timelineConfig = getTenseTimelineConfig(title);
    if (!timelineConfig) return null;

    return (
      <TenseTimeline
        position={timelineConfig.position}
        markerStyle={timelineConfig.markerStyle}
        color={isCompleted ? 'var(--secondary-color)' : timelineConfig.color}
        example={timelineConfig.example}
        showLabels={true}
        size="sm"
      />
    );
  }

  return <MotifCanvas motif={spec.motif} color={isCompleted ? '#7ba884' : spec.color} />;
}

export function hasGrammarGuideVisual(title: string): boolean {
  return getGrammarGuideVisualSpec(title) !== null;
}
