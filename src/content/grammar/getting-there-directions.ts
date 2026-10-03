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
  `<span class="gc-bg-${color}-alpha gc-text-${color}" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase">${text}</span>`;

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export const gettingThereDirectionsContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // =========================================================================
    // SECTION 1. Where Are You Going?
    // =========================================================================
    {
      id: "where-are-you-going",
      stepNumber: 1,
      title: "Where Are You Going?",
      icon: "🗺️",
      explanation: `
        ${sceneCard("sceneMaverick", "Maverick Blue Line Station, East Boston. Wednesday, 7:00 PM.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara cleans patient rooms at the hospital. She waited three weeks for this doctor's appointment at the clinic on Meridian Street. It's at 7:15. If she is more than 10 minutes late, she has to make a new appointment and wait three more weeks. She has never been to this clinic, so she calls her coworker Jean.</p>

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "Jean, I'm at Maverick. My appointment is at 7:15. I know Meridian, but where on Meridian is the clinic?", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏾", text: "<strong>Walk</strong> across Maverick Square. <strong>Turn</strong> left on Meridian Street.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Wait. I got a text. It says my package can't be delivered, and there's a link. I'm not expecting a package.", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏾", text: "That's a scam. <strong>Delete</strong> it. <strong>Use</strong> your map, not the link.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Deleted. OK, I'm on Meridian. Then what?", side: "right", tone: "terracotta" },
          { speaker: "Jean", avatar: "🧑🏾", text: "<strong>Cross</strong> at the light. <strong>Go</strong> two more blocks. It's on the right. Now <strong>hurry</strong>.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Imperatives</strong> = commands and instructions. Use the base form of the verb. There is no subject. You are talking directly to the person.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Turn</strong> left on Meridian Street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Walk</strong> across Maverick Square.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Cross</strong> the street at the light.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(176,87,64,0.05); border-radius: 0.4rem">
            ${labelPill("direction", "terracotta")}
            <span><em><strong>Delete</strong> the text. <strong>Use</strong> your map.</em></span>
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
              label: "Amara's map says the next turn is at the light. Which sentence is correct?",
              options: [
                { value: "a", label: "You turn right at the light." },
                { value: "b", label: "Turn right at the light." },
                { value: "c", label: "Turning right at the light." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Jean says: \"___ two more blocks.\" Which word fits?",
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
          instructions: "Jean tells Amara a different way for next time. Put Jean's words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble the direction:",
              words: ["Take", "the", "second", "right", "after", "the", "bank"],
              correctAnswer: "Take the second right after the bank",
            },
          ],
        },
        {
          id: "gtd-s1-3",
          title: "Write the direction",
          instructions: "Type the imperative verb Jean would use.",
          items: [
            {
              type: "text",
              label: "Jean says: \"___ left on Meridian Street.\"",
              expectedAnswers: ["Turn", "turn"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 2. How to Say "Don't"
    // =========================================================================
    {
      id: "how-to-say-dont",
      stepNumber: 2,
      title: "How to Say \"Don't\"",
      icon: "🚫",
      explanation: `
        ${sceneCard("sceneBulletinBoard", "Meridian Street, 7:07 PM. Handwritten notes on the board next to the clinic's front door.", "amber")}

        <p style="margin: 0 0 0.75rem 0">Amara gets to the clinic at 7:07. The front door is locked. Jean always comes in the daytime, so she didn't know. There are notes on a board next to the door.</p>

        <div style="background: rgba(255,255,255,0.9); border: 2px solid rgba(233,196,106,0.4); border-radius: 0.75rem; padding: 1.25rem; margin: 1rem 0; font-family: inherit">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em">Evening patients: from Marie, Office Manager</p>
          <ul style="margin: 0.5rem 0; padding-left: 1.25rem; line-height: 1.9">
            <li>The front door locks at 7 PM. <strong>Don't knock</strong>. Nobody can hear you.</li>
            <li><strong>Walk</strong> around the corner to Paris Street and <strong>use</strong> the side entrance.</li>
            <li><strong>Don't use</strong> the side entrance after 8 PM. It locks automatically.</li>
            <li><strong>Please ask</strong> Laura at the front desk if you need help.</li>
            <li><strong>Please sign in</strong> when you arrive. Thank you!</li>
          </ul>
        </div>

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Negative imperative:</strong> <strong>Don't</strong> + base verb. Use it to tell someone NOT to do something.<br><strong>Polite imperative:</strong> <strong>Please</strong> + base verb. Same structure, softer tone.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("affirmative", "terracotta")}
            <span><em><strong>Walk</strong> around the corner to Paris Street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("negative", "amber")}
            <span><em><strong>Don't knock</strong> on the front door.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(233,196,106,0.08); border-radius: 0.4rem">
            ${labelPill("polite", "sage")}
            <span><em><strong>Please sign in</strong> when you arrive.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "gtd-s2-1",
          title: "Don't or please?",
          instructions: "Choose the sentence Marie would write on the clinic's board.",
          items: [
            {
              type: "radio",
              label: "Marie wants to warn patients NOT to do something. Which sentence does she write?",
              options: [
                { value: "a", label: "Park in front of the gate." },
                { value: "b", label: "Don't park in front of the gate." },
                { value: "c", label: "Not park in front of the gate." },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "Marie wants to give a polite instruction about phones. Which is best?",
              options: [
                { value: "a", label: "You should turn off your phone in the waiting room." },
                { value: "b", label: "Don't turn off your phone in the waiting room." },
                { value: "c", label: "Please turn off your phone in the waiting room." },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "gtd-s2-2",
          title: "Check the sign",
          instructions: "Is this sentence from the clinic's board correct?",
          items: [
            {
              type: "radio",
              label: "\"Please asks Laura at the front desk if you need help.\" Is this correct?",
              options: [
                { value: "correct", label: "Correct" },
                { value: "incorrect", label: "Not correct. Should be \"Please ask\" (base verb, no -s)" },
              ],
              expectedAnswer: "incorrect",
            },
          ],
        },
        {
          id: "gtd-s2-3",
          title: "Write the warning",
          instructions: "Type the words Marie would write on the clinic's board.",
          items: [
            {
              type: "text",
              label: "___ use the side entrance after 8 PM.",
              expectedAnswers: ["Don't", "Don't use", "Do not", "Do not use"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 3. Where Is It?
    // =========================================================================
    {
      id: "where-is-it",
      stepNumber: 3,
      title: "Where Is It?",
      icon: "📍",
      explanation: `
        ${sceneCard("sceneSidewalk", "Paris Street, 7:09 PM. Amara stops Linh on the sidewalk outside the laundromat.", "sage")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">Amara walks around the corner to Paris Street. She sees shops, a laundromat and two doors, but no clinic sign. Six minutes left.</p>

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "Excuse me. I'm looking for the side entrance to the clinic. Do you know where it is?", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "Yes. It's <strong>next to</strong> the pharmacy, <strong>across from</strong> this laundromat.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "I see a green door and a blue door. Which one?", side: "right", tone: "terracotta" },
          { speaker: "Linh", avatar: "👩🏻", text: "The green one. It's <strong>between</strong> the pharmacy and the bakery. There's no sign. Everybody gets lost.", side: "left", tone: "sage" },
          { speaker: "Amara", avatar: "👩🏿", text: "Thank you so much. My appointment is in six minutes.", side: "right", tone: "terracotta" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem">
          <p style="margin: 0; font-size: 1.05rem"><strong>Prepositions of location</strong> tell you WHERE something is in relation to something else.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(106,141,115,0.06); border-radius: 0.4rem">
            ${labelPill("next to", "sage")}
            <span><em>The green door is <strong>next to</strong> the pharmacy.</em></span>
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
            <span><em>The bakery is <strong>on the corner of</strong> Paris and Meridian.</em></span>
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
              label: "Amara is standing in front of the laundromat. The clinic door is on the other side of the street. Where is the door?",
              options: [
                { value: "a", label: "next to the street" },
                { value: "b", label: "across from where she is standing" },
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
              label: "The clinic is _____ the laundromat. (opposite side of the street)",
              expectedAnswers: ["across from"],
            },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 4. Step by Step
    // =========================================================================
    {
      id: "step-by-step",
      stepNumber: 4,
      title: "Step by Step",
      icon: "👣",
      explanation: `
        ${sceneCard("sceneBusStop", "The bus stop on Meridian Street, near the clinic. Elena will get off the bus here next Wednesday.", "blue")}

        <p style="margin: 0 0 0.75rem 0">Amara opens the green door at 7:13 and signs in. Laura at the front desk looks at the clock. "Two minutes early," she says. After the appointment, Amara texts her neighbor Elena. Elena has an appointment at the same clinic next Wednesday at 7:30, and she comes by bus.</p>

        <div style="background: rgba(255,255,255,0.9); border: 2px solid rgba(106,141,115,0.3); border-radius: 0.75rem; padding: 1.25rem; margin: 1rem 0">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.05em">Amara's text to Elena</p>
          <ol style="margin: 0.5rem 0; padding-left: 1.25rem; line-height: 2">
            <li><strong>First,</strong> <strong>walk</strong> straight on Meridian Street for two blocks.</li>
            <li><strong>Then,</strong> <strong>turn</strong> left on Paris Street. The front door is locked after 7.</li>
            <li><strong>Next,</strong> <strong>go</strong> past the laundromat and <strong>cross</strong> at the crosswalk.</li>
            <li><strong>Finally,</strong> <strong>look</strong> for the green door. It's <strong>on the right, next to</strong> the pharmacy. There's no sign.</li>
          </ol>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem">P.S. If you get a text about a package, <strong>don't tap</strong> the link. It's a scam.</p>
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
            <span><em><strong>Then,</strong> turn left on Paris Street.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("step 3", "blue")}
            <span><em><strong>Next,</strong> go past the laundromat and cross.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.5rem 0.75rem; background: rgba(59,130,246,0.05); border-radius: 0.4rem">
            ${labelPill("step 4", "blue")}
            <span><em><strong>Finally,</strong> look for the green door.</em></span>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "gtd-s4-1",
          title: "Amara's text to Elena",
          instructions: "Put the directions in order and choose the right words.",
          items: [
            {
              type: "word-scramble",
              label: "Amara adds one more step for Elena, before step 1. Unscramble it:",
              words: ["Get", "off", "the", "bus", "at", "the", "stop", "near", "the", "clinic"],
              correctAnswer: "Get off the bus at the stop near the clinic",
            },
            {
              type: "radio",
              label: "Elena finds the green door. It is \"___ the right, next to the pharmacy.\" Which word fits?",
              options: [
                { value: "a", label: "on" },
                { value: "b", label: "in" },
                { value: "c", label: "at" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "Amara uses four steps. She writes: First... Then... ___... Finally. Which word goes in the blank?",
              options: [
                { value: "a", label: "After" },
                { value: "b", label: "Next" },
                { value: "c", label: "Soon" },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "gtd-s4-2",
          title: "Write the step",
          instructions: "Type the word Amara uses in her directions.",
          items: [
            {
              type: "text",
              label: "Amara's second step: Then, ___ left on Paris Street.",
              expectedAnswers: ["turn", "Turn"],
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
      question: "Jean tells Amara how to get to the clinic. Which sentence is a correct imperative?",
      options: [
        { value: "a", label: "You should turn left on Meridian Street and go two blocks." },
        { value: "b", label: "Turn left on Meridian Street and go two blocks." },
        { value: "c", label: "Turning left on Meridian Street and going two blocks." },
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
      question: "Marie posts a warning on the clinic's board. Which sentence tells patients NOT to do something?",
      options: [
        { value: "a", label: "Block the side door." },
        { value: "b", label: "Don't block the side door." },
        { value: "c", label: "Please block the side door." },
      ],
      correctAnswer: "b",
      explanation: "Negative imperatives use 'Don't' + base verb to tell someone not to do something.",
      topic: "imperatives",
      skill: "usage",
      skillTag: "negative-imperative-form",
      difficulty: "easy",
    },
    {
      id: "getting-there-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"The clinic is ___ the pharmacy and the bakery.\" (It's in the middle of the two.)",
      correctAnswer: "between",
      explanation: "'Between' describes a location in the middle of two other things.",
      topic: "prepositions-location",
      skill: "usage",
      skillTag: "between",
      difficulty: "medium",
    },
    {
      id: "getting-there-qws1",
      type: "word-scramble" as const,
      question: "Build the imperative direction by tapping the words in order.",
      words: ["Don't", "turn", "right", "at", "the", "corner"],
      correctAnswer: "Don't turn right at the corner",
      hint: "Don't + base verb",
      explanation: "Negative imperatives: Don't + base verb. No subject needed.",
      topic: "imperatives",
      skill: "usage",
      skillTag: "negative-imperative-form",
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
  ],
};
