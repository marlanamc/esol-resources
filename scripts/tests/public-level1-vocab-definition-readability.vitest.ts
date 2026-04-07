import { describe, expect, it } from "vitest";
import {
  auditDefinitionCard,
  type AuditCard,
} from "../checks/level1-definition-audit";

function makeCard(overrides: Partial<AuditCard>): AuditCard {
  return {
    unitSlug: "test-unit",
    unitTitle: "Test Unit",
    theme: "Test Theme",
    category: "Housing & Rental",
    term: "Rent",
    englishDefinition: "the money you pay every month to live in a home",
    spanishDefinition: "renta",
    example: "Rent is due on the first day of the month.",
    ...overrides,
  };
}

describe("level 1 definition readability audit", () => {
  it("passes simple functional learner definitions", () => {
    const issues = auditDefinitionCard(
      makeCard({
        category: "Housing & Rental",
        term: "Rent",
        englishDefinition: "the money you pay every month to live in a home",
      })
    );

    expect(issues).toEqual([]);
  });

  it("fails placeholder generic definitions", () => {
    const issues = auditDefinitionCard(
      makeCard({
        category: "Fruits",
        term: "Apples",
        englishDefinition: "A fruit",
      })
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: "hard",
          kind: "placeholder_generic",
        }),
      ])
    );
  });

  it("fails vague dictionary-like definitions", () => {
    const issues = auditDefinitionCard(
      makeCard({
        category: "Classroom",
        term: "Book",
        englishDefinition: "something with pages that you read",
      })
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: "hard",
          kind: "too_dictionary_like",
        }),
      ])
    );
  });

  it("passes slightly fuller beginner-safe definitions", () => {
    const issues = auditDefinitionCard(
      makeCard({
        category: "Personal Information",
        term: "Single",
        englishDefinition: "a person who is not married",
      })
    );

    expect(issues).toEqual([]);
  });
});
