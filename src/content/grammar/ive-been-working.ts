import type { InteractiveGuideContent } from "@/types/activity";
import { iveBeenWorkingImages as img } from "@/data/ive-been-working-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers (copied from welcome-back-tenses-review.ts)
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

export const iveBeenWorkingContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — Introduce PPC form and meaning
    // =========================================================================
    {
      id: "six-days-a-week",
      title: "Six days a week",
      icon: "🏗️",
      tenseDiagram: {
        title: "Where it lives on the timeline",
        elements: [
          { id: "ppc-line", type: "solid-line", zone: "past", position: 35, verbLabel: "have been working (started)" },
          { id: "ppc-now", type: "solid-line", zone: "present", position: 50, verbLabel: "...still happening now" },
        ],
      },
      explanation: `
        ${sceneCard("sceneConstruction", "East Boston construction site, Wednesday morning, 6:45 AM. St. Patrick's Day parade closes Cambridge Street by 9.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Hector and Kevin grab coffee before the crew arrives. The parade means traffic is already backing up.</p>

        ${dialogue([
          { speaker: "Kevin", avatar: "🧑🏻", text: "You look tired, man.", side: "left", tone: "terracotta" },
          { speaker: "Hector", avatar: "👨🏽", text: "I <strong>have been working</strong> six days a week since January. No breaks.", side: "right", tone: "sage" },
          { speaker: "Kevin", avatar: "🧑🏻", text: "Same. I <strong>have been driving</strong> extra shifts because of the parade traffic. It kills my commute.", side: "left", tone: "terracotta" },
          { speaker: "Hector", avatar: "👨🏽", text: "How long <strong>have</strong> you <strong>been doing</strong> that?", side: "right", tone: "sage" },
          { speaker: "Kevin", avatar: "🧑🏻", text: "Three weeks. Starts in March every year.", side: "left", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Perfect Continuous</strong> = an action that started in the past and is still happening now. You want to say HOW LONG it has been going on.</p>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> have / has + been + verb-ing<br>
          <em>I <strong>have been working</strong> six days a week.</em><br>
          <em>He <strong>has been driving</strong> extra shifts.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("I / we / they / you", "sage")}
            <span><em><strong>have been</strong> + verb-ing</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("he / she / it", "terracotta")}
            <span><em><strong>has been</strong> + verb-ing</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "six-days-ex1",
          title: "Choose the correct form",
          instructions: "Pick the right answer for each sentence.",
          items: [
            {
              type: "radio",
              label: "Hector works six days a week. Which sentence is correct?",
              options: [
                { value: "a", label: "He have been working six days a week." },
                { value: "b", label: "He has been working six days a week." },
                { value: "c", label: "He has been worked six days a week." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Kevin and Hector both drive extra shifts. Which sentence is correct?",
              options: [
                { value: "a", label: "They has been driving extra shifts." },
                { value: "b", label: "They have been drive extra shifts." },
                { value: "c", label: "They have been driving extra shifts." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "six-days-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "been", "working", "six", "days", "a", "week", "since", "January"],
              correctAnswer: "I have been working six days a week since January",
            },
          ],
        },
        {
          id: "six-days-ex3",
          title: "Fill in the blank",
          instructions: "Write the three words that complete the Present Perfect Continuous.",
          items: [
            {
              type: "text",
              label: "Kevin drives extra shifts. He ___ extra shifts for three weeks. (has been driving)",
              expectedAnswers: ["has been driving"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — PPC with for / since
    // =========================================================================
    {
      id: "two-buses-since-february",
      title: "Two buses since the car broke down",
      icon: "🚌",
      tenseDiagram: {
        title: "Started in the past, still true now",
        elements: [
          { id: "ppc-start", type: "single-dot", zone: "past", position: 25, verbLabel: "car broke down (Feb)" },
          { id: "ppc-ongoing", type: "solid-line", zone: "past", position: 55, verbLabel: "have been taking (since Feb)" },
          { id: "ppc-present", type: "solid-line", zone: "present", position: 50, verbLabel: "still taking two buses" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusStop", "Bennington Street bus stop, 11:15 PM. Rosa and Claudette wait for the 112 after a double shift.", "blue")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Rosa's car broke down in February. The commute home now takes twice as long.</p>

        ${dialogue([
          { speaker: "Claudette", avatar: "👩🏿", text: "You still taking two buses?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yeah. I <strong>have been taking</strong> two buses since my car broke down in February.", side: "right", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏿", text: "How long <strong>have</strong> you <strong>been waiting</strong> for the mechanic?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Three weeks. He keeps saying next week.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>for</strong> with a length of time. Use <strong>since</strong> with a starting point.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("for", "sage")}
            <span><em>I have been waiting <strong>for three weeks</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("for", "sage")}
            <span><em>He has been working here <strong>for five years</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.07); border-radius: 0.4rem">
            ${labelPill("since", "blue")}
            <span><em>I have been taking two buses <strong>since February</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.07); border-radius: 0.4rem">
            ${labelPill("since", "blue")}
            <span><em>She has been saving money <strong>since she started this job</strong>.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "buses-ex1",
          title: "For or since?",
          instructions: "Choose the right word for each sentence.",
          items: [
            {
              type: "radio",
              label: "Rosa has been taking two buses ___ her car broke down.",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "since",
            },
            {
              type: "radio",
              label: "Hector has been working on this site ___ four months.",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "for",
            },
          ],
        },
        {
          id: "buses-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "has", "been", "waiting", "for", "the", "mechanic", "for", "three", "weeks"],
              correctAnswer: "She has been waiting for the mechanic for three weeks",
            },
          ],
        },
        {
          id: "buses-ex3",
          title: "Fill in the blank",
          instructions: "Write 'for' or 'since.'",
          items: [
            {
              type: "text",
              label: "Kevin has been driving extra shifts ___ March. (one word)",
              expectedAnswers: ["since"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Questions and short answers
    // =========================================================================
    {
      id: "how-long-have-you-been",
      title: "How long have you been working here?",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneHotel", "Hotel laundry department, third floor. Jennifer from HR runs orientation for new hires.", "amber")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara starts her first day at the hotel. Jennifer asks about her background before the walkthrough.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "How long <strong>have</strong> you <strong>been working</strong> in housekeeping?", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏿", text: "I <strong>have been cleaning</strong> offices and hotels for three years, since I came to Boston from Somalia.", side: "right", tone: "sage" },
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "And <strong>have</strong> you <strong>been using</strong> any industrial laundry equipment?", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏿", text: "Yes, I have. I learned on the machines at my last job.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Question form:</strong> How long + <em>have / has</em> + subject + <em>been</em> + verb-ing?</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("question", "amber")}
            <span><em>How long <strong>have</strong> you <strong>been working</strong> here?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("question", "amber")}
            <span><em>How long <strong>has</strong> she <strong>been living</strong> in East Boston?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("yes/no", "sage")}
            <span><em><strong>Have</strong> you <strong>been using</strong> the machines? Yes, I have. / No, I haven't.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "how-long-ex1",
          title: "Choose the correct question",
          instructions: "Pick the sentence that is correct.",
          items: [
            {
              type: "radio",
              label: "Which question is correct?",
              options: [
                { value: "a", label: "How long you have been working here?" },
                { value: "b", label: "How long have you been working here?" },
                { value: "c", label: "How long have you been work here?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Jennifer asks about Amara's supervisor. Which is correct?",
              options: [
                { value: "a", label: "How long has she been manage the team?" },
                { value: "b", label: "How long she has been managing the team?" },
                { value: "c", label: "How long has she been managing the team?" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "how-long-ex2",
          title: "Unscramble the question",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "long", "have", "you", "been", "working", "in", "housekeeping"],
              correctAnswer: "How long have you been working in housekeeping",
            },
          ],
        },
        {
          id: "how-long-ex3",
          title: "Fill in the blank",
          instructions: "Write the missing two words in this question.",
          items: [
            {
              type: "text",
              label: "How long ___ she ___ working at the hotel? (has ... been)",
              expectedAnswers: ["has been", "has / been"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — PPC vs. Present Perfect contrast
    // =========================================================================
    {
      id: "still-going-or-done",
      title: "Still going or already done?",
      icon: "⚖️",
      explanation: `
        ${sceneCard("sceneJobFair", "East Boston Community School gym. Job fair, Thursday afternoon. The last hour of the event.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Diego just finished talking to a recruiter and finds Marta still standing in line. They compare notes.</p>

        ${dialogue([
          { speaker: "Diego", avatar: "👨🏽", text: "I <strong>have applied</strong> to three companies today. I'm done.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "I <strong>have been standing</strong> in this line for an hour. I haven't even talked to anyone yet.", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏽", text: "One recruiter asked how long I <strong>have been working</strong> in construction.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "What did you say?", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏽", text: "Four years. She said that's good experience.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Perfect</strong> (have + V3) = the action is finished. You care about the result.<br>
          <strong>Present Perfect Continuous</strong> (have been + verb-ing) = the action is still happening. You care about how long.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>I <strong>have applied</strong> to three companies. (done)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("still happening", "blue")}
            <span><em>I <strong>have been standing</strong> in line for an hour. (not done)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>She <strong>has saved</strong> enough for the bus pass. (done)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("still happening", "blue")}
            <span><em>She <strong>has been saving</strong> since January. (still going)</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "contrast-ex1",
          title: "Finished or still happening?",
          instructions: "Choose Present Perfect or Present Perfect Continuous based on the meaning.",
          items: [
            {
              type: "radio",
              label: "Diego finished talking to all three recruiters. Which sentence fits?",
              options: [
                { value: "a", label: "He has been talking to three recruiters." },
                { value: "b", label: "He has talked to three recruiters." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Marta started waiting an hour ago and she is still in line. Which sentence fits?",
              options: [
                { value: "a", label: "She has stood in line for an hour." },
                { value: "b", label: "She has been standing in line for an hour." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"She <strong>has been saved</strong> enough money to move.\" Is this sentence correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Saving is finished, so use 'has saved.'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "contrast-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Diego", "has", "been", "working", "in", "construction", "for", "four", "years"],
              correctAnswer: "Diego has been working in construction for four years",
            },
          ],
        },
        {
          id: "contrast-ex3",
          title: "Fill in the blank",
          instructions: "Write the three words that complete the sentence.",
          items: [
            {
              type: "text",
              label: "Marta is still in line. She ___ in line for an hour. (has been standing)",
              expectedAnswers: ["has been standing"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/present-perfect-continuous\" style=\"font-weight:700;text-decoration:underline\">Present Perfect Continuous Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "ive-been-working-q1",
      question: "Hector works six days a week and is still working that schedule now. Which sentence is correct?",
      options: [
        { value: "a", label: "He has worked six days a week since January." },
        { value: "b", label: "He has been working six days a week since January." },
        { value: "c", label: "He is working six days a week since January." },
      ],
      correctAnswer: "b",
      explanation: "Present Perfect Continuous (has been working) is used for an ongoing action that started in the past and is still happening now.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-ongoing-action",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-q2",
      question: "Rosa's car broke down on February 10. Today is March 15. Which sentence fits?",
      options: [
        { value: "a", label: "Rosa has been taking two buses for five weeks." },
        { value: "b", label: "Rosa has been taking two buses since five weeks." },
        { value: "c", label: "Rosa has been taking two buses since a month." },
      ],
      correctAnswer: "a",
      explanation: "Use 'for' with a length of time (five weeks). Use 'since' with a starting point (February, a date, or an event).",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "for-vs-since",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-q3",
      question: "Jennifer asks Amara a question about her experience. Which question is correct?",
      options: [
        { value: "a", label: "How long you have been working in housekeeping?" },
        { value: "b", label: "How long have you been working in housekeeping?" },
        { value: "c", label: "How long have you been work in housekeeping?" },
      ],
      correctAnswer: "b",
      explanation: "In PPC questions, the word order is: How long + have/has + subject + been + verb-ing.",
      topic: "present-perfect-continuous",
      skill: "error-detection",
      skillTag: "ppc-question-word-order",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-q4",
      question: "Kevin drives extra shifts because of the parade. He started three weeks ago and is still doing it. Which sentence fits?",
      options: [
        { value: "a", label: "Kevin has driven extra shifts for three weeks." },
        { value: "b", label: "Kevin has been driving extra shifts for three weeks." },
        { value: "c", label: "Kevin drove extra shifts for three weeks." },
      ],
      correctAnswer: "b",
      explanation: "When an action started in the past and is still continuing, use Present Perfect Continuous (has been driving).",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-vs-past-simple",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-q5",
      question: "Diego finished talking to all three recruiters at the job fair. Which sentence is correct?",
      options: [
        { value: "a", label: "He has been talking to three recruiters." },
        { value: "b", label: "He has talked to three recruiters." },
        { value: "c", label: "He has been talked to three recruiters." },
      ],
      correctAnswer: "b",
      explanation: "When the action is finished and you want to show the result, use Present Perfect (has talked). PPC (has been talking) means the action is still in progress.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-vs-pp-finished-result",
      difficulty: "medium",
    },
    {
      id: "ive-been-working-q6",
      question: "Which sentence has a grammar error?",
      options: [
        { value: "a", label: "She has been working at the hotel for two years." },
        { value: "b", label: "How long have you been waiting for the bus?" },
        { value: "c", label: "He have been saving money since January." },
      ],
      correctAnswer: "c",
      explanation: "With 'he,' use 'has been,' not 'have been.' The correct sentence is: He has been saving money since January.",
      topic: "present-perfect-continuous",
      skill: "error-detection",
      skillTag: "has-vs-have-been",
      difficulty: "medium",
    },
    {
      id: "ive-been-working-q7",
      question: "Marta is still standing in line at the job fair after 60 minutes. Which sentence fits?",
      options: [
        { value: "a", label: "She has stood in line for an hour." },
        { value: "b", label: "She has been standing in line for an hour." },
        { value: "c", label: "She stood in line for an hour." },
      ],
      correctAnswer: "b",
      explanation: "Marta is still in line, so the action is ongoing. Present Perfect Continuous (has been standing) shows an action that started in the past and is still happening.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-still-in-progress",
      difficulty: "medium",
    },
    {
      id: "ive-been-working-q8",
      question: "Amara tells her sister: 'I _____ at this hotel since March.' Which form completes the sentence?",
      options: [
        { value: "a", label: "have been working" },
        { value: "b", label: "have been worked" },
        { value: "c", label: "has been working" },
      ],
      correctAnswer: "a",
      explanation: "With 'I,' use 'have been working.' The verb-ing form (working) follows 'have been.' 'Have been worked' is passive and does not fit here.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-form-with-i",
      difficulty: "medium",
    },
    {
      id: "ive-been-working-q9",
      question: "Which sentence uses Present Perfect Continuous correctly?",
      options: [
        { value: "a", label: "She has been save money for months." },
        { value: "b", label: "She has been saving money for months." },
        { value: "c", label: "She has saving money for months." },
      ],
      correctAnswer: "b",
      explanation: "The correct form is 'has been saving.' After 'has been,' you always use the -ing form of the verb (saving, not save).",
      topic: "present-perfect-continuous",
      skill: "error-detection",
      skillTag: "ppc-verb-ing-form",
      difficulty: "medium",
    },
    {
      id: "ive-been-working-q10",
      question: "A recruiter asks Diego: 'You have four years of construction experience. Have you been working on any large projects recently?' Diego finished a big warehouse job last week. Which answer is best?",
      options: [
        { value: "a", label: "Yes, I have been working on a warehouse project. It finished last week." },
        { value: "b", label: "Yes, I worked on a warehouse project. It finished last week." },
        { value: "c", label: "Yes, I have been worked on a warehouse project last week." },
      ],
      correctAnswer: "a",
      explanation: "Option A is best because the recruiter used PPC in the question and the experience is recent and relevant. Option B (past simple) also works grammatically, but it sounds less connected to the question. Option C ('have been worked') is not correct.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-job-interview-context",
      difficulty: "hard",
    },
  ],
};
