import { describe, expect, it } from 'vitest';
import quizzes from '@/content/quizzes/weekly-quizzes.json';
import { gradeWeeklyQuiz, normalizeQuizAnswer } from '@/lib/weekly-quiz';
import type { WeeklyQuizContent } from '@/types/weekly-quiz';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';

const bank = quizzes as Record<string, WeeklyQuizContent>;
describe('weekly quiz content and grading', () => {
  for (const [id, quiz] of Object.entries(bank)) {
    it(`${id} is short, aligned, and has a valid answer key`, () => {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(10);
      expect(quiz.questions.length).toBeLessThanOrEqual(11);
      expect(new Set(quiz.questions.map(q => q.id)).size).toBe(quiz.questions.length);
      const week = COURSE_MAP_UNITS.flatMap(u => u.weeks).find(w => w.items.some(i => i.activityId === id));
      expect(quiz.weekNumber).toBe(week?.number);
      for (const section of ['apply', 'vocabulary', 'grammar']) expect(quiz.questions.filter(q => q.section === section)).toHaveLength(2);
      for (const q of quiz.questions) {
        expect(q.answers.length).toBeGreaterThan(0);
        if (q.options) {
          expect(new Set(q.options).size).toBe(q.options.length);
          expect(q.options.map(normalizeQuizAnswer)).toContain(normalizeQuizAnswer(q.answers[0]));
        }
      }
      const answers = Object.fromEntries(quiz.questions.map(q => [q.id, q.answers[0]]));
      expect(gradeWeeklyQuiz(quiz, { answers }).score).toBe(100);
    });
  }
  const first = bank['verb-quiz-1'];
  it('rejects unfinished submissions instead of awarding completion for clicks', () => {
    expect(() => gradeWeeklyQuiz(first, { answers: {} })).toThrow();
    expect(() => gradeWeeklyQuiz(first, { answers: [] })).toThrow();
  });
  it('ignores forged scores and includes every section in the grade', () => {
    const answers = Object.fromEntries(first.questions.map(q => [q.id, 'wrong']));
    expect(gradeWeeklyQuiz(first, { answers, score: 100 }).score).toBe(0);
    answers[first.questions.find(q => q.section === 'apply')!.id] = ' IS ';
    expect(gradeWeeklyQuiz(first, { answers }).score).toBe(10);
  });
  it('accepts capitalization, curly apostrophes, whitespace, and sentence punctuation', () => {
    expect(normalizeQuizAnswer('  She  HAS a notebook! ')).toBe(normalizeQuizAnswer('She has a notebook.'));
    expect(normalizeQuizAnswer('don’t')).toBe(normalizeQuizAnswer("don't"));
  });
  it('aligns the guided first quiz with Week 4 learning vocabulary', () => {
    expect(first.guided).toBe(true);
    expect(first.questions.filter(q => q.section === 'vocabulary').map(q => q.answers[0])).toEqual(['focus', 'apply']);
    expect(first.questions.filter(q => q.section === 'vocabulary').every(q => q.source === 'vocab-oct-learning')).toBe(true);
    expect(bank['verb-quiz-2'].questions.filter(q => q.section === 'vocabulary').every(q => q.source === 'vocab-sep-w3')).toBe(true);
  });
});
