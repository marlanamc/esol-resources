import type { InteractiveGuideContent } from "@/types/activity";
import { howLongForSinceImages as img } from "@/data/how-long-for-since-images.generated";
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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; flex-shrink: 0; white-space: nowrap; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; min-width: min-content; max-width: 45%; overflow-wrap: normal">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const howLongForSinceContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. How Long Have You Been Here?
    // =========================================================================
    {
      id: "how-long-have-you-been-here",
      stepNumber: 1,
      title: "How Long Have You Been Here?",
      icon: "⏳",
      tenseDiagram: {
        title: "Duration: started in the past, still true now",
        elements: [
          {
            id: "pp-duration-arc",
            type: "arc",
            zone: "past",
            position: 30,
            verbLabel: "have worked / have lived",
          },
        ],
      },
      explanation: `
        ${sceneCard("sceneHotelLaundry", "Hotel laundry room, East Boston. Tuesday morning, before the shift starts.", "sage")}

        <p style="margin: 0 0 1rem 0; font-size: 1rem">Yesenia works in the laundry room of a hotel in East Boston. This week she moved to the morning shift, so she is meeting new coworkers. Claudette is a housekeeper. She brings a cart of towels to the laundry room.</p>

        ${dialogue([
          { speaker: "Yesenia", avatar: "👩🏽", text: "How long <strong>have</strong> you <strong>worked</strong> here?", side: "left", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏾", text: "I <strong>have worked</strong> here <strong>for</strong> five years. I started in the laundry, then moved to housekeeping.", side: "right", tone: "terracotta" },
          { speaker: "Yesenia", avatar: "👩🏽", text: "How long <strong>have</strong> you <strong>been</strong> in Boston?", side: "left", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏾", text: "I <strong>have been</strong> here <strong>since</strong> 2020. You?", side: "right", tone: "terracotta" },
          { speaker: "Yesenia", avatar: "👩🏽", text: "I <strong>have lived</strong> in East Boston <strong>for</strong> five years.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>For / Since</strong> with present perfect = the situation started in the past and is <em>still true right now</em>. Claudette still works there. Yesenia still lives in East Boston.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("for", "sage")}
            <span><em>I <strong>have worked</strong> here <strong>for</strong> five years.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("since", "sage")}
            <span><em>I <strong>have been</strong> in Boston <strong>since</strong> 2020.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("for", "sage")}
            <span><em>Yesenia <strong>has lived</strong> in East Boston <strong>for</strong> five years.</em></span>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(106,141,115,0.08); border-left: 3px solid #6a8d73; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.93rem"><strong>The form:</strong> Subject + <strong>have / has</strong> + V3 + <strong>for</strong> or <strong>since</strong> + time<br>
          Examples: have <em>worked</em>, have <em>been</em>, has <em>lived</em>, have <em>had</em>, has <em>known</em></p>
        </div>
      `,
      exercises: [
        {
          id: "hlfs-s1-ex1",
          title: "What does it mean?",
          instructions: "Choose the best meaning for each sentence.",
          items: [
            {
              type: "radio",
              label: "\"Claudette has worked at the hotel for five years.\"",
              options: [
                { value: "a", label: "She worked there a long time ago but stopped." },
                { value: "b", label: "She started five years ago and still works there now." },
                { value: "c", label: "She is going to work there for two years." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I have lived in East Boston since 2020.\"",
              options: [
                { value: "a", label: "I moved away from East Boston in 2020." },
                { value: "b", label: "I lived in East Boston in 2020 but not now." },
                { value: "c", label: "I moved to East Boston in 2020 and I still live here." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "hlfs-s1-ex2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Claudette", "has", "been", "in", "Boston", "since", "2020"],
              correctAnswer: "Claudette has been in Boston since 2020",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "worked", "at", "this", "hotel", "since", "2024"],
              correctAnswer: "I have worked at this hotel since 2024",
            },
          ],
        },
        {
          id: "hlfs-s1-ex3",
          title: "Write the missing word",
          instructions: "Fill in the blank with the correct form of the verb.",
          items: [
            {
              type: "text",
              label: "She ___ (work) at the hotel for two years.",
              expectedAnswers: ["has worked"],
            },
            {
              type: "text",
              label: "We ___ (live) in this apartment since 2021.",
              expectedAnswers: ["have lived"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. For vs. Since: What's the Difference?
    // =========================================================================
    {
      id: "for-vs-since",
      stepNumber: 2,
      title: "For vs. Since: What's the Difference?",
      icon: "⚖️",
      explanation: `
        <p style="margin: 0 0 1rem 0; font-size: 1rem">It is October 2026. Later on Tuesday, Yesenia comes home from work and finds a letter from her landlord in the mailbox. The landlord is not renewing leases in the spring. Look at Yesenia's years in East Boston.</p>

        ${timeline({
          kicker: "Timeline",
          title: "Yesenia in East Boston",
          items: [
            { when: "2021", text: "The family moves into the apartment. <strong>Since 2021</strong> is the starting point.", accent: "sage" },
            { span: "<strong>for</strong> five years", accent: "terracotta" },
            { when: "Oct 2026", text: "Today. The letter from the landlord arrives. Yesenia <strong>has lived</strong> here <strong>for five years</strong>.", accent: "sage" },
          ],
          note: "<strong>For</strong> = the whole bar (a length of time). <strong>Since</strong> = where the bar starts (a starting point).",
        })}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">For</div>
            <div style="font-size: 0.95rem; margin-bottom: 0.5rem">A <strong>length of time</strong></div>
            <div style="font-size: 0.88rem; opacity: 0.85">for 4 years, for 6 months, for a long time, for 3 days</div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Since</div>
            <div style="font-size: 0.95rem; margin-bottom: 0.5rem">A <strong>starting point</strong></div>
            <div style="font-size: 0.88rem; opacity: 0.85">since 2020, since March, since I moved here, since my son was born</div>
          </div>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("for", "terracotta")}
            <span><em>I <strong>have lived</strong> here <strong>for</strong> five years.</em> (= a length of time)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("since", "sage")}
            <span><em>I <strong>have lived</strong> here <strong>since</strong> 2021.</em> (= a starting point)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("for", "terracotta")}
            <span><em>She <strong>has had</strong> the same phone company <strong>for</strong> three years.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("since", "sage")}
            <span><em>She <strong>has had</strong> the same job <strong>since</strong> 2024.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hlfs-s2-ex1",
          title: "For or Since?",
          instructions: "Choose the correct word for each blank.",
          items: [
            {
              type: "radio",
              label: "Yesenia's family has lived in that apartment ___ five years.",
              options: [
                { value: "for", label: "for (length of time)" },
                { value: "since", label: "since (starting point)" },
              ],
              expectedAnswer: "for",
            },
            {
              type: "radio",
              label: "Look at the timeline. Which sentence is true?",
              options: [
                { value: "a", label: "Yesenia has lived in East Boston since five years." },
                { value: "b", label: "Yesenia has lived in East Boston since 2021." },
                { value: "c", label: "Yesenia has lived in East Boston for 2021." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "They have looked for a new apartment ___ October.",
              options: [
                { value: "for", label: "for (length of time)" },
                { value: "since", label: "since (starting point)" },
              ],
              expectedAnswer: "since",
            },
            {
              type: "radio",
              label: "Claudette has worked at the hotel ___ five years.",
              options: [
                { value: "for", label: "for (length of time)" },
                { value: "since", label: "since (starting point)" },
              ],
              expectedAnswer: "for",
            },
          ],
        },
        {
          id: "hlfs-s2-ex2",
          title: "Correct or not correct?",
          instructions: "Is the underlined word correct?",
          items: [
            {
              type: "radio",
              label: "\"I have worked here <strong>since</strong> three years.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'for three years' (three years is a length, not a starting point)" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"She has been in Boston <strong>since</strong> 2019.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'for 2019'" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "hlfs-s2-ex3",
          title: "Fill in the blank",
          instructions: "Write 'for' or 'since'.",
          items: [
            {
              type: "text",
              label: "I have had this apartment ___ March.",
              expectedAnswers: ["since"],
            },
            {
              type: "text",
              label: "She has worked at the laundry ___ two years.",
              expectedAnswers: ["for"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. How Long Have You Had That Plan?
    // =========================================================================
    {
      id: "how-long-have-you-had-that-plan",
      stepNumber: 3,
      title: "\"How Long Have You Had That Plan?\"",
      icon: "📱",
      tenseDiagram: {
        title: "How long? Ask about duration up to now",
        elements: [
          {
            id: "pp-question-arc",
            type: "arc",
            zone: "past",
            position: 40,
            verbLabel: "How long have you had...?",
          },
        ],
      },
      explanation: `
        <p style="margin: 0 0 1rem 0; font-size: 1rem">The landlord's letter asks every tenant to fill out a move-out form. Kevin in the leasing office gives Yesenia the form. Yesenia also needs to save money before the family moves, so last Saturday she switched to a cheaper phone plan. She writes it on the form too. Today is October 2026. Look at what she wrote.</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-amber" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Form</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">Yesenia's move-out form</div>
          </div>
          <div style="padding: 0 0.5rem 0.75rem 0.5rem">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
              <thead>
                <tr>
                  <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Line</th>
                  <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Yesenia wrote</th>
                  <th class="gc-table-divider" scope="col" style="padding: 0.4rem 0.3rem !important; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Since</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                  <td class="gc-text-sage" style="padding: 0.5rem 0.3rem !important; font-weight: 700; vertical-align: top">🏠 Home</td>
                  <td style="padding: 0.5rem 0.3rem !important; vertical-align: top">East Boston apartment</td>
                  <td style="padding: 0.5rem 0.3rem !important; vertical-align: top"><strong>2021</strong></td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                  <td class="gc-text-sage" style="padding: 0.5rem 0.3rem !important; font-weight: 700; vertical-align: top">🧺 Job</td>
                  <td style="padding: 0.5rem 0.3rem !important; vertical-align: top">Hotel laundry room</td>
                  <td style="padding: 0.5rem 0.3rem !important; vertical-align: top"><strong>2024</strong></td>
                </tr>
                <tr>
                  <td class="gc-text-sage" style="padding: 0.5rem 0.3rem !important; font-weight: 700; vertical-align: top">📱 Phone</td>
                  <td style="padding: 0.5rem 0.3rem !important; vertical-align: top">Same company. New plan: $40 (was $65).</td>
                  <td style="padding: 0.5rem 0.3rem !important; vertical-align: top"><strong>2023</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p style="margin: 0 0 1rem 0; font-size: 1rem">Kevin reads the form and asks questions with <em>How long...?</em></p>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>How long have you...?</strong> is the question. The answer uses <em>for</em> or <em>since</em>.</p>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(233,196,106,0.1); border-left: 3px solid #e9c46a; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.4rem 0; font-weight: 700; font-size: 0.93rem">The question pattern:</p>
          <p style="margin: 0; font-size: 0.93rem">
            <strong>How long</strong> + <strong>have/has</strong> + subject + <strong>V3</strong>?<br>
            How long <strong>have</strong> you <strong>had</strong> this plan?<br>
            How long <strong>has</strong> she <strong>worked</strong> here?<br>
            How long <strong>have</strong> they <strong>lived</strong> in that building?
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("question", "amber")}
            <span><em>How long <strong>have</strong> you <strong>lived</strong> in East Boston?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("answer", "terracotta")}
            <span><em>I <strong>have lived</strong> here <strong>for</strong> five years. / <strong>Since</strong> 2021.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("question", "amber")}
            <span><em>How long <strong>has</strong> your sister <strong>had</strong> that job?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("answer", "terracotta")}
            <span><em>She <strong>has had</strong> it <strong>since</strong> March.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hlfs-s3-ex1",
          title: "Choose the correct answer",
          instructions: "Pick the best reply to each question.",
          items: [
            {
              type: "radio",
              label: "\"How long have you had your winter jacket?\"",
              options: [
                { value: "a", label: "I had this jacket for two winters ago." },
                { value: "b", label: "I have had this jacket for two winters." },
                { value: "c", label: "I have had this jacket two winters ago." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Look at Yesenia's form. Kevin asks: \"How long has Yesenia worked at the hotel?\"",
              options: [
                { value: "a", label: "She has worked there since two years." },
                { value: "b", label: "She has worked there for 2024." },
                { value: "c", label: "She has worked there for two years." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "hlfs-s3-ex2",
          title: "Build the question",
          instructions: "Unscramble to make a correct 'How long' question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "long", "have", "you", "had", "this", "phone", "plan"],
              correctAnswer: "How long have you had this phone plan",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "long", "has", "she", "worked", "at", "the", "hotel"],
              correctAnswer: "How long has she worked at the hotel",
            },
          ],
        },
        {
          id: "hlfs-s3-ex3",
          title: "Write the missing verb",
          instructions: "Fill in the blank with the correct form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "How long ___ you ___ (have) that job?",
              expectedAnswers: ["have had"],
            },
            {
              type: "text",
              label: "Look at the form. Yesenia ___ (have) the same phone company since 2023.",
              expectedAnswers: ["has had"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. For and Since on the Timeline
    // =========================================================================
    {
      id: "for-and-since-on-the-timeline",
      stepNumber: 4,
      title: "For and Since on the Timeline",
      icon: "📅",
      tenseDiagram: {
        title: "Duration (present perfect) vs. finished action (past simple)",
        elements: [
          {
            id: "pp-duration",
            type: "arc",
            zone: "past",
            position: 25,
            verbLabel: "has worked (still true now)",
          },
          {
            id: "past-simple-dot",
            type: "single-dot",
            zone: "past",
            position: 72,
            verbLabel: "worked (finished)",
          },
        ],
      },
      explanation: `
        <p style="margin: 0 0 1rem 0; font-size: 1rem">Some things are finished. Some things are still true now. Read about Luis von Ahn. Which verbs are finished? Which verbs are still true now?</p>

        ${readingCard({
          kicker: "Real person",
          title: "Luis von Ahn",
          photo: {
            url: "/images/guide-people/luis-von-ahn.jpg",
            alt: "Luis von Ahn giving a talk",
            credit: "Jarek Tuszyński, 2015, CC BY 4.0",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Wikimania_2015_-_Luis_von_Ahn_-_1.JPG",
          },
          accent: "sage",
          paragraphs: [
            "Luis von Ahn <strong>was</strong> born in Guatemala City, Guatemala. He <strong>came</strong> to the United States at 18 to study math at Duke University. He <strong>finished</strong> his degree in 2000. In 2009, he <strong>sold</strong> a website security tool called reCAPTCHA to Google.",
            "In 2011, he and Severin Hacker <strong>started</strong> Duolingo, an app for learning languages. Von Ahn <strong>has worked</strong> on Duolingo <strong>since</strong> then, and he is still its CEO today.",
          ],
          sources: [
            { name: "Carnegie Corporation of New York", url: "https://carnegie.org/great-immigrants/luis-von-ahn/" },
            { name: "National Inventors Hall of Fame", url: "https://www.invent.org/inductees/luis-von-ahn" },
            { name: "Lemelson-MIT", url: "https://lemelson.mit.edu/resources/luis-von-ahn" },
          ],
        })}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Present Perfect + For / Since</div>
            <div style="font-size: 0.95rem; margin-bottom: 0.4rem"><strong>I have worked here for two years.</strong></div>
            <div style="font-size: 0.88rem; opacity: 0.85">Started in the past. Still true NOW.</div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Past Simple</div>
            <div style="font-size: 0.95rem; margin-bottom: 0.4rem"><strong>I took a day off last month.</strong></div>
            <div style="font-size: 0.88rem; opacity: 0.85">Finished. Done. A specific time in the past.</div>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(106,141,115,0.08); border-left: 3px solid #6a8d73; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.93rem"><strong>Key question to ask yourself:</strong> Is this situation still true NOW? Use present perfect + for/since. Is it finished? Use past simple.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("still true now", "sage")}
            <span><em>Her family <strong>has had</strong> the same apartment <strong>for</strong> five years.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>They <strong>moved</strong> into that apartment in 2021.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("still true now", "sage")}
            <span><em>He <strong>has known</strong> the manager <strong>since</strong> he started.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("finished", "terracotta")}
            <span><em>He <strong>met</strong> the manager on his first day.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "hlfs-s4-ex1",
          title: "Still true now or finished?",
          instructions: "Choose the correct tense for each sentence.",
          items: [
            {
              type: "radio",
              label: "Read about Luis von Ahn. In 2009, he ___ reCAPTCHA to Google.",
              options: [
                { value: "sold", label: "sold" },
                { value: "has sold", label: "has sold" },
              ],
              expectedAnswer: "sold",
            },
            {
              type: "radio",
              label: "Read about Luis von Ahn. He ___ on Duolingo since 2011. (He still works on it.)",
              options: [
                { value: "worked", label: "worked" },
                { value: "has worked", label: "has worked" },
              ],
              expectedAnswer: "has worked",
            },
            {
              type: "radio",
              label: "Yesenia ___ at the hotel for two years. (She still works there.)",
              options: [
                { value: "worked", label: "worked" },
                { value: "has worked", label: "has worked" },
              ],
              expectedAnswer: "has worked",
            },
          ],
        },
        {
          id: "hlfs-s4-ex2",
          title: "Error correction",
          instructions: "One sentence uses the wrong tense. Choose the correct version.",
          items: [
            {
              type: "radio",
              label: "\"I have worked here for two years ago.\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "I worked here two years ago. (finished action needs past simple)" },
                { value: "c", label: "I have worked here for two years. (no 'ago' with present perfect)" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "hlfs-s4-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "Claudette ___ (work) at the hotel for five years. She still works there.",
              expectedAnswers: ["has worked"],
            },
            {
              type: "text",
              label: "Read about Luis von Ahn. He ___ (finish) his degree at Duke in 2000.",
              expectedAnswers: ["finished"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5. Real Practice: Lease, Job, and Family
    // =========================================================================
    {
      id: "real-practice-lease-job-holiday",
      stepNumber: 5,
      title: "Real Practice: Lease, Job, and Family",
      icon: "🏠",
      explanation: `
        ${sceneCard("sceneHolidayDinner", "Yesenia's apartment, East Boston. Sunday dinner, three weeks later.", "terracotta")}

        <p style="margin: 0 0 1rem 0; font-size: 1rem">Yesenia is saving money with her cheaper phone plan. She found an apartment nearby, and the new landlord sent a rental application. On Sunday, Yesenia, her mother Lupe, and her little brother Mateo sit down to dinner. After dinner, Yesenia and Lupe fill out the form.</p>

        ${dialogue([
          { speaker: "Yesenia", avatar: "👩🏽", text: "Mami, this rental application asks how long we <strong>have lived</strong> here. Five years, right?", side: "right", tone: "terracotta" },
          { speaker: "Lupe", avatar: "👩🏾", text: "Yes, we <strong>have lived</strong> here <strong>for</strong> five years. <strong>Since</strong> Mateo was in kindergarten.", side: "left", tone: "sage" },
          { speaker: "Yesenia", avatar: "👩🏽", text: "Our lease ends in March, and everything nearby costs more.", side: "right", tone: "terracotta" },
          { speaker: "Lupe", avatar: "👩🏾", text: "Mateo <strong>has gone</strong> to that school <strong>since</strong> kindergarten. I don't want to change his school.", side: "left", tone: "sage" },
          { speaker: "Yesenia", avatar: "👩🏽", text: "Neither do I. This apartment is close to his school. I <strong>have been</strong> looking at apartments nearby <strong>for</strong> weeks.", side: "right", tone: "terracotta" },
        ])}

        <div style="padding: 0.85rem 1rem; background: rgba(176,87,64,0.06); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.3rem 0; font-weight: 700">Common real-life situations that use for and since:</p>
          <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.8; font-size: 0.95rem">
            <li>I <strong>have lived</strong> here <strong>for</strong> five years.</li>
            <li>I <strong>have worked</strong> this shift <strong>since</strong> October.</li>
            <li>She <strong>has had</strong> the same phone company <strong>for</strong> three years.</li>
            <li>We <strong>have known</strong> our landlord <strong>since</strong> we moved in.</li>
            <li>How long <strong>has</strong> it <strong>been</strong> since you saw your family?</li>
          </ul>
        </div>
      `,
      exercises: [
        {
          id: "hlfs-s5-ex1",
          title: "For or Since?",
          instructions: "Choose the correct word to complete each sentence.",
          items: [
            {
              type: "radio",
              label: "Yesenia's family has lived in the apartment ___ five years.",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "for",
            },
            {
              type: "radio",
              label: "Yesenia has had the same phone company ___ 2023. (She wrote it on her move-out form.)",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "since",
            },
            {
              type: "radio",
              label: "Yesenia's brother Mateo has gone to the same school ___ kindergarten.",
              options: [
                { value: "for", label: "for" },
                { value: "since", label: "since" },
              ],
              expectedAnswer: "since",
            },
          ],
        },
        {
          id: "hlfs-s5-ex2",
          title: "Build the sentence",
          instructions: "Unscramble to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["We", "have", "lived", "in", "this", "apartment", "for", "five", "years"],
              correctAnswer: "We have lived in this apartment for five years",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "long", "has", "it", "been", "since", "you", "called", "your", "brother"],
              correctAnswer: "How long has it been since you called your brother",
            },
          ],
        },
        {
          id: "hlfs-s5-ex3",
          title: "Error correction",
          instructions: "Find the mistake and choose the correct sentence.",
          items: [
            {
              type: "radio",
              label: "\"She has lived here since five years.\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "She has lived here for five years. ('five years' is a length, not a starting point)" },
                { value: "c", label: "She lived here for five years." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I have worked here for 2021.\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "I have worked here since 2021. ('2021' is a starting point, not a length)" },
                { value: "c", label: "I worked here since 2021." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "hlfs-s5-ex4",
          title: "Fill in the blank",
          instructions: "Write the correct form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "Yesenia ___ (work) in the hotel laundry for two years.",
              expectedAnswers: ["has worked"],
            },
            {
              type: "text",
              label: "How long ___ they ___ (know) their landlord?",
              expectedAnswers: ["have known"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation of all present perfect uses, open the <a href=\"/grammar-reader/present-perfect\" style=\"font-weight:700;text-decoration:underline\">Present Perfect Full Guide</a>.",
      },
    },
  ],

  // ===========================================================================
  // MINI QUIZ. 10 questions
  // ===========================================================================
  miniQuiz: [
    {
      id: "hlfs-q2",
      question: "Yesenia chose her phone company three years ago, in 2023. She wants to say how long she has had it, using 'for'. What does she say?",
      options: [
        { value: "a", label: "I have had this company for since three years." },
        { value: "b", label: "I have had this company for three years." },
        { value: "c", label: "I have had this company for 2023." },
      ],
      correctAnswer: "b",
      explanation: "'For' takes a length of time (three years), not a starting year (2023).",
      topic: "for-vs-since",
      skill: "usage",
      skillTag: "for-length-of-time",
      difficulty: "easy",
    },
    {
      id: "hlfs-q3",
      question: "Yesenia's friend asks about her apartment. Choose the correct for/since sentence.",
      options: [
        { value: "a", label: "She has lived here since five years." },
        { value: "b", label: "She has lived here for 2021." },
        { value: "c", label: "She has lived here since 2021." },
      ],
      correctAnswer: "c",
      explanation: "'Since' goes with a starting point like a year or date. 'For' goes with a length of time like 'four years'.",
      topic: "for-vs-since",
      skill: "error-detection",
      skillTag: "for-vs-since-swap-error",
      difficulty: "easy",
    },
    {
      id: "hlfs-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"I have lived here ___ 2020.\" (Which word shows a starting point in time?)",
      correctAnswer: "since",
      explanation: "'Since' goes with a specific starting point (a year, a date, a moment). 'For' goes with a length of time.",
      topic: "for-vs-since",
      skill: "usage",
      skillTag: "for-vs-since-swap-error",
      difficulty: "easy",
    },
    {
      id: "hlfs-qws1",
      type: "word-scramble" as const,
      question: "Your neighbor asks how long you have lived in East Boston. Put the words in order.",
      words: ["How", "long", "have", "you", "lived", "here"],
      correctAnswer: "How long have you lived here",
      hint: "How long + have/has + subject + past participle",
      explanation: "For ongoing duration questions, use 'How long have/has + subject + past participle?'",
      topic: "how-long-question-form",
      skill: "usage",
      skillTag: "how-long-have-you-had",
      difficulty: "medium",
    },
    {
      id: "hlfs-q7",
      question: "Luis von Ahn sold reCAPTCHA to Google in 2009. He does not own reCAPTCHA now. Which sentence is correct?",
      options: [
        { value: "a", label: "He has sold reCAPTCHA since 2009." },
        { value: "b", label: "He has sold reCAPTCHA for 2009." },
        { value: "c", label: "He sold reCAPTCHA to Google in 2009." },
      ],
      correctAnswer: "c",
      explanation: "A finished action with a specific past time (2009) needs past simple, not present perfect.",
      topic: "present-perfect-vs-past-simple",
      skill: "usage",
      skillTag: "finished-action-past-simple",
      difficulty: "medium",
    },
  ],
};
