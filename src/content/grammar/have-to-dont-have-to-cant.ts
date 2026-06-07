import type { InteractiveGuideContent } from "@/types/activity";
import { haveToDontHaveToCantImages as img } from "@/data/have-to-dont-have-to-cant-images.generated";

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

export const haveToDontHaveToCantContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Have to / Has to
    // =========================================================================
    {
      id: "have-to-obligation",
      title: "Have to. The landlord must fix it",
      icon: "🔧",
      explanation: `
        ${sceneCard("sceneHotline", "East Boston Housing Hotline, January. Rosa's heat stopped working three days ago.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Lisa at the hotline answers calls like Rosa\'s every winter.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "My heat stopped working on Monday. It's freezing in my apartment. What can I do?", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "The landlord <strong>has to</strong> provide heat. It's the law in Massachusetts.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And if he doesn't fix it?", side: "right", tone: "terracotta" },
          { speaker: "Claudette", avatar: "👩🏾", text: "He <strong>has to</strong> fix it within 24 hours in winter. You don't <strong>have to</strong> wait. Call the city inspector.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Have to / Has to</strong> = something is required. Someone is obligated to do it. It is not a choice.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("landlord's duty", "sage")}
            <span><em>The landlord <strong>has to</strong> fix the heat.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("landlord's duty", "sage")}
            <span><em>He <strong>has to</strong> give 24 hours notice before entering.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("tenant's duty", "terracotta")}
            <span><em>I <strong>have to</strong> pay rent by the first of the month.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("tenant's duty", "terracotta")}
            <span><em>We <strong>have to</strong> report repairs in writing.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.85rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> I / you / we / they <strong>have to</strong> + verb. &nbsp; He / she / it <strong>has to</strong> + verb.</p>
        </div>
      `,
      exercises: [
        {
          id: "have-to-ex1",
          title: "Choose the right sentence",
          instructions: "Pick the correct form for each situation.",
          items: [
            {
              type: "radio",
              label: "The sink is leaking. What does the law say about the landlord?",
              options: [
                { value: "a", label: "He have to fix it." },
                { value: "b", label: "He has to fix it." },
                { value: "c", label: "He to fix it." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Rosa and her roommate ___ pay rent on the first. (have to / has to)",
              options: [
                { value: "a", label: "has to" },
                { value: "b", label: "have to" },
                { value: "c", label: "having to" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"The landlord <strong>have to</strong> give notice before coming in.\" Is this correct?",
              options: [
                { value: "correct", label: "Yes, correct." },
                { value: "incorrect", label: "No, should be 'has to' because landlord = he." },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "have-to-ex2",
          title: "Fill in the blank",
          instructions: "Write the correct form: have to or has to.",
          items: [
            {
              type: "text",
              label: "The inspector ___ come before Friday.",
              expectedAnswers: ["has to"],
            },
            {
              type: "text",
              label: "Tenants ___ report problems in writing.",
              expectedAnswers: ["have to"],
            },
          ],
        },
        {
          id: "have-to-ex3",
          title: "Unscramble the sentence",
          instructions: "Put the words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["The", "landlord", "has", "to", "fix", "the", "heat", "in", "24", "hours"],
              correctAnswer: "The landlord has to fix the heat in 24 hours",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. Don't have to / Doesn't have to
    // =========================================================================
    {
      id: "dont-have-to-no-obligation",
      title: "Don't have to. You're not required",
      icon: "📋",
      explanation: `
        ${sceneCard("sceneLease", "Rosa's kitchen table. She and her cousin Javier are reading her lease.", "blue")}

        ${dialogue([
          { speaker: "Javier", avatar: "👨🏽", text: "Look at this part. It says you're responsible for cleaning. But what about painting?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "I don't know. Do I <strong>have to</strong> paint the walls when I leave?", side: "right", tone: "terracotta" },
          { speaker: "Javier", avatar: "👨🏽", text: "No. You <strong>don't have to</strong> repaint. That's the landlord's job if it's normal wear.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And I <strong>don't have to</strong> pay for the broken stair either, right? That was already broken.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Don't have to / Doesn't have to</strong> = something is NOT required. You have a choice. It is allowed, but not obligatory.</p>
        </div>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 0.85rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.95rem"><strong>Important:</strong> <em>Don't have to</em> is NOT the same as <em>can't</em>. "You don't have to sign" = you can sign or not sign. "You can't sign" = it is not allowed.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not required", "sage")}
            <span><em>Rosa <strong>doesn't have to</strong> pay for old-building repairs.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not required", "sage")}
            <span><em>She <strong>doesn't have to</strong> renew the lease.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not required", "sage")}
            <span><em>Tenants <strong>don't have to</strong> give a reason when they leave at the end of the lease.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "dont-have-to-ex1",
          title: "Don't have to or Can't?",
          instructions: "Choose the correct meaning for each sentence.",
          items: [
            {
              type: "radio",
              label: "\"You don't have to pay a pet fee if you don't have a pet.\" What does this mean?",
              options: [
                { value: "a", label: "It is not allowed to pay a pet fee." },
                { value: "b", label: "It is not necessary to pay a pet fee." },
                { value: "c", label: "You must not have a pet." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The landlord ___ come into your apartment without notice. (it is not allowed)",
              options: [
                { value: "a", label: "doesn't have to" },
                { value: "b", label: "can't" },
                { value: "c", label: "don't have to" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"You <strong>don't have to</strong> renew your lease\" means you ___ renew if you don't want to.",
              options: [
                { value: "a", label: "must" },
                { value: "b", label: "can't" },
                { value: "c", label: "can choose not to" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "dont-have-to-ex2",
          title: "Unscramble the sentence",
          instructions: "Put the words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Rosa", "doesn't", "have", "to", "pay", "for", "the", "broken", "stairs"],
              correctAnswer: "Rosa doesn't have to pay for the broken stairs",
            },
          ],
        },
        {
          id: "dont-have-to-ex3",
          title: "Fill in the blank",
          instructions: "Write don't have to or doesn't have to.",
          items: [
            {
              type: "text",
              label: "The tenant ___ repaint the walls if it's normal wear.",
              expectedAnswers: ["doesn't have to"],
            },
            {
              type: "text",
              label: "We ___ give 30 days notice if the landlord breaks the lease first.",
              expectedAnswers: ["don't have to"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Can't
    // =========================================================================
    {
      id: "cant-prohibition",
      title: "Can't. This is not allowed",
      icon: "🚫",
      explanation: `
        ${sceneCard("sceneDoor", "Apartment building hallway. Rosa's neighbor Amara stops her at the door.", "terracotta")}

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "Rosa, the landlord called me too. He says he wants to show the apartment next week.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "But I didn't say I'm leaving. <strong>Can</strong> he just do that?", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "He <strong>can't</strong> show it without your permission while you still live there. And he <strong>can't</strong> come in without 24 hours notice.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And that extra fee on my bill? The one for 'building costs'?", side: "right", tone: "terracotta" },
          { speaker: "Amara", avatar: "👩🏿", text: "He <strong>can't</strong> charge fees that aren't in your lease. That's illegal.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Can't</strong> = it is not allowed. It is against the rules or the law. It is prohibited.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>The landlord <strong>can't</strong> enter without 24 hours notice.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>He <strong>can't</strong> charge fees that are not in the lease.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>He <strong>can't</strong> evict a tenant without a court order.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>A landlord <strong>can't</strong> shut off heat in winter.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "cant-ex1",
          title: "Spot the error",
          instructions: "Is the underlined word correct? Choose the right answer.",
          items: [
            {
              type: "radio",
              label: "\"The landlord <strong>don't have to</strong> enter without notice.\" Is this correct?",
              options: [
                { value: "correct", label: "Yes, correct." },
                { value: "incorrect", label: "No, should be 'can't'. entering without notice is not allowed." },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "Which sentence means it is against the law?",
              options: [
                { value: "a", label: "You don't have to pay that fee." },
                { value: "b", label: "You can't be evicted without a court order." },
                { value: "c", label: "You have to sign the lease." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The landlord called. He wants to come in tomorrow morning with no warning. What do you say?",
              options: [
                { value: "a", label: "You don't have to give notice." },
                { value: "b", label: "You can't come in without 24 hours notice." },
                { value: "c", label: "You have to come in tomorrow." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "cant-ex2",
          title: "Fill in the blank",
          instructions: "Write can't.",
          items: [
            {
              type: "text",
              label: "The landlord ___ turn off the heat in January.",
              expectedAnswers: ["can't"],
            },
            {
              type: "text",
              label: "He ___ add fees that are not in the lease.",
              expectedAnswers: ["can't"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Putting it all together
    // =========================================================================
    {
      id: "putting-it-together",
      title: "Putting it all together",
      icon: "📄",
      explanation: `
        <div style="margin-bottom: 1.25rem">
          <p>Rosa got a tenant rights flyer at the health center. Her coworker Diego is helping her read it during their break.</p>
        </div>

        ${dialogue([
          { speaker: "Diego", avatar: "👨🏾", text: "Look at this flyer. It says 'Your rights as a tenant.' Let's go through it.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "OK. It says landlords <strong>have to</strong> keep the heat above 68 degrees from September to June.", side: "right", tone: "terracotta" },
          { speaker: "Diego", avatar: "👨🏾", text: "Right, that's required. And this one: 'Tenants <strong>don't have to</strong> pay for repairs caused by normal use.' That means it's not your responsibility.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And this: 'Landlords <strong>can't</strong> retaliate if you file a complaint.' Good to know.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1.25rem 0">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.95rem">Quick reference</p>
          <div style="display: grid; gap: 0.4rem; font-size: 0.95rem">
            <div><strong>Have to / Has to</strong> = required, obligated</div>
            <div><strong>Don't have to / Doesn't have to</strong> = not required, your choice</div>
            <div><strong>Can't</strong> = not allowed, against the rules</div>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: rgba(0,0,0,0.55); margin: 0.5rem 0 1.25rem 0">Black History Month: Boston's Fair Housing Act of 1968 made it illegal to discriminate in rental housing. These rights protect every tenant.</p>
      `,
      exercises: [
        {
          id: "together-ex1",
          title: "Read the flyer",
          instructions: "Each statement comes from the tenant rights flyer. Choose the best label.",
          items: [
            {
              type: "radio",
              label: "\"The landlord must provide hot water at all times.\"",
              options: [
                { value: "a", label: "have to. it is required" },
                { value: "b", label: "don't have to. it is not required" },
                { value: "c", label: "can't. it is not allowed" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"Tenants are not required to repaint walls when they leave.\"",
              options: [
                { value: "a", label: "have to. it is required" },
                { value: "b", label: "don't have to. it is not required" },
                { value: "c", label: "can't. it is not allowed" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"Landlords are prohibited from entering without 24 hours notice.\"",
              options: [
                { value: "a", label: "have to. it is required" },
                { value: "b", label: "don't have to. it is not required" },
                { value: "c", label: "can't. it is not allowed" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "\"You are not obligated to accept a rent increase mid-lease.\"",
              options: [
                { value: "a", label: "have to. it is required" },
                { value: "b", label: "don't have to. it is not required" },
                { value: "c", label: "can't. it is not allowed" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "together-ex2",
          title: "Unscramble the tenant rights sentence",
          instructions: "Put the words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["A", "landlord", "can't", "evict", "you", "without", "a", "court", "order"],
              correctAnswer: "A landlord can't evict you without a court order",
            },
          ],
        },
        {
          id: "together-ex3",
          title: "Complete the rule",
          instructions: "Write have to, don't have to, or can't.",
          items: [
            {
              type: "text",
              label: "The landlord ___ fix a broken heater. (required)",
              expectedAnswers: ["has to", "have to"],
            },
            {
              type: "text",
              label: "You ___ pay fees that are not in your lease. (not allowed)",
              expectedAnswers: ["can't"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/modals-obligation-permission\" style=\"font-weight:700;text-decoration:underline\">Modals: Obligation + Permission Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "have-to-dont-have-to-cant-q3",
      question: "Your cousin asks if he has to come to the lease signing. He is not on the lease. Which answer is correct?",
      options: [
        { value: "a", label: "Yes, he has to come." },
        { value: "b", label: "No, he can't come." },
        { value: "c", label: "No, he doesn't have to come." },
      ],
      correctAnswer: "c",
      explanation: "Doesn't have to = not required. He is allowed to come, but it is not necessary.",
      topic: "dont-have-to",
      skill: "usage",
      skillTag: "no-obligation-vs-prohibition",
      difficulty: "easy",
    },
    {
      id: "have-to-dont-have-to-cant-q6",
      question: "\"You don't have to pay that fee\" means the same as \"You can't pay that fee.\"",
      options: [
        { value: "a", label: "True. Both mean you are not allowed to pay the fee." },
        { value: "b", label: "False. Don't have to = not required. Can't = not allowed. They are different." },
        { value: "c", label: "True. Don't have to and can't both mean the fee is optional." },
      ],
      correctAnswer: "b",
      explanation: "Don't have to means it is optional. Can't means it is prohibited. These are opposite ideas.",
      topic: "dont-have-to",
      skill: "recognition",
      skillTag: "dont-have-to-vs-cant",
      difficulty: "medium",
    },
    {
      id: "have-to-dont-have-to-cant-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"You ___ repaint the walls. That's the landlord's job.\" (Two words — not required.)",
      correctAnswer: "don't have to",
      explanation: "'Don't have to' means it is not your responsibility. 'Can't' would mean it is forbidden, which is different.",
      topic: "dont-have-to",
      skill: "usage",
      skillTag: "no-obligation-housing",
      difficulty: "medium",
    },
    {
      id: "have-to-dont-have-to-cant-qws1",
      type: "word-scramble" as const,
      question: "The lease explains what the landlord must do before entering. Put the words in order.",
      words: ["The", "landlord", "has", "to", "give", "notice"],
      correctAnswer: "The landlord has to give notice",
      hint: "has to = required",
      explanation: "'Has to' shows the landlord is legally required to give notice before entering.",
      topic: "have-to",
      skill: "usage",
      skillTag: "obligation-tenant-rights",
      difficulty: "medium",
    },
    {
      id: "have-to-dont-have-to-cant-q8",
      question: "Which sentence is NOT correct?",
      options: [
        { value: "a", label: "The landlord has to keep the heat above 68 degrees." },
        { value: "b", label: "She doesn't have to pay for normal wear." },
        { value: "c", label: "Tenants can't to call the inspector." },
      ],
      correctAnswer: "c",
      explanation: "Can't is followed by a base verb without 'to': can't call, not can't to call.",
      topic: "cant",
      skill: "error-detection",
      skillTag: "modal-verb-form",
      difficulty: "medium",
    },
  ],
};
