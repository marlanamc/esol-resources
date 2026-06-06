import type { InteractiveGuideContent } from "@/types/activity";
import { doctorSaidReportedSpeechImages as img } from "@/data/doctor-said-reported-speech-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers
// ---------------------------------------------------------------------------

const sceneCard = (
  sceneId: keyof typeof img,
  caption: string,
  accent: "terracotta" | "sage" | "blue" | "amber" = "sage"
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

export const doctorSaidReportedSpeechContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 - The Clinic Call
    // =========================================================================
    {
      id: "clinic-call",
      title: "The Clinic Call",
      icon: "📞",
      tenseDiagram: {
        title: "Reported speech: telling someone what was said",
        elements: [
          { id: "direct-past", type: "single-dot", zone: "past", position: 55, verbLabel: "what they said" },
          { id: "reported-now", type: "multiple-dots", zone: "present", position: 50, verbLabel: "you report it" },
        ],
      },
      explanation: `
        ${sceneCard("sceneClinicCall", "East Boston Neighborhood Health Center. Tuesday, 4:30 PM.", "sage")}

        <p>Amara is at home with her daughter Amina, who has asthma. Marco is still at the restaurant finishing his line-cook shift. The clinic calls about Amina's inhaler appointment.</p>

        ${dialogue([
          { speaker: "Nurse Kelly", avatar: "👩‍⚕️", text: "Hi, this is <strong>Kelly</strong> from East Boston Neighborhood Health Center. I'm calling about Amina's inhaler.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Yes, hi. Her blue inhaler is almost empty.", side: "right", tone: "terracotta" },
          { speaker: "Nurse Kelly", avatar: "👩‍⚕️", text: "The doctor <strong>says</strong> the pharmacy <strong>can</strong> refill it today if you come before 6.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "OK. I'll write it down and tell my husband.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem"><strong>Reported speech</strong> means you tell someone else what another person said. You are not repeating the exact words. You change the form: present becomes past, <em>can</em> becomes <em>could</em>, <em>will</em> becomes <em>would</em>.</p>
        </div>

        <div style="display: grid; gap: 0.6rem; margin-bottom: 1.5rem">
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="flex: 1"><strong>Direct:</strong> Kelly says, "The pharmacy <strong>can</strong> refill it."</span>
            ${labelPill("exact words", "blue")}
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: #f5f0e8; border-radius: 0.5rem">
            <span style="flex: 1"><strong>Reported:</strong> Kelly <strong>said that</strong> the pharmacy <strong>could</strong> refill it.</span>
            ${labelPill("reported", "sage")}
          </div>
        </div>

        <p>Amara needs to tell Marco everything later. She cannot repeat Kelly's exact words on a noisy restaurant line. She reports what was said.</p>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "Direct or Reported?",
          instructions: "Choose the reported speech sentence.",
          items: [
            {
              type: "radio",
              label: "Kelly spoke to Amara on the phone. Which sentence is reported speech?",
              options: [
                { value: "a", label: "Kelly said, \"The pharmacy can refill it today.\"" },
                { value: "b", label: "Kelly said that the pharmacy could refill it today." },
                { value: "c", label: "Can the pharmacy refill it today?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s1-ex2",
          title: "Fill in the Blank",
          instructions: "Write the reporting verb.",
          items: [
            {
              type: "text",
              label: "Amara tells Marco: \"Kelly ___ that Amina's inhaler was almost empty.\"",
              expectedAnswers: ["said"],
            },
          ],
        },
        {
          id: "s1-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble this reported sentence:",
              words: ["Kelly", "said", "that", "the", "clinic", "called", "about", "the", "inhaler"],
              correctAnswer: "Kelly said that the clinic called about the inhaler",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 - "She said that..."
    // =========================================================================
    {
      id: "she-said-that",
      title: "Telling Marco: She Said That…",
      icon: "💬",
      tenseDiagram: {
        title: "Tense back-shift in reported statements",
        elements: [
          { id: "present-direct", type: "multiple-dots", zone: "present", position: 45, verbLabel: "direct (is, can, will)" },
          { id: "past-reported", type: "single-dot", zone: "past", position: 60, verbLabel: "reported (was, could, would)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneRestaurantShift", "Marco's restaurant on Meridian Street. Tuesday, 5:45 PM.", "terracotta")}

        <p>Marco is wiping down the prep station when Amara texts him. He reads it between orders.</p>

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "Kelly <strong>said that</strong> the inhaler <strong>was</strong> almost empty.", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "Was? It's empty now?", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "She <strong>said that</strong> they <strong>could</strong> refill it today if I go before 6.", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "OK. I'll try to leave early. She <strong>said</strong> anything else?", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem">When you report a statement, the verb often moves back one step: <strong>is → was</strong>, <strong>can → could</strong>, <strong>will → would</strong>. Use <strong>said that</strong> + subject + verb.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.5rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("is → was", "terracotta")}
            <span><em>Direct: "It <strong>is</strong> almost empty." → Reported: She said it <strong>was</strong> almost empty.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("can → could", "sage")}
            <span><em>Direct: "We <strong>can</strong> refill it." → Reported: She said they <strong>could</strong> refill it.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("will → would", "blue")}
            <span><em>Direct: "The doctor <strong>will</strong> call tomorrow." → Reported: She said the doctor <strong>would</strong> call tomorrow.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Change to Reported Speech",
          instructions: "Choose the correct reported sentence.",
          items: [
            {
              type: "radio",
              label: "Kelly said: \"The inhaler is almost empty.\" How does Amara report this?",
              options: [
                { value: "a", label: "Kelly said that the inhaler is almost empty." },
                { value: "b", label: "Kelly said that the inhaler was almost empty." },
                { value: "c", label: "Kelly said that the inhaler will be almost empty." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Kelly said: \"We can refill it today.\" How does Amara report this?",
              options: [
                { value: "a", label: "Kelly said that they can refill it today." },
                { value: "b", label: "Kelly said that they could refill it today." },
                { value: "c", label: "Kelly said that they will refill it today." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Fill in the Blank",
          instructions: "Write the back-shifted verb.",
          items: [
            {
              type: "text",
              label: "Direct: \"The doctor will call tomorrow.\" Reported: Amara said the doctor ___ call tomorrow.",
              expectedAnswers: ["would"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "said", "that", "the", "pharmacy", "could", "refill", "it", "today"],
              correctAnswer: "She said that the pharmacy could refill it today",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 - Reported Commands
    // =========================================================================
    {
      id: "told-me-to",
      title: "He Told Me To…",
      icon: "📋",
      explanation: `
        ${sceneCard("sceneBabysitter", "Amara and Marco's apartment. Wednesday morning.", "blue")}

        <p>Marco picked up the new inhaler after his shift. Their cousin Gloria is watching Amina before school. Marco needs to pass on the doctor's instructions.</p>

        ${dialogue([
          { speaker: "Marco", avatar: "👨🏽", text: "The doctor <strong>told me to</strong> keep the inhaler in a warm place, not the cold car.", side: "right", tone: "terracotta" },
          { speaker: "Gloria", avatar: "👩🏾", text: "OK. I'll keep it in the kitchen drawer.", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "He <strong>asked Amara to</strong> call if Amina's breathing gets worse.", side: "right", tone: "terracotta" },
          { speaker: "Gloria", avatar: "👩🏾", text: "And the old nebulizer?", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "He <strong>told us not to</strong> use it. It's too old.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem">For commands and advice, use <strong>told / asked + person + to + verb</strong>. For negative commands: <strong>told + person + not to + verb</strong>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.5rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("told me to", "sage")}
            <span><em>Direct: "Keep it in a warm place." → He told me to keep it in a warm place.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("asked me to", "blue")}
            <span><em>Direct: "Please call if symptoms get worse." → He asked me to call if symptoms got worse.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("told me not to", "terracotta")}
            <span><em>Direct: "Don't use the old nebulizer." → He told us not to use the old nebulizer.</em></span>
          </div>
        </div>

        <p>Marco's grandmother Lucia called from Guatemala last week. She said the doctor <strong>told her to</strong> fast before her blood work. Orthodox Easter was coming, and she wanted to know if she could still eat. Reported speech helps her explain the doctor's rules to the family.</p>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Choose the Reported Command",
          instructions: "Pick the correct reported form.",
          items: [
            {
              type: "radio",
              label: "The doctor said: \"Keep the inhaler in a warm place.\" How does Marco report this?",
              options: [
                { value: "a", label: "The doctor told me keeping the inhaler in a warm place." },
                { value: "b", label: "The doctor told me to keep the inhaler in a warm place." },
                { value: "c", label: "The doctor told me keep the inhaler in a warm place." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The doctor said: \"Don't use the old nebulizer.\" How does Marco report this?",
              options: [
                { value: "a", label: "The doctor told us not to use the old nebulizer." },
                { value: "b", label: "The doctor told us don't use the old nebulizer." },
                { value: "c", label: "The doctor told us to not use the old nebulizer." },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Fill in the Blank",
          instructions: "Write to or not to.",
          items: [
            {
              type: "text",
              label: "Direct: \"Call if her breathing gets worse.\" Reported: He asked Amara ___ call if her breathing got worse.",
              expectedAnswers: ["to"],
            },
          ],
        },
        {
          id: "s3-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "doctor", "told", "her", "not", "to", "use", "the", "old", "nebulizer"],
              correctAnswer: "The doctor told her not to use the old nebulizer",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 - Reported Questions
    // =========================================================================
    {
      id: "she-asked-if",
      title: "She Asked If…",
      icon: "❓",
      explanation: `
        ${sceneCard("sceneTextingMarco", "Clinic follow-up call. Wednesday, 2 PM.", "sage")}

        <p>Clinic receptionist <strong>Sarah</strong> called back to confirm Amina's follow-up. Marco answered because Amara was at work. Now he is telling Amara what Sarah asked.</p>

        ${dialogue([
          { speaker: "Marco", avatar: "👨🏽", text: "Sarah from the clinic called. She <strong>asked if</strong> Amina <strong>was</strong> feeling better.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "What else?", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "She <strong>asked when</strong> we <strong>could</strong> come for the follow-up.", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "Did she ask about the insurance card?", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "Yes. She <strong>asked if</strong> we <strong>had</strong> brought it last time.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem">Yes/no questions become <strong>asked if</strong> + statement (no question word order). Wh-questions keep the question word: <strong>asked when / what / where</strong> + statement.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.5rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("yes/no", "sage")}
            <span><em>Direct: "Is she feeling better?" → She asked if she was feeling better.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("wh-question", "blue")}
            <span><em>Direct: "When can you come?" → She asked when we could come.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "s4-ex1",
          title: "Report the Question",
          instructions: "Choose the correct reported question.",
          items: [
            {
              type: "radio",
              label: "Sarah asked: \"Is Amina feeling better?\" How does Marco report this?",
              options: [
                { value: "a", label: "Sarah asked if is Amina feeling better." },
                { value: "b", label: "Sarah asked if Amina was feeling better." },
                { value: "c", label: "Sarah asked if Amina is feeling better?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Sarah asked: \"When can you come?\" How does Marco report this?",
              options: [
                { value: "a", label: "Sarah asked when can we come." },
                { value: "b", label: "Sarah asked when we could come." },
                { value: "c", label: "Sarah asked when we can come?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Fill in the Blank",
          instructions: "Write if or when.",
          items: [
            {
              type: "text",
              label: "Direct: \"Did you bring the insurance card?\" Reported: She asked ___ we had brought the insurance card.",
              expectedAnswers: ["if"],
            },
          ],
        },
        {
          id: "s4-ex3",
          title: "Find the Error",
          instructions: "Which reported question is NOT correct?",
          items: [
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "She asked if Amina was feeling better." },
                { value: "b", label: "She asked when we could come for the follow-up." },
                { value: "c", label: "She asked if did we bring the insurance card." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 - Putting It Together
    // =========================================================================
    {
      id: "whole-story",
      title: "One Whole Story",
      icon: "📱",
      explanation: `
        ${sceneCard("sceneCallingLucia", "Marco's break room. Wednesday, 9 PM.", "amber")}

        <p>Marco calls his mother Lucia in Guatemala. She speaks limited English, so Marco uses simple reported speech to explain the whole visit.</p>

        ${dialogue([
          { speaker: "Marco", avatar: "👨🏽", text: "Mamá, the nurse <strong>said that</strong> Amina's inhaler <strong>was</strong> almost empty.", side: "right", tone: "terracotta" },
          { speaker: "Lucia", avatar: "👵🏽", text: "Ay, mijo. And the doctor?", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "He <strong>told me to</strong> keep it warm. He <strong>told us not to</strong> use the old machine.", side: "right", tone: "terracotta" },
          { speaker: "Lucia", avatar: "👵🏽", text: "Like my doctor! He <strong>told me to</strong> fast before my blood work for Easter.", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "Sarah <strong>asked when</strong> we <strong>could</strong> come back. I <strong>said that</strong> maybe Saturday.", side: "right", tone: "terracotta" },
        ])}

        <p>Statements, commands, and questions. All three patterns in one real phone call.</p>
      `,
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/reported-speech\" style=\"font-weight:700;text-decoration:underline\">Reported Speech Full Guide</a>.",
      },
      exercises: [
        {
          id: "s5-ex1",
          title: "Statements, Commands, or Questions?",
          instructions: "Choose the correct reported form for each situation.",
          items: [
            {
              type: "radio",
              label: "Kelly said: \"The pharmacy can refill it today.\"",
              options: [
                { value: "a", label: "Kelly said that the pharmacy could refill it today." },
                { value: "b", label: "Kelly told me to refill it today." },
                { value: "c", label: "Kelly asked if the pharmacy could refill it today." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "The doctor said: \"Don't use the old nebulizer.\"",
              options: [
                { value: "a", label: "The doctor said that we don't use the old nebulizer." },
                { value: "b", label: "The doctor told us not to use the old nebulizer." },
                { value: "c", label: "The doctor asked if we use the old nebulizer." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s5-ex2",
          title: "Fill in the Blank",
          instructions: "Write the missing word.",
          items: [
            {
              type: "text",
              label: "Sarah asked: \"When can you come?\" Marco said Sarah asked ___ we could come.",
              expectedAnswers: ["when"],
            },
          ],
        },
        {
          id: "s5-ex3",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble Marco's sentence to Lucia:",
              words: ["He", "told", "me", "to", "keep", "the", "inhaler", "in", "a", "warm", "place"],
              correctAnswer: "He told me to keep the inhaler in a warm place",
            },
          ],
        },
        {
          id: "s5-ex4",
          title: "Find the Error",
          items: [
            {
              type: "radio",
              label: "Marco texts Amara: \"Sarah asked when can we come Saturday.\" What is wrong?",
              options: [
                { value: "a", label: "No error. The sentence is correct." },
                { value: "b", label: "Error: it should be \"Sarah asked when we could come Saturday.\"" },
                { value: "c", label: "Error: it should be \"Sarah said when we could come Saturday.\"" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
    },
  ],

  miniQuiz: [
    {
      id: "doctor-said-q1",
      question: "Kelly said: \"The inhaler is almost empty.\" How does Amara report this to Marco?",
      options: [
        { value: "a", label: "Kelly said that the inhaler is almost empty." },
        { value: "b", label: "Kelly said that the inhaler was almost empty." },
        { value: "c", label: "Kelly told me to the inhaler was almost empty." },
      ],
      correctAnswer: "b",
      explanation: "In reported statements, is becomes was. Use said that + subject + verb.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "back-shift-is-was",
      difficulty: "easy",
    },
    {
      id: "doctor-said-q2",
      question: "Kelly said: \"We can refill it today.\" Which reported sentence is correct?",
      options: [
        { value: "a", label: "Kelly said that they can refill it today." },
        { value: "b", label: "Kelly said that they could refill it today." },
        { value: "c", label: "Kelly said that they will can refill it today." },
      ],
      correctAnswer: "b",
      explanation: "Can back-shifts to could in reported speech.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "back-shift-can-could",
      difficulty: "easy",
    },
    {
      id: "doctor-said-q3",
      question: "The doctor said: \"Keep the inhaler in a warm place.\" How does Marco tell Gloria?",
      options: [
        { value: "a", label: "The doctor told me to keep the inhaler in a warm place." },
        { value: "b", label: "The doctor said that keep the inhaler in a warm place." },
        { value: "c", label: "The doctor asked me keep the inhaler in a warm place." },
      ],
      correctAnswer: "a",
      explanation: "Commands use told + person + to + base verb.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "reported-command-told-to",
      difficulty: "easy",
    },
    {
      id: "doctor-said-q4",
      question: "The doctor said: \"Don't use the old nebulizer.\" Which sentence is correct?",
      options: [
        { value: "a", label: "The doctor told us not to use the old nebulizer." },
        { value: "b", label: "The doctor told us don't use the old nebulizer." },
        { value: "c", label: "The doctor told us to don't use the old nebulizer." },
      ],
      correctAnswer: "a",
      explanation: "Negative commands use told + person + not to + verb.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "reported-command-not-to",
      difficulty: "easy",
    },
    {
      id: "doctor-said-q5",
      question: "Sarah asked: \"Is Amina feeling better?\" How does Marco report this?",
      options: [
        { value: "a", label: "Sarah asked if Amina was feeling better." },
        { value: "b", label: "Sarah asked if is Amina feeling better." },
        { value: "c", label: "Sarah asked is Amina feeling better." },
      ],
      correctAnswer: "a",
      explanation: "Yes/no questions become asked if + statement word order, with tense back-shift.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "reported-question-if",
      difficulty: "medium",
    },
    {
      id: "doctor-said-q6",
      question: "Sarah asked: \"When can you come for the follow-up?\" Which reported form is correct?",
      options: [
        { value: "a", label: "Sarah asked when can we come for the follow-up." },
        { value: "b", label: "Sarah asked when we could come for the follow-up." },
        { value: "c", label: "Sarah asked when we can come for the follow-up?" },
      ],
      correctAnswer: "b",
      explanation: "Wh-questions keep the question word but use statement order and back-shift can to could.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "reported-question-wh",
      difficulty: "medium",
    },
    {
      id: "doctor-said-q7",
      question: "Find the error: \"Kelly said that the pharmacy will refill it today.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: will should be would." },
        { value: "c", label: "Error: said should be told." },
      ],
      correctAnswer: "b",
      explanation: "Will back-shifts to would in reported speech: Kelly said the pharmacy would refill it.",
      topic: "reported-speech",
      skill: "error-detection",
      skillTag: "error-detection-will-would",
      difficulty: "medium",
    },
    {
      id: "doctor-said-q8",
      question: "Find the error: \"The doctor told me keep the inhaler warm.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: missing \"to\" after told me." },
        { value: "c", label: "Error: told should be said." },
      ],
      correctAnswer: "b",
      explanation: "Reported commands need told + person + to + verb: told me to keep.",
      topic: "reported-speech",
      skill: "error-detection",
      skillTag: "error-detection-missing-to",
      difficulty: "medium",
    },
    {
      id: "doctor-said-q9",
      question: "Lucia said the doctor told her to fast before blood work. Marco is explaining Amina's visit. Which sentence mixes up statement and command patterns?",
      options: [
        { value: "a", label: "The nurse said that the inhaler was almost empty." },
        { value: "b", label: "The doctor told me to keep the inhaler warm." },
        { value: "c", label: "The doctor said me to keep the inhaler warm." },
      ],
      correctAnswer: "c",
      explanation: "Commands use told + person + to. Said me to is not correct English.",
      topic: "reported-speech",
      skill: "error-detection",
      skillTag: "error-detection-said-vs-told",
      difficulty: "hard",
    },
    {
      id: "doctor-said-q10",
      question: "Marco summarizes the whole visit for Lucia. Which sentence correctly reports all three patterns?",
      options: [
        { value: "a", label: "Kelly said the inhaler was empty, the doctor told me to keep it warm, and Sarah asked when we could come back." },
        { value: "b", label: "Kelly told the inhaler was empty, the doctor said me to keep it warm, and Sarah asked if when we could come back." },
        { value: "c", label: "Kelly said that the inhaler is empty, the doctor told me keeping it warm, and Sarah asked when can we come back." },
      ],
      correctAnswer: "a",
      explanation: "Statement (said + was), command (told me to), and wh-question (asked when + statement order) are all correct in option a.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "mixed-patterns-summary",
      difficulty: "hard",
    },
  ],
};
