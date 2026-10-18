import { describe, expect, it } from 'vitest';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
import { weeklyVocabData } from '../../scripts/vocab/weekly-vocab-data';
import games from '../../docs/grammar-progression/classroom-games.json';
import changes from '../../docs/grammar-progression/vocabulary-changes.json';
import rescueWeeks from '@/data/word-rescue-weekly.generated.json';
import quizzes from '@/content/quizzes/weekly-quizzes.json';
import { RESCUE_WORDS } from '@/lib/word-rescue/content';
const sets: Record<string,{words:{term:string;def:string;ex:string}[]}> = weeklyVocabData;
const weeks=COURSE_MAP_UNITS.flatMap(u=>u.weeks);
describe('everyday vocabulary and optional classroom plan',()=>{
 it('assigns exactly one core six-word set and Word Lab in every week from 6 to 36',()=>{
  for(const w of weeks.filter(w=>w.number>=6)){
   const required=w.items.filter(i=>i.vocabUi==='flashcards'&&i.slot==='required');
   expect(required).toHaveLength(1);
   const slug=required[0].activityId!.replace('vocab-','');
   expect(sets[slug].words).toHaveLength(6);
   expect(rescueWeeks.find(s=>s.id===slug)?.words).toHaveLength(6);
   expect(w.items.some(i=>i.vocabUi&&i.slot==='extra')).toBe(false);
   expect(w.items.some(i=>i.id===`${w.id}-word-rescue`)).toBe(true);
  }
 });
 it('assesses current core vocabulary and keeps review weeks familiar',()=>{
  for(const w of weeks.filter(w=>w.number>=6)){
   const id=w.items.find(i=>i.vocabUi==='flashcards'&&i.slot==='required')!.activityId!;
   const terms=sets[id.replace('vocab-','')].words.map(w=>w.term);
   for(const quiz of Object.values(quizzes).filter(q=>q.weekNumber===w.number)){
    for(const q of quiz.questions.filter(q=>q.section==='vocabulary'))for(const answer of q.answers)expect(terms).toContain(answer);
   }
   if([15,30].includes(w.number)){
    const prior=weeks.filter(x=>x.number<w.number).flatMap(x=>x.items.filter(i=>i.vocabUi==='flashcards'&&i.slot==='required').flatMap(i=>sets[i.activityId!.replace('vocab-','')].words.map(w=>w.term)));
    for(const term of terms)expect(prior).toContain(term);
   }
  }
  expect(new Set(RESCUE_WORDS.map(w=>w.id)).size).toBe(RESCUE_WORDS.length);
 });
 it('keeps replacement definitions and Word Lab content in sync',()=>{
  for(const change of changes){
   const words=sets[change.set].words;
   expect(words.map(w=>w.term)).not.toContain(change.from);
   const word=words.find(w=>w.term===change.to)!;
   expect(word.def).toBeTruthy();expect(word.ex.toLowerCase()).toContain(change.to.toLowerCase());
   expect(rescueWeeks.find(w=>w.id===change.set)?.words.find(w=>w.term===change.to)?.sentence).toBe(word.ex);
  }
 });
 it('keeps selected games as optional teacher resources, not app assignments',()=>{
  for(const game of games){
   expect(weeks.some(w=>w.number===game.week)).toBe(true);
   expect(new URL(game.url).origin).toBe('https://esol-level-3.vercel.app');
   expect(game.select).toBeTruthy();expect(game.teachingNote).toBeTruthy();
   expect(weeks.flatMap(w=>w.items).some(i=>i.href===game.url)).toBe(false);
  }
 });
});
