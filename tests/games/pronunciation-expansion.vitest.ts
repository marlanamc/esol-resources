import { describe, expect, it } from "vitest";
import { comparePronunciationActivities, getPronunciationActivityDescriptor } from "@/lib/pronunciation-activity";
import { resolveActivityGameUi } from "@/lib/gamification/activity-points";

describe("pronunciation expansion metadata", () => {
  it("resolves the sentence listening game ui from content", () => {
    const gameUi = resolveActivityGameUi({
      content: JSON.stringify({
        type: "pronunciation-listening",
        targetSound: "B vs V",
        sentences: [],
      }),
    });

    expect(gameUi).toBe("pronunciation-listening");
  });

  it("uses pronunciation metadata to build explicit card copy", () => {
    const descriptor = getPronunciationActivityDescriptor({
      id: "pron-b-v-listening",
      title: "B vs V Listening",
      ui: "minimal-pairs",
      content: JSON.stringify({
        type: "minimal-pairs",
        contrastId: "b-v",
        meta: {
          skillFamily: "minimal-pairs",
          practiceMode: "listening",
          targetLabel: "B vs V",
          targetDescription: "hear the lip-and-teeth /v/ clearly before you move into sentence listening",
          recommendedOrder: 2,
        },
      }),
    });

    expect(descriptor.friendlyTitle).toBe("B vs V listening");
    expect(descriptor.pathChip).toBe("Path 2");
    expect(descriptor.motif).toBe("minimal-pairs");
  });

  it("sorts pronunciation activities by recommended order before title", () => {
    const activities = [
      {
        id: "pron-r-l-listening",
        title: "R vs L Listening",
        ui: "minimal-pairs",
        content: JSON.stringify({
          type: "minimal-pairs",
          contrastId: "r-l",
          meta: {
            skillFamily: "minimal-pairs",
            practiceMode: "listening",
            targetLabel: "R vs L",
            recommendedOrder: 3,
          },
        }),
      },
      {
        id: "pron-short-i-long-e-listening",
        title: "Short i vs Long e Listening",
        ui: "minimal-pairs",
        content: JSON.stringify({
          type: "minimal-pairs",
          contrastId: "short-i-long-e",
          meta: {
            skillFamily: "minimal-pairs",
            practiceMode: "listening",
            targetLabel: "Short i vs Long e",
            recommendedOrder: 1,
          },
        }),
      },
    ];

    const sorted = [...activities].sort(comparePronunciationActivities);

    expect(sorted.map((activity) => activity.id)).toEqual([
      "pron-short-i-long-e-listening",
      "pron-r-l-listening",
    ]);
  });
});
