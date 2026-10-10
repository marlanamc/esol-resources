import type { RescueWord } from '@/lib/word-rescue/types';

// These are coaching approximations, never replacements for the English audio.
// Keep unfamiliar English sounds (th, r, short i) explicit rather than silently
// substituting a Spanish/Portuguese sound. No auto-generated transliteration.
export const RESCUE_HINTS: Record<string, Pick<RescueWord, 'clue' | 'help' | 'highlight'> & { phrase: string }> = {
  through: {
    phrase: 'through security', clue: 'The gh is silent in this word.', highlight: 'gh',
    help: {
      es: { sounds: 'th + r + ú', tips: ['th: lengua entre los dientes; sopla suavemente.', 'r: sin vibrar la lengua.', 'ú: como en tú.', 'Une los sonidos: es una sola sílaba.'] },
      'pt-BR': { sounds: 'th + r + u', tips: ['th: língua entre os dentes; sopre suavemente.', 'r: use o r do áudio em inglês, sem vibrar a língua.', 'u: como em tu. Junte os sons em uma sílaba.'] },
    },
  },
  prohibited: {
    phrase: 'is prohibited', clue: 'The h has a gentle breath. The ending adds a short vowel before d.', highlight: 'h',
    help: {
      es: { sounds: 'prə · HI · bi · tid', tips: ['ə: una vocal muy breve y relajada; escucha el modelo.', 'h: deja salir aire suavemente; aquí no es muda.', 'La i es corta y relajada. La última d cierra la palabra.'] },
      'pt-BR': { sounds: 'prə · HI · bi · tid', tips: ['ə: uma vogal bem curta e relaxada; ouça o modelo.', 'h: solte o ar suavemente; aqui não é mudo.', 'O i é curto e relaxado. Termine no d, sem acrescentar outra vogal.'] },
    },
  },
  achieve: {
    phrase: 'achieve my goal', clue: 'The ch is like the beginning of chair. Keep the final v.', highlight: 'ch',
    help: {
      es: { sounds: 'ə · CHÍÍV', tips: ['Empieza con una vocal breve y relajada.', 'ch: como en chico. La vocal siguiente es larga.', 'v: dientes superiores sobre el labio inferior; no cierres los dos labios como para b.'] },
      'pt-BR': { sounds: 'ə · TCHÍÍV', tips: ['Comece com uma vogal curta e relaxada.', 'ch: parecido com tch em tchau. A vogal seguinte é longa.', 'Termine no som de v, sem acrescentar i.'] },
    },
  },
  correctly: {
    phrase: 'say it correctly', clue: 'Keep the kt sounds together before ly.', highlight: 'ct',
    help: {
      es: { sounds: 'kə · REKT · li', tips: ['La primera vocal es breve y relajada.', 'r: usa el sonido del audio, sin vibrar la lengua.', 'Une k y t antes de li; no añadas otra vocal entre ellos.'] },
      'pt-BR': { sounds: 'kə · REKT · li', tips: ['A primeira vogal é curta e relaxada.', 'Use o r do áudio em inglês, sem vibrar a língua.', 'Junte k e t antes de li, sem uma vogal extra.'] },
    },
  },
  pronounce: {
    phrase: 'pronounce this word', clue: 'The ou glides from an open vowel to an oo sound.', highlight: 'ou',
    help: {
      es: { sounds: 'prə · NÁUNS', tips: ['La primera vocal es breve y relajada.', 'au: une las vocales en un solo movimiento.', 'Termina con n y s, sin añadir e.'] },
      'pt-BR': { sounds: 'prə · NÁUNS', tips: ['A primeira vogal é curta e relaxada.', 'au: faça um movimento contínuo, como em mau.', 'Termine com n e s, sem acrescentar outra vogal.'] },
    },
  },
  spell: {
    phrase: 'spell your name', clue: 'Start with s, then p. Keep them together.', highlight: 'sp',
    help: {
      es: { sounds: 's + pel', tips: ['Empieza directamente con s, sin una e delante.', 'Une los sonidos en una sílaba.', 'Termina con l; no añadas otra vocal.'] },
      'pt-BR': { sounds: 's + pel', tips: ['Comece diretamente no s, sem uma vogal antes.', 'Junte os sons em uma sílaba.', 'No l final, a ponta da língua toca atrás dos dentes superiores.'] },
    },
  },
  repeat: {
    phrase: 'repeat that, please', clue: 'The ea sounds like the long vowel in see.', highlight: 'ea',
    help: {
      es: { sounds: 'ri · PÍÍT', tips: ['La primera vocal es más corta que la segunda.', 'r: escucha el modelo; no vibres la lengua.', 'Termina en t.'] },
      'pt-BR': { sounds: 'ri · PÍÍT', tips: ['A primeira vogal é mais curta que a segunda.', 'Use o r do áudio em inglês.', 'Termine no t, sem acrescentar i ou transformar em tchi.'] },
    },
  },
  depart: { phrase: 'depart on time', clue: 'The final t closes the word. Do not add another vowel.', help: {
    es: { sounds: 'di · PART', tips: ['La primera vocal es corta y relajada.', 'Escucha la r inglesa; termina en t.'] },
    'pt-BR': { sounds: 'di · PART', tips: ['A primeira vogal é curta e relaxada.', 'Ouça o r em inglês. Termine no t, sem acrescentar i.'] },
  } },
  arrive: { phrase: 'arrive on time', clue: 'The final e is silent; keep the v sound.', highlight: 'e', help: {
    es: { sounds: 'ə · RÁIV', tips: ['La primera vocal es breve y relajada.', 'r: sin vibrar la lengua.', 'ai: un solo movimiento.', 'v: dientes superiores sobre el labio inferior.'] },
    'pt-BR': { sounds: 'ə · RÁIV', tips: ['A primeira vogal é curta e relaxada.', 'Use o r inglês.', 'ai: como em pai.', 'Termine no v, sem acrescentar i.'] },
  } },
  transfer: { phrase: 'transfer to the train', clue: 'Keep the n and s together in the middle.', highlight: 'ns', help: {
    es: { tips: ['Escucha las dos partes y únelas: trans + fer.', 'Conserva n y s en el medio. Usa la r del audio.'] },
    'pt-BR': { tips: ['Ouça as duas partes e junte: trans + fer.', 'Mantenha n e s no meio. Use o r do áudio.'] },
  } },
  locate: { phrase: 'locate the station', clue: 'The final ate rhymes with late.', highlight: 'ate', help: {
    es: { sounds: 'lóu · keit', tips: ['ou y ei son movimientos continuos.', 'Termina en t; la e final no se pronuncia.'] },
    'pt-BR': { sounds: 'lôu · keit', tips: ['ou e ei são movimentos contínuos.', 'Termine no t, sem acrescentar i. O e final não soa.'] },
  } },
  follow: { phrase: 'follow the signs', clue: 'The ll makes one l sound. The ending glides like go.', highlight: 'll', help: {
    es: { tips: ['ll: una sola l, no el sonido de ll en español.', 'Al final, desliza la vocal como en go; escucha el audio.'] },
    'pt-BR': { tips: ['ll: um só som de l.', 'No final, deslize a vogal como em go; ouça o áudio.'] },
  } },
  cross: { phrase: 'cross the street', clue: 'The ss makes one long s sound.', highlight: 'ss', help: {
    es: { tips: ['Empieza con k y la r del audio, sin otra vocal entre ellos.', 'Termina con s; no añadas e.'] },
    'pt-BR': { tips: ['Comece com k e o r do áudio, sem outra vogal entre eles.', 'Termine no s, sem acrescentar i.'] },
  } },
};

export const EVERYDAY_WORDS: RescueWord[] = [
  ['through', 'From one side to the other.', 'I’m going through security.'],
  ['prohibited', 'Not allowed.', 'Smoking is prohibited here.'],
  ['achieve', 'To succeed in doing something.', 'I want to achieve my goal.'],
  ['correctly', 'In the right way.', 'I want to say it correctly.'],
  ['pronounce', 'To say the sounds of a word.', 'How do you pronounce this word?'],
  ['spell', 'To say or write the letters of a word.', 'Could you spell your name?'],
  ['repeat', 'To say or do something again.', 'Could you repeat that, please?'],
].map(([term, definition, sentence]) => ({ id: `everyday-${term}`, term, definition, sentence, ...RESCUE_HINTS[term] }));
