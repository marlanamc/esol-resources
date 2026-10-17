import type { InteractiveGuideContent } from "@/types/activity";
import { doctorSaidReportedSpeechImages as img } from "@/data/doctor-said-reported-speech-images.generated";
import { checklist, readingCard, stepsCard } from "@/content/grammar/_shared/guide-visuals";

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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; min-width: min-content; max-width: 45%; overflow-wrap: normal">${text}</span>`;

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

        <p>Luz is at home with her daughter Amina, who has asthma. Marco is still at the restaurant finishing his line-cook shift. The clinic calls about Amina's inhaler.</p>

        ${dialogue([
          { speaker: "Nurse Kelly", avatar: "👩‍⚕️", text: "Hi, this is Kelly from East Boston Neighborhood Health Center. Our records show Amina's blue inhaler <strong>is</strong> almost empty.", side: "left", tone: "sage" },
          { speaker: "Luz", avatar: "👩🏿", text: "Yes, hi. She used it twice last night.", side: "right", tone: "terracotta" },
          { speaker: "Nurse Kelly", avatar: "👩‍⚕️", text: "The doctor <strong>says</strong> the pharmacy <strong>can</strong> refill it today if you come before 6.", side: "left", tone: "sage" },
          { speaker: "Luz", avatar: "👩🏿", text: "OK. I'll write it down and tell my husband.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem"><strong>Reported speech</strong> means you tell someone else what another person said. You are not repeating the exact words. You change the form: present becomes past, <em>can</em> becomes <em>could</em>, <em>will</em> becomes <em>would</em>.</p>
        </div>

        <div style="display: grid; gap: 0.6rem; margin-bottom: 1.5rem">
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: rgba(128,128,128,0.12); border-radius: 0.5rem">
            <span style="flex: 1"><strong>Direct:</strong> Kelly says, "The pharmacy <strong>can</strong> refill it."</span>
            ${labelPill("exact words", "blue")}
          </div>
          <div style="display: flex; align-items: baseline; gap: 0.75rem; padding: 0.7rem 1rem; background: rgba(128,128,128,0.12); border-radius: 0.5rem">
            <span style="flex: 1"><strong>Reported:</strong> Kelly <strong>said that</strong> the pharmacy <strong>could</strong> refill it.</span>
            ${labelPill("reported", "sage")}
          </div>
        </div>

        <p>Luz needs to tell Marco everything. She won't use Kelly's exact words. She will report what Kelly said.</p>
      `,
      exercises: [
        {
          id: "s1-ex1",
          title: "Direct or Reported?",
          instructions: "Choose the reported speech sentence.",
          items: [
            {
              type: "radio",
              label: "Kelly spoke to Luz on the phone. Which sentence is reported speech?",
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
              label: "Luz tells Marco: \"Kelly ___ that Amina's inhaler was almost empty.\"",
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
        <p>People report famous words all the time. Read what Lupita Nyong'o said when she won an Oscar. Then see how Luz uses the same pattern in a text to Marco.</p>

        ${readingCard({
          kicker: "Famous person",
          title: "Lupita Nyong'o: Her Oscar Speech",
          photo: {
            url: "/images/guide-people/lupita-nyongo.jpg",
            alt: "Lupita Nyong'o smiles on a stage at a 2016 event",
            credit: "Gage Skidmore, 2016, CC BY-SA 3.0",
            creditUrl: "https://commons.wikimedia.org/wiki/File:Lupita_Nyong%27o_by_Gage_Skidmore.jpg",
          },
          paragraphs: [
            "Lupita Nyong'o was born in Mexico and grew up in Kenya. She came to the United States to study, and she graduated from the Yale School of Drama in 2012. On March 2, 2014, she won an Oscar for the film <em>12 Years a Slave</em>.",
            "In her speech, she said that she <strong>wanted</strong> to thank her family and her drama school for their training. She told her brother that he <strong>was</strong> her best friend. At the end, she said that no matter where children <strong>were</strong> from, their dreams <strong>were</strong> valid.",
          ],
          sources: [
            { name: "Academy Awards Acceptance Speeches Database", url: "https://aaspeechesdb.oscars.org/link/086-4/" },
            { name: "Yale: Lupita Nyong'o", url: "https://oiss.yale.edu/lupita-nyongo-kenya-and-mexico" },
          ],
          accent: "terracotta",
        })}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem">When you report a statement, the verb often moves back one step: <strong>is → was</strong>, <strong>can → could</strong>, <strong>will → would</strong>. Use <strong>said that</strong> + subject + verb.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.5rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("is → was", "terracotta")}
            <span><em>Direct: "You <strong>are</strong> my best friend." → Reported: She told him he <strong>was</strong> her best friend.</em></span>
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

        <p>Back at the clinic call, Luz uses this pattern. Marco is wiping down the prep station at the restaurant when she texts him: "Kelly <strong>said that</strong> we <strong>could</strong> get the inhaler refilled today." A little later: "She <strong>said that</strong> we <strong>had</strong> to get there before 6."</p>
      `,
      exercises: [
        {
          id: "s2-ex1",
          title: "Change to Reported Speech",
          instructions: "Choose the correct reported sentence.",
          items: [
            {
              type: "radio",
              label: "Lupita Nyong'o said: \"No matter where you're from, your dreams are valid.\" How do you report this?",
              options: [
                { value: "a", label: "She said that no matter where children were from, their dreams were valid." },
                { value: "b", label: "She said that no matter where children from, their dreams valid." },
                { value: "c", label: "She said that were their dreams valid no matter where children were from." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Kelly said: \"The pharmacy closes at 6.\" How does Luz report this?",
              options: [
                { value: "a", label: "Kelly said that the pharmacy closing at 6." },
                { value: "b", label: "Kelly said that the pharmacy closed at 6." },
                { value: "c", label: "Kelly said that does the pharmacy close at 6." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s2-ex2",
          title: "Read the Card",
          instructions: "Look at the reading about Lupita Nyong'o.",
          items: [
            {
              type: "radio",
              label: "Which sentence is true?",
              options: [
                { value: "a", label: "Lupita grew up in Mexico." },
                { value: "b", label: "Lupita grew up in Kenya." },
                { value: "c", label: "Lupita grew up in the United States." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "In what year did Lupita graduate from the Yale School of Drama? Write the year.",
              expectedAnswers: ["2012"],
            },
          ],
        },
        {
          id: "s2-ex3",
          title: "Fill in the Blank",
          instructions: "Write the back-shifted verb.",
          items: [
            {
              type: "text",
              label: "Direct: \"The doctor will call tomorrow.\" Reported: Luz said the doctor ___ call tomorrow.",
              expectedAnswers: ["would"],
            },
          ],
        },
        {
          id: "s2-ex4",
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
        <p>Wednesday morning. Marco picked up the new inhaler before 6, and the pharmacist gave him this sheet. Their cousin Gloria is watching Amina before school, so Marco tells her what the pharmacist said.</p>

        ${stepsCard({
          kicker: "Pharmacy sheet",
          title: "Amina's inhaler",
          steps: [
            "<strong>Shake</strong> the inhaler before each use.",
            "<strong>Keep</strong> it at room temperature. <strong>Don't leave</strong> it in a cold car.",
            "<strong>Don't use</strong> the old nebulizer.",
            "<strong>Call</strong> the clinic if her breathing gets worse.",
          ],
          note: "Marco reads this sheet to Gloria. He says: \"The pharmacist told me to...\"",
          accent: "sage",
        })}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="margin: 1rem 0 1.5rem 0; padding: 1.1rem 1.25rem; border-radius: 0.6rem">
          <p style="margin: 0; font-size: 1rem">For commands and advice, use <strong>told / asked + person + to + verb</strong>. For negative commands: <strong>told + person + not to + verb</strong>.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.5rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("told me to", "sage")}
            <span><em>Direct: "Keep it at room temperature." → He told me to keep it at room temperature.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("asked me to", "blue")}
            <span><em>Direct: "Please call if symptoms get worse." → He asked me to call if symptoms got worse.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.08); border-radius: 0.4rem">
            ${labelPill("told me not to", "terracotta")}
            <span><em>Direct: "Don't leave it in a cold car." → He told us not to leave it in a cold car.</em></span>
          </div>
        </div>

        <p>Tonight Marco will call his mother Lucia in Guatemala. She worries about Amina, so he will tell her what the clinic and the pharmacist said.</p>
      `,
      exercises: [
        {
          id: "s3-ex1",
          title: "Choose the Reported Command",
          instructions: "Pick the correct reported form.",
          items: [
            {
              type: "radio",
              label: "The pharmacist said: \"Shake the inhaler before each use.\" How does Marco report this?",
              options: [
                { value: "a", label: "The pharmacist told me shaking the inhaler before each use." },
                { value: "b", label: "The pharmacist told me to shake the inhaler before each use." },
                { value: "c", label: "The pharmacist told me shake the inhaler before each use." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Look at the pharmacy sheet. Which sentence is true?",
              options: [
                { value: "a", label: "The pharmacist told us to keep the inhaler in the car." },
                { value: "b", label: "The pharmacist told us to keep the inhaler at room temperature." },
                { value: "c", label: "The pharmacist told us to use the old nebulizer." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s3-ex2",
          title: "Fill in the Blank",
          instructions: "Write to or not.",
          items: [
            {
              type: "text",
              label: "Direct: \"Call if her breathing gets worse.\" Reported: He asked us ___ call if her breathing got worse.",
              expectedAnswers: ["to"],
            },
            {
              type: "text",
              label: "Look at step 3 on the sheet. The pharmacist told us ___ to use the old nebulizer.",
              expectedAnswers: ["not"],
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
              words: ["The", "pharmacist", "told", "us", "not", "to", "leave", "it", "in", "the", "car"],
              correctAnswer: "The pharmacist told us not to leave it in the car",
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
        <p>Wednesday, 2 PM. Clinic receptionist <strong>Sarah</strong> called back about Amina's follow-up. Luz was at work, so Marco answered. He wrote Sarah's questions on a list. A ✅ means he answered it. A ⬜ means he must ask Luz.</p>

        ${checklist({
          kicker: "Clinic call",
          title: "Sarah's questions for Marco",
          items: [
            { text: "<strong>Is</strong> Amina feeling better?", done: true },
            { text: "<strong>When</strong> can you come for the follow-up?", done: false },
            { text: "<strong>What time</strong> does Amina finish school?", done: false },
            { text: "<strong>Did</strong> you bring the new insurance card last time?", done: false },
          ],
        })}

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
              label: "Sarah asked: \"What time does Amina finish school?\" How does Marco report this?",
              options: [
                { value: "a", label: "Sarah asked what time does Amina finish school." },
                { value: "b", label: "Sarah asked what time Amina finished school." },
                { value: "c", label: "Sarah asked what time Amina finishes school?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Look at the list. Marco must ask Luz about the follow-up. How does he report Sarah's question?",
              options: [
                { value: "a", label: "Sarah asked when could we come for the follow-up." },
                { value: "b", label: "Sarah asked when we could come for the follow-up." },
                { value: "c", label: "Sarah asked if when we could come for the follow-up." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "s4-ex2",
          title: "Fill in the Blank",
          instructions: "Write if or a number.",
          items: [
            {
              type: "text",
              label: "Direct: \"Did you bring the insurance card?\" Reported: She asked ___ we had brought the insurance card.",
              expectedAnswers: ["if"],
            },
            {
              type: "text",
              label: "Look at the list. How many of Sarah's questions did Marco already answer? Write a number.",
              expectedAnswers: ["1", "one"],
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

        <p>Marco calls his mother Lucia in Guatemala on his break. He has to explain, in his own words, what three different people told him.</p>

        ${dialogue([
          { speaker: "Marco", avatar: "👨🏽", text: "Mamá, the nurse <strong>said that</strong> Amina's inhaler <strong>was</strong> almost empty.", side: "right", tone: "terracotta" },
          { speaker: "Lucia", avatar: "👵🏽", text: "Ay, mijo. And the pharmacy?", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "The pharmacist <strong>told me to</strong> keep it at room temperature. He <strong>told us not to</strong> use the old machine.", side: "right", tone: "terracotta" },
          { speaker: "Lucia", avatar: "👵🏽", text: "Good. Tell Amina to call me after school. When is her next appointment?", side: "left", tone: "sage" },
          { speaker: "Marco", avatar: "👨🏽", text: "Sarah <strong>asked when</strong> we <strong>could</strong> come back. I <strong>said that</strong> Saturday might work. We’re waiting to hear.", side: "right", tone: "terracotta" },
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
              label: "The pharmacist said: \"Don't use the old nebulizer.\"",
              options: [
                { value: "a", label: "The pharmacist said that we don't use the old nebulizer." },
                { value: "b", label: "The pharmacist told us not to use the old nebulizer." },
                { value: "c", label: "The pharmacist asked if we use the old nebulizer." },
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
              words: ["He", "told", "me", "to", "keep", "the", "inhaler", "at", "room", "temperature"],
              correctAnswer: "He told me to keep the inhaler at room temperature",
            },
          ],
        },
        {
          id: "s5-ex4",
          title: "Find the Error",
          items: [
            {
              type: "radio",
              label: "Marco texts Luz: \"Sarah asked when can we come Saturday.\" What is wrong?",
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
      question: "Kelly said: \"The new inhaler is ready.\" How does Luz report this to Marco?",
      options: [
        { value: "a", label: "Kelly said that the new inhaler ready." },
        { value: "b", label: "Kelly said that the new inhaler was ready." },
        { value: "c", label: "Kelly told me to the new inhaler was ready." },
      ],
      correctAnswer: "b",
      explanation: "In reported statements, is becomes was. Use said that + subject + verb.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "back-shift-is-was",
      difficulty: "easy",
    },
    {
      id: "doctor-said-q3",
      question: "Sarah said: \"Bring the new insurance card to the follow-up.\" How does Marco tell Luz?",
      options: [
        { value: "a", label: "Sarah told me to bring the new insurance card to the follow-up." },
        { value: "b", label: "Sarah said that bring the new insurance card to the follow-up." },
        { value: "c", label: "Sarah asked me bring the new insurance card to the follow-up." },
      ],
      correctAnswer: "a",
      explanation: "Commands use told + person + to + base verb.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "reported-command-told-to",
      difficulty: "easy",
    },
    {
      id: "doctor-said-fb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Kelly said: 'We can refill it today.' → Kelly said that they ___ refill it today.\" (can back-shifts in reported speech)",
      correctAnswer: "could",
      explanation: "Can back-shifts to could in reported speech.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "back-shift-can-could",
      difficulty: "easy",
    },
    {
      id: "doctor-said-q7",
      question: "Find the error. Luz is talking about last week: \"Kelly said that the pharmacy will refill it the next day.\"",
      options: [
        { value: "a", label: "No error." },
        { value: "b", label: "Error: will should be would." },
        { value: "c", label: "Error: said should be told." },
      ],
      correctAnswer: "b",
      explanation: "Kelly spoke in the past about a time that is now past, so will back-shifts to would: Kelly said the pharmacy would refill it the next day.",
      topic: "reported-speech",
      skill: "error-detection",
      skillTag: "error-detection-will-would",
      difficulty: "medium",
    },
    {
      id: "doctor-said-ws1",
      type: "word-scramble" as const,
      question: "Marco reports what the pharmacist said about Amina's inhaler. Put the words in order.",
      words: ["The", "pharmacist", "told", "me", "to", "keep", "the", "inhaler", "inside"],
      correctAnswer: "The pharmacist told me to keep the inhaler inside",
      hint: "reported command: told + person + to + verb",
      explanation: "Commands in reported speech use told + person + to + base verb.",
      topic: "reported-speech",
      skill: "usage",
      skillTag: "reported-command-word-order",
      difficulty: "medium",
    },
  ],
};
