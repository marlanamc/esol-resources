import { describe, expect, it } from 'vitest';
import { gradeVerbQuiz } from '@/lib/quiz-attempts';
import type { VerbQuizContent } from '@/types/verb-quiz';
const quiz: VerbQuizContent = { type: 'verb-quiz', verbs: { be: { v1: 'be', v1_3rd: 'is', v1_ing: 'being', v2: 'was/were', v3: 'been' } } };
describe('verb quiz server grading', () => {
  it('accepts case, whitespace, and slash order consistently', () => {
    const result = gradeVerbQuiz(quiz, { score: 0, answers: { be: { v1_3rd: ' IS ', v1_ing: 'being', v2: 'were / was', v3: 'been' } } });
    expect(result.score).toBe(100);
    expect(result.correctCount).toBe(4);
    expect(result.submittedAt).toBeTruthy();
  });
  it('ignores a forged client score', () => {
    expect(gradeVerbQuiz(quiz, { score: 100, answers: { be: { v1_3rd: 'x', v1_ing: 'x', v2: 'x', v3: 'x' } } }).score).toBe(0);
  });
  it('requires meaningful answers to every form', () => {
    expect(() => gradeVerbQuiz(quiz, { answers: {} })).toThrow('Please answer');
    expect(() => gradeVerbQuiz(quiz, { answers: { be: { v1_3rd: ' ', v1_ing: 'being', v2: 'was/were', v3: 'been' } } })).toThrow('Please answer');
  });
});
