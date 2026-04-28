import type { Metadata } from "next";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";
import { Level1VocabClient } from "@/components/public-vocab/Level1VocabClient";

export const metadata: Metadata = {
  title: "Level 1 Vocabulary | ESOL Teacher Resources",
  description:
    "Level 1 English vocabulary practice with audio, flashcards, picture-to-word matching, and fill-in-the-blank exercises.",
};

export default function Level1VocabularyIndexPage() {
  return <Level1VocabClient units={LEVEL1_PUBLIC_VOCAB_UNITS} />;
}
