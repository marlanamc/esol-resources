import type { InteractiveGuideContent } from "@/types/activity";
import { welcomeBackImages as img } from "@/data/welcome-back-images.generated";
import { checklist, timeline } from "@/content/grammar/_shared/guide-visuals";

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
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; min-width: min-content; max-width: 45%; overflow-wrap: normal">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

const TABLE_TH = `class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)"`;
const TABLE_TD = `class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)"`;

export const fallReviewSixTensesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — Six tenses, one bus stop
    // =========================================================================
    {
      id: "six-tenses-one-bus-stop",
      title: "Six tenses, one bus stop",
      tenseDiagram: {
        title: "The six tenses you know",
        elements: [
          { id: "past-cont", type: "solid-line", zone: "past", position: 25, verbLabel: "Past Cont." },
          { id: "past-simp", type: "single-dot", zone: "past", position: 45, verbLabel: "Past Simple" },
          { id: "pres-perf", type: "arc", zone: "past", position: 40, verbLabel: "Pres. Perfect" },
          { id: "pres-simp", type: "multiple-dots", zone: "present", position: 48, verbLabel: "Pres. Simple" },
          { id: "pres-cont", type: "solid-line", zone: "present", position: 52, verbLabel: "Pres. Cont." },
          { id: "future", type: "single-dot", zone: "future", position: 70, verbLabel: "will / going to" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusStop", "Thursday, December 10, 5:15 PM. Rosa waits for the 116 to the last class before the break.", "terracotta")}

        <p>In September, Rosa reviewed four tenses at this bus stop. It's December now. Her classmate <strong>David</strong> is waiting too.</p>

        ${dialogue([
          { speaker: "David", avatar: "👨🏻", text: "Hi, Rosa! <strong>Are</strong> you <strong>going to come</strong> to the class party next week?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yes! I<strong>'m going to bring</strong> pupusas. But I'm so tired.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "👨🏻", text: "Busy week?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I usually <strong>work</strong> until 3, but this week I<strong>'m working</strong> until 5. December is busy at the hotel.", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "👨🏻", text: "<strong>Have</strong> you <strong>bought</strong> presents for your kids?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "No, I <strong>haven't</strong>. Last Saturday I <strong>was shopping</strong> at the mall when my sister <strong>called</strong>. I left with nothing!", side: "right", tone: "terracotta" },
          { speaker: "David", avatar: "👨🏻", text: "Ha! Here's the bus. I think it<strong>'ll be</strong> full tonight.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>You know six tenses now.</strong> In September you knew four. Since then you added the <strong>present perfect</strong> (November) and <strong>will / going to</strong> (December).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("usually", "terracotta")}
            <span><em>I <strong>work</strong> until 3.</em> Present simple</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("this week", "terracotta")}
            <span><em>I<strong>'m working</strong> until 5.</em> Present continuous</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("last Saturday", "blue")}
            <span><em>I <strong>was shopping</strong> when my sister <strong>called</strong>.</em> Past continuous + past simple</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("up to now", "sage")}
            <span><em>I <strong>haven't bought</strong> presents.</em> Present perfect</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("future", "amber")}
            <span><em>I<strong>'m going to bring</strong> pupusas. It<strong>'ll be</strong> full.</em> Going to / will</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "frst-s1-ex1",
          title: "Which tense is it?",
          instructions: "Read each sentence from the bus stop. Choose the tense.",
          items: [
            {
              type: "radio",
              label: "\"This week I'm working until 5.\"",
              options: [
                { value: "a", label: "Present simple" },
                { value: "b", label: "Present continuous" },
                { value: "c", label: "Past continuous" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I haven't bought presents.\"",
              options: [
                { value: "a", label: "Present perfect" },
                { value: "b", label: "Past simple" },
                { value: "c", label: "Will / going to" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "frst-s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the verb in the correct form.",
          items: [
            {
              type: "text",
              label: "David thinks the bus ___ (be) full tonight. Use will.",
              expectedAnswers: ["will be", "'ll be"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Usually vs. this week
    // =========================================================================
    {
      id: "usually-vs-this-week",
      title: "Usually vs. this week · Present simple and continuous",
      explanation: `
        <p style="margin-bottom: 0.75rem">December is different for Rosa. Look at her usual week and this week.</p>

        <div style="overflow-x: auto; margin: 0 0 1.5rem 0; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.08)">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem">
            <thead>
              <tr>
                <th ${TABLE_TH}></th>
                <th ${TABLE_TH}>Usually</th>
                <th ${TABLE_TH}>This week</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td ${TABLE_TD}><strong>Work</strong></td>
                <td ${TABLE_TD}>7 AM to 3 PM</td>
                <td ${TABLE_TD}>7 AM to <strong>5 PM</strong></td>
              </tr>
              <tr>
                <td ${TABLE_TD}><strong>Dinner</strong></td>
                <td ${TABLE_TD}>Rosa cooks</td>
                <td ${TABLE_TD}><strong>Her son</strong> cooks</td>
              </tr>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important"><strong>Bus</strong></td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">The 116</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">The 116</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present simple</strong> = usually, every day, a routine.<br>
          <strong>Present continuous</strong> = right now, or just for a short time (<em>this week, this month</em>).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("usually", "terracotta")}
            <span><em>Rosa usually <strong>finishes</strong> work at 3.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("this week", "blue")}
            <span><em>This week she <strong>is staying</strong> late.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "frst-s2-ex1",
          title: "Read Rosa's week",
          instructions: "Look at the table above.",
          items: [
            {
              type: "radio",
              label: "Which sentence is true?",
              options: [
                { value: "a", label: "This week Rosa is cooking dinner." },
                { value: "b", label: "This week her son is cooking dinner." },
                { value: "c", label: "Rosa's son usually cooks dinner." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which one did NOT change this week?",
              options: [
                { value: "a", label: "Her work hours" },
                { value: "b", label: "Who cooks dinner" },
                { value: "c", label: "Her bus" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "frst-s2-ex2",
          title: "Usually or this week?",
          instructions: "Write the verb in present simple or present continuous.",
          items: [
            {
              type: "text",
              label: "Rosa usually ___ (leave) work at 3 PM.",
              expectedAnswers: ["leaves"],
            },
            {
              type: "text",
              label: "This week she ___ (leave) work at 5 PM.",
              expectedAnswers: ["is leaving", "'s leaving"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — What happened · Past simple and continuous
    // =========================================================================
    {
      id: "what-happened-saturday",
      title: "What happened? · Past simple and continuous",
      explanation: `
        <p style="margin-bottom: 0.75rem">Here is Rosa's Saturday at the mall. Look at what was happening and what happened in the middle of it.</p>

        ${timeline({
          kicker: "Last Saturday",
          title: "Rosa's shopping trip",
          items: [
            { when: "1:00", text: "Rosa <strong>arrived</strong> at the mall.", accent: "terracotta" },
            { span: "1:00 to 1:40: she <strong>was looking</strong> at toys", accent: "blue" },
            { when: "1:40", text: "Her sister Teresa <strong>called</strong>.", accent: "terracotta" },
            { span: "1:40 to 3:00: they <strong>were talking</strong> on the phone", accent: "blue" },
            { when: "3:00", text: "Rosa <strong>left</strong>. She <strong>didn't buy</strong> anything.", accent: "terracotta" },
          ],
          note: "Dots are past simple: one moment. Bars are past continuous: in the middle of something.",
        })}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past continuous</strong> (was/were + verb-ing) = the longer action in the background.<br>
          <strong>Past simple</strong> = the short action that happened in the middle of it. Use <strong>when</strong> to join them.</p>
        </div>
      `,
      exercises: [
        {
          id: "frst-s3-ex1",
          title: "Read the timeline",
          instructions: "Look at Rosa's Saturday.",
          items: [
            {
              type: "radio",
              label: "What was Rosa doing when Teresa called?",
              options: [
                { value: "a", label: "Shopping for toys" },
                { value: "b", label: "Leaving the mall" },
                { value: "c", label: "Paying at the register" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "How many presents did Rosa buy on Saturday? (number)",
              expectedAnswers: ["0", "zero", "none"],
            },
          ],
        },
        {
          id: "frst-s3-ex2",
          title: "Build the sentence",
          instructions: "Write the verb in past simple or past continuous.",
          items: [
            {
              type: "text",
              label: "Rosa ___ (wait) in line when her phone rang.",
              expectedAnswers: ["was waiting"],
            },
            {
              type: "text",
              label: "We were eating dinner when the lights ___ (go) out.",
              expectedAnswers: ["went"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Since September · Present perfect
    // =========================================================================
    {
      id: "since-september",
      title: "Since September · Present perfect",
      explanation: `
        <p style="margin-bottom: 0.75rem">Rosa looks back at her fall. She makes a list of what she has done since class started in September.</p>

        ${checklist({
          kicker: "Since September",
          title: "Rosa's fall in English class",
          items: [
            { text: "Learn the 116 bus schedule by heart", done: true },
            { text: "Call the landlord in English", done: true },
            { text: "Read a news headline about prices", done: true },
            { text: "Miss a class", done: false },
            { text: "Visit the Boston Public Library", done: false },
          ],
        })}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present perfect</strong> = have/has + V3. It connects the past to <strong>now</strong>: life experience (<em>Have you ever...?</em>) and how long (<em>for, since</em>).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("experience", "sage")}
            <span><em>She <strong>has called</strong> her landlord in English.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(128,128,128,0.08); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("how long", "sage")}
            <span><em>She <strong>has been</strong> in this class <strong>since</strong> September, <strong>for</strong> three months.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "frst-s4-ex1",
          title: "Read Rosa's list",
          instructions: "Look at the checklist above.",
          items: [
            {
              type: "radio",
              label: "Which sentence about Rosa is true?",
              options: [
                { value: "a", label: "She has missed a class." },
                { value: "b", label: "She has visited the Boston Public Library." },
                { value: "c", label: "She hasn't missed a class." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Look at the list. Rosa ___ (read) a news headline about prices.",
              expectedAnswers: ["has read", "'s read"],
            },
          ],
        },
        {
          id: "frst-s4-ex2",
          title: "For or since?",
          instructions: "Choose the correct word.",
          items: [
            {
              type: "radio",
              label: "I have lived in East Boston ___ 2021.",
              options: [
                { value: "a", label: "for" },
                { value: "b", label: "since" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "We have studied together ___ three months.",
              options: [
                { value: "a", label: "for" },
                { value: "b", label: "since" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — After the break · Will and going to
    // =========================================================================
    {
      id: "after-the-break",
      title: "After the break · Will and going to",
      explanation: `
        <p style="margin-bottom: 0.75rem">On the bus, Rosa writes two lists in her phone: her plans for the break, and her guesses about January.</p>

        <div style="overflow-x: auto; margin: 0 0 1.5rem 0; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.08)">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem">
            <thead>
              <tr>
                <th ${TABLE_TH}>My plans (decided)</th>
                <th ${TABLE_TH}>My guesses</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td ${TABLE_TD}>I<strong>'m going to visit</strong> my aunt in Chelsea.</td>
                <td ${TABLE_TD}>It <strong>will snow</strong> a lot.</td>
              </tr>
              <tr>
                <td ${TABLE_TD}>I<strong>'m going to buy</strong> the presents on Saturday.</td>
                <td ${TABLE_TD}>The stores <strong>will be</strong> crowded.</td>
              </tr>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">I<strong>'m going to read</strong> one book in English.</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">January classes <strong>will be</strong> harder.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>going to</strong> = a plan you already decided.<br>
          <strong>will</strong> = a guess about the future, or a decision you make right now.</p>
        </div>

        <p>Next semester you will learn more tenses, starting with the past perfect in February. Everything new will build on these six.</p>
      `,
      exercises: [
        {
          id: "frst-s5-ex1",
          title: "Read Rosa's lists",
          instructions: "Look at the table above.",
          items: [
            {
              type: "radio",
              label: "Which one is a decided plan?",
              options: [
                { value: "a", label: "The stores will be crowded." },
                { value: "b", label: "Rosa is going to visit her aunt." },
                { value: "c", label: "It will snow a lot." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "When is Rosa going to buy the presents?",
              options: [
                { value: "a", label: "On Saturday" },
                { value: "b", label: "In January" },
                { value: "c", label: "Tonight" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "frst-s5-ex2",
          title: "Will or going to?",
          instructions: "Write the future form.",
          items: [
            {
              type: "text",
              label: "David already has a ticket. He ___ (fly) to Miami on Monday. Use going to.",
              expectedAnswers: ["is going to fly", "'s going to fly"],
            },
            {
              type: "text",
              label: "The phone rings. Rosa says, \"I ___ (get) it!\" She decides right now.",
              expectedAnswers: ["'ll get", "will get"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want the big picture?",
        content: "Curious about all twelve English tenses? Open the <a href=\"/grammar-reader/all-verb-tenses-overview\" style=\"font-weight:700;text-decoration:underline\">All Verb Tenses Overview</a>. It's optional. You will learn the rest in the spring.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "frst-q1",
      question: "Rosa takes the 116 bus every Tuesday and Thursday. Which sentence fits?",
      options: [
        { value: "a", label: "She is taking the 116 every Tuesday and Thursday." },
        { value: "b", label: "She takes the 116 every Tuesday and Thursday." },
        { value: "c", label: "She took the 116 every Tuesday and Thursday." },
      ],
      correctAnswer: "b",
      explanation: "Every Tuesday and Thursday is a routine, so use the present simple: she takes.",
      topic: "present-simple",
      skill: "usage",
      skillTag: "routine-every-week",
      difficulty: "easy",
    },
    {
      id: "frst-q2",
      question: "David is on the phone. His friend asks what he is doing. David says:",
      options: [
        { value: "a", label: "I wait for the bus." },
        { value: "b", label: "I'm waiting for the bus." },
        { value: "c", label: "I waited for the bus." },
      ],
      correctAnswer: "b",
      explanation: "The action is happening right now, so use the present continuous: I'm waiting.",
      topic: "present-continuous",
      skill: "usage",
      skillTag: "right-now",
      difficulty: "easy",
    },
    {
      id: "frst-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"I was cooking dinner when my son ___ home.\" (come)",
      correctAnswer: "came",
      explanation: "The short action in the middle of the longer one uses the past simple: came.",
      topic: "past-simple",
      skill: "usage",
      skillTag: "interrupting-action",
      difficulty: "easy",
    },
    {
      id: "frst-q4",
      question: "Which sentence has a mistake?",
      options: [
        { value: "a", label: "She has lived here since 2021." },
        { value: "b", label: "Have you ever called a landlord in English?" },
        { value: "c", label: "I have visited my aunt last Sunday." },
      ],
      correctAnswer: "c",
      explanation: "Last Sunday is a finished time, so use the past simple: I visited my aunt last Sunday.",
      topic: "present-perfect",
      skill: "error-detection",
      skillTag: "finished-time-past-simple",
      difficulty: "medium",
    },
    {
      id: "frst-qws1",
      type: "word-scramble" as const,
      question: "Amara already bought her plane ticket. Put the words in order.",
      words: ["She", "is", "going", "to", "visit", "her", "mother", "in", "January"],
      correctAnswer: "She is going to visit her mother in January",
      hint: "be + going to + base verb = a decided plan",
      explanation: "Amara already has a ticket, so the plan is decided: she is going to visit.",
      topic: "future-going-to",
      skill: "usage",
      skillTag: "going-to-plan-word-order",
      difficulty: "medium",
    },
  ],
};
