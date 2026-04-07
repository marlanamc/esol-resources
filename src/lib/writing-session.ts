// Shared constants and helpers for live writing sessions

export const ANIMAL_GROUPS = [
  { name: "Penguins", emoji: "🐧", color: "#5b7fa6" },
  { name: "Foxes",    emoji: "🦊", color: "#d97757" },
  { name: "Otters",   emoji: "🦦", color: "#7ba884" },
  { name: "Bears",    emoji: "🐻", color: "#a0785a" },
  { name: "Wolves",   emoji: "🐺", color: "#8b7bb5" },
  { name: "Eagles",   emoji: "🦅", color: "#c4a020" },
  { name: "Dolphins", emoji: "🐬", color: "#4fb8c4" },
  { name: "Turtles",  emoji: "🐢", color: "#4a9e6b" },
  { name: "Owls",     emoji: "🦉", color: "#9b7a5e" },
  { name: "Tigers",   emoji: "🐯", color: "#e07b3a" },
];

export const SESSION_POINTS = {
  PARTICIPATION: 3,   // submitted anything in a round
  GROUP_WINNER: 3,    // group voted this student's writing best
  CLASS_WINNER: 5,    // class voted this group's writing best
} as const;

export type SessionStatus =
  | "waiting"
  | "writing"
  | "group-vote"
  | "class-vote"
  | "results"
  | "finished";

/** Shuffle array in-place using Fisher-Yates */
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Split students into groups of 3-4, returning array of group arrays */
export function chunkIntoGroups(studentIds: string[]): string[][] {
  const shuffled = shuffleArray(studentIds);
  const totalGroups = Math.ceil(shuffled.length / 4);
  const groups: string[][] = Array.from({ length: totalGroups }, () => []);
  shuffled.forEach((id, i) => groups[i % totalGroups].push(id));
  return groups.filter((g) => g.length > 0);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
