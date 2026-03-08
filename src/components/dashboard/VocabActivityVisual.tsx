'use client';

import React from 'react';

type VocabMotif =
  | 'flashcards'
  | 'matching'
  | 'fill-blank'
  | 'scramble'
  | 'hello-people'
  | 'daily-calendar'
  | 'community-network'
  | 'shopping-cart'
  | 'housing'
  | 'work'
  | 'career'
  | 'health'
  | 'wellness'
  | 'academic'
  | 'book-stack';

type VocabVisualSpec = {
  motif: VocabMotif;
  color: string;
};

function getVocabVisualSpec({
  activityId,
  title,
  unitNumber,
}: {
  activityId: string;
  title: string;
  unitNumber?: number | null;
}): VocabVisualSpec {
  const id = activityId.toLowerCase();
  const normalizedTitle = title.toLowerCase();

  if (id.includes('flashcard') || normalizedTitle.includes('flashcard')) {
    return { motif: 'flashcards', color: '#2563eb' };
  }

  if (id.includes('matching') || normalizedTitle.includes('matching')) {
    return { motif: 'matching', color: '#7c3aed' };
  }

  if (id.includes('fill') || normalizedTitle.includes('fill in') || normalizedTitle.includes('fill-in')) {
    return { motif: 'fill-blank', color: '#0891b2' };
  }

  if (id.includes('scramble') || normalizedTitle.includes('scramble')) {
    return { motif: 'scramble', color: '#ea580c' };
  }

  switch (unitNumber) {
    case 1:
      return { motif: 'hello-people', color: '#2563eb' };
    case 2:
      return { motif: 'daily-calendar', color: '#0891b2' };
    case 3:
      return { motif: 'community-network', color: '#0d9488' };
    case 4:
      return { motif: 'shopping-cart', color: '#16a34a' };
    case 5:
      return { motif: 'housing', color: '#65a30d' };
    case 6:
      return { motif: 'work', color: '#d97706' };
    case 7:
      return { motif: 'career', color: '#ea580c' };
    case 8:
      return { motif: 'health', color: '#dc2626' };
    case 9:
      return { motif: 'wellness', color: '#c026d3' };
    case 10:
      return { motif: 'academic', color: '#7c3aed' };
    default:
      return { motif: 'book-stack', color: '#2563eb' };
  }
}

function VisualSvg({ motif, color }: VocabVisualSpec) {
  const soft = `${color}22`;
  const mid = `${color}55`;

  return (
    <svg width="100%" height="54" viewBox="0 0 100 54" className="overflow-visible" aria-hidden="true">
      {motif === 'flashcards' && (
        <>
          <rect x="22" y="15" width="22" height="16" rx="3" fill={soft} stroke={color} strokeWidth="2" transform="rotate(-8 33 23)" />
          <rect x="38" y="13" width="24" height="18" rx="3" fill="white" stroke={color} strokeWidth="2" />
          <rect x="56" y="17" width="22" height="16" rx="3" fill={soft} stroke={color} strokeWidth="2" transform="rotate(8 67 25)" />
          <path d="M44 21h12M44 26h8" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </>
      )}

      {motif === 'matching' && (
        <>
          <rect x="18" y="18" width="22" height="12" rx="6" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="60" y="18" width="22" height="12" rx="6" fill="white" stroke={color} strokeWidth="2" />
          <path d="M40 24h18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="49" cy="24" r="3.5" fill={mid} />
        </>
      )}

      {motif === 'fill-blank' && (
        <>
          <path d="M18 20h20M46 20h10M18 32h12M36 32h22" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
          <rect x="34" y="15" width="10" height="10" rx="2" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M35 40h30" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}

      {motif === 'scramble' && (
        <>
          <rect x="22" y="16" width="12" height="12" rx="3" fill={soft} stroke={color} strokeWidth="2" transform="rotate(-8 28 22)" />
          <rect x="40" y="14" width="12" height="12" rx="3" fill="white" stroke={color} strokeWidth="2" />
          <rect x="58" y="18" width="12" height="12" rx="3" fill={soft} stroke={color} strokeWidth="2" transform="rotate(8 64 24)" />
          <path d="M30 34c8 5 26 5 34 0" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        </>
      )}

      {motif === 'housing' && (
        <>
          <path d="M22 31l16-13 16 13" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 29v11h22V29" fill="white" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="35" y="31" width="6" height="9" rx="1.5" fill={soft} stroke={color} strokeWidth="1.6" />
          <path d="M58 39h18" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        </>
      )}

      {motif === 'hello-people' && (
        <>
          <circle cx="32" cy="18" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="50" cy="14" r="5" fill="white" stroke={color} strokeWidth="2" />
          <circle cx="68" cy="18" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M26 34c0-5 4-8 10-8s10 3 10 8M44 34c0-6 4-10 12-10s12 4 12 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'daily-calendar' && (
        <>
          <rect x="24" y="12" width="26" height="22" rx="4" fill="white" stroke={color} strokeWidth="2" />
          <path d="M24 20h26" stroke={color} strokeWidth="2" />
          <path d="M31 10v6M43 10v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <rect x="31" y="24" width="6" height="5" rx="1.5" fill={soft} stroke={color} strokeWidth="1.5" />
          <path d="M58 33c6-1 10-5 12-11" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M66 20h6v6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {motif === 'community-network' && (
        <>
          <circle cx="30" cy="18" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="50" cy="14" r="5" fill="white" stroke={color} strokeWidth="2" />
          <circle cx="70" cy="18" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="40" cy="33" r="5" fill="white" stroke={color} strokeWidth="2" />
          <circle cx="60" cy="33" r="5" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M34 21l12 8M54 29l12-8M45 18l-10 10M55 18l10 10M45 33h10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}

      {motif === 'shopping-cart' && (
        <>
          <path d="M24 18h6l4 15h22l5-11H34" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="40" cy="38" r="3" fill={soft} stroke={color} strokeWidth="2" />
          <circle cx="56" cy="38" r="3" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M62 17l5 5 9-9" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {motif === 'work' && (
        <>
          <rect x="26" y="17" width="24" height="18" rx="3.5" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M33 17v-4c0-2 1.5-3.5 3.5-3.5h3c2 0 3.5 1.5 3.5 3.5v4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M50 26h14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M59 22l5 4-5 4" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {motif === 'career' && (
        <>
          <path d="M24 38h52" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.28" />
          <rect x="28" y="28" width="10" height="10" rx="2" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="43" y="22" width="10" height="16" rx="2" fill="white" stroke={color} strokeWidth="2" />
          <rect x="58" y="15" width="10" height="23" rx="2" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M70 16l6-6" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M71 10h5v5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {motif === 'health' && (
        <>
          <rect x="26" y="16" width="28" height="20" rx="4" fill="white" stroke={color} strokeWidth="2" />
          <path d="M40 20v12M34 26h12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 26h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="76" cy="26" r="3" fill={mid} />
        </>
      )}

      {motif === 'wellness' && (
        <>
          <path d="M50 38c-10-6-16-13-16-21 0-5 3-8 7-8 4 0 7 2 9 6 2-4 5-6 9-6 4 0 7 3 7 8 0 8-6 15-16 21z" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M40 27c3 2 7 2 10 0s6-2 10 0" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
        </>
      )}

      {motif === 'academic' && (
        <>
          <path d="M50 14l20 9-20 9-20-9 20-9z" fill={soft} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M38 28v8c4 3 8 4 12 4s8-1 12-4v-8" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 23v10" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="70" cy="35" r="2.2" fill={color} />
        </>
      )}

      {motif === 'book-stack' && (
        <>
          <rect x="24" y="15" width="26" height="8" rx="2" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="28" y="24" width="26" height="8" rx="2" fill="white" stroke={color} strokeWidth="2" />
          <rect x="32" y="33" width="26" height="8" rx="2" fill={soft} stroke={color} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export function VocabActivityVisual({
  activityId,
  title,
  unitNumber,
}: {
  activityId: string;
  title: string;
  unitNumber?: number | null;
}) {
  const spec = getVocabVisualSpec({ activityId, title, unitNumber });
  return <VisualSvg {...spec} />;
}
