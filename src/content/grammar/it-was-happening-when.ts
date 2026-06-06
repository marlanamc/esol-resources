import type { InteractiveGuideContent } from "@/types/activity";
import { itWasHappeningWhenImages as img } from "@/data/it-was-happening-when-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers (standard toolkit)
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

export const itWasHappeningWhenContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — The Pipe Burst
    // =========================================================================
    {
      id: "the-pipe-burst",
      title: "The Pipe Burst",
      tenseDiagram: {
        title: "Finished actions, one after another",
        elements: [
          { id: "ps-dot-1", type: "single-dot", zone: "past", position: 25, verbLabel: "woke up" },
          { id: "ps-dot-2", type: "single-dot", zone: "past", position: 50, verbLabel: "saw the water" },
          { id: "ps-dot-3", type: "single-dot", zone: "past", position: 75, verbLabel: "called the landlord" },
        ],
      },
      explanation: `
        ${sceneCard("sceneApartment", "East Boston apartment, third floor. Tuesday night, 11:45 PM.", "terracotta")}
        ${dialogue([
          { speaker: "Lucia", avatar: "👩🏽", text: "Something <strong>woke</strong> me up last night. I <strong>heard</strong> a noise from the ceiling. I <strong>got up</strong> and <strong>turned on</strong> the light.", side: "right", tone: "terracotta" },
          { speaker: "Landlord", avatar: "🧑‍💼", text: "What did you see?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Water. It <strong>came</strong> through the ceiling above the kitchen. I <strong>grabbed</strong> a bucket and I <strong>called</strong> you right away.", side: "right", tone: "terracotta" },
        ])}
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Simple</strong> = finished actions told in order. Each one happened and ended before the next one started.</p>
        </div>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>Lucia <strong>woke up</strong> at midnight.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>She <strong>saw</strong> water on the kitchen floor.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>She <strong>called</strong> the landlord immediately.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("signal words", "amber")}
            <span>last night, right away, immediately, at midnight, then, after that</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "iwh-s1-ex1",
          title: "Practice: Past Simple",
          instructions: "Choose the correct past simple form or spot the error.",
          items: [
            {
              type: "radio",
              label: "Lucia ___ a noise and got out of bed. Which form fits?",
              options: [
                { value: "hears", label: "hears" },
                { value: "heard", label: "heard" },
                { value: "was hearing", label: "was hearing" },
              ],
              expectedAnswer: "heard",
            },
            {
              type: "radio",
              label: "\"She <strong>grabs</strong> a bucket and called the landlord.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'grabbed' to match the past tense." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Unscramble to make a past simple sentence:",
              words: ["Water", "came", "through", "the", "ceiling"],
              correctAnswer: "Water came through the ceiling",
            },
            {
              type: "text",
              label: "She ___ (turn on) the light and looked around.",
              expectedAnswers: ["turned on"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — What Were You Doing?
    // =========================================================================
    {
      id: "what-were-you-doing",
      title: "What Were You Doing?",
      tenseDiagram: {
        title: "Actions already in progress when the pipe burst",
        elements: [
          { id: "pc-line-kids", type: "solid-line", zone: "past", position: 25, verbLabel: "were sleeping (kids)" },
          { id: "pc-line-cooker", type: "solid-line", zone: "past", position: 50, verbLabel: "was running (rice cooker)" },
          { id: "ps-dot-burst", type: "single-dot", zone: "past", position: 75, verbLabel: "pipe burst" },
        ],
      },
      explanation: `
        ${sceneCard("sceneKitchen", "Lucia's apartment kitchen. Same night, before the pipe burst.", "blue")}
        ${dialogue([
          { speaker: "Landlord", avatar: "🧑‍💼", text: "Was anyone else awake? What was happening in the apartment?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "My kids <strong>were sleeping</strong> in the back room. The rice cooker <strong>was still running</strong> from dinner. I <strong>was mopping</strong> the floor when the water <strong>started</strong> coming through.", side: "right", tone: "blue" },
          { speaker: "Landlord", avatar: "🧑‍💼", text: "And the red envelopes on the table?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Yes, we <strong>were getting</strong> ready for Lunar New Year. My daughter <strong>was writing</strong> names on them when everything <strong>happened</strong>.", side: "right", tone: "blue" },
        ])}
        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Continuous</strong> = an action already in progress at a moment in the past. It was running in the background. Form: <strong>was / were + verb-ing</strong>.</p>
        </div>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("in progress", "blue")}
            <span><em>The kids <strong>were sleeping</strong> in the back room.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("in progress", "blue")}
            <span><em>The rice cooker <strong>was still running</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("in progress", "blue")}
            <span><em>She <strong>was mopping</strong> the floor when the water came through.</em></span>
          </div>
        </div>
        <p style="font-size: 0.95rem; color: #555; margin: 0.5rem 0 0">On the timeline, past continuous is a line. The pipe burst (past simple) is the dot that interrupted it.</p>
      `,
      exercises: [
        {
          id: "iwh-s2-ex1",
          title: "Practice: Past Continuous",
          instructions: "Choose the correct form or spot the error.",
          items: [
            {
              type: "radio",
              label: "The kids ___ when the pipe burst. Which form fits?",
              options: [
                { value: "slept", label: "slept (past simple)" },
                { value: "were sleeping", label: "were sleeping (past continuous)" },
                { value: "sleep", label: "sleep (present simple)" },
              ],
              expectedAnswer: "were sleeping",
            },
            {
              type: "radio",
              label: "\"She <strong>was mop</strong> the floor when the water came through.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'was mopping'." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "rice", "cooker", "was", "still", "running", "at", "midnight"],
              correctAnswer: "The rice cooker was still running at midnight",
            },
            {
              type: "text",
              label: "Her daughter ___ (write) names on envelopes when the pipe burst.",
              expectedAnswers: ["was writing"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — When and While
    // =========================================================================
    {
      id: "when-and-while",
      title: "When and While",
      tenseDiagram: {
        title: "The continuous action (line) is interrupted by the simple action (dot)",
        elements: [
          { id: "pc-line-s3", type: "solid-line", zone: "past", position: 30, verbLabel: "was mopping (in progress)" },
          { id: "ps-dot-s3", type: "single-dot", zone: "past", position: 68, verbLabel: "pipe burst (interruption)" },
        ],
      },
      explanation: `
        ${dialogue([
          { speaker: "Amina", avatar: "👩🏿", text: "Lucia, what happened last night? I heard noise from upstairs.", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "I <strong>was mopping</strong> the kitchen <strong>when</strong> the pipe <strong>burst</strong>. Water came everywhere.", side: "right", tone: "terracotta" },
          { speaker: "Amina", avatar: "👩🏿", text: "<strong>While</strong> you <strong>were calling</strong> the landlord, I heard you on the phone. I almost knocked.", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "I know. The kids <strong>woke up while</strong> I <strong>was moving</strong> furniture away from the water.", side: "right", tone: "terracotta" },
        ])}
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>when</strong> + past simple for the interruption. Use <strong>while</strong> + past continuous for the action that was in progress.</p>
        </div>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("when", "terracotta")}
            <span><em>She <strong>was mopping</strong> the floor <strong>when</strong> the pipe <strong>burst</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("while", "blue")}
            <span><em><strong>While</strong> she <strong>was calling</strong> the landlord, Amina heard her voice.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("when", "terracotta")}
            <span><em>The kids <strong>woke up when</strong> Lucia <strong>moved</strong> the furniture.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("while", "blue")}
            <span><em>The rice cooker <strong>was running while</strong> everyone <strong>slept</strong>.</em></span>
          </div>
        </div>
        <p style="font-size: 0.95rem; color: #555; margin: 0.5rem 0 0">Quick tip: the continuous action is the background (line). The simple action is the event that cut into it or happened during it (dot).</p>
      `,
      exercises: [
        {
          id: "iwh-s3-ex1",
          title: "Practice: When and While",
          instructions: "Choose the correct word or form.",
          items: [
            {
              type: "radio",
              label: "She ___ the floor when the pipe burst. Which form fits in the blank?",
              options: [
                { value: "mopped", label: "mopped" },
                { value: "was mopping", label: "was mopping" },
              ],
              expectedAnswer: "was mopping",
            },
            {
              type: "radio",
              label: "The kids woke up ___ Lucia was moving the furniture.",
              options: [
                { value: "when", label: "when" },
                { value: "while", label: "while" },
              ],
              expectedAnswer: "while",
            },
            {
              type: "radio",
              label: "\"<strong>While</strong> the pipe burst, she was mopping.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. 'While' goes with the continuous action. Should be: 'While she was mopping, the pipe burst.'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["While", "Lucia", "was", "calling", "the", "landlord", "Amina", "listened"],
              correctAnswer: "While Lucia was calling the landlord Amina listened",
            },
            {
              type: "text",
              label: "The kids ___ (sleep) while the water came through the ceiling.",
              expectedAnswers: ["were sleeping"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Telling the Landlord
    // =========================================================================
    {
      id: "telling-the-landlord",
      title: "Telling the Landlord",
      explanation: `
        ${sceneCard("scenePhone", "Lucia's apartment. Wednesday morning, 8:00 AM.", "amber")}
        ${dialogue([
          { speaker: "Brian", avatar: "👨🏻", text: "Lucia, this is Brian from the building. I heard about the pipe. Can you walk me through what happened?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Yes. It <strong>was</strong> almost midnight. The kids <strong>were sleeping</strong>. I <strong>was mopping</strong> the kitchen <strong>when</strong> I <strong>heard</strong> a crack above me.", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "👨🏻", text: "And then?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Water <strong>came</strong> down fast. I <strong>grabbed</strong> a bucket. <strong>While</strong> I <strong>was holding</strong> the bucket, I <strong>called</strong> the landlord with my other hand.", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "👨🏻", text: "Okay, I have enough to file the report. Thank you.", side: "left", tone: "sage" },
        ])}
        <p style="font-size: 0.95rem; margin: 1rem 0 0.5rem">Lucia uses both tenses together: past simple for the sequence of events, past continuous for what was already happening in the background. Choose the right tense for each blank below.</p>
      `,
      exercises: [
        {
          id: "iwh-s4-ex1",
          title: "Practice: Choose the Right Tense",
          instructions: "Choose past simple or past continuous based on meaning.",
          items: [
            {
              type: "radio",
              label: "The kids ___ when the pipe burst. (They were already in bed.)",
              options: [
                { value: "slept", label: "slept (past simple)" },
                { value: "were sleeping", label: "were sleeping (past continuous)" },
              ],
              expectedAnswer: "were sleeping",
            },
            {
              type: "radio",
              label: "Lucia ___ a bucket right away. (One quick action.)",
              options: [
                { value: "grabbed", label: "grabbed (past simple)" },
                { value: "was grabbing", label: "was grabbing (past continuous)" },
              ],
              expectedAnswer: "grabbed",
            },
            {
              type: "radio",
              label: "While she ___ the bucket, she called the landlord.",
              options: [
                { value: "held", label: "held (past simple)" },
                { value: "was holding", label: "was holding (past continuous)" },
              ],
              expectedAnswer: "was holding",
            },
            {
              type: "radio",
              label: "\"Brian called Lucia while she was sleeping.\" Which action was already in progress?",
              options: [
                { value: "a", label: "Brian calling" },
                { value: "b", label: "Lucia sleeping" },
                { value: "c", label: "Both were in progress." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Water ___ (come) down fast when Lucia grabbed a bucket.",
              expectedAnswers: ["came"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Your Turn: What Happened?
    // =========================================================================
    {
      id: "your-turn-what-happened",
      title: "Your Turn: What Happened?",
      explanation: `
        ${sceneCard("sceneInspector", "Building hallway. Wednesday afternoon. Housing inspector visit.", "sage")}
        ${dialogue([
          { speaker: "Officer Davis", avatar: "👩‍💼", text: "Ms. Lucia, I need you to look over this written statement. Tell me if anything is wrong.", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Of course. I want to make sure it is right.", side: "right", tone: "terracotta" },
        ])}
        <p style="font-size: 0.95rem; margin: 1rem 0 0.5rem">Help Lucia check her written statement. Correct the errors and build accurate sentences for the inspector's report.</p>
      `,
      exercises: [
        {
          id: "iwh-s5-ex1",
          title: "Practice: Error Correction",
          instructions: "Find the error in each sentence from Lucia's statement.",
          items: [
            {
              type: "radio",
              label: "\"The kids were sleep in the back room when the pipe burst.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'were sleeping' (was/were + verb-ing)." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"I was mopping the kitchen when I heard a crack.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct." },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"While the water came down, I was grabbing a bucket and called the landlord.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. 'Was grabbing' should be 'grabbed' for the quick finished action." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Build a sentence for the report:",
              words: ["She", "called", "the", "landlord", "while", "she", "was", "holding", "the", "bucket"],
              correctAnswer: "She called the landlord while she was holding the bucket",
            },
            {
              type: "word-scramble",
              label: "Build another sentence:",
              words: ["The", "pipe", "burst", "when", "she", "was", "mopping", "the", "kitchen"],
              correctAnswer: "The pipe burst when she was mopping the kitchen",
            },
            {
              type: "text",
              label: "The kids ___ (not / wake up) when the water started. They stayed asleep.",
              expectedAnswers: ["did not wake up", "didn't wake up"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/past-simple-past-continuous\" style=\"font-weight:700;text-decoration:underline\">Past Simple + Past Continuous Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "iwh-q1",
      question: "Lucia woke up, saw the water, and called the landlord. Which tense tells these actions?",
      options: [
        { value: "a", label: "Past Continuous, because the actions were in progress." },
        { value: "b", label: "Past Simple, because each action finished before the next started." },
        { value: "c", label: "Present Simple, because it is a routine." },
      ],
      correctAnswer: "b",
      explanation: "Past simple shows finished actions in sequence. Each one ended before the next began.",
      topic: "past-simple",
      skill: "recognition",
      skillTag: "sequence-finished-actions",
      difficulty: "easy",
    },
    {
      id: "iwh-q2",
      question: "Which sentence is correct?",
      options: [
        { value: "a", label: "The kids were sleep when the pipe burst." },
        { value: "b", label: "The kids was sleeping when the pipe burst." },
        { value: "c", label: "The kids were sleeping when the pipe burst." },
      ],
      correctAnswer: "c",
      explanation: "Past continuous with a plural subject = were + verb-ing. 'Were sleep' and 'was sleeping' are both incorrect forms.",
      topic: "past-continuous",
      skill: "error-detection",
      skillTag: "form-were-verb-ing",
      difficulty: "easy",
    },
    {
      id: "iwh-q3",
      question: "Lucia was mopping the floor when the pipe burst. Which action was already in progress?",
      options: [
        { value: "a", label: "The pipe bursting" },
        { value: "b", label: "Lucia mopping" },
        { value: "c", label: "Both were already in progress." },
      ],
      correctAnswer: "b",
      explanation: "Past continuous (was mopping) shows the background action in progress. Past simple (burst) is the event that interrupted it.",
      topic: "past-continuous",
      skill: "usage",
      skillTag: "background-vs-interruption",
      difficulty: "easy",
    },
    {
      id: "iwh-q4",
      question: "The pipe burst ___ she was mopping the kitchen.",
      options: [
        { value: "a", label: "when" },
        { value: "b", label: "while" },
        { value: "c", label: "Both 'when' and 'while' are correct here." },
      ],
      correctAnswer: "a",
      explanation: "'When' connects a simple action (pipe burst) to a continuous background (was mopping). 'While' goes with the continuous clause: 'While she was mopping, the pipe burst.'",
      topic: "when-while",
      skill: "usage",
      skillTag: "when-while-contrast",
      difficulty: "medium",
    },
    {
      id: "iwh-q5",
      question: "While Lucia ___ the landlord, the kids woke up.",
      options: [
        { value: "a", label: "called" },
        { value: "b", label: "was calling" },
        { value: "c", label: "calls" },
      ],
      correctAnswer: "b",
      explanation: "'While' introduces the action in progress, so past continuous (was calling) is needed.",
      topic: "when-while",
      skill: "usage",
      skillTag: "while-plus-past-continuous",
      difficulty: "medium",
    },
    {
      id: "iwh-q6",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "She was holding the bucket when she called him." },
        { value: "b", label: "Water came through the ceiling at midnight." },
        { value: "c", label: "The rice cooker were running all night." },
      ],
      correctAnswer: "c",
      explanation: "'The rice cooker' is singular, so the correct form is 'was running,' not 'were running.'",
      topic: "past-continuous",
      skill: "error-detection",
      skillTag: "was-were-agreement",
      difficulty: "medium",
    },
    {
      id: "iwh-q7",
      question: "Lucia grabbed a bucket right away. This was one quick finished action. Which tense fits?",
      options: [
        { value: "a", label: "Past simple: grabbed" },
        { value: "b", label: "Past continuous: was grabbing" },
        { value: "c", label: "Present simple: grabs" },
      ],
      correctAnswer: "a",
      explanation: "A single, quick, finished action uses past simple. Past continuous is for actions already in progress over time.",
      topic: "past-simple",
      skill: "usage",
      skillTag: "single-event-past-simple",
      difficulty: "easy",
    },
    {
      id: "iwh-q8",
      question: "Brian called Lucia the next morning. She was still cleaning up. Which sentence is correct?",
      options: [
        { value: "a", label: "While Brian called, she cleaned up." },
        { value: "b", label: "Brian called while she was still cleaning up." },
        { value: "c", label: "Brian was calling while she cleaned." },
      ],
      correctAnswer: "b",
      explanation: "The ongoing background action (still cleaning up) uses past continuous. The interruption (Brian called) uses past simple.",
      topic: "when-while",
      skill: "usage",
      skillTag: "combine-simple-continuous",
      difficulty: "medium",
    },
    {
      id: "iwh-q9",
      question: "\"She was mopping the floor when it was bursting.\" What is wrong?",
      options: [
        { value: "a", label: "Nothing is wrong." },
        { value: "b", label: "'Was bursting' should be 'burst'. The pipe bursting is the interruption, so it needs past simple." },
        { value: "c", label: "'Was mopping' should be 'mopped'." },
      ],
      correctAnswer: "b",
      explanation: "The interrupting event (pipe bursting) uses past simple. Only the background action (was mopping) stays in past continuous.",
      topic: "when-while",
      skill: "error-detection",
      skillTag: "interruption-past-simple",
      difficulty: "hard",
    },
    {
      id: "iwh-q10",
      question: "The inspector asks: 'What was happening when the pipe burst?' Which answer is best?",
      options: [
        { value: "a", label: "The kids slept and the rice cooker ran." },
        { value: "b", label: "The kids were sleeping and the rice cooker was running." },
        { value: "c", label: "The kids sleep and the rice cooker runs." },
      ],
      correctAnswer: "b",
      explanation: "When describing what was already in progress at a past moment, use past continuous (were sleeping, was running).",
      topic: "past-continuous",
      skill: "usage",
      skillTag: "describe-background-scene",
      difficulty: "hard",
    },
  ],
};
