import { expect, it } from 'vitest';
import { RESCUE_WORDS, RESCUE_COLLECTIONS, RESCUE_WORD_BY_ID } from '@/lib/word-rescue/content';
it('has Spanish and Brazilian Portuguese coaching for every current and resumable word', () => {
  for (const word of RESCUE_WORDS) for (const language of ['es','pt-BR'] as const) {
    const tips = word.help?.[language]?.tips;
    expect(tips, `${word.term}: missing ${language} guide`).toBeDefined();
    expect(tips!.length, word.term).toBeGreaterThanOrEqual(2);
    expect(tips!.length, word.term).toBeLessThanOrEqual(4);
    for (const tip of tips!) {
      expect(tip.trim().length).toBeGreaterThan(12);
      expect(tip).not.toMatch(/undefined|preparación|preparação/);
    }
    expect(word.help!.es.tips).not.toEqual(word.help!['pt-BR'].tips);
  }
});
it('covers all released-collection candidates without changing existing audio text', () => {
  for (const collection of RESCUE_COLLECTIONS) for (const id of collection.wordIds) {
    const word = RESCUE_WORD_BY_ID[id];
    expect(word.help?.es.tips.length).toBeGreaterThan(0);
    expect(word.help?.['pt-BR'].tips.length).toBeGreaterThan(0);
    expect(word.phrase).toBeTruthy();
    expect(word.sentence).toBeTruthy();
  }
});
it('handles silent letters, voiced th, and the job-document meaning of resume explicitly', () => {
  const help = (term: string) => RESCUE_WORDS.find(word => word.term === term)!.help!;
  expect(help('listen').es.tips[0]).toMatch(/^t:.*no se pronuncia/);
  expect(help('soothe')['pt-BR'].tips[1]).toContain('voz vibrar');
  expect(help('resume').es.tips[0]).toContain('currículum');
  expect(help('resume')['pt-BR'].tips[0]).toContain('currículo');
  expect(help('processed').es.tips[1]).toContain('sin una sílaba extra');
});
