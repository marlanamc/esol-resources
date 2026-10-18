import { describe, expect, it } from 'vitest';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
import { getGrammarContent } from '@/lib/grammar-content-loader';
import { GUIDED_VERB_QUIZ_PLAN } from '@/data/verb-quiz-plan';
import { getWeeklyQuizSchedule } from '@/lib/weekly-quiz-schedule';
import quizzes from '@/content/quizzes/weekly-quizzes.json';
const weeks = COURSE_MAP_UNITS.flatMap(u => u.weeks);
const expected = new Map([[21,'i-used-to-but-now-i'],[23,'enjoy-doing-want-to-do'],[26,'past-perfect-continuous-work'],[32,'future-perfect-goals'],[35,'future-perfect-continuous-progress'],[36,'all-the-tenses-year-in-review']]);
describe('required tense progression', () => {
  it('keeps one required guide per week and preserves moved guide identities', () => {
    for (const w of weeks) expect(w.items.filter(i => i.slot === 'required' && i.activityType === 'guide')).toHaveLength(1);
    for (const [n, slug] of expected) {
      const guide = weeks.find(w=>w.number===n)!.items.find(i=>i.slot==='required'&&i.activityType==='guide')!;
      expect(guide.href).toBe(`/grammar-reader/${slug}`);
      expect(guide.id).toBe(slug);
    }
    const ids=weeks.flatMap(w=>w.items.map(i=>i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('only assesses taught grammar in changed weeks, including all three new tenses in year-end bonuses', async () => {
    for(const [n,slug] of expected) {
      const content=(await getGrammarContent(slug))!;
      const sources=new Set(content.miniQuiz!.map(q=>`${slug}/${q.id}`));
      const weekQuizzes=Object.values(quizzes).filter(q=>q.weekNumber===n);
      for(const q of weekQuizzes) for(const item of q.questions.filter(q=>q.section==='grammar')) expect(sources.has(item.source)).toBe(true);
    }
    const finalSources=Object.values(quizzes).filter(q=>q.weekNumber===36).flatMap(q=>q.questions.map(x=>x.source));
    for(const id of ['past-duration','future-result','future-duration']) expect(finalSources).toContain(`all-the-tenses-year-in-review/year-review-${id}`);
  });
  it('keeps new core guides short with supported production and complete answer keys', async () => {
    for(const slug of ['past-perfect-continuous-work','future-perfect-goals','future-perfect-continuous-progress']) {
      const c=(await getGrammarContent(slug))!;
      expect(c.sections.length).toBeLessThanOrEqual(5);
      expect(c.miniQuiz!.length).toBeGreaterThanOrEqual(5);
      for(const section of c.sections) {
        expect(section.tenseDiagram).toBeTruthy();
        expect(section.exercises?.some(e=>e.items.some(i=>i.type==='text'&&i.expectedAnswers?.length))).toBe(true);
      }
    }
  });
  it('uses actual course weeks for every quiz due date, including reordered and bonus quizzes', () => {
    for(const quiz of GUIDED_VERB_QUIZ_PLAN) {
      const week=weeks.find(w=>w.items.some(i=>i.activityId===quiz.activityId))!;
      expect(quiz.dueDate).toBe(getWeeklyQuizSchedule(week.number)!.dueAt.toISOString().slice(0,10));
    }
  });
});
