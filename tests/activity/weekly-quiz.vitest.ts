import { describe, expect, it } from 'vitest';
import quizzes from '@/content/quizzes/weekly-quizzes.json';
import { gradeWeeklyQuiz, normalizeQuizAnswer, withVerbFormsTable } from '@/lib/weekly-quiz';
import type { WeeklyQuizContent } from '@/types/weekly-quiz';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';

const bank = quizzes as Record<string, WeeklyQuizContent>;
describe('weekly quiz content and grading', () => {
  for (const [id, quiz] of Object.entries(bank)) {
    it(`${id} is short, aligned, and has a valid answer key`, () => {
      // Every quiz opens with the full verb-forms table: 4 forms per focus verb.
      const table = quiz.questions.filter(q => q.section === 'forms');
      expect(table).toHaveLength(quiz.focusVerbs.length * 4);
      for (const verb of quiz.focusVerbs) {
        expect(table.filter(q => q.verb === verb).map(q => q.form).sort()).toEqual(['v1_3rd', 'v1_ing', 'v2', 'v3']);
      }
      // Quiz 8 is the deliberately shorter Fall Review + Class Party recap.
      const rest = quiz.questions.filter(q => q.section !== 'forms');
      if (id === 'verb-quiz-8') {
        expect(rest).toHaveLength(5);
        expect(rest.every(q => q.section === 'vocabulary')).toBe(true);
        expect(rest.every(q => q.options?.length === 3)).toBe(true);
      } else {
        expect(rest).toHaveLength(6);
        for (const section of ['apply', 'vocabulary', 'grammar']) expect(quiz.questions.filter(q => q.section === section)).toHaveLength(2);
      }
      expect(new Set(quiz.questions.map(q => q.id)).size).toBe(quiz.questions.length);
      const week = COURSE_MAP_UNITS.flatMap(u => u.weeks).find(w => w.items.some(i => i.activityId === id));
      expect(quiz.weekNumber).toBe(week?.number);
      expect(week).toBeDefined();
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
    expect(gradeWeeklyQuiz(first, { answers }).score).toBe(Math.round(100 / first.questions.length));
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

describe('older saved quizzes without the forms table', () => {
  const first = (quizzes as Record<string, WeeklyQuizContent>)['verb-quiz-1'];
  // Shape of quizzes synced before the table: a few scattered single forms.
  const legacy: WeeklyQuizContent = { ...first, questions: [
    { id: 'form-0-0', section: 'forms', prompt: 'be → V1-s (he/she/it)', answers: ['is'], explanation: '' },
    ...first.questions.filter(q => q.section !== 'forms'),
  ] };
  it('shows and grades the full table from the focus verbs', () => {
    const upgraded = withVerbFormsTable(legacy);
    expect(upgraded.questions.map(q => q.id)).toEqual(first.questions.map(q => q.id));
    const answers = Object.fromEntries(upgraded.questions.map(q => [q.id, q.answers[0]]));
    expect(gradeWeeklyQuiz(legacy, { answers }).totalQuestions).toBe(14);
    expect(gradeWeeklyQuiz(legacy, { answers }).score).toBe(100);
  });
  it('leaves quizzes that already have the table alone', () => {
    expect(withVerbFormsTable(first)).toBe(first);
  });
});
