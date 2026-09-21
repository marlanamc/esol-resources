import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import { AnswerFeedback } from '@/components/games/TimelineTensesGame/AnswerFeedback';
import { FeedbackPanel } from '@/components/games/TimelineTensesGame/FeedbackPanel';
import type { TimelineVerbBlankResult } from '@/components/games/TimelineTensesGame/timelineTensesUtils';

const accepted = { answer: 'have worked', tenseName: 'Present Perfect', explanation: 'Still true now.' };
const alternative = { answer: 'have been working', tenseName: 'Present Perfect Continuous', explanation: 'An ongoing activity.' };
const blanks: TimelineVerbBlankResult[] = [
  { blankId: 'one', blankIndex: 0, promptLabel: 'work', userAnswer: 'have been working', isCorrect: true, matchedAnswer: alternative, validAnswers: [accepted, alternative] },
  { blankId: 'two', blankIndex: 1, promptLabel: 'live', userAnswer: '', isCorrect: false, matchedAnswer: null, validAnswers: [{ ...accepted, answer: 'have lived' }] },
];

describe('Compact timeline feedback', () => {
  it('keeps navigation ahead of collapsed teaching details and outside the live result', () => {
    const root = parse(renderToStaticMarkup(React.createElement(AnswerFeedback, {
      feedbackKey: 'first', isCorrect: false, answer: 'She worked yesterday.',
      details: 'Yesterday is finished past time.', onContinue: () => {},
    })));
    const section = root.querySelector('section')!;
    expect(section.childNodes.filter((node) => node.nodeType === 1).map((node) => (node as unknown as { rawTagName: string }).rawTagName)).toEqual(['div', 'button', 'details']);
    expect(root.querySelector('details')!.hasAttribute('open')).toBe(false);
    expect(root.querySelector('[role=status]')!.textContent).toContain('Not quite');
    expect(root.querySelector('[role=status]')!.textContent).not.toContain('Yesterday is finished');
    expect(root.querySelector('button')!.textContent).toBe('Next Question');
  });

  it('preserves accepted alternatives, completes each blank, and only corrects mistakes', () => {
    const root = parse(renderToStaticMarkup(React.createElement(FeedbackPanel, {
      feedbackKey: 'multi', isCorrect: false, tenseName: 'Present Perfect',
      explanation: 'Both actions started in the past.', onContinue: () => {},
      sentenceTemplate: 'I ___[work]___ here and ___[live]___ nearby.', blankFeedback: blanks,
    })));
    const answer = root.querySelector('[role=status]')!.textContent;
    expect(answer).toContain('I have been working here and have lived nearby.');
    expect(answer).toContain('live: (missing) → have lived');
    expect(answer).not.toContain('work:');
    expect(root.querySelector('details')!.textContent).toContain('Both actions');
  });

  it('shows a wrong typed answer with its correction without duplicating successful blanks', () => {
    const root = parse(renderToStaticMarkup(React.createElement(FeedbackPanel, {
      feedbackKey: 'wrong', isCorrect: false, tenseName: 'Present Perfect',
      explanation: 'An action continuing until now.', onContinue: () => {},
      sentenceTemplate: 'I ___[work]___ here.', blankFeedback: [{ ...blanks[0], isCorrect: false, matchedAnswer: null, userAnswer: 'worked' }],
    })));
    expect(root.querySelector('[role=status]')!.textContent).toContain('work: worked → have worked');
  });

  it('supports the final action and story review label', () => {
    const root = parse(renderToStaticMarkup(React.createElement(AnswerFeedback, {
      feedbackKey: 'last', isCorrect: true, answer: '4 / 4 sentences correct',
      details: 'The completed story.', detailsLabel: 'Review story', continueLabel: 'See Results', onContinue: () => {},
    })));
    expect(root.querySelector('button')!.textContent).toBe('See Results');
    expect(root.querySelector('summary')!.textContent).toBe('Review story');
    expect(root.querySelector('[role=status]')!.textContent).toContain('Correct');
  });
});
