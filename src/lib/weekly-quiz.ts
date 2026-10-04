import type { WeeklyQuizContent, WeeklyQuizQuestion, WeeklyQuizSubmission, WeeklyQuizVerbForm } from '@/types/weekly-quiz';
import type { VerbData } from '@/types/verb-quiz';
import conjugations from '@/content/quizzes/verb-conjugations.json';

const verbBank: Record<string, VerbData> = Object.assign({}, ...Object.values(conjugations).map(week => week.verbs));
const tableForms: WeeklyQuizVerbForm[] = ['v1_3rd', 'v1_ing', 'v2', 'v3'];
const tableLabels: Record<WeeklyQuizVerbForm, string> = { v1_3rd: 'V1-s (he/she/it)', v1_ing: 'V-ing', v2: 'V2 (past)', v3: 'V3 (past participle)' };

/**
 * Students see quizzes by course week ("Week 5 Quiz"), the same number the
 * course map uses. The final review week holds several optional quizzes, so
 * those get a bonus number.
 */
export function weekQuizTitle(weekNumber: number, bonusNumber?: number): string {
  return bonusNumber ? `Week ${weekNumber} Bonus Quiz ${bonusNumber}` : `Week ${weekNumber} Quiz`;
}

/** Older saved content still says "Weekly Quiz 2: Topic"; show the week name. */
export function displayWeeklyQuizTitle(quiz: WeeklyQuizContent): string {
  const legacy = /^Weekly Quiz \d+(.*)$/.exec(quiz.title);
  return legacy ? `${weekQuizTitle(quiz.weekNumber)}${legacy[1]}` : quiz.title;
}

/** The full verb-forms table: V1-s, V-ing, V2 and V3 for every focus verb. */
export function buildVerbFormsTable(verbs: string[]): WeeklyQuizQuestion[] {
  return verbs.flatMap((verb, v) => tableForms.map(form => {
    const data = verbBank[verb];
    if (!data) throw new Error(`Missing verb forms for ${verb}`);
    const answer = data[form];
    const both = answer.includes('/');
    return { id: `form-${v}-${form}`, section: 'forms' as const, verb, form, prompt: `${verb} → ${tableLabels[form]}${both ? ' (give both forms, separated by /)' : ''}`, answers: both ? [answer, answer.split('/').reverse().join('/')] : [answer], explanation: `${tableLabels[form]} of ${verb}: ${answer}.`, source: 'verb-conjugations' };
  }));
}

/**
 * Quizzes saved in the database before the forms table existed still carry a
 * few scattered single-form questions. Swap those for the full table so every
 * quiz looks and grades the same without rewriting activities students used.
 */
export function withVerbFormsTable(quiz: WeeklyQuizContent): WeeklyQuizContent {
  if (quiz.questions.some(q => q.section === 'forms' && q.verb)) return quiz;
  return { ...quiz, questions: [...buildVerbFormsTable(quiz.focusVerbs), ...quiz.questions.filter(q => q.section !== 'forms')] };
}

export function normalizeQuizAnswer(value: string): string {
  return value.normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
}

/** Grade saved question content, never a client-supplied score or answer key. */
export function gradeWeeklyQuiz(saved: WeeklyQuizContent, input: unknown): WeeklyQuizSubmission {
  const quiz = withVerbFormsTable(saved);
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
