"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Award, ThumbsUp, BookMarked, CheckCircle2, Sparkles } from "lucide-react";
import type { MiniQuizQuestion } from "@/types/activity";
import { Button } from "@/components/ui/Button";

interface MiniQuizSectionProps {
    questions: MiniQuizQuestion[];
    onComplete: () => void;
}

export function MiniQuizSection({ questions, onComplete }: MiniQuizSectionProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                correct++;
            }
        });
        setScore(correct);
        setSubmitted(true);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    const allAnswered = questions.every((q) => answers[q.id]);
    const percentage = (score / questions.length) * 100;

    return (
        <motion.div
            className="mini-quiz-section bg-white rounded-xl shadow-lg border border-border p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="text-center mb-8"
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
                <h2 className="text-3xl font-bold text-primary mb-2 font-display">
                    Mini Quiz
                </h2>
                <p className="text-text-muted">
                    Test your understanding of Present Perfect!
                </p>
            </motion.div>

            <AnimatePresence>
                {submitted && (
                    <motion.div
                        className={`p-6 rounded-lg mb-6 ${percentage >= 80
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
                                    <Award className="w-16 h-16 mx-auto mb-2 text-success" />
                                ) : percentage >= 60 ? (
                                    <ThumbsUp className="w-16 h-16 mx-auto mb-2 text-warning" />
                                ) : (
                                    <BookMarked className="w-16 h-16 mx-auto mb-2 text-error" />
                                )}
                            </motion.div>

                            {/* Confetti effect for perfect scores */}
                            {percentage >= 80 && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: '50%',
                                            }}
                                            initial={{ opacity: 1, y: 0, rotate: 0 }}
                                            animate={{
                                                opacity: 0,
                                                y: [-50, -200],
                                                rotate: Math.random() * 360,
                                                x: (Math.random() - 0.5) * 200
                                            }}
                                            transition={{ duration: 1.5, delay: i * 0.05 }}
                                        >
                                            <Sparkles className="w-4 h-4 text-success" />
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            <motion.h3
                                className="text-2xl font-bold mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Score: {score} / {questions.length}
                            </motion.h3>
                            <motion.p
                                className="text-lg mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {percentage >= 80
                                    ? "Excellent work! You've mastered Present Perfect!"
                                    : percentage >= 60
                                        ? "Good job! Review the sections you missed."
                                        : "Keep practicing! Review the guide and try again."}
                            </motion.p>
                            <motion.div
                                className="flex gap-3 justify-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button variant="outline" onClick={handleReset}>
                                    Try Again
                                </Button>
                                <Button variant="success" onClick={onComplete}>
                                    Finish
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {questions.map((question, index) => {
                    const userAnswer = answers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    const showFeedback = submitted;

                    return (
                        <motion.div
                            key={question.id}
                            className={`quiz-question p-6 rounded-lg border-2 ${showFeedback && isCorrect
                                    ? "border-success bg-success/5"
                                    : showFeedback && !isCorrect
                                        ? "border-error bg-error/5"
                                        : "border-border bg-white"
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
                                <h4 className="text-base font-semibold text-text flex-1">
                                    {question.question}
                                </h4>
                            </div>

                            <div className="space-y-2 ml-11">
                                {question.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center p-3 rounded-md border transition-all cursor-pointer ${!submitted
                                                ? "hover:bg-bg-light border-border"
                                                : showFeedback && option.value === question.correctAnswer
                                                    ? "border-success bg-success/10"
                                                    : showFeedback &&
                                                        option.value === userAnswer &&
                                                        !isCorrect
                                                        ? "border-error bg-error/10"
                                                        : "border-border"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={option.value}
                                            checked={userAnswer === option.value}
                                            onChange={(e) =>
                                                setAnswers({ ...answers, [question.id]: e.target.value })
                                            }
                                            disabled={submitted}
                                            className="w-5 h-5 text-primary focus:ring-primary focus:ring-2"
                                        />
                                        <span className="ml-3 text-sm text-text">{option.label}</span>

                                        <AnimatePresence>
                                            {showFeedback && option.value === question.correctAnswer && (
                                                <motion.div
                                                    className="ml-auto"
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

                            <AnimatePresence>
                                {showFeedback && question.explanation && (
                                    <motion.div
                                        className="mt-4 ml-11 p-3 bg-primary/5 rounded-md border-l-4 border-primary"
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-sm text-text">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {!submitted && (
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: questions.length * 0.1 + 0.3 }}
                >
                    <motion.div whileHover={{ scale: allAnswered ? 1.05 : 1 }} whileTap={{ scale: allAnswered ? 0.95 : 1 }}>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                        >
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
        </motion.div>
    );
}
