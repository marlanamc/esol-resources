import type { InteractiveGuideContent } from "@/types/activity";
import { iUsedToButNowIImages as img } from "@/data/i-used-to-but-now-i-images.generated";
import { readingCard, timeline } from "@/content/grammar/_shared/guide-visuals";

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
        <p><strong>Bring back:</strong> Workplace warm-up: You have to wear closed-toe shoes. You should arrive a little early. You cannot block the exit. Then compare: I used to work nights; now I work days.</p>

        ${sceneCard("sceneBusCommute", "On the bus to work. Tuesday, 4:30 AM.", "sage")}

        <p>Linh works as a housekeeper at a hotel in East Boston. She moved from Vietnam four years ago. Her shift is 5 AM to 1 PM. On the bus to work, she video-calls her sister Mai. It is afternoon in Vietnam.</p>

        ${dialogue([
          { speaker: "Mai", avatar: "👩🏻", text: "How are the kids?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "They're good. Busy with school.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "They miss you. I <strong>used to have</strong> family nearby to help. Now we only see you on the phone.", side: "right", tone: "terracotta" },
          { speaker: "Mai", avatar: "👩🏻", text: "I know. It's hard.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Used to + base verb</strong> = a past habit or state that is <em>not</em> true now. It is not the same as <strong>am used to</strong> (introduced in Week 33).</p>
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
              label: "Build Linh's sentence about her old neighborhood:",
              words: ["I", "used", "to", "know", "all", "my", "neighbors"],
              correctAnswer: "I used to know all my neighbors",
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
        <p>Linh's coworker Michelle asks how her days changed after she moved to Boston. Linh writes it down for her.</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-blue" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Then and now</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">Linh's day: Vietnam and Boston</div>
          </div>
          <div style="padding: 0 0.75rem 0.75rem 0.75rem">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed">
              <thead><tr><th scope="col" class="gc-table-divider" style="padding: 0.4rem 0.4rem !important; font-size: 0.8rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.12)"></th><th scope="col" class="gc-table-divider" style="padding: 0.4rem 0.4rem !important; font-size: 0.8rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.12)">Back home</th><th scope="col" class="gc-table-divider" style="padding: 0.4rem 0.4rem !important; font-size: 0.8rem; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.12)">Boston now</th></tr></thead>
              <tbody>
              <tr>
                <th scope="row" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; vertical-align: top" class="gc-table-divider">Wake up</th>
                <td style="padding: 0.5rem 0.4rem !important; font-size: 0.95rem; vertical-align: top" class="gc-table-divider">6:30</td>
                <td style="padding: 0.5rem 0.4rem !important; font-size: 0.95rem; vertical-align: top" class="gc-table-divider"><strong>4:00</strong></td>
              </tr>
              <tr>
                <th scope="row" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; vertical-align: top" class="gc-table-divider">Work starts</th>
                <td style="padding: 0.5rem 0.4rem !important; font-size: 0.95rem; vertical-align: top" class="gc-table-divider">8:00</td>
                <td style="padding: 0.5rem 0.4rem !important; font-size: 0.95rem; vertical-align: top" class="gc-table-divider"><strong>5:00</strong></td>
              </tr>
              <tr>
                <th scope="row" style="padding: 0.5rem 0.4rem !important; font-size: 0.9rem; vertical-align: top" class="gc-table-divider">Dinner</th>
                <td style="padding: 0.5rem 0.4rem !important; font-size: 0.95rem; vertical-align: top" class="gc-table-divider">cook at 11 pm</td>
                <td style="padding: 0.5rem 0.4rem !important; font-size: 0.95rem; vertical-align: top" class="gc-table-divider"><strong>meal-prep on Sunday</strong></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Negative:</strong> didn't use to + base verb. No <strong>-d</strong> on <em>use</em>.<br/><strong>Question:</strong> Did you use to + base verb?</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("negative", "terracotta")}
            <span><em>I <strong>didn't use to</strong> wake up at 4.</em> (Now I do.)</span>
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
              label: "Look at the table. What time did Linh use to wake up back home?",
              options: [
                { value: "a", label: "4:00" },
                { value: "b", label: "6:30" },
                { value: "c", label: "8:00" },
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
            {
              type: "radio",
              label: "Look at the table. Which sentence about Linh is correct?",
              options: [
                { value: "a", label: "I didn't use to start work at 5:00." },
                { value: "b", label: "I didn't used to start work at 5:00." },
                { value: "c", label: "I didn't use to start work at 8:00." },
              ],
              expectedAnswer: "a",
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
              label: "I didn't ___ to wake up at 4.",
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
        <p>Linh's classmate Edwin shows her a short reading about a man who also changed his life after moving to the United States.</p>

        ${readingCard({
          kicker: "Famous person",
          title: "Dalip Singh Saund: From India to Congress",
          photo: {
            url: "/images/guide-people/dalip-singh-saund.jpg",
            alt: "Painted portrait of Dalip Singh Saund standing in the U.S. Capitol",
            credit: "Jon R. Friedman, U.S. House of Representatives, public domain",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Dalip_Singh_Saund_Portrait_(HR).jpg",
          },
          paragraphs: [
            "Dalip Singh Saund was born in India in 1899. In 1920, he sailed to the United States to study at the University of California. He planned to stay only three years. Later, he worked on farms in California's Imperial Valley. At first he was a field foreman on a cotton farm. While the workers picked cotton, he <strong>used to read</strong> books about poetry and American history.",
            "In those years, Indian immigrants could not become U.S. citizens. Saund worked to change the law, and he became a citizen in 1949. In 1956, voters elected him to Congress. He was the first Asian American in Congress.",
          ],
          sources: [
            { name: "PBS: Roots in the Sand", url: "https://www.pbs.org/rootsinthesand/i_dalip1.html" },
            { name: "Encyclopedia of World Biography", url: "https://www.encyclopedia.com/history/encyclopedias-almanacs-transcripts-and-maps/saund-dalip-singh" },
          ],
          accent: "blue",
        })}

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
              label: "Look at the reading. While the workers picked cotton, Saund ___ books about poetry and American history.",
              options: [
                { value: "a", label: "used to read" },
                { value: "b", label: "used to reading" },
                { value: "c", label: "is used to read" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Look at the reading. In what year did Saund become a U.S. citizen?",
              options: [
                { value: "a", label: "1920" },
                { value: "b", label: "1949" },
                { value: "c", label: "1956" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Linh slept more back home. Which full sentence is correct?",
              options: [
                { value: "a", label: "I used to sleep eight hours, but now I sleep six." },
                { value: "b", label: "I used to sleeping eight hours, but now I sleep six." },
                { value: "c", label: "I am used to sleep eight hours, but now I sleep six." },
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
              label: "I used to ___ (live) with my parents, but now I live with my kids.",
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
      icon: "⏳",
      explanation: `
        <p>Linh draws a timeline of her life for Ms. Tran's class. It shows what changed, and what she is still learning.</p>

        ${timeline({
          kicker: "Timeline",
          title: "Linh's life: Vietnam to Boston",
          items: [
            { when: "Vietnam", text: "Linh lives with her parents and walks to work.", accent: "terracotta" },
            { span: "She moves (4 years ago)", accent: "sage" },
            { when: "Boston", text: "She lives with her two kids and takes two buses.", accent: "blue" },
            { when: "Now", text: "She is <strong>getting used to</strong> the cold winters.", accent: "amber" },
          ],
        })}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Used to + verb</strong> = past habit, not true now.<br/>
            <strong>Be / get used to</strong> = normal now, or becoming normal (different grammar). You will learn be/get used to in Week 33.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("past habit", "terracotta")}
            <span><em>I <strong>used to walk</strong> to work.</em> (I don't anymore.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("still changing", "blue")}
            <span><em>I am <strong>getting used to</strong> the cold.</em> (Optional preview for Week 33. Not the same as used to.)</span>
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
              label: "Look at the timeline. Which sentence about Linh is true?",
              options: [
                { value: "a", label: "I used to take two buses in Vietnam." },
                { value: "b", label: "I used to walk to work in Vietnam." },
                { value: "c", label: "I used to live with my kids in Vietnam." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "I used to walk to work back home." },
                { value: "b", label: "I am used to take two buses now." },
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
              label: "I ___ to live with my parents in Vietnam. (past state, not true now)",
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
              label: "\"I used to walking to work in Vietnam.\" What is wrong?",
              options: [
                { value: "a", label: "No error." },
                { value: "b", label: "Error: should be \"used to walk\" (base verb, not -ing)." },
                { value: "c", label: "Error: should be \"am used to walk\"." },
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
          { speaker: "Edwin", avatar: "👨🏽", text: "I miss my family too. And my job changed. I <strong>used to</strong> work outside, but now I work in a freezer.", side: "left", tone: "blue" },
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "That’s a big change. Linh, <strong>did you use to</strong> stay up late?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "Yes. I <strong>used to</strong> work long restaurant shifts and cook at 11 pm. <strong>But now I</strong> meal-prep on Sunday.", side: "right", tone: "terracotta" },
        ])}
      `,
      exercises: [
        {
          id: "s5-ex1",
          title: "Pick the right pattern",
          instructions: "Positive, negative, or question?",
          items: [
            {
              type: "radio",
              label: "Linh had a garden before Boston.",
              options: [
                { value: "a", label: "I used to have a garden." },
                { value: "b", label: "I didn't use to have a garden." },
                { value: "c", label: "Did you use to have a garden?" },
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
              words: ["I", "used", "to", "cook", "at", "11", "pm,", "but", "now", "I", "meal-prep", "on", "Sunday"],
              correctAnswer: "I used to cook at 11 pm, but now I meal-prep on Sunday",
            },
          ],
        },
        {
          id: "s5-ex4",
          title: "Spot the error",
          items: [
            {
              type: "radio",
              label: "Linh writes: \"I used to cooking dinner at 11 pm.\" What is wrong?",
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
      question: "Linh used to walk to work, but now she takes two buses. What does \"used to\" describe in sentences like this?",
      options: [
        { value: "a", label: "Something that is still true today" },
        { value: "b", label: "A past habit or state that ended" },
        { value: "c", label: "A plan for the future" },
      ],
      correctAnswer: "b",
      explanation: "Used to + base verb describes something from the past that changed.",
      topic: "used-to",
      skill: "usage",
      skillTag: "meaning-past-habit",
      difficulty: "easy",
    },
    {
      id: "ut-q3",
      question: "Linh starts work at 5 AM now. Back home, she started at 8. Which negative sentence is correct?",
      options: [
        { value: "a", label: "I didn't used to start work at 5." },
        { value: "b", label: "I didn't use to start work at 5." },
        { value: "c", label: "I don't use to start work at 5." },
      ],
      correctAnswer: "b",
      explanation: "Negative: didn't use to (no -d on use).",
      topic: "used-to",
      skill: "usage",
      skillTag: "negative-didnt-use-to",
      difficulty: "easy",
    },
    {
      id: "ut-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"I used to walk to work, but now I ___ (take) two buses.\"",
      correctAnswer: "take",
      explanation: "But now I + present simple shows the change. Used to is only for the past part.",
      topic: "used-to",
      skill: "usage",
      skillTag: "but-now-contrast",
      difficulty: "medium",
    },
    {
      id: "ut-q7",
      question: "Find the error: \"I used to lives with my parents.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: should be \"used to live\" (base verb, no -s)." },
        { value: "c", label: "Error: should be \"didn't use to live\"." },
      ],
      correctAnswer: "b",
      explanation: "After used to, use the base verb: live, not lives.",
      topic: "used-to",
      skill: "error-detection",
      skillTag: "error-used-to-plus-ing",
      difficulty: "medium",
    },
    {
      id: "ut-ws1",
      type: "word-scramble" as const,
      question: "Linh talks about how her Sundays changed. Put the words in order.",
      words: ["I", "used", "to", "see", "my", "cousins", "every", "Sunday"],
      correctAnswer: "I used to see my cousins every Sunday",
      hint: "used to + base verb for past habits",
      explanation: "Used to + base verb (see) describes a past habit that is no longer true.",
      topic: "used-to",
      skill: "usage",
      skillTag: "used-to-word-order",
      difficulty: "easy",
    },
  ],
};
