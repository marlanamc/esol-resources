/** Build reviewable quiz content from the actual course map and vocabulary/grammar sources. */
import fs from 'node:fs';
import { COURSE_MAP_UNITS } from '../../src/lib/course-map-data';
import { GUIDED_VERB_QUIZ_PLAN } from '../../src/data/verb-quiz-plan';
import { getGrammarContent } from '../../src/lib/grammar-content-loader';
import { WEEKLY_VERB_APPLICATIONS } from '../../src/content/quizzes/weekly-quiz-applications';
import type { WeeklyQuizContent, WeeklyQuizQuestion } from '../../src/types/weekly-quiz';
import { buildVerbFormsTable, getVerbForms, normalizeQuizAnswer, weekQuizTitle } from '../../src/lib/weekly-quiz';
const { weeklyVocabData } = require('../vocab/weekly-vocab-data');
const weeks = COURSE_MAP_UNITS.flatMap(unit => unit.weeks);
const plain = (s: string) => s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&[lr]dquo;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
const quizzes: Record<string, WeeklyQuizContent> = {};
// Grammar questions already used by an earlier quiz in the same week, keyed by week number.
const usedInWeek = new Map<number, Set<string>>();
const requiredGuideSlug = (weekNumber: number) => weeks.find(w => w.number === weekNumber)?.items.find(i => i.slot === 'required' && i.href?.startsWith('/grammar-reader/'))?.href?.split('/').pop();
// Week 7's quiz opened before conditionals were practiced, so it reviews weeks 5-6.
// Week 12's Thursday before is Thanksgiving, so it reviews weeks 7-8.
const REVIEW_WEEKS: Record<number, number[]> = { 7: [5, 6], 12: [7, 8] };
// From week 8, Thursday teaches the new grammar and the next Tuesday practices
// it, so each quiz tests the guide from the week before. Spring weeks are not
// shifted yet.
const grammarWeek = (weekNumber: number) => weekNumber >= 8 && weekNumber <= 13 && !REVIEW_WEEKS[weekNumber] ? weekNumber - 1 : weekNumber;
const questionPool = async (slug: string) => (await getGrammarContent(slug))?.miniQuiz?.filter(q => q.type !== 'word-scramble' || q.words.length <= 12) ?? [];

// Only the verb-forms table is typed. Everything else is tapped: students were
// slowed down by switching between typing a form, rewriting a sentence, and
// rebuilding a sentence from a word list. Week 4 holds the first quiz, so this
// covers every quiz (Weeks 4-8 were converted later for students making them up).
const TAP_FROM_WEEK = 4;

/**
 * "Use the verbs" choices: the right form plus two other forms of the same
 * verb, so the question still tests which form fits. V-ing is offered last
 * because "are ___ing" often makes a wrong-looking form grammatical.
 */
// Where an automatic wrong choice is also correct (often a past form that fits).
const VERB_DISTRACTOR_OVERRIDES: Record<string, string[]> = {
  'She ___ going to the Salvadoran festival this Saturday. (be)': ['are', 'am'],
  // "usually took" also works as a past habit, so no V2 choice here.
  'My neighbor usually ___ food to sick people on our street. (take)': ['take', 'taking'],
  'The smaller package ___ less than the large one. (cost)': ['costing', 'to cost'],
  'This shop ___ used furniture. (sell)': ['sell', 'selling'],
  'My knee ___ when I bend it. (hurt)': ['hurting', 'to hurt'],
};
function verbChoices(prompt: string, answer: string, seed: number): string[] {
  const override = VERB_DISTRACTOR_OVERRIDES[prompt];
  const verb = /\(([a-z]+)(?::[^)]*)?\)\s*$/i.exec(prompt)?.[1]?.toLowerCase();
  const forms = verb ? getVerbForms(verb) : undefined;
  if (!forms && !override) throw new Error(`No verb forms for apply question: ${prompt}`);
  const taken = new Set([normalizeQuizAnswer(answer)]);
  const distractors = override ?? [forms!.v1, forms!.v1_3rd, forms!.v2, forms!.v3, forms!.v1_ing]
    .flatMap(form => form.split('/'))
    .filter(form => { const key = normalizeQuizAnswer(form); if (taken.has(key)) return false; taken.add(key); return true; })
    .slice(0, 2);
  if (distractors.length < 2) throw new Error(`Not enough distinct forms for: ${prompt}`);
  return rotate([answer, ...distractors], seed);
}
const rotate = <T,>(items: T[], seed: number) => { const r = seed % items.length; return [...items.slice(r), ...items.slice(0, r)]; };

/**
 * Typed grammar blanks become three choices. Each wrong choice must be clearly
 * wrong in the sentence (no second answer that also works).
 */
const GRAMMAR_CHOICES: Record<string, string[]> = {
  'questions-real-answers/qra-reason': ['Why', 'When', 'Where'],
  'verb-forms-overview': ['She has a brother in Colombia.', 'She have a brother in Colombia.', 'She haves a brother in Colombia.'],
  // The wrong choices are the mistakes students actually typed on this question.
  'review-week-6/frequency-adverb-s': ['My sister always votes in November.', 'My sister votes always in November.', 'My sister always vote in November.'],
  'can-should-must/csm-qfb1': ['must', 'should', 'can'],
  'have-to-dont-have-to-cant/have-to-dont-have-to-cant-qfb1': ["don't have to", 'have to', "can't"],
  'it-was-happening-when/iwh-qfb1': ['was calling', 'is calling', 'calls'],
  'second-conditional-what-would-you-do/sc-qfb1': ['were', 'am', 'will be'],
  'present-perfect-how-long/pperf-how-long-qfb1': ['yet', 'already', 'ago'],
  'past-perfect-continuous-work/past-perfect-continuous-work-q1': ['had been working', 'has been working', 'is working'],
  'past-perfect-continuous-work/past-perfect-continuous-work-q2': ['had been cleaning', 'has been cleaning', 'is cleaning'],
  'passive-voice-what-was-done/pvwwd-qfb1': ['were', 'was', 'be'],
  'stop-taking-or-stop-to-take/sti-fb1': ['taking', 'to take', 'take'],
  'doctor-said-reported-speech/doctor-said-q7': ['was', 'am', 'were'],
  'future-perfect-goals/future-perfect-goals-q3': ['will have completed', 'will has completed', 'has completed'],
  'future-perfect-goals/future-perfect-goals-q4': ['will have done', 'have did', 'has done'],
  'all-four-conditionals-quick-tour/afc-fb1': ['gets', 'get', 'getting'],
  'future-perfect-continuous-progress/future-perfect-continuous-progress-q4': ['will have been learning', 'will have learning', 'have been learning'],
  'future-perfect-continuous-progress/future-perfect-continuous-progress-q5': ['will have been studying', 'will have studying', 'has been studying'],
  'all-the-tenses-year-in-review/year-review-past-duration': ['had been working', 'has been working', 'have been working'],
  'all-the-tenses-year-in-review/year-review-future-result': ['will have finished', 'will has finished', 'has finished'],
  'all-the-tenses-year-in-review/year-review-future-duration': ['will have been studying', 'will have studying', 'have been studying'],
};

/** Turn every non-table question into a tap question (choices or word tiles). */
function makeTapFriendly(questions: WeeklyQuizQuestion[], seed: number) {
  questions.forEach((q, i) => {
    if (q.section === 'forms' || q.options || q.words) return;
    if (q.section === 'apply') { q.options = verbChoices(q.prompt, q.answers[0], seed + i); return; }
    const choices = q.source ? GRAMMAR_CHOICES[q.source] : undefined;
    if (!choices) throw new Error(`Week ${TAP_FROM_WEEK}+ quizzes need tap choices for ${q.source ?? q.id}. Add them to GRAMMAR_CHOICES.`);
    if (normalizeQuizAnswer(choices[0]) !== normalizeQuizAnswer(q.answers[0])) throw new Error(`GRAMMAR_CHOICES[${q.source}] must start with the answer "${q.answers[0]}"`);
    q.options = rotate(choices, seed + i);
  });
}

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
  // No topic in the name: from week 8 a quiz tests the week before, so the
  // week's topic would name the wrong grammar.
  const title = weekQuizTitle(week.number, bonusNumber(plan.quizNumber, week.number));
  if (n === 8) {
    // Fall Review + Class Party: an easy, low-stakes recap across the whole
    // fall semester instead of new grammar/verb-form questions — this quiz
    // lands on a party day, not a test day.
    quizzes[plan.activityId] = {
      type: 'weekly-quiz', version: 1, weekNumber: week.number, title,
      focusVerbs: plan.verbs, estimatedMinutes: '5–10',
      questions: [
        ...buildVerbFormsTable(plan.verbs),
        ...weeklyVocabData['dec-fall-review'].words.slice(0, 5).map((word: {term:string;def:string;ex:string}, i:number) => {
          const words = weeklyVocabData['dec-fall-review'].words as {term:string}[];
          const options = [word.term, words[(i+1)%6].term, words[(i+2)%6].term];
          const rotate = i % options.length;
          return { id: `recap-${i}`, section: 'vocabulary' as const, prompt: `Which word or phrase means “${word.def}”?`, options: [...options.slice(rotate), ...options.slice(0,rotate)], answers: [word.term], explanation: word.ex, source: 'vocab-dec-fall-review' };
        }),
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
    questions.push({ id: `vocab-${i}`, section: 'vocabulary', prompt: useContext ? plain(word.fillBlank!.text) : `Which ${week.number >= 6 ? "word or phrase" : "word"} means “${plain(word.def)}”?`, options: [...options.slice(rotate), ...options.slice(0, rotate)], answers: [word.term], explanation: `${word.term}: ${plain(word.def)}. ${plain(word.ex)}`, source: vocabId });
  }
  if (n === 1) {
    questions.push(
      { id: 'grammar-0', section: 'grammar', prompt: 'In “The helpful teacher has a book,” which word describes the teacher?', options: ['teacher', 'helpful', 'has'], answers: ['helpful'], explanation: 'Helpful is an adjective. It describes the noun teacher.', source: 'parts-of-speech-week-4' },
      { id: 'grammar-1', section: 'grammar', prompt: 'Fix one word: “She have a brother in Colombia.” Which sentence is correct?', answers: ['She has a brother in Colombia.'], explanation: 'With she, have becomes has.', source: 'verb-forms-overview' },
    );
  } else {
    const weekSlug = requiredGuideSlug(grammarWeek(week.number))!;
    const pool = await questionPool(weekSlug);
    if (pool.length < 2) throw new Error(`Not enough grammar questions: ${weekSlug}`);
    const used = usedInWeek.get(week.number) ?? new Set<string>();
    usedInWeek.set(week.number, used);
    const unusedFrom = async (reviewSlug: string) => (await questionPool(reviewSlug)).find(p => !Object.values(quizzes).some(z => z.questions.some(x => x.source === `${reviewSlug}/${p.id}`)));
    for (let i = 0; i < 2; i++) {
      let slug = weekSlug;
      // Week 6's guide opens with adverbs of frequency. The default index
      // lands on present simple and imperatives, so use the frequency items.
      const frequencyIds = ['your-week-q1', 'your-week-q9'];
      const reviewWeek = REVIEW_WEEKS[week.number]?.[i];
      if (reviewWeek) slug = requiredGuideSlug(reviewWeek)!;
      let q = reviewWeek
        ? await unusedFrom(slug)
        : n === 3
        ? pool.find(item => item.id === frequencyIds[i])
        : pool[((n - 2) * 2 + i) % pool.length];
      if (!q) throw new Error(`Missing grammar question for quiz ${n}`);
      if (used.has(`${slug}/${q.id}`)) {
        // Several quizzes in one week (the W36 bonus quizzes) can run out of the
        // guide's mini-quiz. Borrow an unused question from the previous week's
        // guide instead of repeating one.
        slug = requiredGuideSlug(week.number - 1)!;
        const borrowed = (await questionPool(slug)).find(p => !Object.values(quizzes).some(z => z.questions.some(x => x.source === `${slug}/${p.id}`)));
        if (!borrowed) throw new Error(`No unused grammar question to borrow from ${slug}`);
        q = borrowed;
      }
      used.add(`${slug}/${q.id}`);
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
      const tiles = q.type === 'word-scramble' && week.number >= TAP_FROM_WEEK ? q.words.map(plain) : undefined;
      questions.push({ id: `grammar-${i}`, section: 'grammar', prompt: plain(q.question).replace('Two words: not required.', 'Three words: not required.') + (q.type === 'word-scramble' && !tiles ? ` Words: ${q.words.join(' / ')}` : ''), ...(options ? {options} : {}), ...(tiles ? {words: tiles} : {}), answers: answers.map(plain), explanation: plain(q.explanation ?? `Answer: ${answers[0]}`), source: `${slug}/${q.id}` });
    }
  }
  // Week 7 reviews weeks 5-6. The mini-quiz items gave the answer away in the
  // hint, and the definition match could be solved by spotting "voters", so
  // use context-clue vocabulary and grammar that mixes both review weeks.
  if (n === 7) {
    Object.assign(questions.find(q => q.id === 'vocab-0')!, {
      prompt: 'Our class wrote a _____ to the city. 200 neighbors signed it to ask for a new crosswalk.',
      options: ['petition', 'campaign', 'vote'], answers: ['petition'],
      explanation: 'petition: a written request for change, often signed by many people. Signed it is the clue.',
    });
    Object.assign(questions.find(q => q.id === 'vocab-1')!, {
      prompt: 'Our city councilors _____ our neighborhood. They speak for us at every meeting.',
      options: ['register', 'elect', 'represent'], answers: ['represent'],
      explanation: 'represent: to speak or act on behalf of others. They speak for us is the clue.',
    });
    Object.assign(questions.find(q => q.id === 'grammar-0')!, {
      prompt: 'Put the words in order to make a question.', words: ['does', 'vote', 'where', 'your neighbor'],
      options: undefined, answers: ['Where does your neighbor vote?'],
      explanation: 'Question word + does + subject + base verb: Where does your neighbor vote?', source: 'review-week-5/do-does-question',
    });
    Object.assign(questions.find(q => q.id === 'grammar-1')!, {
      prompt: 'Fix the sentence: “My sister vote always in November.” Which sentence is correct?',
      options: undefined, answers: ['My sister always votes in November.'],
      explanation: 'With she, vote becomes votes. Always goes before the main verb: My sister always votes in November.', source: 'review-week-6/frequency-adverb-s',
    });
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
  if (week.number >= TAP_FROM_WEEK) makeTapFriendly(questions, n);
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
