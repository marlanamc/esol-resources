import type { InteractiveGuideContent } from "@/types/activity";
import { presentPerfectHowLongImages as img } from "@/data/present-perfect-how-long-images.generated";
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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; min-width: min-content; max-width: 45%; overflow-wrap: normal">${text}</span>`;

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
        ${sceneCard("sceneHotelHallway", "East Boston. A hotel on Meridian Street. Thursday, 3:30 PM, after Rosa's shift.", "sage")}

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
            <span><em><strong>How long have you been</strong> cleaning hotel rooms?</em></span>
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
              label: "How long have you had your library card?",
              options: [
                { value: "a", label: "I had my library card for two years." },
                { value: "b", label: "I have had my library card for two years." },
                { value: "c", label: "I have my library card two years." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "How long has she lived in East Boston?",
              options: [
                { value: "a", label: "She has lived here since 2021." },
                { value: "b", label: "She lived here since 2021." },
                { value: "c", label: "She is living here since 2021." },
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
              label: "I ___ worked at my hotel for three years. (one word)",
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
        <p style="margin-bottom: 0.75rem">Jennifer in HR has Rosa's resume. Look at the timeline. It is 2026 now, so Rosa's story is still going.</p>

        ${timeline({
          kicker: "Rosa's resume",
          title: "Rosa's life and work in East Boston",
          items: [
            { when: "2021", text: "Rosa <strong>moves</strong> to East Boston.", accent: "terracotta" },
            { when: "2023", text: "She <strong>starts</strong> in hotel housekeeping.", accent: "sage" },
            { when: "2025", text: "She <strong>joins</strong> the morning team.", accent: "blue" },
            { when: "Now", text: "It is 2026. All three are <strong>still true</strong>.", accent: "amber" },
          ],
          note: "Each year is a starting point. Count from that year to now to get a length of time.",
        })}

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
          title: "Read Rosa's timeline",
          instructions: "Look at the timeline above. Choose the true sentence.",
          items: [
            {
              type: "radio",
              label: "Which sentence about Rosa is true?",
              options: [
                { value: "a", label: "She has lived in East Boston since 2023." },
                { value: "b", label: "She has lived in East Boston since 2021." },
                { value: "c", label: "She has lived in East Boston for 2021." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence about Rosa is true?",
              options: [
                { value: "a", label: "She has been on the morning team since 2025." },
                { value: "b", label: "She has been on the morning team since 2021." },
                { value: "c", label: "She has been on the morning team for 2025." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "hl-s2-ex2",
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
          instructions: "Write for or since. Use the timeline when you need it.",
          items: [
            {
              type: "text",
              label: "Rosa started housekeeping in 2023. She has worked there ___ 2023. (for or since?)",
              expectedAnswers: ["since"],
            },
            {
              type: "text",
              label: "It is 2026. Rosa moved to East Boston in 2021. She has lived there ___ five years. (for or since?)",
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
          { id: "pp-arc", type: "arc", zone: "past", position: 50, verbLabel: "Present Perfect (links to NOW)" },
        ],
      },
      explanation: `
        <p style="margin-bottom: 0.75rem">Jennifer checks Rosa's application against the job list. Look at what Rosa has done and what she hasn't done yet.</p>

        ${checklist({
          kicker: "Job list",
          title: "Jennifer's list for Rosa",
          items: [
            { text: "Work in housekeeping for two years", done: true },
            { text: "Train new workers", done: true },
            { text: "Bring a reference letter", done: true },
            { text: "Supervise a team", done: false },
            { text: "Work a night shift", done: false },
          ],
        })}

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
            <span><em>Rosa <strong>has trained</strong> two cleaners.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "amber")}
            <span><em>She <strong>hasn't supervised</strong> a team.</em></span>
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
          title: "Read Jennifer's list",
          instructions: "Look at the checklist above.",
          items: [
            {
              type: "radio",
              label: "Which sentence about Rosa is true?",
              options: [
                { value: "a", label: "She has supervised a team." },
                { value: "b", label: "She has worked a night shift." },
                { value: "c", label: "She has trained new workers." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Rosa ___ (work) a night shift. Check the list. Use the negative.",
              expectedAnswers: ["hasn't worked", "has not worked"],
            },
          ],
        },
        {
          id: "hl-s3-ex2",
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
              label: "Look at the list. Rosa ___ (bring) a reference letter.",
              expectedAnswers: ["has brought"],
            },
            {
              type: "text",
              label: "They ___ (clean) twenty rooms since noon.",
              expectedAnswers: ["have cleaned"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Still Going vs. Finished
    // =========================================================================
    {
      id: "still-going-vs-finished",
      title: "Still Going vs. Finished",
      tenseDiagram: {
        title: "One is still happening. One is done.",
        elements: [
          { id: "pperf-arc", type: "arc", zone: "past", position: 40, verbLabel: "Present Perfect (still true)" },
          { id: "past-dot", type: "single-dot", zone: "past", position: 72, verbLabel: "Past Simple (finished)" },
        ],
      },
      explanation: `
        <p style="margin-bottom: 0.75rem">Jennifer reads four lines from resumes. Look at the table. The verb tells her if the person is still there.</p>

        <div style="overflow-x: auto; margin: 0 0 1.5rem 0; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.08)">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem">
            <thead>
              <tr>
                <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Resume line</th>
                <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Still true?</th>
                <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Tense</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">A: I <strong>have worked</strong> at the Marriott for two years.</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Yes, still there</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Present perfect</td>
              </tr>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">B: I <strong>worked</strong> at the Hilton for one year.</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">No, she left</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Past simple</td>
              </tr>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">C: I <strong>have lived</strong> in East Boston since 2021.</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Yes, still there</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Present perfect</td>
              </tr>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">D: I <strong>lived</strong> in Chelsea for a year.</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">No, I moved away</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">Past simple</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Present Perfect</strong> = started in the past and still true right now.<br>
            <strong>Past Simple</strong> = finished. That job, that apartment, that situation is done.
          </p>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444">
          <p style="margin: 0; font-size: 0.95rem"><strong>Watch out:</strong> do not use present perfect with a finished time.<br>
          <span style="color: #ef4444">✗</span> "I have worked at the Hilton last year."<br>
          <span style="color: #059669">✓</span> "I worked at the Hilton last year."</p>
        </div>
      `,
      exercises: [
        {
          id: "hl-s4-ex1",
          title: "Read the table",
          instructions: "Look at the four resume lines above.",
          items: [
            {
              type: "radio",
              label: "Which line shows a person who still works at the Marriott?",
              options: [
                { value: "a", label: "A" },
                { value: "b", label: "B" },
                { value: "c", label: "D" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which two lines use the past simple, because the person left?",
              options: [
                { value: "a", label: "A and C" },
                { value: "b", label: "B and D" },
                { value: "c", label: "A and D" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hl-s4-ex2",
          title: "Still true or finished?",
          instructions: "Choose the tense that fits the meaning.",
          items: [
            {
              type: "radio",
              label: "Rosa still works at her current job. She ___ there for three years.",
              options: [
                { value: "a", label: "has worked (still there)" },
                { value: "b", label: "worked (she left)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Dalia's old apartment was in Dorchester, but she moved. She ___ there for one year.",
              options: [
                { value: "a", label: "has lived (still there)" },
                { value: "b", label: "lived (she moved away)" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "She has worked at the Hilton last year." },
                { value: "b", label: "She worked at the Hilton last year." },
              ],
              expectedAnswer: "b",
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
              label: "Before housekeeping, Dalia ___ (work) in a hotel laundry for two years. She left that job.",
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
        ${sceneCard("sceneInterview", "Hotel HR office. Rosa's final interview round. Tuesday, 3:30 PM, right after her shift.", "terracotta")}

        ${dialogue([
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "How long have you worked in hotel housekeeping?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>have worked</strong> in housekeeping for three years, since 2023.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "And have you ever supervised other cleaners?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I <strong>haven't</strong> been a supervisor, but I've trained two new workers at my current job.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Good. We'd like to offer you the job. When could you start?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Thank you! I'll give my notice tomorrow, so in two weeks.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 1.05rem">The negative is simple: <strong>haven't</strong> or <strong>hasn't</strong> + past participle.<br>
          "I <strong>haven't worked</strong> a night shift before, but I can." That's an honest answer that still sounds professional.</p>
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
              label: "How long have you driven a delivery van?",
              options: [
                { value: "a", label: "I drove it for four years." },
                { value: "b", label: "I have driven a delivery van for four years." },
                { value: "c", label: "I driving for four years." },
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
              words: ["Rosa", "has", "lived", "in", "East", "Boston", "since", "2021"],
              correctAnswer: "Rosa has lived in East Boston since 2021",
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
              label: "A neighbor asks, “Are you new here?” -- No. I ___ (live) here for five years.",
              expectedAnswers: ["have lived"],
            },
            {
              type: "text",
              label: "At an interview, someone asks, “Do you have any experience as a supervisor?” -- I ___ (not / supervise) a team, but I've trained two people.",
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
      question: "Jennifer asks: 'How long have you been on the morning team?' Rosa is still on the team. Which answer is correct?",
      options: [
        { value: "a", label: "I was on the morning team for one year." },
        { value: "b", label: "I have been on the morning team for one year." },
        { value: "c", label: "I am being on the morning team for one year." },
      ],
      correctAnswer: "b",
      explanation: "Present perfect (have been) is correct because Rosa is still on the team. Past simple would mean she left.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "how-long-still-true",
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
      id: "pperf-how-long-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"I have worked here ___ 2022.\" (Starting point in time: for or since?)",
      correctAnswer: "since",
      explanation: "'Since' goes with a starting point like a year, month, or date. 'For' goes with a length of time like 'two years'.",
      topic: "for-since",
      skill: "usage",
      skillTag: "since-starting-point",
      difficulty: "easy",
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
      id: "pperf-how-long-qws1",
      type: "word-scramble" as const,
      question: "Amara tells her neighbor how long she has lived in the building. Put the words in order.",
      words: ["I", "have", "lived", "here", "for", "six", "months"],
      correctAnswer: "I have lived here for six months",
      hint: "have/has + past participle + for + length of time",
      explanation: "Present perfect (have lived) with 'for' shows an ongoing situation: she still lives there.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "how-long-still-true",
      difficulty: "medium",
    },
  ],
};
