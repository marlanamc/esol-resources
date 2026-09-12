import type { InteractiveGuideContent } from "@/types/activity";
import { howToUseAppImages as img } from "@/data/how-to-use-app-images";

// ---------------------------------------------------------------------------
// Visual helpers. Surfaces use gc-* classes so light and dark themes both work.
// Screenshots are real Class Companion UI (see public/images/how-to-use-app/).
// ---------------------------------------------------------------------------

type Accent = "terracotta" | "sage" | "blue" | "amber";

const screenshotCard = (
  shotId: keyof typeof img,
  caption: string,
  accent: Accent = "terracotta",
): string => {
  const shot = img[shotId];
  if (!shot) return "";
  return `
    <div class="gc-bg-white gc-border-black-alpha" style="margin: 0 0 1.25rem 0; padding: 0; border-radius: 0.75rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08)">
      <img src="${shot.url}" alt="${shot.alt}" loading="lazy" decoding="async" class="gc-row-stripe" style="display: block; width: 100%; height: auto; object-fit: contain" />
      <div class="gc-row-stripe" style="padding: 0.55rem 0.9rem; font-size: 0.85rem; line-height: 1.45">
        <span class="gc-text-${accent === "terracotta" ? "brown" : accent}" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.72rem">Look</span>
        &nbsp;${caption}
      </div>
    </div>
  `;
};

const shotTile = (
  shotId: keyof typeof img,
  label: string,
  accent: Accent,
): string => {
  const shot = img[shotId];
  if (!shot) return "";
  return `
    <div class="gc-bg-white gc-border-black-alpha" style="border-radius: 0.65rem; overflow: hidden; border: 1px solid rgba(0,0,0,0.08)">
      <img src="${shot.url}" alt="${shot.alt}" loading="lazy" decoding="async" style="display: block; width: 100%; height: 140px; object-fit: cover; object-position: top" />
      <div class="gc-bg-${accent}-alpha" style="padding: 0.45rem 0.65rem; font-size: 0.82rem; font-weight: 700">${label}</div>
    </div>
  `;
};

type Turn = {
  speaker: string;
  avatar: string;
  text: string;
  side: "left" | "right";
  tone: Accent;
};

const dialogue = (turns: Turn[]): string => {
  const bubbles = turns
    .map((t) => {
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
          <div class="gc-bg-${t.tone}-alpha" style="padding: 0.65rem 0.9rem; border-radius: ${radius}; max-width: 82%">
            <div class="gc-text-${t.tone === "terracotta" ? "brown" : t.tone}" style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; margin-bottom: 0.15rem">${t.speaker}</div>
            <div style="line-height: 1.5">${t.text}</div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="gc-row-stripe gc-border-black-alpha" style="display: flex; flex-direction: column; gap: 0.625rem; margin: 1.25rem 0; padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(0,0,0,0.06)">
      ${bubbles}
    </div>
  `;
};

type Step = {
  number: string;
  title: string;
  body: string;
  tone: Accent;
};

const stepList = (steps: Step[]): string => {
  const rows = steps
    .map(
      (s) => `
        <div style="display: flex; gap: 0.75rem; align-items: flex-start">
          <div class="gc-bg-${s.tone}-alpha gc-text-${s.tone === "terracotta" ? "brown" : s.tone}" style="flex-shrink: 0; width: 1.9rem; height: 1.9rem; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem">${s.number}</div>
          <div>
            <div style="font-weight: 700; margin-bottom: 0.15rem">${s.title}</div>
            <div style="line-height: 1.55">${s.body}</div>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    <div class="gc-row-stripe gc-border-black-alpha" style="display: flex; flex-direction: column; gap: 0.9rem; margin: 1.25rem 0; padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(0,0,0,0.06)">
      ${rows}
    </div>
  `;
};

const osStepCard = (opts: {
  badge: string;
  title: string;
  body: string;
  glyph: string;
  tone: Accent;
}): string => `
  <div class="gc-bg-${opts.tone}-alpha" style="padding: 0.9rem 1rem; border-radius: 0.75rem; display: flex; gap: 0.85rem; align-items: flex-start">
    <div class="gc-bg-white" style="flex-shrink: 0; width: 2.6rem; height: 2.6rem; border-radius: 0.7rem; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; border: 1px solid rgba(0,0,0,0.08)">${opts.glyph}</div>
    <div>
      <div class="gc-text-${opts.tone === "terracotta" ? "brown" : opts.tone}" style="font-size: 0.7rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.15rem">${opts.badge}</div>
      <div style="font-weight: 700; margin-bottom: 0.2rem">${opts.title}</div>
      <div style="line-height: 1.5; font-size: 0.92rem">${opts.body}</div>
    </div>
  </div>
`;

export const welcomeHowToUseAppContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "what-this-is",
      title: "You're in. Now what?",
      icon: "🚀",
      explanation: `
        <p>This is Class Companion, the app where you practice English between classes. Sofia just got her login. Help her find the next tap.</p>
        ${dialogue([
          { speaker: "Sofia", avatar: "👩🏽", text: "Okay… I am in. There are a lot of buttons. Where do I start?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙂", text: "Look for the highlighted activity. It has an orange <strong>Start</strong> button. Tap that.", side: "right", tone: "terracotta" },
        ])}
        ${screenshotCard("continueCard", "The highlighted row is your next activity. Tap the orange <strong>Start</strong> button.", "terracotta")}
        <div class="gc-callout-sage" style="padding: 1rem; border-radius: 0.5rem">
          <p style="margin: 0"><strong>One rule:</strong> start at the top of your week and work down. The app remembers where you stopped.</p>
        </div>
      `,
    },
    {
      id: "find-your-week",
      stepNumber: 1,
      title: "Mission 1: Find This Week",
      icon: "🗺️",
      explanation: `
        <p>Every week lives in one list. You do not hunt around the app. You open your week, tap <strong>Start</strong> on the highlighted activity, and follow the list from top to bottom.</p>
        ${screenshotCard("thisWeek", "This is your week. The highlighted row is where you are now. Finished items get a checkmark.", "sage")}
        ${stepList([
          {
            number: "1",
            title: "Tap Start",
            body: "The highlighted activity with the orange <strong>Start</strong> button is where you are now, or the next one if you finished.",
            tone: "terracotta",
          },
          {
            number: "2",
            title: "Work down the list",
            body: "Each activity is short. Do them in order. No skipping to the quiz first.",
            tone: "sage",
          },
          {
            number: "3",
            title: "Watch the checkmarks",
            body: "A checkmark means done. Empty circle means still waiting for you.",
            tone: "blue",
          },
        ])}
        ${screenshotCard("courseMap", "Want the whole year? Open the <strong>Course Map</strong>. Your teacher opens each new week when the class is ready.", "blue")}
        ${dialogue([
          { speaker: "Sofia", avatar: "👩🏽", text: "So I do not need to remember a website for each activity?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙂", text: "Nope. Open your week. Tap <strong>Start</strong>. That is the whole system.", side: "right", tone: "terracotta" },
        ])}
      `,
      exercises: [
        {
          id: "wta-find-1",
          title: "Look at the pictures",
          instructions: "Choose the best answer. Use the screenshots above.",
          items: [
            {
              type: "radio",
              label: "You open the app and are not sure what to do. What do you tap first?",
              options: [
                { value: "settings", label: "The settings page." },
                { value: "this-week", label: "The highlighted activity with the Start button." },
                { value: "ask", label: "Wait and ask the teacher in class." },
              ],
              expectedAnswer: "this-week",
            },
            {
              type: "radio",
              label: "In what order should you do the activities in your week?",
              options: [
                { value: "top-down", label: "From the top of the list down." },
                { value: "quiz-first", label: "The quiz first, then everything else." },
                { value: "random", label: "Any order. It does not matter." },
              ],
              expectedAnswer: "top-down",
            },
          ],
        },
      ],
    },
    {
      id: "activity-types",
      stepNumber: 2,
      title: "Mission 2: The four things you will do",
      icon: "🧩",
      explanation: `
        <p>Every week mixes the same few activity types. After two weeks you will recognize them in one look.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1.25rem 0">
          ${shotTile("vocabFlashcards", "📚 Vocabulary", "sage")}
          ${shotTile("grammarGuide", "📖 Guides", "terracotta")}
          ${shotTile("game", "🎮 Games", "blue")}
          ${shotTile("verbQuiz", "✅ Verb quizzes", "amber")}
        </div>
        ${stepList([
          {
            number: "📚",
            title: "Vocabulary: same six words, three ways",
            body: "Flash cards to meet them, matching to check meaning, then fill in the blank to use them in a sentence.",
            tone: "sage",
          },
          {
            number: "📖",
            title: "Guides: like this one",
            body: "Short readings with practice questions built in. You are in a guide right now.",
            tone: "terracotta",
          },
          {
            number: "🎮",
            title: "Games: faster practice",
            body: "Timelines, sorting words, fixing mistakes. Play them more than once if you want.",
            tone: "blue",
          },
          {
            number: "✅",
            title: "Verb quizzes: starting Week 3",
            body: "A short weekly quiz on two verbs. Not yet. First we learn the app.",
            tone: "amber",
          },
        ])}
        <div class="gc-callout-blue" style="padding: 1rem; border-radius: 0.5rem">
          <p style="margin: 0">Seeing the same three vocabulary steps every week is on purpose. Repeating a word in different ways is what makes it stick.</p>
        </div>
      `,
      exercises: [
        {
          id: "wta-types-1",
          title: "Match the picture",
          instructions: "Look at the four pictures above.",
          items: [
            {
              type: "radio",
              label: "Which activity shows a word on a card you can flip?",
              options: [
                { value: "game", label: "Games" },
                { value: "quiz", label: "Verb quizzes" },
                { value: "vocab", label: "Vocabulary flash cards" },
              ],
              expectedAnswer: "vocab",
            },
          ],
        },
      ],
    },
    {
      id: "points-and-streaks",
      stepNumber: 3,
      title: "Mission 3: Points, streaks, and oops",
      icon: "⭐",
      explanation: `
        <p>You earn points for finishing activities. A <strong>streak</strong> counts every day you practice. Points show your effort over time. They are not a class grade.</p>
        ${screenshotCard("pointsStreak", "You earn <strong>points</strong> for finishing, and a <strong>day streak</strong> for every day you practice. Come back tomorrow and the streak goes up.", "amber")}
        ${dialogue([
          { speaker: "Sofia", avatar: "👩🏽", text: "What if I get an answer wrong? Does it lower my grade?", side: "left", tone: "sage" },
          { speaker: "You", avatar: "🙂", text: "No. The app shows the right answer and why. Then you can try again. That is the point.", side: "right", tone: "terracotta" },
        ])}
        ${stepList([
          {
            number: "✓",
            title: "Wrong answers are fine",
            body: "Nothing here is graded against you. This is practice.",
            tone: "sage",
          },
          {
            number: "↻",
            title: "You can repeat anything",
            body: "Play a game or reread a guide as many times as you like.",
            tone: "blue",
          },
          {
            number: "📵",
            title: "It works without internet",
            body: "If you lose your connection, keep going. Your work is saved and sent when you are back online.",
            tone: "amber",
          },
        ])}
      `,
      exercises: [
        {
          id: "wta-points-1",
          title: "What is true here?",
          instructions: "Tap every sentence that is true.",
          items: [
            {
              type: "checkbox",
              label: "Choose all the true sentences.",
              options: [
                { value: "learn", label: "If you get an answer wrong, the app shows the correct answer and why." },
                { value: "grade", label: "A wrong answer lowers your class grade." },
                { value: "unlimited", label: "You can play a practice game as many times as you want." },
                { value: "locked", label: "One wrong answer locks you out of the activity." },
              ],
              expectedAnswers: ["learn", "unlimited"],
            },
          ],
        },
      ],
    },
    {
      id: "install-it",
      stepNumber: 4,
      title: "Mission 4: Put it on your phone",
      icon: "📱",
      explanation: `
        <p>Add Class Companion to your home screen. Then it opens like a normal app: no browser, no typing a web address.</p>
        ${screenshotCard("mobileHome", "This is your week on a phone. Same list. Same Start button. Just smaller.", "blue")}
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin: 1.25rem 0">
          ${osStepCard({
            badge: "iPhone or iPad",
            title: "Safari → Share → Add to Home Screen",
            body: "Open the app in <strong>Safari</strong> (not Chrome). Tap the <strong>Share</strong> square with the arrow up at the bottom. Scroll down and tap <strong>Add to Home Screen</strong>.",
            glyph: "□↑",
            tone: "blue",
          })}
          ${osStepCard({
            badge: "Android",
            title: "Chrome → ⋮ → Install app",
            body: "Open the app in <strong>Chrome</strong>. Tap the <strong>⋮</strong> menu in the corner, then tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.",
            glyph: "⋮",
            tone: "sage",
          })}
        </div>
        <div class="gc-callout-terracotta" style="padding: 1rem; border-radius: 0.5rem">
          <p style="margin: 0"><strong>You are ready.</strong> Answer the three questions, then go back to This Week and start your vocabulary flash cards. See you in class!</p>
        </div>
      `,
    },
  ],
  miniQuiz: [
    {
      id: "wta-mq-1",
      type: "radio",
      question: "Sofia opens the app after work. She is tired and does not want to get lost. What should she tap?",
      options: [
        { value: "map-random", label: "Any week on the Course Map." },
        { value: "continue", label: "The highlighted activity with the Start button." },
        { value: "settings", label: "Settings, then search." },
      ],
      correctAnswer: "continue",
      explanation: "The highlighted row with Start is always the next activity. You do not need to search.",
      difficulty: "easy",
      topic: "app-navigation",
      skill: "recognition",
    },
    {
      id: "wta-mq-2",
      type: "radio",
      question: "Sofia gets a game question wrong. What happens?",
      options: [
        { value: "learn", label: "The app shows the correct answer and why. She can try again." },
        { value: "zero", label: "She loses all her points for the week." },
        { value: "locked", label: "The game locks until next class." },
      ],
      correctAnswer: "learn",
      explanation: "Wrong answers are practice, not a grade. Try again as many times as you want.",
      difficulty: "easy",
      topic: "points-and-mistakes",
      skill: "usage",
    },
    {
      id: "wta-mq-3",
      type: "radio",
      question: "Sofia wants the app on her iPhone home screen, like WhatsApp. What does she tap first in Safari?",
      options: [
        { value: "settings-app", label: "The iPhone Settings app." },
        { value: "address-bar", label: "The website address, then copy it." },
        { value: "share", label: "Share (the square with an arrow up), then Add to Home Screen." },
      ],
      correctAnswer: "share",
      explanation: "In Safari: Share → Add to Home Screen. On Android Chrome, use the ⋮ menu instead.",
      difficulty: "easy",
      topic: "install",
      skill: "recognition",
    },
  ],
};
