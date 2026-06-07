"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Award, ThumbsUp, BookMarked, CheckCircle2, Sparkles, RotateCcw } from "lucide-react";
import type { MiniQuizQuestion, QuestionResponse } from "@/types/activity";
import { Button } from "@/components/ui/Button";

interface MiniQuizSectionProps {
    questions: MiniQuizQuestion[];
    onComplete: (score: number, total: number) => void;
    onScoreSubmit?: (score: number, total: number, responses?: QuestionResponse[]) => void;
    topicTitle?: string;
    onBack?: () => void;
}

function normalize(s: string) {
    return s.trim().toLowerCase();
}

function initScramble(questions: MiniQuizQuestion[]) {
    const state: Record<string, { pool: string[]; selected: string[] }> = {};
    questions.forEach((q) => {
        if (q.type === "word-scramble") {
            state[q.id] = {
                pool: [...q.words].sort(() => Math.random() - 0.5),
                selected: [],
            };
        }
    });
    return state;
}

export function MiniQuizSection({ questions, onComplete, onScoreSubmit, topicTitle = "this grammar topic", onBack }: MiniQuizSectionProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [scramble, setScramble] = useState<Record<string, { pool: string[]; selected: string[] }>>(() => initScramble(questions));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const scoreCardRef = useRef<HTMLDivElement | null>(null);

    const getUserAnswer = (q: MiniQuizQuestion): string => {
        if (q.type === "word-scramble") return (scramble[q.id]?.selected ?? []).join(" ");
        return answers[q.id] ?? "";
    };

    const checkCorrect = (q: MiniQuizQuestion, userAnswer: string): boolean => {
        if (q.type === "fill-blank") {
            return (
                normalize(userAnswer) === normalize(q.correctAnswer) ||
                (q.acceptedAnswers?.some((a) => normalize(a) === normalize(userAnswer)) ?? false)
            );
        }
        if (q.type === "word-scramble") {
            return (
                normalize(userAnswer) === normalize(q.correctAnswer) ||
                (q.correctAnswers?.some((a) => normalize(a) === normalize(userAnswer)) ?? false)
            );
        }
        return userAnswer === q.correctAnswer;
    };

    const isQuestionAnswered = (q: MiniQuizQuestion): boolean => {
        if (q.type === "word-scramble") {
            return (scramble[q.id]?.selected.length ?? 0) === q.words.length;
        }
        return !!answers[q.id];
    };

    const handleSubmit = () => {
        const responses: QuestionResponse[] = [];
        let correct = 0;

        questions.forEach((q) => {
            const userAnswer = getUserAnswer(q);
            const isCorrect = checkCorrect(q, userAnswer);
            if (isCorrect) correct++;
            responses.push({
                questionId: q.id,
                userAnswer,
                isCorrect,
                skillTag: q.skillTag,
                difficulty: q.difficulty,
                topic: q.topic,
            });
        });

        setScore(correct);
        setSubmitted(true);

        if (onScoreSubmit) {
            onScoreSubmit(correct, questions.length, responses);
        }
    };

    const handleReset = () => {
        setAnswers({});
        setScramble(initScramble(questions));
        setSubmitted(false);
        setScore(0);
    };

    const moveToSelected = (qId: string, wordIdx: number) => {
        setScramble((prev) => {
            const { pool, selected } = prev[qId];
            const newPool = [...pool];
            const [word] = newPool.splice(wordIdx, 1);
            return { ...prev, [qId]: { pool: newPool, selected: [...selected, word] } };
        });
    };

    const moveToPool = (qId: string, selIdx: number) => {
        setScramble((prev) => {
            const { pool, selected } = prev[qId];
            const newSelected = [...selected];
            const [word] = newSelected.splice(selIdx, 1);
            return { ...prev, [qId]: { pool: [...pool, word], selected: newSelected } };
        });
    };

    const allAnswered = questions.every(isQuestionAnswered);
    const answeredCount = questions.filter(isQuestionAnswered).length;
    const percentage = (score / questions.length) * 100;

    useEffect(() => {
        if (!submitted) return;
        const timeoutId = window.setTimeout(() => {
            scoreCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
        return () => window.clearTimeout(timeoutId);
    }, [submitted]);

    return (
        <div className="fixed inset-0 z-30 bg-[var(--color-bg)] flex flex-col touch-manipulation md:static md:z-auto md:h-auto md:min-h-0 md:bg-transparent">
            {/* Mobile Header */}
            <div className="flex-shrink-0 border-b-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 md:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg hover:bg-[var(--color-bg-light)] transition-colors"
                                aria-label="Back to guide"
                            >
                                <svg className="w-5 h-5 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            <span className="font-bold text-[var(--color-text)]">Mini Quiz</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">
                            {submitted ? `${score}/${questions.length}` : `${answeredCount}/${questions.length}`}
                        </span>
                        <div className="h-2 w-16 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-[width] duration-300 ${submitted ? (percentage >= 80 ? "bg-success" : percentage >= 60 ? "bg-warning" : "bg-error") : "bg-[var(--color-primary)]"}`}
                                style={{ width: `${submitted ? percentage : (answeredCount / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <motion.div
                    className="mini-quiz-section relative w-full max-w-4xl mx-auto px-4 py-6 overflow-hidden sm:px-8 sm:py-8 md:rounded-xl md:border md:border-border md:bg-[var(--color-surface-elevated)] md:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Desktop Header */}
                    <motion.div
                        className="hidden md:block text-center mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-primary mb-2 font-display">Mini Quiz</h2>
                        <p className="text-text-muted">Test your understanding of {topicTitle}!</p>
                    </motion.div>

                    {/* Score card */}
                    <AnimatePresence>
                        {submitted && (
                            <motion.div
                                ref={scoreCardRef}
                                className={`relative overflow-hidden p-4 sm:p-6 rounded-xl mb-6 ${percentage >= 80
                                    ? "bg-success/10 border-2 border-success"
                                    : percentage >= 60
                                        ? "bg-warning/10 border-2 border-warning"
                                        : "bg-error/10 border-2 border-error"
                                    }`}
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="inline-block"
                                        initial={{ scale: 0, rotate: -360 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
                                    >
                                        {percentage >= 80 ? (
                                            <Award className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 text-success" />
                                        ) : percentage >= 60 ? (
                                            <ThumbsUp className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 text-warning" />
                                        ) : (
                                            <BookMarked className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 text-error" />
                                        )}
                                    </motion.div>

                                    {percentage >= 80 && (
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute"
                                                    style={{ left: `${Math.random() * 100}%`, top: "50%" }}
                                                    initial={{ opacity: 1, y: 0, rotate: 0 }}
                                                    animate={{ opacity: 0, y: [-50, -200], rotate: Math.random() * 360, x: (Math.random() - 0.5) * 200 }}
                                                    transition={{ duration: 1.5, delay: i * 0.05 }}
                                                >
                                                    <Sparkles className="w-4 h-4 text-success" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    <motion.h3
                                        className="text-xl sm:text-2xl font-bold mb-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Score: {score} / {questions.length}
                                    </motion.h3>
                                    <motion.p
                                        className="text-base sm:text-lg mb-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {percentage >= 80
                                            ? `Excellent work! You've mastered ${topicTitle}!`
                                            : percentage >= 60
                                                ? "Good job! Review the sections you missed."
                                                : "Keep practicing! Review the guide and try again."}
                                    </motion.p>
                                    <motion.p
                                        className="text-sm text-text-muted mb-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.45 }}
                                    >
                                        Click <span className="font-semibold text-text">Finish</span> to see your certificate.
                                    </motion.p>
                                    <motion.div
                                        className="hidden sm:flex flex-row items-center justify-center gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button variant="outline" onClick={handleReset}>Try Again</Button>
                                        <Button variant="success" onClick={() => onComplete(score, questions.length)}>Finish</Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const userAnswer = getUserAnswer(question);
                            const isCorrect = submitted ? checkCorrect(question, userAnswer) : false;
                            const showFeedback = submitted;

                            return (
                                <motion.div
                                    key={question.id}
                                    className={`quiz-question rounded-xl border bg-[var(--color-surface-elevated)] p-4 sm:p-6 ${showFeedback && isCorrect
                                        ? "border-success bg-success/5"
                                        : showFeedback && !isCorrect
                                            ? "border-error bg-error/5"
                                            : "border-border"
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <motion.div
                                            className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                                        >
                                            {index + 1}
                                        </motion.div>
                                        <h4 className="text-base font-semibold text-text flex-1 leading-relaxed min-w-0 pt-1">
                                            {question.question}
                                        </h4>
                                    </div>

                                    {/* Radio question */}
                                    {(!question.type || question.type === "radio") && (
                                        <div className="space-y-2 ml-0 sm:ml-11">
                                            {question.options.map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`flex items-center gap-3 rounded-lg border p-3 sm:p-4 text-left transition-[background-color,border-color] cursor-pointer min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!submitted
                                                        ? "hover:bg-bg-light border-border active:scale-[0.99]"
                                                        : showFeedback && option.value === question.correctAnswer
                                                            ? "border-success bg-success/10"
                                                            : showFeedback && option.value === userAnswer && !isCorrect
                                                                ? "border-error bg-error/10"
                                                                : "border-border"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={question.id}
                                                        value={option.value}
                                                        checked={userAnswer === option.value}
                                                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                                        disabled={submitted}
                                                        className="w-5 h-5 text-primary focus:ring-primary focus:ring-2 flex-shrink-0"
                                                    />
                                                    <span className="text-sm sm:text-base text-text flex-1">{option.label}</span>
                                                    <AnimatePresence>
                                                        {showFeedback && option.value === question.correctAnswer && (
                                                            <motion.div
                                                                className="flex-shrink-0"
                                                                initial={{ scale: 0, rotate: -180 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                            >
                                                                <CheckCircle2 className="w-5 h-5 text-success" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {/* Fill-in-the-blank question */}
                                    {question.type === "fill-blank" && (
                                        <div className="ml-0 sm:ml-11">
                                            <input
                                                type="text"
                                                value={answers[question.id] ?? ""}
                                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                                disabled={submitted}
                                                placeholder="Type your answer…"
                                                className={`w-full rounded-lg border-2 px-4 py-3 text-sm sm:text-base bg-[var(--color-bg)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${submitted
                                                    ? isCorrect
                                                        ? "border-success bg-success/5 text-success"
                                                        : "border-error bg-error/5"
                                                    : "border-border hover:border-primary/40"
                                                    }`}
                                            />
                                            <AnimatePresence>
                                                {showFeedback && !isCorrect && (
                                                    <motion.p
                                                        className="mt-2 text-sm text-success font-medium"
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        Correct answer: <span className="font-bold">{question.correctAnswer}</span>
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {/* Word-scramble question */}
                                    {question.type === "word-scramble" && (
                                        <div className="ml-0 sm:ml-11 space-y-3">
                                            {question.hint && !submitted && (
                                                <p className="text-xs text-text-muted italic">Hint: {question.hint}</p>
                                            )}

                                            {/* Selected tray */}
                                            <div
                                                className={`flex flex-wrap gap-2 min-h-[52px] p-3 rounded-lg border-2 border-dashed transition-colors ${submitted
                                                    ? isCorrect
                                                        ? "border-success bg-success/5"
                                                        : "border-error bg-error/5"
                                                    : "border-primary/30 bg-[var(--color-bg-light)]"
                                                    }`}
                                            >
                                                {(scramble[question.id]?.selected ?? []).length === 0 && !submitted && (
                                                    <span className="text-sm text-text-muted self-center">Tap words below to build the sentence</span>
                                                )}
                                                {(scramble[question.id]?.selected ?? []).map((word, i) => (
                                                    <motion.button
                                                        key={`sel-${i}`}
                                                        onClick={() => !submitted && moveToPool(question.id, i)}
                                                        disabled={submitted}
                                                        className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:cursor-default"
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.8, opacity: 0 }}
                                                        layout
                                                    >
                                                        {word}
                                                    </motion.button>
                                                ))}
                                            </div>

                                            {/* Word pool */}
                                            {!submitted && (
                                                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[var(--color-surface-elevated)] border border-border">
                                                    {(scramble[question.id]?.pool ?? []).map((word, i) => (
                                                        <motion.button
                                                            key={`pool-${i}`}
                                                            onClick={() => moveToSelected(question.id, i)}
                                                            className="px-3 py-1.5 rounded-md bg-[var(--color-bg)] border border-border text-sm font-medium text-text hover:border-primary hover:text-primary transition-colors"
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.8, opacity: 0 }}
                                                            layout
                                                        >
                                                            {word}
                                                        </motion.button>
                                                    ))}
                                                    {(scramble[question.id]?.pool ?? []).length === 0 && (
                                                        <span className="text-xs text-text-muted self-center">All words placed — tap a word above to move it back</span>
                                                    )}
                                                </div>
                                            )}

                                            <AnimatePresence>
                                                {showFeedback && !isCorrect && (
                                                    <motion.p
                                                        className="text-sm text-success font-medium"
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        Correct order: <span className="font-bold">{question.correctAnswer}</span>
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>

                                            {/* Reset scramble button */}
                                            {!submitted && (scramble[question.id]?.selected ?? []).length > 0 && (
                                                <button
                                                    onClick={() => setScramble((prev) => ({
                                                        ...prev,
                                                        [question.id]: initScramble(questions)[question.id] ?? prev[question.id],
                                                    }))}
                                                    className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Explanation (all types) */}
                                    <AnimatePresence>
                                        {showFeedback && question.explanation && (
                                            <motion.div
                                                className={`mt-4 ml-0 sm:ml-11 p-3 rounded-lg border-l-4 ${isCorrect ? "bg-success/10 border-success" : "bg-error/10 border-error"}`}
                                                initial={{ opacity: 0, height: 0, y: -10 }}
                                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <p className={`text-sm ${isCorrect ? "text-success" : "text-error"}`}>
                                                    <strong>Explanation:</strong> {question.explanation}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Desktop Submit Button */}
                    {!submitted && (
                        <motion.div
                            className="hidden sm:flex mt-8 flex-col items-center gap-3 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: questions.length * 0.1 + 0.3 }}
                        >
                            <motion.div
                                className="w-full max-w-[360px]"
                                whileHover={{ scale: allAnswered ? 1.05 : 1 }}
                                whileTap={{ scale: allAnswered ? 0.95 : 1 }}
                            >
                                <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!allAnswered} className="w-full">
                                    Submit Quiz
                                </Button>
                            </motion.div>
                            <AnimatePresence>
                                {!allAnswered && (
                                    <motion.p
                                        className="text-sm text-text-muted mt-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Please answer all questions before submitting
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Mobile bottom spacer */}
                    <div className="h-24 sm:hidden" />
                </motion.div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="flex-shrink-0 border-t-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-4 sm:hidden">
                {!submitted ? (
                    <div className="flex flex-col gap-2">
                        {!allAnswered && (
                            <p className="text-xs text-center text-[var(--color-text-muted)]">
                                Answer all {questions.length} questions to submit
                            </p>
                        )}
                        <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!allAnswered} className="w-full min-h-[52px] text-lg font-bold">
                            Submit Quiz
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleReset} className="flex-1 min-h-[52px]">Try Again</Button>
                        <Button variant="success" onClick={() => onComplete(score, questions.length)} className="flex-1 min-h-[52px]">Finish</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
