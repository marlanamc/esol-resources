"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, RotateCcw } from "lucide-react";
import type { ExerciseItem } from "@/types/activity";

interface WordScrambleExerciseProps {
    item: Extract<ExerciseItem, { type: "word-scramble" }>;
    userAnswer: string;
    isCorrect: boolean;
    isIncorrect: boolean;
    submitted: boolean;
    onChange: (value: string) => void;
}

export function WordScrambleExercise({
    item,
    userAnswer,
    isCorrect,
    isIncorrect,
    submitted,
    onChange,
}: WordScrambleExerciseProps) {
    const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());

    const handleWordClick = (index: number) => {
        if (submitted) return;

        const newSelected = new Set(selectedWords);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedWords(newSelected);

        // Build sentence from selected words in order
        const selected = Array.from(newSelected).sort((a, b) => a - b);
        const sentence = selected.map((i) => item.words[i]).join(" ");
        onChange(sentence);
    };

    const handleClear = () => {
        setSelectedWords(new Set());
        onChange("");
    };

    return (
        <motion.div
            className="word-scramble-exercise"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-3">
                <span className="text-sm text-text font-medium">{item.label}</span>
            </div>

            {/* Word Cards */}
            <div className="word-cards bg-bg-light border-2 border-dashed border-border rounded-lg p-4 mb-4">
                <p className="text-xs text-text-muted mb-3">Click words to select them in order:</p>
                <div className="flex flex-wrap gap-2">
                    {item.words.map((word, index) => {
                        const isSelected = selectedWords.has(index);
                        const selectionOrder = isSelected
                            ? Array.from(selectedWords)
                                .sort((a, b) => a - b)
                                .indexOf(index) + 1
                            : null;

                        return (
                            <motion.button
                                key={index}
                                type="button"
                                onClick={() => handleWordClick(index)}
                                disabled={submitted}
                                className={`word-card px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isSelected
                                        ? "bg-primary text-white shadow-md border-2 border-primary"
                                        : "bg-white text-primary border-2 border-primary"
                                    } ${submitted ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                                    }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 15 }}
                                whileHover={!submitted ? { scale: 1.1, y: -4 } : {}}
                                whileTap={!submitted ? { scale: 0.95 } : {}}
                            >
                                <span className="flex items-center gap-2">
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.span
                                                className="w-5 h-5 rounded-full bg-white text-primary text-xs flex items-center justify-center font-bold"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 180 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                {selectionOrder}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {word}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Answer Display */}
            <div className="mb-3">
                <label className="block mb-2 text-xs font-medium text-text-muted">
                    Your Sentence:
                </label>
                <motion.div
                    className={`w-full px-4 py-3 border-2 rounded-lg min-h-[50px] flex items-center ${submitted
                            ? isCorrect
                                ? "border-success bg-success/5"
                                : "border-error bg-error/5"
                            : "border-border bg-white"
                        }`}
                    animate={submitted && isIncorrect ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-sm text-text">
                        {userAnswer || (
                            <span className="text-text-muted italic">
                                Click words above to build your sentence...
                            </span>
                        )}
                    </p>
                </motion.div>
            </div>

            {/* Clear Button */}
            <AnimatePresence>
                {!submitted && userAnswer && (
                    <motion.button
                        type="button"
                        onClick={handleClear}
                        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ x: 4 }}
                    >
                        <RotateCcw className="w-3 h-3" />
                        Clear Selection
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Hint */}
            {item.hint && !submitted && (
                <motion.div
                    className="flex items-start gap-2 text-xs text-text-muted italic mb-2 bg-info/5 border border-info/20 rounded-lg p-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Lightbulb className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                    <span>Hint: {item.hint}</span>
                </motion.div>
            )}

            {/* Feedback */}
            <AnimatePresence mode="wait">
                {submitted && isCorrect && (
                    <motion.div
                        className="text-xs text-success mt-2 flex items-center gap-2"
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: "spring" }}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                        </motion.div>
                        <span className="font-medium">Perfect! Correct!</span>
                    </motion.div>
                )}
                {submitted && isIncorrect && (
                    <motion.div
                        className="text-xs text-error mt-2 space-y-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring" }}
                            >
                                <XCircle className="w-4 h-4" />
                            </motion.div>
                            <span className="font-medium">Not quite right</span>
                        </div>
                        <p className="pl-6">
                            Expected: <strong className="text-text">{item.correctAnswer}</strong>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
