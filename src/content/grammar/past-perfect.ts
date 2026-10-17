import type { InteractiveGuideContent } from "@/types/activity";
import { pastPerfectImages as img } from "@/data/past-perfect-images.generated";
import { checklist, readingCard, timeline } from "@/content/grammar/_shared/guide-visuals";

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

export const pastPerfectContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — She Had Already Done the Work
    // =========================================================================
    {
      id: "she-had-already-done-it",
      title: "She Had Already Done the Work",
      tenseDiagram: {
        title: "Where Past Perfect lives on the timeline",
        elements: [
          { id: "pp-first", type: "arc", zone: "past-earlier", position: 30, verbLabel: "Past Perfect (1st)" },
          { id: "ps-second", type: "single-dot", zone: "past-later", position: 70, verbLabel: "Past Simple (2nd)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneWarehouse", "East Boston. A warehouse off Chelsea Street. Wednesday morning.", "amber")}

        ${dialogue([
          { speaker: "Gloria", avatar: "👩🏽", text: "I'm nervous. I've never applied to a warehouse before.", side: "right", tone: "terracotta" },
          { speaker: "Receptionist", avatar: "🧑🏻", text: "Don't worry. The manager said you already have good experience.", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏽", text: "That’s true. Before I applied, I <strong>had worked</strong> in housekeeping for two years. I just hope that’s enough.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Past Perfect</strong> = something that finished <em>before</em> another past moment. Use it to show which action happened first when telling a story about the past.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("1st action", "amber")}
            <span><em>She <strong>had worked</strong> in housekeeping for two years.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("2nd action", "sage")}
            <span><em>She <strong>applied</strong> for the warehouse job.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("together", "terracotta")}
            <span><em>By the time she <strong>applied</strong>, she <strong>had already worked</strong> two years in housekeeping.</em></span>
          </div>
        </div>

        <p style="margin-top: 1rem">The first action (working in housekeeping) uses <strong>had + past participle</strong>. The second action (applied) uses Past Simple. You almost always need <em>both</em> verbs to make the sequence clear.</p>
      `,
      exercises: [
        {
          id: "pp-s1-ex1",
          title: "Which happened first?",
          instructions: "Read each sentence. Which action happened first?",
          items: [
            {
              type: "radio",
              label: "By the time Gloria walked in, the manager had already called her references.",
              options: [
                { value: "a", label: "She walked into the warehouse" },
                { value: "b", label: "The manager called her references" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "When the manager called her, she had already sent her application.",
              options: [
                { value: "a", label: "She sent her application" },
                { value: "b", label: "The manager called her" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "pp-s1-ex2",
          title: "Complete the sentence",
          instructions: "Fill in the blank with the correct Past Perfect form (had + past participle).",
          items: [
            {
              type: "text",
              label: "By the time she got the interview, she ___ (work) at the hotel for two years.",
              expectedAnswers: ["had worked"],
            },
            {
              type: "text",
              label: "When the manager came out, Gloria ___ (already arrive) at the front desk.",
              expectedAnswers: ["had already arrived"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — had + V3: Putting It in Order
    // =========================================================================
    {
      id: "had-plus-v3-form",
      title: "had + V3: Putting It in Order",
      explanation: `
        <p>It is Wednesday morning in East Boston. Gloria sits in the warehouse break room before her interview and checks her list. A green check means she <strong>had done</strong> it before today.</p>

        ${checklist({
          kicker: "Before the interview",
          title: "Gloria's application checklist",
          items: [
            { text: "Gloria <strong>had cleaned</strong> hotel rooms for two years.", done: true },
            { text: "She <strong>had handled</strong> supply orders at the hotel.", done: true },
            { text: "She <strong>had sent</strong> her application online.", done: true },
            { text: "She <strong>hadn't driven</strong> a forklift.", done: false },
            { text: "She <strong>hadn't worked</strong> in a warehouse.", done: false },
          ],
        })}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Positive:</strong> subject + <strong>had</strong> + past participle<br>
            <strong>Negative:</strong> subject + <strong>hadn't</strong> + past participle<br>
            Every person uses <em>had</em>. There is no "hads" or "has had."
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("positive", "sage")}
            <span><em>She <strong>had cleaned</strong> hotel rooms for two years before she applied here.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "terracotta")}
            <span><em>Gloria <strong>hadn't driven</strong> a forklift before the training.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "terracotta")}
            <span><em>They <strong>hadn't finished</strong> loading the truck when the manager arrived.</em></span>
          </div>
        </div>

        <div style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <strong>Common irregular past participles to know:</strong>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem">
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">go → gone</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">see → seen</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">do → done</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">take → taken</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">have → had</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">leave → left</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">work → worked</span>
            <span style="background: rgba(106,141,115,0.12); padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.9rem">save → saved</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "pp-s2-ex1",
          title: "Correct or not correct?",
          instructions: "Is the Past Perfect form correct?",
          items: [
            {
              type: "radio",
              label: "\"Before the shift, she had ate her lunch.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: had eaten" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"He hadn't worked in a warehouse before this job.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "Look at Gloria's checklist. Which sentence is true?",
              options: [
                { value: "a", label: "Before the interview, she had sent her application, but she hadn't worked in a warehouse." },
                { value: "b", label: "Before the interview, she hadn't sent her application." },
                { value: "c", label: "Before the interview, she had driven a forklift." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "pp-s2-ex2",
          title: "Build the sentence",
          instructions: "Fill in the blank with the correct form: positive (had + V3) or negative (hadn't + V3).",
          items: [
            {
              type: "text",
              label: "Before the safety training, Gloria ___ (never use) a pallet jack.",
              expectedAnswers: ["had never used", "hadn't used"],
            },
            {
              type: "text",
              label: "Before the interview, Gloria ___ (send) her application online.",
              expectedAnswers: ["had sent"],
            },
          ],
        },
        {
          id: "pp-s2-ex3",
          title: "Put the words in order",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "had", "saved", "enough", "before", "she", "applied"],
              correctAnswer: "She had saved enough before she applied",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — When, Before, After, By the Time
    // =========================================================================
    {
      id: "signal-words",
      title: "When, Before, After, By the Time",
      explanation: `
        ${sceneCard("sceneInterview", "HR office. Jennifer, the hiring manager, interviews Gloria.", "blue")}

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩‍💼", text: "Had you ever done inventory work before you applied here?", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏽", text: "Yes. After I <strong>had finished</strong> my shift at the hotel, I <strong>helped</strong> count stock.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩‍💼", text: "And by the time you left that job, had you trained anyone?", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏽", text: "I <strong>had trained</strong> two new cleaners before I left.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩‍💼", text: "That's great experience. We'd like to offer you the job. Can you start Monday?", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Four words help you show which action came first. Learn them and you can use Past Perfect naturally.</p>
        </div>

        <div style="display: grid; gap: 0.75rem; margin: 1rem 0">
          <div style="padding: 0.75rem 1rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; border-left: 3px solid #b05740">
            ${labelPill("when", "terracotta")}
            <p style="margin: 0.4rem 0 0 0"><em>When she <strong>arrived</strong>, the manager <strong>had already called</strong> her references.</em><br><span style="font-size: 0.85rem; opacity: 0.7">When + Past Simple shows the second action. Past Perfect shows what finished first.</span></p>
          </div>
          <div style="padding: 0.75rem 1rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; border-left: 3px solid #b05740">
            ${labelPill("before", "terracotta")}
            <p style="margin: 0.4rem 0 0 0"><em>She <strong>had trained</strong> two people before she <strong>left</strong>.</em><br><span style="font-size: 0.85rem; opacity: 0.7">Past Perfect + before + Past Simple.</span></p>
          </div>
          <div style="padding: 0.75rem 1rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; border-left: 3px solid #b05740">
            ${labelPill("after", "terracotta")}
            <p style="margin: 0.4rem 0 0 0"><em>After she <strong>had finished</strong> her shift, she <strong>helped</strong> count stock.</em><br><span style="font-size: 0.85rem; opacity: 0.7">After + Past Perfect, Past Simple.</span></p>
          </div>
          <div style="padding: 0.75rem 1rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; border-left: 3px solid #b05740">
            ${labelPill("by the time", "amber")}
            <p style="margin: 0.4rem 0 0 0"><em>By the time she <strong>applied</strong>, she <strong>had worked</strong> there for two years.</em><br><span style="font-size: 0.85rem; opacity: 0.7">By the time + Past Simple, Past Perfect for the earlier action.</span></p>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "pp-s3-ex1",
          title: "Choose the correct signal word",
          instructions: "Pick the word that fits the sentence naturally.",
          items: [
            {
              type: "radio",
              label: "___ the interviewer asked about her references, Gloria had already sent them.",
              options: [
                { value: "a", label: "By the time" },
                { value: "b", label: "After" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "___ she had finished the paperwork, Jennifer shook her hand.",
              options: [
                { value: "a", label: "After" },
                { value: "b", label: "By the time" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "pp-s3-ex2",
          title: "Complete the sentence",
          instructions: "Fill in the blank with the correct Past Perfect form.",
          items: [
            {
              type: "text",
              label: "When Jennifer asked for her references, Gloria ___ (already send) them by email.",
              expectedAnswers: ["had already sent"],
            },
            {
              type: "text",
              label: "Before she walked into the interview, she ___ (practice) her answers with a friend.",
              expectedAnswers: ["had practiced"],
            },
          ],
        },
        {
          id: "pp-s3-ex3",
          title: "Put the words in order",
          instructions: "Unscramble to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["By", "the", "time", "she", "left", "the", "hotel", "she", "had", "trained", "two", "people"],
              correctAnswer: "By the time she left the hotel she had trained two people",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Past Perfect vs. Past Simple
    // =========================================================================
    {
      id: "past-perfect-vs-past-simple",
      title: "Past Perfect vs. Past Simple",
      tenseDiagram: {
        title: "One action vs. two actions in the past",
        elements: [
          { id: "ps-solo", type: "single-dot", zone: "past", position: 65, verbLabel: "Past Simple (alone)" },
          { id: "pp-seq", type: "arc", zone: "past-earlier", position: 25, verbLabel: "Past Perfect (1st)" },
          { id: "ps-seq", type: "single-dot", zone: "past-later", position: 55, verbLabel: "Past Simple (2nd)" },
        ],
      },
      explanation: `
        <p>Marta used to clean rooms with Gloria at the hotel. She still works there. Gloria calls her on Wednesday evening with the good news. Here is Gloria's day.</p>

        ${timeline({
          kicker: "Wednesday",
          title: "Gloria's big day",
          items: [
            { when: "8:00 AM", text: "Gloria <strong>arrived</strong> at the warehouse.", accent: "amber" },
            { when: "9:00 AM", text: "The interview <strong>started</strong>.", accent: "sage" },
            { when: "10:00 AM", text: "Jennifer <strong>offered</strong> her the job.", accent: "terracotta" },
            { when: "6:00 PM", text: "Gloria <strong>called</strong> Marta.", accent: "blue" },
          ],
        })}

        
        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            Use <strong>Past Simple</strong> for one finished action in the past.<br>
            Use <strong>Past Perfect</strong> only when you have two past actions and need to show which one came first.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("one action", "sage")}
            <span><em>Jennifer <strong>offered</strong> her the job today.</em> (just one past fact)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("two actions", "amber")}
            <span><em>Before she <strong>got</strong> the job, she <strong>had trained</strong> two new cleaners.</em> (1st: trained; 2nd: got the job)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("two actions", "amber")}
            <span><em>When Gloria <strong>called</strong> Marta, Jennifer <strong>had already offered</strong> her the job.</em> (1st: offered; 2nd: called)</span>
          </div>
        </div>

        <div style="padding: 0.75rem 1rem; border-radius: 0.4rem; background: rgba(239,68,68,0.06); border-left: 3px solid #ef4444; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Common mistake:</strong> Using Past Perfect for a single action.<br>
          <span style="color: #ef4444">✗</span> "I <strong>had worked</strong> yesterday." (only one action, no sequence)<br>
          <span style="color: #059669">✓</span> "I <strong>worked</strong> yesterday."</p>
        </div>
      `,
      exercises: [
        {
          id: "pp-s4-ex1",
          title: "One action or two?",
          instructions: "Choose Past Simple or Past Perfect based on whether there is one action or a sequence.",
          items: [
            {
              type: "radio",
              label: "Gloria ___ the warehouse job today. (one fact, no sequence)",
              options: [
                { value: "a", label: "got (Past Simple)" },
                { value: "b", label: "had got (Past Perfect)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Before she applied here, Gloria ___ every shift on time at the hotel.",
              options: [
                { value: "a", label: "showed up (Past Simple)" },
                { value: "b", label: "had shown up (Past Perfect)" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Look at the timeline. When Gloria called Marta, Jennifer ___ her the job.",
              options: [
                { value: "a", label: "offered (Past Simple)" },
                { value: "b", label: "had already offered (Past Perfect)" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "pp-s4-ex2",
          title: "Error check",
          instructions: "Which sentence has a mistake?",
          items: [
            {
              type: "radio",
              label: "Which sentence is NOT correct?",
              options: [
                { value: "a", label: "She had worked a double shift before she got the job." },
                { value: "b", label: "She had finished her break yesterday." },
                { value: "c", label: "By the time the manager arrived, they had loaded the truck." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "pp-s4-ex3",
          title: "Fill in the correct tense",
          instructions: "Write the correct form of the verb. Use Past Simple or Past Perfect.",
          items: [
            {
              type: "text",
              label: "Gloria ___ (work) at the hotel for two years before she got the warehouse job.",
              expectedAnswers: ["had worked"],
            },
            {
              type: "text",
              label: "She ___ (call) Marta right after Jennifer offered her the job.",
              expectedAnswers: ["called"],
            },
            {
              type: "text",
              label: "Look at the timeline. By the time the interview started, Gloria ___ (arrive) at the warehouse.",
              expectedAnswers: ["had arrived"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Your Work Story
    // =========================================================================
    {
      id: "your-work-story",
      title: "Your Work Story",
      explanation: `
        <p>Work histories use Past Perfect all the time. Gloria reads about a woman who had worked very hard jobs before she started a business. Look for the two actions in each sentence.</p>

        ${readingCard({
          kicker: "A real work story",
          title: "Madam C. J. Walker",
          accent: "terracotta",
          paragraphs: [
            "Sarah Breedlove was born in Louisiana in 1867. She lost her parents when she was seven. Before she started her own business, she <strong>had worked</strong> as a farm laborer and a laundress.",
            "In the 1890s, she lost much of her hair because of a scalp problem. In 1905, she moved to Denver. There, she began her own business as &ldquo;Madam&rdquo; C. J. Walker. Before she <strong>settled</strong> in Indianapolis in 1910, she <strong>had traveled</strong> through the South and Southeast, selling door to door. In Indianapolis, she built a factory and a training school.",
          ],
          photo: {
            url: "/images/guide-people/madam-cj-walker.jpg",
            alt: "Portrait of Madam C. J. Walker, about 1914, looking to the side",
            credit: "Addison N. Scurlock, c. 1914, public domain",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Madam_C._J._Walker_by_Addison_N._Scurlock.jpg",
          },
          sources: [{ name: "Madam C. J. Walker official site", url: "https://madamcjwalker.com/about/" }],
        })}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 1.05rem">Past Perfect is natural in work histories: you talk about what you had done <em>before</em> the current job, and what had already happened before a key moment.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("experience", "sage")}
            <span><em>Before this job, I <strong>had worked</strong> in a hotel for three years.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("never before", "amber")}
            <span><em>I <strong>had never driven</strong> a forklift before they trained me here.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("already done", "terracotta")}
            <span><em>By the time I applied, I <strong>had already saved</strong> for three months.</em></span>
          </div>
        </div>
      `,
      tipBox: {
        title: "Tell your own work story",
        content: "Before her interview, Gloria had never told her work history in English. Practice yours: say what you had done before your last job, and what you had never done.",
      },
      exercises: [
        {
          id: "pp-s5-ex1",
          title: "Madam C. J. Walker's story",
          instructions: "Look at the reading about Madam C. J. Walker.",
          items: [
            {
              type: "radio",
              label: "Which happened first?",
              options: [
                { value: "a", label: "Walker settled in Indianapolis" },
                { value: "b", label: "Walker traveled through the South and Southeast" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Walker ___ (be) a laundress before she started her own business.",
              expectedAnswers: ["had been"],
            },
            {
              type: "text",
              label: "By the time Walker settled in Indianapolis, she ___ (already begin) her business in Denver.",
              expectedAnswers: ["had already begun"],
            },
          ],
        },
        {
          id: "pp-s5-ex2",
          title: "Gloria's story",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "radio",
              label: "Before Gloria started at the warehouse, she ___ a forklift.",
              options: [
                { value: "a", label: "had never driven" },
                { value: "b", label: "has never driven" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "pp-s5-ex3",
          title: "Your work history",
          instructions: "Put the words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Before", "I", "came", "here", "I", "had", "never", "worked", "nights"],
              correctAnswer: "Before I came here I had never worked nights",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "past-perfect-q1",
      question: "By the time Gloria walked into the warehouse, she ___ two years in housekeeping.",
      options: [
        { value: "a", label: "has worked" },
        { value: "b", label: "had worked" },
        { value: "c", label: "worked" },
      ],
      correctAnswer: "b",
      explanation: "Past Perfect (had worked) shows the earlier action that finished before she walked in.",
      topic: "past-perfect",
      skill: "usage",
      skillTag: "sequencing-two-past-actions",
      difficulty: "easy",
    },
    {
      id: "past-perfect-q3",
      question: "Gloria hadn't driven a forklift before she ___.",
      options: [
        { value: "a", label: "starts at this warehouse" },
        { value: "b", label: "started at this warehouse" },
        { value: "c", label: "had started at this warehouse" },
      ],
      correctAnswer: "b",
      explanation: "The second action uses Past Simple. Only the first (earlier) action uses Past Perfect.",
      topic: "past-perfect",
      skill: "usage",
      skillTag: "two-verb-rule-second-action-past-simple",
      difficulty: "easy",
    },
    {
      id: "past-perfect-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Before Gloria got the job, she ___ hotel rooms for two years.\" (Earlier of two past actions.)",
      correctAnswer: "had cleaned",
      explanation: "Past Perfect (had cleaned) shows the action that happened first, before she got the new job.",
      topic: "past-perfect",
      skill: "usage",
      skillTag: "work-history-narrative",
      difficulty: "easy",
    },
    {
      id: "past-perfect-q6",
      question: "Which sentence has a mistake?",
      options: [
        { value: "a", label: "After she had finished loading, she clocked out." },
        { value: "b", label: "She had eaten lunch before the break ended." },
        { value: "c", label: "I had called Marta last night." },
      ],
      correctAnswer: "c",
      explanation: "Past Perfect needs two past actions. 'Last night' is just one action, so Past Simple (called) is correct.",
      topic: "past-perfect",
      skill: "error-detection",
      skillTag: "past-perfect-overuse",
      difficulty: "medium",
    },
    {
      id: "past-perfect-qws1",
      type: "word-scramble" as const,
      question: "Gloria finished her tasks before the manager arrived. Put the words in order.",
      words: ["She", "had", "finished", "before", "the", "manager", "arrived"],
      correctAnswer: "She had finished before the manager arrived",
      hint: "had + past participle for the earlier action",
      explanation: "Past Perfect (had finished) = the earlier action. Past Simple (arrived) = the later action.",
      topic: "past-perfect",
      skill: "usage",
      skillTag: "sequencing-two-past-actions",
      difficulty: "medium",
    },
  ],
};
