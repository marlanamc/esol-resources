import type { InteractiveGuideContent } from "@/types/activity";
import { justAlreadyYetImages as img } from "@/data/just-already-yet-images.generated";

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
// Placement diagram helper. shows where the word sits in the sentence
// ---------------------------------------------------------------------------

const placementDiagram = (parts: { text: string; highlight?: boolean; dim?: boolean }[]): string => {
  const spans = parts
    .map((p) => {
      if (p.highlight) {
        return `<span style="background: #e9c46a; color: #1a202c; padding: 0.15rem 0.55rem; border-radius: 0.3rem; font-weight: 800; font-size: 1rem">${p.text}</span>`;
      }
      if (p.dim) {
        return `<span style="opacity: 0.55; font-size: 0.95rem">${p.text}</span>`;
      }
      return `<span style="font-weight: 600; font-size: 0.95rem">${p.text}</span>`;
    })
    .join(`<span style="opacity: 0.35; margin: 0 0.2rem">+</span>`);

  return `
    <div style="background: rgba(106,141,115,0.08); border: 1px solid rgba(106,141,115,0.2); border-radius: 0.5rem; padding: 0.85rem 1.1rem; margin: 1rem 0; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; font-family: inherit; line-height: 1.8">
      ${spans}
    </div>
  `;
};

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const justAlreadyYetContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. ALREADY
    // =========================================================================
    {
      id: "meaning-already",
      stepNumber: 1,
      title: "She's already done it: ALREADY",
      icon: "✅",
      tenseDiagram: {
        title: "Already: done before now",
        elements: [
          { id: "already-arc", type: "arc", zone: "past", position: 72, verbLabel: "done (before now)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneCommunityCenter", "East Boston Community Center, front desk. Tuesday morning.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Nadine stops by before class. Mark from her building called about the food pantry too.</p>

        ${dialogue([
          { speaker: "Staff", avatar: "👨🏽", text: "Hi, are you here to pick up your EBT card?", side: "left", tone: "sage" },
          { speaker: "Nadine", avatar: "👩🏾", text: "No, I <strong>have already picked</strong> it up. I came in last week.", side: "right", tone: "terracotta" },
          { speaker: "Staff", avatar: "👨🏽", text: "Oh great, you <strong>have already taken</strong> care of that. Is there anything else I can help with?", side: "left", tone: "sage" },
          { speaker: "Nadine", avatar: "👩🏾", text: "Yes, actually. I <strong>haven't signed</strong> up for the food pantry <strong>yet</strong>.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>ALREADY</strong> = done before now, sooner than expected, or to confirm something is finished. It does <strong>not</strong> tell you when it happened.</p>
        </div>

        <p style="margin: 0.75rem 0 0.4rem; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: #6a8d73">Where does ALREADY go?</p>
        <p style="margin: 0 0 0.5rem; font-size: 0.95rem">ALREADY sits between <strong>have / has</strong> and the <strong>past participle (V3)</strong>. It never moves to the end.</p>

        ${placementDiagram([
          { text: "She" },
          { text: "has" },
          { text: "ALREADY", highlight: true },
          { text: "picked up" },
          { text: "her card." },
        ])}

        ${placementDiagram([
          { text: "I" },
          { text: "have" },
          { text: "ALREADY", highlight: true },
          { text: "signed" },
          { text: "the form." },
        ])}

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("done", "sage")}
            <span><em>Nadine <strong>has already picked</strong> up her EBT card.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("sooner than expected", "sage")}
            <span><em>The appointment <strong>has already started</strong>. You are late.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("confirming", "sage")}
            <span><em>"Do you need help?" "No thanks, someone <strong>has already helped</strong> me."</em></span>
          </div>
        </div>

        <div style="background: rgba(176,87,64,0.07); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 700; font-size: 0.88rem; text-transform: uppercase; color: #b05740; margin-bottom: 0.25rem">Common mistake</p>
          <p style="margin: 0; font-size: 0.95rem">✗ &nbsp;<em>She has picked up her card <strong>already</strong>.</em> &nbsp; (already at the end. not the standard position)</p>
          <p style="margin: 0.35rem 0 0; font-size: 0.95rem">✓ &nbsp;<em>She <strong>has already picked</strong> up her card.</em></p>
        </div>
      `,
      exercises: [
        {
          id: "jay-already-1",
          title: "Where does ALREADY go?",
          instructions: "Choose the sentence where ALREADY is in the correct position.",
          items: [
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "Nadine already has picked up her EBT card." },
                { value: "b", label: "Nadine has already picked up her EBT card." },
                { value: "c", label: "Nadine has picked up already her EBT card." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "I have signed already the form." },
                { value: "b", label: "Already I have signed the form." },
                { value: "c", label: "I have already signed the form." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "The staff member says: \"Someone ___ you.\" (help. use already)",
              options: [
                { value: "a", label: "has already helped" },
                { value: "b", label: "already has helped" },
                { value: "c", label: "has helped already" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "Nadine ___ already picked up her EBT card.",
              expectedAnswers: ["has"],
            },
          ],
        },
        {
          id: "jay-already-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence with ALREADY.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "has", "already", "called", "the", "community", "center"],
              correctAnswer: "She has already called the community center",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "already", "filled", "out", "the", "form"],
              correctAnswer: "I have already filled out the form",
            },
          ],
        },
      ],
      tipBox: {
        title: "Memory trick",
        content: "Already sits in the middle: have + ALREADY + V3. Think of it as being sandwiched between have and the action word.",
      },
    },

    // =========================================================================
    // SECTION 2. JUST
    // =========================================================================
    {
      id: "meaning-just",
      stepNumber: 2,
      title: "Just finished: JUST",
      icon: "⚡",
      tenseDiagram: {
        title: "Just: a moment ago, very close to now",
        elements: [
          { id: "just-arc", type: "arc", zone: "past", position: 90, verbLabel: "just happened" },
        ],
      },
      explanation: `
        ${sceneCard("scenePharmacy", "Pharmacy on Chelsea Street. Thursday afternoon.", "amber")}

        ${dialogue([
          { speaker: "Neighbor", avatar: "👨🏽", text: "Hey Carlos, coming back from the pharmacy?", side: "left", tone: "amber" },
          { speaker: "Carlos", avatar: "🧑🏽", text: "Yeah, I <strong>have just picked</strong> up my prescription. The line was crazy.", side: "right", tone: "terracotta" },
          { speaker: "Neighbor", avatar: "👨🏽", text: "I know. I\'ve <strong>just gotten</strong> back from there too. Did they have everything?", side: "left", tone: "amber" },
          { speaker: "Carlos", avatar: "🧑🏽", text: "Yes, they <strong>have just restocked</strong>. Good timing.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>JUST</strong> = very recently, a short time ago. The action finished moments ago or today.</p>
        </div>

        <p style="margin: 0.75rem 0 0.4rem; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: #b56e1a">Where does JUST go?</p>
        <p style="margin: 0 0 0.5rem; font-size: 0.95rem">Like ALREADY, JUST sits between <strong>have / has</strong> and the <strong>past participle (V3)</strong>.</p>

        ${placementDiagram([
          { text: "I" },
          { text: "have" },
          { text: "JUST", highlight: true },
          { text: "picked up" },
          { text: "my prescription." },
        ])}

        ${placementDiagram([
          { text: "Carlos" },
          { text: "has" },
          { text: "JUST", highlight: true },
          { text: "gotten" },
          { text: "back." },
        ])}

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("moments ago", "amber")}
            <span><em>The pharmacist <strong>has just called</strong> my name.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("very recently", "amber")}
            <span><em>I <strong>have just gotten</strong> back from the store.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("today", "amber")}
            <span><em>She <strong>has just started</strong> her new shift.</em></span>
          </div>
        </div>

        <p style="margin: 1rem 0 0.5rem; font-weight: 700; font-size: 0.9rem">JUST vs. ALREADY</p>
        <div style="display: grid; gap: 0.4rem; margin: 0 0 1rem">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("already", "sage")}
            <span><em>She <strong>has already picked</strong> up her card.</em> &nbsp;<span style="font-size: 0.88rem; opacity: 0.7">(done before. she might have done it days ago)</span></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(181,110,26,0.06); border-radius: 0.4rem; flex-wrap: wrap">
            ${labelPill("just", "amber")}
            <span><em>She <strong>has just picked</strong> up her card.</em> &nbsp;<span style="font-size: 0.88rem; opacity: 0.7">(done moments ago or very recently)</span></span>
          </div>
        </div>

        <div style="background: rgba(176,87,64,0.07); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 700; font-size: 0.88rem; text-transform: uppercase; color: #b05740; margin-bottom: 0.25rem">Common mistake</p>
          <p style="margin: 0; font-size: 0.95rem">✗ &nbsp;<em>I <strong>just have</strong> picked up my prescription.</em> &nbsp; (just before have = wrong)</p>
          <p style="margin: 0.35rem 0 0; font-size: 0.95rem">✓ &nbsp;<em>I <strong>have just picked</strong> up my prescription.</em></p>
        </div>
      `,
      exercises: [
        {
          id: "jay-just-1",
          title: "JUST or ALREADY?",
          instructions: "Choose the word that matches the meaning clue in each sentence.",
          items: [
            {
              type: "radio",
              label: "Carlos is still on the stairs. He got back from the pharmacy two minutes ago. Which fits?",
              options: [
                { value: "just", label: "have JUST gotten back. moments ago" },
                { value: "already", label: "have ALREADY gotten back. done before" },
              ],
              expectedAnswer: "just",
            },
            {
              type: "radio",
              label: "The pharmacist calls your name. You say: \"I ___ arrived.\" (a few seconds ago)",
              options: [
                { value: "have just", label: "have just" },
                { value: "have already", label: "have already" },
              ],
              expectedAnswer: "have just",
            },
            {
              type: "radio",
              label: "Your neighbor asks if you've been to the pharmacy this week. You went on Monday. You say:",
              options: [
                { value: "a", label: "I have just been." },
                { value: "b", label: "I have already been." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "jay-just-2",
          title: "Fix the mistake",
          instructions: "One sentence has JUST in the wrong place. Choose the corrected version.",
          items: [
            {
              type: "radio",
              label: "\"Carlos just has picked up his medication.\"",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "incorrect", label: "Not correct. Should be: Carlos has just picked up his medication." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"They have just restocked the shelves.\"",
              options: [
                { value: "correct", label: "Correct as written" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "text",
              label: "Carlos ___ just picked up his prescription.",
              expectedAnswers: ["has"],
            },
          ],
        },
        {
          id: "jay-just-3",
          title: "Build the sentence",
          instructions: "Unscramble the words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "bus", "has", "just", "arrived", "at", "the", "stop"],
              correctAnswer: "The bus has just arrived at the stop",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. YET
    // =========================================================================
    {
      id: "meaning-yet",
      stepNumber: 3,
      title: "Not yet: YET",
      icon: "⏳",
      tenseDiagram: {
        title: "Yet: expected but not done",
        elements: [
          { id: "yet-arc", type: "arc", zone: "past", position: 65, verbLabel: "haven't ... yet (expected, not done)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneKitchenTable", "Linh's kitchen table, East Boston. Wednesday evening.", "blue")}

        ${dialogue([
          { speaker: "Linh's son", avatar: "👦🏻", text: "Mom, have you called the landlord <strong>yet</strong>?", side: "left", tone: "blue" },
          { speaker: "Linh", avatar: "👩🏻", text: "No, I <strong>haven't called</strong> him <strong>yet</strong>. I will do it tomorrow.", side: "right", tone: "terracotta" },
          { speaker: "Linh's son", avatar: "👦🏻", text: "Have you paid the electric bill <strong>yet</strong>?", side: "left", tone: "blue" },
          { speaker: "Linh", avatar: "👩🏻", text: "Not <strong>yet</strong>. I <strong>haven't had</strong> time <strong>yet</strong>.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>YET</strong> = something expected or planned, but not done so far. Used in questions and negative sentences.</p>
        </div>

        <p style="margin: 0.75rem 0 0.4rem; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: #268a82">Where does YET go?</p>
        <p style="margin: 0 0 0.5rem; font-size: 0.95rem">YET always goes at the <strong>end</strong> of the sentence. It never sits between <em>have</em> and V3.</p>

        ${placementDiagram([
          { text: "She" },
          { text: "hasn't called" },
          { text: "the landlord" },
          { text: "YET.", highlight: true },
        ])}

        ${placementDiagram([
          { text: "Have you paid" },
          { text: "the bill" },
          { text: "YET?", highlight: true },
        ])}

        <p style="margin: 1rem 0 0.5rem; font-weight: 700; font-size: 0.9rem">YET appears in two patterns only:</p>
        <div style="display: grid; gap: 0.4rem; margin: 0 0 1rem">
          <div style="padding: 0.65rem 1rem; background: rgba(100,149,237,0.06); border-radius: 0.45rem; border-left: 3px solid #268a82">
            <p style="margin: 0 0 0.2rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #268a82">Negative</p>
            <em>I <strong>haven't</strong> signed the form <strong>yet</strong>.</em>
          </div>
          <div style="padding: 0.65rem 1rem; background: rgba(100,149,237,0.06); border-radius: 0.45rem; border-left: 3px solid #268a82">
            <p style="margin: 0 0 0.2rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #268a82">Question</p>
            <em><strong>Have</strong> you called the landlord <strong>yet</strong>?</em>
          </div>
        </div>

        <div style="background: rgba(176,87,64,0.07); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; padding: 0.75rem 1rem; margin: 1rem 0">
          <p style="margin: 0; font-weight: 700; font-size: 0.88rem; text-transform: uppercase; color: #b05740; margin-bottom: 0.25rem">Common mistakes</p>
          <p style="margin: 0; font-size: 0.95rem">✗ &nbsp;<em>She has <strong>yet</strong> called the landlord.</em> &nbsp; (yet between have and V3 = wrong)</p>
          <p style="margin: 0.35rem 0 0; font-size: 0.95rem">✗ &nbsp;<em>She has called the landlord yet.</em> &nbsp; (yet in an affirmative sentence = wrong)</p>
          <p style="margin: 0.35rem 0 0; font-size: 0.95rem">✓ &nbsp;<em>She <strong>hasn't</strong> called the landlord <strong>yet</strong>.</em></p>
        </div>
      `,
      exercises: [
        {
          id: "jay-yet-1",
          title: "Where does YET go?",
          instructions: "Choose the sentence where YET is correct.",
          items: [
            {
              type: "radio",
              label: "Which sentence is correct?",
              options: [
                { value: "a", label: "She has yet called the landlord." },
                { value: "b", label: "She hasn't called the landlord yet." },
                { value: "c", label: "She hasn't yet the landlord called." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Linh's son wants to know about the electric bill. Which question is correct?",
              options: [
                { value: "a", label: "Have you yet paid the electric bill?" },
                { value: "b", label: "Have you paid the electric bill yet?" },
                { value: "c", label: "Yet have you paid the electric bill?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I haven't had time ___.\"\nWhich word completes the sentence correctly?",
              options: [
                { value: "yet", label: "yet. goes at the end" },
                { value: "already", label: "already. goes between have and V3" },
                { value: "just", label: "just. goes between have and V3" },
              ],
              expectedAnswer: "yet",
            },
            {
              type: "text",
              label: "I haven't called the landlord ___.",
              expectedAnswers: ["yet"],
            },
          ],
        },
        {
          id: "jay-yet-2",
          title: "Correct or not?",
          instructions: "Is YET used correctly?",
          items: [
            {
              type: "radio",
              label: "\"I haven't eaten dinner yet.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"She has yet finished her homework.\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: She hasn't finished her homework yet." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Have you gotten your EBT card yet?\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "jay-yet-3",
          title: "Build the sentence",
          instructions: "Unscramble the words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "haven't", "called", "the", "landlord", "yet"],
              correctAnswer: "I haven't called the landlord yet",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Have", "you", "paid", "the", "electric", "bill", "yet"],
              correctAnswer: "Have you paid the electric bill yet",
            },
          ],
        },
      ],
      tipBox: {
        title: "YET = end of the line",
        content: "YET always rides at the end of the sentence. If you see YET in the middle, something is wrong.",
      },
    },

    // =========================================================================
    // SECTION 4. ALL THREE TOGETHER
    // =========================================================================
    {
      id: "all-three-together",
      stepNumber: 4,
      title: "Reading a To-Do List: All Three Together",
      icon: "📋",
      explanation: `
        ${sceneCard("sceneToDoList", "Rosa's kitchen, Friday after Indigenous Peoples' Day weekend.", "terracotta")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏾", text: "OK, let me check my list before I leave for class.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏾", text: "School was closed Monday. I <strong>have already taken</strong> the kids to the clinic.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏾", text: "I <strong>have already paid</strong> the rent. Done.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏾", text: "I <strong>have just called</strong> the school about my daughter. Still on my mind.", side: "right", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏾", text: "But I <strong>haven't picked up</strong> the groceries <strong>yet</strong>. That one has to wait.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 0 0 0.75rem; font-weight: 700; font-size: 0.95rem">Rosa's to-do list:</p>

        <div style="background: #fff; border: 1px solid rgba(0,0,0,0.1); border-radius: 0.65rem; padding: 1rem 1.25rem; margin: 0 0 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05)">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(0,0,0,0.07)">
            <span style="font-size: 1.1rem; flex-shrink: 0">✅</span>
            <div>
              <span style="font-size: 0.95rem"><em>Pay rent</em></span>
              <span style="display: block; font-size: 0.82rem; color: #6a8d73; font-weight: 600">I have <strong>already</strong> paid the rent. (done before)</span>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid rgba(0,0,0,0.07)">
            <span style="font-size: 1.1rem; flex-shrink: 0">⚡</span>
            <div>
              <span style="font-size: 0.95rem"><em>Call the school</em></span>
              <span style="display: block; font-size: 0.82rem; color: #b56e1a; font-weight: 600">I have <strong>just</strong> called the school. (moments ago)</span>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.6rem 0">
            <span style="font-size: 1.1rem; flex-shrink: 0">⏳</span>
            <div>
              <span style="font-size: 0.95rem"><em>Pick up groceries</em></span>
              <span style="display: block; font-size: 0.82rem; color: #268a82; font-weight: 600">I haven't picked up the groceries <strong>yet</strong>. (not done)</span>
            </div>
          </div>
        </div>

        <p style="margin: 0 0 0.6rem; font-weight: 700; font-size: 0.95rem">The placement cheat sheet:</p>

        <div style="display: flex; flex-direction: column; gap: 0.4rem; margin: 0 0 1.25rem">
          <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; background: rgba(106,141,115,0.08); border-radius: 0.45rem; flex-wrap: wrap">
            <span style="font-size: 1rem">✅</span>
            <code style="font-family: monospace; font-size: 0.92rem">have + <span style="background:#e9c46a; padding: 0.1rem 0.4rem; border-radius: 0.2rem; font-weight: 800">ALREADY</span> + V3</code>
            <span style="font-size: 0.85rem; opacity: 0.7; margin-left: auto">done before now</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; background: rgba(181,110,26,0.08); border-radius: 0.45rem; flex-wrap: wrap">
            <span style="font-size: 1rem">⚡</span>
            <code style="font-family: monospace; font-size: 0.92rem">have + <span style="background:#e9c46a; padding: 0.1rem 0.4rem; border-radius: 0.2rem; font-weight: 800">JUST</span> + V3</code>
            <span style="font-size: 0.85rem; opacity: 0.7; margin-left: auto">very recently</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; background: rgba(100,149,237,0.08); border-radius: 0.45rem; flex-wrap: wrap">
            <span style="font-size: 1rem">⏳</span>
            <code style="font-family: monospace; font-size: 0.92rem">haven't + V3 + <span style="background:#e9c46a; padding: 0.1rem 0.4rem; border-radius: 0.2rem; font-weight: 800">YET</span></code>
            <span style="font-size: 0.85rem; opacity: 0.7; margin-left: auto">not done (negative)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; background: rgba(100,149,237,0.08); border-radius: 0.45rem; flex-wrap: wrap">
            <span style="font-size: 1rem">❓</span>
            <code style="font-family: monospace; font-size: 0.92rem">Have + subject + V3 + <span style="background:#e9c46a; padding: 0.1rem 0.4rem; border-radius: 0.2rem; font-weight: 800">YET</span>?</code>
            <span style="font-size: 0.85rem; opacity: 0.7; margin-left: auto">not done (question)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "jay-all-1",
          title: "Which word fits?",
          instructions: "Choose the word that fits both the meaning and the position.",
          items: [
            {
              type: "radio",
              label: "\"I have ___ paid the rent. I did it on Monday.\" (Monday was several days ago)",
              options: [
                { value: "just", label: "just. very recently" },
                { value: "already", label: "already. done before now" },
                { value: "yet", label: "yet. not done" },
              ],
              expectedAnswer: "already",
            },
            {
              type: "radio",
              label: "\"I have ___ gotten off the bus. I'm still at the stop.\"",
              options: [
                { value: "just", label: "just. moments ago" },
                { value: "already", label: "already. done before" },
                { value: "yet", label: "yet. not done" },
              ],
              expectedAnswer: "just",
            },
            {
              type: "radio",
              label: "\"I haven't called the landlord ___. I'll do it tonight.\"",
              options: [
                { value: "just", label: "just" },
                { value: "already", label: "already" },
                { value: "yet", label: "yet" },
              ],
              expectedAnswer: "yet",
            },
            {
              type: "radio",
              label: "\"Have you picked up your prescription ___?\" (asking if it's done)",
              options: [
                { value: "just", label: "just" },
                { value: "already", label: "already" },
                { value: "yet", label: "yet" },
              ],
              expectedAnswer: "yet",
            },
            {
              type: "text",
              label: "\"I have ___ paid the rent. I did it on Monday.\" (done before now)",
              expectedAnswers: ["already"],
            },
          ],
        },
        {
          id: "jay-all-2",
          title: "Build Rosa's sentences",
          instructions: "Unscramble each item from Rosa's to-do list.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "already", "paid", "the", "rent"],
              correctAnswer: "I have already paid the rent",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "just", "called", "the", "school"],
              correctAnswer: "I have just called the school",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "haven't", "picked", "up", "the", "groceries", "yet"],
              correctAnswer: "I haven't picked up the groceries yet",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5. REAL WORLD PRACTICE
    // =========================================================================
    {
      id: "real-world-practice",
      stepNumber: 5,
      title: "Hear it, use it: Practice in the real world",
      icon: "🎧",
      explanation: `
        ${sceneCard("sceneApartmentHallway", "Quick exchanges. East Boston, around the neighborhood.", "sage")}

        <p style="margin: 0 0 0.75rem; line-height: 1.6">These are real phrases you might hear or say this week, on the bus, at the store, or talking with a neighbor. Read them and check your understanding.</p>

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "Bruno, have you signed up for the food pantry <strong>yet</strong>?", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Yes, I <strong>have already registered</strong>. I did it online last week.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "Oh nice. I <strong>have just found out</strong> about it. I'll do it tonight.", side: "left", tone: "sage" },
          { speaker: "Bruno", avatar: "👨🏽", text: "Do it soon. The deadline <strong>has just passed</strong> for this month, I think.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 1rem 0 0.6rem; font-weight: 700; font-size: 0.9rem">Quick summary before the quiz:</p>

        <div style="display: grid; gap: 0.4rem">
          <div style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.65rem 1rem; background: rgba(106,141,115,0.06); border-radius: 0.45rem">
            <span style="font-weight: 800; font-size: 1rem; color: #6a8d73; flex-shrink: 0">ALREADY</span>
            <span style="font-size: 0.92rem">Between <em>have</em> and V3. Done before now. Affirmative.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.65rem 1rem; background: rgba(181,110,26,0.06); border-radius: 0.45rem">
            <span style="font-weight: 800; font-size: 1rem; color: #b56e1a; flex-shrink: 0">JUST</span>
            <span style="font-size: 0.92rem">Between <em>have</em> and V3. Very recently. Affirmative.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.65rem 1rem; background: rgba(100,149,237,0.06); border-radius: 0.45rem">
            <span style="font-weight: 800; font-size: 1rem; color: #268a82; flex-shrink: 0">YET</span>
            <span style="font-size: 0.92rem">At the end of the sentence. Not done. Negative and questions only.</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "jay-rw-1",
          title: "What does it mean?",
          instructions: "Read the sentence and choose the best description of its meaning.",
          items: [
            {
              type: "radio",
              label: "\"Amara hasn't registered for the food pantry yet.\"",
              options: [
                { value: "a", label: "Amara registered a long time ago." },
                { value: "b", label: "Amara registered just now." },
                { value: "c", label: "Amara hasn't registered, but she probably will." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "\"Bruno has just found out about the program.\"",
              options: [
                { value: "a", label: "Bruno learned about the program a long time ago." },
                { value: "b", label: "Bruno learned about the program very recently." },
                { value: "c", label: "Bruno doesn't know about the program yet." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I have already called the landlord.\" What does this tell you?",
              options: [
                { value: "a", label: "The call happened before now. It is done." },
                { value: "b", label: "The call is happening right now." },
                { value: "c", label: "The call hasn't happened yet." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "jay-rw-2",
          title: "Spot the mistake",
          instructions: "Each sentence has a placement error. Choose the correction.",
          items: [
            {
              type: "radio",
              label: "\"I have called the landlord yet.\"",
              options: [
                { value: "correct", label: "Correct. no problem" },
                { value: "incorrect", label: "Not correct. YET is only for negatives and questions. Should be: I have already called the landlord." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Already I have registered for the food pantry.\"",
              options: [
                { value: "correct", label: "Correct. no problem" },
                { value: "incorrect", label: "Not correct. ALREADY goes between have and V3: I have already registered for the food pantry." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"The deadline has just passed.\"",
              options: [
                { value: "correct", label: "Correct. no problem" },
                { value: "incorrect", label: "Not correct" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "text",
              label: "\"Have you signed up for the food pantry ___?\"",
              expectedAnswers: ["yet"],
            },
          ],
        },
        {
          id: "jay-rw-3",
          title: "One more sentence",
          instructions: "Unscramble.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Have", "you", "signed", "up", "for", "the", "food", "pantry", "yet"],
              correctAnswer: "Have you signed up for the food pantry yet",
            },
          ],
        },
      ],
      tipBox: {
        title: "You will see this again",
        content: "These three words will come back in future guides when you learn the full present perfect tense. For now, notice them, use them, and remember where they go in the sentence.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "jay-q1",
      question: "Nadine picked up her EBT card last week. The staff member asks if she needs it today. What does Nadine say?",
      options: [
        { value: "a", label: "I have just picked it up." },
        { value: "b", label: "I have already picked it up." },
        { value: "c", label: "I haven't picked it up yet." },
      ],
      correctAnswer: "b",
      explanation: "ALREADY means done before now. She picked it up last week, not moments ago.",
      topic: "already",
      skill: "usage",
      skillTag: "meaning-done-before-now",
      difficulty: "easy",
    },
    {
      id: "jay-q2",
      question: "Carlos walked in the door 30 seconds ago. His neighbor asks where he's been. He says:",
      options: [
        { value: "a", label: "I have already gotten back from the pharmacy." },
        { value: "b", label: "I have just gotten back from the pharmacy." },
        { value: "c", label: "I haven't gotten back from the pharmacy yet." },
      ],
      correctAnswer: "b",
      explanation: "JUST means very recently, moments ago. He arrived 30 seconds ago.",
      topic: "just",
      skill: "usage",
      skillTag: "meaning-very-recently",
      difficulty: "easy",
    },
    {
      id: "jay-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Linh hasn't paid the electric bill ___.\" (It's expected but not done.)",
      correctAnswer: "yet",
      explanation: "YET goes at the end of a negative sentence when something is expected but hasn't happened.",
      topic: "yet",
      skill: "usage",
      skillTag: "meaning-not-done-yet",
      difficulty: "easy",
    },
    {
      id: "jay-qws1",
      type: "word-scramble" as const,
      question: "Put the words in the right order.",
      words: ["She", "has", "already", "registered", "for", "the", "program"],
      correctAnswer: "She has already registered for the program",
      hint: "ALREADY goes between have/has and the past participle",
      explanation: "ALREADY sits between have/has and V3: has + ALREADY + registered.",
      topic: "already",
      skill: "usage",
      skillTag: "placement-already-between-have-v3",
      difficulty: "medium",
    },
    {
      id: "jay-q4",
      question: "Which sentence has ALREADY in the correct position?",
      options: [
        { value: "a", label: "Already she has registered for the program." },
        { value: "b", label: "She has registered already for the program." },
        { value: "c", label: "She has already registered for the program." },
      ],
      correctAnswer: "c",
      explanation: "ALREADY goes between have/has and the past participle: has + ALREADY + registered.",
      topic: "already",
      skill: "error-detection",
      skillTag: "placement-already-between-have-v3",
      difficulty: "medium",
    },
  ],
};
