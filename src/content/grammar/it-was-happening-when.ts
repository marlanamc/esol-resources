import type { InteractiveGuideContent } from "@/types/activity";
import { itWasHappeningWhenImages as img } from "@/data/it-was-happening-when-images.generated";
import { readingCard, scheduleChart, stepsCard } from "@/content/grammar/_shared/guide-visuals";

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
      <img src="${scene.url}" srcset="${scene.url.replace("w=1200", "w=400")} 400w, ${scene.url.replace("w=1200", "w=800")} 800w, ${scene.url} 1200w" sizes="(max-width: 640px) 100vw, 800px" alt="${scene.alt}" loading="lazy" style="display: block; width: 100%; height: auto; max-height: 260px; object-fit: cover" />
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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; flex: none; white-space: nowrap; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

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
          { id: "ps-dot-1", type: "single-dot", zone: "past", position: 25, verbLabel: "heard a crack" },
          { id: "ps-dot-2", type: "single-dot", zone: "past", position: 50, verbLabel: "saw the water" },
          { id: "ps-dot-3", type: "single-dot", zone: "past", position: 75, verbLabel: "called the landlord" },
        ],
      },
      explanation: `
        ${sceneCard("sceneApartment", "East Boston apartment, third floor. Tuesday night, 11:45 PM. Lucia calls her landlord, Brian.", "terracotta")}
        ${dialogue([
          { speaker: "Lucia", avatar: "👩🏽", text: "Brian, I'm sorry to call so late. I <strong>heard</strong> a noise from the ceiling. I <strong>looked</strong> up and <strong>saw</strong> a crack.", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "👨🏻", text: "Is there any water?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Yes. It <strong>came</strong> through the ceiling above the kitchen. I <strong>grabbed</strong> a bucket and I <strong>called</strong> you right away.", side: "right", tone: "terracotta" },
        ])}
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Simple</strong> = finished actions told in order. Each one happened and ended before the next one started.</p>
        </div>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>Lucia <strong>heard</strong> a crack at midnight.</em></span>
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
              label: "Lucia ___ a noise and looked up. Which form fits?",
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
        <p style="margin: 0 0 0.75rem 0; font-size: 1rem; line-height: 1.6">Wednesday, 7:00 AM. Brian comes up to look at the damage and asks: "What was everyone doing?" Lucia wrote down what each person was doing the night of the leak.</p>
        ${scheduleChart({
          kicker: "Chart",
          title: "Tuesday night at Lucia's apartment",
          days: ["11:00", "11:30", "11:45"],
          rows: [
            { label: "🛌 Younger kids", cells: [{ text: "sleep", accent: "blue" }, { text: "sleep", accent: "blue" }, { text: "sleep", accent: "blue" }] },
            { label: "📝 Older daughter", cells: [{ text: "read", accent: "blue" }, { text: "write", accent: "blue" }, { text: "write", accent: "blue" }] },
            { label: "🧹 Lucia", cells: [{ text: "wash", accent: "blue" }, { text: "mop", accent: "blue" }, { text: "mop", accent: "blue" }] },
            { label: "🍚 Rice cooker", cells: [{ text: "run", accent: "blue" }, { text: "run", accent: "blue" }, { text: "run", accent: "blue" }] },
            { label: "💥 Pipe", cells: [null, null, { text: "burst", accent: "amber" }] },
          ],
          note: "Look for the actions in progress. The pipe burst is the event that interrupted them.",
        })}
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
        <p style="font-size: 0.95rem; opacity: 0.8; margin: 0.5rem 0 0">On the timeline, past continuous is a line. The pipe burst (past simple) is the dot that interrupted it.</p>
      `,
      exercises: [
        {
          id: "iwh-s2-ex1",
          title: "Practice: Past Continuous",
          instructions: "Choose the correct form or spot the error.",
          items: [
            {
              type: "radio",
              label: "Look at the chart. Which sentence is true?",
              options: [
                { value: "a", label: "At 11:30 the younger kids were writing." },
                { value: "b", label: "At 11:30 Lucia was mopping." },
                { value: "c", label: "At 11:45 the younger kids were mopping." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Look at the chart. Who was writing at 11:45?",
              options: [
                { value: "lucia", label: "Lucia" },
                { value: "kids", label: "The younger kids" },
                { value: "daughter", label: "The older daughter" },
              ],
              expectedAnswer: "daughter",
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
              words: ["Her", "daughter", "was", "reading", "at", "11:00"],
              correctAnswer: "Her daughter was reading at 11:00",
            },
            {
              type: "text",
              label: "Look at the chart. At 11:00, Lucia ___ (wash) the dishes.",
              expectedAnswers: ["was washing"],
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
        <p style="margin: 0 0 0.75rem 0; font-size: 1rem; line-height: 1.6">Lucia's story uses <strong>when</strong> and <strong>while</strong>. So does the story of a real scientist. Read it and look for the line (in progress) and the dot (interruption).</p>
        ${readingCard({
          kicker: "Famous person",
          title: "Katalin Karikó: A Long Road to a Nobel Prize",
          photo: {
            url: "/images/guide-people/katalin-kariko.jpg",
            alt: "Katalin Karikó smiling outside a university building, 2021",
            credit: "Szeged University, 2021, CC BY-SA 4.0",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Karik%C3%B3_Katalin_Szegeden_(cropped).jpg",
          },
          paragraphs: [
            "Katalin Karikó was born in Hungary in 1955. In 1989, she started a job at the University of Pennsylvania. For many years she <strong>was working</strong> on mRNA, but it was hard to convince people to pay for her research.",
            "<strong>While</strong> she <strong>was working</strong> at the university, a new colleague, Drew Weissman, <strong>was</strong> interested in the immune system. They <strong>started</strong> working together, and in 2005 they <strong>discovered</strong> a way to stop unwanted reactions to mRNA. In 2023, they <strong>won</strong> the Nobel Prize.",
          ],
          sources: [
            { name: "Nobel Prize: Press release 2023", url: "https://www.nobelprize.org/prizes/medicine/2023/press-release/" },
            { name: "Nobel Prize: Katalin Karikó facts", url: "https://www.nobelprize.org/prizes/medicine/2023/kariko/facts/" },
          ],
          accent: "blue",
        })}
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
            <span><em><strong>While</strong> she <strong>was calling</strong> the landlord, the kids woke up.</em></span>
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
        <p style="font-size: 0.95rem; opacity: 0.8; margin: 0.5rem 0 0">Quick tip: the continuous action is the background (line). The simple action is the event that cut into it or happened during it (dot).</p>
      `,
      exercises: [
        {
          id: "iwh-s3-ex1",
          title: "Practice: When and While",
          instructions: "Choose the correct word or form.",
          items: [
            {
              type: "radio",
              label: "Look at the reading. When did Karikó and Weissman make their discovery?",
              options: [
                { value: "1989", label: "1989" },
                { value: "2005", label: "2005" },
                { value: "2023", label: "2023" },
              ],
              expectedAnswer: "2005",
            },
            {
              type: "radio",
              label: "Look at the reading. Which sentence about Karikó is correct?",
              options: [
                { value: "a", label: "She was winning the Nobel Prize while she discovered mRNA." },
                { value: "b", label: "She was working at Penn while a new colleague started a project with her." },
                { value: "c", label: "She was working at Penn when she was born." },
              ],
              expectedAnswer: "b",
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
              words: ["The", "kids", "were", "sleeping", "when", "Lucia", "called", "Brian"],
              correctAnswer: "The kids were sleeping when Lucia called Brian",
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
    // SECTION 4 — Telling the Insurance Company
    // =========================================================================
    {
      id: "telling-the-landlord",
      title: "Telling the Insurance Company",
      explanation: `
        ${sceneCard("scenePhone", "Lucia's apartment. Wednesday, 11:00 AM. Her renter's insurance company calls.", "amber")}
        ${dialogue([
          { speaker: "Sarah", avatar: "👩🏼", text: "Lucia, this is Sarah from your renter's insurance. Can you walk me through what happened?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Yes. It <strong>was</strong> almost midnight. My younger kids <strong>were sleeping</strong>. I <strong>was mopping</strong> the kitchen <strong>when</strong> I <strong>heard</strong> a crack above me.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏼", text: "And then?", side: "left", tone: "sage" },
          { speaker: "Lucia", avatar: "👩🏽", text: "Water <strong>came</strong> down fast. I <strong>grabbed</strong> a bucket. <strong>While</strong> I <strong>was holding</strong> the bucket, I <strong>called</strong> the landlord with my other hand.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "👩🏼", text: "Okay, I have enough to file the claim. Thank you.", side: "left", tone: "sage" },
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
              label: "\"Sarah called Lucia while she was cleaning up the water.\" Which action was already in progress?",
              options: [
                { value: "a", label: "Sarah calling" },
                { value: "b", label: "Lucia cleaning up" },
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
        <p style="margin: 0 0 0.75rem 0; font-size: 1rem; line-height: 1.6">Ms. Rivera from Inspectional Services asked Lucia to check her written statement. Lucia wrote a first draft, but it has mistakes. Find the mistakes. Do not copy these sentences.</p>
        ${stepsCard({
          kicker: "Find the mistakes",
          title: "Lucia's first draft (some sentences are wrong)",
          accent: "amber",
          steps: [
            "The kids were sleep in the back room when the pipe burst.",
            "I was mopping the kitchen when I heard a crack.",
            "While the water came down, I was grabbing a bucket and called the landlord.",
            "My older daughter was writing an essay at the table.",
          ],
          note: "Read each sentence. Is the tense right for the meaning?",
        })}
        <p style="font-size: 0.95rem; margin: 1rem 0 0.5rem">Help Lucia fix her statement for the inspector's report.</p>
      `,
      exercises: [
        {
          id: "iwh-s5-ex1",
          title: "Practice: Error Correction",
          instructions: "Find the error in each sentence from Lucia's statement.",
          items: [
            {
              type: "radio",
              label: "Look at the statement. Which sentences have a mistake?",
              options: [
                { value: "a", label: "Sentence 1 only" },
                { value: "b", label: "Sentences 1 and 3" },
                { value: "c", label: "Sentences 2 and 3" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Sentence 1: \"The kids were sleep in the back room when the pipe burst.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'were sleeping' (was/were + verb-ing)." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "Sentence 2: \"I was mopping the kitchen when I heard a crack.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct." },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "Sentence 3: \"While the water came down, I was grabbing a bucket and called the landlord.\"",
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
              label: "The kids ___ (not / wake up) when the water started. They woke up later.",
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
      id: "iwh-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"While Lucia ___ the landlord, the kids woke up.\" (Action in progress: past continuous.)",
      correctAnswer: "was calling",
      explanation: "'While' introduces the action that was in progress, so past continuous (was calling) is needed. 'Called' would use past simple.",
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
      id: "iwh-qws1",
      type: "word-scramble" as const,
      question: "Lucia was cleaning the kitchen when the pipe burst. Put the words in order.",
      words: ["She", "was", "mopping", "when", "it", "burst"],
      correctAnswer: "She was mopping when it burst",
      hint: "past continuous (background) + when + past simple (interruption)",
      explanation: "Past continuous (was mopping) = the background action. Past simple (burst) = the event that interrupted it.",
      topic: "when-while",
      skill: "usage",
      skillTag: "background-vs-interruption",
      difficulty: "medium",
    },
  ],
};
