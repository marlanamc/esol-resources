import Link from "next/link";
import { AlertCircle, ChevronRight, RotateCcw, Star } from "lucide-react";
import { CLASS_TIME_ZONE } from "@/data/school-calendar-2026-27";
import type { WeeklyQuizCatchUp, WeeklyQuizCatchUpItem } from "@/lib/learner/weekly-quiz-status";

const dueDate = new Intl.DateTimeFormat("en-US", { timeZone: CLASS_TIME_ZONE, weekday: "short", month: "short", day: "numeric" });

function QuizRow({ quiz, tone }: { quiz: WeeklyQuizCatchUpItem; tone: "missing" | "retake" }) {
    const missing = tone === "missing";
    return (
        <li>
            <Link
                href={quiz.href}
                className={`flex min-h-14 items-center gap-3 rounded-xl border bg-white p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:bg-transparent ${
                    missing
                        ? "border-red-200 hover:border-red-400 focus-visible:ring-red-700 dark:border-red-400/40"
                        : "border-violet-200 hover:border-violet-400 focus-visible:ring-violet-700 dark:border-violet-400/40"
                }`}
            >
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-text">{quiz.title}</span>
                    <span className="block text-xs font-semibold text-text-muted">
                        {missing ? `Was due ${dueDate.format(quiz.dueAt)}` : `Your best score: ${quiz.score}%`}
                    </span>
                </span>
                <span
                    className={`flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-extrabold text-white ${
                        missing ? "bg-red-800 dark:bg-red-600" : "bg-violet-700 dark:bg-violet-500"
                    }`}
                >
                    {missing ? "Do it now" : "Try again"}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                </span>
            </Link>
        </li>
    );
}

/**
 * Profile card for weekly quiz homework: quizzes the student never finished
 * (missing) and finished quizzes they can retake for 100%. Hidden when both
 * lists are empty.
 */
export function WeeklyQuizCatchUpCard({ catchUp }: { catchUp: WeeklyQuizCatchUp }) {
    const { missing, notPerfect } = catchUp;
    if (missing.length === 0 && notPerfect.length === 0) return null;

    return (
        <section aria-label="Weekly quiz homework" className="space-y-5">
            {missing.length > 0 && (
                <div className="rounded-2xl border-2 border-red-800 bg-red-50 p-5 dark:border-red-400 dark:bg-red-950/40">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-800 text-white dark:bg-red-600">
                            <AlertCircle size={22} aria-hidden />
                        </span>
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[.08em] text-red-800 dark:text-red-300">Homework · Missing</p>
                            <h2 className="text-xl font-extrabold text-text">
                                You have {missing.length} missing {missing.length === 1 ? "quiz" : "quizzes"}
                            </h2>
                            <p className="text-sm font-semibold text-text-muted">Quizzes are your homework. It is not too late. Do {missing.length === 1 ? "it" : "them"} now.</p>
                        </div>
                    </div>
                    <ul className="space-y-2">
                        {missing.map((quiz) => <QuizRow key={quiz.activityId} quiz={quiz} tone="missing" />)}
                    </ul>
                </div>
            )}

            {notPerfect.length > 0 && (
                <div className="rounded-2xl border-2 border-violet-700 bg-violet-50 p-5 dark:border-violet-400 dark:bg-violet-950/40">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-700 text-white dark:bg-violet-500">
                            {missing.length > 0 ? <RotateCcw size={22} aria-hidden /> : <Star size={22} aria-hidden />}
                        </span>
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[.08em] text-violet-800 dark:text-violet-300">Go for 100%</p>
                            <h2 className="text-xl font-extrabold text-text">
                                Try these quizzes again
                            </h2>
                            <p className="text-sm font-semibold text-text-muted">Take a quiz again and again. We keep your best score. A better score gets more points.</p>
                        </div>
                    </div>
                    <ul className="space-y-2">
                        {notPerfect.map((quiz) => <QuizRow key={quiz.activityId} quiz={quiz} tone="retake" />)}
                    </ul>
                </div>
            )}
        </section>
    );
}
