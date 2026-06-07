import type { InteractiveGuideContent } from "@/types/activity";
import { askingRightQuestionsHousingImages as img } from "@/data/asking-right-questions-housing-images.generated";

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

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const askingRightQuestionsHousingContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. What's the Place Like?
    // =========================================================================
    {
      id: "whats-the-place-like",
      stepNumber: 1,
      title: "What's the Place Like?",
      icon: "🏠",
      explanation: `
        ${sceneCard("sceneApartmentListing", "Meridian Street, East Boston. Rosa's break. She sees a listing taped to the laundromat window.", "terracotta")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "<strong>Where</strong> is the apartment?", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "🧑🏻", text: "It's on Leyden Street, third floor.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "<strong>How many</strong> bedrooms does it have?", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "🧑🏻", text: "Two bedrooms.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "<strong>What</strong> floor is it on?", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Information questions</strong> start with a question word (Who, What, Where, When, Why, How). The verb comes <em>before</em> the subject: <em>Does <strong>it</strong> have?</em> not <em>It does have?</em></p>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(176,87,64,0.06); border-left: 3px solid #b05740; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.3rem 0; font-weight: 700; font-size: 0.93rem">The pattern:</p>
          <p style="margin: 0; font-size: 0.93rem">
            <strong>Question word + do/does/is/are + subject + verb?</strong><br>
            Where <strong>is</strong> the apartment?<br>
            How many bedrooms <strong>does</strong> it have?<br>
            What floor <strong>is</strong> it on?
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("where", "terracotta")}
            <span><em><strong>Where</strong> is the apartment?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("how many", "terracotta")}
            <span><em><strong>How many</strong> bedrooms does it have?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("what", "terracotta")}
            <span><em><strong>What</strong> floor is it on?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("when", "terracotta")}
            <span><em><strong>When</strong> is it available?</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "arqh-s1-ex1",
          title: "Choose the correct question",
          instructions: "Pick the correctly formed question.",
          items: [
            {
              type: "radio",
              label: "You want to know the address. Which question is correct?",
              options: [
                { value: "a", label: "Where the apartment is?" },
                { value: "b", label: "Where is the apartment?" },
                { value: "c", label: "The apartment where is?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "You want to know the number of bedrooms. Which question is correct?",
              options: [
                { value: "a", label: "How many bedrooms it has?" },
                { value: "b", label: "How many bedrooms does it have?" },
                { value: "c", label: "It has how many bedrooms?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"What floor is it on?\" Is this question correct?",
              options: [
                { value: "correct", label: "Yes, correct." },
                { value: "incorrect", label: "No. Should be: 'What floor it is on?'" },
              ],
              expectedAnswer: "correct",
            },
          ],
        },
        {
          id: "arqh-s1-ex2",
          title: "Build the question",
          instructions: "Unscramble the words to make a correct question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "many", "bedrooms", "does", "the", "apartment", "have"],
              correctAnswer: "How many bedrooms does the apartment have",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["When", "is", "the", "apartment", "available"],
              correctAnswer: "When is the apartment available",
            },
          ],
        },
        {
          id: "arqh-s1-ex3",
          title: "Write the question word",
          instructions: "Fill in the blank with the correct question word: What, Where, When, or How many.",
          items: [
            {
              type: "text",
              label: "___ floor is the apartment on?",
              expectedAnswers: ["What"],
            },
            {
              type: "text",
              label: "___ is it available?",
              expectedAnswers: ["When"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. How Much Is the Rent?
    // =========================================================================
    {
      id: "how-much-is-the-rent",
      stepNumber: 2,
      title: "How Much Is the Rent?",
      icon: "💵",
      explanation: `
        ${sceneCard("scenePhoneCall", "Rosa outside the laundromat. Brian picks up. She has five minutes before her shift starts.", "amber")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "<strong>How much</strong> is the rent?", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "🧑🏻", text: "Fourteen hundred a month.", side: "left", tone: "amber" },
          { speaker: "Rosa", avatar: "👩🏽", text: "<strong>Is</strong> heat included?", side: "right", tone: "terracotta" },
          { speaker: "Brian", avatar: "🧑🏻", text: "Heat and hot water are included. Electricity is extra.", side: "left", tone: "amber" },
          { speaker: "Rosa", avatar: "👩🏽", text: "<strong>Is</strong> there a laundry in the building?", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>How much</strong> asks about price or an uncountable amount. <strong>How many</strong> asks about a countable number. Both follow the same inversion rule: verb before subject.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(233,196,106,0.08); border-radius: 0.5rem; border-top: 3px solid #e9c46a">
            <div class="gc-text-amber" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Correct</div>
            <div style="font-size: 0.95rem; margin-bottom: 0.3rem"><em>How much <strong>is</strong> the rent?</em></div>
            <div style="font-size: 0.88rem; opacity: 0.8">Verb before subject.</div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Common error</div>
            <div style="font-size: 0.95rem; margin-bottom: 0.3rem"><em>The rent is how much?</em></div>
            <div style="font-size: 0.88rem; opacity: 0.8">No inversion. Not a real question in English.</div>
          </div>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("how much", "amber")}
            <span><em><strong>How much</strong> is the rent?</em> (price)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.07); border-radius: 0.4rem">
            ${labelPill("how much", "amber")}
            <span><em><strong>How much</strong> is the security deposit?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("yes/no", "sage")}
            <span><em><strong>Is</strong> heat included?</em> (yes/no question)</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("yes/no", "sage")}
            <span><em><strong>Are</strong> pets allowed?</em> (yes/no question)</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "arqh-s2-ex1",
          title: "Correct or not correct?",
          instructions: "Is the question formed correctly?",
          items: [
            {
              type: "radio",
              label: "\"The rent is how much?\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: How much is the rent?" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "\"Is heat included?\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: Heat is included?" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"How much the security deposit is?\"",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be: How much is the security deposit?" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "arqh-s2-ex2",
          title: "How much or How many?",
          instructions: "Choose the correct question word.",
          items: [
            {
              type: "radio",
              label: "___ is the security deposit?",
              options: [
                { value: "How much", label: "How much (price)" },
                { value: "How many", label: "How many (count)" },
              ],
              expectedAnswer: "How much",
            },
            {
              type: "radio",
              label: "___ rooms does the apartment have?",
              options: [
                { value: "How much", label: "How much (price)" },
                { value: "How many", label: "How many (count)" },
              ],
              expectedAnswer: "How many",
            },
          ],
        },
        {
          id: "arqh-s2-ex3",
          title: "Build the question",
          instructions: "Unscramble to make a correct question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "much", "is", "the", "security", "deposit"],
              correctAnswer: "How much is the security deposit",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Are", "pets", "allowed", "in", "the", "building"],
              correctAnswer: "Are pets allowed in the building",
            },
          ],
        },
        {
          id: "arqh-s2-ex4",
          title: "Write the missing word",
          instructions: "Fill in the blank.",
          items: [
            {
              type: "text",
              label: "___ laundry included in the building?",
              expectedAnswers: ["Is"],
            },
            {
              type: "text",
              label: "How ___ is the rent?",
              expectedAnswers: ["much"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Can You Tell Me If...?
    // =========================================================================
    {
      id: "can-you-tell-me-if",
      stepNumber: 3,
      title: "Can You Tell Me If...?",
      icon: "📋",
      explanation: `
        ${sceneCard("sceneOfficeDesk", "Chelsea Street property management office. Nadine calls from her break at the hotel.", "sage")}

        ${dialogue([
          { speaker: "Nadine", avatar: "👩🏾", text: "Hello. <strong>Can you tell me</strong> what the monthly rent is?", side: "right", tone: "sage" },
          { speaker: "Scott", avatar: "🧑🏽", text: "Sure. The two-bedroom apartment is $1,350 a month.", side: "left", tone: "blue" },
          { speaker: "Nadine", avatar: "👩🏾", text: "<strong>Do you know</strong> if heat is included?", side: "right", tone: "sage" },
          { speaker: "Scott", avatar: "🧑🏽", text: "Yes, heat and hot water are both included.", side: "left", tone: "blue" },
          { speaker: "Nadine", avatar: "👩🏾", text: "<strong>Can you tell me</strong> whether children are allowed?", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Indirect questions</strong> are polite. After "Can you tell me" or "Do you know," the word order changes to <em>statement order</em>. No inversion.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          <div style="padding: 0.9rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-top: 3px solid #b05740">
            <div class="gc-text-terracotta" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Direct question</div>
            <div style="font-size: 0.93rem; margin-bottom: 0.25rem"><em>What <strong>is</strong> the rent?</em></div>
            <div style="font-size: 0.88rem; opacity: 0.8">Verb before subject (inversion).</div>
          </div>
          <div style="padding: 0.9rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-top: 3px solid #6a8d73">
            <div class="gc-text-sage" style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.5rem">Indirect question</div>
            <div style="font-size: 0.93rem; margin-bottom: 0.25rem"><em>Can you tell me what the rent <strong>is</strong>?</em></div>
            <div style="font-size: 0.88rem; opacity: 0.8">Subject before verb (statement order).</div>
          </div>
        </div>

        <div style="padding: 0.85rem 1rem; background: rgba(106,141,115,0.08); border-left: 3px solid #6a8d73; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.4rem 0; font-weight: 700; font-size: 0.93rem">Two patterns to use:</p>
          <p style="margin: 0; font-size: 0.93rem; line-height: 1.7">
            <strong>Can you tell me</strong> + what/where/when/how much + [subject + verb]?<br>
            <strong>Do you know</strong> + if/whether + [subject + verb]?
          </p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("indirect", "sage")}
            <span><em>Can you tell me <strong>what the rent is</strong>?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("indirect", "sage")}
            <span><em>Do you know <strong>if heat is included</strong>?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("indirect", "sage")}
            <span><em>Can you tell me <strong>whether children are allowed</strong>?</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "arqh-s3-ex1",
          title: "Direct or indirect?",
          instructions: "Choose the correctly formed indirect question.",
          items: [
            {
              type: "radio",
              label: "You want to ask about the deposit, politely. Which is correct?",
              options: [
                { value: "a", label: "Can you tell me what is the deposit?" },
                { value: "b", label: "Can you tell me what the deposit is?" },
                { value: "c", label: "Can you tell me the deposit what is?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "You want to know if pets are allowed. Which is correct?",
              options: [
                { value: "a", label: "Do you know if are pets allowed?" },
                { value: "b", label: "Do you know pets are allowed?" },
                { value: "c", label: "Do you know if pets are allowed?" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "arqh-s3-ex2",
          title: "Spot the word order mistake",
          instructions: "One of these indirect questions has wrong word order. Choose the correct version.",
          items: [
            {
              type: "radio",
              label: "\"Can you tell me when is the apartment available?\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "Can you tell me when the apartment is available? (statement order after 'tell me')" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"Do you know if the building has laundry?\"",
              options: [
                { value: "a", label: "Correct as is." },
                { value: "b", label: "Do you know if has the building laundry?" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "arqh-s3-ex3",
          title: "Build the indirect question",
          instructions: "Unscramble to make a correct indirect question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Can", "you", "tell", "me", "what", "the", "rent", "is"],
              correctAnswer: "Can you tell me what the rent is",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Do", "you", "know", "if", "heat", "is", "included"],
              correctAnswer: "Do you know if heat is included",
            },
          ],
        },
        {
          id: "arqh-s3-ex4",
          title: "Write the missing word",
          instructions: "Fill in the blank to complete the indirect question.",
          items: [
            {
              type: "text",
              label: "Can you tell me ___ the deposit is?",
              expectedAnswers: ["what"],
            },
            {
              type: "text",
              label: "Do you know ___ children are allowed?",
              expectedAnswers: ["if", "whether"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Questions to Ask Before You Waste a Trip
    // =========================================================================
    {
      id: "questions-before-you-waste-a-trip",
      stepNumber: 4,
      title: "Questions to Ask Before You Waste a Trip",
      icon: "📞",
      explanation: `
        ${sceneCard("sceneAfterWork", "Outside the hotel, East Boston. Rosa and Nadine compare calls after the evening shift.", "blue")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "Did you ask about children? I forgot.", side: "right", tone: "terracotta" },
          { speaker: "Nadine", avatar: "👩🏾", text: "I said: <em>Can you tell me whether children are allowed?</em> He said yes.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Good. <strong>How long</strong> is the lease?", side: "right", tone: "terracotta" },
          { speaker: "Nadine", avatar: "👩🏾", text: "One year. And <strong>do you know when</strong> you can see it?", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "Monday. MLK Day. No work. I finally have time to call listings.", side: "right", tone: "terracotta" },
        ])}

        <div style="padding: 0.85rem 1rem; background: rgba(59,130,246,0.06); border-left: 3px solid #3b82f6; border-radius: 0 0.4rem 0.4rem 0; margin: 1rem 0">
          <p style="margin: 0 0 0.3rem 0; font-weight: 700; font-size: 0.93rem">Questions every renter should ask, direct and indirect:</p>
          <ul style="margin: 0; padding-left: 1.2rem; line-height: 2; font-size: 0.93rem">
            <li><strong>How much</strong> is the rent? / <em>Can you tell me how much the rent is?</em></li>
            <li><strong>Is</strong> heat included? / <em>Do you know if heat is included?</em></li>
            <li><strong>Are</strong> children allowed? / <em>Can you tell me whether children are allowed?</em></li>
            <li><strong>How long</strong> is the lease?</li>
            <li><strong>When</strong> can I see it? / <em>Do you know when I can see it?</em></li>
            <li><strong>Is</strong> there laundry in the building?</li>
            <li><strong>How much</strong> is the security deposit?</li>
          </ul>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Direct questions</strong> are fast and clear on the phone. <strong>Indirect questions</strong> sound polite at a formal office. Both are correct. Use the one that fits the situation.</p>
        </div>
      `,
      exercises: [
        {
          id: "arqh-s4-ex1",
          title: "Which question fits?",
          instructions: "Choose the better question for each situation.",
          items: [
            {
              type: "radio",
              label: "You are calling a private landlord quickly from the bus. Which question is better?",
              options: [
                { value: "a", label: "Can you tell me what the monthly rent is?" },
                { value: "b", label: "How much is the rent?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "You are at a property management office and want to ask about the lease. Which is better?",
              options: [
                { value: "a", label: "How long is the lease?" },
                { value: "b", label: "Can you tell me how long the lease is?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "arqh-s4-ex2",
          title: "Direct to indirect",
          instructions: "Choose the correct indirect version of the direct question.",
          items: [
            {
              type: "radio",
              label: "Direct: \"Are children allowed?\" Indirect version:",
              options: [
                { value: "a", label: "Can you tell me if are children allowed?" },
                { value: "b", label: "Can you tell me if children are allowed?" },
                { value: "c", label: "Do you know children are allowed?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Direct: \"When can I see it?\" Indirect version:",
              options: [
                { value: "a", label: "Do you know when can I see it?" },
                { value: "b", label: "Do you know when I can see it?" },
                { value: "c", label: "Can you tell me when I it can see?" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "arqh-s4-ex3",
          title: "Build the question",
          instructions: "Unscramble to make a correct indirect question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Can", "you", "tell", "me", "whether", "children", "are", "allowed"],
              correctAnswer: "Can you tell me whether children are allowed",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Do", "you", "know", "when", "I", "can", "see", "it"],
              correctAnswer: "Do you know when I can see it",
            },
          ],
        },
        {
          id: "arqh-s4-ex4",
          title: "Fill in the blank",
          instructions: "Complete the indirect question.",
          items: [
            {
              type: "text",
              label: "Can you tell me how much the security deposit ___?",
              expectedAnswers: ["is"],
            },
            {
              type: "text",
              label: "Do you know ___ laundry is available in the building?",
              expectedAnswers: ["if", "whether"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This guide covered information questions and indirect questions. For a full guide on information questions with more examples and practice, open the <a href=\"/grammar-reader/information-questions\" style=\"font-weight:700;text-decoration:underline\">Information Questions Full Guide</a>.",
      },
    },
  ],

  // ===========================================================================
  // MINI QUIZ. 10 questions
  // ===========================================================================
  miniQuiz: [
    {
      id: "arqh-q1",
      question: "Rosa wants to ask the landlord about the address. Which question is correct?",
      options: [
        { value: "a", label: "Where the apartment is?" },
        { value: "b", label: "Where is the apartment?" },
        { value: "c", label: "The apartment is where?" },
      ],
      correctAnswer: "b",
      explanation: "Information questions need inversion: question word + verb + subject. 'Where is the apartment?' is correct.",
      topic: "information-questions",
      skill: "usage",
      skillTag: "question-inversion",
      difficulty: "easy",
    },
    {
      id: "arqh-q3",
      question: "Rosa wants to ask about the price of rent. Which question word does she use?",
      options: [
        { value: "a", label: "How many" },
        { value: "b", label: "How much" },
        { value: "c", label: "How long" },
      ],
      correctAnswer: "b",
      explanation: "'How much' asks about price or an uncountable amount. 'How many' is for countable things like bedrooms.",
      topic: "how-much-vs-how-many",
      skill: "usage",
      skillTag: "how-much-price",
      difficulty: "easy",
    },
    {
      id: "arqh-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"Can you tell me ___ heat is included?\" (Indirect question — use if or whether.)",
      correctAnswer: "if",
      acceptedAnswers: ["whether"],
      explanation: "After 'Can you tell me,' use 'if' or 'whether' to introduce a yes/no indirect question. The verb stays in statement order.",
      topic: "indirect-questions",
      skill: "usage",
      skillTag: "if-whether-statement-order",
      difficulty: "medium",
    },
    {
      id: "arqh-qws1",
      type: "word-scramble" as const,
      question: "Rosa calls about an apartment listing. Put the words in order to ask about the rent.",
      words: ["How", "much", "is", "the", "rent"],
      correctAnswer: "How much is the rent",
      hint: "question word + verb + subject",
      explanation: "Direct questions invert the subject and verb: 'How much is the rent?' not 'How much the rent is.'",
      topic: "information-questions",
      skill: "usage",
      skillTag: "question-inversion",
      difficulty: "medium",
    },
    {
      id: "arqh-q5",
      question: "Which sentence has a word order mistake?",
      options: [
        { value: "a", label: "Do you know if heat is included?" },
        { value: "b", label: "Can you tell me when is it available?" },
        { value: "c", label: "Can you tell me whether children are allowed?" },
      ],
      correctAnswer: "b",
      explanation: "After 'Can you tell me,' use statement order. The correct version is: 'Can you tell me when it is available?' not 'when is it.'",
      topic: "indirect-questions",
      skill: "error-detection",
      skillTag: "indirect-word-order-error",
      difficulty: "medium",
    },
  ],
};
