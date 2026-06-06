import type { InteractiveGuideContent } from "@/types/activity";
import { questionsRealAnswersImages as img } from "@/data/questions-real-answers-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers (standard toolkit — copied from welcome-back-tenses-review.ts)
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

export const questionsRealAnswersContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // INTRO
    {
      id: "questions-open-doors",
      title: "Questions open doors",
      icon: "🗝️",
      explanation: `
        ${sceneCard("sceneFirstDay", "East Boston Adult Education Center. First night of class.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">The first week of class is full of questions. Questions help you learn names, find out where people are from, and start a real conversation.</p>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">Six question words. Each one asks for a different kind of information.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩", text: "<strong>Who</strong> is your teacher this semester?", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑", text: "Ms. Tran. <strong>What</strong> class are you in?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩", text: "Level 3. <strong>Where</strong> are you from originally?", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑", text: "Honduras. <strong>When</strong> did you start here?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩", text: "Last September. <strong>Why</strong> did you choose this program?", side: "right", tone: "terracotta" },
          { speaker: "Classmate", avatar: "🧑", text: "For work. <strong>How</strong> do you come to class?", side: "left", tone: "sage" },
        ])}

        <div style="display: grid; gap: 0.45rem; margin: 1.25rem 0">
          ${[
            ["WHO", "a person", "terracotta"],
            ["WHAT", "a thing or idea", "sage"],
            ["WHERE", "a place", "blue"],
            ["WHEN", "a time", "amber"],
            ["WHY", "a reason", "terracotta"],
            ["HOW", "a way, a method, or a detail", "sage"],
          ].map(([word, meaning, color]) => `
            <div style="display: flex; gap: 0.75rem; align-items: center; padding: 0.5rem 0.75rem; background: rgba(0,0,0,0.03); border-radius: 0.4rem; flex-wrap: wrap">
              ${labelPill(word as string, color as "terracotta" | "sage" | "blue" | "amber")}
              <span style="font-size: 0.95rem">asks about <strong>${meaning}</strong></span>
            </div>
          `).join("")}
        </div>
      `,
      exercises: [
        {
          id: "qra-intro-1",
          title: "Match the question word",
          instructions: "Read each question. Which word asks that kind of information?",
          items: [
            {
              type: "radio",
              label: "\"___ is your teacher?\" (You want to know the person's name.)",
              options: [
                { value: "who", label: "Who" },
                { value: "what", label: "What" },
                { value: "where", label: "Where" },
              ],
              expectedAnswer: "who",
            },
            {
              type: "radio",
              label: "\"___ does class start?\" (You want to know the time.)",
              options: [
                { value: "why", label: "Why" },
                { value: "when", label: "When" },
                { value: "how", label: "How" },
              ],
              expectedAnswer: "when",
            },
            {
              type: "radio",
              label: "\"___ is the classroom?\" (You want to know the place.)",
              options: [
                { value: "what", label: "What" },
                { value: "who", label: "Who" },
                { value: "where", label: "Where" },
              ],
              expectedAnswer: "where",
            },
            {
              type: "radio",
              label: "\"___ did you choose this class?\" (You want to know the reason.)",
              options: [
                { value: "why", label: "Why" },
                { value: "when", label: "When" },
                { value: "how", label: "How" },
              ],
              expectedAnswer: "why",
            },
          ],
        },
      ],
    },

    // SECTION 1 — Who, What, Where
    {
      id: "who-what-where",
      stepNumber: 1,
      title: "Who, What, Where: the basics",
      icon: "📍",
      explanation: `
        ${sceneCard("sceneApartmentHallway", "Maverick Street, East Boston. Saturday morning.", "sage")}

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "<strong>Who</strong> is your landlord? Mine never answers the phone.", side: "left", tone: "sage" },
          { speaker: "Neighbor", avatar: "🧑", text: "Mr. Costa. He lives on the second floor. <strong>What</strong> is your apartment number?", side: "right", tone: "blue" },
          { speaker: "Amara", avatar: "👩🏿", text: "3B. <strong>Where</strong> do you work?", side: "left", tone: "sage" },
          { speaker: "Neighbor", avatar: "🧑", text: "At the fish market on Meridian. <strong>What</strong> do you do?", side: "right", tone: "blue" },
          { speaker: "Amara", avatar: "👩🏿", text: "I work at the school cafeteria. <strong>Where</strong> are your kids in school?", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.05rem">Questions with <strong>Who, What, Where</strong> use two different helpers depending on the verb.</p>
          <ul style="margin: 0; padding-left: 1.25rem; line-height: 1.8">
            <li>With <strong>be</strong>: <em>Who <strong>is</strong> your teacher? Where <strong>are</strong> you from?</em></li>
            <li>With other verbs: <em>What <strong>do</strong> you do? Where <strong>does</strong> she work?</em></li>
          </ul>
        </div>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">The pattern:</p>

        <div style="display: grid; gap: 0.5rem; margin: 0 0 1.25rem 0">
          <div style="padding: 0.65rem 1rem; border-radius: 0.5rem; border-left: 3px solid #6a8d73; background: rgba(106,141,115,0.07)">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6a8d73; margin-bottom: 0.3rem">With BE</div>
            <p style="margin: 0"><em>Wh- word + <strong>am / is / are</strong> + subject</em></p>
            <p style="margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--color-text-muted)">Where <strong>is</strong> the classroom? &nbsp; Who <strong>are</strong> your classmates?</p>
          </div>
          <div style="padding: 0.65rem 1rem; border-radius: 0.5rem; border-left: 3px solid #268a82; background: rgba(38,138,130,0.07)">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #268a82; margin-bottom: 0.3rem">With DO / DOES</div>
            <p style="margin: 0"><em>Wh- word + <strong>do / does</strong> + subject + base verb</em></p>
            <p style="margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--color-text-muted)">What <strong>do</strong> you do? &nbsp; Where <strong>does</strong> she work?</p>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600; font-size: 0.95rem">Common mistake to avoid:</p>
          <p style="margin: 0 0 0.25rem 0">&#10007; <em>Where <strong>you</strong> work?</em> &nbsp; <span style="font-size: 0.88rem; color: var(--color-text-muted)">(missing do/does)</span></p>
          <p style="margin: 0">&#10003; <em>Where <strong>do you</strong> work?</em></p>
        </div>
      `,
      exercises: [
        {
          id: "qra-s1-1",
          title: "Fix the question",
          instructions: "One word is missing or wrong. Choose the correct question.",
          items: [
            {
              type: "radio",
              label: "\"Where you work?\" How do you fix this question?",
              options: [
                { value: "a", label: "Where you are working?" },
                { value: "b", label: "Where do you work?" },
                { value: "c", label: "Where works you?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"What is your landlord's name?\" Is this question correct?",
              options: [
                { value: "correct", label: "Yes, correct as written." },
                { value: "incorrect", label: "No. Should be: What does your landlord's name?" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"What do your sister?\" How do you fix this question?",
              options: [
                { value: "a", label: "What does your sister do?" },
                { value: "b", label: "What is your sister do?" },
                { value: "c", label: "What your sister does?" },
              ],
              expectedAnswer: "a",
            },
          ],
        },
        {
          id: "qra-s1-2",
          title: "Build the question",
          instructions: "Put the words in the right order.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Where", "does", "Amara", "work"],
              correctAnswer: "Where does Amara work",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["What", "is", "your", "apartment", "number"],
              correctAnswer: "What is your apartment number",
            },
          ],
        },
      ],
    },

    // SECTION 2 — When and How
    {
      id: "when-and-how",
      stepNumber: 2,
      title: "When and How: time and details",
      icon: "🕐",
      explanation: `
        ${sceneCard("sceneIntakeDesk", "Community Education Center. Student intake office.", "blue")}

        ${dialogue([
          { speaker: "Coordinator", avatar: "👩‍💼", text: "<strong>When</strong> did you arrive in the US?", side: "left", tone: "blue" },
          { speaker: "Jean", avatar: "🧑🏿", text: "About two years ago. In March 2022.", side: "right", tone: "amber" },
          { speaker: "Coordinator", avatar: "👩‍💼", text: "<strong>How</strong> do you get to class?", side: "left", tone: "blue" },
          { speaker: "Jean", avatar: "🧑🏿", text: "By bus, usually the 114. <strong>How long</strong> is the program?", side: "right", tone: "amber" },
          { speaker: "Coordinator", avatar: "👩‍💼", text: "One year. <strong>How often</strong> do classes meet?", side: "left", tone: "blue" },
          { speaker: "Jean", avatar: "🧑🏿", text: "Twice a week, right? Tuesdays and Thursdays?", side: "right", tone: "amber" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0 0 0.4rem 0; font-size: 1.05rem"><strong>When</strong> asks about <em>a time</em>. <strong>How</strong> asks about <em>a method or a detail</em>.</p>
          <p style="margin: 0; font-size: 0.95rem"><strong>How</strong> is powerful because it combines with other words to ask specific questions.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.25rem 0">
          ${[
            ["When", "a point in time", "When did you arrive? When does class start?", "amber"],
            ["How", "a method or way", "How do you get to class? (by bus, by foot)", "blue"],
            ["How long", "a duration", "How long is the program? (one year)", "blue"],
            ["How often", "a frequency", "How often do you study? (twice a week)", "blue"],
            ["How far", "a distance", "How far is the bus stop? (two blocks)", "blue"],
          ].map(([word, meaning, example, color]) => `
            <div style="padding: 0.6rem 0.85rem; border-radius: 0.45rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
              <div style="display: flex; gap: 0.6rem; align-items: baseline; flex-wrap: wrap; margin-bottom: 0.25rem">
                ${labelPill(word as string, color as "terracotta" | "sage" | "blue" | "amber")}
                <span style="font-size: 0.88rem; color: var(--color-text-muted)">${meaning}</span>
              </div>
              <p style="margin: 0; font-size: 0.93rem"><em>${example}</em></p>
            </div>
          `).join("")}
        </div>
      `,
      exercises: [
        {
          id: "qra-s2-1",
          title: "When or How?",
          instructions: "Read what the person wants to know. Choose the correct question word or phrase.",
          items: [
            {
              type: "radio",
              label: "You want to know if the class meets Monday or Tuesday. You ask: \"___ does class meet?\"",
              options: [
                { value: "when", label: "When" },
                { value: "how", label: "How" },
                { value: "how long", label: "How long" },
              ],
              expectedAnswer: "when",
            },
            {
              type: "radio",
              label: "You want to know if the program is 6 months or 12 months. You ask: \"___ is the program?\"",
              options: [
                { value: "when", label: "When" },
                { value: "how long", label: "How long" },
                { value: "how often", label: "How often" },
              ],
              expectedAnswer: "how long",
            },
            {
              type: "radio",
              label: "You want to know if your classmate studies every day or once a week. You ask: \"___ do you study?\"",
              options: [
                { value: "how far", label: "How far" },
                { value: "how often", label: "How often" },
                { value: "when", label: "When" },
              ],
              expectedAnswer: "how often",
            },
          ],
        },
        {
          id: "qra-s2-2",
          title: "Fill in the question word",
          instructions: "Write the correct question word. Use: When, How, How long, How often, How far.",
          items: [
            {
              type: "text",
              label: "\"___ did you start this program?\" (You want to know the month or year.)",
              expectedAnswers: ["When", "when"],
            },
            {
              type: "text",
              label: "\"___ do you come to class?\" (You want to know the method: bus, car, walking.)",
              expectedAnswers: ["How", "how"],
            },
          ],
        },
      ],
      tipBox: {
        title: "How + adjective = a specific question",
        content:
          "How long, how often, how far, how much, how many. Each one narrows the question. You will keep adding to this list all year.",
      },
    },

    // SECTION 3 — Why
    {
      id: "why-giving-reasons",
      stepNumber: 3,
      title: "Why: giving and asking for reasons",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneWhyClassroom", "ESL classroom, Level 3. Before class starts.", "amber")}

        ${dialogue([
          { speaker: "Linh", avatar: "👩", text: "<strong>Why</strong> did you sign up for this class?", side: "left", tone: "amber" },
          { speaker: "Classmate", avatar: "🧑", text: "<strong>Because</strong> I need better English for my job. My boss speaks only English. <strong>Why</strong> did you?", side: "right", tone: "sage" },
          { speaker: "Linh", avatar: "👩", text: "<strong>Because</strong> I want to help my kids with homework. And I want to understand the school letters.", side: "left", tone: "amber" },
          { speaker: "Classmate", avatar: "🧑", text: "Me too. <strong>Why</strong> is English spelling so hard?", side: "right", tone: "sage" },
          { speaker: "Linh", avatar: "👩", text: "That's the big question!", side: "left", tone: "amber" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0 0 0.4rem 0; font-size: 1.05rem"><strong>Why</strong> asks for a reason. The answer almost always starts with <strong>because</strong>.</p>
          <p style="margin: 0; font-weight: 600; font-size: 0.95rem">Why + do/does/did/is/are + subject + verb?</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.25rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("question", "amber")}
            <span><em>Why <strong>do</strong> you study English?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("answer", "sage")}
            <span><em><strong>Because</strong> I want a better job.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("question", "amber")}
            <span><em>Why <strong>did</strong> she choose this program?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("answer", "sage")}
            <span><em><strong>Because</strong> it is close to her house.</em></span>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <p style="margin: 0 0 0.4rem 0; font-weight: 600; font-size: 0.95rem">Short answer (informal):</p>
          <p style="margin: 0 0 0.2rem 0; font-size: 0.9rem; color: var(--color-text-muted)">You do not have to repeat the full question in your answer.</p>
          <p style="margin: 0.4rem 0 0; font-size: 0.95rem"><em>Why do you take the bus? &nbsp; Because it is cheaper than a car.</em></p>
        </div>
      `,
      exercises: [
        {
          id: "qra-s3-1",
          title: "Complete the answer",
          instructions: "Choose the best answer to each Why question.",
          items: [
            {
              type: "radio",
              label: "\"Why do you come to class at night?\" Which answer fits?",
              options: [
                { value: "a", label: "Because I work during the day." },
                { value: "b", label: "Because the night is dark." },
                { value: "c", label: "Because class is in English." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"Why did Linh sign up for Level 3?\" Which answer fits?",
              options: [
                { value: "a", label: "Because Level 3 is on Tuesday." },
                { value: "b", label: "Because she wants to help her kids with homework." },
                { value: "c", label: "Because the classroom is big." },
              ],
              expectedAnswer: "b",
            },
          ],
        },
        {
          id: "qra-s3-2",
          title: "Build the Why question",
          instructions: "Unscramble the words to make a correct Why question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Why", "do", "you", "study", "English"],
              correctAnswer: "Why do you study English",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Why", "did", "she", "choose", "this", "program"],
              correctAnswer: "Why did she choose this program",
            },
          ],
        },
      ],
    },

    // SECTION 4 — All six together
    {
      id: "all-six-together",
      stepNumber: 4,
      title: "All six in a real conversation",
      icon: "🤝",
      explanation: `
        ${sceneCard("sceneNeighborsMeet", "Meridian Street, East Boston. Sunday afternoon.", "terracotta")}

        ${dialogue([
          { speaker: "Diego", avatar: "🧑", text: "Hey, are you new to the building? <strong>What</strong> is your name?", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "Fernanda. And you?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "🧑", text: "Diego. <strong>Where</strong> are you from?", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "Brazil. Sao Paulo. <strong>Who</strong> is the super for this building?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "🧑", text: "Mr. Alves. He is on the first floor. <strong>When</strong> did you move in?", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "Last week. <strong>Why</strong> did you choose East Boston?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "🧑", text: "It is close to work. <strong>How</strong> do you get around? Do you have a car?", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "No car. I take the Blue Line. It is easy.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0; font-size: 1.05rem">All six question words work in the same basic pattern: <strong>Wh- word + helper verb (be/do/does/did) + subject + main verb.</strong> The helper verb changes. The order does not.</p>
        </div>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">Two mistakes to watch for:</p>

        <div style="display: grid; gap: 0.5rem; margin: 0 0 1.25rem 0">
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; background: rgba(220,50,50,0.07); border-left: 3px solid rgba(220,50,50,0.4)">
            <p style="margin: 0 0 0.2rem 0; font-weight: 600; font-size: 0.88rem">Missing helper verb</p>
            <p style="margin: 0 0 0.15rem 0">&#10007; <em>Where you live?</em></p>
            <p style="margin: 0">&#10003; <em>Where <strong>do</strong> you live?</em></p>
          </div>
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; background: rgba(220,50,50,0.07); border-left: 3px solid rgba(220,50,50,0.4)">
            <p style="margin: 0 0 0.2rem 0; font-weight: 600; font-size: 0.88rem">Wrong word order (subject before helper)</p>
            <p style="margin: 0 0 0.15rem 0">&#10007; <em>What you are doing?</em></p>
            <p style="margin: 0">&#10003; <em>What <strong>are you</strong> doing?</em></p>
          </div>
        </div>
      `,
      exercises: [
        {
          id: "qra-s4-1",
          title: "Spot the mistake",
          instructions: "Three people wrote questions. One of them made an error. Find it.",
          items: [
            {
              type: "radio",
              label: "Which question has a mistake?",
              options: [
                { value: "a", label: "Where does Fernanda live?" },
                { value: "b", label: "Why did Diego choose East Boston?" },
                { value: "c", label: "What you do for work?" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Which question has a mistake?",
              options: [
                { value: "a", label: "When did she move in?" },
                { value: "b", label: "Who is the super?" },
                { value: "c", label: "How she gets to work?" },
              ],
              expectedAnswer: "c",
            },
          ],
        },
        {
          id: "qra-s4-2",
          title: "Build the question",
          instructions: "Unscramble the words to make a correct question.",
          items: [
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["How", "do", "you", "get", "to", "work"],
              correctAnswer: "How do you get to work",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Why", "did", "Diego", "choose", "East", "Boston"],
              correctAnswer: "Why did Diego choose East Boston",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["When", "does", "the", "class", "start"],
              correctAnswer: "When does the class start",
            },
          ],
        },
      ],
      tipBox: {
        title: "One question leads to another",
        content:
          "Real conversations work because every answer can become a new question. Practice asking one follow-up question after every answer you hear.",
      },
    },
  ],

  miniQuiz: [
    {
      id: "qra-q1",
      question: "Your new classmate wants to know your name. Which question does she ask?",
      options: [
        { value: "a", label: "Where is your name?" },
        { value: "b", label: "What is your name?" },
        { value: "c", label: "How is your name?" },
      ],
      correctAnswer: "b",
      explanation: "What asks about a thing or idea. A name is a thing, so \"What is your name?\" is correct.",
      topic: "what",
      skill: "usage",
      skillTag: "meaning-what-thing",
      difficulty: "easy",
    },
    {
      id: "qra-q2",
      question: "You want to know the location of the ESL classroom. Which question do you ask?",
      options: [
        { value: "a", label: "Who is the classroom?" },
        { value: "b", label: "When is the classroom?" },
        { value: "c", label: "Where is the classroom?" },
      ],
      correctAnswer: "c",
      explanation: "Where asks about a place or location.",
      topic: "where",
      skill: "usage",
      skillTag: "meaning-where-place",
      difficulty: "easy",
    },
    {
      id: "qra-q3",
      question: "Amara wants to know if her neighbor works in the morning or at night. She asks:",
      options: [
        { value: "a", label: "When do you work?" },
        { value: "b", label: "How do you work?" },
        { value: "c", label: "Why do you work?" },
      ],
      correctAnswer: "a",
      explanation: "When asks about a time. Morning or night are times.",
      topic: "when",
      skill: "usage",
      skillTag: "meaning-when-time",
      difficulty: "easy",
    },
    {
      id: "qra-q4",
      question: "Jean wants to know if Fernanda takes the bus or the train to class. She asks:",
      options: [
        { value: "a", label: "Why do you get to class?" },
        { value: "b", label: "How do you get to class?" },
        { value: "c", label: "When do you get to class?" },
      ],
      correctAnswer: "b",
      explanation: "How asks about a method or way of doing something. Bus and train are methods of travel.",
      topic: "how",
      skill: "usage",
      skillTag: "meaning-how-method",
      difficulty: "easy",
    },
    {
      id: "qra-q5",
      question: "Diego asks his neighbor: \"___ did you move to East Boston?\" He wants to know the reason.",
      options: [
        { value: "a", label: "When" },
        { value: "b", label: "Where" },
        { value: "c", label: "Why" },
      ],
      correctAnswer: "c",
      explanation: "Why asks for a reason. The answer will start with because.",
      topic: "why",
      skill: "usage",
      skillTag: "meaning-why-reason",
      difficulty: "easy",
    },
    {
      id: "qra-q6",
      question: "Which question is correct?",
      options: [
        { value: "a", label: "Where you work?" },
        { value: "b", label: "Where do you work?" },
        { value: "c", label: "Where works you?" },
      ],
      correctAnswer: "b",
      explanation: "With most verbs, you need do or does between the Wh- word and the subject. \"Where do you work?\" is the correct form.",
      topic: "question-formation",
      skill: "error-detection",
      skillTag: "form-do-does-missing",
      difficulty: "medium",
    },
    {
      id: "qra-q7",
      question: "Linh wants to know if the English program is 6 months long or 12 months long. She asks:",
      options: [
        { value: "a", label: "How often is the program?" },
        { value: "b", label: "How long is the program?" },
        { value: "c", label: "How far is the program?" },
      ],
      correctAnswer: "b",
      explanation: "How long asks about duration. Months and years are durations.",
      topic: "how-long",
      skill: "usage",
      skillTag: "meaning-how-long-duration",
      difficulty: "medium",
    },
    {
      id: "qra-q8",
      question: "Which question has the wrong word order?",
      options: [
        { value: "a", label: "What does your sister do?" },
        { value: "b", label: "What your sister does?" },
        { value: "c", label: "What is your sister's job?" },
      ],
      correctAnswer: "b",
      explanation: "In English questions, the helper verb (does) comes before the subject (your sister), not after. The correct form is \"What does your sister do?\"",
      topic: "question-formation",
      skill: "error-detection",
      skillTag: "form-word-order",
      difficulty: "medium",
    },
    {
      id: "qra-q9",
      question: "Diego asks Fernanda: \"How often do you study?\" Which answer fits this question?",
      options: [
        { value: "a", label: "At the library." },
        { value: "b", label: "With my phone app." },
        { value: "c", label: "About three times a week." },
      ],
      correctAnswer: "c",
      explanation: "How often asks about frequency. \"Three times a week\" is a frequency answer. Place and method answer different questions.",
      topic: "how-often",
      skill: "usage",
      skillTag: "meaning-how-often-frequency",
      difficulty: "medium",
    },
    {
      id: "qra-q10",
      question: "You hear someone say: \"Why does she take the 114 instead of the Blue Line?\" Which is the most likely answer?",
      options: [
        { value: "a", label: "Because the 114 stops closer to her building." },
        { value: "b", label: "She takes it every morning." },
        { value: "c", label: "The 114 goes to Orient Heights." },
      ],
      correctAnswer: "a",
      explanation: "Why questions need a because answer giving the reason. Options b and c describe facts, not reasons.",
      topic: "why",
      skill: "recognition",
      skillTag: "meaning-why-because-answer",
      difficulty: "hard",
    },
  ],
};
