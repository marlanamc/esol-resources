"use client";

import React, { useState, useEffect } from "react";
import type { InteractiveGuideContent, FormulaPart, Exercise, ExerciseItem } from "@/types/activity";

interface Props {
    content: InteractiveGuideContent;
    title?: string;
    onClose?: () => void;
}

export default function InteractiveGuideViewer({ content, title, onClose }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const sections = content.sections || [];
    const totalSteps = sections.length;
    const currentSection = sections[currentStep];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
            } else if (e.key === "ArrowLeft") {
                if (currentStep > 0) setCurrentStep(prev => prev - 1);
            } else if (e.key === "Escape" && onClose) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentStep, totalSteps, onClose]);

    if (totalSteps === 0) return <div>No content available.</div>;

    return (
        <div className="fixed inset-0 bg-bg z-fixed flex flex-col h-screen w-screen overflow-hidden text-text font-body selection:bg-primary/20">
            {/* Header */}
            <header className="flex-none h-16 px-6 border-b border-border/60 bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-display font-bold text-text truncate max-w-md">
                        {title || "Grammar Presentation Mode"}
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-text-muted tracking-wide">
                        {currentStep + 1} / {totalSteps}
                    </span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-text-muted hover:text-error transition-colors rounded-full hover:bg-red-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Area - Split Screen */}
            <div className="flex-1 flex min-h-0 relative">
                {/* Navigation Arrows (Floating) */}
                <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-border transition-all hover:scale-110 active:scale-95 text-primary ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-primary-dark'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <button
                    onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
                    disabled={currentStep === totalSteps - 1}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-border transition-all hover:scale-110 active:scale-95 text-primary ${currentStep === totalSteps - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-primary-dark'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>

                {/* Left Panel: Theory/Content */}
                <div className="flex-1 overflow-y-auto w-1/2 p-8 md:p-12 lg:pl-24 lg:pr-12 flex flex-col justify-center bg-white/50">
                    <div className="max-w-xl mx-auto w-full animate-fade-in-up">
                        {currentSection.stepNumber && (
                            <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4 border-b-2 border-primary/20 pb-1">
                                Part {currentSection.stepNumber}
                            </span>
                        )}
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-8 leading-tight">
                            {currentSection.title}
                        </h2>

                        {currentSection.explanation && (
                            <div
                                className="prose prose-lg prose-slate text-text-muted leading-relaxed mb-8 max-w-none"
                                dangerouslySetInnerHTML={{ __html: currentSection.explanation }}
                            />
                        )}

                        {currentSection.examples && currentSection.examples.length > 0 && (
                            <div className="bg-bg-light/80 rounded-2xl p-6 border border-border/60 shadow-sm mb-8">
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
                                    <span className="text-lg">💡</span> Examples
                                </h3>
                                <div className="space-y-3">
                                    {currentSection.examples.map((example, idx) => (
                                        <div key={idx} className="bg-white px-4 py-3 rounded-xl border border-border/40 text-text font-medium text-lg leading-relaxed shadow-sm">
                                            {/* Attempt to highlight grammar parts if we can detect them easily, otherwise just text */}
                                            {/* Simple heuristic: text in [ ] or similar could be highlighted, or just render plain for now as per design */}
                                            {highlightGrammar(example)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentSection.formula && (
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                {currentSection.formula.map((part, idx) => (
                                    <FormulaBadge key={idx} part={part} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Practice/Interaction */}
                <div className="flex-1 overflow-y-auto w-1/2 bg-bg-light/30 border-l border-border/60 p-8 md:p-12 lg:pr-24 lg:pl-12 flex flex-col justify-center">
                    <div className="max-w-xl mx-auto w-full animate-fade-in-up delay-100">
                        {currentSection.exercises && currentSection.exercises.length > 0 ? (
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/60 relative overflow-hidden">
                                {/* Decorative blob */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                                <h3 className="flex items-center gap-2 text-lg font-display font-bold text-secondary-dark mb-6 relative z-10">
                                    <span className="text-xl">✍️</span> Practice
                                </h3>

                                <div className="space-y-8 relative z-10">
                                    {currentSection.exercises.map((exercise, idx) => (
                                        <ExerciseGroup key={idx} exercise={exercise} index={idx} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-12 opacity-40">
                                <div className="w-16 h-16 bg-border/20 rounded-full flex items-center justify-center mb-4 text-3xl">
                                    📖
                                </div>
                                <p className="text-lg font-display font-semibold">Notes Only</p>
                                <p className="text-sm">No exercises for this section.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Helper Components ---

function FormulaBadge({ part }: { part: FormulaPart }) {
    const colors = {
        subject: "bg-blue-100 text-blue-800 border-blue-200",
        verb: "bg-red-100 text-red-800 border-red-200",
        object: "bg-green-100 text-green-800 border-green-200",
        other: "bg-gray-100 text-gray-800 border-gray-200"
    };

    // Fallback if type is missing or unknown
    const style = colors[part.type as keyof typeof colors] || colors.other;

    return (
        <span className={`px-4 py-2 rounded-xl border-2 text-sm font-bold shadow-sm ${style}`}>
            {part.text}
        </span>
    );
}

function ExerciseGroup({ exercise, index }: { exercise: Exercise, index: number }) {
    return (
        <div className="space-y-6">
            {exercise.title && (
                <p className="text-sm font-semibold text-secondary-dark/80 uppercase tracking-wider">{exercise.title}</p>
            )}

            <div className="space-y-4">
                {exercise.items.map((item, idx) => (
                    <div key={idx} className="bg-bg-light/50 p-5 rounded-xl border border-border/60 hover:border-secondary/40 transition-colors">
                        <p className="text-text font-medium text-lg mb-3">
                            <span className="text-text-muted/50 font-bold mr-2 text-sm">{idx + 1}.</span>
                            {item.label}
                        </p>

                        {item.type === 'select' && (
                            <select className="w-full p-3 rounded-lg border border-border bg-white text-text focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all shadow-sm">
                                <option value="">Choose...</option>
                                {item.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}

                        {item.type === 'text' && (
                            <input
                                type="text"
                                placeholder={item.placeholder || "Type your answer..."}
                                className="w-full p-3 rounded-lg border border-border bg-white text-text focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all shadow-sm"
                            />
                        )}

                        {item.type === 'radio' && (
                            <div className="space-y-2 pl-2">
                                {item.options.map((opt, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name={`ex-${index}-item-${idx}`}
                                                className="peer appearance-none w-5 h-5 border-2 border-text-muted/40 rounded-full checked:border-secondary checked:bg-secondary transition-all"
                                            />
                                            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                                        </div>
                                        <span className="text-text group-hover:text-primary transition-colors">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Simple highlighter: 
// Replaces **bold** with bold spans, and maybe [highlight] with colored badges if convention exists.
// For now, just bolding.
function highlightGrammar(text: string) {
    // This is a naive implementation. In a real app we might parse markdown or specific tokens.
    // Assuming simple plain text for now, but could be enhanced.
    return text;
}
