import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { REVIEW_LESSONS, WEEKLY_REVIEW_LESSONS, REVIEW_PHASES, REVIEW_TOPICS, reviewChoices, reviewCorrectAnswer, reviewSentence, reviewWords } from '@/lib/parts-of-speech-review/content';
import { applyReviewAttempt, scoreReviewAttempt, preserveReviewProgress, type ReviewAttempt } from '@/lib/parts-of-speech-review/progression';
import { ReviewSentence } from '@/components/games/PartsOfSpeechGame/PartsOfSpeechReview';
import { categoryColorClass } from '@/components/games/PartsOfSpeechGame/ReviewCategoryCue';
import { DiagramSentence } from '@/components/games/PartsOfSpeechGame/DiagramSentence';

function attempt(lessonId: ReviewAttempt['lessonId'] = 'nouns-verbs'): ReviewAttempt {
  return { version: 1, attemptId: '11111111-1111-4111-8111-111111111111', lessonId,
    answers: REVIEW_LESSONS[lessonId].questions.map(q => ({ questionId: q.id, answer: reviewCorrectAnswer(q) })) };
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
        expect(q.categories ?? lesson.categories).toContain(q.answer);
        expect(q.explanation.length).toBeGreaterThan(10);
      }
    }
  });
  it('mixes label, find, and choose questions in Nouns and Verbs', () => {
    const lesson = REVIEW_LESSONS['nouns-verbs'];
    expect(new Set(lesson.questions.map(q => q.kind ?? 'label'))).toEqual(new Set(['label', 'find', 'choose']));
    const find = lesson.questions.find(q => q.id === 'nv-2')!;
    expect(reviewWords(find)[Number(reviewCorrectAnswer(find))]).toBe('cook');
    const wrongWord = attempt(); wrongWord.answers[1].answer = '0';
    expect(scoreReviewAttempt(wrongWord).correct).toBe(7);
    const outOfRange = attempt(); outOfRange.answers[1].answer = '9';
    expect(() => scoreReviewAttempt(outOfRange)).toThrow();
    const wrongOption = attempt(); wrongOption.answers[3].answer = 'school';
    expect(scoreReviewAttempt(wrongOption).correct).toBe(7);
    const unofferedWord = attempt(); unofferedWord.answers[3].answer = 'run';
    expect(() => scoreReviewAttempt(unofferedWord)).toThrow();
  });
  it('authors find and choose questions so each has one clear answer', () => {
    for (const lesson of Object.values(REVIEW_LESSONS)) {
      for (const q of lesson.questions) {
        if (q.kind === 'find') expect(q.target).not.toMatch(/\s/);
        if (q.kind === 'choose') {
          expect(q.options).toContain(q.target);
          expect(new Set(q.options).size).toBe(q.options!.length);
        }
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
    const input = attempt(); const lesson = REVIEW_LESSONS['nouns-verbs'];
    input.answers = lesson.questions.map(q => ({ questionId: q.id, answer: reviewChoices(q, lesson).find(choice => choice !== reviewCorrectAnswer(q))! }));
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


describe('Weekly Parts of Speech curriculum', () => {
  it('schedules a light first pass through Weeks 3–7 with two familiar questions after Week 3', () => {
    expect(WEEKLY_REVIEW_LESSONS.map(({ week }) => week)).toEqual([3, 4, 5, 6, 7]);
    for (const { id, week } of WEEKLY_REVIEW_LESSONS) {
      const lesson = REVIEW_LESSONS[id];
      expect(lesson.examples).toHaveLength(2);
      expect(lesson.questions).toHaveLength(8);
      expect(lesson.questions.filter(q => q.review)).toHaveLength(week === 3 ? 0 : 2);
      expect(lesson.transfer?.prompt).toBeTruthy();
      expect(lesson.transfer?.check).toBeTruthy();
      expect(scoreReviewAttempt(attempt(id)).correct).toBe(8);
    }
    expect(REVIEW_LESSONS['week-4-describing'].categories).toEqual(['Adjective', 'Article']);
    expect(REVIEW_LESSONS['week-5-subjects'].bridge).toBe(true);
  });
  it('separates core lessons from optional depth across five phases, without losing older content', () => {
    expect(REVIEW_PHASES).toHaveLength(5);
    const ids = new Set(REVIEW_PHASES.flatMap(phase => [...phase.core, ...phase.extra, phase.checkIn]));
    for (const id of Object.keys(REVIEW_LESSONS) as ReviewAttempt['lessonId'][]) {
      if (id !== 'more-word-jobs') expect(ids.has(id)).toBe(true);
      expect(scoreReviewAttempt(attempt(id)).correct).toBe(REVIEW_LESSONS[id].questions.length);
    }
    expect(REVIEW_PHASES[1].core).not.toContain('verb-forms');
    expect(REVIEW_PHASES[0].core).not.toContain('determiners');
  });
  it('lists every lesson once in the start-screen topics, hiding only the retired duplicates', () => {
    const listed = REVIEW_TOPICS.flatMap(topic => [...topic.core, topic.check, ...topic.extra]);
    expect(new Set(listed).size).toBe(listed.length);
    const hidden = (Object.keys(REVIEW_LESSONS) as ReviewAttempt['lessonId'][]).filter(id => !listed.includes(id));
    expect(hidden.sort()).toEqual(['adjectives-articles', 'more-word-jobs']);
    for (const topic of REVIEW_TOPICS) expect(topic.title).not.toMatch(/week|phase|month/i);
  });
  it('validates category choices separately for focus and familiar-review questions', () => {
    const input = attempt('week-4-describing');
    input.answers[6].answer = 'Adjective';
    expect(() => scoreReviewAttempt(input)).toThrow();
    input.answers[6].answer = 'Verb';
    expect(scoreReviewAttempt(input).correct).toBe(7);
    input.answers[0].answer = 'Noun';
    expect(() => scoreReviewAttempt(input)).toThrow();
  });
  it('keeps the revised weekly set independent from previously saved adjective/article attempts', () => {
    const old = applyReviewAttempt({}, attempt('adjectives-articles'), 'before');
    expect(old.review.lessons['week-4-describing']).toBeUndefined();
    const current = applyReviewAttempt(old.category, attempt('week-4-describing'), 'now');
    expect(current.review.lessons['adjectives-articles']).toEqual(old.review.lessons['adjectives-articles']);
    expect(current.review.lessons['week-4-describing']?.correct).toBe(8);
  });
  it('preserves the former optional lesson without treating it as Week 4 completion', () => {
    const previous = applyReviewAttempt({}, attempt('more-word-jobs'), 'before');
    expect(previous.review.lessons['adjectives-articles']).toBeUndefined();
    const week4 = applyReviewAttempt(previous.category, attempt('adjectives-articles'), 'now');
    expect(week4.review.lessons['more-word-jobs']).toEqual(previous.review.lessons['more-word-jobs']);
    expect(week4.review.lessons['adjectives-articles']?.correct).toBe(8);
    const later = applyReviewAttempt(week4.category, attempt('subjects'), 'later');
    expect(later.review.lessons['adjectives-articles']).toEqual(week4.review.lessons['adjectives-articles']);
    expect(later.review.lessons.subjects?.correct).toBe(6);
    expect(applyReviewAttempt(later.category, attempt('subjects'), 'retry').category).toEqual(later.category);
  });
});

it('carries two familiar examples forward from the preceding weekly lesson', () => {
  for (let index = 1; index < WEEKLY_REVIEW_LESSONS.length; index++) {
    const previous = REVIEW_LESSONS[WEEKLY_REVIEW_LESSONS[index - 1].id];
    const current = REVIEW_LESSONS[WEEKLY_REVIEW_LESSONS[index].id];
    for (const question of current.questions.filter(q => q.review)) {
      expect([...previous.examples, ...previous.questions].some(q => reviewSentence(q) === reviewSentence(question) && q.target === question.target && q.answer === question.answer)).toBe(true);
    }
  }
});

it('keeps category colors off the target until the answer is revealed', () => {
  const item = REVIEW_LESSONS['nouns-verbs'].questions[0];
  const neutral = renderToStaticMarkup(createElement(ReviewSentence, { item }));
  const revealed = renderToStaticMarkup(createElement(ReviewSentence, { item, reveal: true }));
  expect(neutral).not.toContain(categoryColorClass('Noun'));
  expect(revealed).toContain(categoryColorClass('Noun'));
  expect(neutral).toContain('bus</mark> arrives at eight.');
});

it('keeps authored color annotations consistent with the complete transfer sentence', () => {
  for (const lesson of Object.values(REVIEW_LESSONS)) {
    if (lesson.transfer?.parts) {
      expect(lesson.transfer.parts.map(part => part.text).join('')).toBe(lesson.transfer.example);
      expect(lesson.transfer.parts.some(part => part.category)).toBe(true);
    }
  }
});
