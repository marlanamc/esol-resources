import { expect, it } from 'vitest';
import { RESCUE_WORDS, RESCUE_COLLECTIONS, RESCUE_WORD_BY_ID } from '@/lib/word-rescue/content';
it('provides both translations for every current and resumable word', () => {
  for (const word of RESCUE_WORDS) for (const language of ['es', 'pt-BR'] as const) {
    expect(word.translations?.[language]?.trim().length, `${word.id}: missing ${language} translation`).toBeGreaterThan(0);
  }
});
it('translates words according to their activity meaning', () => {
  expect(RESCUE_WORD_BY_ID['oct-learning-apply'].translations?.es).toBe('aplicar');
  expect(RESCUE_WORD_BY_ID['jan-w1-apply'].translations?.es).toBe('solicitar');
  expect(RESCUE_WORD_BY_ID['oct-w1-schedule'].translations?.['pt-BR']).toBe('agendar');
  expect(RESCUE_WORD_BY_ID['feb-3-5-schedule'].translations?.['pt-BR']).toBe('horário');
  expect(RESCUE_WORD_BY_ID['oct-w5-petition'].translations?.es).toBe('petición');
});
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
