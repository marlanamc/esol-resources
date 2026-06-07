import type { InteractiveGuideContent } from "@/types/activity";
import { pastPerfectImages as img } from "@/data/past-perfect-images.generated";

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
          { speaker: "Gloria", avatar: "👩🏽", text: "By the time I walked in, I <strong>had already worked</strong> two years in housekeeping. And I <strong>had saved</strong> enough for the bus pass.", side: "right", tone: "terracotta" },
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
              label: "By the time Gloria walked in, she had already saved enough for the bus pass.",
              options: [
                { value: "a", label: "She walked into the warehouse" },
                { value: "b", label: "She saved enough for the bus pass" },
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
              label: "By the time she got the interview, she ___ (work) at the hotel for three years.",
              expectedAnswers: ["had worked"],
            },
            {
              type: "text",
              label: "When the shift started, Gloria ___ (already arrive) at the loading dock.",
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
        ${sceneCard("sceneBreakRoom", "Break room, 10 AM. Gloria meets James, a forklift operator.", "sage")}

        ${dialogue([
          { speaker: "James", avatar: "👨🏿", text: "So what did you put on your application?", side: "left", tone: "sage" },
          { speaker: "Gloria", avatar: "👩🏽", text: "I wrote that before this I <strong>had cleaned</strong> offices and <strong>had handled</strong> supply orders. Never drove a forklift, though.", side: "right", tone: "terracotta" },
          { speaker: "James", avatar: "👨🏿", text: "Same. I <strong>hadn't driven</strong> one either before they trained me here.", side: "left", tone: "sage" },
        ])}

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
            <span><em>She <strong>had cleaned</strong> offices for two years before she switched jobs.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("negative", "terracotta")}
            <span><em>He <strong>hadn't driven</strong> a forklift before the training.</em></span>
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
          ],
        },
        {
          id: "pp-s2-ex2",
          title: "Build the sentence",
          instructions: "Fill in the blank with the correct form: positive (had + V3) or negative (hadn't + V3).",
          items: [
            {
              type: "text",
              label: "James ___ (never use) a pallet jack before the safety training.",
              expectedAnswers: ["had never used", "hadn't used"],
            },
            {
              type: "text",
              label: "Before she got this job, Gloria ___ (clean) offices at three different hotels.",
              expectedAnswers: ["had cleaned"],
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
              label: "Before she walked into the interview, she ___ (practice) her answers with a coworker.",
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
        ${sceneCard("scenePromotion", "Loading dock. Diego calls his cousin during a break.", "terracotta")}

        ${dialogue([
          { speaker: "Diego", avatar: "👨🏾", text: "I got the supervisor job! They <strong>called</strong> me this morning.", side: "right", tone: "terracotta" },
          { speaker: "Cousin (phone)", avatar: "🧑🏽", text: "No way! What did you tell them?", side: "left", tone: "sage" },
          { speaker: "Diego", avatar: "👨🏾", text: "I told them I <strong>had lifted</strong> heavy loads, <strong>had covered</strong> two shifts alone, and <strong>had never missed</strong> a day.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            Use <strong>Past Simple</strong> for one finished action in the past.<br>
            Use <strong>Past Perfect</strong> only when you have two past actions and need to show which one came first.
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("one action", "sage")}
            <span><em>They <strong>called</strong> him this morning.</em> (just one past fact)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("two actions", "amber")}
            <span><em>Before he <strong>got</strong> the job, he <strong>had covered</strong> two shifts alone.</em> (1st: covered; 2nd: got the job)</span>
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
              label: "Diego ___ the supervisor job last week. (one fact, no sequence)",
              options: [
                { value: "a", label: "got (Past Simple)" },
                { value: "b", label: "had got (Past Perfect)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Before the manager promoted him, Diego ___ every shift on time for six months.",
              options: [
                { value: "a", label: "showed up (Past Simple)" },
                { value: "b", label: "had shown up (Past Perfect)" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "When his cousin called, Diego ___ the news already.",
              options: [
                { value: "a", label: "heard (Past Simple)" },
                { value: "b", label: "had already heard (Past Perfect)" },
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
                { value: "a", label: "He had worked a double shift before he got promoted." },
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
              label: "Diego ___ (work) at the warehouse for a year before he got the promotion.",
              expectedAnswers: ["had worked"],
            },
            {
              type: "text",
              label: "He ___ (call) his cousin right after the manager told him.",
              expectedAnswers: ["called"],
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
        ${sceneCard("sceneWorkStory", "Break room. Amara and her coworker Linh swap work histories.", "sage")}

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "Before I came here, I <strong>had done</strong> home care for four years. Nights mostly.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "I <strong>had worked</strong> in a restaurant before this. Twelve-hour shifts. I <strong>hadn't slept</strong> a full night in two years.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Same. By the time I found this job, I <strong>had already saved</strong> enough to move closer to the bus.", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "Exactly. The restaurant <strong>hadn't paid</strong> overtime either, not once.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
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
        title: "February at the warehouse",
        content: "A break-room poster near Amara's locker shows a timeline of Black workers and labor rights in America. She had never seen one before at a job site.",
      },
      exercises: [
        {
          id: "pp-s5-ex1",
          title: "Amara's story",
          instructions: "Fill in the blanks to complete Amara's work history.",
          items: [
            {
              type: "text",
              label: "Before she found this job, Amara ___ (do) home care for four years.",
              expectedAnswers: ["had done"],
            },
            {
              type: "text",
              label: "By the time she applied, she ___ (already save) enough to move closer to the bus.",
              expectedAnswers: ["had already saved"],
            },
          ],
        },
        {
          id: "pp-s5-ex2",
          title: "Linh's story",
          instructions: "Choose the correct form for each blank.",
          items: [
            {
              type: "radio",
              label: "Before Linh found this job, she ___ in a restaurant for years.",
              options: [
                { value: "a", label: "had worked (Past Perfect)" },
                { value: "b", label: "worked (Past Simple)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "The restaurant ___ overtime in two years.",
              options: [
                { value: "a", label: "hadn't paid (Past Perfect, negative)" },
                { value: "b", label: "didn't pay (Past Simple, negative)" },
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
      question: "James hadn't driven a forklift before he ___.",
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
      question: "Fill in the blank: \"Before she got the job, she ___ home care for four years.\" (Earlier of two past actions.)",
      correctAnswer: "had done",
      explanation: "Past Perfect (had done) shows the action that happened first — before she got the new job.",
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
        { value: "c", label: "I had called my cousin last night." },
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
      question: "Put the words in the right order.",
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
