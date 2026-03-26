'use client';

import React from 'react';

type GameMotif =
  | 'numbers'
  | 'countable-basket'
  | 'sound-wave'
  | 'time-track'
  | 'timeline-flow'
  | 'verb-cards'
  | 'irregular-pattern'
  | 'generic-game';

function getGameMotif(activityId: string, title: string) {
  const haystack = `${activityId} ${title}`.toLowerCase();

  if (haystack.includes('numbers')) return { motif: 'numbers' as const, color: '#b692e6' };
  if (haystack.includes('countable') || haystack.includes('uncountable')) return { motif: 'countable-basket' as const, color: '#9ec3e2' };
  if (haystack.includes('sounds right') || haystack.includes('pronunciation')) return { motif: 'sound-wave' as const, color: '#7ba884' };
  if (haystack.includes('time indicator')) return { motif: 'time-track' as const, color: '#7ba884' };
  if (haystack.includes('verb forms') || haystack.includes('verb form')) return { motif: 'verb-cards' as const, color: '#7ba884' };
  if (haystack.includes('irregular')) return { motif: 'irregular-pattern' as const, color: '#7ba884' };
  if (haystack.includes('timeline')) return { motif: 'timeline-flow' as const, color: '#d97757' };

  return { motif: 'generic-game' as const, color: '#f59e0b' };
}

function VisualSvg({ motif, color }: { motif: GameMotif; color: string }) {
  const soft = `${color}22`;
  const mid = `${color}55`;

  return (
    <svg width="100%" height="54" viewBox="0 0 100 54" className="overflow-visible" aria-hidden="true">
      {motif === 'numbers' && (
        <>
          <rect x="24" y="14" width="16" height="12" rx="3" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="42" y="20" width="16" height="12" rx="3" fill="white" stroke={color} strokeWidth="2" />
          <rect x="60" y="12" width="16" height="12" rx="3" fill={soft} stroke={color} strokeWidth="2" />
          <text x="32" y="23" textAnchor="middle" fontSize="8" fontWeight="700" fill={color}>12</text>
          <text x="50" y="29" textAnchor="middle" fontSize="8" fontWeight="700" fill={color}>34</text>
          <text x="68" y="21" textAnchor="middle" fontSize="8" fontWeight="700" fill={color}>56</text>
        </>
      )}

      {motif === 'countable-basket' && (
        <>
          <path d="M28 22h24l-3 15H31l-3-15z" fill={soft} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M33 22c1-5 4-8 7-8s6 3 7 8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="64" cy="20" r="5" fill="white" stroke={color} strokeWidth="2" />
          <path d="M72 18h8M72 24h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {motif === 'sound-wave' && (
        <>
          <circle cx="30" cy="27" r="4" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M38 22c4 2 4 8 0 10M45 18c7 5 7 13 0 18M54 14c10 8 10 18 0 26" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="69" cy="27" r="5" fill="white" stroke={color} strokeWidth="2" />
          <path d="M67 25l4 4M71 25l-4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}

      {motif === 'time-track' && (
        <>
          <circle cx="28" cy="24" r="8" fill={soft} stroke={color} strokeWidth="2" />
          <path d="M28 20v5l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 30c8-10 16-10 24 0s16 10 24 0" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="52" cy="24" r="2.2" fill={mid} />
          <circle cx="76" cy="24" r="2.2" fill={color} />
        </>
      )}

      {motif === 'timeline-flow' && (
        <>
          <path d="M18 28H82" stroke={mid} strokeWidth="3.5" strokeLinecap="round" />
          <rect x="48.5" y="16" width="3" height="24" rx="1.5" fill="#10b981" />
          <path d="M22 28c9-10 18-10 27 0" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M52 28c9-10 18-10 27 0" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="22" cy="28" r="2.6" fill={color} />
          <circle cx="78" cy="28" r="2.6" fill={color} />
        </>
      )}

      {motif === 'verb-cards' && (
        <>
          <rect x="22" y="16" width="14" height="18" rx="3" fill={soft} stroke={color} strokeWidth="2" />
          <rect x="42" y="12" width="14" height="22" rx="3" fill="white" stroke={color} strokeWidth="2" />
          <rect x="62" y="16" width="14" height="18" rx="3" fill={soft} stroke={color} strokeWidth="2" />
          <text x="29" y="28" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={color}>V1</text>
          <text x="49" y="27" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={color}>V2</text>
          <text x="69" y="28" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={color}>V3</text>
        </>
      )}

      {motif === 'irregular-pattern' && (
        <>
          <path d="M24 34l10-14 8 8 12-16 12 12" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="34" r="2.5" fill={soft} stroke={color} strokeWidth="1.8" />
          <circle cx="42" cy="28" r="2.5" fill="white" stroke={color} strokeWidth="1.8" />
          <circle cx="66" cy="24" r="2.5" fill={soft} stroke={color} strokeWidth="1.8" />
        </>
      )}

      {motif === 'generic-game' && (
        <>
          <rect x="28" y="18" width="44" height="18" rx="8" fill="white" stroke={color} strokeWidth="2" />
          <path d="M38 27h8M42 23v8M58 24h0M64 30h0" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function getGameCardCopy(activityId: string, title: string) {
  const haystack = `${activityId} ${title}`.toLowerCase();

  if (haystack.includes('verb forms')) {
    return { friendlyTitle: 'Verb forms challenge', useThisFor: 'practice present, past, and participle forms quickly' };
  }
  if (haystack.includes('irregular')) {
    return { friendlyTitle: 'Irregular verb patterns', useThisFor: 'spot and remember common irregular verb groups' };
  }
  if (haystack.includes('time indicator')) {
    return { friendlyTitle: 'Time indicators', useThisFor: 'match time clues to the correct tense choice' };
  }
  if (haystack.includes('sounds right')) {
    return { friendlyTitle: 'Pick the word that sounds right', useThisFor: 'listen for the verb form that sounds natural in context' };
  }
  if (haystack.includes('countable') || haystack.includes('uncountable')) {
    return { friendlyTitle: 'Countable vs. uncountable', useThisFor: 'sort nouns by how we talk about quantity' };
  }
  if (haystack.includes('numbers')) {
    return { friendlyTitle: 'Numbers game', useThisFor: 'build speed and confidence reading numbers in English' };
  }
  if (haystack.includes('gerund') || haystack.includes('infinitive')) {
    return { friendlyTitle: 'Gerunds & Infinitives Patterns Game', useThisFor: 'practice key patterns through quick challenges' };
  }
  if (haystack.includes('timeline')) {
    return { friendlyTitle: 'Timeline Game', useThisFor: 'visualize tenses and match verbs to moments on a timeline' };
  }

  return { friendlyTitle: 'Language game', useThisFor: 'practice key patterns through quick challenges' };
}

export function GameActivityVisual({
  activityId,
  title,
}: {
  activityId: string;
  title: string;
}) {
  const spec = getGameMotif(activityId, title);
  return <VisualSvg {...spec} />;
}
