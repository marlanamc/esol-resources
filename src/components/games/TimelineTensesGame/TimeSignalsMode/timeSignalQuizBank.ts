import { LEARN_TENSES_LESSONS } from "@/data/timeline-learn-tenses";
import {
  type ProductionExercise,
  type TimeSignalEntry,
  type TimeSignalGroup,
} from "@/data/timeline-time-expressions";
import { TIMELINE_TENSES_QUESTIONS } from "@/data/timeline-tenses-questions";
import type { TimelineElement } from "@/types/activity";
import {
  getTimeSignalTimelineFamily,
  type TimeSignalTimelineFamily,
} from "./timeSignalTimelineCanon";

export interface TimeSignalQuizExample {
  sentence: string;
  verbPhrase: string;
  verbPhrase2?: string;
  timelineElements: TimelineElement[];
  note?: string;
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function getExploreSentences(entry: TimeSignalEntry): Set<string> {
  const sentences = new Set<string>([normalizeText(entry.exampleSentence)]);

  for (const example of entry.commonExamples ?? []) {
    sentences.add(normalizeText(example.sentence));
  }

  for (const usage of entry.contextualUsages ?? []) {
    sentences.add(normalizeText(usage.exampleSentence));
  }

  return sentences;
}

function entrySearchTerms(word: string): string[] {
  const aliases: Record<string, string[]> = {
    "next week / next month / next year": [
      "next week",
      "next month",
      "next year",
      "this saturday",
      "tonight",
    ],
    "in [X] days / in two weeks": ["in two weeks", "in three days", "in 2027"],
    "at [time]": ["at 9", "at 8", "at 5"],
    "on [day / date]": ["on tuesday", "on friday", "on sunday"],
    "in [year]": ["in 2021", "in 2022", "in 2027"],
    "by [deadline]": ["by friday", "by noon", "by december", "by next month"],
    "all day / all morning / all week": ["all day", "all morning", "all week"],
    "this week / this month / this year": [
      "this week",
      "this month",
      "this year",
      "this morning",
    ],
    "tonight / this evening": ["tonight", "this evening"],
    "used to": ["used to"],
    "would": ["would"],
    "rarely / hardly ever": ["rarely", "hardly ever"],
    "these days / nowadays": ["these days", "nowadays"],
    "until / till": ["until", "till"],
  };

  if (aliases[word]) {
    return aliases[word];
  }

  return word
    .split("/")
    .map((part) => part.replace(/\[[^\]]+\]/g, "").trim().toLowerCase())
    .filter((part) => part.length >= 4);
}

function sentenceMatchesTerms(sentence: string, terms: string[]): boolean {
  const normalized = normalizeText(sentence);
  return terms.some((term) => normalized.includes(term));
}

function sentenceToQuizExample(
  sentence: string,
  verbPhrase: string,
  verbPhrase2: string | undefined,
  timelineElements: TimelineElement[],
  note?: string
): TimeSignalQuizExample {
  return { sentence, verbPhrase, verbPhrase2, timelineElements, note };
}

function buildExampleFromProduction(
  exercise: ProductionExercise,
  timelineElements: TimelineElement[]
): TimeSignalQuizExample | null {
  const correctOption = exercise.options.find((option) => option.isCorrect);
  if (!correctOption) {
    return null;
  }

  return sentenceToQuizExample(
    exercise.sentence.replace("______", correctOption.conjugated),
    correctOption.conjugated,
    undefined,
    timelineElements,
    exercise.explanation
  );
}

function getMainGameSentenceBank(): TimeSignalQuizExample[] {
  const fromQuestions = TIMELINE_TENSES_QUESTIONS.flatMap((question) => {
    if (question.type !== "sentence-to-timeline") {
      return [];
    }

    return [
      sentenceToQuizExample(
        question.sentence,
        question.verbPhrase ?? "",
        question.verbPhrase2,
        question.correctElements,
        question.explanation
      ),
    ];
  });

  const fromWalkthrough = Object.values(LEARN_TENSES_LESSONS).flatMap((lesson) =>
    lesson.cards.flatMap((card) => [
      sentenceToQuizExample(
        card.examples.affirmative.sentence,
        card.examples.affirmative.verbPhrase,
        undefined,
        card.timelineElements,
        card.shortMeaning
      ),
      sentenceToQuizExample(
        card.examples.negative.sentence,
        card.examples.negative.verbPhrase,
        undefined,
        card.timelineElements,
        card.shortMeaning
      ),
      sentenceToQuizExample(
        card.examples.question.sentence,
        card.examples.question.verbPhrase,
        undefined,
        card.timelineElements,
        card.shortMeaning
      ),
    ])
  );

  return [...fromQuestions, ...fromWalkthrough];
}

const MAIN_GAME_SENTENCE_BANK = getMainGameSentenceBank();

function uniqueExamples(
  examples: TimeSignalQuizExample[],
  blockedSentences: Set<string>
): TimeSignalQuizExample[] {
  const seen = new Set<string>();

  return examples.filter((example) => {
    const normalized = normalizeText(example.sentence);
    if (blockedSentences.has(normalized) || seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

export function getTimeSignalQuizExamples(
  group: TimeSignalGroup,
  entry: TimeSignalEntry
): TimeSignalQuizExample[] {
  const blockedSentences = getExploreSentences(entry);
  const family = getTimeSignalTimelineFamily(entry.timelineElements);
  const searchTerms = entrySearchTerms(entry.word);

  const productionExamples = (group.productionExercises ?? [])
    .filter((exercise) => sentenceMatchesTerms(exercise.sentence, searchTerms) || sentenceMatchesTerms(exercise.timeSignal, searchTerms))
    .map((exercise) => buildExampleFromProduction(exercise, entry.timelineElements))
    .filter((example): example is TimeSignalQuizExample => example !== null);

  const mainGameExamples = MAIN_GAME_SENTENCE_BANK.filter((example) => {
    if (!sentenceMatchesTerms(example.sentence, searchTerms)) {
      return false;
    }

    const exampleFamily = getTimeSignalTimelineFamily(example.timelineElements);
    return exampleFamily === family;
  });

  const uniqueSupplemental = uniqueExamples(
    [...productionExamples, ...mainGameExamples],
    blockedSentences
  );

  if (uniqueSupplemental.length > 0) {
    return uniqueSupplemental;
  }

  return uniqueExamples(
    [{ sentence: entry.exampleSentence, verbPhrase: entry.verbPhrase, verbPhrase2: undefined, timelineElements: entry.timelineElements, note: entry.notes }],
    new Set<string>()
  );
}

export function getTimeSignalTimelineFamilyForEntry(
  entry: TimeSignalEntry
): TimeSignalTimelineFamily {
  return getTimeSignalTimelineFamily(entry.timelineElements);
}
