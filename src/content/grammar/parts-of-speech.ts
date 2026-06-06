import type { InteractiveGuideContent } from "@/types/activity";
import { partsOfSpeechImages as img } from "@/data/parts-of-speech-images.generated";

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

export const partsOfSpeechContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Nouns
    // =========================================================================
    {
      id: "nouns",
      title: "Nouns: naming the world around you",
      icon: "🧱",
      explanation: `
        ${sceneCard("sceneFrontDesk", "East Boston Community Center. Tuesday, 5:30 PM.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara walks in to sign up for a free English class. James at the front desk greets her. A poster says <strong>Hispanic Heritage Month</strong> starts September 15. Her daughter saw the same sign at school. Every sign, every room, every person has a <strong>name</strong>. Those names are nouns.</p>

        ${dialogue([
          { speaker: "Volunteer", avatar: "🙋", text: "Welcome! This is the <strong>registration desk</strong>. Can I get your <strong>name</strong> and <strong>address</strong>?", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏾", text: "My name is Amara. I live on Meridian <strong>Street</strong>, near the <strong>hospital</strong>.", side: "right", tone: "terracotta" },
          { speaker: "Volunteer", avatar: "🙋", text: "Great. The <strong>classroom</strong> is on the second <strong>floor</strong>. You will need a <strong>pencil</strong> and a <strong>notebook</strong>.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏾", text: "Thank you. I already have a <strong>bag</strong> with my <strong>supplies</strong>.", side: "right", tone: "terracotta" },
        ])}

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
          instructions: "What kind of noun is it?",
          items: [
            {
              type: "radio",
              label: "What kind of noun is the word 'hospital'?",
              options: [
                { value: "person", label: "Person" },
                { value: "place", label: "Place" },
                { value: "thing", label: "Thing" },
                { value: "idea", label: "Idea" },
              ],
              expectedAnswer: "place",
            },
            {
              type: "radio",
              label: "What kind of noun is the word 'education'?",
              options: [
                { value: "person", label: "Person" },
                { value: "place", label: "Place" },
                { value: "thing", label: "Thing" },
                { value: "idea", label: "Idea" },
              ],
              expectedAnswer: "idea",
            },
            {
              type: "radio",
              label: "What kind of noun is the word 'notebook'?",
              options: [
                { value: "person", label: "Person" },
                { value: "place", label: "Place" },
                { value: "thing", label: "Thing" },
                { value: "idea", label: "Idea" },
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
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "classroom", "is", "on", "the", "second", "floor"],
              correctAnswer: "The classroom is on the second floor",
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
              label: "one class / two ___",
              expectedAnswers: ["classes"],
            },
            {
              type: "text",
              label: "one student / many ___",
              expectedAnswers: ["students"],
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
        ${sceneCard("sceneFormTable", "Community center. Amara fills out the form. Carlos helps at the desk.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara is filling out the form. Carlos, a volunteer, stops by to help. Their conversation uses two very different kinds of verbs.</p>

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Do you <strong>need</strong> help? I <strong>speak</strong> Spanish and a little Haitian Creole from working in the neighborhood.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏾", text: "Really? I <strong>know</strong> you from the neighborhood! You <strong>work</strong> at the corner store, right?", side: "right", tone: "terracotta" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I <strong>work</strong> there on weekends. Right now I <strong>volunteer</strong> here. I <strong>help</strong> new students <strong>find</strong> the right class.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏾", text: "I <strong>understand</strong>. I <strong>want</strong> the Tuesday evening class. I <strong>remember</strong> seeing the flyer.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0; font-size: 1.05rem">There are two types of verbs. <strong>Action verbs</strong> describe things you do. <strong>State verbs</strong> describe things that are true about you. what you feel, know, have, or think.</p>
        </div>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">Action verbs: things you do</p>
        <div style="display: grid; gap: 0.5rem; margin: 0 0 1.25rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("action", "sage")}
            <span><em>Carlos <strong>helps</strong> students every Tuesday. He <strong>explains</strong> the schedule.</em></span>
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
            <span><em>Amara <strong>knows</strong> Carlos from the neighborhood. She <strong>remembers</strong> his face.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("state", "terracotta")}
            <span><em>She <strong>wants</strong> the Tuesday class. She <strong>understands</strong> why it is a good fit.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("state", "terracotta")}
            <span><em>Carlos <strong>speaks</strong> Spanish and some Haitian Creole. He <strong>needs</strong> to practice more.</em></span>
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
              label: "Carlos <strong>helps</strong> new students every Tuesday.",
              options: [
                { value: "action", label: "Action verb. you can watch someone do it" },
                { value: "state", label: "State verb. describes a feeling, fact, or mental state" },
              ],
              expectedAnswer: "action",
            },
            {
              type: "radio",
              label: "Amara <strong>knows</strong> Carlos from the neighborhood.",
              options: [
                { value: "action", label: "Action verb. you can watch someone do it" },
                { value: "state", label: "State verb. describes a feeling, fact, or mental state" },
              ],
              expectedAnswer: "state",
            },
            {
              type: "radio",
              label: "She <strong>fills out</strong> the form at the registration desk.",
              options: [
                { value: "action", label: "Action verb. you can watch someone do it" },
                { value: "state", label: "State verb. describes a feeling, fact, or mental state" },
              ],
              expectedAnswer: "action",
            },
            {
              type: "radio",
              label: "Carlos <strong>wants</strong> to practice his Haitian Creole.",
              options: [
                { value: "action", label: "Action verb. you can watch someone do it" },
                { value: "state", label: "State verb. describes a feeling, fact, or mental state" },
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
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: I know all the students." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Carlos is helping a student right now.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"She is wanting the Tuesday evening class.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: She wants the Tuesday evening class." },
              ],
              expectedAnswer: "incorrect",
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
              label: "Amara ___ the Tuesday evening class. (want)",
              expectedAnswers: ["wants"],
            },
            {
              type: "text",
              label: "Carlos ___ new students find the right class. (help)",
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
              words: ["Carlos", "helps", "new", "students", "every", "Tuesday"],
              correctAnswer: "Carlos helps new students every Tuesday",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Amara", "knows", "Carlos", "from", "the", "neighborhood"],
              correctAnswer: "Amara knows Carlos from the neighborhood",
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
      stepNumber: 2,
      title: "Adjectives: describing words",
      icon: "🎨",
      explanation: `
        ${sceneCard("sceneAdjectivesFriends", "Community center. Amara fills out the form. Dilnoza sits next to her.", "amber")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Dilnoza is helping Amara with the "About You" section. Nouns alone are not enough. Amara needs to <strong>describe</strong> things.</p>

        ${dialogue([
          { speaker: "Dilnoza", avatar: "👩🏻", text: "It says 'describe your schedule.' What do you write?", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏾", text: "I have a <strong>full-time</strong> job. I work <strong>long</strong> hours. I have <strong>two</strong> children.", side: "right", tone: "terracotta" },
          { speaker: "Dilnoza", avatar: "👩🏻", text: "Good. I wrote '<strong>small</strong> apartment' and '<strong>busy</strong> schedule' for mine.", side: "left", tone: "amber" },
          { speaker: "Amara", avatar: "👩🏾", text: "I live in a <strong>new</strong> building but it is a <strong>small</strong> space for four people.", side: "right", tone: "terracotta" },
        ])}

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
              type: "text",
              label: "Amara has a ___ job at a busy hospital. (full-time)",
              expectedAnswers: ["full-time", "fulltime"],
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
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'a busy schedule.'" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"The new building has two small rooms.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"They have children three.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'three children.'" },
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
      ],
    },

    // =========================================================================
    // SECTION 3. Adverbs
    // =========================================================================
    {
      id: "adverbs",
      stepNumber: 3,
      title: "Adverbs: how, when, how often",
      icon: "⚡",
      explanation: `
        ${sceneCard("sceneVolunteer", "Community center. Carlos answers questions about the volunteer schedule.", "blue")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">The coordinator is writing down volunteer hours. Carlos explains his schedule. He uses <strong>adverbs</strong> to say how, when, and how often he does things.</p>

        ${dialogue([
          { speaker: "Coordinator", avatar: "📋", text: "How often can you volunteer, Carlos?", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I come <strong>every Tuesday</strong>. I work <strong>quickly</strong> and I finish <strong>early</strong>, so I can help <strong>after</strong> my shift.", side: "right", tone: "sage" },
          { speaker: "Coordinator", avatar: "📋", text: "Do you speak English well?", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "I speak it <strong>pretty well</strong> now. I practiced <strong>hard</strong> last year.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Adverbs</strong> describe verbs. They answer <em>how?</em>, <em>when?</em>, or <em>how often?</em> Many adverbs end in <strong>-ly</strong> (quickly, carefully, quietly). But not all of them do (well, hard, early, fast).</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("how", "blue")}
            <span><em>Carlos works <strong>quickly</strong>. He speaks English <strong>well</strong>.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(100,149,237,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("when", "blue")}
            <span><em>He finishes <strong>early</strong>. He comes <strong>after</strong> his shift on Tuesdays.</em></span>
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
              <span style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; color: #b05740; text-transform: uppercase">Adjective</span>
              <span><em>Carlos is a <strong>quick</strong> worker.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the noun "worker")</span></span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: baseline; flex-wrap: wrap">
              <span style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; color: #268a82; text-transform: uppercase">Adverb</span>
              <span><em>Carlos works <strong>quickly</strong>.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the verb "works")</span></span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: baseline; flex-wrap: wrap">
              <span style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; color: #b05740; text-transform: uppercase">Adjective</span>
              <span><em>His English is <strong>good</strong>.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the noun "English")</span></span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: baseline; flex-wrap: wrap">
              <span style="min-width: 7rem; font-size: 0.8rem; font-weight: 700; color: #268a82; text-transform: uppercase">Adverb</span>
              <span><em>He speaks English <strong>well</strong>.</em> <span style="font-size: 0.85rem; color: var(--color-text-muted)">(describes the verb "speaks")</span></span>
            </div>
          </div>
        </div>
      `,
      tipBox: {
        title: "good vs. well",
        content:
          "Good is an adjective. Well is an adverb. His English is good. He speaks English well. This pair catches many learners.",
      },
      exercises: [
        {
          id: "pos-adv-1",
          title: "Adjective or adverb?",
          instructions: "Choose the correct word for each sentence.",
          items: [
            {
              type: "radio",
              label: "Carlos is a ___ volunteer. He helps everyone. (quick / quickly)",
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
              label: "Her pronunciation is ___. Her teacher is happy with her progress. (good / well)",
              options: [
                { value: "good", label: "good (adjective)" },
                { value: "well", label: "well (adverb)" },
              ],
              expectedAnswer: "good",
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
              label: "Carlos explains the form ___. Everyone understands. (clear)",
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
      stepNumber: 4,
      title: "All four working together",
      icon: "🔍",
      explanation: `
        ${sceneCard("sceneBulletinBoard", "Community center bulletin board. Yemi and Linh read an announcement.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">After signing up, Yemi and Linh stop at the bulletin board. They read an announcement and help each other figure out the word types.</p>

        ${dialogue([
          { speaker: "Yemi", avatar: "👨🏿", text: "Look at this notice. 'Free <strong>English</strong> classes start <strong>Monday</strong>.' English and Monday are both nouns, right?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "Yes. And 'start' is the verb. What about 'free'?", side: "right", tone: "blue" },
          { speaker: "Yemi", avatar: "👨🏿", text: "'Free' describes 'classes.' That's an adjective. And 'every Tuesday <strong>evening</strong>'... 'every Tuesday' tells us when.", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "So 'every Tuesday' is an adverb because it tells us when the classes <strong>meet</strong>. Got it!", side: "right", tone: "blue" },
        ])}

        <div style="padding: 1.1rem 1.25rem; border-radius: 0.5rem; background: rgba(106,141,115,0.08); border: 1px solid rgba(106,141,115,0.2); margin: 1.25rem 0">
          <p style="margin: 0 0 0.75rem 0; font-weight: 600; font-size: 0.95rem">The notice on the bulletin board:</p>
          <p style="margin: 0 0 0.35rem 0; font-size: 1.05rem; line-height: 1.7"><em>Free <span style="color:#b05740;font-weight:700">English</span> classes <span style="color:#268a82;font-weight:700">start</span> Monday. Classes <span style="color:#268a82;font-weight:700">meet</span> every Tuesday evening in the <span style="color:#b56e1a;font-weight:700">large</span> room. <span style="color:#268a82;font-weight:700">Bring</span> a pencil and a <span style="color:#b56e1a;font-weight:700">small</span> notebook.</em></p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem">
            ${labelPill("nouns", "terracotta")}
            <span style="font-size: 0.88rem; align-self: center">English, classes, Monday, room, pencil, notebook</span>
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
            <span style="font-size: 0.88rem; align-self: center">every Tuesday evening (tells us when)</span>
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
              label: "\"Yemi reads the <strong>notice</strong> on the board.\"",
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
              label: "\"Linh reads the notice <strong>carefully</strong>.\"",
              options: [
                { value: "noun", label: "Noun" },
                { value: "verb", label: "Verb" },
                { value: "adjective", label: "Adjective" },
                { value: "adverb", label: "Adverb" },
              ],
              expectedAnswer: "adverb",
            },
            {
              type: "text",
              label: "They need a ___ notebook. (small)",
              expectedAnswers: ["small"],
            },
          ],
        },
        {
          id: "pos-all-2",
          title: "Fix the sentence",
          instructions: "One word is in the wrong form. Choose the correct option.",
          items: [
            {
              type: "radio",
              label: "\"Yemi reads the announcement <strong>careful</strong>.\"",
              options: [
                { value: "careful", label: "careful (adjective). correct as is" },
                { value: "carefully", label: "carefully (adverb). reads how?" },
              ],
              expectedAnswer: "carefully",
            },
            {
              type: "radio",
              label: "\"The room is <strong>largely</strong> and comfortable.\"",
              options: [
                { value: "largely", label: "largely (adverb). correct as is" },
                { value: "large", label: "large (adjective). describes the room" },
              ],
              expectedAnswer: "large",
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
              words: ["Yemi", "and", "Linh", "read", "the", "notice", "together"],
              correctAnswer: "Yemi and Linh read the notice together",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Free", "classes", "start", "every", "Tuesday", "evening"],
              correctAnswer: "Free classes start every Tuesday evening",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    // 4 easy
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
      question: "\"Dilnoza speaks English well.\" Which word is the verb?",
      options: [
        { value: "a", label: "Dilnoza" },
        { value: "b", label: "English" },
        { value: "c", label: "speaks" },
      ],
      correctAnswer: "c",
      explanation: "Speaks is the verb. It shows the action Dilnoza does.",
      topic: "verbs",
      skill: "recognition",
      skillTag: "identify-verb",
      difficulty: "easy",
    },
    {
      id: "pos-q3",
      question: "\"Carlos is a helpful volunteer at the community center.\" Which word is the adjective?",
      options: [
        { value: "a", label: "Carlos" },
        { value: "b", label: "helpful" },
        { value: "c", label: "center" },
      ],
      correctAnswer: "b",
      explanation: "Helpful describes the noun volunteer. It answers 'what kind of volunteer?'",
      topic: "adjectives",
      skill: "recognition",
      skillTag: "identify-adjective",
      difficulty: "easy",
    },
    {
      id: "pos-q4",
      question: "\"Yemi reads the notice quickly.\" Which word is the adverb?",
      options: [
        { value: "a", label: "notice" },
        { value: "b", label: "reads" },
        { value: "c", label: "quickly" },
      ],
      correctAnswer: "c",
      explanation: "Quickly describes the verb reads. It answers 'how does he read?'",
      topic: "adverbs",
      skill: "recognition",
      skillTag: "identify-adverb",
      difficulty: "easy",
    },
    // 4 medium
    {
      id: "pos-q5",
      question: "Amara says: \"I ___ the Tuesday evening class.\" Which verb fits here?",
      options: [
        { value: "a", label: "am wanting" },
        { value: "b", label: "want" },
        { value: "c", label: "wanted" },
      ],
      correctAnswer: "b",
      explanation: "Want is a state verb. State verbs describe mental states and are not used in the -ing form.",
      topic: "verbs",
      skill: "usage",
      skillTag: "state-verb-no-continuous",
      difficulty: "medium",
    },
    {
      id: "pos-q6",
      question: "The coordinator asks Carlos about his English. Which answer is correct?",
      options: [
        { value: "a", label: "My English is well." },
        { value: "b", label: "My English is good." },
        { value: "c", label: "My English is goodly." },
      ],
      correctAnswer: "b",
      explanation: "Good is an adjective. Use it after is to describe a noun. Well is an adverb for describing actions (he speaks well).",
      topic: "adjectives",
      skill: "usage",
      skillTag: "good-vs-well",
      difficulty: "medium",
    },
    {
      id: "pos-q7",
      question: "Amara needs to describe her job on the form. Which is correct?",
      options: [
        { value: "a", label: "I have a job full-time." },
        { value: "b", label: "I have a full-time job." },
        { value: "c", label: "I have a job full-timely." },
      ],
      correctAnswer: "b",
      explanation: "Adjectives go before the noun in English: a full-time job, not a job full-time.",
      topic: "adjectives",
      skill: "usage",
      skillTag: "adjective-position",
      difficulty: "medium",
    },
    {
      id: "pos-q8",
      question: "Linh wants to describe how she studies. Which sentence is correct?",
      options: [
        { value: "a", label: "Linh studies careful every night." },
        { value: "b", label: "Linh studies carefully every night." },
        { value: "c", label: "Linh studies carefully every nightly." },
      ],
      correctAnswer: "b",
      explanation: "Carefully is the adverb that describes the verb studies. Night is a noun, not an adverb, so nightly is wrong here.",
      topic: "adverbs",
      skill: "usage",
      skillTag: "adverb-form-verb-description",
      difficulty: "medium",
    },
    // 2 hard (error detection)
    {
      id: "pos-q9",
      question: "Three people describe themselves at the community center. Which sentence has an error?",
      options: [
        { value: "a", label: "\"I have two young children.\"" },
        { value: "b", label: "\"I work hardly every day.\"" },
        { value: "c", label: "\"I live in a small apartment.\"" },
      ],
      correctAnswer: "b",
      explanation: "Hard is the correct adverb here, not hardly. 'I work hard' means with a lot of effort. 'Hardly' means almost not at all, which is the opposite meaning.",
      topic: "adverbs",
      skill: "error-detection",
      skillTag: "hard-vs-hardly",
      difficulty: "hard",
    },
    {
      id: "pos-q10",
      question: "Carlos reads two sentences from a community flyer. Which one is wrong?",
      options: [
        { value: "a", label: "\"The classes are free and open to everyone.\"" },
        { value: "b", label: "\"Volunteers work closely with new students.\"" },
        { value: "c", label: "\"The room is largely and comfortable.\"" },
      ],
      correctAnswer: "c",
      explanation: "Large is the correct adjective here, not largely. Largely is an adverb and cannot describe the noun room after the verb is.",
      topic: "adjectives",
      skill: "error-detection",
      skillTag: "adjective-vs-adverb-after-be",
      difficulty: "hard",
    },
  ],
};
