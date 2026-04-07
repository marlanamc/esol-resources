import { describe, expect, it } from "vitest";
import { LEVEL1_PUBLIC_VOCAB_UNITS } from "@/data/public-level1-vocab";
import {
  getUnitImageBackedCards,
  getUnitMatchingAvailability,
  getUnitMatchingEligibleCards,
} from "@/lib/public-level1-unit-matching";

function getUnit(unitSlug: string) {
  const unit = LEVEL1_PUBLIC_VOCAB_UNITS.find((entry) => entry.slug === unitSlug);
  expect(unit).toBeDefined();
  return unit!;
}

describe("public level 1 unit matching", () => {
  it("marks the expected units as playable for unit review matching", () => {
    expect(getUnitMatchingAvailability(getUnit("unit-1")).hasPlayableUnitMatching).toBe(true);
    expect(getUnitMatchingAvailability(getUnit("unit-3")).hasPlayableUnitMatching).toBe(true);
    expect(getUnitMatchingAvailability(getUnit("unit-6-7")).hasPlayableUnitMatching).toBe(true);
    expect(getUnitMatchingAvailability(getUnit("unit-8")).hasPlayableUnitMatching).toBe(true);
  });

  it("distinguishes image-backed availability from matching-eligible availability", () => {
    const unit = getUnit("unit-8");
    const availability = getUnitMatchingAvailability(unit);

    expect(availability.imageBackedCards.length).toBeGreaterThanOrEqual(2);
    expect(availability.eligibleCards.length).toBeGreaterThanOrEqual(2);
    expect(availability.imageBackedCards.length).toBeGreaterThan(availability.eligibleCards.length);
  });

  it("does not require isConcrete for unit matching when a card has an image and allowed category", () => {
    const unit = getUnit("unit-3");
    const eligibleCards = getUnitMatchingEligibleCards(unit);

    expect(eligibleCards.length).toBeGreaterThanOrEqual(2);
    expect(eligibleCards.some((card) => !card.isConcrete)).toBe(true);
  });

  it("keeps image-backed and eligible card sets deduplicated by term across themes", () => {
    const unit = getUnit("unit-1");
    const imageBacked = getUnitImageBackedCards(unit).map((card) => card.term.toLowerCase());
    const eligible = getUnitMatchingEligibleCards(unit).map((card) => card.term.toLowerCase());

    expect(new Set(imageBacked).size).toBe(imageBacked.length);
    expect(new Set(eligible).size).toBe(eligible.length);
  });
});
