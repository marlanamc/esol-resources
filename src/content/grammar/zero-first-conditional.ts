import type { InteractiveGuideContent } from "@/types/activity";
import { zeroFirstConditionalImages as img } from "@/data/zero-first-conditional-images.generated";

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

export const zeroFirstConditionalContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Zero Conditional: If It's Always True
    // =========================================================================
    {
      id: "zero-conditional",
      title: "Zero Conditional: If It's Always True",
      icon: "📋",
      tenseDiagram: {
        title: "Where the Zero Conditional lives on the timeline",
        elements: [
          { id: "zero-if", type: "multiple-dots", zone: "present", position: 35, verbLabel: "If + present" },
          { id: "zero-result", type: "multiple-dots", zone: "present", position: 65, verbLabel: "result (present)" },
        ],
      },
      explanation: `
        ${sceneCard("sceneRestaurantManager", "La Palma Restaurant, East Boston. Monday morning before the lunch rush.", "terracotta")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Rosa has just started her second week. The manager, Scott, is going over the rules for new staff.</em></p>

        ${dialogue([
          { speaker: "Scott", avatar: "🧑‍💼", text: "OK, listen up. <strong>If you clock in</strong> more than five minutes late, <strong>I write you up</strong>. No exceptions.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "What about traffic? The 111 bus is always late.", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "🧑‍💼", text: "I know. But that\'s how it works here. <strong>If the kitchen is short-staffed</strong>, <strong>everyone stays</strong> until close. That includes you.", side: "left", tone: "blue" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And <strong>if I need</strong> a day off?", side: "right", tone: "terracotta" },
          { speaker: "Scott", avatar: "🧑‍💼", text: "<strong>If you need</strong> a day off, <strong>you ask</strong> me two weeks early. Always.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Zero Conditional</strong> = a fact that is always true. A rule, a policy, a natural consequence. Both verbs are present simple.<br>
          <em>If + present simple, present simple.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> you clock in late, the manager <strong>writes</strong> you up.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> the kitchen is short, everyone <strong>stays</strong> late.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> water <strong>boils</strong>, it <strong>turns</strong> to steam.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("always true", "terracotta")}
            <span><em><strong>If</strong> I <strong>work</strong> Sundays, I <strong>get</strong> time-and-a-half.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>The comma rule:</strong> <em>If</em> + condition first, then result. You can also flip it: <em>You get time-and-a-half <strong>if</strong> you work Sundays.</em> (No comma when the result comes first.)</p>
        </div>
      `,
      exercises: [
        {
          id: "zero-1",
          title: "Is it a rule or a fact?",
          instructions: "Choose the correct answer based on the meaning.",
          items: [
            {
              type: "radio",
              label: "Scott says this is always true at the restaurant. Which sentence fits the Zero Conditional?",
              options: [
                { value: "a", label: "If you clock in late, I will write you up." },
                { value: "b", label: "If you clock in late, I write you up." },
                { value: "c", label: "If you clock in late, I wrote you up." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is the Zero Conditional?",
              options: [
                { value: "a", label: "If Rosa picks up the shift, she will earn more." },
                { value: "b", label: "If Rosa picked up the shift, she would earn more." },
                { value: "c", label: "If Rosa works Sundays, she gets time-and-a-half." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in the blank with the correct form: If the kitchen ___ (be) short-staffed, everyone stays late.",
              expectedAnswers: ["is"],
            },
          ],
        },
        {
          id: "zero-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct Zero Conditional sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "you", "need", "a", "day", "off", "you", "ask", "two", "weeks", "early"],
              correctAnswer: "If you need a day off you ask two weeks early",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. First Conditional: Real Future Plans
    // =========================================================================
    {
      id: "first-conditional",
      title: "First Conditional: Real Future Plans",
      icon: "📅",
      tenseDiagram: {
        title: "Where the First Conditional lives on the timeline",
        elements: [
          { id: "first-if", type: "multiple-dots", zone: "present", position: 35, verbLabel: "If + present" },
          { id: "first-will", type: "single-dot", zone: "future", position: 65, verbLabel: "will + base verb" },
        ],
      },
      explanation: `
        ${sceneCard("scenePaycheck", "Carlos's kitchen, East Boston. Thursday night after his shift.", "amber")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Carlos is on the phone with his wife, Ana. The electric bill is due Friday. He has a chance to pick up an extra shift Saturday morning.</em></p>

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "<strong>If I pick up</strong> the Saturday shift, <strong>I'll pay</strong> the electric bill on time.", side: "right", tone: "terracotta" },
          { speaker: "Ana", avatar: "👩🏾", text: "And if you don't? The cutoff is Friday at noon.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "<strong>If I don't work</strong> Saturday, <strong>we won't have</strong> enough. Not after rent.", side: "right", tone: "terracotta" },
          { speaker: "Ana", avatar: "👩🏾", text: "OK. <strong>If the manager calls</strong> tonight, <strong>tell him</strong> yes. We need the money.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>First Conditional</strong> = a real situation that might happen. The result is in the future.<br>
          <em>If + present simple, will + base verb.</em></p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> I <strong>pick up</strong> the shift, I <strong>will pay</strong> the bill on time.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> I <strong>don't work</strong> Saturday, we <strong>won't have</strong> enough.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> the manager <strong>calls</strong>, <strong>tell him</strong> yes.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.1); border-radius: 0.4rem">
            ${labelPill("real future", "amber")}
            <span><em><strong>If</strong> Rosa <strong>finishes</strong> early, she <strong>will take</strong> the bus home.</em></span>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Important:</strong> In the <em>if</em>-part, never use <em>will</em>.<br>
          Correct: <em>If I <strong>pick up</strong> the shift...</em><br>
          Wrong: <s>If I <strong>will pick up</strong> the shift...</s></p>
        </div>
      `,
      exercises: [
        {
          id: "first-1",
          title: "Real future or always true?",
          instructions: "Choose the correct sentence for each situation.",
          items: [
            {
              type: "radio",
              label: "Carlos is talking about his specific plan for this Saturday. Which fits the First Conditional?",
              options: [
                { value: "a", label: "If I pick up the Saturday shift, I pay the bill." },
                { value: "b", label: "If I pick up the Saturday shift, I will pay the bill." },
                { value: "c", label: "If I will pick up the Saturday shift, I will pay the bill." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "If the manager calls tonight, tell him yes." },
                { value: "b", label: "If we don't pay by Friday, the lights will go out." },
                { value: "c", label: "If he will call tonight, I will answer." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in the blank: If Carlos ___ (not work) Saturday, they won't have enough money.",
              expectedAnswers: ["doesn't work", "does not work"],
            },
          ],
        },
        {
          id: "first-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct First Conditional sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "I", "pick", "up", "the", "shift", "I", "will", "pay", "the", "electric", "bill"],
              correctAnswer: "If I pick up the shift I will pay the electric bill",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Unless, When, and As Soon As
    // =========================================================================
    {
      id: "unless-when-as-soon-as",
      title: "Unless, When, and As Soon As",
      icon: "📱",
      explanation: `
        ${sceneCard("scenePhoneTexting", "Break room, East Boston. The holiday schedule just went up on the wall.", "sage")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Claudette and her coworker Jennifer are texting about the Christmas Eve schedule. Jennifer put in for two days off for Hanukkah last week.</em></p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "👩🏻", text: "Did you see the schedule? They need someone for Christmas Eve. I can't do it. I <strong>won't be available unless</strong> my days off get changed back.", side: "left", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏿", text: "I saw. <strong>As soon as</strong> Miguel <strong>gets</strong> here, I'll ask him if he can cover.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "That would be great. <strong>When the bonus comes in</strong>, I'll treat you to lunch. I promise.", side: "left", tone: "blue" },
          { speaker: "Claudette", avatar: "👩🏿", text: "Ha. OK. But listen, I <strong>won't ask</strong> him <strong>unless</strong> you talk to Scott first. He needs to know.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Unless</strong> = if not. Same tense rules as the First Conditional.<br>
          <strong>When</strong> = at that moment in the future (more certain than <em>if</em>).<br>
          <strong>As soon as</strong> = immediately when something happens.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("unless = if not", "sage")}
            <span><em>I <strong>won't be available unless</strong> my days off <strong>get</strong> changed back.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("unless = if not", "sage")}
            <span><em>I <strong>won't ask</strong> him <strong>unless</strong> you <strong>talk</strong> to Scott first.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("when = certain future", "blue")}
            <span><em><strong>When</strong> the bonus <strong>comes in</strong>, I'll treat you to lunch.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("as soon as = immediately", "amber")}
            <span><em><strong>As soon as</strong> Miguel <strong>gets</strong> here, I'll ask him.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-top: 0.75rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Same rule:</strong> After <em>unless</em>, <em>when</em>, and <em>as soon as</em>, use present simple, not <em>will</em>.<br>
          Correct: <em>As soon as he <strong>gets</strong> here, I'll ask.</em><br>
          Wrong: <s>As soon as he <strong>will get</strong> here, I'll ask.</s></p>
        </div>
      `,
      exercises: [
        {
          id: "unless-1",
          title: "Unless, when, or as soon as?",
          instructions: "Choose the correct word or phrase for each sentence.",
          items: [
            {
              type: "radio",
              label: "Jennifer means: 'I will be available IF my days off are not changed.' Which word fits?",
              options: [
                { value: "a", label: "I'll be available when my days off get changed back." },
                { value: "b", label: "I'll be available unless my days off get changed back." },
                { value: "c", label: "I'll be available as soon as my days off get changed back." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "When the schedule posts, I'll text you." },
                { value: "b", label: "As soon as Miguel will get here, I'll ask him." },
                { value: "c", label: "I won't cover unless someone else steps up." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: ___ the bonus comes in, Jennifer will treat Claudette to lunch. (When / Unless / As soon as)",
              expectedAnswers: ["When", "As soon as"],
            },
          ],
        },
        {
          id: "unless-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "won't", "trade", "shifts", "unless", "the", "manager", "agrees"],
              correctAnswer: "I won't trade shifts unless the manager agrees",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Zero vs. First: Which One?
    // =========================================================================
    {
      id: "zero-vs-first",
      title: "Zero vs. First: Which One Fits?",
      icon: "🤔",
      explanation: `
        ${sceneCard("sceneChristmasEve", "La Palma Restaurant kitchen. December 23. Manager is posting Christmas Eve hours.", "terracotta")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Marco is talking to his supervisor about the Christmas Eve shift and whether to take it.</em></p>

        ${dialogue([
          { speaker: "Marco", avatar: "👨🏾", text: "So Christmas Eve pays double, right?", side: "right", tone: "terracotta" },
          { speaker: "Supervisor", avatar: "🧑‍💼", text: "Yes. <strong>If you work Christmas Eve, you earn double.</strong> That\'s the policy. It\'s been that way for years.", side: "left", tone: "blue" },
          { speaker: "Marco", avatar: "👨🏾", text: "OK. Then <strong>if I work Christmas Eve, I will pay the rent on Friday</strong> before I go to my sister's.", side: "right", tone: "terracotta" },
          { speaker: "Supervisor", avatar: "🧑‍💼", text: "Good. And just so you know, <strong>if someone calls in sick, the whole shift stays</strong>. That\'s policy too.", side: "left", tone: "blue" },
          { speaker: "Marco", avatar: "👨🏾", text: "I understand. <strong>If I don't hear from you by 6 PM, I will call to confirm</strong>.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 1.25rem 0 0.5rem; font-weight: 700; font-size: 1rem">Zero vs. First: side by side</p>

        <div style="overflow-x: auto; margin: 0.5rem 0 1.25rem">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(176,87,64,0.1)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Type</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Form</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Meaning</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(176,87,64,0.3)">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.07)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #b05740">Zero</td>
                <td style="padding: 0.6rem 0.75rem">If + present, present</td>
                <td style="padding: 0.6rem 0.75rem">always true, a rule</td>
                <td style="padding: 0.6rem 0.75rem"><em>If you work Christmas Eve, you <strong>earn</strong> double.</em></td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #e9c46a; text-shadow: 0 0 1px rgba(0,0,0,0.3)">First</td>
                <td style="padding: 0.6rem 0.75rem">If + present, will + base</td>
                <td style="padding: 0.6rem 0.75rem">real future plan</td>
                <td style="padding: 0.6rem 0.75rem"><em>If I work Christmas Eve, I <strong>will pay</strong> rent Friday.</em></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 0.75rem 1rem; border-radius: 0.5rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>The key question:</strong> Is this always true (Zero) or is this Marco's specific plan right now (First)?<br>
          <em>"You earn double on Christmas Eve"</em> = always true. Zero.<br>
          <em>"I will pay rent on Friday"</em> = Marco's plan for this week. First.</p>
        </div>
      `,
      exercises: [
        {
          id: "contrast-1",
          title: "Zero or First?",
          instructions: "Choose the correct type of conditional for each situation.",
          items: [
            {
              type: "radio",
              label: "The supervisor is explaining a company policy that has always been true. Which type is this?",
              options: [
                { value: "a", label: "First Conditional. It is a future plan." },
                { value: "b", label: "Zero Conditional. It is an always-true rule." },
                { value: "c", label: "Neither. It uses 'will' so it is different." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Marco says, 'If I don't hear from you by 6 PM, I will call to confirm.' Which type is this?",
              options: [
                { value: "a", label: "Zero Conditional. It is always true." },
                { value: "b", label: "First Conditional. It is Marco's real plan for tonight." },
                { value: "c", label: "First Conditional, but the form is wrong." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence is Zero Conditional?",
              options: [
                { value: "a", label: "If I work this Friday, I will have enough for rent." },
                { value: "b", label: "If the fire alarm rings, everyone leaves the building." },
                { value: "c", label: "If she picks up the shift, she will pay the bill." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "text",
              label: "Fill in: If you ___ (work) Christmas Eve, you earn double. (Zero Conditional)",
              expectedAnswers: ["work"],
            },
          ],
        },
        {
          id: "contrast-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["If", "the", "bus", "is", "late", "tomorrow", "I", "will", "text", "you"],
              correctAnswer: "If the bus is late tomorrow I will text you",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5. Putting It Together: Work, Money, Holidays
    // =========================================================================
    {
      id: "putting-it-together",
      title: "Putting It Together: Work, Money, Holidays",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneMixedPractice", "Linh's apartment, East Boston. One week before Christmas.", "amber")}

        <p style="margin: 0 0 0.75rem; font-size: 0.95rem; color: rgba(0,0,0,0.65)"><em>Linh is talking to her cousin Beatriz. She is trying to figure out the week before Christmas: overtime, childcare, and a bill that needs to be paid.</em></p>

        ${dialogue([
          { speaker: "Beatriz", avatar: "👩🏽", text: "So are you working Christmas week or not?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "<strong>If they offer overtime, I'll take it.</strong> The electric bill is due the 26th.", side: "right", tone: "terracotta" },
          { speaker: "Beatriz", avatar: "👩🏽", text: "And the kids? School is closed all week.", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "<strong>If my mother-in-law comes, I can work.</strong> She comes every year around this time. That's just what she does.", side: "right", tone: "terracotta" },
          { speaker: "Beatriz", avatar: "👩🏽", text: "And <strong>if she doesn't come</strong>?", side: "left", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏻", text: "<strong>If she doesn't come, I won't have anyone for the kids.</strong> So I won't be able to take the overtime.", side: "right", tone: "terracotta" },
        ])}

        <p style="margin: 1.25rem 0 0.5rem; font-weight: 700; font-size: 1rem">Which type is each sentence?</p>

        <div style="display: grid; gap: 0.5rem; margin: 0.5rem 0 1.25rem">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("first", "amber")}
            <span><em>"If they offer overtime, I'll take it."</em> Her plan for this week. Could change.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("zero", "terracotta")}
            <span><em>"She comes every year around this time. That's just what she does."</em> Always true, every year.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("first", "amber")}
            <span><em>"If she doesn't come, I won't have anyone for the kids."</em> Real possible outcome this week.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("as soon as", "sage")}
            <span><em>"As soon as you know, call me."</em> Same tense rule as First Conditional.</span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "mixed-1",
          title: "Zero, First, or Unless?",
          instructions: "Choose the best answer for each situation.",
          items: [
            {
              type: "radio",
              label: "Linh is talking about her real plan for this week. Which sentence fits?",
              options: [
                { value: "a", label: "If they post extra hours, I sign up." },
                { value: "b", label: "If they post extra hours, I'll sign up." },
                { value: "c", label: "If they will post extra hours, I'll sign up." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Linh says her mother-in-law comes every year. Which conditional fits this?",
              options: [
                { value: "a", label: "First Conditional. It is a future plan." },
                { value: "b", label: "Zero Conditional. It happens every year, always." },
                { value: "c", label: "It is not a conditional." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence has an error?",
              options: [
                { value: "a", label: "If she doesn't come, I won't be able to work." },
                { value: "b", label: "As soon as I know, I'll call you." },
                { value: "c", label: "If they will offer overtime, I'll take it." },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "Fill in the blank: If my mother-in-law ___ (come), I can work the overtime.",
              expectedAnswers: ["comes"],
            },
          ],
        },
        {
          id: "mixed-2",
          title: "Build the sentence",
          instructions: "Unscramble the words to make a correct sentence.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["As", "soon", "as", "you", "know", "call", "me", "and", "I", "will", "help"],
              correctAnswer: "As soon as you know call me and I will help",
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/conditionals-zero-first\" style=\"font-weight:700;text-decoration:underline\">Zero + First Conditionals Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "zero-first-conditional-q2",
      question: "Carlos is making a promise about the extra Saturday shift and the electric bill. Which if-part is correct?",
      options: [
        { value: "a", label: "If I will take the extra shift..." },
        { value: "b", label: "If I take the extra shift..." },
        { value: "c", label: "If I took the extra shift..." },
      ],
      correctAnswer: "b",
      explanation: "In First Conditional, the if-part uses present simple. Never use 'will' in the if-part.",
      topic: "first-conditional",
      skill: "usage",
      skillTag: "first-conditional-no-will-in-if",
      difficulty: "easy",
    },
    {
      id: "zero-first-conditional-q4",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "If the kitchen is short-staffed, everyone stays late." },
        { value: "b", label: "If Carlos will work Saturday, he will pay the bill." },
        { value: "c", label: "If I don't hear from you, I will call to confirm." },
      ],
      correctAnswer: "b",
      explanation: "'Will' cannot appear in the if-part of a conditional. It should be: 'If Carlos works Saturday...'",
      topic: "first-conditional",
      skill: "error-detection",
      skillTag: "no-will-in-if-clause",
      difficulty: "easy",
    },
    {
      id: "zero-first-conditional-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"If you work late, you ___ double pay.\" (Zero Conditional — always-true job rule.)",
      correctAnswer: "earn",
      explanation: "Zero Conditional uses If + present simple, present simple. The rule is always true at this job.",
      topic: "zero-conditional",
      skill: "usage",
      skillTag: "meaning-always-true",
      difficulty: "easy",
    },
    {
      id: "zero-first-conditional-qws1",
      type: "word-scramble" as const,
      question: "Jennifer plans her rent around her work schedule. Put the words in order.",
      words: ["I", "will", "pay", "rent", "if", "I", "work"],
      correctAnswer: "I will pay rent if I work",
      hint: "will + base verb in the result part; present simple in the if-part",
      explanation: "First Conditional: if + present simple, will + base verb. The if-part never uses 'will'.",
      topic: "first-conditional",
      skill: "usage",
      skillTag: "first-conditional-no-will-in-if",
      difficulty: "medium",
    },
    {
      id: "zero-first-conditional-q7",
      question: "The supervisor says: 'If you work Christmas Eve, you earn double.' Marco says: 'If I work Christmas Eve, I will pay rent Friday.' What is the difference?",
      options: [
        { value: "a", label: "Both are Zero Conditional. They are the same." },
        { value: "b", label: "The supervisor states a policy (Zero). Marco states his plan (First)." },
        { value: "c", label: "Marco's sentence is wrong. He should say 'I earn' not 'I will pay.'" },
      ],
      correctAnswer: "b",
      explanation: "Zero = an always-true rule (the policy). First = a real, specific future plan (Marco's decision about rent).",
      topic: "zero-vs-first",
      skill: "recognition",
      skillTag: "meaning-rule-vs-plan",
      difficulty: "medium",
    },
  ],
};
