"use client";

import { useState } from "react";
import type { SpeakingActivityContent } from "@/types/activity";

interface Props {
    content: SpeakingActivityContent;
    activityId: string;
    assignmentId?: string | null;
}

export default function SpeakingActivityRenderer({ content, activityId, assignmentId }: Props) {
    const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
    const [reflection, setReflection] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const minLength = content.reflectionMinLength || 30;
    const minPrompts = content.minPromptsRequired || 1;

    const handlePromptToggle = (promptId: string) => {
        const newSelected = new Set(selectedPrompts);
        if (newSelected.has(promptId)) {
            newSelected.delete(promptId);
        } else {
            newSelected.add(promptId);
        }
        setSelectedPrompts(newSelected);
    };

    const handleSubmit = async () => {
        // Validation
        if (selectedPrompts.size < minPrompts) {
            setError(`Please practice at least ${minPrompts} prompt${minPrompts > 1 ? 's' : ''}.`);
            return;
        }

        if (reflection.trim().length < minLength) {
            setError(`Please write at least ${minLength} characters in your reflection.`);
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const submissionContent = {
                promptsPracticed: Array.from(selectedPrompts),
                reflection: reflection.trim(),
                timeSpent: undefined, // Could add timer later
            };

            const response = await fetch("/api/activity/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activityId,
                    assignmentId: assignmentId || null,
                    content: submissionContent,
                    score: 100, // Full credit for completion
                    points: 6, // Speaking activity points
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit activity");
            }

            setIsSubmitted(true);
        } catch (err) {
            console.error('Submission failed:', err);
            setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="relative lg:fixed lg:inset-0 bg-bg flex flex-col min-h-screen lg:h-screen lg:w-screen">
                <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-8">
                    <div className="max-w-2xl w-full">
                        <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6 sm:p-8 text-center">
                            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎉</div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Great Work!</h2>
                            <p className="text-sm sm:text-base text-gray-700 mb-4">
                                You earned 6 points for completing this speaking activity!
                            </p>
                            <div className="bg-white rounded-lg p-3 sm:p-4 mb-5 sm:mb-6">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2"><strong>Your Reflection:</strong></p>
                                <p className="text-sm sm:text-base text-gray-800 italic leading-relaxed">"{reflection}"</p>
                            </div>
                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 active:bg-primary/95 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg transition-colors touch-manipulation"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative lg:fixed lg:inset-0 bg-bg flex flex-col min-h-screen lg:h-screen lg:w-screen">
            {/* Sticky Header */}
            <header className="sticky lg:relative top-0 flex-none px-4 sm:px-6 py-4 sm:py-5 border-b border-border/60 bg-white/90 backdrop-blur-md z-10">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 font-display leading-tight">
                    {content.title}
                </h1>
                {content.description && (
                    <p className="text-sm sm:text-base text-gray-700">{content.description}</p>
                )}
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pb-6 lg:pb-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">

            {/* Key Phrases Section */}
            {content.keyPhrases && content.keyPhrases.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">📚</span>
                        <span>Key Phrases to Practice</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        Study these phrases before practicing your speaking prompts.
                    </p>
                    <div className="grid gap-2.5 sm:gap-3">
                        {content.keyPhrases.map((phrase, index) => (
                            <div
                                key={index}
                                className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4"
                            >
                                <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                    {phrase.phrase}
                                </p>
                                {phrase.example && (
                                    <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                                        Example: "{phrase.example}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Speaking Prompts Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">🗣️</span>
                    <span>Speaking Prompts</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Choose at least {minPrompts} prompt{minPrompts > 1 ? 's' : ''} to practice. Speak for 1-2 minutes on each topic.
                </p>
                <div className="space-y-3 sm:space-y-4">
                    {content.prompts.map((prompt) => {
                        // Parse context into bullet points if it contains examples or multiple sentences
                        const contextParts = prompt.context
                            ? prompt.context.split(/(?:Example:|Practice:|Tricky!|Mix them in your answers!|Same with|Notice:)/i).filter(Boolean)
                            : [];
                        const hasMultipleParts = contextParts.length > 1 || (prompt.context && prompt.context.includes("'") && prompt.context.length > 80);

                        return (
                            <label
                                key={prompt.id}
                                className={`block border-2 rounded-lg p-3 sm:p-5 cursor-pointer transition-all touch-manipulation ${
                                    selectedPrompts.has(prompt.id)
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-gray-200 active:border-primary/50 active:bg-gray-50"
                                }`}
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedPrompts.has(prompt.id)}
                                        onChange={() => handlePromptToggle(prompt.id)}
                                        className="mt-1 sm:mt-1.5 h-5 w-5 sm:h-6 sm:w-6 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                                    />
                                    <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                                        {/* Level Badge */}
                                        {prompt.level && (
                                            <span className="inline-block text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-gray-700 uppercase tracking-wide">
                                                {prompt.level}
                                            </span>
                                        )}

                                        {/* Main Question */}
                                        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-snug sm:leading-relaxed">
                                            {prompt.text}
                                        </p>

                                        {/* Context/Tips */}
                                        {prompt.context && (
                                            <div className="bg-blue-50 border-l-3 sm:border-l-4 border-blue-400 rounded-r-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                                                <p className="text-[10px] sm:text-xs font-bold text-blue-900 uppercase tracking-wide mb-1.5 sm:mb-2">
                                                    💡 Tips & Examples
                                                </p>
                                                {hasMultipleParts ? (
                                                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                                                        {prompt.context.split('.').filter(s => s.trim().length > 10).map((sentence, i) => (
                                                            <li key={i} className="flex gap-2">
                                                                <span className="text-blue-500 font-bold flex-shrink-0 mt-0.5">•</span>
                                                                <span className="leading-relaxed">{sentence.trim()}{sentence.trim().endsWith('.') ? '' : '.'}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                        {prompt.context}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                    Selected: {selectedPrompts.size} / {content.prompts.length} prompts
                </div>
            </div>

            {/* Reflection Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">✍️</span>
                    <span>Your Reflection</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    {content.reflectionPrompt}
                </p>
                <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write 1-2 sentences about what you practiced..."
                    className="w-full h-32 sm:h-36 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <p className="text-xs sm:text-sm text-gray-600">
                        {reflection.length} / {minLength} minimum characters
                    </p>
                    {reflection.length >= minLength && (
                        <span className="text-xs sm:text-sm text-secondary font-semibold">✓ Ready to submit</span>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-stretch sm:justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedPrompts.size < minPrompts || reflection.trim().length < minLength}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 active:bg-primary/95 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-colors text-base sm:text-lg touch-manipulation"
                >
                    {isSubmitting ? "Submitting..." : "Submit Speaking Practice"}
                </button>
            </div>
                </div>
            </div>
        </div>
    );
}
