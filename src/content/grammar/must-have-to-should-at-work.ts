import type { InteractiveGuideContent } from "@/types/activity";
import { mustHaveToShouldAtWorkImages as img } from "@/data/must-have-to-should-at-work-images.generated";

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

export const mustHaveToShouldAtWorkContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — Must / Must not (safety and legal rules)
    // =========================================================================
    {
      id: "must-safety-rules",
      title: "Must. No exceptions on this site",
      icon: "🦺",
      explanation: `
        ${sceneCard("sceneConstruction", "East Boston construction site, Monday morning. Diego's first day.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Kevin is the foreman. Before Diego picks up a single tool, Kevin goes through the safety rules.</p>

        ${dialogue([
          { speaker: "Kevin", avatar: "🧑‍💼", text: "Before we start, you <strong>must</strong> wear your hard hat and steel-toe boots on this site. Every day, no exceptions.", side: "left", tone: "terracotta" },
          { speaker: "Diego", avatar: "👨🏽", text: "What about when I'm just walking to the truck?", side: "right", tone: "sage" },
          { speaker: "Kevin", avatar: "🧑‍💼", text: "Same rule. OSHA says you <strong>must</strong> wear the gear any time you're on site. And you <strong>must not</strong> use your phone near heavy equipment.", side: "left", tone: "terracotta" },
          { speaker: "Diego", avatar: "👨🏽", text: "Got it. Hard hat, boots, no phone near the machines.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Must / Must not</strong> = a rule from the law, a safety regulation, or a company policy. No choice. Everyone follows it.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("required", "terracotta")}
            <span><em>You <strong>must</strong> wear a hard hat on this site.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("required", "terracotta")}
            <span><em>Workers <strong>must</strong> sign in before the shift starts.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("prohibited", "blue")}
            <span><em>You <strong>must not</strong> use your phone near heavy equipment.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("prohibited", "blue")}
            <span><em>Workers <strong>must not</strong> enter a closed area without a supervisor.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>Form:</strong> must + base verb (no -s, no -ing, no to)<br>
          <em>He must wear boots. She must not use her phone. They must sign in.</em></p>
        </div>
      `,
      exercises: [
        {
          id: "must-ex1",
          title: "Choose the right word",
          instructions: "Pick the modal that fits each situation.",
          items: [
            {
              type: "radio",
              label: "Diego's foreman says: \"You ___ wear your hard hat. It's an OSHA rule.\"",
              options: [
                { value: "should", label: "should" },
                { value: "must", label: "must" },
                { value: "have to", label: "have to" },
              ],
              expectedAnswer: "must",
            },
            {
              type: "radio",
              label: "\"Workers ___ enter a closed area without a supervisor.\" Which word makes this a prohibition?",
              options: [
                { value: "must not", label: "must not" },
                { value: "don't have to", label: "don't have to" },
                { value: "shouldn't", label: "shouldn't" },
              ],
              expectedAnswer: "must not",
            },
          ],
        },
        {
          id: "must-ex2",
          title: "Unscramble the safety rule",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Workers", "must", "wear", "steel-toe", "boots", "on", "this", "site"],
              correctAnswer: "Workers must wear steel-toe boots on this site",
            },
          ],
        },
        {
          id: "must-ex3",
          title: "Fill in the blank",
          instructions: "Write the two-word prohibition phrase.",
          items: [
            {
              type: "text",
              label: "Complete: \"You ___ use your phone near heavy equipment.\"",
              expectedAnswers: ["must not", "mustn't"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Have to / Has to (employer procedures)
    // =========================================================================
    {
      id: "have-to-work-rules",
      title: "Have to. Your employer's rules",
      icon: "🕐",
      explanation: `
        ${sceneCard("sceneKitchen", "Restaurant kitchen, Friday evening. Dinner rush starts in 30 minutes.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Marta has worked the line for three years. Amara started this week. Before service, Marta explains how the restaurant runs.</p>

        ${dialogue([
          { speaker: "Marta", avatar: "👩🏾", text: "You <strong>have to</strong> clock in before your shift, not after. The manager checks the system every day.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "What if I'm running late?", side: "right", tone: "terracotta" },
          { speaker: "Marta", avatar: "👩🏾", text: "You <strong>have to</strong> text him before you're late. And you <strong>have to</strong> wear your uniform. No apron, no line.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Got it. Clock in, text if I'm late, uniform always.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Have to / Has to</strong> = required by your employer's rules or procedures. Not optional, but less formal than a law.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("required", "sage")}
            <span><em>You <strong>have to</strong> clock in before your shift starts.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("required", "sage")}
            <span><em>She <strong>has to</strong> wear her uniform on the line.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("required", "sage")}
            <span><em>He <strong>has to</strong> text the manager before coming in late.</em></span>
          </div>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 0.95rem"><strong>I / You / We / They</strong> have to + base verb<br>
          <strong>He / She / It</strong> has to + base verb</p>
        </div>
      `,
      exercises: [
        {
          id: "have-to-ex1",
          title: "Choose the correct form",
          instructions: "Pick the right answer for each sentence.",
          items: [
            {
              type: "radio",
              label: "\"She ___ wear her uniform on the line.\" What is the correct form for she?",
              options: [
                { value: "have to", label: "have to" },
                { value: "has to", label: "has to" },
                { value: "must to", label: "must to" },
              ],
              expectedAnswer: "has to",
            },
            {
              type: "radio",
              label: "Amara is new. Which sentence is correct?",
              options: [
                { value: "a", label: "She has to clocks in before her shift." },
                { value: "b", label: "She has to clock in before her shift." },
                { value: "c", label: "She has clock in before her shift." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "have-to-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "have", "to", "text", "the", "manager", "if", "I'm", "running", "late"],
              correctAnswer: "I have to text the manager if I'm running late",
            },
          ],
        },
        {
          id: "have-to-ex3",
          title: "Fill in the blank",
          instructions: "Write the two words needed.",
          items: [
            {
              type: "text",
              label: "The manager checks every day. She ___ wear her uniform.",
              expectedAnswers: ["has to"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Should / Shouldn't (workplace advice)
    // =========================================================================
    {
      id: "should-work-advice",
      title: "Should. What good workers do",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneBreakRoom", "Hotel housekeeping, third-floor break room. Tuesday afternoon.", "amber")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Claudette has been at the hotel for four years. Linh started two weeks ago. Claudette pulls her aside during a break.</p>

        ${dialogue([
          { speaker: "Claudette", avatar: "👩🏾", text: "You <strong>should</strong> tell your supervisor before you leave the floor, even on your break. She notices when people just disappear.", side: "left", tone: "amber" },
          { speaker: "Linh", avatar: "👩🏻", text: "Is that the rule?", side: "right", tone: "sage" },
          { speaker: "Claudette", avatar: "👩🏾", text: "It's not written down, but you <strong>should</strong> do it. And you <strong>shouldn't</strong> swap rooms with someone else without asking her first. That's how you get a write-up.", side: "left", tone: "amber" },
          { speaker: "Linh", avatar: "👩🏻", text: "I didn't know that. Thanks for telling me.", side: "right", tone: "sage" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Should / Shouldn't</strong> = strong advice. It's not a written rule, but problems happen if you ignore it.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("advice", "amber")}
            <span><em>You <strong>should</strong> tell your supervisor before you leave the floor.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("advice", "amber")}
            <span><em>You <strong>should</strong> ask before swapping shifts with a coworker.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("avoid", "terracotta")}
            <span><em>You <strong>shouldn't</strong> leave a floor without checking in first.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("avoid", "terracotta")}
            <span><em>She <strong>shouldn't</strong> swap rooms without asking the supervisor.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "should-ex1",
          title: "Choose the right answer",
          instructions: "Pick the best option for each situation.",
          items: [
            {
              type: "radio",
              label: "Linh wants to leave her floor early. Which sentence gives the best advice?",
              options: [
                { value: "a", label: "She must tell her supervisor." },
                { value: "b", label: "She should tell her supervisor." },
                { value: "c", label: "She has to tells her supervisor." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"She <strong>shouldn't leaves</strong> the floor without checking in.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'shouldn't leave' (base verb, no -s)" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "should-ex2",
          title: "Unscramble the advice",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["You", "should", "ask", "before", "swapping", "shifts", "with", "a", "coworker"],
              correctAnswer: "You should ask before swapping shifts with a coworker",
            },
          ],
        },
        {
          id: "should-ex3",
          title: "Fill in the blank",
          instructions: "Write the one-word contraction for 'should not.'",
          items: [
            {
              type: "text",
              label: "Claudette's tip: \"You ___ swap rooms without asking.\"",
              expectedAnswers: ["shouldn't"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Contrast: must vs. have to vs. should
    // =========================================================================
    {
      id: "contrast-all-three",
      title: "Must, have to, or should?",
      icon: "⚖️",
      explanation: `
        ${sceneCard("sceneTextMessage", "Sunday night. Rosa gets a text from her manager, Jennifer, about Monday's shift.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Presidents Day is Monday. Some construction sites close, but the restaurant is open. Jennifer sends Rosa three messages.</p>

        ${dialogue([
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "Hey Rosa. A few things for tomorrow.", side: "left", tone: "terracotta" },
          { speaker: "Rosa", avatar: "👩🏽", text: "OK, what's up?", side: "right", tone: "sage" },
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "First, you <strong>must</strong> be here by 10. Health inspection is at 10:30. No exceptions.", side: "left", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "Second, you <strong>have to</strong> cover the lunch shift too. Marcus called out sick.", side: "left", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "🧑‍💼", text: "Third, you <strong>should</strong> bring your food handler card. New hire starts Monday and you can show her yours.", side: "left", tone: "terracotta" },
        ])}

        <p style="margin: 1rem 0; line-height: 1.6">Three messages. Three different words. Here's why:</p>

        <div style="display: grid; gap: 0.75rem; margin: 1rem 0">
          <div style="padding: 0.75rem 1rem; background: rgba(176,87,64,0.07); border-radius: 0.5rem; border-left: 3px solid rgba(176,87,64,0.4)">
            <div style="font-weight: 700; margin-bottom: 0.3rem">${labelPill("must", "terracotta")} Health inspection at 10:30</div>
            <p style="margin: 0; font-size: 0.95rem; line-height: 1.5">A city inspection. Official, non-negotiable, serious consequences. <strong>Must</strong> is correct.</p>
          </div>
          <div style="padding: 0.75rem 1rem; background: rgba(106,141,115,0.07); border-radius: 0.5rem; border-left: 3px solid rgba(106,141,115,0.4)">
            <div style="font-weight: 700; margin-bottom: 0.3rem">${labelPill("have to", "sage")} Cover the lunch shift</div>
            <p style="margin: 0; font-size: 0.95rem; line-height: 1.5">A scheduling decision from the manager. Required, but not a law. <strong>Have to</strong> fits.</p>
          </div>
          <div style="padding: 0.75rem 1rem; background: rgba(233,196,106,0.1); border-radius: 0.5rem; border-left: 3px solid rgba(233,196,106,0.5)">
            <div style="font-weight: 700; margin-bottom: 0.3rem">${labelPill("should", "amber")} Bring the food handler card</div>
            <p style="margin: 0; font-size: 0.95rem; line-height: 1.5">Jennifer's suggestion. Helpful, but nothing bad happens if Rosa forgets it. <strong>Should</strong> is right.</p>
          </div>
        </div>

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">
            <strong>Must</strong> = law, official rule, safety. No exceptions.<br>
            <strong>Have to</strong> = your employer's requirement for this job.<br>
            <strong>Should</strong> = strong advice. Good judgment. Not written down.
          </p>
        </div>

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Watch out:</strong> must not vs. don't have to<br>
          <em>You <strong>must not</strong> use your phone near equipment</em> = forbidden.<br>
          <em>You <strong>don't have to</strong> stay late</em> = not required, but you can.</p>
        </div>
      `,
      exercises: [
        {
          id: "contrast-ex1",
          title: "Choose the right modal",
          instructions: "Think about the situation before you choose.",
          items: [
            {
              type: "radio",
              label: "The city health inspector is coming. Jennifer says: \"You ___ be here by 10.\" Which word fits best?",
              options: [
                { value: "should", label: "should" },
                { value: "must", label: "must" },
                { value: "have to", label: "have to" },
              ],
              expectedAnswer: "must",
            },
            {
              type: "radio",
              label: "Marcus called out sick. Jennifer needs Rosa to cover. Which sentence is correct?",
              options: [
                { value: "a", label: "Rosa must cover the lunch shift because it's a safety rule." },
                { value: "b", label: "Rosa has to cover the lunch shift because the manager needs it." },
                { value: "c", label: "Rosa should cover the lunch shift if she feels like it." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The sign says: \"Workers ___ enter this area without a safety pass.\" Which word makes this a prohibition?",
              options: [
                { value: "must not", label: "must not" },
                { value: "don't have to", label: "don't have to" },
                { value: "shouldn't always", label: "shouldn't always" },
              ],
              expectedAnswer: "must not",
            },
          ],
        },
        {
          id: "contrast-ex2",
          title: "Fill in the blank",
          instructions: "Write the two words needed.",
          items: [
            {
              type: "text",
              label: "Jennifer's scheduling rule: Rosa ___ cover the lunch shift. (Employer requirement, two words.)",
              expectedAnswers: ["has to"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Putting it all together
    // =========================================================================
    {
      id: "putting-it-together",
      title: "Putting it all together",
      icon: "✅",
      explanation: `
        <p style="margin: 0 0 1rem 0; line-height: 1.6">You have seen all three modals at work. Here is a quick reference before the quiz.</p>

        <div style="overflow-x: auto; margin: 1rem 0">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(106,141,115,0.1)">
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.1)">Modal</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.1)">Meaning</th>
                <th style="padding: 0.6rem 0.75rem; text-align: left; border-bottom: 2px solid rgba(0,0,0,0.1)">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.06)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #b05740">must</td>
                <td style="padding: 0.6rem 0.75rem">Law or safety rule. No exceptions.</td>
                <td style="padding: 0.6rem 0.75rem"><em>You must wear a hard hat.</em></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.06)">
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #6a8d73">have to</td>
                <td style="padding: 0.6rem 0.75rem">Employer's requirement.</td>
                <td style="padding: 0.6rem 0.75rem"><em>She has to clock in on time.</em></td>
              </tr>
              <tr>
                <td style="padding: 0.6rem 0.75rem; font-weight: 700; color: #b08040">should</td>
                <td style="padding: 0.6rem 0.75rem">Strong advice. Good judgment.</td>
                <td style="padding: 0.6rem 0.75rem"><em>You should tell your supervisor.</em></td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      exercises: [
        {
          id: "summary-ex1",
          title: "Must not or don't have to?",
          instructions: "These two phrases mean very different things.",
          items: [
            {
              type: "radio",
              label: "\"You <strong>must not</strong> leave the site without signing out.\" What does this mean?",
              options: [
                { value: "a", label: "It is not required to sign out." },
                { value: "b", label: "It is forbidden to leave without signing out." },
                { value: "c", label: "Signing out is good advice." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Which sentence shows that something is NOT required but is allowed?",
              options: [
                { value: "a", label: "You must wear gloves in the kitchen." },
                { value: "b", label: "You don't have to work Sunday, but you can if you want." },
                { value: "c", label: "You must not leave before your shift ends." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "summary-ex2",
          title: "Unscramble",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "has", "to", "clock", "in", "before", "her", "shift", "starts"],
              correctAnswer: "She has to clock in before her shift starts",
            },
          ],
        },
        {
          id: "summary-ex3",
          title: "Fill in the blank",
          instructions: "Write the two words meaning 'not required.'",
          items: [
            {
              type: "text",
              label: "It's not required, but Rosa can pick up Sunday. She ___ work Sunday.",
              expectedAnswers: ["doesn't have to", "does not have to"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, more exercises, and the full explanation of obligation and permission modals, open the <a href=\"/grammar-reader/modals-obligation-permission\" style=\"font-weight:700;text-decoration:underline\">Modals: Obligation and Permission Full Guide</a>.",
      },
    },
  ],

    miniQuiz: [
    {
      id: "must-have-to-should-at-work-q3",
      question: "Claudette tells Linh: 'You ___ tell your supervisor before you leave the floor.' It's not a written rule, but it's important. Which word fits?",
      options: [
        { value: "a", label: "must" },
        { value: "b", label: "have to" },
        { value: "c", label: "should" },
      ],
      correctAnswer: "c",
      explanation: "When something is strong advice from experience but not a written rule, 'should' is the right modal.",
      topic: "should",
      skill: "usage",
      skillTag: "should-unwritten-advice",
      difficulty: "easy",
    },
    {
      id: "must-have-to-should-at-work-q5",
      question: "Which sentence has a grammar error?",
      options: [
        { value: "a", label: "He must wear a hard hat on the site." },
        { value: "b", label: "She has to clocks in before her shift." },
        { value: "c", label: "You should ask before swapping shifts." },
      ],
      correctAnswer: "b",
      explanation: "After 'has to,' use the base verb with no -s. The correct form is 'has to clock in,' not 'has to clocks in.'",
      topic: "have-to",
      skill: "error-detection",
      skillTag: "base-verb-after-modal",
      difficulty: "easy",
    },
    {
      id: "must-have-to-should-at-work-q6",
      question: "The sign on the door says: 'Workers ___ enter without a safety pass.' Which word makes this a prohibition?",
      options: [
        { value: "a", label: "must not" },
        { value: "b", label: "don't have to" },
        { value: "c", label: "should not always" },
      ],
      correctAnswer: "a",
      explanation: "'Must not' means it is completely forbidden. 'Don't have to' means it is not required but allowed. These two are opposites.",
      topic: "must-not",
      skill: "usage",
      skillTag: "must-not-vs-dont-have-to",
      difficulty: "medium",
    },
    {
      id: "must-have-to-should-at-work-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"She ___ tell her supervisor before she leaves.\" (Strong advice, not a written rule.)",
      correctAnswer: "should",
      explanation: "'Should' gives strong advice based on experience. Modals (must, should, can) are never followed by 'to'.",
      topic: "should",
      skill: "usage",
      skillTag: "should-unwritten-advice",
      difficulty: "easy",
    },
    {
      id: "must-have-to-should-at-work-qws1",
      type: "word-scramble" as const,
      question: "The safety sign at the warehouse is non-negotiable. Put the words in order.",
      words: ["You", "must", "wear", "a", "hard", "hat"],
      correctAnswer: "You must wear a hard hat",
      hint: "must + base verb (no 'to')",
      explanation: "'Must' signals a non-negotiable requirement. It is followed directly by the base verb with no 'to'.",
      topic: "must",
      skill: "usage",
      skillTag: "must-safety-rule",
      difficulty: "medium",
    },
  ],
};
