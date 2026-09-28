import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { REVIEW_LESSONS, reviewSentence } from '@/lib/parts-of-speech-review/content';
import { applyReviewAttempt, scoreReviewAttempt, preserveReviewProgress, type ReviewAttempt } from '@/lib/parts-of-speech-review/progression';
import { DiagramSentence } from '@/components/games/PartsOfSpeechGame/DiagramSentence';

function attempt(lessonId: ReviewAttempt['lessonId'] = 'nouns-verbs'): ReviewAttempt {
  return { version: 1, attemptId: '11111111-1111-4111-8111-111111111111', lessonId,
    answers: REVIEW_LESSONS[lessonId].questions.map(q => ({ questionId: q.id, answer: q.answer })) };
}
describe('Short Parts of Speech review', () => {
  it('covers eight mixed nouns/verbs including state verbs, and nine optional questions', () => {
    expect(REVIEW_LESSONS['nouns-verbs'].questions).toHaveLength(8);
    expect(REVIEW_LESSONS['more-word-jobs'].questions).toHaveLength(9);
    for (const word of ['is', 'have', 'need']) expect(REVIEW_LESSONS['nouns-verbs'].questions.find(q => q.target === word)?.answer).toBe('Verb');
    for (const lesson of Object.values(REVIEW_LESSONS)) {
      expect(new Set(lesson.questions.map(q => q.id)).size).toBe(lesson.questions.length);
      for (const q of [...lesson.questions, ...lesson.examples]) {
        expect(q.target.trim()).toBe(q.target);
        expect(q.target.length).toBeGreaterThan(0);
        expect(reviewSentence(q)).not.toMatch(/\s+[.,!?]/);
        expect(lesson.categories).toContain(q.answer);
        expect(q.explanation.length).toBeGreaterThan(10);
      }
    }
  });
  it('scores from authored answers and rejects partial, duplicate, unknown, and wrong-category answers', () => {
    expect(scoreReviewAttempt(attempt()).correct).toBe(8);
    const wrong = attempt(); wrong.answers[0].answer = 'Verb';
    expect(scoreReviewAttempt(wrong).correct).toBe(7);
    expect(() => scoreReviewAttempt({ ...attempt(), correct: 8 })).toThrow();
    expect(() => scoreReviewAttempt({ ...attempt(), answers: attempt().answers.slice(1) })).toThrow();
    const duplicate = attempt(); duplicate.answers[1] = duplicate.answers[0];
    expect(() => scoreReviewAttempt(duplicate)).toThrow();
    const unknown = attempt(); unknown.answers[0].questionId = 'unknown';
    expect(() => scoreReviewAttempt(unknown)).toThrow();
    const invalid = attempt(); invalid.answers[0].answer = 'Article';
    expect(() => scoreReviewAttempt(invalid)).toThrow();
  });
  it('finishes regardless of score and preserves library mastery', () => {
    const input = attempt(); input.answers = input.answers.map(a => ({ ...a, answer: a.answer === 'Verb' ? 'Noun' : 'Verb' }));
    const library = { 'pos-1-verbs': { stage: 'mastered', highestRoundPassed: 3 } };
    const result = applyReviewAttempt(library, input, '2026-09-28');
    expect(result.correct).toBe(0); expect(result.completed).toBe(true);
    expect(result.category['pos-1-verbs']).toEqual(library['pos-1-verbs']);
    expect(library).not.toHaveProperty('_partsOfSpeechReview');
  });
  it('makes replay and delayed duplicate submissions idempotent, keeping the independent score', () => {
    const first = applyReviewAttempt({}, attempt(), 'first');
    const optional = applyReviewAttempt(first.category, attempt('more-word-jobs'), 'second');
    const replay = attempt(); replay.attemptId = '22222222-2222-4222-8222-222222222222'; replay.answers[0].answer = 'Verb';
    const second = applyReviewAttempt(optional.category, replay, 'third');
    const delayed = applyReviewAttempt(second.category, attempt(), 'fourth');
    expect(second.correct).toBe(7);
    expect(second.review.lessons['nouns-verbs']?.correct).toBe(8);
    expect(delayed.category).toEqual(optional.category);
  });
  it('does not let the optional lesson alone complete the required review', () => {
    expect(applyReviewAttempt({}, attempt('more-word-jobs'), 'now').completed).toBe(false);
  });
  it('protects saved review completion from stale library saves, resets, and forged state', () => {
    const saved = applyReviewAttempt({}, attempt(), 'now').category;
    expect(preserveReviewProgress(saved, {})).toEqual(saved);
    expect(preserveReviewProgress(saved, { _partsOfSpeechReview: null, 'pos-2-nouns': { completed: true } })).toMatchObject(saved);
    expect(preserveReviewProgress({}, saved)).toEqual({});
    expect(preserveReviewProgress(saved, saved)).toEqual(saved);
  });
  it('keeps punctuation in the readable sentence and puts labels below', () => {
    const html = renderToStaticMarkup(createElement(DiagramSentence, { text: 'The doctor (person) works at the hospital (place) with equipment (thing).' }));
    expect(html).toContain('The doctor works at the hospital with equipment.');
    expect(html).not.toContain('equipment .');
    expect(html).toContain('<ul');
  });
});
