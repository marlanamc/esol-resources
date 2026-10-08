/** Build reviewable quiz content from the actual course map and vocabulary/grammar sources. */
import fs from 'node:fs';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
import { GUIDED_VERB_QUIZ_PLAN } from '../../src/data/verb-quiz-plan';
import { getGrammarContent } from '../../src/lib/grammar-content-loader';
import { WEEKLY_VERB_APPLICATIONS } from '../../src/content/quizzes/weekly-quiz-applications';
import type { WeeklyQuizContent, WeeklyQuizQuestion } from '../../src/types/weekly-quiz';
import { buildVerbFormsTable, weekQuizTitle } from '../../src/lib/weekly-quiz';
const { weeklyVocabData } = require('../vocab/weekly-vocab-data');
const weeks = COURSE_MAP_UNITS.flatMap(unit => unit.weeks);
const plain = (s: string) => s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&[lr]dquo;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
const quizzes: Record<string, WeeklyQuizContent> = {};

// Weeks with more than one quiz (the optional final-review extras) number them.
const bonusNumber = (quizNumber: number, weekNumber: number) => {
  const sameWeek = GUIDED_VERB_QUIZ_PLAN.filter(q => weeks.find(w => w.items.some(i => i.activityId === q.activityId))?.number === weekNumber);
  return sameWeek.length > 1 ? sameWeek.findIndex(q => q.quizNumber === quizNumber) + 1 : undefined;
};
async function main() {
for (const plan of GUIDED_VERB_QUIZ_PLAN) {
  const n = plan.quizNumber;
  const week = weeks.find(w => w.items.some(i => i.activityId === plan.activityId))!;
  if (!week) throw new Error(`Missing map week for ${plan.activityId}`);
  const title = `${weekQuizTitle(week.number, bonusNumber(plan.quizNumber, week.number))}: ${week.title}`;
  if (n === 8) {
    // Fall Review + Class Party: an easy, low-stakes recap across the whole
    // fall semester instead of new grammar/verb-form questions — this quiz
    // lands on a party day, not a test day.
    quizzes[plan.activityId] = {
      type: 'weekly-quiz', version: 1, weekNumber: week.number, title,
      focusVerbs: plan.verbs, estimatedMinutes: '5–10',
      questions: [
        ...buildVerbFormsTable(plan.verbs),
        { id: 'recap-0', section: 'vocabulary', prompt: 'Which word means “to meet someone new and tell them your name”?', options: ['introduce', 'volunteer', 'calculate'], answers: ['introduce'], explanation: 'Introduce: She introduced herself on the first day of class.', source: 'sep-w1' },
        { id: 'recap-1', section: 'vocabulary', prompt: 'Which word means “to pay close attention to one thing”?', options: ['focus', 'depart', 'donate'], answers: ['focus'], explanation: 'Focus: Focus on one section at a time when you study.', source: 'oct-learning' },
        { id: 'recap-2', section: 'vocabulary', prompt: 'Which word means “to leave a place to start a trip”?', options: ['arrive', 'depart', 'assist'], answers: ['depart'], explanation: 'Depart: The bus departs at 7:15 every morning.', source: 'oct-w2' },
        { id: 'recap-3', section: 'vocabulary', prompt: 'Which word means “to offer to do something without being paid”?', options: ['volunteer', 'purchase', 'compare'], answers: ['volunteer'], explanation: 'Volunteer: She volunteers at the food bank every Saturday.', source: 'nov-w1' },
        { id: 'recap-4', section: 'vocabulary', prompt: 'Which word means “to plan how much money to spend”?', options: ['budget', 'introduce', 'transfer'], answers: ['budget'], explanation: 'Budget: Budget your money so you can pay all your bills.', source: 'dec-w1' },
      ],
    };
    continue;
  }
  const questions: WeeklyQuizQuestion[] = buildVerbFormsTable(plan.verbs);
  const [p1, a1, p2, a2] = WEEKLY_VERB_APPLICATIONS[n - 1];
  [ [p1, a1], [p2, a2] ].forEach(([prompt, answer], i) => questions.push({ id: `apply-${i}`, section: 'apply', prompt, answers: [answer], explanation: prompt.replace('___', answer), source: 'weekly-quiz-applications' }));
  const vocabWeek = week.items.find(i => i.slot === 'required' && i.vocabUi === 'flashcards') ? week : [...weeks].reverse().find(w => w.number < week.number && w.items.some(i => i.slot === 'required' && i.vocabUi === 'flashcards'))!;
  const vocabId = vocabWeek.items.find(i => i.slot === 'required' && i.vocabUi === 'flashcards')!.activityId!;
  const words = weeklyVocabData[vocabId.replace('vocab-', '')].words as {term: string; def: string; ex: string; fillBlank?: {text: string; options: string[]}; quizDistractors?: string[]}[];
  for (let i = 0; i < 2; i++) {
    const index = n === 1
      ? words.findIndex(word => word.term === ['focus', 'apply'][i])
      : ((n - 1) * 2 + i) % words.length;
    const word = words[index];
    const useContext = word.fillBlank && (n + i) % 2 === 0;
    const options = useContext ? [...word.fillBlank!.options] : [word.term, ...(word.quizDistractors ?? words.filter(w => w.term !== word.term).slice(0, 2).map(w => w.term))];
    const rotate = (n + i) % options.length;
    questions.push({ id: `vocab-${i}`, section: 'vocabulary', prompt: useContext ? plain(word.fillBlank!.text) : `Which word means “${plain(word.def)}”?`, options: [...options.slice(rotate), ...options.slice(0, rotate)], answers: [word.term], explanation: `${word.term}: ${plain(word.def)}. ${plain(word.ex)}`, source: vocabId });
  }
  if (n === 1) {
    questions.push(
      { id: 'grammar-0', section: 'grammar', prompt: 'In “The helpful teacher has a book,” which word describes the teacher?', options: ['teacher', 'helpful', 'has'], answers: ['helpful'], explanation: 'Helpful is an adjective. It describes the noun teacher.', source: 'parts-of-speech-week-4' },
      { id: 'grammar-1', section: 'grammar', prompt: 'Fix one word: “She have a brother in Colombia.” Write the complete sentence.', answers: ['She has a brother in Colombia.'], explanation: 'With she, have becomes has.', source: 'verb-forms-overview' },
    );
  } else {
    const slug = week.items.find(i => i.slot === 'required' && i.href?.startsWith('/grammar-reader/'))!.href!.split('/').pop()!;
    const guide = await getGrammarContent(slug);
    const pool = guide?.miniQuiz?.filter(q => q.type !== 'word-scramble' || q.words.length <= 12) ?? [];
    if (pool.length < 2) throw new Error(`Not enough grammar questions: ${slug}`);
    for (let i = 0; i < 2; i++) {
      const q = pool[((n - 2) * 2 + i) % pool.length];
      const radio = !q.type || q.type === 'radio';
      let answers: string[];
      let options: string[] | undefined;
      if (radio && 'options' in q) {
        options = q.options.map(o => plain(o.label));
        const answer = q.options.find(o => o.value === q.correctAnswer);
        if (!answer) throw new Error(`Invalid answer: ${slug}/${q.id}`);
        answers = [plain(answer.label)];
      } else if (q.type === 'fill-blank') answers = [q.correctAnswer, ...(q.acceptedAnswers ?? [])];
      else if (q.type === 'word-scramble') answers = [q.correctAnswer, ...(q.correctAnswers ?? [])];
      else throw new Error('Unsupported question');
      questions.push({ id: `grammar-${i}`, section: 'grammar', prompt: plain(q.question).replace('Two words: not required.', 'Three words: not required.') + (q.type === 'word-scramble' ? ` Words: ${q.words.join(' / ')}` : ''), ...(options ? {options} : {}), answers: answers.map(plain), explanation: plain(q.explanation ?? `Answer: ${answers[0]}`), source: `${slug}/${q.id}` });
    }
  }
  // Remove ambiguous error judgments from the source practice bank.
  if (n === 16) Object.assign(questions.find(q => q.id === 'grammar-0')!, {
    prompt: 'When the manager arrived, I had already finished my tasks. What happened first?',
    options: ['The manager arrived.', 'I finished my tasks.', 'Both happened at exactly the same time.'],
    answers: ['I finished my tasks.'], explanation: 'Had finished marks the earlier past action.',
  });
  if (n === 26) Object.assign(questions.find(q => q.id === 'grammar-0')!, {
    prompt: 'Report this yesterday: The doctor said, “I am busy.” Complete: The doctor said that she ___ busy. Use past-tense backshift.',
    options: undefined, answers: ['was'], explanation: 'With past-tense backshift, am becomes was.',
  });
  quizzes[plan.activityId] = { type: 'weekly-quiz', version: 1, weekNumber: week.number, title, focusVerbs: plan.verbs, ...(n === 1 ? {guided: true} : {}), estimatedMinutes: '5–10', questions };
}
const output = JSON.stringify(quizzes, null, 2) + '\n';
const destination = 'src/content/quizzes/weekly-quizzes.json';
if (process.argv.includes('--check')) {
  if (fs.readFileSync(destination, 'utf8') !== output) throw new Error('Weekly quiz content is out of date. Run npm run quizzes:build.');
} else fs.writeFileSync(destination, output);
console.log(`${Object.keys(quizzes).length} weekly quizzes validated; each opening with the verb-forms table.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
