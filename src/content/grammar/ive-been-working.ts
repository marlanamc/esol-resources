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
          { id: "ppc-duration", type: "solid-to-now", zone: "past", position: 35, verbLabel: "have been working (→ NOW)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusStop", "Meridian Street bus stop, Tuesday morning in March, 6:30 AM.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara cleans patient rooms at the hospital. Her neighbor Rosa lives in the same building on Meridian Street, and they are classmates in the evening ESOL class. This morning they wait at the bus stop before work.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "You look tired, Amara.", side: "left", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "I <strong>have been working</strong> six days a week since January. The hospital is short of cleaners.", side: "right", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "That’s rough. I <strong>have been studying</strong> every night for our ESOL project, so I’m tired too.", side: "left", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "How long <strong>have</strong> you <strong>been doing</strong> that?", side: "right", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Three weeks. I’m hoping things slow down soon.", side: "left", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Perfect Continuous</strong> = an action that started in the past and is still happening now. You want to say HOW LONG it has been going on.</p>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> have / has + been + verb-ing<br>
          <em>I <strong>have been working</strong> six days a week.</em><br>
          <em>She <strong>has been studying</strong> every night.</em></p>
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
              label: "Amara works six days a week. Which sentence is correct?",
              options: [
                { value: "a", label: "She have been working six days a week." },
                { value: "b", label: "She has been working six days a week." },
                { value: "c", label: "She has been worked six days a week." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Rosa and her classmates all study every night. Which sentence is correct?",
              options: [
                { value: "a", label: "They has been studying every night." },
                { value: "b", label: "They have been study every night." },
                { value: "c", label: "They have been studying every night." },
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
              words: ["I", "have", "been", "studying", "English", "for", "two", "years"],
              correctAnswer: "I have been studying English for two years",
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
              label: "Rosa studies every night. She ___ every night for three weeks. (has been studying)",
              expectedAnswers: ["has been studying"],
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
          { id: "ppc-start", type: "single-dot", zone: "past", position: 25, verbLabel: "unit moved (Feb)" },
          { id: "ppc-ongoing", type: "solid-to-now", zone: "past", position: 45, verbLabel: "have been taking (since Feb → NOW)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneBusStop", "Meridian Street bus stop, Friday evening, 6:15 PM. Amara and Rosa wait for the bus home.", "blue")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">In February, the hospital moved Amara's unit to a new building. Her trip home now takes twice as long, and she wants a job closer to home. At the bus stop, Rosa asks about it.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "You still taking two buses?", side: "left", tone: "blue" },
          { speaker: "Amara", avatar: "👩🏿", text: "Yeah. I <strong>have been taking</strong> two buses since the hospital moved my unit in February.", side: "right", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "How long <strong>have</strong> you <strong>been looking</strong> for a job closer to home?", side: "left", tone: "blue" },
          { speaker: "Amara", avatar: "👩🏿", text: "Three weeks. Our teacher, Ms. Tran, told us about a job fair on Saturday. I’m going.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>for</strong> with a length of time. Use <strong>since</strong> with a starting point.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("for", "sage")}
            <span><em>I have been looking for a job <strong>for three weeks</strong>.</em></span>
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
              label: "Amara has been taking two buses ___ the hospital moved her unit.",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "since",
            },
            {
              type: "radio",
              label: "Amara has been looking for a new job ___ three weeks.",
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
              words: ["She", "has", "been", "looking", "for", "a", "new", "job", "for", "three", "weeks"],
              correctAnswer: "She has been looking for a new job for three weeks",
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
              label: "Rosa has been studying every night ___ three weeks. (one word)",
              expectedAnswers: ["for"],
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
        ${sceneCard("sceneJobFair", "East Boston Community School gym, Saturday morning. The job fair has just opened.", "amber")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara arrives early. Jennifer is the HR manager for a hotel on Meridian Street, and she has a table at the fair. Amara is the first person in her line.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "How long <strong>have</strong> you <strong>been working</strong> in housekeeping?", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏿", text: "I <strong>have been cleaning</strong> patient rooms at the hospital for almost three years.", side: "right", tone: "sage" },
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "Good. <strong>Have</strong> you <strong>been using</strong> the big floor machines there?", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏿", text: "Yes, I have. I've been using them since my first month.", side: "right", tone: "sage" },
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "Great. Please come to the hotel on Monday for your interview.", side: "left", tone: "amber" },
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
                { value: "a", label: "How long you have been living in Boston?" },
                { value: "b", label: "How long have you been living in Boston?" },
                { value: "c", label: "How long have you been live in Boston?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Amara asks Jennifer about the head housekeeper at the hotel. Which is correct?",
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
              words: ["How", "long", "have", "you", "been", "saving", "for", "a", "car"],
              correctAnswer: "How long have you been saving for a car",
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
        ${sceneCard("sceneHotel", "Hotel hallway, third floor. Amara’s first morning at the hotel.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara got the job. Today is her first morning at the hotel. Marta is a housekeeper who has worked there for four years, and Jennifer asked her to train Amara. They stop in the hallway for a minute.</p>

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "I <strong>have cleaned</strong> six rooms already. The third floor is done.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "Good work. I <strong>have been training</strong> new people for three hours. I haven't had a break yet.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "How long <strong>have</strong> you <strong>been working</strong> here?", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "Four years. Jennifer told me you have a lot of experience.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Almost three years at the hospital. I hope it helps here.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "It will. After lunch, you can do the fourth floor by yourself.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Present Perfect</strong> (have + V3) = the action is finished. You care about the result.<br>
          <strong>Present Perfect Continuous</strong> (have been + verb-ing) = the action is still happening. You care about how long.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>I <strong>have cleaned</strong> six rooms. (done)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.06); border-radius: 0.4rem">
            ${labelPill("still happening", "blue")}
            <span><em>I <strong>have been training</strong> new people for three hours. (not done)</em></span>
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
              label: "Amara finished cleaning all six rooms. Which sentence fits?",
              options: [
                { value: "a", label: "She has been cleaning six rooms." },
                { value: "b", label: "She has cleaned six rooms." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Marta started training new people three hours ago and she is still training. Which sentence fits?",
              options: [
                { value: "a", label: "She has trained new people for three hours." },
                { value: "b", label: "She has been training new people for three hours." },
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
              words: ["Marta", "has", "been", "working", "at", "the", "hotel", "for", "four", "years"],
              correctAnswer: "Marta has been working at the hotel for four years",
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
              label: "Marta is still training. She ___ new people for three hours. (has been training)",
              expectedAnswers: ["has been training"],
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
      question: "Amara works six days a week and is still working that schedule now. Which sentence is correct?",
      options: [
        { value: "a", label: "She has worked six days a week since January." },
        { value: "b", label: "She has been working six days a week since January." },
        { value: "c", label: "She is working six days a week since January." },
      ],
      correctAnswer: "b",
      explanation: "Present Perfect Continuous (has been working) is used for an ongoing action that started in the past and is still happening now.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-ongoing-action",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-q3",
      question: "Jennifer asks Amara a question about her experience. Which question is correct?",
      options: [
        { value: "a", label: "How long you have been working the day shift?" },
        { value: "b", label: "How long have you been working the day shift?" },
        { value: "c", label: "How long have you been work the day shift?" },
      ],
      correctAnswer: "b",
      explanation: "In PPC questions, the word order is: How long + have/has + subject + been + verb-ing.",
      topic: "present-perfect-continuous",
      skill: "error-detection",
      skillTag: "ppc-question-word-order",
      difficulty: "easy",
    },
    {
      id: "ive-been-working-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"She has been ___ money for months.\" (Present Perfect Continuous: verb-ing after 'has been'.)",
      correctAnswer: "saving",
      explanation: "After 'has been,' always use the -ing form of the verb. 'Has been saving' = the action started in the past and is still continuing.",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-verb-ing-form",
      difficulty: "easy",
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
      id: "ive-been-working-qws1",
      type: "word-scramble" as const,
      question: "Jennifer asks Amara about her cleaning experience. Put the words in order.",
      words: ["How", "long", "have", "you", "been", "cleaning", "patient", "rooms"],
      correctAnswer: "How long have you been cleaning patient rooms",
      hint: "How long + have/has + subject + been + verb-ing",
      explanation: "PPC questions follow: How long + have/has + subject + been + verb-ing?",
      topic: "present-perfect-continuous",
      skill: "usage",
      skillTag: "ppc-question-word-order",
      difficulty: "medium",
    },
  ],
};
