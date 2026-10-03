import type { WeeklyQuizContent, WeeklyQuizSubmission } from '@/types/weekly-quiz';

export function normalizeQuizAnswer(value: string): string {
  return value.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
}

/** Grade saved question content, never a client-supplied score or answer key. */
export function gradeWeeklyQuiz(quiz: WeeklyQuizContent, input: unknown): WeeklyQuizSubmission {
  if (!input || typeof input !== 'object' || !('answers' in input)) throw new Error('Please answer every question.');
  const raw = input.answers;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Please answer every question.');
  const answers: Record<string, string> = {};
  const results = quiz.questions.map(question => {
    const value = (raw as Record<string, unknown>)[question.id];
    if (typeof value !== 'string' || !value.trim() || value.length > 500) throw new Error('Please answer every question (500 characters maximum per answer).');
    answers[question.id] = value.trim();
    return {
      id: question.id,
      correct: question.answers.some(answer => normalizeQuizAnswer(answer) === normalizeQuizAnswer(value)),
      expected: question.answers[0],
      explanation: question.explanation,
    };
  });
  const correctCount = results.filter(result => result.correct).length;
  return { type: 'weekly-quiz', version: 1, answers, results, correctCount, totalQuestions: results.length, score: Math.round(correctCount / results.length * 100) };
}
