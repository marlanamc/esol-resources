import { useEffect, useState } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";

interface FillInBlankQuestion {
    id: number;
    sentence: string;
    correctAnswer: string;
    options: string[];
    explanation?: string;
}

interface Props {
    contentStr: string;
    activityId?: string;
}

export default function FillInBlankGame({ contentStr, activityId }: Props) {
    const questions = parseQuestions(contentStr);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + (selectedAnswer ? 1 : 0)) / questions.length) * 100;

    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return; // Already answered

        setSelectedAnswer(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        }
    };

    useEffect(() => {
        if (!activityId || questions.length === 0) return;
        const value = Math.round(progress);
        void saveActivityProgress(activityId, value, value >= 100 ? "completed" : "in_progress");
    }, [activityId, progress, questions.length]);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setShowExplanation(false);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setScore(0);
        setShowExplanation(false);
        if (activityId) {
            void saveActivityProgress(activityId, 0, "in_progress");
        }
    };

    if (questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <p className="text-gray-500">No questions available.</p>
            </div>
        );
    }

    const isLastQuestion = currentIndex === questions.length - 1;
    const isComplete = selectedAnswer !== null && isLastQuestion;

    return (
        <div className="max-w-4xl mx-auto px-4 py-4">
            {/* Header with Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-600">
                        Question <span className="text-[var(--color-primary)] font-bold">{currentIndex + 1}</span> of {questions.length}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                        Score: <span className="text-green-600 font-bold">{score}</span> / {questions.length}
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--color-primary)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
                {/* Question Text */}
                <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                        {currentQuestion.sentence.split("_____").map((part, idx, arr) => (
                            <span key={idx}>
                                {part}
                                {idx < arr.length - 1 && (
                                    <span className="inline-block min-w-[120px] border-b-4 border-dashed border-[var(--color-primary)] mx-2 pb-1"></span>
                                )}
                            </span>
                        ))}
                    </h3>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption = option === currentQuestion.correctAnswer;

                        let bgColor = "bg-white hover:bg-gray-50";
                        let borderColor = "border-gray-300";
                        let textColor = "text-gray-900";

                        if (selectedAnswer) {
                            if (isSelected && isCorrect) {
                                bgColor = "bg-green-50";
                                borderColor = "border-green-500";
                                textColor = "text-green-900";
                            } else if (isSelected && !isCorrect) {
                                bgColor = "bg-red-50";
                                borderColor = "border-red-500";
                                textColor = "text-red-900";
                            } else if (isCorrectOption) {
                                bgColor = "bg-green-50";
                                borderColor = "border-green-400";
                                textColor = "text-green-900";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={selectedAnswer !== null}
                                className={`p-4 rounded-xl border-2 font-medium text-left transition-all ${bgColor} ${borderColor} ${textColor} ${!selectedAnswer ? "hover:shadow-md hover:-translate-y-0.5" : ""
                                    } disabled:cursor-not-allowed`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-gray-400">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-lg">{option}</span>
                                    {selectedAnswer && isCorrectOption && (
                                        <span className="ml-auto text-green-600">✓</span>
                                    )}
                                    {selectedAnswer && isSelected && !isCorrect && (
                                        <span className="ml-auto text-red-600">✗</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {selectedAnswer && (
                    <div className={`p-4 rounded-xl mb-4 ${isCorrect ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"}`}>
                        <p className={`font-bold text-lg mb-2 ${isCorrect ? "text-green-900" : "text-red-900"}`}>
                            {isCorrect ? "🎉 Correct!" : "❌ Not quite right"}
                        </p>
                        {!isCorrect && (
                            <p className="text-gray-700">
                                The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                            </p>
                        )}
                        {currentQuestion.explanation && (
                            <div className="mt-3">
                                <button
                                    onClick={() => setShowExplanation(!showExplanation)}
                                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                                >
                                    {showExplanation ? "Hide explanation" : "Why?"}
                                </button>
                                {showExplanation && (
                                    <p className="mt-2 text-gray-700 text-sm italic">
                                        {currentQuestion.explanation}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Completion Message */}
                {isComplete && (
                    <div className="bg-[var(--color-secondary)] text-white rounded-xl p-6 text-center mb-4">
                        <h2 className="text-3xl font-bold mb-2">🎊 Complete!</h2>
                        <p className="text-xl">
                            You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
                        </p>
                        <p className="mt-2 text-white/80">
                            {score === questions.length
                                ? "Perfect score! Excellent work!"
                                : score >= questions.length * 0.7
                                    ? "Great job!"
                                    : "Keep practicing!"}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4">
                {!isLastQuestion && selectedAnswer && (
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-[var(--color-text)] text-white font-semibold rounded-lg hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Next Question →
                    </button>
                )}
                {isComplete && (
                    <button
                        onClick={handleRestart}
                        className="px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[#d4865a] transition-all shadow-lg hover:shadow-xl"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
}

// Parse the content string into questions
function parseQuestions(content: string): FillInBlankQuestion[] {
    const questions: FillInBlankQuestion[] = [];
    const blocks = content.trim().split(/\n\n+/);

    let id = 1;
    for (const block of blocks) {
        const lines = block.split("\n").map(l => l.trim()).filter(l => l);

        let sentence = "";
        let correctAnswer = "";
        let options: string[] = [];
        let explanation = "";

        for (const line of lines) {
            if (line.startsWith("Q:")) {
                sentence = line.substring(2).trim();
            } else if (line.startsWith("A:")) {
                correctAnswer = line.substring(2).trim();
            } else if (line.startsWith("OPTIONS:")) {
                options = line.substring(8).split(",").map(o => o.trim());
            } else if (line.startsWith("EXPLAIN:")) {
                explanation = line.substring(8).trim();
            }
        }

        if (sentence && correctAnswer && options.length > 0) {
            questions.push({ id: id++, sentence, correctAnswer, options, explanation });
        }
    }

    return questions;
}
