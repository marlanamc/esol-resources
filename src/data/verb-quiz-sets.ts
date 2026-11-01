// The verbs taught in each weekly verb quiz. Kept free of course-map imports
// so client components (the course map card) can use it cheaply.

export type QuizVerbSet = { verbs: [string, string]; reviewVerb?: string };

// Quiz numbers are stable activity identities, not course week numbers.
// Resolve placement and due dates from the course map; preserve saved submissions.
// Quizzes 32-34 are optional extras in the final review week.
export const QUIZ_VERB_SETS: QuizVerbSet[] = [
  { verbs: ["be", "have"] },
  { verbs: ["do", "make"] },
  { verbs: ["go", "come"] },
  { verbs: ["tell", "say"] },
  { verbs: ["take", "bring"] },
  { verbs: ["meet", "speak"] },
  { verbs: ["write", "send"] },
  { verbs: ["think", "know"] },
  { verbs: ["cost", "spend"] },
  { verbs: ["buy", "sell"] },
  { verbs: ["eat", "drink"] },
  { verbs: ["see", "find"] },
  { verbs: ["choose", "let"] },
  { verbs: ["break", "hold"] },
  { verbs: ["hear", "leave"] },
  { verbs: ["become", "lead"], reviewVerb: "go" },
  { verbs: ["wear", "keep"], reviewVerb: "leave" },
  { verbs: ["win", "fly"] },
  { verbs: ["get", "put"], reviewVerb: "bring" },
  { verbs: ["understand", "mean"], reviewVerb: "speak" },
  { verbs: ["grow", "build"], reviewVerb: "do" },
  { verbs: ["teach", "show"], reviewVerb: "think" },
  { verbs: ["pay", "give"], reviewVerb: "write" },
  { verbs: ["feel", "sleep"], reviewVerb: "eat" },
  { verbs: ["fall", "hurt"], reviewVerb: "take" },
  { verbs: ["sit", "stand"] },
  { verbs: ["forget", "read"], reviewVerb: "know" },
  { verbs: ["run", "ride"], reviewVerb: "drink" },
  { verbs: ["drive", "wake"], reviewVerb: "come" },
  { verbs: ["lose", "cut"], reviewVerb: "break" },
  { verbs: ["begin", "quit"], reviewVerb: "choose" },
  { verbs: ["steal", "freeze"] },
  { verbs: ["catch", "fight"] },
  { verbs: ["hit", "lend"] },
];

/** The verb set for `verb-quiz-N`, or null if there is no such quiz. */
export function getQuizVerbSet(quizNumber: number): QuizVerbSet | null {
  return QUIZ_VERB_SETS[quizNumber - 1] ?? null;
}
