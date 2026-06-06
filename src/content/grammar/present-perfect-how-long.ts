import type { InteractiveGuideContent } from "@/types/activity";
import { presentPerfectHowLongImages as img } from "@/data/present-perfect-how-long-images.generated";

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

export const presentPerfectHowLongContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — "How Long Have You Worked Here?"
    // =========================================================================
    {
      id: "how-long-have-you",
      title: "How Long Have You Worked Here?",
      explanation: `
        ${sceneCard("sceneHotelHallway", "East Boston. A hotel on Meridian Street. Thursday morning.", "sage")}

        ${dialogue([
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Thanks for coming in, Rosa. So, <strong>how long have you worked</strong> in housekeeping?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>have worked</strong> in housekeeping for three years.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "And how long have you lived in East Boston?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>have lived</strong> here since 2021.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>How long have you...?</strong> asks about something that started in the past and is still true right now. You answer with <strong>for</strong> or <strong>since</strong>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("for", "terracotta")}
            <span><em>I <strong>have worked</strong> here <strong>for</strong> three years.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("since", "sage")}
            <span><em>I <strong>have lived</strong> here <strong>since</strong> 2021.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("question", "blue")}
            <span><em><strong>How long have you</strong> cleaned hotel rooms?</em></span>
          </div>
        </div>

        <p style="margin-top: 1rem">This is the same present perfect you have seen before. "How long" just focuses it on duration, on asking how much time has passed.</p>
      `,
      exercises: [
        {
          id: "hl-s1-ex1",
          title: "Choose the right answer",
          instructions: "Pick the answer that fits the question.",
          items: [
            {
              type: "radio",
              label: "How long have you worked at this hotel?",
              options: [
                { value: "a", label: "I worked here for two years." },
                { value: "b", label: "I have worked here for two years." },
                { value: "c", label: "I work here two years." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "How long has she lived in East Boston?",
              options: [
                { value: "a", label: "She has lived here since 2020." },
                { value: "b", label: "She lived here since 2020." },
                { value: "c", label: "She is living here since 2020." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "hl-s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the missing words.",
          items: [
            {
              type: "text",
              label: "___ long has Rosa worked in housekeeping? (one word)",
              expectedAnswers: ["How"],
            },
            {
              type: "text",
              label: "I ___ worked at this hotel for three years. (one word)",
              expectedAnswers: ["have", "'ve"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — For vs. Since: Which One?
    // =========================================================================
    {
      id: "for-vs-since",
      title: "For vs. Since: Which One?",
      explanation: `
        ${sceneCard("sceneBreakRoom", "Hotel break room. Claudette and Maria eat lunch before the afternoon shift.", "amber")}

        ${dialogue([
          { speaker: "Claudette", avatar: "👩🏾", text: "How long have you been at this hotel?", side: "left", tone: "sage" },
          { speaker: "Maria", avatar: "👩🏽", text: "I've been here <strong>since March</strong>. About four months.", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "I've been here <strong>for two years</strong>. Started right when they opened the new wing.", side: "left", tone: "sage" },
          { speaker: "Maria", avatar: "👩🏽", text: "Nice. How long have you had this shift?", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "Only <strong>since January</strong>. Before that I had nights.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>for</strong> = a length of time (how many days, months, years)<br>
            <strong>since</strong> = a starting point (a date, a month, a year, an event)
          </p>
        </div>

        <div style="display: grid; gap: 0.75rem; margin: 1rem 0">
          <div style="padding: 0.75rem 1rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; border-left: 3px solid #b05740">
            ${labelPill("for", "terracotta")}
            <p style="margin: 0.4rem 0 0 0"><em>for <strong>six months</strong>, for <strong>two years</strong>, for <strong>a long time</strong>, for <strong>three weeks</strong></em></p>
          </div>
          <div style="padding: 0.75rem 1rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; border-left: 3px solid #6a8d73">
            ${labelPill("since", "sage")}
            <p style="margin: 0.4rem 0 0 0"><em>since <strong>March</strong>, since <strong>2021</strong>, since <strong>I moved here</strong>, since <strong>last summer</strong></em></p>
          </div>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Common mistake:</strong><br>
          <span style="color: #ef4444">✗</span> "I have worked here <strong>since</strong> two years."<br>
          <span style="color: #059669">✓</span> "I have worked here <strong>for</strong> two years."<br>
          <span style="color: #059669">✓</span> "I have worked here <strong>since</strong> 2022."</p>
        </div>
      `,
      exercises: [
        {
          id: "hl-s2-ex1",
          title: "For or since?",
          instructions: "Choose the correct word.",
          items: [
            {
              type: "radio",
              label: "I have cleaned rooms ___ six months.",
              options: [
                { value: "a", label: "for" },
                { value: "b", label: "since" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "She has worked the morning shift ___ January.",
              options: [
                { value: "a", label: "for" },
                { value: "b", label: "since" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "He has lived in East Boston ___ three years.",
              options: [
                { value: "a", label: "for" },
                { value: "b", label: "since" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "hl-s2-ex2",
          title: "Spot the error",
          instructions: "Which sentence has a mistake?",
          items: [
            {
              type: "radio",
              label: "Which sentence is NOT correct?",
              options: [
                { value: "a", label: "She has worked here for two years." },
                { value: "b", label: "She has worked here since two years." },
                { value: "c", label: "She has worked here since 2022." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hl-s2-ex3",
          title: "Fill in the blank",
          instructions: "Write for or since.",
          items: [
            {
              type: "text",
              label: "Claudette has had the day shift ___ January. (for or since?)",
              expectedAnswers: ["since"],
            },
            {
              type: "text",
              label: "Maria has been at this hotel ___ four months. (for or since?)",
              expectedAnswers: ["for"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — The Form: have/has + past participle
    // =========================================================================
    {
      id: "have-has-v3",
      title: "The Form: have/has + past participle",
      tenseDiagram: {
        title: "Where Present Perfect lives on the timeline",
        elements: [
          { id: "pp-start", type: "single-dot", zone: "past", position: 30, verbLabel: "started (past)" },
          { id: "pp-bar", type: "solid-line", zone: "present", position: 50, verbLabel: "still true NOW" },
        ],
      },
      explanation: `
        ${sceneCard("sceneJobApplication", "Hotel HR office. Rosa fills out a work history form.", "terracotta")}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>I / you / we / they</strong> + <strong>have</strong> + past participle (V3)<br>
            <strong>he / she / it</strong> + <strong>has</strong> + past participle (V3)
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("I / you / we / they", "terracotta")}
            <span><em>I <strong>have worked</strong> here for three years.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("he / she / it", "sage")}
            <span><em>She <strong>has cleaned</strong> rooms since January.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "amber")}
            <span><em>He <strong>hasn't worked</strong> a day shift before.</em></span>
          </div>
        </div>

        <div style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <strong>Common irregular V3 forms for work history:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem">
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">be → been</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">do → done</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">have → had</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">work → worked</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">live → lived</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">know → known</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">take → taken</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">clean → cleaned</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hl-s3-ex1",
          title: "Have or has?",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "radio",
              label: "She ___ worked at this hotel for two years.",
              options: [
                { value: "a", label: "have" },
                { value: "b", label: "has" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "We ___ cleaned fifteen rooms since 8 AM.",
              options: [
                { value: "a", label: "have" },
                { value: "b", label: "has" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "hl-s3-ex2",
          title: "Correct or not?",
          instructions: "Is the form right?",
          items: [
            {
              type: "radio",
              label: "\"She have worked here since March.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: She has worked here since March." },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "hl-s3-ex3",
          title: "Build the sentence",
          instructions: "Fill in the correct present perfect form.",
          items: [
            {
              type: "text",
              label: "Rosa ___ (work) in housekeeping for three years.",
              expectedAnswers: ["has worked"],
            },
            {
              type: "text",
              label: "I ___ (live) in East Boston since 2021.",
              expectedAnswers: ["have lived"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Still Going: Present Perfect vs. Past Simple
    // =========================================================================
    {
      id: "still-going-vs-finished",
      title: "Still Going vs. Finished",
      tenseDiagram: {
        title: "One is still happening. One is done.",
        elements: [
          { id: "pperf-line", type: "solid-line", zone: "present", position: 50, verbLabel: "Present Perfect (still true)" },
          { id: "past-dot", type: "single-dot", zone: "past", position: 55, verbLabel: "Past Simple (finished)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneHROffice", "HR office. Jennifer reviews two applications before the final interview.", "blue")}

        ${dialogue([
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "First candidate: 'I worked at the Marriott for two years.' She left that job.", side: "left", tone: "sage" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Second candidate: 'I have worked at the Marriott for two years.' She is still there.", side: "left", tone: "sage" },
          { speaker: "Mark (Manager)", avatar: "👨🏻", text: "The second one is still employed there? That's a good sign.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Present Perfect</strong> = started in the past and still true right now.<br>
            <strong>Past Simple</strong> = finished. That job, that apartment, that situation is done.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("still true now", "sage")}
            <span><em>She <strong>has worked</strong> at the Marriott for two years. (still working there)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "amber")}
            <span><em>She <strong>worked</strong> at the Marriott for two years. (she left)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("still true now", "sage")}
            <span><em>I <strong>have lived</strong> in East Boston since 2020. (still live there)</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "amber")}
            <span><em>I <strong>lived</strong> in Chelsea for a year. (I moved away)</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hl-s4-ex1",
          title: "Still true or finished?",
          instructions: "Choose the tense that fits the meaning.",
          items: [
            {
              type: "radio",
              label: "Rosa still works at the cleaning company. She ___ there for three years.",
              options: [
                { value: "a", label: "has worked (still there)" },
                { value: "b", label: "worked (she left)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Claudette's old apartment was in Chelsea, but she moved. She ___ there for one year.",
              options: [
                { value: "a", label: "has lived (still there)" },
                { value: "b", label: "lived (she moved away)" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hl-s4-ex2",
          title: "Spot the error",
          instructions: "One of these sentences has the wrong tense for the meaning.",
          items: [
            {
              type: "radio",
              label: "Rosa quit her old job last month. Which sentence describes this correctly?",
              options: [
                { value: "a", label: "She worked there for two years. (Past Simple, finished)" },
                { value: "b", label: "She has worked there for two years. (Present Perfect, still going)" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "hl-s4-ex3",
          title: "Fill in the correct tense",
          instructions: "Write the verb in the correct form: past simple or present perfect.",
          items: [
            {
              type: "text",
              label: "Maria still lives on Meridian Street. She ___ (live) there since 2022.",
              expectedAnswers: ["has lived"],
            },
            {
              type: "text",
              label: "Claudette moved last year. She ___ (work) at that hotel for two years before she left.",
              expectedAnswers: ["worked"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Putting It All Together at the Interview
    // =========================================================================
    {
      id: "interview-practice",
      title: "Putting It All Together",
      explanation: `
        ${sceneCard("sceneInterview", "Hotel HR office. Rosa's final interview round. Tuesday, 2 PM.", "terracotta")}

        <p style="margin-bottom: 0.5rem">Before the interview, Rosa's coworker Yemi coaches her in the break room.</p>

        ${dialogue([
          { speaker: "Yemi", avatar: "👩🏿", text: "They'll ask how long. Don't say 'I worked.' Say 'I <strong>have worked</strong>' so they know you're still going.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "OK. How long <strong>have</strong> I worked in housekeeping? Three years. <strong>Since 2021</strong>.", side: "right", tone: "terracotta" },
          { speaker: "Yemi", avatar: "👩🏿", text: "Perfect. And how long in East Boston?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>have lived</strong> here for five years. I know this neighborhood.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 1rem 0 0.5rem 0">At the interview with Jennifer:</p>

        ${dialogue([
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "How long have you worked in hotel housekeeping?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>have worked</strong> in housekeeping for three years, since 2021.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "And have you ever supervised other cleaners?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>haven't</strong> been a supervisor, but I've trained two new workers at my current job.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 1.05rem">The negative is simple: <strong>haven't</strong> or <strong>hasn't</strong> + past participle.<br>
          "I <strong>haven't worked</strong> a night shift before, but I can." That's an honest answer that still sounds professional.</p>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(233,196,106,0.1); border-left: 3px solid #e9c46a; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.9rem; font-style: italic">Women's History Month: In the break room, there's a flyer from the hotel workers union. One question on it reads: "How long have you worked without a raise?" Yemi reads it out loud and laughs. "Too long," she says.</p>
        </div>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This guide covers the most important patterns. For more examples, more exercises, and a full grammar breakdown, open the <a href=\"/grammar-reader/present-perfect\" style=\"font-weight:700;text-decoration:underline\">Present Perfect Full Guide</a>.",
      },
      exercises: [
        {
          id: "hl-s5-ex1",
          title: "Interview questions",
          instructions: "Choose the best answer for each interview question.",
          items: [
            {
              type: "radio",
              label: "How long have you worked in housekeeping?",
              options: [
                { value: "a", label: "I worked there for three years." },
                { value: "b", label: "I have worked in housekeeping for three years." },
                { value: "c", label: "I working for three years." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I haven't worked a night shift before, but I'm available.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct. This is a good negative form." },
                { value: "incorrect", label: "Not correct." },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "hl-s5-ex2",
          title: "Unscramble",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "worked", "in", "housekeeping", "since", "2021"],
              correctAnswer: "I have worked in housekeeping since 2021",
            },
          ],
        },
        {
          id: "hl-s5-ex3",
          title: "Complete Rosa's answers",
          instructions: "Write the correct present perfect form.",
          items: [
            {
              type: "text",
              label: "How long have you lived in East Boston? -- I ___ (live) here for five years.",
              expectedAnswers: ["have lived"],
            },
            {
              type: "text",
              label: "Have you supervised other workers? -- I ___ (not / supervise) a team, but I've trained two people.",
              expectedAnswers: ["haven't supervised", "have not supervised"],
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "pperf-how-long-q1",
      question: "Jennifer asks: 'How long have you worked here?' Rosa still works at the hotel. Which answer is correct?",
      options: [
        { value: "a", label: "I worked here for three years." },
        { value: "b", label: "I have worked here for three years." },
        { value: "c", label: "I am working here for three years." },
      ],
      correctAnswer: "b",
      explanation: "Present perfect (have worked) is correct because Rosa still works there. Past simple would mean she left.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "how-long-still-true",
      difficulty: "easy",
    },
    {
      id: "pperf-how-long-q2",
      question: "Which sentence uses 'since' correctly?",
      options: [
        { value: "a", label: "I have worked here since two years." },
        { value: "b", label: "I have worked here since 2022." },
        { value: "c", label: "I have worked here since a long time." },
      ],
      correctAnswer: "b",
      explanation: "Since needs a starting point: a date, month, or year. 'Two years' and 'a long time' are lengths, so they need 'for'.",
      topic: "for-since",
      skill: "error-detection",
      skillTag: "since-starting-point",
      difficulty: "easy",
    },
    {
      id: "pperf-how-long-q3",
      question: "She ___ at this hotel for six months. (She is still working there.)",
      options: [
        { value: "a", label: "worked" },
        { value: "b", label: "has worked" },
        { value: "c", label: "is worked" },
      ],
      correctAnswer: "b",
      explanation: "Has worked (present perfect) shows the action started in the past and is still true now.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "have-has-v3-form",
      difficulty: "easy",
    },
    {
      id: "pperf-how-long-q4",
      question: "Which sentence has a mistake?",
      options: [
        { value: "a", label: "I have lived here since January." },
        { value: "b", label: "She has worked here for two years." },
        { value: "c", label: "He have worked here since March." },
      ],
      correctAnswer: "c",
      explanation: "With he/she/it, use 'has', not 'have'. Correct form: He has worked here since March.",
      topic: "present-perfect",
      skill: "error-detection",
      skillTag: "have-vs-has",
      difficulty: "easy",
    },
    {
      id: "pperf-how-long-q5",
      question: "Claudette left her old job at the hotel last year. Which sentence is correct?",
      options: [
        { value: "a", label: "She has worked there for two years." },
        { value: "b", label: "She worked there for two years." },
        { value: "c", label: "She works there for two years." },
      ],
      correctAnswer: "b",
      explanation: "Past simple (worked) is correct because the job is finished. Present perfect would mean she still works there.",
      topic: "present-perfect-vs-past-simple",
      skill: "usage",
      skillTag: "still-true-vs-finished",
      difficulty: "medium",
    },
    {
      id: "pperf-how-long-q6",
      question: "The interviewer asks: 'How long have you lived in East Boston?' Rosa has lived there since 2020 and still does. What should she say?",
      options: [
        { value: "a", label: "I lived here since 2020." },
        { value: "b", label: "I have lived here since 2020." },
        { value: "c", label: "I am living here since 2020." },
      ],
      correctAnswer: "b",
      explanation: "Have lived (present perfect) with 'since' shows it started in 2020 and is still true. 'Since' needs a starting point like a year.",
      topic: "for-since",
      skill: "usage",
      skillTag: "since-starting-point-in-use",
      difficulty: "medium",
    },
    {
      id: "pperf-how-long-q7",
      question: "Which pair uses 'for' and 'since' correctly?",
      options: [
        { value: "a", label: "I've worked here for March. / I've worked here since six months." },
        { value: "b", label: "I've worked here for six months. / I've worked here since March." },
        { value: "c", label: "I've worked here for 2022. / I've worked here since two years." },
      ],
      correctAnswer: "b",
      explanation: "For goes with a length of time (six months). Since goes with a starting point (March).",
      topic: "for-since",
      skill: "usage",
      skillTag: "for-vs-since-contrast",
      difficulty: "medium",
    },
    {
      id: "pperf-how-long-q8",
      question: "Rosa tells the interviewer: 'I haven't supervised a team, but I've trained two workers.' What does this tell the interviewer?",
      options: [
        { value: "a", label: "Rosa supervised a team before." },
        { value: "b", label: "Rosa has never been a supervisor but has some training experience." },
        { value: "c", label: "Rosa does not want to supervise anyone." },
      ],
      correctAnswer: "b",
      explanation: "Haven't supervised is a present perfect negative meaning she has no experience as a supervisor up to now. But 've trained shows she has done something related.",
      topic: "present-perfect",
      skill: "recognition",
      skillTag: "present-perfect-negative-meaning",
      difficulty: "medium",
    },
    {
      id: "pperf-how-long-q9",
      question: "Which sentence is NOT correct?",
      options: [
        { value: "a", label: "I have worked in housekeeping for three years." },
        { value: "b", label: "She has lived here since January." },
        { value: "c", label: "They has cleaned ten rooms since this morning." },
      ],
      correctAnswer: "c",
      explanation: "With they/we/I/you, use 'have' not 'has'. Correct form: They have cleaned ten rooms since this morning.",
      topic: "present-perfect",
      skill: "error-detection",
      skillTag: "have-vs-has-plural",
      difficulty: "medium",
    },
    {
      id: "pperf-how-long-q10",
      question: "Maria says: 'I have worked at this hotel since four months.' What is wrong and what is the correct sentence?",
      options: [
        { value: "a", label: "Nothing is wrong." },
        { value: "b", label: "'Since' should be 'for'. Correct: I have worked at this hotel for four months." },
        { value: "c", label: "'Have worked' should be 'worked'. Correct: I worked at this hotel since four months." },
      ],
      correctAnswer: "b",
      explanation: "Four months is a length of time, so it needs 'for'. 'Since' is only for starting points like dates or events.",
      topic: "for-since",
      skill: "error-detection",
      skillTag: "for-vs-since-length-vs-point",
      difficulty: "hard",
    },
  ],
};
