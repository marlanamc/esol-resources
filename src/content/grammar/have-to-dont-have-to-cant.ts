import type { InteractiveGuideContent } from "@/types/activity";
import { haveToDontHaveToCantImages as img } from "@/data/have-to-dont-have-to-cant-images.generated";
import { stepsCard } from "@/content/grammar/_shared/guide-visuals";

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
      <div style="padding: 0.55rem 0.9rem; font-size: 0.82rem; background: rgba(0,0,0,0.03); display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap">
        <span><span class="gc-text-${accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Scene</span> &nbsp;${caption}</span>
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

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Lisa at the hotline answers calls like Rosa's every winter.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "My heat stopped working on Monday. It's freezing in my apartment. What can I do?", side: "right", tone: "terracotta" },
          { speaker: "Lisa", avatar: "👩🏾", text: "In most apartments, the landlord <strong>has to</strong> provide heat. It's in the state sanitary code.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And if he doesn't fix it?", side: "right", tone: "terracotta" },
          { speaker: "Lisa", avatar: "👩🏾", text: "He <strong>has to</strong> fix it. You <strong>don't have to</strong> wait. You can call the health inspector. Check mass.gov for the rules.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Have to / Has to</strong> = something is required. Someone is obligated to do it. It is not a choice.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("landlord's duty", "sage")}
            <span><em>The landlord <strong>has to</strong> provide heat.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("landlord's duty", "sage")}
            <span><em>He <strong>has to</strong> fix the heater.</em></span>
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
              label: "The heater in Rosa's building is broken. Which sentence is correct?",
              options: [
                { value: "a", label: "The landlord have to fix it." },
                { value: "b", label: "The landlord has to fix it." },
                { value: "c", label: "The landlord has to fixes it." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "All the tenants in Rosa's building ___ pay rent on the first. (have to / has to)",
              options: [
                { value: "a", label: "has to" },
                { value: "b", label: "have to" },
                { value: "c", label: "having to" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"The landlord <strong>have to</strong> provide heat.\" Is this correct?",
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
              label: "Lisa ___ answer the phone all day. It's her job.",
              expectedAnswers: ["has to"],
            },
            {
              type: "text",
              label: "Tenants ___ report problems in writing. (Rosa's lease)",
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
              words: ["Rosa's", "landlord", "has", "to", "repair", "the", "heater"],
              correctAnswer: "Rosa's landlord has to repair the heater",
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
        <p style="margin: 0 0 1rem 0; line-height: 1.6">After the call, Rosa sits at her kitchen table with her lease. She checks what she has to do and what is her choice.</p>

        <div style="overflow-x: auto; margin: 0.5rem 0 1.25rem">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(128,128,128,0.12)">
                <th class="gc-table-divider" scope="col" style="padding: 0.6rem 0.5rem; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Rosa's lease</th>
                <th class="gc-table-divider" scope="col" style="padding: 0.6rem 0.5rem; text-align: left; border-bottom: 2px solid rgba(128,128,128,0.35)">Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                <td style="padding: 0.6rem 0.5rem; vertical-align: top">pay rent on the 1st</td>
                <td style="padding: 0.6rem 0.5rem"><strong>✅ has to</strong><br><span style="font-size: 0.85rem">required</span></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                <td style="padding: 0.6rem 0.5rem; vertical-align: top">tell the landlord about repairs in writing</td>
                <td style="padding: 0.6rem 0.5rem"><strong>✅ has to</strong><br><span style="font-size: 0.85rem">required</span></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                <td style="padding: 0.6rem 0.5rem; vertical-align: top">renew in February</td>
                <td style="padding: 0.6rem 0.5rem"><strong>🔓 doesn't have to</strong><br><span style="font-size: 0.85rem">her choice</span></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(128,128,128,0.2)">
                <td style="padding: 0.6rem 0.5rem; vertical-align: top">repaint when she leaves</td>
                <td style="padding: 0.6rem 0.5rem"><strong>🔓 doesn't have to</strong><br><span style="font-size: 0.85rem">her choice</span></td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.5rem; vertical-align: top">buy a parking sticker (she has no car)</td>
                <td style="padding: 0.6rem 0.5rem"><strong>🔓 doesn't have to</strong><br><span style="font-size: 0.85rem">not needed</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Don't have to / Doesn't have to</strong> = something is NOT required. You have a choice. It is allowed, but not obligatory.</p>
        </div>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 0.85rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.95rem"><strong>Important:</strong> <em>Don't have to</em> is NOT the same as <em>can't</em>. "You don't have to sign" = you can sign or not sign. "You can't sign" = it is not allowed.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not required", "sage")}
            <span><em>Rosa <strong>doesn't have to</strong> renew.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("not required", "sage")}
            <span><em>Her neighbors <strong>don't have to</strong> repaint either.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "dont-have-to-ex1",
          title: "Read Rosa's lease table",
          instructions: "Look at the table above. Then answer.",
          items: [
            {
              type: "radio",
              label: "Look at the table. Which sentence is true?",
              options: [
                { value: "a", label: "Rosa doesn't have to pay rent on the 1st." },
                { value: "b", label: "Rosa doesn't have to repaint when she leaves." },
                { value: "c", label: "Rosa has to renew in February." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Look at the table. How many things on Rosa's list does she have to do? (Write a number.)",
              expectedAnswers: ["2", "two"],
            },
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
              words: ["Rosa", "doesn't", "have", "to", "buy", "a", "parking", "pass"],
              correctAnswer: "Rosa doesn't have to buy a parking pass",
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
              label: "Rosa's cousin lives in the same building. He ___ renew his lease. It's his choice.",
              expectedAnswers: ["doesn't have to"],
            },
            {
              type: "text",
              label: "We ___ buy a parking sticker. We take the bus.",
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
        <p style="margin: 0 0 1rem 0; line-height: 1.6">Lisa at the hotline tells Rosa three things a landlord can't do. Rosa writes them in her notebook. These are her notes.</p>

        ${stepsCard({
          kicker: "Rosa's notebook",
          title: "What a landlord can't do",
          accent: "terracotta",
          steps: [
            "A landlord <strong>can't</strong> stop the heat or hot water on purpose when he has to provide it.",
            "He <strong>can't</strong> punish a tenant for reporting a problem in writing.",
            "He <strong>can't</strong> ask for a security deposit bigger than the first month's rent.",
          ],
          note: "Rules can change. Check mass.gov for the rules.",
        })}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 1.05rem"><strong>Can't</strong> = it is not allowed. It is against the rules or the law. It is prohibited.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>He <strong>can't</strong> stop the hot water on purpose.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.06); border-radius: 0.4rem">
            ${labelPill("not allowed", "terracotta")}
            <span><em>Landlords <strong>can't</strong> punish tenants for complaining in writing.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.85rem 1.1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> <strong>can't</strong> + base verb, with no <em>to</em>. He <strong>can't stop</strong> the heat. (not <em>can't to stop</em>)</p>
        </div>
      `,
      exercises: [
        {
          id: "cant-ex1",
          title: "Read Rosa's notebook",
          instructions: "Look at Rosa's notes above. Choose the right answer.",
          items: [
            {
              type: "radio",
              label: "Rosa asks about a deposit. What do her notes say?",
              options: [
                { value: "a", label: "He can't ask for more than the first month's rent." },
                { value: "b", label: "He has to ask for two months." },
                { value: "c", label: "He doesn't have to give it back." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Which sentence means it is against the rules?",
              options: [
                { value: "a", label: "You don't have to pay a pet fee." },
                { value: "b", label: "A landlord can't punish you for reporting a problem." },
                { value: "c", label: "You have to sign the lease." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"The landlord <strong>don't have to</strong> stop the hot water on purpose.\" Is this correct?",
              options: [
                { value: "correct", label: "Yes, correct." },
                { value: "incorrect", label: "No, should be 'can't'. Stopping it on purpose is not allowed." },
              ],
              expectedAnswer: "incorrect",
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
              label: "A landlord ___ punish you for complaining in writing.",
              expectedAnswers: ["can't"],
            },
            {
              type: "text",
              label: "He ___ turn off the hot water on purpose.",
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
          <p>Rosa got a tenant rights flyer at the health center. Her neighbor Diego is helping her read it on the front steps.</p>
        </div>

        ${dialogue([
          { speaker: "Diego", avatar: "👨🏾", text: "Look at this flyer. It says 'Your rights as a tenant.' Let's go through it.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "OK. It says owners <strong>have to</strong> heat rooms to 68 degrees or more from 7 a.m. to 11 p.m.", side: "right", tone: "terracotta" },
          { speaker: "Diego", avatar: "👨🏾", text: "He has no choice. And this one: 'Tenants <strong>don't have to</strong> wait. They can ask the board of health to inspect.'", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And this: 'Landlords <strong>can't</strong> punish you for reporting a problem in writing.' Good. Then I'm calling the inspector today.", side: "right", tone: "terracotta" },
          { speaker: "Diego", avatar: "👨🏾", text: "Good idea. Check mass.gov for the full rules too.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin: 1.25rem 0">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.95rem">Quick reference</p>
          <div style="display: grid; gap: 0.4rem; font-size: 0.95rem">
            <div><strong>Have to / Has to</strong> = required, obligated</div>
            <div><strong>Don't have to / Doesn't have to</strong> = not required, your choice</div>
            <div><strong>Can't</strong> = not allowed, against the rules</div>
          </div>
        </div>

        <p style="font-size: 0.85rem; opacity: 0.8; margin: 0.5rem 0 1.25rem 0">Rules are from Massachusetts law and the state sanitary code (105 CMR 410). They can change, so check mass.gov.</p>
      `,
      exercises: [
        {
          id: "together-ex1",
          title: "Read the flyer",
          instructions: "Each statement comes from the tenant rights flyer. Choose the best label.",
          items: [
            {
              type: "radio",
              label: "\"The owner is required to provide heat.\"",
              options: [
                { value: "a", label: "has to (required)" },
                { value: "b", label: "doesn't have to (your choice)" },
                { value: "c", label: "can't (prohibited)" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"A deposit bigger than the first month's rent is not allowed.\"",
              options: [
                { value: "a", label: "has to (required)" },
                { value: "b", label: "doesn't have to (your choice)" },
                { value: "c", label: "can't (prohibited)" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "\"Rosa is not required to renew in February.\"",
              options: [
                { value: "a", label: "has to" },
                { value: "b", label: "doesn't have to" },
                { value: "c", label: "can't" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Diego says: \"Check mass.gov for the full rules.\" What kind of sentence is this?",
              options: [
                { value: "a", label: "A rule from the law: Rosa has to check mass.gov." },
                { value: "b", label: "Good advice: it helps, but Rosa doesn't have to." },
                { value: "c", label: "A prohibition: Rosa can't check mass.gov." },
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
              words: ["A", "landlord", "can't", "punish", "you", "for", "a", "complaint"],
              correctAnswer: "A landlord can't punish you for a complaint",
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
              label: "A landlord ___ ask for a very large deposit. (not allowed)",
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
      question: "Fill in the blank: \"You ___ renew your lease. It is your choice.\" (Three words: not required.)",
      correctAnswer: "don't have to",
      explanation: "'Don't have to' means it is not required. 'Can't' would mean it is forbidden, which is different.",
      topic: "dont-have-to",
      skill: "usage",
      skillTag: "no-obligation-housing",
      difficulty: "medium",
    },
    {
      id: "have-to-dont-have-to-cant-qws1",
      type: "word-scramble" as const,
      question: "The sanitary code says who must provide heat. Put the words in order.",
      words: ["The", "owner", "has", "to", "provide", "heat"],
      correctAnswer: "The owner has to provide heat",
      hint: "has to = required",
      explanation: "'Has to' shows the owner is required to provide heat.",
      topic: "have-to",
      skill: "usage",
      skillTag: "obligation-tenant-rights",
      difficulty: "medium",
    },
    {
      id: "have-to-dont-have-to-cant-q8",
      question: "Which sentence is NOT correct?",
      options: [
        { value: "a", label: "The landlord has to provide heat." },
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
