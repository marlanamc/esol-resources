import type { InteractiveGuideContent } from "@/types/activity";

// ---------------------------------------------------------------------------
// Visual helpers. Backgrounds use neutral or brand alpha values so both themes
// render correctly without hardcoded light colors.
// ---------------------------------------------------------------------------

type Step = {
  number: string;
  title: string;
  body: string;
  tone: "terracotta" | "sage" | "blue" | "amber";
};

const stepList = (steps: Step[]): string => {
  const rows = steps
    .map(
      (s) => `
        <div style="display: flex; gap: 0.75rem; align-items: flex-start">
          <div class="gc-bg-${s.tone}-alpha gc-text-${s.tone === "terracotta" ? "brown" : s.tone}" style="flex-shrink: 0; width: 1.9rem; height: 1.9rem; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem">${s.number}</div>
          <div>
            <div style="font-weight: 700; margin-bottom: 0.15rem">${s.title}</div>
            <div style="line-height: 1.55">${s.body}</div>
          </div>
        </div>
      `
    )
    .join("");

  return `
    <div style="display: flex; flex-direction: column; gap: 0.9rem; margin: 1.25rem 0; padding: 1rem; border-radius: 0.75rem; background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06)">
      ${rows}
    </div>
  `;
};

const pill = (label: string, tone: "terracotta" | "sage" | "blue" | "amber"): string =>
  `<span class="gc-bg-${tone}-alpha" style="display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px; font-size: 0.82rem; font-weight: 600; white-space: nowrap">${label}</span>`;

export const welcomeHowToUseAppContent: InteractiveGuideContent = {
  type: "interactive-guide",
  tableOfContents: true,
  sections: [
    {
      id: "what-this-is",
      title: "Welcome to Class Companion",
      icon: "👋",
      explanation: `
        <p>This app is where you practice English between classes. Everything you need each week is in one place, and you never have to guess what to do next.</p>
        <p>You do not need to finish everything in one sitting. The app remembers where you stopped.</p>
        <div class="gc-callout-sage" style="padding: 1rem; border-radius: 0.5rem; background: rgba(106,141,115,0.12)">
          <p style="margin: 0"><strong>One rule to remember:</strong> start at the top of your week and work down. That is the whole system.</p>
        </div>
      `,
    },
    {
      id: "find-your-week",
      stepNumber: 1,
      title: "Find this week's work",
      icon: "🗺️",
      explanation: `
        <p>When you open the app, the first thing you see is <strong>This Week</strong>. It lists your activities in order.</p>
        ${stepList([
          {
            number: "1",
            title: "Look for the highlighted activity",
            body: `The one marked ${pill("Continue", "terracotta")} is where you left off. Tap it and you are back in.`,
            tone: "terracotta",
          },
          {
            number: "2",
            title: "Work down the list",
            body: "Each activity is short. Do them in order from top to bottom.",
            tone: "sage",
          },
          {
            number: "3",
            title: "Watch the checkmarks appear",
            body: "A finished activity gets a checkmark, so you can always see what is left.",
            tone: "blue",
          },
        ])}
        <p>If you want to see the whole course, open the <strong>Course Map</strong>. Your teacher opens each new week when the class is ready for it.</p>
      `,
      exercises: [
        {
          id: "wta-find-1",
          title: "Check your understanding",
          instructions: "Choose the best answer.",
          items: [
            {
              type: "radio",
              label: "You open the app and are not sure what to do. Where do you look first?",
              options: [
                { value: "this-week", label: "This Week, and tap the highlighted activity." },
                { value: "settings", label: "The settings page." },
                { value: "ask", label: "Wait and ask the teacher in class." },
              ],
              expectedAnswer: "this-week",
            },
            {
              type: "radio",
              label: "In what order should you do the activities in your week?",
              options: [
                { value: "top-down", label: "From the top of the list down." },
                { value: "random", label: "Any order — it does not matter." },
                { value: "quiz-first", label: "The quiz first, then everything else." },
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
      title: "The four things you will do",
      icon: "🧩",
      explanation: `
        <p>Every week mixes the same few activity types. You will recognize them quickly.</p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin: 1.25rem 0">
          <div class="gc-bg-sage-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
            <strong>📚 Vocabulary</strong> — the same six words three ways: flash cards to meet them, matching to check meaning, then fill in the blank to use them in a sentence.
          </div>
          <div class="gc-bg-terracotta-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
            <strong>📖 Guides</strong> — short grammar readings with practice questions built in, like this one.
          </div>
          <div class="gc-bg-blue-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
            <strong>🎮 Games</strong> — practice that moves faster. Timelines, sorting words, fixing mistakes.
          </div>
          <div class="gc-bg-amber-alpha" style="padding: 0.85rem 1rem; border-radius: 0.5rem">
            <strong>✅ Verb quizzes</strong> — a short weekly quiz on two verbs. These start in Week 3.
          </div>
        </div>
        <div class="gc-callout-blue" style="padding: 1rem; border-radius: 0.5rem; background: rgba(59,130,246,0.10)">
          <p style="margin: 0">Seeing the same three vocabulary steps every week is on purpose. Repeating a word in different ways is what makes it stick.</p>
        </div>
      `,
    },
    {
      id: "points-and-streaks",
      stepNumber: 3,
      title: "Points, streaks, and mistakes",
      icon: "⭐",
      explanation: `
        <p>You earn points for finishing activities, and you keep a <strong>streak</strong> for every day you practice. Points are there to show your effort over time.</p>
        ${stepList([
          {
            number: "✓",
            title: "Wrong answers are fine",
            body: "Nothing is graded against you here. This is practice, and the app shows you the answer with an explanation so you learn from it.",
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
          title: "Check your understanding",
          instructions: "Choose the best answer.",
          items: [
            {
              type: "radio",
              label: "You get an answer wrong in a game. What happens?",
              options: [
                { value: "learn", label: "The app shows the correct answer and why. You can try again." },
                { value: "grade", label: "It lowers your class grade." },
                { value: "locked", label: "You are locked out of the activity." },
              ],
              expectedAnswer: "learn",
            },
            {
              type: "radio",
              label: "How many times can you play a practice game?",
              options: [
                { value: "unlimited", label: "As many times as you want." },
                { value: "once", label: "Only once." },
                { value: "three", label: "Three times per week." },
              ],
              expectedAnswer: "unlimited",
            },
          ],
        },
      ],
    },
    {
      id: "install-it",
      stepNumber: 4,
      title: "Put it on your phone",
      icon: "📱",
      explanation: `
        <p>You can add Class Companion to your home screen so it opens like a normal app, with no browser and no typing a web address.</p>
        ${stepList([
          {
            number: "iOS",
            title: "iPhone or iPad (Safari)",
            body: "Tap the <strong>Share</strong> button at the bottom, scroll down, and choose <strong>Add to Home Screen</strong>.",
            tone: "blue",
          },
          {
            number: "And",
            title: "Android (Chrome)",
            body: "Tap the <strong>⋮</strong> menu in the corner, then choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.",
            tone: "sage",
          },
        ])}
        <div class="gc-callout-terracotta" style="padding: 1rem; border-radius: 0.5rem; background: rgba(176,87,64,0.10)">
          <p style="margin: 0"><strong>You are ready.</strong> Go back to This Week and start your vocabulary flash cards. See you in class!</p>
        </div>
      `,
    },
  ],
};
