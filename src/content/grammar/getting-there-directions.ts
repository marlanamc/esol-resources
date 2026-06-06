import type { InteractiveGuideContent } from "@/types/activity";
import { gettingThereDirectionsImages as img } from "@/data/getting-there-directions-images.generated";

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

export const gettingThereDirectionsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1 — Where Are You Going?
    // =========================================================================
    {
      id: "where-are-you-going",
      stepNumber: 1,
      title: "Where Are You Going?",
      icon: "🗺️",
      explanation: `
        ${sceneCard("sceneMaverick", "Maverick Blue Line Station, East Boston. Tuesday, 7 PM.", "terracotta")}

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "Jean, I just got off the train at Maverick. How do I get to the community center?", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏾", text: "<strong>Walk</strong> straight on Maverick Square. <strong>Turn</strong> left on Meridian Street.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Then what?", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏾", text: "<strong>Cross</strong> the street at the light. <strong>Go</strong> two more blocks. You will see it on the right.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Imperatives</strong> = commands and instructions. Use the base form of the verb. There is no subject — you are talking directly to the person.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Turn</strong> left on Meridian Street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Walk</strong> straight past the park.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Cross</strong> the street at the light.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Take</strong> the first right after the bus stop.</em></span>
          </div>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 0.75rem 1rem; border-radius: 0.5rem; margin: 1rem 0">
          <p style="margin: 0; font-size: 0.95rem"><strong>No subject needed.</strong> You do not say "You turn left." Just say "<strong>Turn</strong> left." The verb is first.</p>
        </div>
      `,
      exercises: [
        {
          id: "gtd-s1-1",
          title: "Spot the imperative",
          instructions: "Choose the correct direction sentence.",
          items: [
            {
              type: "radio",
              label: "Amara needs directions. Which sentence is correct?",
              options: [
                { value: "a", label: "You turn left on Meridian Street." },
                { value: "b", label: "Turn left on Meridian Street." },
                { value: "c", label: "Turning left on Meridian Street." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Jean says: \"___ straight past the park.\" Which word fits?",
              options: [
                { value: "a", label: "Goes" },
                { value: "b", label: "Going" },
                { value: "c", label: "Go" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "gtd-s1-2",
          title: "Build the direction",
          instructions: "Put Jean's words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble Jean's direction:",
              words: ["Cross", "the", "street", "at", "the", "light"],
              correctAnswer: "Cross the street at the light",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — How to Say "Don't"
    // =========================================================================
    {
      id: "how-to-say-dont",
      stepNumber: 2,
      title: "How to Say \"Don't\"",
      icon: "🚫",
      explanation: `
        ${sceneCard("sceneBulletinBoard", "East Boston Community Center, bulletin board near the entrance.", "amber")}

        <p style="margin: 0 0 0.75rem 0">A volunteer posted directions and warnings on the board. Read what she wrote.</p>

        <div style="background: rgba(255,255,255,0.9); border: 2px solid rgba(233,196,106,0.4); border-radius: 0.75rem; padding: 1.25rem; margin: 1rem 0; font-family: inherit">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em">Notice from Claudette, Volunteer Coordinator</p>
          <ul style="margin: 0.5rem 0; padding-left: 1.25rem; line-height: 1.9">
            <li><strong>Walk</strong> to the end of the hallway and <strong>turn</strong> right for Room 4.</li>
            <li><strong>Don't turn</strong> right at the front door — that leads to the storage room.</li>
            <li><strong>Don't use</strong> the side entrance after 8 PM. It locks automatically.</li>
            <li><strong>Please ask</strong> at the front desk if you need help.</li>
            <li><strong>Please sign in</strong> before class. Thank you!</li>
          </ul>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Negative imperative:</strong> <strong>Don't</strong> + base verb. Use it to tell someone NOT to do something.<br><strong>Polite imperative:</strong> <strong>Please</strong> + base verb. Same structure, softer tone.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("affirmative", "terracotta")}
            <span><em><strong>Turn</strong> right for Room 4.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("negative", "amber")}
            <span><em><strong>Don't turn</strong> right at the front door.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("polite", "sage")}
            <span><em><strong>Please sign in</strong> before class.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "gtd-s2-1",
          title: "Don't or please?",
          instructions: "Choose the sentence Claudette would write on the bulletin board.",
          items: [
            {
              type: "radio",
              label: "Claudette wants to warn students NOT to do something. Which sentence does she write?",
              options: [
                { value: "a", label: "Use the side entrance after 8 PM." },
                { value: "b", label: "Don't use the side entrance after 8 PM." },
                { value: "c", label: "Not use the side entrance after 8 PM." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Claudette wants to give a polite instruction to sign in. Which is best?",
              options: [
                { value: "a", label: "You should sign in before class." },
                { value: "b", label: "Don't sign in before class." },
                { value: "c", label: "Please sign in before class." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "gtd-s2-2",
          title: "Check the sign",
          instructions: "Is this bulletin-board sentence correct?",
          items: [
            {
              type: "radio",
              label: "\"Please asks at the front desk if you need help.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be \"Please ask\" (base verb, no -s)" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Where Is It?
    // =========================================================================
    {
      id: "where-is-it",
      stepNumber: 3,
      title: "Where Is It?",
      icon: "📍",
      explanation: `
        ${sceneCard("sceneSidewalk", "Meridian Street, East Boston. A sunny afternoon.", "sage")}

        ${dialogue([
          { speaker: "Carlos", avatar: "👨🏽", text: "Excuse me, I'm looking for the health clinic on Meridian Street. Do you know where it is?", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "Yes! It's <strong>next to</strong> the pharmacy, <strong>across from</strong> the laundromat.", side: "left", tone: "sage" },
          { speaker: "Carlos", avatar: "👨🏽", text: "Is it the big building?", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "Right. It's <strong>between</strong> the pharmacy and the bakery, <strong>on the corner of</strong> Meridian and Maverick.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Prepositions of location</strong> tell you WHERE something is in relation to something else.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("next to", "sage")}
            <span><em>The clinic is <strong>next to</strong> the pharmacy.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("across from", "sage")}
            <span><em>It is <strong>across from</strong> the laundromat.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("between", "sage")}
            <span><em>It is <strong>between</strong> the pharmacy and the bakery.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("on the corner of", "blue")}
            <span><em>It is <strong>on the corner of</strong> Meridian and Maverick.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("in front of", "blue")}
            <span><em>There is a bench <strong>in front of</strong> the clinic.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("at the end of", "amber")}
            <span><em>The library is <strong>at the end of</strong> the block.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "gtd-s3-1",
          title: "Choose the preposition",
          instructions: "Read Linh's landmarks. Which sentence fits?",
          items: [
            {
              type: "radio",
              label: "Carlos is standing on one side of the street. The clinic is on the other side. Where is the clinic?",
              options: [
                { value: "a", label: "next to the street" },
                { value: "b", label: "across from where he is standing" },
                { value: "c", label: "at the end of the street" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "The pharmacy is on the left. The bakery is on the right. The clinic is in the middle. Where is the clinic?",
              options: [
                { value: "a", label: "The clinic is next to the bakery." },
                { value: "b", label: "The clinic is in front of the pharmacy." },
                { value: "c", label: "The clinic is between the pharmacy and the bakery." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "gtd-s3-2",
          title: "Fill in the landmark",
          instructions: "Type the preposition phrase Linh would use.",
          items: [
            {
              type: "text",
              label: "The library is _____ the corner of Meridian and Bennington.",
              expectedAnswers: ["on the corner of"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Step by Step
    // =========================================================================
    {
      id: "step-by-step",
      stepNumber: 4,
      title: "Step by Step",
      icon: "👣",
      explanation: `
        ${sceneCard("sceneBusStop", "Bennington Street bus stop, East Boston. Saturday morning.", "blue")}

        <p style="margin: 0 0 0.75rem 0">Elena is writing directions for her cousin Miguel. He just got off the bus on Bennington Street and needs to walk to the public library.</p>

        <div style="background: rgba(255,255,255,0.9); border: 2px solid rgba(106,141,115,0.3); border-radius: 0.75rem; padding: 1.25rem; margin: 1rem 0">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em">Elena's directions for Miguel</p>
          <ol style="margin: 0.5rem 0; padding-left: 1.25rem; line-height: 2">
            <li><strong>First,</strong> <strong>walk</strong> straight on Bennington Street for two blocks.</li>
            <li><strong>Then,</strong> <strong>turn</strong> left on Bremen Street.</li>
            <li><strong>Next,</strong> <strong>go</strong> past the park. The library is <strong>on the right, next to</strong> the community garden.</li>
            <li><strong>Finally,</strong> <strong>cross</strong> at the crosswalk and <strong>walk</strong> <strong>in front of</strong> the big blue doors.</li>
          </ol>
        </div>

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem">Use <strong>First, Then, Next, Finally</strong> to put directions in order. Each step starts with an imperative + preposition to say what to do AND where.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("step 1", "blue")}
            <span><em><strong>First,</strong> walk straight for two blocks.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("step 2", "blue")}
            <span><em><strong>Then,</strong> turn left on Bremen Street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("step 3", "blue")}
            <span><em><strong>Next,</strong> go past the park.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("step 4", "blue")}
            <span><em><strong>Finally,</strong> cross at the crosswalk.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "gtd-s4-1",
          title: "Elena's directions",
          instructions: "Put Miguel's route in order and choose the right words.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble Elena's first direction:",
              words: ["First,", "walk", "straight", "on", "Bennington", "Street", "for", "two", "blocks"],
              correctAnswer: "First, walk straight on Bennington Street for two blocks",
            },
            {
              type: "radio",
              label: "Miguel finds the library. It is \"___ the right, next to the community garden.\" Which word fits?",
              options: [
                { value: "a", label: "on" },
                { value: "b", label: "in" },
                { value: "c", label: "at" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Elena uses four steps. She writes: First... Then... ___... Finally. Which word goes in the blank?",
              options: [
                { value: "a", label: "After" },
                { value: "b", label: "Next" },
                { value: "c", label: "Soon" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
      ],
      tipBox: {
        title: "Want to go deeper?",
        content: "This was the quick version. If you want more examples, more exercises, and the full explanation, open the <a href=\"/grammar-reader/imperatives-declaratives\" style=\"font-weight:700;text-decoration:underline\">Imperatives Full Guide</a>.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "getting-there-directions-q1",
      question: "Jean tells Amara how to get to the community center. Which sentence is a correct imperative?",
      options: [
        { value: "a", label: "You should turn left on Meridian Street." },
        { value: "b", label: "Turn left on Meridian Street." },
        { value: "c", label: "Turning left on Meridian Street." },
      ],
      correctAnswer: "b",
      explanation: "Imperatives use the base verb with no subject. 'Turn' is correct.",
      topic: "imperatives",
      skill: "usage",
      skillTag: "affirmative-imperative-form",
      difficulty: "easy",
    },
    {
      id: "getting-there-directions-q2",
      question: "Claudette posts a warning on the bulletin board. Which sentence tells students NOT to do something?",
      options: [
        { value: "a", label: "Use the side entrance." },
        { value: "b", label: "Don't use the side entrance after 8 PM." },
        { value: "c", label: "Please use the side entrance." },
      ],
      correctAnswer: "b",
      explanation: "Negative imperatives use 'Don't' + base verb to tell someone not to do something.",
      topic: "imperatives",
      skill: "usage",
      skillTag: "negative-imperative-form",
      difficulty: "easy",
    },
    {
      id: "getting-there-directions-q3",
      question: "You want to give a direction politely. Which is best?",
      options: [
        { value: "a", label: "Please walk to the end of the hallway." },
        { value: "b", label: "Don't walk to the end of the hallway." },
        { value: "c", label: "Walking to the end of the hallway." },
      ],
      correctAnswer: "a",
      explanation: "'Please' + base verb makes an imperative polite without changing the structure.",
      topic: "imperatives",
      skill: "usage",
      skillTag: "polite-imperative",
      difficulty: "easy",
    },
    {
      id: "getting-there-directions-q4",
      question: "The pharmacy is on the left, the bakery is on the right, and the clinic is in the middle. Which sentence is correct?",
      options: [
        { value: "a", label: "The clinic is next to the street." },
        { value: "b", label: "The clinic is between the pharmacy and the bakery." },
        { value: "c", label: "The clinic is across from the bakery." },
      ],
      correctAnswer: "b",
      explanation: "'Between' describes a location in the middle of two other things.",
      topic: "prepositions-location",
      skill: "usage",
      skillTag: "between",
      difficulty: "easy",
    },
    {
      id: "getting-there-directions-q5",
      question: "Miguel is standing on Bennington Street. The library is on the other side of the street. Where is the library?",
      options: [
        { value: "a", label: "The library is next to Miguel." },
        { value: "b", label: "The library is behind Miguel." },
        { value: "c", label: "The library is across from Miguel." },
      ],
      correctAnswer: "c",
      explanation: "'Across from' means on the other side, facing you.",
      topic: "prepositions-location",
      skill: "usage",
      skillTag: "across-from",
      difficulty: "easy",
    },
    {
      id: "getting-there-directions-q6",
      question: "Elena writes directions for her cousin. Which is the correct order?",
      options: [
        { value: "a", label: "Finally, walk straight. First, turn left. Then, cross the street." },
        { value: "b", label: "First, walk straight. Then, turn left. Finally, cross the street." },
        { value: "c", label: "Then, walk straight. Finally, turn left. First, cross the street." },
      ],
      correctAnswer: "b",
      explanation: "First, Then, Finally put directions in the correct sequence from start to finish.",
      topic: "directions-sequence",
      skill: "usage",
      skillTag: "sequencing-first-then-finally",
      difficulty: "medium",
    },
    {
      id: "getting-there-directions-q7",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "Cross the street at the light." },
        { value: "b", label: "Don't turn right at the corner." },
        { value: "c", label: "Please turns left at the pharmacy." },
      ],
      correctAnswer: "c",
      explanation: "'Please turns left' is wrong. Imperatives always use the base verb: 'Please turn left.'",
      topic: "imperatives",
      skill: "error-detection",
      skillTag: "no-s-on-imperative",
      difficulty: "medium",
    },
    {
      id: "getting-there-directions-q8",
      question: "Linh says the clinic is \"___ the corner of Meridian and Maverick.\" Which word fits?",
      options: [
        { value: "a", label: "in" },
        { value: "b", label: "on" },
        { value: "c", label: "at" },
      ],
      correctAnswer: "b",
      explanation: "We say 'on the corner of' when describing a street corner location.",
      topic: "prepositions-location",
      skill: "usage",
      skillTag: "on-the-corner-of",
      difficulty: "medium",
    },
    {
      id: "getting-there-directions-q9",
      question: "Which sentence has an error?",
      options: [
        { value: "a", label: "Walk straight for two blocks." },
        { value: "b", label: "Don't goes down that alley." },
        { value: "c", label: "Please ask at the front desk." },
      ],
      correctAnswer: "b",
      explanation: "'Don't goes' is wrong. After 'Don't', use the base verb: 'Don't go down that alley.'",
      topic: "imperatives",
      skill: "error-detection",
      skillTag: "dont-base-verb",
      difficulty: "medium",
    },
    {
      id: "getting-there-directions-q10",
      question: "Jean wants to give Amara one direction and one warning. Which pair is correct?",
      options: [
        { value: "a", label: "\"Go straight on Maverick Square. Don't turn right — that goes to the parking lot.\"" },
        { value: "b", label: "\"Going straight on Maverick Square. Not turn right — that goes to the parking lot.\"" },
        { value: "c", label: "\"You go straight on Maverick Square. You don't turn right — that goes to the parking lot.\"" },
      ],
      correctAnswer: "a",
      explanation: "Imperatives use the base verb ('Go') and negative imperatives use 'Don't' + base verb ('Don't turn'). No subject is needed.",
      topic: "imperatives",
      skill: "usage",
      skillTag: "affirmative-and-negative-combined",
      difficulty: "hard",
    },
  ],
};
