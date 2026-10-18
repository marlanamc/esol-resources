import type { InteractiveGuideContent } from "@/types/activity";
import { presentPerfectHowLongImages as img } from "@/data/present-perfect-how-long-images.generated";
import { checklist } from "@/content/grammar/_shared/guide-visuals";

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

export const presentPerfectHowLongContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — I've Already Sent It: ALREADY
    // =========================================================================
    {
      id: "already-sent-it",
      title: "I've Already Sent It: ALREADY",
      tenseDiagram: {
        title: "Present perfect: a past action that matters now",
        elements: [
          { id: "pp-arc", type: "arc", zone: "past", position: 50, verbLabel: "have/has + V3 (done, and it matters now)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneJobApplication", "A hotel HR office in East Boston. Monday, 10 AM. Jennifer takes a call from Rosa.", "sage")}

        <p>Rosa wants a better job. She applied for a housekeeping supervisor job at a big hotel on the waterfront. Jennifer works in HR. She calls Rosa to check her application.</p>

        ${dialogue([
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Hi Rosa, this is Jennifer from the hotel. Have you filled out the online application <strong>yet</strong>?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yes, I <strong>have already filled</strong> it out. I sent it on Friday.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Great. And your reference letter?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "My manager <strong>hasn't written</strong> it <strong>yet</strong>. She is going to send it this week.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>already</strong> = it is done. Often it is done sooner than someone expected. Put <strong>already</strong> between <strong>have/has</strong> and the past participle (V3).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("I / you / we / they", "terracotta")}
            <span><em>I <strong>have already sent</strong> my resume.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("he / she / it", "sage")}
            <span><em>Rosa <strong>has already filled</strong> out the application.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("short form", "blue")}
            <span><em>I<strong>'ve already</strong> applied. She<strong>'s already</strong> called.</em></span>
          </div>
        </div>

        <p style="margin-top: 1rem">This is the same present perfect you learned in November: <strong>have/has + V3</strong>. Now you add one small word to say <em>when</em>.</p>
      `,
      exercises: [
        {
          id: "jay-w24-s1-ex1",
          title: "What does it mean?",
          instructions: "Choose the best meaning.",
          items: [
            {
              type: "radio",
              label: "Rosa says, \"I have already filled it out.\" What is true?",
              options: [
                { value: "a", label: "The application is done." },
                { value: "b", label: "Rosa is going to fill it out tomorrow." },
                { value: "c", label: "Rosa can't find the application." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Where does already go?",
              options: [
                { value: "a", label: "She already has sent her resume." },
                { value: "b", label: "She has already sent her resume." },
                { value: "c", label: "She has sent already her resume." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "jay-w24-s1-ex2",
          title: "Fill in the blank",
          instructions: "Write the missing words.",
          items: [
            {
              type: "text",
              label: "Rosa ___ already applied for the job. (have or has?)",
              expectedAnswers: ["has"],
            },
            {
              type: "text",
              label: "We have already ___ (send) the forms to HR.",
              expectedAnswers: ["sent"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — I've Just Gotten an Email: JUST
    // =========================================================================
    {
      id: "just-got-email",
      title: "I've Just Gotten an Email: JUST",
      explanation: `
        <p style="margin-bottom: 0.75rem">On Wednesday, Rosa's phone buzzes on the bus. She looks at her inbox. Look at the times.</p>

        <div style="overflow-x: auto; margin: 0 0 1.5rem 0; border-radius: 0.5rem; border: 1px solid rgba(0,0,0,0.08)">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem">
            <thead>
              <tr>
                <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">From</th>
                <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Subject</th>
                <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)"><strong>Jennifer (HR)</strong></td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)"><strong>Interview on Thursday?</strong></td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)"><strong>2 min ago</strong></td>
              </tr>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Library</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Free resume class</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">Monday</td>
              </tr>
              <tr>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">Bank</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">Your statement</td>
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important">Last week</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>Rosa texts her sister: <em>"I<strong>'ve just gotten</strong> an email from the hotel! They want an interview!"</em></p>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>just</strong> = a very short time ago. It is new news. Like <strong>already</strong>, it goes between <strong>have/has</strong> and the V3.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("just", "terracotta")}
            <span><em>The hotel <strong>has just called</strong> me back!</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("just", "terracotta")}
            <span><em>I<strong>'ve just finished</strong> my shift. Can I call you back?</em></span>
          </div>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Watch out:</strong> <em>just</em> is for new news. An email from last week is not "just".<br>
          <span style="color: #ef4444">✗</span> "The bank has just sent my statement last week."<br>
          <span style="color: #059669">✓</span> "The bank sent my statement last week."</p>
        </div>
      `,
      exercises: [
        {
          id: "jay-w24-s2-ex1",
          title: "Read Rosa's inbox",
          instructions: "Look at the inbox above.",
          items: [
            {
              type: "radio",
              label: "Which email has Rosa just gotten?",
              options: [
                { value: "a", label: "The email from the bank" },
                { value: "b", label: "The email from the library" },
                { value: "c", label: "The email from Jennifer" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Which sentence about the inbox is true?",
              options: [
                { value: "a", label: "The library has just sent an email." },
                { value: "b", label: "Jennifer has just sent an email." },
                { value: "c", label: "The bank has just sent an email." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "jay-w24-s2-ex2",
          title: "Build the sentence",
          instructions: "Write have/has + just + V3.",
          items: [
            {
              type: "text",
              label: "Rosa walked in the door one minute ago. She ___ (just / get) home.",
              expectedAnswers: ["has just gotten", "'s just gotten", "has just got", "'s just got"],
            },
            {
              type: "text",
              label: "I ___ (just / finish) the interview. I'm leaving the hotel now.",
              expectedAnswers: ["have just finished", "'ve just finished"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — I Haven't Heard Back Yet: YET
    // =========================================================================
    {
      id: "not-yet",
      title: "I Haven't Heard Back Yet: YET",
      explanation: `
        <p style="margin-bottom: 0.75rem">On Wednesday night, Rosa checks her job search list. Some things are done. Some things are not done <em>yet</em>.</p>

        ${checklist({
          kicker: "Job search",
          title: "Rosa's list for the new job",
          items: [
            { text: "Fill out the online application", done: true },
            { text: "Send my resume", done: true },
            { text: "Answer Jennifer's email", done: true },
            { text: "Get a reference letter", done: false },
            { text: "Buy black work shoes", done: false },
          ],
        })}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>yet</strong> = up to now, but we expect it. Use <strong>yet</strong> in <strong>questions</strong> and <strong>negatives</strong>. It goes at the <strong>end</strong> of the sentence.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "amber")}
            <span><em>She <strong>hasn't bought</strong> work shoes <strong>yet</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("question", "blue")}
            <span><em><strong>Have</strong> you <strong>heard</strong> back from the hotel <strong>yet</strong>?</em></span>
          </div>
        </div>

        <div style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <strong>Common irregular V3 forms for a job search:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem">
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">send → sent</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">get → gotten</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">hear → heard</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">buy → bought</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">write → written</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">do → done</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "jay-w24-s3-ex1",
          title: "Read Rosa's list",
          instructions: "Look at the checklist above.",
          items: [
            {
              type: "radio",
              label: "Which sentence about Rosa is true?",
              options: [
                { value: "a", label: "She has already gotten a reference letter." },
                { value: "b", label: "She hasn't sent her resume yet." },
                { value: "c", label: "She has already answered Jennifer's email." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "How many things on Rosa's list are not done yet? (number)",
              expectedAnswers: ["2", "two"],
            },
          ],
        },
        {
          id: "jay-w24-s3-ex2",
          title: "Already or yet?",
          instructions: "Choose the word that fits.",
          items: [
            {
              type: "radio",
              label: "Rosa hasn't bought work shoes ___.",
              options: [
                { value: "a", label: "already" },
                { value: "b", label: "yet" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "She has ___ sent her resume.",
              options: [
                { value: "a", label: "already" },
                { value: "b", label: "yet" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"I haven't yet heard back from the hotel.\" In everyday English, where does yet usually go?",
              options: [
                { value: "a", label: "Correct. Keep it there." },
                { value: "b", label: "At the end: I haven't heard back from the hotel yet." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "jay-w24-s3-ex3",
          title: "Write the sentence",
          instructions: "Use the checklist. Write the negative with yet.",
          items: [
            {
              type: "text",
              label: "Rosa ___ (not / get) a reference letter yet.",
              expectedAnswers: ["hasn't gotten", "has not gotten", "hasn't got", "has not got"],
            },
            {
              type: "text",
              label: "Her sister asks: \"___ you bought your work shoes yet?\" (one word)",
              expectedAnswers: ["Have"],
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
                <td class="gc-table-divider" style="padding: 0.4rem 0.3rem !important; border-bottom: 1px solid rgba(128,128,128,0.25)">No, I left</td>
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
        ${sceneCard("sceneInterview", "Hotel HR office. Rosa's interview. Thursday, 3:30 PM, right after her shift.", "terracotta")}

        ${dialogue([
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Thanks for coming in, Rosa. Have you ever trained new workers?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yes. I <strong>have already trained</strong> two new workers at my current job.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Good. Has your reference letter come <strong>yet</strong>?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Yes! My manager <strong>has just emailed</strong> it to you. She sent it an hour ago.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer (HR)", avatar: "👩‍💼", text: "Perfect. We'd like to offer you the job. When could you start?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Thank you! I <strong>haven't told</strong> my boss <strong>yet</strong>, but I'll give my notice tomorrow.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>already</strong> = done (have <strong>already</strong> + V3)<br>
            <strong>just</strong> = done a very short time ago (have <strong>just</strong> + V3)<br>
            <strong>yet</strong> = not done, but expected (questions and negatives, at the <strong>end</strong>)
          </p>
        </div>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "For more practice with these three words, open <a href=\"/grammar-reader/just-already-yet\" style=\"font-weight:700;text-decoration:underline\">Just, Already, Yet</a>. For a full grammar breakdown, open the <a href=\"/grammar-reader/present-perfect\" style=\"font-weight:700;text-decoration:underline\">Present Perfect Full Guide</a>.",
      },
      exercises: [
        {
          id: "hl-s5-ex1",
          title: "Interview answers",
          instructions: "Choose the best answer for each interview question.",
          items: [
            {
              type: "radio",
              label: "\"Have you finished the safety training yet?\" You finished it last month.",
              options: [
                { value: "a", label: "Yes, I have already finished it." },
                { value: "b", label: "Yes, I have finished it yet." },
                { value: "c", label: "No, I already haven't." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"Have you gotten your work badge yet?\" HR is still making it.",
              options: [
                { value: "a", label: "Yes, I have just gotten it." },
                { value: "b", label: "No, I haven't gotten it yet." },
                { value: "c", label: "No, I haven't yet gotten it already." },
              ],
              expectedAnswer: "b",
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
              words: ["The", "new", "manager", "has", "just", "called", "me"],
              correctAnswer: "The new manager has just called me",
            },
          ],
        },
        {
          id: "hl-s5-ex3",
          title: "Complete Rosa's answers",
          instructions: "Write the correct present perfect form with the word in brackets.",
          items: [
            {
              type: "text",
              label: "Her sister asks, “Did you tell your boss?” -- No, I ___ (not / tell) him yet.",
              expectedAnswers: ["haven't told", "have not told"],
            },
            {
              type: "text",
              label: "Jennifer asks, “Can you send your bank form?” -- I ___ (already / send) it. Check your inbox.",
              expectedAnswers: ["have already sent", "'ve already sent"],
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "pperf-how-long-q1",
      question: "Rosa sent her resume on Friday. Today Jennifer asks if she wants to send it. What does Rosa say?",
      options: [
        { value: "a", label: "I have already sent it." },
        { value: "b", label: "I haven't sent it yet." },
        { value: "c", label: "I have sent it yet." },
      ],
      correctAnswer: "a",
      explanation: "Already means it is done. Rosa sent it on Friday, so: I have already sent it.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "already-done",
      difficulty: "easy",
    },
    {
      id: "pperf-how-long-q4",
      question: "Rosa's phone buzzed 30 seconds ago. It's an email from HR. Which sentence fits?",
      options: [
        { value: "a", label: "HR sent an email last week." },
        { value: "b", label: "HR has just sent an email." },
        { value: "c", label: "HR hasn't sent an email yet." },
      ],
      correctAnswer: "b",
      explanation: "Just means a very short time ago. The email is new news: HR has just sent an email.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "just-very-recent",
      difficulty: "easy",
    },
    {
      id: "pperf-how-long-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"I haven't heard back from the hotel ___.\" (Not done, but expected.)",
      correctAnswer: "yet",
      explanation: "Yet goes at the end of a negative or a question. It means up to now, but we expect it.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "yet-negative-end",
      difficulty: "easy",
    },
    {
      id: "pperf-how-long-q7",
      question: "Which sentence has a mistake?",
      options: [
        { value: "a", label: "She has already filled out the form." },
        { value: "b", label: "Have you called HR yet?" },
        { value: "c", label: "He has yet finished the training." },
      ],
      correctAnswer: "c",
      explanation: "Yet goes in negatives and questions, at the end: He hasn't finished the training yet.",
      topic: "present-perfect",
      skill: "error-detection",
      skillTag: "yet-position",
      difficulty: "medium",
    },
    {
      id: "pperf-how-long-qws1",
      type: "word-scramble" as const,
      question: "Amara got a job offer five minutes ago. Put the words in order.",
      words: ["I", "have", "just", "gotten", "a", "job", "offer"],
      correctAnswer: "I have just gotten a job offer",
      hint: "have/has + just + past participle",
      explanation: "Just goes between have and the past participle. It shows the news is very new.",
      topic: "present-perfect",
      skill: "usage",
      skillTag: "just-word-order",
      difficulty: "medium",
    },
  ],
};
