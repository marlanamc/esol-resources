import { POINTS } from "./constants";

export function determineGrammarCompletionPoints(requested?: number): number {
  void requested;
  return POINTS.GRAMMAR_GUIDE;
}
