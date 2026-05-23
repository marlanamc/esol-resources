import { PrismaClient } from '@prisma/client';
import type { TriviaGameContent } from '../src/types/activity';

const prisma = new PrismaClient();

const ACTIVITY_TITLE = 'Level 3 Group Trivia — Grammar Showdown';

const content: TriviaGameContent = {
  type: 'trivia-game',
  title: ACTIVITY_TITLE,
  description:
    'Six rounds of grammar trivia for groups. Four minutes per round — write down your answers and turn them in before the reveal. Mixed grammar from the Level 3 review, ending with a Level 4 challenge round.',
  released: true,
  participationPoints: 5,
  roundSeconds: 240,
  rounds: [
    {
      id: 'r1',
      title: 'Round 1 — Parts of Speech Detective',
      blurb:
        'For each sentence, write the part of speech of the bold word: noun, verb, adjective, or adverb.',
      questions: [
        {
          id: 'r1-q1',
          kind: 'write-in',
          prompt:
            'My sister makes *delicious* pancakes every Sunday morning.\n\nWhat part of speech is *delicious*?',
          answer: 'adjective',
          note: 'It describes the noun "pancakes".',
        },
        {
          id: 'r1-q2',
          kind: 'write-in',
          prompt:
            'The train arrived *late* again this morning.\n\nWhat part of speech is *late*?',
          answer: 'adverb',
          note: 'It describes how the verb "arrived" happened.',
        },
        {
          id: 'r1-q3',
          kind: 'write-in',
          prompt:
            'I left my *keys* on the kitchen counter.\n\nWhat part of speech is *keys*?',
          answer: 'noun',
          note: 'A thing — the keys themselves.',
        },
        {
          id: 'r1-q4',
          kind: 'write-in',
          prompt:
            '"Tired children sleep peacefully."\n\nWrite out the sentence and label EVERY word — noun, verb, adjective, or adverb.',
          answer:
            'Tired (adjective) · children (noun) · sleep (verb) · peacefully (adverb)',
          note: 'All four parts of speech, in order: adjective → noun → verb → adverb. Award 1 point per correct label.',
        },
      ],
    },
    {
      id: 'r2',
      title: 'Round 2 — Connector Logic',
      blurb:
        'Fill in each blank with the connector that fits best. Each connector is used exactly once.',
      wordBank: ['so', 'because', 'before', 'although', 'since', 'as soon as'],
      questions: [
        {
          id: 'r2-q1',
          kind: 'write-in',
          prompt:
            '______ it was raining all day, we still went to the park.',
          answer: 'Although',
          acceptable: ['although'],
          note: 'Contrast — bad weather vs. they went anyway.',
        },
        {
          id: 'r2-q2',
          kind: 'write-in',
          prompt:
            'I went to bed early last night ______ I was really tired.',
          answer: 'because',
          note: '"Because" gives the reason.',
        },
        {
          id: 'r2-q3',
          kind: 'write-in',
          prompt:
            'Always brush your teeth ______ you go to bed.',
          answer: 'before',
          note: 'Earlier in time / first.',
        },
        {
          id: 'r2-q4',
          kind: 'write-in',
          prompt:
            'I missed the bus, ______ I had to walk to work in the rain.',
          answer: 'so',
          note: 'Cause → result. "So" introduces what happened next.',
        },
        {
          id: 'r2-q5',
          kind: 'write-in',
          prompt:
            'I have lived in this apartment ______ 2019.',
          answer: 'since',
          note: 'Use *since* with a specific starting point in time.',
        },
        {
          id: 'r2-q6',
          kind: 'write-in',
          prompt:
            '______ the bell rang, the students ran out to the playground.',
          answer: 'As soon as',
          acceptable: ['as soon as'],
          note: 'Immediate sequence — one action right after the other.',
        },
      ],
    },
    {
      id: 'r3',
      title: 'Round 3 — Tense Time Machine',
      blurb:
        'Each sentence has TWO blanks. Read the time signals very carefully — the same verb can be in different tenses depending on the clue.',
      questions: [
        {
          id: 'r3-q1',
          kind: 'write-in',
          prompt:
            'I ______ (work) at my current job since 2022. Before that, I ______ (work) at a small bakery for two years.',
          answer: 'have worked  /  worked',
          acceptable: ['have been working / worked'],
          note: 'First blank → present perfect (since 2022, still true). Second blank → past simple (finished period before now).',
        },
        {
          id: 'r3-q2',
          kind: 'write-in',
          prompt:
            'By the time I got to the train station, my train ______ (already / leave), so I ______ (have) to take the next one.',
          answer: 'had already left  /  had',
          note: 'First blank → past perfect (one past action before another). Second blank → past simple (the next action).',
        },
        {
          id: 'r3-q3',
          kind: 'write-in',
          prompt:
            'When I was a teenager, I ______ (love) horror movies, but I ______ (not / watch) one in years.',
          answer: 'used to love  /  have not watched',
          acceptable: [
            'loved / haven\'t watched',
            'used to love / haven\'t watched',
          ],
          note: 'First blank → "used to" for a past state that\'s no longer true (past simple "loved" also fine). Second blank → present perfect with "in years" (from past until now).',
        },
        {
          id: 'r3-q4',
          kind: 'write-in',
          prompt:
            '______ you ever ______ (be) to Japan?\n\n— Yes, I ______ (go) there with my family two years ago.',
          answer: 'Have / been  /  went',
          note: 'Question → present perfect with "ever" (any time up to now). Answer → past simple because "two years ago" is a finished time.',
        },
        {
          id: 'r3-q5',
          kind: 'write-in',
          prompt:
            'It ______ (rain) ______ three days straight, and the forecast says it won\'t stop until tomorrow.',
          answer: 'has been raining  /  for',
          note: 'Present perfect continuous for an ongoing action that started in the past and is still happening. Use "for" with a length of time ("three days"), not "since".',
        },
      ],
    },
    {
      id: 'r4',
      title: 'Round 4 — Comparatives & Superlatives',
      blurb:
        'Write the correct form of the adjective in parentheses. Watch the spelling rules.',
      questions: [
        {
          id: 'r4-q1',
          kind: 'write-in',
          prompt:
            'Mount Everest is the ______ (tall) mountain in the world.',
          answer: 'tallest',
          note: 'Superlative of a short adjective → "the …est".',
        },
        {
          id: 'r4-q2',
          kind: 'write-in',
          prompt:
            'Coffee is ______ (good) than tea, in my opinion.',
          answer: 'better',
          note: 'Irregular comparative: good → better than.',
        },
        {
          id: 'r4-q3',
          kind: 'write-in',
          prompt:
            'Today is the ______ (hot) day of the year so far.',
          answer: 'hottest',
          note: 'Short adjective ending in vowel + consonant → double the consonant: hot → hottest.',
        },
        {
          id: 'r4-q4',
          kind: 'write-in',
          prompt:
            'Walking to work is ______ (healthy) than driving every day.',
          answer: 'healthier',
          note: 'Adjective ending in -y → change y to i and add -er: healthy → healthier.',
        },
        {
          id: 'r4-q5',
          kind: 'write-in',
          prompt:
            'My brother is ______ tall ______ my father — they\'re exactly the same height.',
          answer: 'as  /  as',
          acceptable: ['as / as'],
          note: 'For equality (same amount), use "as + adjective + as" — not the comparative.',
        },
      ],
    },
    {
      id: 'r5',
      title: 'Round 5 — Conditional Match-Up',
      blurb:
        'Match each sentence beginning to the ending that completes it. Watch out — the "if" clause can come at the START or the END of a conditional sentence! Write the LETTER of the correct ending next to each number (e.g. 1 — C).',
      wordBank: [
        'A. it melts.',
        'B. if it rains tomorrow.',
        'C. if she doesn\'t study tonight.',
        'D. he would help us move the couch.',
        'E. I would travel around the world for a year.',
      ],
      questions: [
        {
          id: 'r5-q1',
          kind: 'write-in',
          prompt: '1. If you heat ice, ______',
          answer: 'A — it melts.',
          note: 'Zero conditional: general truth or scientific fact. If + present simple, present simple.',
        },
        {
          id: 'r5-q2',
          kind: 'write-in',
          prompt: '2. We will cancel the picnic ______',
          answer: 'B — if it rains tomorrow.',
          note: 'First conditional with the *if* clause at the end — no comma needed. Same grammar, flipped order: will + base verb … if + present simple.',
        },
        {
          id: 'r5-q3',
          kind: 'write-in',
          prompt: '3. She won\'t pass the test on Friday ______',
          answer: 'C — if she doesn\'t study tonight.',
          note: 'First conditional (negative) with the *if* clause at the end. Will not / won\'t + base verb … if + present simple.',
        },
        {
          id: 'r5-q4',
          kind: 'write-in',
          prompt: '4. If I had a million dollars, ______',
          answer: 'E — I would travel around the world for a year.',
          note: 'Second conditional: imaginary / unlikely present situation. If + past simple, would + base verb.',
        },
        {
          id: 'r5-q5',
          kind: 'write-in',
          prompt: '5. If he were here right now, ______',
          answer: 'D — he would help us move the couch.',
          note: 'Second conditional with "were" (formally correct for all subjects in second conditional). If + past simple, would + base verb.',
        },
      ],
    },
    {
      id: 'r6',
      title: 'Round 6 — Are You Ready for Level 4?',
      blurb:
        'The hardest round. Past perfect, third conditional, and tricky gerund vs. infinitive patterns. Read every sentence twice before you write.',
      questions: [
        {
          id: 'r6-q1',
          kind: 'write-in',
          label: 'Past perfect + past simple',
          prompt:
            'By the time we ______ (arrive) at the theater, the movie ______ (already / start).',
          answer: 'arrived  /  had already started',
          note: 'Past simple for the main past event ("we arrived"), past perfect for what had happened BEFORE that ("had already started").',
        },
        {
          id: 'r6-q2',
          kind: 'write-in',
          label: 'Past continuous + past simple',
          prompt:
            'I ______ (cook) dinner when the power suddenly ______ (go) out.',
          answer: 'was cooking  /  went',
          note: 'Past continuous (was/were + -ing) for the longer background action that was already happening; past simple for the short action that interrupted it.',
        },
        {
          id: 'r6-q3',
          kind: 'write-in',
          label: 'Write a future continuous sentence',
          prompt: 'Write ONE sentence using the future continuous.',
          answer:
            'Example: "This time next week, I will be flying to Mexico."',
          acceptable: [
            'Any grammatical sentence using will be + -ing (or will have been + -ing).',
          ],
          note: 'Award the point if the sentence (1) is complete, and (2) uses a future-continuous structure (will be + -ing) — accept future-perfect-continuous (will have been + -ing) as well.',
        },
        {
          id: 'r6-q4',
          kind: 'write-in',
          label: 'Label EVERY noun, verb, adjective & adverb',
          prompt:
            '"Yesterday my older brother quietly cooked a delicious dinner for our hungry family."\n\nWrite out the sentence and label every word.',
          answer:
            'Yesterday (adverb) · older (adjective) · brother (noun) · quietly (adverb) · cooked (verb) · delicious (adjective) · dinner (noun) · hungry (adjective) · family (noun)',
          note: '9 content words to label — 2 adverbs, 3 adjectives, 3 nouns, 1 verb. Award 1 point per correct label.',
        },
        {
          id: 'r6-q5',
          kind: 'write-in',
          label: 'Gerund OR infinitive? (3 blanks)',
          prompt:
            '______ (exercise) every morning is great for your health, but most doctors recommend ______ (walk) before you try ______ (run).',
          answer: 'Exercising  /  walking  /  to run',
          acceptable: ['Exercising / walking / running'],
          note: 'Subject of a sentence → gerund (-ing). After "recommend" → gerund. After "try" both work but each carries a different meaning (try to run = make the effort; try running = experiment with it).',
        },
      ],
    },
  ],
};

async function main() {
  console.log('Seeding Group Trivia activity...');

  const data = {
    title: ACTIVITY_TITLE,
    description: content.description ?? null,
    content: JSON.stringify(content),
    type: 'game',
    ui: 'trivia-game',
    category: 'games',
    level: 'intermediate',
    isReleased: true,
  };

  const existing = await prisma.activity.findFirst({
    where: { title: ACTIVITY_TITLE },
  });

  if (existing) {
    await prisma.activity.update({
      where: { id: existing.id },
      data,
    });
    console.log(`Updated existing activity: ${existing.id}`);
  } else {
    const created = await prisma.activity.create({ data });
    console.log(`Created new activity: ${created.id}`);
  }

  console.log('\nDone! Group Trivia is now available in the games category.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
