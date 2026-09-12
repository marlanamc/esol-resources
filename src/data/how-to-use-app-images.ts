/**
 * Local Class Companion screenshots for the Welcome / How to Use the App guide.
 * Capture with: npm run capture:how-to-screenshots
 * These are app UI captures, not Unsplash photos.
 */

export interface HowToUseAppShot {
  url: string;
  alt: string;
}

export const howToUseAppImages = {
  continueCard: {
    url: "/images/how-to-use-app/continue-card.png",
    alt: "A highlighted activity in this week's list with an orange Start button. That is the next thing to tap.",
  },
  thisWeek: {
    url: "/images/how-to-use-app/this-week.png",
    alt: "This week's activity list in order. The first item is highlighted with an orange Start button.",
  },
  courseMap: {
    url: "/images/how-to-use-app/course-map.png",
    alt: "The Course Map showing Unit 1, Week 1, with this week's activities listed from top to bottom.",
  },
  vocabFlashcards: {
    url: "/images/how-to-use-app/vocab-flashcards.png",
    alt: "A vocabulary flash card with a word on the front. Tap the card to flip it and see the meaning.",
  },
  grammarGuide: {
    url: "/images/how-to-use-app/grammar-guide.png",
    alt: "A grammar guide page with a short reading, a photo, and practice questions underneath.",
  },
  game: {
    url: "/images/how-to-use-app/game.png",
    alt: "A practice game. A timeline shows past, now, and future, with a sentence to complete.",
  },
  verbQuiz: {
    url: "/images/how-to-use-app/verb-quiz.png",
    alt: "A short verb quiz with one question at a time and answer choices to tap.",
  },
  pointsStreak: {
    url: "/images/how-to-use-app/points-streak.png",
    alt: "Three stats in a row: points, day streak, and activities explored.",
  },
  mobileHome: {
    url: "/images/how-to-use-app/mobile-home.png",
    alt: "This week's activity list on a phone. The next activity is highlighted with a Start button.",
  },
} as const satisfies Record<string, HowToUseAppShot>;
