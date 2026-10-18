import { describe, expect, it } from 'vitest';
import { COURSE_MAP_UNITS } from '@/lib/course-map-data';
const { weeklyVocabData } = require('../../scripts/vocab/weekly-vocab-data');
const { generateFillBlankContent } = require('../../scripts/vocab/seed-weekly-vocab');
describe('clear vocabulary blanks',()=>{
 it('never leaves an inflection behind or exposes the answer when the example uses another form',()=>{
  for(const [term,ex] of [['support','She supports the team.'],['help out','He helped out yesterday.'],['art','The cart is full.']]){
   const q=generateFillBlankContent('fixture',{words:[{term,ex,def:'a test meaning'}]}).sentences[0];
   expect(q.text).toBe('_____ means a test meaning.');
   expect(q.correctAnswers).toEqual([term]);
  }
 });
 it('uses reviewed prompts and complete phrase answers in all 31 later weeks',()=>{
  for(const w of COURSE_MAP_UNITS.flatMap(u=>u.weeks).filter(w=>w.number>=6)){
   const slug=w.items.find(i=>i.vocabUi==='flashcards'&&i.slot==='required')!.activityId!.slice(6);
   const data=weeklyVocabData[slug];const questions=generateFillBlankContent(slug,data).sentences;
   expect(questions).toHaveLength(6);
   questions.forEach((q:{text:string;correctAnswers:string[];options:string[]},i:number)=>{
    const word=data.words[i];expect(word.fillBlank).toBeDefined();
    expect(q.text).toBe(word.fillBlank.text);expect(q.text.match(/_____/g)).toHaveLength(1);
    expect(q.text).toContain('(Meaning: ');expect(q.correctAnswers).toEqual([word.term]);
    expect(q.options.filter(x=>x===word.term)).toHaveLength(1);
    expect(new Set(q.options).size).toBe(q.options.length);expect(q.options.length).toBeGreaterThanOrEqual(3);
   });
  }
 });
 it('does not offer suggest, propose, and recommend as competing answers to one prompt',()=>{
  for(const set of Object.values(weeklyVocabData) as {words:{term:string;fillBlank?:{options:string[]}}[]}[]){
   for(const word of set.words.filter(w=>['suggest','propose','recommend'].includes(w.term)&&w.fillBlank)){
    expect(word.fillBlank!.options.filter(t=>['suggest','propose','recommend'].includes(t))).toEqual([word.term]);
   }
  }
 });
});
