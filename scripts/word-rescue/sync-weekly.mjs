import { createRequire } from 'node:module';
import { writeFileSync, readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { weeklyVocabData } = require('../vocab/weekly-vocab-data.js');
const weeks = Object.entries(weeklyVocabData).map(([id, data]) => ({
  id, topic: data.topic, words: data.words.map(word => {
    const tokens = word.ex.split(/\s+/);
    const index = tokens.findIndex(token => token.toLowerCase().replace(/[^a-z]/g, '').startsWith(word.term.split(' ')[0].replace(/e$/, '').toLowerCase()));
    const phrase = index >= 0 ? tokens.slice(index, index + word.term.split(' ').length + 2).join(' ').replace(/[.,?!]$/, '') : word.term;
    return { id: `${id}-${word.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, term: word.term, definition: word.def, sentence: word.ex, phrase };
  }),
}));
const filename = new URL('../../src/data/word-rescue-weekly.generated.json', import.meta.url);
const output = JSON.stringify(weeks, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(filename, 'utf8') !== output) throw new Error('Run node scripts/word-rescue/sync-weekly.mjs after editing weekly vocabulary.');
} else writeFileSync(filename, output);
