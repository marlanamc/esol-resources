import type { InteractiveGuideContent } from "@/types/activity";
import { secondConditionalWhatWouldYouDoImages as img } from "@/data/second-conditional-what-would-you-do-images.generated";

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

export const secondConditionalWhatWouldYouDoContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — What If? Imagining Something Different
    // =========================================================================
    {
      id: "what-if-imagining",
      title: "What If? Imagining Something Different",
      tenseDiagram: {
        title: "The second conditional: not the past, not the future",
        elements: [
          { id: "sc-if-clause", type: "single-dot", zone: "past", position: 35, verbLabel: "if + past simple (imaginary)" },
          { id: "sc-would", type: "single-dot", zone: "future", position: 65, verbLabel: "would + verb (imaginary result)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneRestaurant", "East Boston restaurant kitchen. Thursday night, end of shift.", "terracotta")}

        ${dialogue([
          { speaker: "Carmen", avatar: "👩🏽", text: "My manager just told me I'm working Sundays now. Every Sunday.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "That's bad. What would you do if you could say no?", side: "left", tone: "sage" },
          { speaker: "Carmen", avatar: "👩🏽", text: "If I <strong>had</strong> more options, I <strong>would look</strong> for a different job. But right now I need this one.", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "I know. If the pay <strong>were</strong> better, I <strong>wouldn't work</strong> two jobs either.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Second conditional</strong> = an imaginary situation and its result. The situation is unlikely or not real right now.</p>
        </div>

        <p style="margin: 0.75rem 0">Carmen does not have many options right now. She is imagining a different situation that is not real. That is the second conditional.</p>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("not real now", "amber")}
            <span><em>If I <strong>had</strong> more options, I <strong>would look</strong> for a different job.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("not real now", "amber")}
            <span><em>If the pay <strong>were</strong> better, I <strong>wouldn't work</strong> two jobs.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("formula", "terracotta")}
            <span><strong>If + past simple, would + base verb</strong></span>
          </div>
        </div>

        <p style="margin: 0.75rem 0; font-size: 0.95rem; color: #555">The verb after <em>if</em> looks like past tense, but it does not talk about the past. It shows the situation is imaginary.</p>
      `,
      exercises: [
        {
          id: "what-if-ex1",
          title: "Real or imaginary?",
          instructions: "Is each sentence a real plan or an imaginary situation?",
          items: [
            {
              type: "radio",
              label: "\"If I <strong>had</strong> a car, I <strong>would take</strong> the early shift.\" (Carmen doesn't have a car.)",
              options: [
                { value: "real", label: "Real plan" },
                { value: "imaginary", label: "Imaginary situation" },
              ],
              expectedAnswer: "imaginary",
            },
            {
              type: "radio",
              label: "\"If the bus <strong>arrives</strong> on time, I <strong>will clock in</strong> before 7.\" (The bus usually comes.)",
              options: [
                { value: "real", label: "Real plan" },
                { value: "imaginary", label: "Imaginary situation" },
              ],
              expectedAnswer: "real",
            },
            {
              type: "radio",
              label: "\"If I <strong>worked</strong> days, I <strong>would see</strong> my kids after school.\" (She works nights.)",
              options: [
                { value: "real", label: "Real plan" },
                { value: "imaginary", label: "Imaginary situation" },
              ],
              expectedAnswer: "imaginary",
            },
          ],
        },
        {
          id: "what-if-ex2",
          title: "Complete the sentence",
          instructions: "Fill in the blank with the correct form.",
          items: [
            {
              type: "text",
              label: "If Carmen ___ (have) Sundays off, she would go to her sister's house.",
              expectedAnswers: ["had"],
            },
            {
              type: "text",
              label: "If the manager ___ (listen), the whole team would be happier.",
              expectedAnswers: ["listened"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Building the Sentence
    // =========================================================================
    {
      id: "building-the-sentence",
      title: "Building the Sentence",
      tenseDiagram: {
        title: "Past simple in the if-clause does not mean past time",
        elements: [
          { id: "sc2-if", type: "single-dot", zone: "past", position: 30, verbLabel: "if + past simple" },
          { id: "sc2-would", type: "single-dot", zone: "future", position: 70, verbLabel: "would + base verb" },
        ],
      },
      explanation: `
        ${sceneCard("sceneWarehouse", "Chelsea Street warehouse break room. Friday morning.", "sage")}

        ${dialogue([
          { speaker: "Ramon", avatar: "👨🏾", text: "If my schedule <strong>changed</strong> to nights, I <strong>would need</strong> a different babysitter.", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "👨🏻", text: "What would you do if they moved you to a different site?", side: "left", tone: "sage" },
          { speaker: "Ramon", avatar: "👨🏾", text: "If the new site <strong>were</strong> far, I <strong>wouldn't take</strong> it. Two buses is too much.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Structure:</strong> <em>If</em> + past simple (if-clause) + comma + <em>would</em> + base verb (main clause). You can also put the main clause first: <em>I would need a babysitter if my schedule changed.</em> No comma needed when <em>if</em> comes second.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("if-clause first", "terracotta")}
            <span><em>If I <strong>had</strong> a car, I <strong>would start</strong> at 6 AM.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("main clause first", "sage")}
            <span><em>I <strong>would start</strong> at 6 AM if I <strong>had</strong> a car.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "blue")}
            <span><em>If I <strong>had</strong> options, I <strong>wouldn't take</strong> this shift.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("question", "amber")}
            <span><em>What <strong>would</strong> you do if your schedule <strong>changed</strong>?</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "building-ex1",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble to make a second conditional sentence:",
              words: ["If", "I", "had", "a", "car,", "I", "would", "take", "the", "early", "shift"],
              correctAnswer: "If I had a car, I would take the early shift",
            },
          ],
        },
        {
          id: "building-ex2",
          title: "Complete the sentence",
          instructions: "Fill in the blank with the correct form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "If Ramon ___ (work) days, he would see his kids more.",
              expectedAnswers: ["worked"],
            },
            {
              type: "text",
              label: "If the company ___ (pay) more, Scott would stay.",
              expectedAnswers: ["paid"],
            },
          ],
        },
        {
          id: "building-ex3",
          title: "Spot the error",
          instructions: "One sentence has an error in the if-clause. Which one?",
          items: [
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "If I had more time, I would study English every day." },
                { value: "b", label: "If I will have more time, I would study English every day." },
                { value: "c", label: "I would study English every day if I had more time." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — What Would You Do? Advice at Work
    // =========================================================================
    {
      id: "advice-at-work",
      title: "What Would You Do? Advice at Work",
      explanation: `
        ${sceneCard("sceneAgency", "Home health agency, East Boston. Monday afternoon.", "blue")}

        ${dialogue([
          { speaker: "Beatriz", avatar: "👩🏻", text: "My coworker didn't show up again. The client is alone. What would you do?", side: "right", tone: "terracotta" },
          { speaker: "Nadine", avatar: "👩🏿", text: "If I <strong>were</strong> you, I <strong>would call</strong> the agency right now, not wait.", side: "left", tone: "sage" },
          { speaker: "Beatriz", avatar: "👩🏻", text: "And if they <strong>cut</strong> my hours because I called?", side: "right", tone: "terracotta" },
          { speaker: "Nadine", avatar: "👩🏿", text: "If they <strong>did</strong> that, I <strong>would talk</strong> to the supervisor and write it down.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>"If I were you..."</strong> is the most common way to give advice in English. Use <em>were</em> (not <em>was</em>) in formal and standard written English for all subjects in the if-clause when the situation is imaginary.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("advice", "blue")}
            <span><em>If I <strong>were</strong> you, I <strong>would call</strong> the agency.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("advice", "blue")}
            <span><em>If I <strong>were</strong> the manager, I <strong>would fix</strong> the schedule.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("advice", "blue")}
            <span><em>If I <strong>were</strong> in your position, I <strong>wouldn't sign</strong> that form.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "advice-ex1",
          title: "Spot the error",
          instructions: "One sentence has an error. Choose the corrected version.",
          items: [
            {
              type: "radio",
              label: "\"If I <strong>am</strong> you, I would call the agency.\"",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "were", label: "Not correct. Should be: If I were you, I would call the agency." },
                { value: "was", label: "Not correct. Should be: If I was you, I would call the agency." },
              ],
              expectedAnswer: "were",
            },
            {
              type: "radio",
              label: "\"If I <strong>were</strong> the supervisor, I <strong>would change</strong> the policy.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'was'" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "advice-ex2",
          title: "Give advice",
          instructions: "Fill in the blank to complete the advice.",
          items: [
            {
              type: "text",
              label: "If I ___ you, I would ask for that in writing.",
              expectedAnswers: ["were"],
            },
            {
              type: "text",
              label: "If I were you, I ___ (not sign) that form without reading it.",
              expectedAnswers: ["wouldn't sign", "would not sign"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Real vs. Imaginary: First vs. Second Conditional
    // =========================================================================
    {
      id: "real-vs-imaginary",
      title: "Real vs. Imaginary: First vs. Second Conditional",
      tenseDiagram: {
        title: "First conditional (real) vs. second conditional (imaginary)",
        elements: [
          { id: "first-cond", type: "single-dot", zone: "future", position: 60, verbLabel: "First: will (real future)" },
          { id: "second-cond", type: "single-dot", zone: "past", position: 30, verbLabel: "Second: would (imaginary)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneHotel", "Hotel housekeeping, East Boston. Saturday morning.", "amber")}

        ${dialogue([
          { speaker: "Kevin", avatar: "👨🏽", text: "If there's overtime on Saturday, I'll take it. I need the money.", side: "right", tone: "terracotta" },
          { speaker: "Sofia", avatar: "👩🏼", text: "I wish I could. If I <strong>didn't have</strong> my son's birthday, I <strong>would take</strong> it too.", side: "left", tone: "sage" },
          { speaker: "Kevin", avatar: "👨🏽", text: "If they <strong>offered</strong> Sunday instead, <strong>would</strong> you <strong>do</strong> it?", side: "right", tone: "terracotta" },
          { speaker: "Sofia", avatar: "👩🏼", text: "Maybe. If the pay <strong>were</strong> double, I definitely <strong>would</strong>.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>First conditional:</strong> If + present simple, will + base verb. The situation is real and possible.<br/>
            <strong>Second conditional:</strong> If + past simple, would + base verb. The situation is imaginary or unlikely.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("first (real)", "sage")}
            <span><em>If there <strong>is</strong> overtime, I <strong>will take</strong> it.</em> (Overtime is possible.)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("second (imaginary)", "amber")}
            <span><em>If I <strong>didn't have</strong> the birthday, I <strong>would take</strong> it.</em> (She does have it.)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "real-vs-ex1",
          title: "First or second conditional?",
          instructions: "Choose the correct form based on whether the situation is real or imaginary.",
          items: [
            {
              type: "radio",
              label: "Kevin always picks up extra shifts. \"If they ___ me overtime next week, I'll say yes.\"",
              options: [
                { value: "offer", label: "offer (first conditional, real possibility)" },
                { value: "offered", label: "offered (second conditional, imaginary)" },
              ],
              expectedAnswer: "offer",
            },
            {
              type: "radio",
              label: "Sofia can't change her son's birthday. \"If I ___ free on Saturday, I would come in.\"",
              options: [
                { value: "am", label: "am (first conditional, real possibility)" },
                { value: "were", label: "were (second conditional, imaginary)" },
              ],
              expectedAnswer: "were",
            },
            {
              type: "radio",
              label: "\"If the manager <strong>calls</strong> before noon, I <strong>would go in</strong> early.\" Is this sentence correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Mixing tenses: should be 'calls...will go' or 'called...would go'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "real-vs-ex2",
          title: "Complete the sentence",
          instructions: "Fill in the blank with will or would.",
          items: [
            {
              type: "text",
              label: "If Sofia finishes by 3, she ___ pick up her son on time. (real plan)",
              expectedAnswers: ["will"],
            },
            {
              type: "text",
              label: "If Kevin had a second job, he ___ save faster. (imaginary)",
              expectedAnswers: ["would"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — At Work: What Would Change?
    // =========================================================================
    {
      id: "what-would-change",
      title: "At Work: What Would Change?",
      explanation: `
        ${sceneCard("sceneOffice", "Office cleaning company break room. Late at night.", "terracotta")}

        ${dialogue([
          { speaker: "Milagros", avatar: "👩🏾", text: "If they <strong>promoted</strong> me to team lead, I <strong>would train</strong> the new people better.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "What else would you change if you were in charge?", side: "left", tone: "sage" },
          { speaker: "Milagros", avatar: "👩🏾", text: "If we <strong>had</strong> the same schedule every week, people <strong>wouldn't quit</strong> so fast.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "I hear that. If they <strong>paid</strong> everyone the same for the same work, I <strong>wouldn't need</strong> two jobs.", side: "left", tone: "sage" },
        ])}

        <p style="margin: 0.75rem 0">Women's History Month: in March, workers across the country talk about equal pay. Jennifer's line above is something many workers think about.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use longer if-clauses to talk about bigger changes: <em>If the whole system were different...</em> Use the second conditional any time you imagine a situation that is not real right now.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("longer if-clause", "terracotta")}
            <span><em>If I <strong>had</strong> a steady schedule and better pay, I <strong>would stay</strong> at this company.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("different subject", "sage")}
            <span><em>If the company <strong>offered</strong> health insurance, more people <strong>would apply</strong>.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "change-ex1",
          title: "What would Milagros do?",
          instructions: "Choose the answer that fits the second conditional correctly.",
          items: [
            {
              type: "radio",
              label: "Milagros does not have a promotion right now. \"If the company ___ me team lead, I would train new workers.\"",
              options: [
                { value: "promotes", label: "promotes" },
                { value: "promoted", label: "promoted" },
                { value: "will promote", label: "will promote" },
              ],
              expectedAnswer: "promoted",
            },
            {
              type: "radio",
              label: "\"If they <strong>pay</strong> everyone the same, I <strong>wouldn't need</strong> two jobs.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'paid' to match 'wouldn't need'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "change-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble to make a second conditional sentence:",
              words: ["If", "the", "schedule", "were", "the", "same", "every", "week,", "fewer", "people", "would", "quit"],
              correctAnswer: "If the schedule were the same every week, fewer people would quit",
            },
          ],
        },
        {
          id: "change-ex3",
          title: "Fill in the blank",
          instructions: "Write the correct form of the verb.",
          items: [
            {
              type: "text",
              label: "If Jennifer ___ (have) one job, she would sleep more than five hours.",
              expectedAnswers: ["had"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, all four conditionals side by side, and extra practice, open the <a href=\"/grammar-reader/conditionals-second-third\" style=\"font-weight:700;text-decoration:underline\">Second and Third Conditionals Full Guide</a>.",
      },
    },
  ],

  // ===========================================================================
  // MINI QUIZ
  // ===========================================================================
  miniQuiz: [
    {
      id: "sc-q1",
      question: "Ramon doesn't have a car. Which sentence is correct?",
      options: [
        { value: "a", label: "If I have a car, I will take the early shift." },
        { value: "b", label: "If I had a car, I would take the early shift." },
        { value: "c", label: "If I had a car, I will take the early shift." },
      ],
      correctAnswer: "b",
      explanation: "Second conditional uses 'if + past simple, would + base verb' for imaginary situations.",
      topic: "second-conditional",
      skill: "usage",
      skillTag: "form-if-past-would",
      difficulty: "easy",
    },
    {
      id: "sc-q4",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "If I had more options, I would look for a different job." },
        { value: "b", label: "If I will have more options, I would look for a different job." },
        { value: "c", label: "I would look for a different job if I had more options." },
      ],
      correctAnswer: "b",
      explanation: "Never use 'will' in the if-clause of a second conditional. Use the past simple form.",
      topic: "second-conditional",
      skill: "error-detection",
      skillTag: "error-will-in-if-clause",
      difficulty: "easy",
    },
    {
      id: "sc-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"If I ___ you, I would call the agency.\" (Giving advice — use 'were' for all subjects.)",
      correctAnswer: "were",
      explanation: "In 'If I were you,' use 'were' for all subjects in the second conditional if-clause, not 'was' or 'am'.",
      topic: "second-conditional",
      skill: "usage",
      skillTag: "were-advice-pattern",
      difficulty: "medium",
    },
    {
      id: "sc-q5",
      question: "Kevin is likely to get overtime next week. Which sentence fits?",
      options: [
        { value: "a", label: "If they offered me overtime, I would say yes." },
        { value: "b", label: "If they offer me overtime, I will say yes." },
        { value: "c", label: "If they offered me overtime, I will say yes." },
      ],
      correctAnswer: "b",
      explanation: "A real, likely future situation uses the first conditional: 'if + present simple, will + base verb'.",
      topic: "second-conditional",
      skill: "usage",
      skillTag: "contrast-first-vs-second",
      difficulty: "medium",
    },
    {
      id: "sc-qws1",
      type: "word-scramble" as const,
      question: "Put the words in the right order to make a second conditional sentence.",
      words: ["She", "would", "say", "yes", "if", "she", "could"],
      correctAnswer: "She would say yes if she could",
      hint: "would + base verb … if + past simple",
      explanation: "Second conditional: would + base verb in the main clause; past simple in the if-clause.",
      topic: "second-conditional",
      skill: "usage",
      skillTag: "form-if-past-would",
      difficulty: "medium",
    },
  ],
};
