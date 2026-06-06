import type { InteractiveGuideContent } from "@/types/activity";
import { pastSimplePastContinuousImages as img } from "@/data/past-simple-past-continuous-images.generated";

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

export const pastSimplePastContinuousContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Past Simple: What Happened
    // =========================================================================
    {
      id: "past-simple-what-happened",
      title: "Past Simple: What Happened",
      tenseDiagram: {
        title: "Where it lives on the timeline",
        elements: [
          { id: "ps-dot-1", type: "single-dot", zone: "past", position: 75, verbLabel: "missed" },
          { id: "ps-dot-2", type: "single-dot", zone: "past", position: 55, verbLabel: "walked" },
          { id: "ps-dot-3", type: "single-dot", zone: "past", position: 35, verbLabel: "arrived" },
        ],
      },
      explanation: `
        ${sceneCard("sceneStreet", "Meridian Street, East Boston. Tuesday morning, 7:40 AM.", "terracotta")}
        <p style="margin: 0 0 1rem 0; line-height: 1.6">Fred missed the bus again. His neighbor Michael had the same problem last week.</p>
        ${dialogue([
          { speaker: "Fred", avatar: "👨🏽", text: "I <strong>missed</strong> the 111 bus this morning. I <strong>walked</strong> to the Blue Line. I <strong>arrived</strong> late.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏾", text: "Oh no! What happened?", side: "left", tone: "sage" },
          { speaker: "Fred", avatar: "👨🏽", text: "The bus <strong>left</strong> one minute early. I <strong>ran</strong> to the corner but it was already gone.", side: "right", tone: "terracotta" },
        ])}
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Simple</strong> = finished actions, one at a time. Each one happened and ended. We tell them in order.</p>
        </div>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>Fred <strong>missed</strong> the bus.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>He <strong>walked</strong> to the train station.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>He <strong>arrived</strong> late to class.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("signal words", "amber")}
            <span>yesterday, last night, this morning, an hour ago, in 2019</span>
          </div>
        </div>
        <p style="font-size: 0.95rem; color: #555; margin: 0.5rem 0 0">Notice: each action is a single dot on the timeline. They happened, they finished, we move on.</p>
      `,
      exercises: [
        {
          id: "pspc-s1-ex1",
          title: "Practice: Past Simple",
          instructions: "Choose the correct form or spot the error.",
          items: [
            {
              type: "radio",
              label: "Fred ___ the 111 bus this morning. Which form fits?",
              options: [
                { value: "misses", label: "misses" },
                { value: "missed", label: "missed" },
                { value: "was missing", label: "was missing" },
              ],
              expectedAnswer: "missed",
            },
            {
              type: "radio",
              label: "\"She <strong>arrive</strong> late to class yesterday.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'arrived'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Unscramble to make a past simple sentence:",
              words: ["He", "walked", "to", "the", "Blue", "Line", "station"],
              correctAnswer: "He walked to the Blue Line station",
            },
            {
              type: "text",
              label: "The bus ___ (leave) one minute early.",
              expectedAnswers: ["left"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. Past Continuous: What Was Already in Progress
    // =========================================================================
    {
      id: "past-continuous-in-progress",
      title: "Past Continuous: What Was Already in Progress",
      tenseDiagram: {
        title: "A longer action already running in the past",
        elements: [
          { id: "pc-line", type: "solid-line", zone: "past", position: 40, verbLabel: "Past Continuous" },
        ],
      },
      explanation: `
        ${sceneCard("sceneTrain", "Blue Line train, East Boston. Tuesday morning.", "blue")}
        ${dialogue([
          { speaker: "Amara", avatar: "👩🏾", text: "So what were you doing when the bus left?", side: "left", tone: "sage" },
          { speaker: "Fred", avatar: "👨🏽", text: "I <strong>was listening</strong> to music. I didn't hear it coming.", side: "right", tone: "blue" },
          { speaker: "Amara", avatar: "👩🏾", text: "And you <strong>were carrying</strong> those groceries too, right?", side: "left", tone: "sage" },
          { speaker: "Fred", avatar: "👨🏽", text: "Yes! I <strong>was thinking</strong> about class and I <strong>was carrying</strong> two bags. I couldn't run fast.", side: "right", tone: "blue" },
        ])}
        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Continuous</strong> = an action that was already in progress at a moment in the past. It was running in the background. It is not finished yet when we describe it.</p>
        </div>
        <p style="font-size: 0.92rem; margin: 0 0 0.75rem"><strong>Form:</strong> was / were + verb-ing</p>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("in progress", "blue")}
            <span><em>He <strong>was listening</strong> to music.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("in progress", "blue")}
            <span><em>He <strong>was carrying</strong> two grocery bags.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("in progress", "blue")}
            <span><em>He <strong>was thinking</strong> about class.</em></span>
          </div>
        </div>
        <p style="font-size: 0.95rem; color: #555; margin: 0.5rem 0 0">On the timeline, past continuous is a line, not a dot. It was already going when the moment arrived.</p>
      `,
      exercises: [
        {
          id: "pspc-s2-ex1",
          title: "Practice: Past Continuous",
          instructions: "Choose the correct form or spot the error.",
          items: [
            {
              type: "radio",
              label: "Fred ___ to music when the bus left. Which form fits?",
              options: [
                { value: "listened", label: "listened (past simple)" },
                { value: "was listening", label: "was listening (past continuous)" },
                { value: "listens", label: "listens (present simple)" },
              ],
              expectedAnswer: "was listening",
            },
            {
              type: "radio",
              label: "\"They <strong>were wait</strong> at the bus stop.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'were waiting'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "was", "carrying", "two", "bags", "of", "groceries"],
              correctAnswer: "She was carrying two bags of groceries",
            },
            {
              type: "text",
              label: "He ___ (think) about class when the bus came.",
              expectedAnswers: ["was thinking"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. When + While: Putting Them Together
    // =========================================================================
    {
      id: "when-while-together",
      title: "When + While: Putting Them Together",
      tenseDiagram: {
        title: "The continuous action (line) is interrupted by the simple action (dot)",
        elements: [
          { id: "pc-line-s3", type: "solid-line", zone: "past", position: 30, verbLabel: "was walking (in progress)" },
          { id: "ps-dot-s3", type: "single-dot", zone: "past", position: 65, verbLabel: "started to rain (interruption)" },
        ],
      },
      explanation: `
        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>when</strong> + past simple for the interruption. Use <strong>while</strong> + past continuous for the action in progress.</p>
        </div>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("when", "terracotta")}
            <span><em>He <strong>was walking</strong> home <strong>when</strong> it <strong>started</strong> to rain.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("while", "blue")}
            <span><em>The bus <strong>left</strong> <strong>while</strong> he <strong>was crossing</strong> the street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("when", "terracotta")}
            <span><em>Fred <strong>was listening</strong> to music <strong>when</strong> the bus <strong>came</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("while", "blue")}
            <span><em><strong>While</strong> Amara <strong>was waiting</strong>, the train <strong>arrived</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("when", "terracotta")}
            <span><em>Diego <strong>was telling</strong> a story about Independence Day back home <strong>when</strong> his neighbor <strong>asked</strong> how long he had lived in Boston.</em></span>
          </div>
        </div>
        <p style="font-size: 0.95rem; color: #555; margin: 0.5rem 0 0">Quick tip: the continuous action (line) is the background. The simple action (dot) is the event that happened inside it or interrupted it.</p>
      `,
      exercises: [
        {
          id: "pspc-s3-ex1",
          title: "Practice: When and While",
          instructions: "Choose the correct form or unscramble the sentence.",
          items: [
            {
              type: "radio",
              label: "Fred ___ to music when the bus came. Which form fits in the blank?",
              options: [
                { value: "listened", label: "listened" },
                { value: "was listening", label: "was listening" },
              ],
              expectedAnswer: "was listening",
            },
            {
              type: "radio",
              label: "The bus left while he ___ the street. Which fits?",
              options: [
                { value: "crossed", label: "crossed" },
                { value: "was crossing", label: "was crossing" },
              ],
              expectedAnswer: "was crossing",
            },
            {
              type: "radio",
              label: "\"She was talking on the phone <strong>when</strong> she <strong>was dropping</strong> her bag.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. 'dropped' fits the interruption, not 'was dropping'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["While", "she", "was", "waiting", "the", "train", "arrived"],
              correctAnswer: "While she was waiting the train arrived",
            },
            {
              type: "text",
              label: "He ___ (carry) groceries when he missed the bus.",
              expectedAnswers: ["was carrying"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Tell the Story
    // =========================================================================
    {
      id: "tell-the-story",
      title: "Tell the Story",
      explanation: `
        ${sceneCard("scenePickup", "East Boston school entrance. Wednesday, 2:45 PM.", "sage")}
        ${dialogue([
          { speaker: "Elena", avatar: "👩🏾", text: "Yesterday was crazy. I <strong>was working</strong> a double shift when my son's school <strong>called</strong>.", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "What happened? Is he okay?", side: "left", tone: "sage" },
          { speaker: "Elena", avatar: "👩🏾", text: "Yes, he <strong>fell</strong> at recess. While I <strong>was driving</strong> to school, it <strong>started</strong> to rain. I <strong>got</strong> there in ten minutes.", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "You <strong>were working</strong> AND you <strong>picked</strong> him up that fast? You are a superhero.", side: "left", tone: "sage" },
        ])}
        <p style="font-size: 0.95rem; margin: 1rem 0 0.5rem">Read Elena's story again. Choose past simple or past continuous for each blank.</p>
      `,
      exercises: [
        {
          id: "pspc-s4-ex1",
          title: "Practice: Tell the Story",
          instructions: "Choose past simple or past continuous. Think about whether the action was in progress or finished.",
          items: [
            {
              type: "radio",
              label: "Elena ___ a double shift when the school called.",
              options: [
                { value: "worked", label: "worked (past simple)" },
                { value: "was working", label: "was working (past continuous)" },
              ],
              expectedAnswer: "was working",
            },
            {
              type: "radio",
              label: "Her son ___ at recess. It was a finished event.",
              options: [
                { value: "fell", label: "fell (past simple)" },
                { value: "was falling", label: "was falling (past continuous)" },
              ],
              expectedAnswer: "fell",
            },
            {
              type: "radio",
              label: "While she ___ to school, it started to rain.",
              options: [
                { value: "drove", label: "drove (past simple)" },
                { value: "was driving", label: "was driving (past continuous)" },
              ],
              expectedAnswer: "was driving",
            },
            {
              type: "radio",
              label: "\"While Claudette was waiting, Elena <strong>was arrived</strong>.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. 'arrived' is past simple, not 'was arrived'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "word-scramble",
              label: "Unscramble Elena's sentence:",
              words: ["She", "got", "to", "school", "in", "ten", "minutes"],
              correctAnswer: "She got to school in ten minutes",
            },
            {
              type: "text",
              label: "It ___ (start) to rain while she was driving.",
              expectedAnswers: ["started"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Coming up next",
        content: "In Week 5 you will see 'have + V3' in real sentences. You don't need to use it yet, just notice it when it appears.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "pspc-q1",
      question: "Fred missed the bus, walked to the train, and arrived late. Which tense is this?",
      options: [
        { value: "a", label: "Past Continuous, because the actions were in progress." },
        { value: "b", label: "Past Simple, because each action finished before the next one started." },
        { value: "c", label: "Present Simple, because it is a routine." },
      ],
      correctAnswer: "b",
      explanation: "Past simple shows finished actions told in sequence. Each one ended before the next began.",
      topic: "past-simple",
      skill: "recognition",
      skillTag: "sequence-finished-actions",
      difficulty: "easy",
    },
    {
      id: "pspc-q2",
      question: "Which sentence is correct?",
      options: [
        { value: "a", label: "He was listened to music when the bus left." },
        { value: "b", label: "He was listening to music when the bus left." },
        { value: "c", label: "He listening to music when the bus left." },
      ],
      correctAnswer: "b",
      explanation: "Past continuous = was/were + verb-ing. 'Was listened' and 'listening' alone are both incorrect forms.",
      topic: "past-continuous",
      skill: "error-detection",
      skillTag: "form-was-verb-ing",
      difficulty: "easy",
    },
    {
      id: "pspc-q3",
      question: "Elena was working when the school called. Which action was in progress?",
      options: [
        { value: "a", label: "The school calling" },
        { value: "b", label: "Elena working" },
        { value: "c", label: "Both actions were in progress." },
      ],
      correctAnswer: "b",
      explanation: "Past continuous (was working) shows the background action already in progress. Past simple (called) is the interruption.",
      topic: "past-continuous",
      skill: "usage",
      skillTag: "background-vs-interruption",
      difficulty: "easy",
    },
    {
      id: "pspc-q4",
      question: "The bus left ___ he was crossing the street.",
      options: [
        { value: "a", label: "when" },
        { value: "b", label: "while" },
        { value: "c", label: "Both 'when' and 'while' are correct here." },
      ],
      correctAnswer: "a",
      explanation: "'When' connects a simple action (the bus left) to a continuous one (he was crossing). 'While' would go with the continuous clause: 'While he was crossing, the bus left.'",
      topic: "when-while",
      skill: "usage",
      skillTag: "when-while-contrast",
      difficulty: "medium",
    },
    {
      id: "pspc-q5",
      question: "While Amara ___ at the bus stop, Fred called her.",
      options: [
        { value: "a", label: "waited" },
        { value: "b", label: "was waiting" },
        { value: "c", label: "waits" },
      ],
      correctAnswer: "b",
      explanation: "'While' introduces the action in progress, so past continuous (was waiting) is needed.",
      topic: "when-while",
      skill: "usage",
      skillTag: "while-plus-past-continuous",
      difficulty: "medium",
    },
    {
      id: "pspc-q6",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "She was carrying two bags when she fell." },
        { value: "b", label: "He arrived late because he missed the bus." },
        { value: "c", label: "They were waited for the bus for one hour." },
      ],
      correctAnswer: "c",
      explanation: "'Were waited' is not correct. The past continuous form is 'were waiting.'",
      topic: "past-continuous",
      skill: "error-detection",
      skillTag: "form-were-verb-ing",
      difficulty: "medium",
    },
    {
      id: "pspc-q7",
      question: "Fred ran to the corner but the bus was already gone. Which word tells you the action is finished?",
      options: [
        { value: "a", label: "was" },
        { value: "b", label: "ran" },
        { value: "c", label: "already" },
      ],
      correctAnswer: "b",
      explanation: "'Ran' is past simple. It shows a single, completed action in the past.",
      topic: "past-simple",
      skill: "recognition",
      skillTag: "identify-past-simple",
      difficulty: "easy",
    },
    {
      id: "pspc-q8",
      question: "Your friend asks: 'What happened?' You want to tell the order of events. Which tense do you use?",
      options: [
        { value: "a", label: "Past continuous for every action" },
        { value: "b", label: "Past simple for each finished action" },
        { value: "c", label: "Present simple because it is a story" },
      ],
      correctAnswer: "b",
      explanation: "Past simple is for finished, sequential actions. You use it to tell what happened step by step.",
      topic: "past-simple",
      skill: "usage",
      skillTag: "storytelling-sequence",
      difficulty: "medium",
    },
    {
      id: "pspc-q9",
      question: "\"She was driving to school when it was starting to rain.\" What is wrong with this sentence?",
      options: [
        { value: "a", label: "Nothing is wrong." },
        { value: "b", label: "'Was starting' should be 'started'. The rain is the interruption, so it needs past simple." },
        { value: "c", label: "'Was driving' should be 'drove'." },
      ],
      correctAnswer: "b",
      explanation: "The interrupting event (rain starting) uses past simple. Only the background action (was driving) stays in past continuous.",
      topic: "when-while",
      skill: "error-detection",
      skillTag: "interruption-past-simple",
      difficulty: "hard",
    },
    {
      id: "pspc-q10",
      question: "Elena got to school in ten minutes. Her son fell at recess. It started to rain. Which sentence correctly combines two of these facts?",
      options: [
        { value: "a", label: "Her son was fell while Elena was arriving." },
        { value: "b", label: "It started to rain while Elena was driving to school." },
        { value: "c", label: "Elena was getting to school when her son was falling." },
      ],
      correctAnswer: "b",
      explanation: "'It started' (past simple, the interruption) + 'was driving' (past continuous, the background action) is the correct combination.",
      topic: "when-while",
      skill: "usage",
      skillTag: "combine-simple-continuous",
      difficulty: "hard",
    },
  ],
};
