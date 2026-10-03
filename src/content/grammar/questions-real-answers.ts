import type { InteractiveGuideContent } from "@/types/activity";
import { questionsRealAnswersImages as img } from "@/data/questions-real-answers-images.generated";

// ---------------------------------------------------------------------------
// Visual helpers (standard toolkit. copied from welcome-back-tenses-review.ts)
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

export const questionsRealAnswersContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    // INTRO
    {
      id: "questions-open-doors",
      title: "Questions for smarter digital habits",
      icon: "🗝️",
      explanation: `
        ${sceneCard("sceneFirstDay", "East Boston. Rosa asks Sarah about an unexpected email.", "terracotta")}

        <p style="margin: 0 0 1rem 0; line-height: 1.6">This week, use questions to talk about digital habits: checking messages, finding files, protecting your information, and asking for help. Rosa has an email that does not seem right.</p>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">Six question words. Each one asks for a different kind of information.</p>

        ${dialogue([
          { speaker: "Rosa", avatar: "👩🏾", text: "<strong>What</strong> do you do when you get a strange email?", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "🧑🏽", text: "I don\'t click anything. <strong>Who</strong> is it from?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "It says it\'s from my bank. It wants me to click a link to keep my account open.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "🧑🏽", text: "That sounds suspicious. <strong>Where</strong> do you usually check your account?", side: "left", tone: "sage" },
          { speaker: "Rosa", avatar: "👩🏾", text: "In the bank\'s app. I\'ll open that instead.", side: "right", tone: "terracotta" },
          { speaker: "Sarah", avatar: "🧑🏽", text: "Good idea. If you\'re still worried, call the number on your bank card.", side: "left", tone: "sage" },
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
              label: "\"___ is the sender of this email?\" (You want to know the person's name.)",
              options: [
                { value: "who", label: "Who" },
                { value: "what", label: "What" },
                { value: "where", label: "Where" },
              ],
              expectedAnswer: "who",
            },
            {
              type: "radio",
              label: "\"___ does the video call start?\" (You want to know the time.)",
              options: [
                { value: "why", label: "Why" },
                { value: "when", label: "When" },
                { value: "how", label: "How" },
              ],
              expectedAnswer: "when",
            },
            {
              type: "radio",
              label: "\"___ is the Downloads folder?\" (You want to know the place.)",
              options: [
                { value: "what", label: "What" },
                { value: "who", label: "Who" },
                { value: "where", label: "Where" },
              ],
              expectedAnswer: "where",
            },
            {
              type: "radio",
              label: "\"___ did you delete that message?\" (You want to know the reason.)",
              options: [
                { value: "why", label: "Why" },
                { value: "when", label: "When" },
                { value: "how", label: "How" },
              ],
              expectedAnswer: "why",
            },
            {
              type: "text",
              label: "\"___ is the sender of this email?\" (You want to know the person's name.)",
              expectedAnswers: ["Who", "who"],
            },
          ],
        },
      ],
    },

    // SECTION 1. Who, What, Where
    {
      id: "who-what-where",
      stepNumber: 1,
      title: "Who, What, Where: the basics",
      icon: "📍",
      explanation: `
        ${sceneCard("sceneApartmentHallway", "At a computer. Amara and Sarah look for a downloaded job application.", "sage")}

        ${dialogue([
          { speaker: "Amara", avatar: "👩🏿", text: "I can\'t find the form I downloaded. <strong>Where</strong> is it?", side: "left", tone: "sage" },
          { speaker: "Sarah", avatar: "🧑🏽", text: "Let\'s look in your Downloads folder. <strong>What</strong> is the file called?", side: "right", tone: "blue" },
          { speaker: "Amara", avatar: "👩🏿", text: "Job application. There it is! <strong>Who</strong> is the contact person?", side: "left", tone: "sage" },
          { speaker: "Sarah", avatar: "🧑🏽", text: "James in the hiring office. His email address is on the job posting.", side: "right", tone: "blue" },
          { speaker: "Amara", avatar: "👩🏿", text: "Thanks. I\'ll check the address before I send it.", side: "left", tone: "sage" },
        ])}

        <div class="gc-bg-sage-alpha gc-callout-sage" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0 0 0.5rem 0; font-size: 1.05rem">Questions with <strong>Who, What, Where</strong> use two different helpers depending on the verb.</p>
          <ul style="margin: 0; padding-left: 1.25rem; line-height: 1.8">
            <li>With <strong>be</strong>: <em>Who <strong>is</strong> the sender? Where <strong>are</strong> my downloads?</em></li>
            <li>With other verbs: <em>What <strong>do</strong> you share online? Where <strong>does</strong> she save her files?</em></li>
          </ul>
        </div>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">The pattern:</p>

        <div style="display: grid; gap: 0.5rem; margin: 0 0 1.25rem 0">
          <div style="padding: 0.65rem 1rem; border-radius: 0.5rem; border-left: 3px solid #6a8d73; background: rgba(106,141,115,0.07)">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6a8d73; margin-bottom: 0.3rem">With BE</div>
            <p style="margin: 0"><em>Wh- word + <strong>am / is / are</strong> + subject</em></p>
            <p style="margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--color-text-muted)">Where <strong>is</strong> the file? &nbsp; Who <strong>is</strong> the sender?</p>
          </div>
          <div style="padding: 0.65rem 1rem; border-radius: 0.5rem; border-left: 3px solid #268a82; background: rgba(38,138,130,0.07)">
            <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #268a82; margin-bottom: 0.3rem">With DO / DOES</div>
            <p style="margin: 0"><em>Wh- word + <strong>do / does</strong> + subject + base verb</em></p>
            <p style="margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--color-text-muted)">What <strong>do</strong> you do? &nbsp; Where <strong>does</strong> she work?</p>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <p style="margin: 0 0 0.5rem 0; font-weight: 600; font-size: 0.95rem">Common mistake to avoid:</p>
          <p style="margin: 0 0 0.25rem 0">&#10007; <em>Where <strong>you</strong> save your files?</em> &nbsp; <span style="font-size: 0.88rem; color: var(--color-text-muted)">(missing do/does)</span></p>
          <p style="margin: 0">&#10003; <em>Where <strong>do you</strong> save your files?</em></p>
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
              label: "\"Where you shop online?\" How do you fix this question?",
              options: [
                { value: "a", label: "Where you are shopping online?" },
                { value: "b", label: "Where do you shop online?" },
                { value: "c", label: "Where shops you online?" },
              ],
              expectedAnswer: "b",
            },
            {
              type: "radio",
              label: "\"What is the file's name?\" Is this question correct?",
              options: [
                { value: "correct", label: "Yes, correct as written." },
                { value: "incorrect", label: "No. Should be: What does the file's name?" },
              ],
              expectedAnswer: "correct",
            },
            {
              type: "radio",
              label: "\"What do your sister share online?\" How do you fix this question?",
              options: [
                { value: "a", label: "What does your sister share online?" },
                { value: "b", label: "What is your sister share online?" },
                { value: "c", label: "What your sister shares online?" },
              ],
              expectedAnswer: "a",
            },
            {
              type: "text",
              label: "\"Where ___ you save your files?\" (Fill in the missing helper verb.)",
              expectedAnswers: ["do"],
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
              words: ["Where", "does", "Amara", "save", "her", "files"],
              correctAnswer: "Where does Amara save her files",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["What", "is", "the", "file", "name"],
              correctAnswer: "What is the file name",
            },
          ],
        },
      ],
    },

    // SECTION 2. When and How
    {
      id: "when-and-how",
      stepNumber: 2,
      title: "When and How: time and details",
      icon: "🕐",
      explanation: `
        ${sceneCard("sceneIntakeDesk", "A community center in East Boston. Jean asks for help saving his photos.", "blue")}

        ${dialogue([
          { speaker: "Tech helper", avatar: "👩‍💼", text: "<strong>When</strong> did you last save a copy of your photos on another device?", side: "left", tone: "blue" },
          { speaker: "Jean", avatar: "🧑🏿", text: "I haven\'t done that. <strong>How</strong> do I copy them to my laptop?", side: "right", tone: "amber" },
          { speaker: "Tech helper", avatar: "👩‍💼", text: "You can connect your phone with a USB cable. Do you have yours?", side: "left", tone: "blue" },
          { speaker: "Jean", avatar: "🧑🏿", text: "Yes, right here. <strong>How long</strong> does it take?", side: "right", tone: "amber" },
          { speaker: "Tech helper", avatar: "👩‍💼", text: "It depends on how many photos you have. Let\'s try a few first.", side: "left", tone: "blue" },
          { speaker: "Jean", avatar: "🧑🏿", text: "Thanks. I don\'t want to lose my family photos if my phone breaks.", side: "right", tone: "amber" },
        ])}

        <div class="gc-bg-blue-alpha gc-callout-blue" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0 0 0.4rem 0; font-size: 1.05rem"><strong>When</strong> asks about <em>a time</em>. <strong>How</strong> asks about <em>a method or a detail</em>.</p>
          <p style="margin: 0; font-size: 0.95rem"><strong>How</strong> is powerful because it combines with other words to ask specific questions.</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.25rem 0">
          ${[
            ["When", "a point in time", "When did the message arrive? When does the download finish?", "amber"],
            ["How", "a method or way", "How do you join the video call? (through the app)", "blue"],
            ["How long", "a duration", "How long does the download take? (two minutes)", "blue"],
            ["How often", "a frequency", "How often do you check your email? (twice a day)", "blue"],
            ["How far", "a distance", "How far is the computer from the Wi-Fi router? (ten feet)", "blue"],
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
              label: "You want to know if the online meeting is Monday or Tuesday. You ask: \"___ does the online meeting start?\"",
              options: [
                { value: "when", label: "When" },
                { value: "how", label: "How" },
                { value: "how long", label: "How long" },
              ],
              expectedAnswer: "when",
            },
            {
              type: "radio",
              label: "You want to know if the video is 6 minutes or 12 minutes. You ask: \"___ is the video?\"",
              options: [
                { value: "when", label: "When" },
                { value: "how long", label: "How long" },
                { value: "how often", label: "How often" },
              ],
              expectedAnswer: "how long",
            },
            {
              type: "radio",
              label: "You want to know if your classmate checks email every day or once a week. You ask: \"___ do you check your email?\"",
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
              label: "\"___ did you create this account?\" (You want to know the month or year.)",
              expectedAnswers: ["When", "when"],
            },
            {
              type: "text",
              label: "\"___ do you join the video call?\" (You want to know the method: through an app or a website.)",
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

    // SECTION 3. Why
    {
      id: "why-giving-reasons",
      stepNumber: 3,
      title: "Why: giving and asking for reasons",
      icon: "💬",
      explanation: `
        ${sceneCard("sceneWhyClassroom", "During a class break. Linh checks what an app can access on her phone.", "amber")}

        ${dialogue([
          { speaker: "Linh", avatar: "👩🏾", text: "<strong>Why</strong> does this flashlight app want my location?", side: "left", tone: "amber" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "That\'s strange. <strong>What</strong> happens if you say no?", side: "right", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏾", text: "It still works. I\'m turning off location access.", side: "left", tone: "amber" },
          { speaker: "Classmate", avatar: "🧑🏽", text: "<strong>Why</strong> don\'t you use the flashlight that came with your phone?", side: "right", tone: "sage" },
          { speaker: "Linh", avatar: "👩🏾", text: "<strong>Because</strong> I didn\'t know I had one! Can you show me?", side: "left", tone: "amber" },
        ])}

        <div class="gc-bg-amber-alpha gc-callout-amber" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0 0 0.4rem 0; font-size: 1.05rem"><strong>Why</strong> asks for a reason. The answer almost always starts with <strong>because</strong>.</p>
          <p style="margin: 0; font-weight: 600; font-size: 0.95rem">Why + do/does/did/is/are + subject + verb?</p>
        </div>

        <div style="display: grid; gap: 0.5rem; margin: 1rem 0 1.25rem 0">
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("question", "amber")}
            <span><em>Why <strong>do</strong> you keep your passwords private?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("answer", "sage")}
            <span><em><strong>Because</strong> I want to protect my accounts.</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("question", "amber")}
            <span><em>Why <strong>did</strong> she close the website?</em></span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: baseline; padding: 0.55rem 0.85rem; background: rgba(181,110,26,0.07); border-radius: 0.45rem; flex-wrap: wrap">
            ${labelPill("answer", "sage")}
            <span><em><strong>Because</strong> it asked for information she did not want to share.</em></span>
          </div>
        </div>

        <div style="padding: 1rem 1.25rem; border-radius: 0.5rem; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06)">
          <p style="margin: 0 0 0.4rem 0; font-weight: 600; font-size: 0.95rem">Short answer (informal):</p>
          <p style="margin: 0 0 0.2rem 0; font-size: 0.9rem; color: var(--color-text-muted)">You do not have to repeat the full question in your answer.</p>
          <p style="margin: 0.4rem 0 0; font-size: 0.95rem"><em>Why do you silence your phone at night? &nbsp; Because I need to sleep.</em></p>
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
              label: "\"Why do you turn off notifications at night?\" Which answer fits?",
              options: [
                { value: "a", label: "Because I need to sleep without interruptions." },
                { value: "b", label: "I turn them off at ten." },
                { value: "c", label: "The setting is under Notifications." },
              ],
              expectedAnswer: "a",
            },
            {
              type: "radio",
              label: "\"Why did Linh turn off location access for the flashlight app?\" Which answer fits?",
              options: [
                { value: "a", label: "She downloaded the app on Tuesday." },
                { value: "b", label: "Because the flashlight works without knowing her location." },
                { value: "c", label: "The flashlight button is on the screen." },
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
              words: ["Why", "do", "you", "use", "different", "passwords"],
              correctAnswer: "Why do you use different passwords",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Why", "did", "he", "delete", "the", "email"],
              correctAnswer: "Why did he delete the email",
            },
            {
              type: "text",
              label: "\"Why do you check the sender before replying?\" A good answer usually starts with ___.",
              expectedAnswers: ["because", "Because"],
            },
          ],
        },
      ],
    },

    // SECTION 4. All six together
    {
      id: "all-six-together",
      stepNumber: 4,
      title: "Checking a suspicious message",
      icon: "🤝",
      explanation: `
        ${sceneCard("sceneNeighborsMeet", "After work in East Boston. Diego shows Fernanda an unexpected delivery text.", "terracotta")}

        <p style="margin: 0 0 1rem 0; font-size: 0.95rem; line-height: 1.6">Diego has not ordered anything, but a text says he owes a delivery fee. He and Fernanda talk through what to do before he clicks anything.</p>

        ${dialogue([
          { speaker: "Diego", avatar: "🧑🏽", text: "I got a text about a package. It says I need to pay a delivery fee.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "<strong>What</strong> did you order?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "🧑🏽", text: "Nothing. That\'s <strong>why</strong> I\'m confused.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "Then don\'t use the link. <strong>Where</strong> is the option to report the message?", side: "left", tone: "blue" },
          { speaker: "Diego", avatar: "🧑🏽", text: "Here, under the menu. I\'ll report it as junk.", side: "right", tone: "terracotta" },
          { speaker: "Fernanda", avatar: "👩🏽", text: "Good. <strong>How often</strong> do you get these texts? I\'ve had three this week.", side: "left", tone: "blue" },
        ])}

        <div class="gc-bg-terracotta-alpha gc-callout-terracotta" style="padding: 1rem 1.25rem; border-radius: 0.5rem; margin-bottom: 1.25rem">
          <p style="margin: 0; font-size: 1.05rem">All six question words work in the same basic pattern: <strong>Wh- word + helper verb (be/do/does/did) + subject + main verb.</strong> The helper verb changes. The order does not.</p>
        </div>

        <p style="margin: 0 0 0.75rem 0; font-weight: 600">Two mistakes to watch for:</p>

        <div style="display: grid; gap: 0.5rem; margin: 0 0 1.25rem 0">
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; background: rgba(220,50,50,0.07); border-left: 3px solid rgba(220,50,50,0.4)">
            <p style="margin: 0 0 0.2rem 0; font-weight: 600; font-size: 0.88rem">Missing helper verb</p>
            <p style="margin: 0 0 0.15rem 0">&#10007; <em>Where you save your photos?</em></p>
            <p style="margin: 0">&#10003; <em>Where <strong>do</strong> you save your photos?</em></p>
          </div>
          <div style="padding: 0.7rem 1rem; border-radius: 0.5rem; background: rgba(220,50,50,0.07); border-left: 3px solid rgba(220,50,50,0.4)">
            <p style="margin: 0 0 0.2rem 0; font-weight: 600; font-size: 0.88rem">Wrong word order (subject before helper)</p>
            <p style="margin: 0 0 0.15rem 0">&#10007; <em>What you are downloading?</em></p>
            <p style="margin: 0">&#10003; <em>What <strong>are you</strong> downloading?</em></p>
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
                { value: "a", label: "Where does Fernanda save her photos?" },
                { value: "b", label: "Why did Diego report the text?" },
                { value: "c", label: "What you do with strange emails?" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "radio",
              label: "Which question has a mistake?",
              options: [
                { value: "a", label: "When did she download the app?" },
                { value: "b", label: "Who is the sender?" },
                { value: "c", label: "How she checks her email?" },
              ],
              expectedAnswer: "c",
            },
            {
              type: "text",
              label: "\"___ did Diego report the text?\" (You want to know the reason.)",
              expectedAnswers: ["Why", "why"],
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
              words: ["How", "do", "you", "report", "a", "message"],
              correctAnswer: "How do you report a message",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["Why", "did", "Diego", "report", "the", "text"],
              correctAnswer: "Why did Diego report the text",
            },
            {
              type: "word-scramble",
              label: "Unscramble:",
              words: ["When", "does", "the", "video", "call", "start"],
              correctAnswer: "When does the video call start",
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
      id: "qra-q2",
      question: "You want to know the location of the computer lab. Which question do you ask?",
      options: [
        { value: "a", label: "Who is the computer lab?" },
        { value: "b", label: "When is the computer lab?" },
        { value: "c", label: "Where is the computer lab?" },
      ],
      correctAnswer: "c",
      explanation: "Where asks about a place or location.",
      topic: "where",
      skill: "usage",
      skillTag: "meaning-where-place",
      difficulty: "easy",
    },
    {
      id: "qra-qfb1",
      type: "fill-blank" as const,
      question: "Fill in the blank: \"___ is the online meeting? On Monday and Wednesday evenings.\" (Which question word asks about time?)",
      correctAnswer: "When",
      acceptedAnswers: ["when"],
      explanation: "When asks about a time. Monday and Wednesday evenings are times.",
      topic: "when",
      skill: "usage",
      skillTag: "meaning-when-time",
      difficulty: "easy",
    },
    {
      id: "qra-q6",
      question: "Linh wants to join a video call. Which question is correctly formed?",
      options: [
        { value: "a", label: "What time does the call starts?" },
        { value: "b", label: "What time does the call start?" },
        { value: "c", label: "What time the call starts?" },
      ],
      correctAnswer: "b",
      explanation: "With most verbs, you need do or does between the Wh- word and the subject. \"What time does the call start?\" is the correct form.",
      topic: "question-formation",
      skill: "error-detection",
      skillTag: "form-do-does-missing",
      difficulty: "medium",
    },
    {
      id: "qra-qws1",
      type: "word-scramble" as const,
      question: "A classmate asks about an online meeting. Put the words in order to make the question.",
      words: ["When", "does", "the", "online", "meeting", "start"],
      correctAnswer: "When does the online meeting start",
      hint: "Wh- word → helper verb → subject → main verb",
      explanation: "Question word order: Wh- word + do/does + subject + main verb.",
      topic: "question-formation",
      skill: "usage",
      skillTag: "form-question-word-order",
      difficulty: "medium",
    },
    {
      id: "qra-q7",
      question: "Linh wants to know if a tutorial video is 2 minutes long or 20 minutes long. She asks:",
      options: [
        { value: "a", label: "How often is the video?" },
        { value: "b", label: "How long is the video?" },
        { value: "c", label: "How far is the video?" },
      ],
      correctAnswer: "b",
      explanation: "How long asks about duration. Two minutes and twenty minutes are lengths of time.",
      topic: "how-long",
      skill: "usage",
      skillTag: "meaning-how-long-duration",
      difficulty: "medium",
    },
  ],
};
