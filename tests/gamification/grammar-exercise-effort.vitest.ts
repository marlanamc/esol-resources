import React from "react";
import { describe, it, expect, vi } from "vitest";
import { verbFormsOverviewContent } from "@/content/grammar/verb-forms-overview";

vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useState: (initial: unknown) => [initial, vi.fn()],
}));
import { ExerciseSection } from "@/components/grammar-reader/exercises/ExerciseSection";

function checkButton(node: React.ReactNode): React.ReactElement<{onClick: () => void; disabled: boolean}> | undefined {
  if (!React.isValidElement<{children?: React.ReactNode}>(node)) return;
  if (node.props.children === "Check Answers") return node as React.ReactElement<{onClick: () => void; disabled: boolean}>;
  for (const child of React.Children.toArray(node.props.children)) {
    const found = checkButton(child);
    if (found) return found;
  }
}

describe("overview effort credit", () => {
  function render(answers: Record<number,string>, rewardAttempts = true) {
    const onComplete = vi.fn();
    const onExerciseComplete = vi.fn();
    const tree = ExerciseSection({
      exercise: verbFormsOverviewContent.sections[0].exercises![0],
      exerciseIndex: 0, sectionId: "five-codes", answers,
      onAnswerChange: vi.fn(), onComplete, onExerciseComplete, rewardAttempts,
    });
    return {button: checkButton(tree)!, onComplete, onExerciseComplete};
  }
  it("rewards a complete imperfect attempt using the original reward key", () => {
    const result = render({0:"shift", 1:"yes", 2:"work"});
    expect(result.button.props.disabled).toBe(false);
    result.button.props.onClick();
    expect(result.onExerciseComplete).toHaveBeenCalledWith({exerciseId:"know-the-codes",sectionId:"five-codes"});
    expect(result.onComplete).not.toHaveBeenCalled();
  });
  it("does not reward an incomplete or whitespace-only attempt", () => {
    const result = render({0:"dinner",1:"no",2:"   "});
    expect(result.button.props.disabled).toBe(true);
    result.button.props.onClick();
    expect(result.onExerciseComplete).not.toHaveBeenCalled();
  });
  it("keeps accuracy-based completion and other guides' behavior", () => {
    const correct = render({0:"dinner",1:"no",2:"works"});
    correct.button.props.onClick();
    expect(correct.onComplete).toHaveBeenCalledOnce();
    expect(correct.onExerciseComplete).toHaveBeenCalledOnce();
    const other = render({0:"shift",1:"yes",2:"work"}, false);
    other.button.props.onClick();
    expect(other.onExerciseComplete).not.toHaveBeenCalled();
  });
});
