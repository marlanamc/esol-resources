import { describe, expect, it } from "vitest";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";

describe("public level 1 vocabulary data", () => {
  it("includes the expected public units", () => {
    expect(LEVEL1_PUBLIC_VOCAB_UNITS.map((unit) => unit.slug)).toEqual([
      "unit-1",
      "unit-2",
      "unit-3",
      "unit-4",
      "unit-5",
      "unit-6-7",
      "unit-8",
      "unit-9",
    ]);
  });

  it("builds vocabulary modes for every unit", () => {
    for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
      expect(unit.content.type).toBe("vocabulary");
      expect(unit.content.wordList?.cards?.length).toBeGreaterThan(0);
      expect(unit.content.wordList?.groups?.length).toBeGreaterThan(0);
      expect(unit.content.flashcards?.cards?.length).toBe(unit.totalCards);
      expect(unit.content.fillInBlank?.sentences?.length).toBe(unit.totalCards);
    }
  });

  it("ensures every card has a definition and example", () => {
    for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
      for (const group of unit.categories) {
        expect(group.cards.length).toBeGreaterThan(0);
        for (const card of group.cards) {
          expect(card.term.trim().length).toBeGreaterThan(0);
          expect(card.definition.trim().length).toBeGreaterThan(0);
          expect(card.englishDefinition.trim().length).toBeGreaterThan(0);
          expect(card.spanishDefinition.trim().length).toBeGreaterThan(0);
          expect(card.example.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("keeps terms unique within each unit after normalization", () => {
    for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
      const normalized = unit.content.wordList?.cards?.map((card) => card.term.trim().toLowerCase()) ?? [];
      expect(new Set(normalized).size).toBe(normalized.length);
    }
  });

  it("includes the correct answer in every fill-in-the-blank option set", () => {
    for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
      const sentences = unit.content.fillInBlank?.sentences ?? [];
      for (const sentence of sentences) {
        expect(sentence.text).toContain("_____");
        expect(sentence.options).toContain(sentence.correctAnswers?.[0]);
      }
    }
  });

  it("does not expose placeholder-style learner definitions in current Level 1 cards", () => {
    const disallowedEnglish = new Set([
      "A piece of clothing",
      "A part of a house",
      "A kind of job",
      "A sign that someone may be sick",
      "A kind of medicine",
      "A sickness or health problem",
      "A vegetable",
      "A fruit",
      "A drink",
      "A prepared food",
      "A thing people use in the home",
      "A product or machine people use",
    ]);

    const disallowedSpanish = new Set([
      "Una prenda de ropa",
      "Una parte de la casa",
      "Un tipo de trabajo",
      "Una señal de que alguien puede estar enfermo",
      "Un tipo de medicina",
      "Una enfermedad o problema de salud",
      "Una verdura",
      "Una fruta",
      "Una bebida",
      "Una comida preparada",
      "Una cosa que la gente usa en la casa",
      "Un producto o máquina que la gente usa",
    ]);

    for (const unit of LEVEL1_PUBLIC_VOCAB_UNITS) {
      for (const group of unit.categories) {
        for (const card of group.cards) {
          expect(disallowedEnglish.has(card.englishDefinition)).toBe(false);
          expect(disallowedSpanish.has(card.spanishDefinition)).toBe(false);
        }
      }
    }
  });
});
