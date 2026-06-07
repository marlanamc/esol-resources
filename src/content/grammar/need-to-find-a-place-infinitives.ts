import type { InteractiveGuideContent } from "@/types/activity";
import { needToFindAPlaceInfinitivesImages as img } from "@/data/need-to-find-a-place-infinitives-images.generated";

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

export const needToFindAPlaceInfinitivesContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. I Need to Move
    // =========================================================================
    {
      id: "need-to-move",
      stepNumber: 1,
      title: "I Need to Move",
      icon: "🏠",
      explanation: `
        ${sceneCard("sceneLeaseEnding", "East Boston apartment. Wednesday, 11 PM, after a double shift.", "terracotta")}

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏽", text: "My lease ends in six weeks. I <strong>need to find</strong> something fast.", side: "right", tone: "terracotta" },
          { speaker: "Cousin", avatar: "👨🏾", text: "I know. You <strong>need to call</strong> those listings tonight before they\'re gone.", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏽", text: "And I <strong>need to get</strong> the deposit together. I don't have it yet.", side: "right", tone: "terracotta" },
          { speaker: "Cousin", avatar: "👨🏾", text: "You\'ll <strong>need to talk</strong> to your manager about the extra shifts.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>need to</strong> + base verb = something you have to do. It is necessary.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("necessary", "sage")}
            <span><em>I <strong>need to find</strong> a new apartment.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("necessary", "sage")}
            <span><em>She <strong>needs to call</strong> the landlord tomorrow.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("necessary", "sage")}
            <span><em>We <strong>need to move</strong> before the end of January.</em></span>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.03); border-radius: 0.5rem; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 0.95rem">
          <strong>The pattern:</strong><br/>
          <span style="font-family: monospace; font-size: 1rem">subject + <strong>need/needs to</strong> + base verb</span><br/>
          <span style="font-size: 0.88rem; opacity: 0.75">Base verb = no -s, no -ing, no -ed. Just the simple form.</span>
        </div>
      `,
      exercises: [
        {
          id: "inf-s1-ex1",
          title: "Correct or not?",
          instructions: "Choose the correct answer.",
          items: [
            {
              type: "radio",
              label: "Rosa <strong>need to find</strong> an apartment before February. Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'needs to find' (she = needs)" },
              ],
              expectedAnswer: "incorrect",
            },
            {
              type: "radio",
              label: "Which sentence uses <em>need to</em> correctly?",
              options: [
                { value: "a", label: "She needs finding a new place." },
                { value: "b", label: "She needs to find a new place." },
                { value: "c", label: "She need find a new place." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "inf-s1-ex2",
          title: "Fill in the blank",
          instructions: "Type the two words.",
          items: [
            {
              type: "text",
              label: "My brother ___ the landlord today. (need to + call)",
              expectedAnswers: ["needs to call"],
            },
          ],
        },
        {
          id: "inf-s1-ex3",
          title: "Unscramble",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "need", "to", "get", "the", "deposit", "together", "this", "week"],
              correctAnswer: "I need to get the deposit together this week",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. I Want to Stay Near the Bus
    // =========================================================================
    {
      id: "want-to-stay",
      stepNumber: 2,
      title: "I Want to Stay Near the Bus",
      icon: "🚌",
      explanation: `
        ${sceneCard("sceneApartmentSearch", "Break room at the warehouse. Thursday lunch.", "blue")}

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "I <strong>want to stay</strong> on the Blue Line. Two buses to work is too much.", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "I get it. Do you <strong>want to see</strong> that listing on Bremen Street? My cousin said it's good.", side: "left", tone: "blue" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Yeah, but I <strong>want to keep</strong> it under fourteen hundred. Does she know the price?", side: "right", tone: "terracotta" },
          { speaker: "Jennifer", avatar: "👩🏻", text: "I'll ask her. You definitely <strong>don't want to miss</strong> this one.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>want to</strong> + base verb = a desire or preference. Something you would like to do.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("desire", "blue")}
            <span><em>I <strong>want to stay</strong> near the bus stop.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("desire", "blue")}
            <span><em>He <strong>wants to find</strong> a two-bedroom apartment.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("negative", "terracotta")}
            <span><em>I <strong>don't want to pay</strong> more than $1,400.</em></span>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.03); border-radius: 0.5rem; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 0.95rem">
          <strong>want to</strong> vs. <strong>want + noun:</strong><br/>
          <span style="display: block; margin-top: 0.4rem">I <strong>want an apartment</strong>. (noun only)</span>
          <span style="display: block">I <strong>want to find</strong> an apartment. (want to + verb)</span>
        </div>
      `,
      exercises: [
        {
          id: "inf-s2-ex1",
          title: "Choose the correct form",
          instructions: "Pick the right answer.",
          items: [
            {
              type: "radio",
              label: "Carlos ___ near the Blue Line. Choose the correct form.",
              options: [
                { value: "a", label: "want stay" },
                { value: "b", label: "wants to stay" },
                { value: "c", label: "wants staying" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"I want finding a place near the bus.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'want to find'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "inf-s2-ex2",
          title: "Fill in the blank",
          instructions: "Type the two words.",
          items: [
            {
              type: "text",
              label: "I ___ before February. (want to + move)",
              expectedAnswers: ["want to move"],
            },
          ],
        },
        {
          id: "inf-s2-ex3",
          title: "Unscramble",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "wants", "to", "keep", "the", "rent", "under", "fourteen", "hundred"],
              correctAnswer: "She wants to keep the rent under fourteen hundred",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. I Hope to Find Something Before Rent Goes Up
    // =========================================================================
    {
      id: "hope-plan-to",
      stepNumber: 3,
      title: "I Hope to Find Something Before Rent Goes Up",
      icon: "📋",
      explanation: `
        ${sceneCard("scenePhoneCall", "Amara's kitchen. Saturday morning, scrolling listings.", "sage")}

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "I <strong>hope to find</strong> something before February. If we wait, the prices go up.", side: "right", tone: "terracotta" },
          { speaker: "Nadine", avatar: "👩🏾", text: "I <strong>plan to call</strong> that place on Maverick Street today. Three bedrooms, laundry inside.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Good. I <strong>plan to ask</strong> about the heat. Last place, we paid for everything.", side: "right", tone: "terracotta" },
          { speaker: "Nadine", avatar: "👩🏾", text: "Me too. I <strong>hope to hear</strong> back from them by tonight.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>hope to</strong> = you want it, but you are not sure it will happen.<br/><strong>plan to</strong> = you have decided to do it. It is your intention.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("hope", "amber")}
            <span><em>I <strong>hope to find</strong> a place before rent goes up.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("hope", "amber")}
            <span><em>She <strong>hopes to hear</strong> back today.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("plan", "sage")}
            <span><em>I <strong>plan to call</strong> the landlord this afternoon.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("plan", "sage")}
            <span><em>They <strong>plan to move</strong> in January.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "inf-s3-ex1",
          title: "Hope to or plan to?",
          instructions: "Choose the word that fits the meaning.",
          items: [
            {
              type: "radio",
              label: "Amara is not 100% sure she will find an apartment this week. Which sentence fits?",
              options: [
                { value: "a", label: "She plans to find one this week." },
                { value: "b", label: "She hopes to find one this week." },
                { value: "c", label: "She needs to find one this week." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Nadine has already decided to call the landlord at 5 PM. Which sentence fits?",
              options: [
                { value: "a", label: "She hopes to call at 5 PM." },
                { value: "b", label: "She plans to call at 5 PM." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "inf-s3-ex2",
          title: "Fill in the blank",
          instructions: "Type the two words.",
          items: [
            {
              type: "text",
              label: "I ___ something with laundry in the building. (hope to + find)",
              expectedAnswers: ["hope to find"],
            },
          ],
        },
        {
          id: "inf-s3-ex3",
          title: "Unscramble",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["They", "plan", "to", "move", "before", "the", "end", "of", "January"],
              correctAnswer: "They plan to move before the end of January",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. I Would Like to See the Apartment
    // =========================================================================
    {
      id: "would-like-to",
      stepNumber: 4,
      title: "I Would Like to See the Apartment",
      icon: "📞",
      explanation: `
        ${sceneCard("sceneEastBostonStreet", "East Boston neighborhood. Diego calls a listing after work.", "blue")}

        ${dialogue([
          { speaker: "Brian (landlord)", avatar: "🧑‍💼", text: "Hello, this is Brian. Can I help you?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "👨🏽", text: "Hi. I <strong>would like to see</strong> the apartment on Bremen Street. Is it still available?", side: "right", tone: "terracotta" },
          { speaker: "Brian (landlord)", avatar: "🧑‍💼", text: "Yes, it is. When would you like to come?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "👨🏽", text: "I <strong>would like to come</strong> on Saturday morning, if that works.", side: "right", tone: "terracotta" },
          { speaker: "Brian (landlord)", avatar: "🧑‍💼", text: "Saturday at 10 is fine. See you then.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>would like to</strong> = a polite way to say what you want. Use it with landlords, managers, clinics, and offices.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("polite", "blue")}
            <span><em>I <strong>would like to see</strong> the apartment.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("polite", "blue")}
            <span><em>I <strong>would like to ask</strong> about the heat and hot water.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.07); border-radius: 0.4rem">
            ${labelPill("everyday", "terracotta")}
            <span><em>I <strong>want to see</strong> the apartment.</em> (casual, still fine)</span>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.03); border-radius: 0.5rem; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 0.95rem">
          <strong>Short form:</strong> <em>I'd like to</em> = I would like to. Both are correct.<br/>
          <span style="font-size: 0.88rem; opacity: 0.75">On the phone or in a letter, <em>I'd like to</em> sounds natural and professional.</span>
        </div>
      `,
      exercises: [
        {
          id: "inf-s4-ex1",
          title: "Polite or everyday?",
          instructions: "Choose the best answer.",
          items: [
            {
              type: "radio",
              label: "Diego is calling a landlord for the first time. Which sounds more appropriate?",
              options: [
                { value: "a", label: "\"I want to see the apartment.\"" },
                { value: "b", label: "\"I would like to see the apartment.\"" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"She would like asking about the deposit.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be 'would like to ask'" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "inf-s4-ex2",
          title: "Fill in the blank",
          instructions: "Type the four words.",
          items: [
            {
              type: "text",
              label: "___ on Saturday at 10. (I would like to + come)",
              expectedAnswers: ["I would like to come"],
            },
          ],
        },
        {
          id: "inf-s4-ex3",
          title: "Unscramble",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "would", "like", "to", "ask", "about", "the", "heat", "and", "hot", "water"],
              correctAnswer: "I would like to ask about the heat and hot water",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 5. Mini Review + Building the Sentence
    // =========================================================================
    {
      id: "all-together",
      stepNumber: 5,
      title: "Mini Review + Building the Sentence",
      icon: "✅",
      explanation: `
        <p>It is Tuesday evening. Lucia just got home from her housecleaning job. The kids are home from school this week. Her lease ends in three weeks. She opens her notes app and writes everything down.</p>

        <div style="background: rgba(106,141,115,0.08); border-radius: 0.75rem; padding: 1.1rem 1.25rem; margin: 1.25rem 0; border: 1px solid rgba(106,141,115,0.2)">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6a8d73">Lucia's list</p>
          <ul style="margin: 0; padding-left: 1.25rem; line-height: 2">
            <li>I <strong>need to call</strong> the listing on Breed Street before 5 PM.</li>
            <li>I <strong>want to find</strong> something with a second bedroom for the kids.</li>
            <li>I <strong>hope to move</strong> before the end of January.</li>
            <li>I <strong>plan to ask</strong> my supervisor for Saturday off so I can see apartments.</li>
            <li>I <strong>would like to pay</strong> less than $1,500 a month.</li>
          </ul>
        </div>

        <div style="background: rgba(0,0,0,0.03); border-radius: 0.5rem; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 0.95rem">
          <strong>All five verbs + to + base verb:</strong>
          <table style="width: 100%; border-collapse: collapse; margin-top: 0.6rem; font-size: 0.93rem">
            <thead>
              <tr style="background: rgba(0,0,0,0.05)">
                <th style="text-align: left; padding: 0.4rem 0.6rem; font-weight: 700">Verb</th>
                <th style="text-align: left; padding: 0.4rem 0.6rem; font-weight: 700">Meaning</th>
                <th style="text-align: left; padding: 0.4rem 0.6rem; font-weight: 700">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 0.4rem 0.6rem"><strong>need to</strong></td><td style="padding: 0.4rem 0.6rem">necessary</td><td style="padding: 0.4rem 0.6rem"><em>I need to call now.</em></td></tr>
              <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.4rem 0.6rem"><strong>want to</strong></td><td style="padding: 0.4rem 0.6rem">desire</td><td style="padding: 0.4rem 0.6rem"><em>I want to find a bigger place.</em></td></tr>
              <tr><td style="padding: 0.4rem 0.6rem"><strong>hope to</strong></td><td style="padding: 0.4rem 0.6rem">wish (unsure)</td><td style="padding: 0.4rem 0.6rem"><em>I hope to move before February.</em></td></tr>
              <tr style="background: rgba(0,0,0,0.02)"><td style="padding: 0.4rem 0.6rem"><strong>plan to</strong></td><td style="padding: 0.4rem 0.6rem">intention</td><td style="padding: 0.4rem 0.6rem"><em>I plan to ask for Saturday off.</em></td></tr>
              <tr><td style="padding: 0.4rem 0.6rem"><strong>would like to</strong></td><td style="padding: 0.4rem 0.6rem">polite want</td><td style="padding: 0.4rem 0.6rem"><em>I'd like to pay less than $1,500.</em></td></tr>
            </tbody>
          </table>
        </div>
      `,
      exercises: [
        {
          id: "inf-s5-ex1",
          title: "Unscramble",
          instructions: "Put the words in the correct order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["I", "plan", "to", "ask", "my", "supervisor", "for", "Saturday", "off"],
              correctAnswer: "I plan to ask my supervisor for Saturday off",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["She", "hopes", "to", "move", "before", "the", "end", "of", "January"],
              correctAnswer: "She hopes to move before the end of January",
            },
          ],
        },
        {
          id: "inf-s5-ex2",
          title: "Spot the error",
          instructions: "Find what is wrong.",
          items: [
            {
              type: "radio",
              label: "\"I would like find an apartment near the bus.\" What is wrong?",
              options: [
                { value: "a", label: "Nothing is wrong." },
                { value: "b", label: "Missing 'to'. Should be 'would like to find'" },
                { value: "c", label: "Should use 'want' instead of 'would like'" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Lucia is 100% sure she is calling the listing today. Which word fits best?",
              options: [
                { value: "a", label: "She hopes to call the listing today." },
                { value: "b", label: "She plans to call the listing today." },
                { value: "c", label: "She would like to call the listing today." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "inf-s5-ex3",
          title: "Complete the sentence",
          instructions: "Type the correct phrase from Lucia's list.",
          items: [
            {
              type: "text",
              label: "I ___ call the listing on Breed Street before 5 PM. (need to)",
              expectedAnswers: ["need to call"],
            },
            {
              type: "text",
              label: "I ___ find something with a second bedroom for the kids. (want to)",
              expectedAnswers: ["want to find"],
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. For more examples, exercises, and the full explanation of gerunds vs. infinitives, open the <a href=\"/grammar-reader/gerunds-infinitives\" style=\"font-weight:700;text-decoration:underline\">Gerunds + Infinitives Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "infinitives-q2",
      question: "Which sentence is correct?",
      options: [
        { value: "a", label: "I want finding an apartment near the bus." },
        { value: "b", label: "I want to finding an apartment near the bus." },
        { value: "c", label: "I want to find an apartment near the bus." },
      ],
      correctAnswer: "c",
      explanation: "After 'want', use 'to' + base verb. 'Finding' (-ing form) is not correct here.",
      topic: "infinitives",
      skill: "error-detection",
      skillTag: "verb-form-after-want",
      difficulty: "easy",
    },
    {
      id: "infinitives-q4",
      question: "Diego is calling a landlord for the first time. Which sounds most polite and appropriate?",
      options: [
        { value: "a", label: "I want to see the apartment." },
        { value: "b", label: "I would like to see the apartment." },
        { value: "c", label: "I need to see the apartment." },
      ],
      correctAnswer: "b",
      explanation: "'Would like to' is more polite than 'want to'. It works better for calls with landlords, managers, and offices.",
      topic: "infinitives",
      skill: "usage",
      skillTag: "would-like-polite-register",
      difficulty: "medium",
    },
    {
      id: "infinitives-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"She ___ to find one before February.\" (She is trying but not certain she will.)",
      correctAnswer: "hopes",
      explanation: "'Hope to' means you want something but are not sure it will happen. 'Plans to' would mean she has already decided.",
      topic: "infinitives",
      skill: "usage",
      skillTag: "hope-to-uncertainty",
      difficulty: "medium",
    },
    {
      id: "infinitives-q6",
      question: "\"She needs finding a bigger apartment.\" What is wrong?",
      options: [
        { value: "a", label: "Nothing is wrong." },
        { value: "b", label: "'finding' should be 'to find'. Use needs to + base verb." },
        { value: "c", label: "'bigger' should be 'more big'." },
      ],
      correctAnswer: "b",
      explanation: "After 'need/needs', use 'to' + base verb: 'needs to find', not 'needs finding'.",
      topic: "infinitives",
      skill: "error-detection",
      skillTag: "needs-to-base-verb",
      difficulty: "medium",
    },
    {
      id: "infinitives-qws1",
      type: "word-scramble" as const,
      question: "Carlos calls about an apartment on Bremen Street. Put the words in order.",
      words: ["I", "would", "like", "to", "see", "the", "apartment"],
      correctAnswer: "I would like to see the apartment",
      hint: "would like to + base verb",
      explanation: "'Would like to' + base verb is the polite form. Use it for calls with landlords and offices.",
      topic: "infinitives",
      skill: "usage",
      skillTag: "would-like-polite-register",
      difficulty: "medium",
    },
  ],
};
