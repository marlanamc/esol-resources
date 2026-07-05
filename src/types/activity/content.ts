// Activity content union, shared enums, and the content parser.

import type {
    GuideContent,
    InteractiveGuideContent,
    LegacyGuideContent,
} from "./guide";
import type { QuizContent, SlidesContent, WorksheetContent } from "./quiz";
import type { SpeakingActivityContent } from "./speaking";
import type { VocabularyContent } from "./vocabulary";
import type {
    EdPronunciationContent,
    MinimalPairsContent,
    PronunciationSentenceListeningContent,
} from "./pronunciation";
import type { TimedWritingContent } from "./writing";
import type {
    CafeCatchUpContent,
    EmotionSpinWheelContent,
    GrammarHospitalContent,
    TriviaGameContent,
} from "./games";
import type { TimelineTensesContent } from "./timeline";
export type ActivityType =
    | "quiz"
    | "worksheet"
    | "slides"
    | "guide"
    | "game"
    | "resource"
    | "speaking"
    | "writing";

export type ActivityProgressStatus = "in_progress" | "completed" | "submitted";

export type ActivityContent =
    | QuizContent
    | WorksheetContent
    | GuideContent
    | InteractiveGuideContent
    | LegacyGuideContent
    | SlidesContent
    | SpeakingActivityContent
    | VocabularyContent
    | EdPronunciationContent
    | MinimalPairsContent
    | PronunciationSentenceListeningContent
    | TimelineTensesContent
    | TimedWritingContent
    | EmotionSpinWheelContent
    | CafeCatchUpContent
    | TriviaGameContent
    | GrammarHospitalContent
    | Record<string, unknown>;

export function parseActivityContent(raw: string): ActivityContent | null {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            return parsed as ActivityContent;
        }
    } catch {
        // ignore
    }
    return null;
}
