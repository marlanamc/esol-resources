import type { InteractiveGuideContent } from "@/types/activity";
import { partsOfSpeechImages as img } from "@/data/parts-of-speech-images.generated";
import { frequencyBar, readingCard } from "@/content/grammar/_shared/guide-visuals";

// ---------------------------------------------------------------------------
// Visual helpers (standard toolkit. copy from welcome-back-tenses-review.ts)
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

export const partsOfSpeechContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Nouns
    // =========================================================================
    {
      id: "nouns",
      stepNumber: 1,
      title: "Nouns: naming the world around you",
      icon: "🧱",
      explanation: `
        ${sceneCard("sceneFrontDesk", "East Boston Community Center. Tuesday, 5:30 PM. Amara writes down her information.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara cleans patient rooms at a hospital. She works days and has two kids, so she can only study at night. Today she comes straight from work to sign up for a free English class. James works at the front desk.</p>

        ${dialogue([
          { speaker: "James", avatar: "🙋🏼", text: "Hi. This is the <strong>registration desk</strong>. Can I get your <strong>name</strong> and <strong>address</strong>?", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏾", text: "Amara Yusuf. My <strong>address</strong> is 24 Meridian <strong>Street</strong>, near the <strong>hospital</strong>.", side: "right", tone: "terracotta" },
          { speaker: "James", avatar: "🙋🏼", text: "Thanks. Please fill out this <strong>form</strong>. You will also need a <strong>pencil</strong> and a <strong>notebook</strong> for class.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏾", text: "I have a <strong>notebook</strong> in my <strong>bag</strong>. Could I borrow a <strong>pencil</strong>?", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Look at the words in bold: <em>desk, name, address, street, hospital, form, pencil, notebook, bag</em>. Each one is a name for a place or a thing. These words are <strong>nouns</strong>.</p>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Nouns</strong> name people, places, things, and ideas. If you can say "a ___" or "the ___" in front of it, it is probably a noun.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("person", "terracotta")}
            <span><em>a <strong>volunteer</strong>, the <strong>teacher</strong>, Amara, a <strong>student</strong></em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("place", "terracotta")}
            <span><em>the <strong>community center</strong>, Meridian <strong>Street</strong>, the second <strong>floor</strong></em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("thing", "terracotta")}
            <span><em>a <strong>pencil</strong>, a <strong>notebook</strong>, the <strong>form</strong>, a <strong>bag</strong></em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("idea", "terracotta")}
            <span><em><strong>English</strong>, <strong>education</strong>, <strong>registration</strong>, <strong>progress</strong></em></span>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); margin-top: 1rem">
          <p style="margin: 0 0 0.4rem 0; font-weight: 600">Thing or idea?</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem">A <strong>thing</strong> is something you can touch: <em>a pencil, a notebook, the form, a bag</em>.</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem">An <strong>idea</strong> is something you cannot touch. You can only think about it or feel it: <em>English, education, registration, progress</em>.</p>
          <p style="margin: 0; font-size: 0.88rem; color: var(--color-text-muted)">Ask yourself: can I pick it up with my hands? If no, it is an idea.</p>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); margin-top: 1rem">
          <p style="margin: 0 0 0.4rem 0; font-weight: 600">Singular and plural:</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><em>one <strong>class</strong> / two <strong>classes</strong></em></p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><em>a <strong>student</strong> / many <strong>students</strong></em></p>
          <p style="margin: 0; font-size: 0.88rem; color: var(--color-text-muted)">Most nouns add -s or -es to become plural.</p>
        </div>
      `,
      exercises: [
        {
          id: "pos-n-1",
          title: "Spot the noun",
          instructions: "Choose the noun in each sentence.",
          items: [
            {
              type: "radio",
              label: "Amara fills out a form at the community center.",
              options: [
                { value: "fills", label: "fills" },
                { value: "form", label: "form" },
                { value: "out", label: "out" },
              ],
              expectedAnswer: "form",
            },
            {
              type: "radio",
              label: "The volunteer explains each question carefully.",
              options: [
                { value: "explains", label: "explains" },
                { value: "carefully", label: "carefully" },
                { value: "volunteer", label: "volunteer" },
              ],
              expectedAnswer: "volunteer",
            },
            {
              type: "radio",
              label: "She carries a pencil and a notebook in her bag.",
              options: [
                { value: "carries", label: "carries" },
                { value: "pencil", label: "pencil" },
                { value: "in", label: "in" },
              ],
              expectedAnswer: "pencil",
            },
          ],
        },
        {
          id: "pos-n-2",
          title: "Person, place, thing, or idea?",
          instructions:
            "What kind of noun is it? Remember: a thing is something you can touch. An idea is something you cannot touch.",
          items: [
            {
              type: "radio",
              label: "What kind of noun is the word 'hospital'?",
              options: [
                { value: "person", label: "Person (who)" },
                { value: "place", label: "Place (where)" },
                { value: "thing", label: "Thing (you can touch it)" },
                { value: "idea", label: "Idea (you cannot touch it)" },
              ],
              expectedAnswer: "place",
            },
            {
              type: "radio",
              label: "What kind of noun is the word 'education'?",
              options: [
                { value: "person", label: "Person (who)" },
                { value: "place", label: "Place (where)" },
                { value: "thing", label: "Thing (you can touch it)" },
                { value: "idea", label: "Idea (you cannot touch it)" },
              ],
              expectedAnswer: "idea",
            },
            {
              type: "radio",
              label: "What kind of noun is the word 'notebook'?",
              options: [
                { value: "person", label: "Person (who)" },
                { value: "place", label: "Place (where)" },
                { value: "thing", label: "Thing (you can touch it)" },
                { value: "idea", label: "Idea (you cannot touch it)" },
              ],
              expectedAnswer: "thing",
            },
          ],
        },
        {
          id: "pos-n-3",
          title: "Build the sentence",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "volunteer", "hands", "Amara", "a", "form"],
              correctAnswer: "The volunteer hands Amara a form",
              correctAnswers: ["Amara hands the volunteer a form"],
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "supply", "closet", "is", "behind", "the", "first", "door"],
              correctAnswer: "The supply closet is behind the first door",
              correctAnswers: ["The first door is behind the supply closet"],
            },
          ],
        },
        {
          id: "pos-n-4",
          title: "Singular or plural?",
          instructions: "Write the plural form of the noun.",
          items: [
            {
              type: "text",
              label: "one notebook / two ___",
              expectedAnswers: ["notebooks"],
            },
            {
              type: "text",
              label: "one box / three ___",
              expectedAnswers: ["boxes"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. Verbs
    // =========================================================================
    {
      id: "verbs",
      stepNumber: 2,
      title: "Verbs: action verbs and state verbs",
      icon: "⚙️",
      explanation: `
        <p style="margin: 0 0 1rem 0; line-height: 1.6">Samuel fixes things in Amara's building, and he volunteers at the center on Tuesdays. He helps Amara with her registration form. Look at what each of them does, and what is true about each of them.</p>

        <div class="gc-border-black-alpha" style="margin: 0 0 1.5rem 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.02)">
          <div style="padding: 0.75rem 1rem 0.5rem 1rem">
            <div class="gc-text-sage" style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em">Sort</div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-top: 0.1rem">Action verbs and state verbs</div>
          </div>
          <div style="padding: 0 0.75rem 0.75rem 0.75rem">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed">
              <thead><tr>
                <th scope="col" style="padding: 0.3rem !important; width: 24%"></th>
                <th scope="col" class="gc-text-sage" style="padding: 0.3rem !important; font-size: 0.78rem; text-align: left; text-transform: uppercase; border-bottom: 1px solid rgba(128,128,128,0.4)">Action</th>
                <th scope="col" class="gc-text-terracotta" style="padding: 0.3rem !important; font-size: 0.78rem; text-align: left; text-transform: uppercase; border-bottom: 1px solid rgba(128,128,128,0.4)">State</th>
              </tr></thead>
              <tbody>
                <tr>
                  <th scope="row" style="padding: 0.4rem 0.35rem !important; vertical-align: top; text-align: left; border-bottom: 1px solid rgba(128,128,128,0.25); font-size: 0.9rem; overflow-wrap: normal !important">Samuel</th>
                  <td style="padding: 0.4rem 0.35rem !important; vertical-align: top; text-align: left; border-bottom: 1px solid rgba(128,128,128,0.25); font-size: 0.9rem; overflow-wrap: normal !important"><strong>helps</strong>, <strong>fixes</strong></td>
                  <td style="padding: 0.4rem 0.35rem !important; vertical-align: top; text-align: left; border-bottom: 1px solid rgba(128,128,128,0.25); font-size: 0.9rem; overflow-wrap: normal !important"><strong>knows</strong>, <strong>understands</strong></td>
                </tr>
                <tr>
                  <th scope="row" style="padding: 0.4rem 0.35rem !important; vertical-align: top; text-align: left; border-bottom: 1px solid rgba(128,128,128,0.25); font-size: 0.9rem; overflow-wrap: normal !important">Amara</th>
                  <td style="padding: 0.4rem 0.35rem !important; vertical-align: top; text-align: left; border-bottom: 1px solid rgba(128,128,128,0.25); font-size: 0.9rem; overflow-wrap: normal !important"><strong>fills out</strong>, <strong>writes</strong></td>
                  <td style="padding: 0.4rem 0.35rem !important; vertical-align: top; text-align: left; border-bottom: 1px solid rgba(128,128,128,0.25); font-size: 0.9rem; overflow-wrap: normal !important"><strong>wants</strong>, <strong>needs</strong>, <strong>has</strong>, <strong>knows</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p style="margin: 0 0 1rem 0; line-height: 1.6">The words in bold in the table are <strong>verbs</strong>. But they are not all the same kind. Some are things you do. Some are things that are true about you.</p>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0; font-size: 1.05rem">There are two types of verbs. <strong>Action verbs</strong> describe things you do. <strong>State verbs</strong> describe things that are true about you, such as what you feel, know, have, or think.</p>
        </div>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">Action verbs: things you do</p>
        <div style="display: grid; gap: 0.5rem; margin: 0 0 1.25rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("action", "sage")}
            <span><em>Samuel <strong>helps</strong> students every Tuesday. He <strong>explains</strong> the schedule.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("action", "sage")}
            <span><em>Amara <strong>fills out</strong> the form. She <strong>writes</strong> her address in the first box.</em></span>
          </div>
        </div>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">State verbs: things that are true</p>
        <div style="display: grid; gap: 0.5rem; margin: 0 0 1.25rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("state", "terracotta")}
            <span><em>Amara <strong>knows</strong> Samuel from her building. She <strong>remembers</strong> his face.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("state", "terracotta")}
            <span><em>She <strong>wants</strong> the evening class. She <strong>understands</strong> why it is a good fit.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("state", "terracotta")}
            <span><em>Amara <strong>has</strong> two children. She <strong>needs</strong> a class in the evening.</em></span>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600">Why does this matter?</p>
          <p style="margin: 0 0 0.35rem 0; font-size: 0.95rem">State verbs are almost never used in the continuous (-ing) form.</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><span style="color: #c0392b">✗</span> <em>I am knowing the answer.</em></p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><span style="color: #27ae60">✓</span> <em>I <strong>know</strong> the answer.</em></p>
          <p style="margin: 0.5rem 0 0; font-size: 0.88rem; color: var(--color-text-muted)">Common state verbs: know, want, need, understand, remember, believe, like, love, hate, have, seem.</p>
        </div>
      `,
      tipBox: {
        title: "Can you do it right now?",
        content:
          "Ask yourself: can I watch someone do this? If yes, it is probably an action verb (run, write, help). If no, it is probably a state verb (know, want, understand). You cannot watch someone 'know' something.",
      },
      exercises: [
        {
          id: "pos-v-1",
          title: "Action or state?",
          instructions: "Choose the correct label for the verb in bold.",
          items: [
            {
              type: "radio",
              label: "Samuel <strong>helps</strong> new students every Tuesday.",
              options: [
                { value: "action", label: "Action verb: you can watch someone do it" },
                { value: "state", label: "State verb: a feeling, a fact, or something in the mind" },
              ],
              expectedAnswer: "action",
            },
            {
              type: "radio",
              label: "Amara <strong>knows</strong> Samuel from her building.",
              options: [
                { value: "action", label: "Action verb: you can watch someone do it" },
                { value: "state", label: "State verb: a feeling, a fact, or something in the mind" },
              ],
              expectedAnswer: "state",
            },
            {
              type: "radio",
              label: "She <strong>fills out</strong> the form at the registration desk.",
              options: [
                { value: "action", label: "Action verb: you can watch someone do it" },
                { value: "state", label: "State verb: a feeling, a fact, or something in the mind" },
              ],
              expectedAnswer: "action",
            },
            {
              type: "radio",
              label: "Amara <strong>wants</strong> an evening class.",
              options: [
                { value: "action", label: "Action verb: you can watch someone do it" },
                { value: "state", label: "State verb: a feeling, a fact, or something in the mind" },
              ],
              expectedAnswer: "state",
            },
          ],
        },
        {
          id: "pos-v-2",
          title: "Correct or not?",
          instructions: "State verbs do not use the -ing form. Is each sentence correct?",
          items: [
            {
              type: "radio",
              label: "\"I am knowing all the students in my class.\"",
              options: [
                { value: "correct", label: "Correct: this verb can use the -ing form." },
                { value: "incorrect", label: "Not correct: this verb cannot use the -ing form." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Samuel is helping a student right now.\"",
              options: [
                { value: "correct", label: "Correct: this verb can use the -ing form." },
                { value: "incorrect", label: "Not correct: this verb cannot use the -ing form." },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"She is wanting the evening class.\"",
              options: [
                { value: "correct", label: "Correct: this verb can use the -ing form." },
                { value: "incorrect", label: "Not correct: this verb cannot use the -ing form." },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "pos-v-table",
          title: "Read the table",
          instructions: "Look at the table about Samuel and Amara.",
          items: [
            {
              type: "radio",
              label: "Look at the table. Which verb is an action verb for Amara?",
              options: [
                { value: "fills out", label: "fills out" },
                { value: "needs", label: "needs" },
                { value: "has", label: "has" },
              ],
              expectedAnswer: "fills out",
            },
            {
              type: "text",
              label: "Look at the table. How many state verbs does Amara have in her row? Write a number.",
              expectedAnswers: ["4", "four"],
            },
          ],
        },
        {
          id: "pos-v-3",
          title: "Fill in the verb",
          instructions: "Write the correct form of the verb in parentheses.",
          items: [
            {
              type: "text",
              label: "Amara ___ the evening class. (want)",
              expectedAnswers: ["wants"],
            },
            {
              type: "text",
              label: "Samuel ___ new students find the right class. (help)",
              expectedAnswers: ["helps"],
            },
          ],
        },
        {
          id: "pos-v-4",
          title: "Build the sentence",
          instructions: "Unscramble the words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Samuel", "helps", "new", "students", "every", "Tuesday"],
              correctAnswer: "Samuel helps new students every Tuesday",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Amara", "sees", "Samuel", "at", "the", "coffee", "shop"],
              correctAnswer: "Amara sees Samuel at the coffee shop",
              correctAnswers: ["Samuel sees Amara at the coffee shop"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. Adjectives
    // =========================================================================
    {
      id: "adjectives",
      stepNumber: 3,
      title: "Adjectives: describing words",
      icon: "🎨",
      explanation: `
        <p style="margin: 0 0 1rem 0; line-height: 1.6">Dilnoza sits down next to Amara. She is a cashier at a supermarket, and she is signing up for the same class. The last part of the form is called "About You." Names of things are not enough here. They need to <strong>describe</strong> their lives. First, Dilnoza reads about a real person who moved to a new country. Look at the words that describe.</p>

        ${readingCard({
          kicker: "Famous person",
          title: "Hamdi Ulukaya: A New Country",
          photo: {
            url: "/images/guide-people/hamdi-ulukaya.jpg",
            alt: "Hamdi Ulukaya, a man with curly gray hair and glasses, in a dark jacket",
            credit: "U.S. Department of Homeland Security, public domain",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Hamdi_Ulukaya,_official_portrait,_Homeland_Security_Council.jpg",
          },
          paragraphs: [
            "Hamdi Ulukaya grew up on a mountain in <strong>eastern</strong> Turkey, near the Euphrates River. Later, he moved to the United States, a <strong>new</strong> country. In 2005, he started Chobani, a yogurt company.",
            "In 2016, he started Tent. Tent helps <strong>large</strong> businesses hire refugees. Today, it works with more than <strong>500</strong> of the world's <strong>largest</strong> employers. Ulukaya says, \"The minute a refugee gets a job is the minute they stop being a refugee.\"",
          ],
          sources: [
            { name: "Tent: Hamdi Ulukaya", url: "https://www.tent.org/our-founder/hamdi-ulukaya/" },
            { name: "Tent: About", url: "https://www.tent.org/about/" },
          ],
          accent: "amber",
        })}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Adjectives</strong> describe nouns. They answer <em>what kind?</em> or <em>how many?</em> Adjectives usually come right before the noun they describe.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("what kind", "amber")}
            <span><em>Amara has a <strong>full-time</strong> job. She works in a <strong>busy</strong> hospital.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("what kind", "amber")}
            <span><em>They live in a <strong>new</strong> building on a <strong>quiet</strong> street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("how many", "amber")}
            <span><em>Amara has <strong>two</strong> children. Dilnoza has <strong>three</strong> brothers.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("how many", "amber")}
            <span><em>The form has <strong>five</strong> sections. The <strong>first</strong> section asks for your name.</em></span>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); margin-top: 1rem">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600">Adjective position:</p>
          <p style="margin: 0 0 0.25rem 0"><em>a <strong>small</strong> apartment</em> <span style="font-size: 0.88rem; color: var(--color-text-muted)">(adjective before noun)</span></p>
          <p style="margin: 0"><em>The apartment is <strong>small</strong>.</em> <span style="font-size: 0.88rem; color: var(--color-text-muted)">(adjective after is/are/was)</span></p>
        </div>
      `,
      exercises: [
        {
          id: "pos-adj-1",
          title: "Find the adjective",
          instructions: "Choose the adjective in each sentence.",
          items: [
            {
              type: "radio",
              label: "Amara has a full-time job at a busy hospital.",
              options: [
                { value: "job", label: "job" },
                { value: "busy", label: "busy" },
                { value: "has", label: "has" },
              ],
              expectedAnswer: "busy",
            },
            {
              type: "radio",
              label: "Dilnoza lives in a small apartment with her sister.",
              options: [
                { value: "lives", label: "lives" },
                { value: "apartment", label: "apartment" },
                { value: "small", label: "small" },
              ],
              expectedAnswer: "small",
            },
            {
              type: "radio",
              label: "Dilnoza has three brothers.",
              options: [
                { value: "has", label: "has" },
                { value: "three", label: "three" },
                { value: "brothers", label: "brothers" },
              ],
              expectedAnswer: "three",
            },
          ],
        },
        {
          id: "pos-adj-read",
          title: "Read about Hamdi Ulukaya",
          instructions: "Look at the reading.",
          items: [
            {
              type: "radio",
              label: "Look at the reading. Where did Hamdi Ulukaya grow up?",
              options: [
                { value: "eastern", label: "In eastern Turkey" },
                { value: "us", label: "In the United States" },
                { value: "river", label: "In a city on the coast" },
              ],
              expectedAnswer: "eastern",
            },
            {
              type: "text",
              label: "Look at the reading. In what year did he start Tent? Write the year.",
              expectedAnswers: ["2016"],
            },
            {
              type: "radio",
              label: "Look at the reading. Which word describes the noun \"country\"?",
              options: [
                { value: "new", label: "new" },
                { value: "started", label: "started" },
                { value: "later", label: "later" },
              ],
              expectedAnswer: "new",
            },
          ],
        },
        {
          id: "pos-adj-2",
          title: "Correct or not?",
          instructions: "Is the adjective in the right place?",
          items: [
            {
              type: "radio",
              label: "\"She has a schedule busy.\"",
              options: [
                { value: "correct", label: "Correct: the adjective is in the right place." },
                { value: "incorrect", label: "Not correct: the adjective is in the wrong place." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"The new building has two small rooms.\"",
              options: [
                { value: "correct", label: "Correct: the adjective is in the right place." },
                { value: "incorrect", label: "Not correct: the adjective is in the wrong place." },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"They have children three.\"",
              options: [
                { value: "correct", label: "Correct: the adjective is in the right place." },
                { value: "incorrect", label: "Not correct: the adjective is in the wrong place." },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "pos-adj-3",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Dilnoza", "has", "a", "busy", "schedule", "this", "week"],
              correctAnswer: "Dilnoza has a busy schedule this week",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "form", "has", "five", "short", "sections"],
              correctAnswer: "The form has five short sections",
            },
          ],
        },
        {
          id: "pos-adj-4",
          title: "Write the adjective",
          instructions: "Write the word that describes the noun.",
          items: [
            {
              type: "text",
              label: "\"Dilnoza has a busy schedule.\" Which word describes \"schedule\"?",
              expectedAnswers: ["busy"],
            },
            {
              type: "text",
              label: "\"The new building has two small rooms.\" Which word describes \"rooms\"?",
              expectedAnswers: ["small"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Adverbs
    // =========================================================================
    {
      id: "adverbs",
      stepNumber: 4,
      title: "Adverbs: how, when, how often",
      icon: "⚡",
      explanation: `
        <p style="margin: 0 0 1rem 0; line-height: 1.6">On Saturday, it's cleanup day at Amara's building. Samuel is outside in work gloves, writing repairs on a clipboard. Amara tells him her kitchen sink is leaking again. Then she asks how his week works. This is what he tells her.</p>

        ${frequencyBar([
          { word: "always", percent: 100, example: "Samuel <strong>always</strong> helps at the center on Tuesdays.", accent: "terracotta" },
          { word: "usually", percent: 80, example: "He <strong>usually</strong> fixes a leak in one visit.", accent: "terracotta" },
          { word: "sometimes", percent: 40, example: "He <strong>sometimes</strong> eats lunch at his desk.", accent: "amber" },
          { word: "rarely", percent: 10, example: "He <strong>rarely</strong> takes a day off.", accent: "sage" },
          { word: "never", percent: 0, example: "He <strong>never</strong> leaves a job unfinished.", accent: "sage" },
        ], { kicker: "Chart", title: "Samuel's week: how often?" })}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">"I can fix the sink on Monday," he says, and writes it down. Words like <em>always</em> tell us <em>how often</em>. Other words tell us <em>when</em> and <em>how</em>. They are all <strong>adverbs</strong>.</p>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Adverbs</strong> describe verbs. They answer <em>how?</em>, <em>when?</em>, or <em>how often?</em> Many adverbs end in <strong>-ly</strong> (quickly, carefully, quietly). But not all of them do (well, hard, early, fast). A <strong>group of words</strong> can do the same job: <em>every Tuesday, last year, after work</em>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("how", "blue")}
            <span><em>Samuel works <strong>quickly</strong>. He speaks English <strong>well</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("when", "blue")}
            <span><em>He finishes <strong>early</strong>. He comes <strong>after his shift</strong> on Tuesdays.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("how often", "blue")}
            <span><em>He volunteers <strong>every week</strong>. He <strong>always</strong> arrives on time.</em></span>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); margin: 1rem 0">
          <p style="margin: 0 0 0.6rem 0; font-weight: 600">Adjective or adverb? The question is: what does it describe?</p>
          <div style="display: flex; flex-direction: column; gap: 0.4rem">
            <div style="display: flex; gap: 1rem; align-items: baseline; flex-wrap: wrap">
              <span class="gc-text-terracotta" style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase">Adjective</span>
              <span><em>Samuel is a <strong>quick</strong> worker.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the noun "worker")</span></span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: baseline; flex-wrap: wrap">
              <span class="gc-text-blue" style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase">Adverb</span>
              <span><em>Samuel works <strong>quickly</strong>.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the verb "works")</span></span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: baseline; flex-wrap: wrap">
              <span class="gc-text-terracotta" style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase">Adjective</span>
              <span><em>His English is <strong>good</strong>.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the noun "English")</span></span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: baseline; flex-wrap: wrap">
              <span class="gc-text-blue" style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase">Adverb</span>
              <span><em>He speaks English <strong>well</strong>.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the verb "speaks")</span></span>
            </div>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); margin: 1rem 0">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600">Careful: hard and hardly</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><em>Samuel works <strong>hard</strong>.</em> <span style="font-size: 0.88rem; color: var(--color-text-muted)">(with a lot of effort)</span></p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><em>Samuel <strong>hardly</strong> works.</em> <span style="font-size: 0.88rem; color: var(--color-text-muted)">(almost never, the opposite meaning)</span></p>
          <p style="margin: 0.5rem 0 0; font-size: 0.88rem; color: var(--color-text-muted)">Adding -ly does not always make the adverb. <em>Hardly</em> is a different word with a different meaning.</p>
        </div>
      `,
      tipBox: {
        title: "good vs. well",
        content:
          "Good is an adjective: his English is good. Well is an adverb: he speaks English well. This pair catches many learners, including native speakers.",
      },
      exercises: [
        {
          id: "pos-adv-1",
          title: "Adjective or adverb?",
          instructions: "Choose the correct word for each sentence.",
          items: [
            {
              type: "radio",
              label: "Samuel is a ___ worker. He fixes most things the same day. (quick / quickly)",
              options: [
                { value: "quick", label: "quick (adjective)" },
                { value: "quickly", label: "quickly (adverb)" },
              ],
              expectedAnswer: "quick",
            },
            {
              type: "radio",
              label: "He finishes his work very ___. He is always done before noon. (quick / quickly)",
              options: [
                { value: "quick", label: "quick (adjective)" },
                { value: "quickly", label: "quickly (adverb)" },
              ],
              expectedAnswer: "quickly",
            },
            {
              type: "radio",
              label: "Dilnoza speaks English ___. She practices every day. (good / well)",
              options: [
                { value: "good", label: "good (adjective)" },
                { value: "well", label: "well (adverb)" },
              ],
              expectedAnswer: "well",
            },
            {
              type: "radio",
              label: "Her pronunciation is ___. People understand her easily. (good / well)",
              options: [
                { value: "good", label: "good (adjective)" },
                { value: "well", label: "well (adverb)" },
              ],
              expectedAnswer: "good",
            },
          ],
        },
        {
          id: "pos-adv-chart",
          title: "Read the chart",
          instructions: "Look at Samuel's chart.",
          items: [
            {
              type: "radio",
              label: "Look at Samuel's chart. Which sentence is true?",
              options: [
                { value: "a", label: "Samuel never takes a day off." },
                { value: "b", label: "Samuel rarely takes a day off." },
                { value: "c", label: "Samuel always takes a day off." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Look at Samuel's chart. He ___ eats lunch at his desk. (Write one word.)",
              expectedAnswers: ["sometimes"],
            },
          ],
        },
        {
          id: "pos-adv-2",
          title: "Fill in the adverb",
          instructions: "Write the adverb form of the word in parentheses.",
          items: [
            {
              type: "text",
              label: "Samuel explains the form ___. Everyone understands. (clear)",
              expectedAnswers: ["clearly"],
            },
            {
              type: "text",
              label: "Amara listens ___ during the orientation. (careful)",
              expectedAnswers: ["carefully"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. All Four Together
    // =========================================================================
    {
      id: "all-four-together",
      stepNumber: 5,
      title: "All four working together",
      icon: "🔍",
      explanation: `
        ${sceneCard("sceneBulletinBoard", "Tuesday, 6:20 PM. The board by the door at the community center, full of flyers and notices.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">It's the first Tuesday class. Amara and Dilnoza meet at the door. The form didn't say which room, so they look for the notice Samuel told them about.</p>

        ${dialogue([
          { speaker: "Dilnoza", avatar: "👩🏻", text: "Here it is. \"Classes meet every Tuesday and Thursday evening in the <strong>large</strong> room.\" Which one is the large room?", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏾", text: "Not the first door. That's the supply closet. I already tried it.", side: "right", tone: "terracotta" },
          { speaker: "Dilnoza", avatar: "👩🏻", text: "It also says, \"Bring a pencil and a <strong>small</strong> notebook.\"", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏾", text: "Small? Mine is huge. It's my son's old school notebook.", side: "right", tone: "terracotta" },
          { speaker: "Dilnoza", avatar: "👩🏻", text: "I don't think they'll check. More pages, more English.", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏾", text: "OK. Let's find that room before all the good seats are gone.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Now read the whole notice. Every word has a job. Some words name things, some show action, some describe, and some tell you when.</p>

        <div style="padding: 1.1rem 1.25rem; border-radius: 0.5rem; background: rgba(106,141,115,0.08); border: 1px solid rgba(106,141,115,0.2); margin: 1.25rem 0">
          <p style="margin: 0 0 0.75rem 0; font-weight: 600; font-size: 0.95rem">The notice on the bulletin board:</p>
          <p style="margin: 0 0 0.35rem 0; font-size: 1.05rem; line-height: 1.7"><em>Free <span class="gc-text-terracotta" style="font-weight:700">English</span> classes <span class="gc-text-sage" style="font-weight:700">start</span> in September. Classes <span class="gc-text-sage" style="font-weight:700">meet</span> every Tuesday and Thursday evening in the <span class="gc-text-amber" style="font-weight:700">large</span> room. <span class="gc-text-sage" style="font-weight:700">Bring</span> a pencil and a <span class="gc-text-amber" style="font-weight:700">small</span> notebook.</em></p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem">
            ${labelPill("nouns", "terracotta")}
            <span style="font-size: 0.88rem; align-self: center">English, classes, September, room, pencil, notebook</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.35rem">
            ${labelPill("verbs", "sage")}
            <span style="font-size: 0.88rem; align-self: center">start, meet, bring</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.35rem">
            ${labelPill("adjectives", "amber")}
            <span style="font-size: 0.88rem; align-self: center">free, large, small</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.35rem">
            ${labelPill("adverb", "blue")}
            <span style="font-size: 0.88rem; align-self: center">every Tuesday and Thursday evening (a group of words that tells us when)</span>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600">Quick guide:</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><strong>Noun</strong>: person, place, thing, or idea. Can follow "a / an / the."</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><strong>Verb</strong>: action or state. Changes for tense (start / started / starting).</p>
          <p style="margin: 0 0 0.25rem 0; font-size: 0.95rem"><strong>Adjective</strong>: describes a noun. Ask: what kind? how many?</p>
          <p style="margin: 0; font-size: 0.95rem"><strong>Adverb</strong>: describes a verb. Ask: how? when? how often?</p>
        </div>
      `,
      exercises: [
        {
          id: "pos-all-1",
          title: "Name the part of speech",
          instructions: "Read the sentence. Choose the correct part of speech for the word in bold.",
          items: [
            {
              type: "radio",
              label: "\"Dilnoza reads the <strong>notice</strong> on the board.\"",
              options: [
                { value: "noun", label: "Noun" },
                { value: "verb", label: "Verb" },
                { value: "adjective", label: "Adjective" },
                { value: "adverb", label: "Adverb" },
              ],
              expectedAnswer: "noun",
            },
            {
              type: "radio",
              label: "\"The classes <strong>meet</strong> every Tuesday.\"",
              options: [
                { value: "noun", label: "Noun" },
                { value: "verb", label: "Verb" },
                { value: "adjective", label: "Adjective" },
                { value: "adverb", label: "Adverb" },
              ],
              expectedAnswer: "verb",
            },
            {
              type: "radio",
              label: "\"They need a <strong>small</strong> notebook.\"",
              options: [
                { value: "noun", label: "Noun" },
                { value: "verb", label: "Verb" },
                { value: "adjective", label: "Adjective" },
                { value: "adverb", label: "Adverb" },
              ],
              expectedAnswer: "adjective",
            },
            {
              type: "radio",
              label: "\"Amara reads the notice <strong>carefully</strong>.\"",
              options: [
                { value: "noun", label: "Noun" },
                { value: "verb", label: "Verb" },
                { value: "adjective", label: "Adjective" },
                { value: "adverb", label: "Adverb" },
              ],
              expectedAnswer: "adverb",
            },
            {
              type: "radio",
              label: "\"The evening classes are <strong>free</strong>.\"",
              options: [
                { value: "noun", label: "Noun" },
                { value: "verb", label: "Verb" },
                { value: "adjective", label: "Adjective" },
                { value: "adverb", label: "Adverb" },
              ],
              expectedAnswer: "adjective",
            },
          ],
        },
        {
          id: "pos-all-2",
          title: "Fix the sentence",
          instructions:
            "Choose the correct word for each sentence. Sometimes the word in bold is already correct.",
          items: [
            {
              type: "radio",
              label: "\"Dilnoza reads the notice <strong>careful</strong>.\"",
              options: [
                { value: "careful", label: "careful: an adjective, it describes a noun" },
                { value: "carefully", label: "carefully: an adverb, it describes a verb" },
              ],
              expectedAnswer: "carefully",
            },
            {
              type: "radio",
              label: "\"The room is <strong>largely</strong> and comfortable.\"",
              options: [
                { value: "large", label: "large: an adjective, it describes a noun" },
                { value: "largely", label: "largely: an adverb, it describes a verb" },
              ],
              expectedAnswer: "large",
            },
            {
              type: "radio",
              label: "\"Amara is a <strong>careful</strong> reader.\"",
              options: [
                { value: "careful", label: "careful: an adjective, it describes a noun" },
                { value: "carefully", label: "carefully: an adverb, it describes a verb" },
              ],
              expectedAnswer: "careful",
            },
          ],
        },
        {
          id: "pos-all-3",
          title: "Build the sentence",
          instructions: "Unscramble the words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Amara", "and", "Dilnoza", "read", "the", "notice", "together"],
              correctAnswer: "Amara and Dilnoza read the notice together",
              correctAnswers: ["Dilnoza and Amara read the notice together"],
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Amara's", "class", "meets", "on", "Tuesday", "and", "Thursday", "evenings"],
              correctAnswer: "Amara's class meets on Tuesday and Thursday evenings",
            },
          ],
        },
        {
          id: "pos-all-4",
          title: "Write the word type",
          instructions: "Read the notice again. Write the word type: noun, verb, adjective, or adverb.",
          items: [
            {
              type: "text",
              label: "In \"Free English classes start in September,\" what type of word is \"start\"?",
              expectedAnswers: ["verb"],
            },
            {
              type: "text",
              label: "In \"Bring a small notebook,\" what type of word is \"small\"?",
              expectedAnswers: ["adjective"],
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "pos-q1",
      question: "Amara picks up a pencil at the registration desk. Which word is a noun?",
      options: [
        { value: "a", label: "picks" },
        { value: "b", label: "pencil" },
        { value: "c", label: "at" },
      ],
      correctAnswer: "b",
      explanation: "Pencil names a thing. Nouns name people, places, things, and ideas.",
      topic: "nouns",
      skill: "recognition",
      skillTag: "identify-noun",
      difficulty: "easy",
    },
    {
      id: "pos-q2",
      question: "Amara is talking about the class schedule. Which sentence is correct?",
      options: [
        { value: "a", label: "\"I am understanding the schedule.\"" },
        { value: "b", label: "\"I understand the schedule.\"" },
        { value: "c", label: "\"I understanding the schedule.\"" },
      ],
      correctAnswer: "b",
      explanation:
        "Understand is a state verb, so it does not take the -ing form. Other state verbs: know, want, need, remember, like, have.",
      topic: "verbs",
      skill: "usage",
      skillTag: "state-verb-no-ing",
      difficulty: "medium",
    },
    {
      id: "pos-q3",
      question: "\"Samuel is a helpful neighbor in Amara's building.\" Which word is the adjective?",
      options: [
        { value: "a", label: "Samuel" },
        { value: "b", label: "helpful" },
        { value: "c", label: "building" },
      ],
      correctAnswer: "b",
      explanation: "Helpful describes the noun neighbor. It answers 'what kind of neighbor?'",
      topic: "adjectives",
      skill: "recognition",
      skillTag: "identify-adjective",
      difficulty: "easy",
    },
    {
      id: "pos-qws1",
      type: "word-scramble" as const,
      question: "Amara tells a friend about Dilnoza. Put the words in order.",
      words: ["Her", "sister", "has", "a", "part-time", "job"],
      correctAnswer: "Her sister has a part-time job",
      hint: "Adjectives go before the noun",
      explanation: "Adjectives go before the noun in English: a full-time job, not a job full-time.",
      topic: "adjectives",
      skill: "usage",
      skillTag: "adjective-position",
      difficulty: "medium",
    },
    {
      id: "pos-q9",
      question: "Three people describe themselves at the community center. Which sentence has an error?",
      options: [
        { value: "a", label: "\"I have two young children.\"" },
        { value: "b", label: "\"I work hardly every day.\"" },
        { value: "c", label: "\"I live in a small apartment.\"" },
      ],
      correctAnswer: "b",
      explanation: "Hard is the correct adverb here, not hardly. 'I work hard' means with a lot of effort. 'Hardly' means almost not at all, the opposite meaning.",
      topic: "adverbs",
      skill: "error-detection",
      skillTag: "hard-vs-hardly",
      difficulty: "hard",
    },
  ],
};
