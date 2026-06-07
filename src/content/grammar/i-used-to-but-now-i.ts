import type { InteractiveGuideContent } from "@/types/activity";
import { iUsedToButNowIImages as img } from "@/data/i-used-to-but-now-i-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers
// ---------------------------------------------------------------------------

const sceneCard = (
  sceneId: keyof typeof img,
  caption: string,
  accent: "terracotta" | "sage" | "blue" | "amber" = "terracotta"
): string => {
  const scene = img[sceneId];
  if (!scene) return "";
  return `
    <div class="gc-bg-white" style="margin: 0 0 1.5rem 0; padding: 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 10px rgba(0,0,0,0.06)">
      <img src="${scene.url}" alt="${scene.alt}" loading="lazy" style="display: block; width: 100%; height: auto; max-height: 260px; object-fit: cover" />
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
        <span style="font-size: 0.68rem; opacity: 0.7">Photo: <a href="${scene.credit.url}" rel="noopener" target="_blank">${scene.credit.name}</a> / Unsplash</span>
      </div>
    </div>
  `;
};

type Turn = {
  speaker: string;
  avatar: string;
  text: string;
  side: "left" | "right";
  tone: "terracotta" | "sage" | "blue" | "amber";
};

const dialogue = (turns: Turn[]): string => {
  const bubbles = turns
    .map((t) => {
      const bgClass = `gc-bg-${t.tone}-alpha`;
      const radius =
        t.side === "left"
          ? "0.875rem 0.875rem 0.875rem 0.25rem"
          : "0.875rem 0.875rem 0.25rem 0.875rem";
      const rowStyle =
        t.side === "left"
          ? "display: flex; gap: 0.625rem; align-items: flex-start"
          : "display: flex; gap: 0.625rem; align-items: flex-start; flex-direction: row-reverse";
      return `
        <div style="${rowStyle}">
          <div style="font-size: 1.65rem; line-height: 1; flex-shrink: 0; padding-top: 0.25rem">${t.avatar}</div>
          <div class="${bgClass}" style="padding: 0.65rem 0.9rem; border-radius: ${radius}; max-width: 82%">
            <div class="gc-text-${t.tone}" style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; margin-bottom: 0.15rem">${t.speaker}</div>
            <div style="line-height: 1.5">${t.text}</div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style="display: flex; flex-direction: column; gap: 0.625rem; margin: 1.25rem 0; padding: 1rem; border-radius: 0.75rem; background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06)">
      ${bubbles}
    </div>
  `;
};

const labelPill = (text: string, color: "terracotta" | "sage" | "blue" | "amber"): string =>
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const iUsedToButNowIContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - Life Was Different Back Home
    // =========================================================================
    {
      id: "life-back-home",
      title: "Life Was Different Back Home",
      icon: "🚌",
      tenseDiagram: {
        title: "Used to: a past habit that changed",
        elements: [
          { id: "ut-past", type: "multiple-dots", zone: "past", position: 35, verbLabel: "used to + verb (old habit)" },
          { id: "ut-now", type: "multiple-dots", zone: "present", position: 60, verbLabel: "now (changed)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusCommute", "On the way home after her shift. Tuesday, 8:15 AM.", "sage")}

        <p>Linh works as a housekeeper at a hotel in East Boston. She moved from Vietnam four years ago. After her morning shift, she video-calls her sister Mai on the 114 bus.</p>

        ${dialogue([
          { speaker: "Mai", avatar: "👩🏻", text: "How are the kids?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "They're good. Busy with school.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "I <strong>used to have</strong> family nearby. Now I only see you on the phone.", side: "right", tone: "terracotta" },
          { speaker: "Mai", avatar: "👩🏻", text: "I know. It's hard.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Used to + base verb</strong> = a past habit or state that is <em>not</em> true now. It is not the same as <strong>am used to</strong> (that comes next week).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("past habit", "terracotta")}
            <span><em>I <strong>used to have</strong> family nearby.</em> (Not true now.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("formula", "sage")}
            <span><strong>Subject + used to + base verb</strong> (no -ing, no -ed on the main verb)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "What does used to mean?",
          instructions: "Choose the best answer.",
          items: [
            {
              type: "radio",
              label: "\"I used to have family nearby.\" What is true now?",
              options: [
                { value: "a", label: "Linh still has family nearby." },
                { value: "b", label: "Linh does not have family nearby anymore." },
                { value: "c", label: "Linh will have family nearby in the future." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the missing word.",
          items: [
            {
              type: "text",
              label: "I ___ to have family nearby.",
              expectedAnswers: ["used"],
            },
          ],
        },
        {
          id: "s1-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "used", "to", "have", "family", "nearby"],
              correctAnswer: "I used to have family nearby",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 - I Didn't Use To...
    // =========================================================================
    {
      id: "didnt-use-to",
      title: "I Didn't Use To...",
      icon: "☕",
      explanation: `
        ${sceneCard("sceneBreakRoom", "Hotel housekeeping break room. Tuesday, 9 AM.", "blue")}

        <p>Linh's coworker Michelle sits down with her coffee. She asks about life since moving to Boston.</p>

        ${dialogue([
          { speaker: "Michelle", avatar: "👩🏼", text: "Did you always work mornings?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "No. I <strong>didn't use to</strong> wake up at 4. Back home I <strong>used to</strong> start work at 8.", side: "right", tone: "terracotta" },
          { speaker: "Michelle", avatar: "👩🏼", text: "And dinner? Do you cook late?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "I <strong>didn't use to</strong> cook dinner at 11 pm. Now I meal-prep on Sunday.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Negative:</strong> didn't use to + base verb. No <strong>-d</strong> on <em>use</em>.<br/><strong>Question:</strong> Did you use to + base verb?</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("negative", "terracotta")}
            <span><em>I <strong>didn't use to</strong> cook dinner at 11 pm.</em> (Now I cook earlier.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("question", "blue")}
            <span><em><strong>Did you use to</strong> work night shifts?</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Choose the correct negative",
          instructions: "Pick the correct form.",
          items: [
            {
              type: "radio",
              label: "Linh cooks earlier now. Which sentence is correct?",
              options: [
                { value: "a", label: "I didn't used to cook dinner at 11 pm." },
                { value: "b", label: "I didn't use to cook dinner at 11 pm." },
                { value: "c", label: "I don't use to cook dinner at 11 pm." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Michelle asks about Linh's old schedule. Which question is correct?",
              options: [
                { value: "a", label: "Did you used to wake up at 4?" },
                { value: "b", label: "Did you use to wake up at 4?" },
                { value: "c", label: "Do you use to wake up at 4?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Fill in the blank",
          instructions: "Write use (no -d).",
          items: [
            {
              type: "text",
              label: "I didn't ___ to cook dinner at 11 pm.",
              expectedAnswers: ["use"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"I didn't used to meal-prep on Sundays.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"didn't use to\" (no -d on use)." },
                { value: "c", label: "Error: should be \"don't use to\"." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 - Before Boston, After Boston
    // =========================================================================
    {
      id: "before-after-boston",
      title: "Before Boston, After Boston",
      icon: "🏠",
      tenseDiagram: {
        title: "Past state vs. life now",
        elements: [
          { id: "ut-state", type: "multiple-dots", zone: "past", position: 30, verbLabel: "used to live / have / be" },
          { id: "ut-present", type: "multiple-dots", zone: "present", position: 65, verbLabel: "but now I..." },
        ],
      },
      explanation: `
        ${sceneCard("sceneApartment", "Parking lot near the hotel. Tuesday, 3 PM.", "amber")}

        <p>After her shift, Linh meets her classmate Carlos. They talk about life before and after Boston.</p>

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Where did you live before you came here?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "I <strong>used to live</strong> with my parents. <strong>But now I</strong> share a two-bedroom with my cousin.", side: "right", tone: "terracotta" },
          { speaker: "Carlos", avatar: "👨🏽", text: "How did you get to work back home?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "I <strong>used to walk</strong> to work. <strong>But now I</strong> take two buses.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Used to</strong> works for past <em>states</em> (live, have, be) and <em>actions</em> (walk, cook, work). Pair it with <strong>but now I...</strong> to show the change.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("past state", "terracotta")}
            <span><em>I <strong>used to live</strong> with my parents.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("past action", "sage")}
            <span><em>I <strong>used to walk</strong> to work.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("but now", "blue")}
            <span><em><strong>But now I</strong> take two buses.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Complete the contrast",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "radio",
              label: "Linh lived with her parents before Boston. \"I ___ with my parents.\"",
              options: [
                { value: "a", label: "used to live" },
                { value: "b", label: "am used to live" },
                { value: "c", label: "used to living" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Linh walked to work back home. Which full sentence is correct?",
              options: [
                { value: "a", label: "I used to walk to work, but now I take two buses." },
                { value: "b", label: "I used to walking to work, but now I take two buses." },
                { value: "c", label: "I am used to walk to work, but now I take two buses." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Fill in the blank",
          instructions: "Write the base verb.",
          items: [
            {
              type: "text",
              label: "I used to ___ (live) with my parents, but now I share an apartment.",
              expectedAnswers: ["live"],
            },
          ],
        },
        {
          id: "s3-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "used", "to", "walk", "to", "work,", "but", "now", "I", "take", "the", "bus"],
              correctAnswer: "I used to walk to work, but now I take the bus",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 - Don't Mix Them Up
    // =========================================================================
    {
      id: "dont-mix-up",
      title: "Don't Mix Them Up",
      icon: "🥪",
      explanation: `
        ${sceneCard("sceneKitchenLunch", "Linh's kitchen. Wednesday, 6:30 AM.", "terracotta")}

        <p>School morning rush. Linh packs lunch for her two kids. May is Asian American and Pacific Islander Heritage Month at their school.</p>

        ${dialogue([
          { speaker: "Linh", avatar: "👩🏻", text: "I <strong>used to pack</strong> rice in their lunchboxes every day.", side: "right", tone: "terracotta" },
          { speaker: "Son", avatar: "👦🏻", text: "Can I have PB&amp;J today?", side: "left", tone: "amber" },
          { speaker: "Linh", avatar: "👩🏻", text: "OK. <strong>Now I pack</strong> PB&amp;J most days. Your sister is <strong>getting used to</strong> it too.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Used to + verb</strong> = past habit, not true now.<br/>
            <strong>Am used to + -ing</strong> = accustomed now (different grammar). You will learn be/get used to next week.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("past habit", "terracotta")}
            <span><em>I <strong>used to pack</strong> rice every day.</em> (I don't anymore.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("accustomed now", "blue")}
            <span><em>He is <strong>getting used to</strong> PB&amp;J.</em> (Preview for next week. Not the same as used to.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Which sentence is correct?",
          instructions: "Used to vs. am used to.",
          items: [
            {
              type: "radio",
              label: "Linh packed rice every day in the past. She doesn't anymore.",
              options: [
                { value: "a", label: "I used to pack rice in lunchboxes." },
                { value: "b", label: "I am used to pack rice in lunchboxes." },
                { value: "c", label: "I used to packing rice in lunchboxes." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "I used to walk to work back home." },
                { value: "b", label: "I am used to walk two buses now." },
                { value: "c", label: "I didn't use to meal-prep on Sundays." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Fill in the blank",
          instructions: "Write used or am.",
          items: [
            {
              type: "text",
              label: "I ___ to pack rice every day. (past habit, not true now)",
              expectedAnswers: ["used"],
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "\"I used to packing PB&amp;J in lunchboxes.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"used to pack\" (base verb, not -ing)." },
                { value: "c", label: "Error: should be \"am used to packing\"." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - One Whole Conversation
    // =========================================================================
    {
      id: "whole-story",
      title: "Tell Your Story: One Whole Conversation",
      icon: "📚",
      explanation: `
        ${sceneCard("sceneClassroom", "Evening ESOL class, East Boston. Thursday, 7 PM.", "sage")}

        <p>Ms. Tran asks students to share how life changed since they moved to Boston.</p>

        ${dialogue([
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "Linh, tell us one thing that changed.", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "I <strong>used to have</strong> family nearby. <strong>But now I</strong> only see them on video calls.", side: "right", tone: "terracotta" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I <strong>didn't use to</strong> take the bus. I <strong>used to</strong> drive. <strong>But now I</strong> take two buses to work.", side: "left", tone: "blue" },
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "<strong>Did you use to</strong> cook late at night, Linh?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "Yes. I <strong>used to</strong> cook at 11 pm. <strong>But now I</strong> meal-prep on Sunday.", side: "right", tone: "terracotta" },
        ])}
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, would rather, and extra practice, open the <a href=\"/grammar-reader/used-to-would-rather\" style=\"font-weight:700;text-decoration:underline\">Used to / Would rather Full Guide</a>.",
      },
      exercises: [
        {
          id: "s5-ex1",
          title: "Pick the right pattern",
          instructions: "Positive, negative, or question?",
          items: [
            {
              type: "radio",
              label: "Linh had family nearby before Boston.",
              options: [
                { value: "a", label: "I used to have family nearby." },
                { value: "b", label: "I didn't use to have family nearby." },
                { value: "c", label: "Did you use to have family nearby?" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Linh did not meal-prep before. Now she does.",
              options: [
                { value: "a", label: "I used to meal-prep on Sundays." },
                { value: "b", label: "I didn't use to meal-prep on Sundays." },
                { value: "c", label: "I am used to meal-prep on Sundays." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Fill in the blank",
          instructions: "Write used or use.",
          items: [
            {
              type: "text",
              label: "Did you ___ to cook dinner at 11 pm?",
              expectedAnswers: ["use"],
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "used", "to", "pack", "rice,", "but", "now", "I", "pack", "PB&J"],
              correctAnswer: "I used to pack rice, but now I pack PB&J",
            },
          ],
        },
        {
          id: "s5-ex4",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "Carlos says: \"I used to cooking dinner at 11 pm.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"used to cook\" (base verb)." },
                { value: "c", label: "Error: should be \"didn't used to cook\"." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "ut-q1",
      question: "What does \"used to\" describe?",
      options: [
        { value: "a", label: "A habit that is still true now" },
        { value: "b", label: "A past habit or state that is NOT true now" },
        { value: "c", label: "A future plan" },
      ],
      correctAnswer: "b",
      explanation: "Used to + base verb describes something from the past that changed.",
      topic: "used-to",
      skill: "usage",
      skillTag: "meaning-past-habit",
      difficulty: "easy",
    },
    {
      id: "ut-q2",
      question: "Linh had family nearby before Boston. Which sentence is correct?",
      options: [
        { value: "a", label: "I used to have family nearby." },
        { value: "b", label: "I am used to have family nearby." },
        { value: "c", label: "I used to having family nearby." },
      ],
      correctAnswer: "a",
      explanation: "Used to + base verb. Not am used to, and not used to + -ing.",
      topic: "used-to",
      skill: "usage",
      skillTag: "positive-form-base-verb",
      difficulty: "easy",
    },
    {
      id: "ut-q3",
      question: "Linh cooks earlier now. Which negative sentence is correct?",
      options: [
        { value: "a", label: "I didn't used to cook dinner at 11 pm." },
        { value: "b", label: "I didn't use to cook dinner at 11 pm." },
        { value: "c", label: "I don't use to cook dinner at 11 pm." },
      ],
      correctAnswer: "b",
      explanation: "Negative: didn't use to (no -d on use).",
      topic: "used-to",
      skill: "usage",
      skillTag: "negative-didnt-use-to",
      difficulty: "easy",
    },
    {
      id: "ut-q4",
      question: "Michelle asks about Linh's old schedule. Which question is correct?",
      options: [
        { value: "a", label: "Did you used to wake up at 4?" },
        { value: "b", label: "Did you use to wake up at 4?" },
        { value: "c", label: "Do you use to wake up at 4?" },
      ],
      correctAnswer: "b",
      explanation: "Questions: Did + subject + use to + base verb.",
      topic: "used-to",
      skill: "usage",
      skillTag: "question-did-use-to",
      difficulty: "easy",
    },
    {
      id: "ut-q5",
      question: "Linh walked to work back home. Complete: \"I used to walk to work, but now I ___ two buses.\"",
      options: [
        { value: "a", label: "take" },
        { value: "b", label: "used to take" },
        { value: "c", label: "am used to take" },
      ],
      correctAnswer: "a",
      explanation: "But now I + present simple shows the change. Used to is only for the past part.",
      topic: "used-to",
      skill: "usage",
      skillTag: "but-now-contrast",
      difficulty: "medium",
    },
    {
      id: "ut-q6",
      question: "Find the error: \"I am used to pack rice in lunchboxes every day.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: past habit should be \"I used to pack\" (not am used to)." },
        { value: "c", label: "Error: should be \"I used to packing\"." },
      ],
      correctAnswer: "b",
      explanation: "Past habit = used to + verb. Am used to + -ing is a different structure (next week's lesson).",
      topic: "used-to",
      skill: "error-detection",
      skillTag: "error-am-used-to-vs-used-to",
      difficulty: "medium",
    },
    {
      id: "ut-q7",
      question: "Find the error: \"I used to packing PB&J in lunchboxes.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: should be \"used to pack\" (base verb, not -ing)." },
        { value: "c", label: "Error: should be \"didn't use to pack\"." },
      ],
      correctAnswer: "b",
      explanation: "After used to, use the base verb: pack, not packing.",
      topic: "used-to",
      skill: "error-detection",
      skillTag: "error-used-to-plus-ing",
      difficulty: "medium",
    },
    {
      id: "ut-q8",
      question: "AAPI Heritage Month: Linh packed rice before, now packs PB&J. Which sentence is correct?",
      options: [
        { value: "a", label: "I used to pack rice, but now I pack PB&J." },
        { value: "b", label: "I used to packing rice, but now I pack PB&J." },
        { value: "c", label: "I am used to pack rice, but now I pack PB&J." },
      ],
      correctAnswer: "a",
      explanation: "Used to pack (past habit) + but now I pack (present change).",
      topic: "used-to",
      skill: "usage",
      skillTag: "lunchbox-aapi-context",
      difficulty: "medium",
    },
    {
      id: "ut-q9",
      question: "Which sentence mixes up used to and am used to correctly as WRONG?",
      options: [
        { value: "a", label: "I used to take the bus." },
        { value: "b", label: "I didn't use to meal-prep." },
        { value: "c", label: "I am used to walk two buses every day." },
      ],
      correctAnswer: "c",
      explanation: "Am used to needs -ing (walking), not the base verb. This sentence is incorrect.",
      topic: "used-to",
      skill: "error-detection",
      skillTag: "error-am-used-to-base-verb",
      difficulty: "hard",
    },
    {
      id: "ut-q10",
      question: "Linh tells her full Boston story. Which summary is correct throughout?",
      options: [
        { value: "a", label: "I used to have family nearby and used to cook at 11 pm, but now I video-call and meal-prep on Sunday." },
        { value: "b", label: "I used to having family nearby and didn't used to cook early, but now I video-call." },
        { value: "c", label: "I am used to have family nearby and used to cook at 11 pm, but now I meal-prep." },
      ],
      correctAnswer: "a",
      explanation: "All forms correct: used to + base verb, no didn't used to, and but now for the change.",
      topic: "used-to",
      skill: "usage",
      skillTag: "mixed-patterns-summary",
      difficulty: "hard",
    },
  ],
};
