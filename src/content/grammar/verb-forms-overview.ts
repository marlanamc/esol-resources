import type { InteractiveGuideContent } from "@/types/activity";
import { verbFormsOverviewImages as img } from "@/data/verb-forms-overview-images.generated";

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

const formCodeRow = (
  code: string,
  name: string,
  example: string,
  color: "terracotta" | "sage" | "blue" | "amber"
): string => `
  <div style="display: flex; gap: 0.75rem; align-items: center; padding: 0.55rem 0.75rem; background: rgba(0,0,0,0.03); border-radius: 0.4rem; flex-wrap: wrap">
    ${labelPill(code, color)}
    <span style="font-size: 0.95rem"><strong>${name}</strong> &nbsp;·&nbsp; <em>${example}</em></span>
  </div>
`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const verbFormsOverviewContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "five-codes",
      title: "Five codes, every week",
      icon: "📱",
      explanation: `
        ${sceneCard("sceneClassNight", "East Boston Adult Ed Center. First week of class, 6 PM.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Every week you will take a <strong>verb quiz</strong> in this app. Each quiz asks about <strong>five forms</strong> of two verbs. Learn the codes now so the quizzes feel familiar, not scary.</p>

        ${dialogue([
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "On the quiz you will see five codes: <strong>V1, V1-3rd, V1-ing, V2,</strong> and <strong>V3</strong>. Same codes every week.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "So I do not have to learn new labels each time?", side: "right", tone: "terracotta" },
          { speaker: "Ms. Tran", avatar: "👩‍🏫", text: "Exactly. Two verbs per quiz. V1 is often filled in for you. You type the other four.", side: "left", tone: "sage" },
          { speaker: "Fernanda", avatar: "👩🏾", text: "Like leveling up in a game. One small step at a time.", side: "right", tone: "blue" },
        ])}

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">The five codes with the verb <em>work</em>:</p>

        <div style="display: grid; gap: 0.45rem; margin: 1rem 0">
          ${formCodeRow("V1", "base form", "work", "terracotta")}
          ${formCodeRow("V1-3rd", "he / she / it", "works", "sage")}
          ${formCodeRow("V1-ing", "-ing form", "working", "blue")}
          ${formCodeRow("V2", "past simple", "worked", "amber")}
          ${formCodeRow("V3", "past participle", "worked", "terracotta")}
        </div>

        <div class="gc-callout-sage" style="background: rgba(106, 141, 115, 0.12); padding: 1rem 1.25rem; border-radius: 0.5rem">
          <p style="margin: 0"><strong>Regular verbs</strong> like <em>work</em> add <em>-ed</em> for V2 and V3. <strong>Irregular verbs</strong> like <em>be</em> and <em>have</em> change more. That is what the weekly quizzes practice.</p>
        </div>
      `,
      exercises: [
        {
          id: "vfo-intro-1",
          title: "Know the codes",
          instructions: "How many forms does each weekly verb quiz ask about?",
          items: [
            {
              type: "radio",
              label: "How many forms per verb on the quiz?",
              options: [
                { value: "3", label: "3 forms" },
                { value: "5", label: "5 forms" },
                { value: "7", label: "7 forms" },
              ],
              expectedAnswer: "5",
            },
            {
              type: "radio",
              label: "Which code is the dictionary form with no ending added?",
              options: [
                { value: "v1", label: "V1" },
                { value: "v1-3rd", label: "V1-3rd" },
                { value: "v2", label: "V2" },
              ],
              expectedAnswer: "v1",
            },
            {
              type: "text",
              label: "For the verb <em>work</em>, the V1 (base) form is ___.",
              expectedAnswers: ["work"],
            },
          ],
        },
      ],
    },

    {
      id: "present-forms",
      stepNumber: 1,
      title: "V1, V1-3rd, V1-ing: forms you use now",
      icon: "🔄",
      explanation: `
        ${sceneCard("sceneWorkShift", "Meridian Street café. Tuesday afternoon shift.", "sage")}

        ${dialogue([
          { speaker: "Minh", avatar: "👨🏽", text: "I <strong>work</strong> here three days a week. My sister <strong>works</strong> mornings only.", side: "right", tone: "terracotta" },
          { speaker: "Manager", avatar: "🧑‍💼", text: "Right now she\'s <strong>working</strong> the register. Can you cover the back?", side: "left", tone: "sage" },
          { speaker: "Minh", avatar: "👨🏽", text: "Sure. I am <strong>having</strong> a break, but I can start in five minutes.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>V1</strong> = base form. <strong>V1-3rd</strong> = he/she/it form (usually add <em>-s</em>). <strong>V1-ing</strong> = base + <em>-ing</em> for actions in progress.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("V1", "terracotta")}
            <span><em>I <strong>work</strong> at a café.</em> &nbsp;·&nbsp; <em>They <strong>have</strong> two kids.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("V1-3rd", "sage")}
            <span><em>She <strong>works</strong> every Saturday.</em> &nbsp;·&nbsp; <em>He <strong>has</strong> a new job.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(38,138,130,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("V1-ing", "blue")}
            <span><em>I am <strong>working</strong> right now.</em> &nbsp;·&nbsp; <em>They are <strong>having</strong> lunch.</em></span>
          </div>
        </div>

        <p style="margin-top: 1rem; font-size: 0.95rem; color: var(--color-text-muted)">On the quiz, V1 is often already filled in. You type V1-3rd, V1-ing, V2, and V3.</p>
      `,
      exercises: [
        {
          id: "vfo-present-1",
          title: "Spot the form",
          instructions: "Choose the correct form for each sentence.",
          items: [
            {
              type: "radio",
              label: "She <strong>works</strong> every Saturday. Which code is <strong>works</strong>?",
              options: [
                { value: "v1", label: "V1" },
                { value: "v1-3rd", label: "V1-3rd" },
                { value: "v1-ing", label: "V1-ing" },
              ],
              expectedAnswer: "v1-3rd",
            },
            {
              type: "radio",
              label: "My brother ___ at Logan Airport. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "works", label: "works" },
                { value: "worked", label: "worked" },
              ],
              expectedAnswer: "works",
            },
            {
              type: "radio",
              label: "Right now, I am ___ on my homework. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "working", label: "working" },
                { value: "worked", label: "worked" },
              ],
              expectedAnswer: "working",
            },
            {
              type: "text",
              label: "My brother ___ at Logan Airport. (work)",
              expectedAnswers: ["works"],
            },
          ],
        },
        {
          id: "vfo-present-2",
          title: "Build the sentence",
          instructions: "Put the words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "has", "two", "jobs", "right", "now"],
              correctAnswer: "She has two jobs right now",
            },
          ],
        },
      ],
    },

    {
      id: "past-forms",
      stepNumber: 2,
      title: "V2 and V3: the past forms",
      icon: "⏪",
      explanation: `
        ${sceneCard("sceneEveningHome", "East Boston. Wednesday evening after class.", "amber")}

        ${dialogue([
          { speaker: "Nadine", avatar: "👩🏾", text: "Yesterday I <strong>worked</strong> until 6. I was so tired.", side: "right", tone: "terracotta" },
          { speaker: "Neighbor", avatar: "🧑🏽", text: "Me too. I\'ve <strong>had</strong> a long shift at the hospital.", side: "left", tone: "sage" },
          { speaker: "Nadine", avatar: "👩🏾", text: "I <strong>have worked</strong> at the school cafeteria for three years now.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>V2</strong> = finished past action. <strong>V3</strong> = the form after <em>have / has / had</em>. You will use V3 a lot later in the year.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="padding: 0.65rem 1rem; border-radius: 0.5rem; border-left: 3px solid #b56e1a; background: rgba(181,110,26,0.07)">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #b56e1a; margin-bottom: 0.3rem">V2. past simple</div>
            <p style="margin: 0"><em>work</em> → <strong>worked</strong> &nbsp;·&nbsp; <em>have</em> → <strong>had</strong></p>
            <p style="margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--color-text-muted)">Yesterday I <strong>worked</strong> until 6.</p>
          </div>
          <div style="padding: 0.65rem 1rem; border-radius: 0.5rem; border-left: 3px solid #6a8d73; background: rgba(106,141,115,0.07)">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6a8d73; margin-bottom: 0.3rem">V3. past participle</div>
            <p style="margin: 0"><em>work</em> → <strong>worked</strong> &nbsp;·&nbsp; <em>have</em> → <strong>had</strong></p>
            <p style="margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--color-text-muted)">I <strong>have worked</strong> here for three years.</p>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <p style="margin: 0; font-style: italic; color: var(--color-text-muted)">On weekly quizzes you learn the V3 form now. Present perfect grammar comes later. For regular verbs, V2 and V3 look the same.</p>
        </div>
      `,
      exercises: [
        {
          id: "vfo-past-1",
          title: "Choose V2 or V3",
          instructions: "Read the sentence. Which form fits?",
          items: [
            {
              type: "radio",
              label: "Last night I ___ until 10 pm. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "working", label: "working" },
                { value: "worked", label: "worked" },
              ],
              expectedAnswer: "worked",
            },
            {
              type: "radio",
              label: "I have ___ here since January. (work)",
              options: [
                { value: "work", label: "work" },
                { value: "worked", label: "worked" },
                { value: "working", label: "working" },
              ],
              expectedAnswer: "worked",
            },
            {
              type: "radio",
              label: "She ___ a good salary last year. (have)",
              options: [
                { value: "has", label: "has" },
                { value: "had", label: "had" },
                { value: "having", label: "having" },
              ],
              expectedAnswer: "had",
            },
            {
              type: "text",
              label: "Last night I ___ until 10 pm. (work)",
              expectedAnswers: ["worked"],
            },
          ],
        },
      ],
    },

    {
      id: "be-and-have",
      stepNumber: 3,
      title: "be and have: the tricky ones",
      icon: "⚡",
      explanation: `
        ${sceneCard("sceneClassNight", "Same classroom. Ms. Tran writes the chart on the board.", "blue")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Your first quiz focuses on <strong>be</strong> and <strong>have</strong>. These verbs do not follow the regular pattern. Every form is different.</p>

        <div style="display: grid; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 1rem 1.15rem; border-radius: 0.65rem; border: 1px solid rgba(176,87,64,0.2); background: rgba(176,87,64,0.05)">
            <p style="margin: 0 0 0.65rem 0; font-weight: 700; font-size: 1.05rem">be</p>
            <div style="display: grid; gap: 0.35rem; font-size: 0.92rem">
              ${formCodeRow("V1", "am / are", "I am · you are", "terracotta")}
              ${formCodeRow("V1-3rd", "is", "she is", "sage")}
              ${formCodeRow("V1-ing", "being", "I am being careful", "blue")}
              ${formCodeRow("V2", "was / were", "I was · they were", "amber")}
              ${formCodeRow("V3", "been", "I have been here", "terracotta")}
            </div>
          </div>
          <div style="padding: 1rem 1.15rem; border-radius: 0.65rem; border: 1px solid rgba(106,141,115,0.25); background: rgba(106,141,115,0.06)">
            <p style="margin: 0 0 0.65rem 0; font-weight: 700; font-size: 1.05rem">have</p>
            <div style="display: grid; gap: 0.35rem; font-size: 0.92rem">
              ${formCodeRow("V1", "have", "I have two kids", "terracotta")}
              ${formCodeRow("V1-3rd", "has", "she has a car", "sage")}
              ${formCodeRow("V1-ing", "having", "we are having dinner", "blue")}
              ${formCodeRow("V2", "had", "I had a meeting", "amber")}
              ${formCodeRow("V3", "had", "I have had this job", "terracotta")}
            </div>
          </div>
        </div>

        <div style="background: rgba(176,87,64,0.07); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 700; font-size: 0.88rem; text-transform: uppercase; color: #b05740; margin-bottom: 0.25rem">Watch out</p>
          <p style="margin: 0; font-size: 0.95rem">With <em>be</em>, V1 is not one word. It is <strong>am / are</strong> (and <strong>is</strong> for V1-3rd). V2 is <strong>was / were</strong>, not <em>beed</em>.</p>
        </div>
      `,
      exercises: [
        {
          id: "vfo-be-have-1",
          title: "be and have on the quiz",
          instructions: "Choose the correct form.",
          items: [
            {
              type: "radio",
              label: "They have ___ friends in East Boston for years. (be)",
              options: [
                { value: "was", label: "was" },
                { value: "were", label: "were" },
                { value: "been", label: "been" },
              ],
              expectedAnswer: "been",
            },
            {
              type: "radio",
              label: "Last year she ___ a nurse at the clinic. (be)",
              options: [
                { value: "is", label: "is" },
                { value: "was", label: "was" },
                { value: "been", label: "been" },
              ],
              expectedAnswer: "was",
            },
            {
              type: "radio",
              label: "He ___ two jobs right now. (have)",
              options: [
                { value: "have", label: "have" },
                { value: "has", label: "has" },
                { value: "had", label: "had" },
              ],
              expectedAnswer: "has",
            },
            {
              type: "text",
              label: "Last year she ___ a nurse at the clinic. (be)",
              expectedAnswers: ["was"],
            },
          ],
        },
      ],
    },

    {
      id: "quiz-ready",
      stepNumber: 4,
      title: "Ready for Verb Quiz 1",
      icon: "✅",
      explanation: `
        ${sceneCard("sceneAppQuiz", "After class. Carlos opens the app on his Chromebook.", "sage")}

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Okay, Verb Quiz 1. <strong>be</strong> and <strong>have</strong>. I know what V1 through V3 mean now.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏾", text: "Same codes every week. Two verbs at a time. That helps.", side: "left", tone: "blue" },
        ])}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">You do not need to memorize everything today. This guide gives you the map. The quiz helps you practice two verbs at a time.</p>

        <div style="display: grid; gap: 0.45rem; margin: 1rem 0">
          ${[
            ["V1-3rd", "third person (he/she/it)", "v1-3rd"],
            ["V3", "after have / has", "v3"],
          ].map(([code, desc, val]) => `
            <div style="padding: 0.6rem 0.85rem; border-radius: 0.45rem; background: rgba(106,141,115,0.08); display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center">
              <strong>${code}</strong>
              <span style="font-size: 0.92rem">${desc}</span>
            </div>
          `).join("")}
        </div>

        <div class="gc-callout-sage" style="background: rgba(106, 141, 115, 0.12); padding: 1rem 1.25rem; border-radius: 0.5rem">
          <p style="margin: 0">Open <strong>Verb Quiz 1: be + have</strong> from the course map when your teacher releases it. You already know the five codes.</p>
        </div>
      `,
      exercises: [
        {
          id: "vfo-ready-1",
          title: "Match the code",
          instructions: "Connect each code to the right description.",
          items: [
            {
              type: "radio",
              label: "Which code is <strong>third person (he/she/it)</strong>?",
              options: [
                { value: "v1", label: "V1" },
                { value: "v1-3rd", label: "V1-3rd" },
                { value: "v2", label: "V2" },
              ],
              expectedAnswer: "v1-3rd",
            },
            {
              type: "radio",
              label: "Which code goes after <em>have / has</em>?",
              options: [
                { value: "v1-ing", label: "V1-ing" },
                { value: "v2", label: "V2" },
                { value: "v3", label: "V3" },
              ],
              expectedAnswer: "v3",
            },
            {
              type: "text",
              label: "Verb Quiz 1 practices the verbs ___ and ___.",
              expectedAnswers: ["be and have", "be, have", "have and be"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content:
          "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/simple-tenses-review\" style=\"font-weight:700;text-decoration:underline\">Verb Forms Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "vfo-q1",
      question: "Carlos opens his weekly verb quiz. How many forms does he need to know for each verb?",
      options: [
        { value: "a", label: "3 forms" },
        { value: "b", label: "5 forms" },
        { value: "c", label: "7 forms" },
      ],
      correctAnswer: "b",
      explanation: "Every weekly verb quiz uses the same five codes: V1, V1-3rd, V1-ing, V2, and V3.",
      topic: "verb-codes",
      skill: "recognition",
      skillTag: "five-form-codes",
      difficulty: "easy",
    },
    {
      id: "vfo-q2",
      question: "Minh writes on his intake form: \"I ___ at a café on Meridian Street.\" Which is the V1 (base) form?",
      options: [
        { value: "a", label: "works" },
        { value: "b", label: "work" },
        { value: "c", label: "working" },
      ],
      correctAnswer: "b",
      explanation: "V1 is the dictionary form with no ending added: work.",
      topic: "v1",
      skill: "usage",
      skillTag: "base-form",
      difficulty: "easy",
    },
    {
      id: "vfo-q3",
      question: "Fernanda's son goes to school every morning. She says: \"He ___ the bus at 7:15.\" Which form fits?",
      options: [
        { value: "a", label: "take" },
        { value: "b", label: "takes" },
        { value: "c", label: "taking" },
      ],
      correctAnswer: "b",
      explanation: "V1-3rd is the he/she/it form. With he, add -s: takes.",
      topic: "v1-3rd",
      skill: "usage",
      skillTag: "third-person-s",
      difficulty: "easy",
    },
    {
      id: "vfo-q4",
      question: "Right now Nadine is on her break. Which sentence is correct?",
      options: [
        { value: "a", label: "Nadine work right now." },
        { value: "b", label: "Nadine is working right now." },
        { value: "c", label: "Nadine worked right now." },
      ],
      correctAnswer: "b",
      explanation: "V1-ing (working) goes with am/is/are for actions in progress right now.",
      topic: "v1-ing",
      skill: "usage",
      skillTag: "progress-now",
      difficulty: "medium",
    },
    {
      id: "vfo-q5",
      question: "Yesterday Carlos ___ until 9 pm. Which is V2 (past simple)?",
      options: [
        { value: "a", label: "work" },
        { value: "b", label: "worked" },
        { value: "c", label: "have worked" },
      ],
      correctAnswer: "b",
      explanation: "V2 is the finished past form. Yesterday + worked.",
      topic: "v2",
      skill: "usage",
      skillTag: "past-simple-form",
      difficulty: "medium",
    },
    {
      id: "vfo-q6",
      question: "Nadine has ___ at the cafeteria for three years. Which is V3?",
      options: [
        { value: "a", label: "work" },
        { value: "b", label: "worked" },
        { value: "c", label: "working" },
      ],
      correctAnswer: "b",
      explanation: "After have/has, use V3. For regular verbs like work, V3 is worked.",
      topic: "v3",
      skill: "usage",
      skillTag: "past-participle-after-have",
      difficulty: "medium",
    },
    {
      id: "vfo-q7",
      question: "Which sentence has the wrong form of be?",
      options: [
        { value: "a", label: "They were at class last night." },
        { value: "b", label: "She was tired after work." },
        { value: "c", label: "I be a student here." },
      ],
      correctAnswer: "c",
      explanation: "V1 of be is am/are/is, not be. Say I am a student here.",
      topic: "be",
      skill: "error-detection",
      skillTag: "be-v1-not-bee",
      difficulty: "medium",
    },
    {
      id: "vfo-q8",
      question: "Which sentence uses has correctly as V1-3rd?",
      options: [
        { value: "a", label: "She have a new schedule." },
        { value: "b", label: "She has a new schedule." },
        { value: "c", label: "She having a new schedule." },
      ],
      correctAnswer: "b",
      explanation: "With she, the V1-3rd form of have is has.",
      topic: "have",
      skill: "error-detection",
      skillTag: "have-third-person",
      difficulty: "medium",
    },
    {
      id: "vfo-q9",
      question: "On Verb Quiz 1, which two verbs will Carlos practice?",
      options: [
        { value: "a", label: "do and make" },
        { value: "b", label: "be and have" },
        { value: "c", label: "go and come" },
      ],
      correctAnswer: "b",
      explanation: "Verb Quiz 1 in Week 1 focuses on be and have.",
      topic: "verb-quiz",
      skill: "recognition",
      skillTag: "quiz-1-verbs",
      difficulty: "easy",
    },
    {
      id: "vfo-q10",
      question: "Fernanda wants to say she finished a task before now. Which sentence fits?",
      options: [
        { value: "a", label: "I have finish my form." },
        { value: "b", label: "I have finished my form." },
        { value: "c", label: "I finished have my form." },
      ],
      correctAnswer: "b",
      explanation: "After have, use V3. The V3 of finish is finished.",
      topic: "v3",
      skill: "error-detection",
      skillTag: "have-plus-v3",
      difficulty: "hard",
    },
  ],
};
