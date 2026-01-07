"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SpeakingActivityContent } from "@/types/activity";
import { saveActivityProgress } from "@/lib/activityProgress";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

interface Props {
    content: SpeakingActivityContent;
    activityId: string;
    assignmentId?: string | null;
}

export default function SpeakingActivityRenderer({ content, activityId, assignmentId }: Props) {
    const router = useRouter();
    const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
    const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());
    const minPrompts = content.minPromptsRequired || 1;

    useEffect(() => {
        void saveActivityProgress(activityId, 100, "completed");
    }, [activityId]);

    const handlePromptToggle = (promptId: string) => {
        const newSelected = new Set(selectedPrompts);
        if (newSelected.has(promptId)) {
            newSelected.delete(promptId);
        } else {
            newSelected.add(promptId);
        }
        setSelectedPrompts(newSelected);
    };

    const handleToggleTips = (promptId: string) => {
        const newExpanded = new Set(expandedTips);
        if (newExpanded.has(promptId)) {
            newExpanded.delete(promptId);
        } else {
            newExpanded.add(promptId);
        }
        setExpandedTips(newExpanded);
    };

    return (
        <div className="relative lg:fixed lg:inset-0 bg-bg flex flex-col min-h-screen lg:h-screen lg:w-screen">
            {/* Sticky Header */}
            <header className="sticky lg:relative top-0 flex-none px-4 sm:px-6 py-4 sm:py-5 border-b border-border/60 bg-white/90 backdrop-blur-md z-10">
                <div className="flex items-start gap-3 sm:gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex-shrink-0 mt-1 sm:mt-1.5 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 font-display leading-tight">
                            {content.title}
                        </h1>
                        {content.description && (
                            <p className="text-sm sm:text-base text-gray-700">{content.description}</p>
                        )}
                    </div>
                </div>
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

                                        {/* Collapsible Context/Tips */}
                                        {prompt.context && (
                                            <div className="space-y-2">
                                                {/* Toggle Button */}
                                                {!expandedTips.has(prompt.id) ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleToggleTips(prompt.id);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#4a8ca0] hover:text-[#3a7080] transition-colors duration-200 group"
                                                        aria-label={`Show tips for: ${prompt.text}`}
                                                        aria-expanded="false"
                                                    >
                                                        <Lightbulb className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                        <span>Need help?</span>
                                                        <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-200" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleToggleTips(prompt.id);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors duration-200 group mb-2"
                                                        aria-label={`Hide tips for: ${prompt.text}`}
                                                        aria-expanded="true"
                                                    >
                                                        <span>Hide tips</span>
                                                        <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                                    </button>
                                                )}

                                                {/* Animated Context Box */}
                                                <AnimatePresence>
                                                    {expandedTips.has(prompt.id) && (
                                                        <motion.div
                                                            className="bg-blue-50 border-l-3 sm:border-l-4 border-blue-400 rounded-r-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2"
                                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                                        >
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
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
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
                </div>
            </div>
        </div>
    );
}
