"use client";

import { useState, useEffect, useCallback } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";

/**
 * FlashcardData interface matching the parser output in ActivityRenderer
 */
interface FlashcardData {
    id: string;
    term: string;
    definition: string;
    example?: string;
}

interface FlashcardCarouselProps {
    cards: FlashcardData[];
    activityId?: string;
}

type CardMode = "term-first" | "def-first";

export default function FlashcardCarousel({ cards, activityId }: FlashcardCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [order, setOrder] = useState(cards.map((_, i) => i));
    const [isShuffling, setIsShuffling] = useState(false);

    // Settings
    const [mode, setMode] = useState<CardMode>("term-first");
    const [showExample, setShowExample] = useState(true);

    const total = cards.length;
    const currentCard = cards[order[currentIndex]];

    // Determine what is shown on Front vs Back based on mode
    const frontContent = mode === "term-first" ? currentCard.term : currentCard.definition;
    const backContent =
        mode === "term-first"
            ? {
                main: currentCard.definition,
                sub: showExample ? currentCard.example : undefined,
            }
            : {
                main: currentCard.term,
                sub: showExample ? currentCard.example : undefined, // Example usually goes with definition, but if flipped, we might want to show it? 
                // Actually, if "Def First", front is Def. Back is Term. Example usually clarifies the Def.
                // Let's keep example with Definition usually.
            };

    // Refined logic:
    // Term First: Front = Term. Back = Def + Example.
    // Def First: Front = Def + Example (maybe hidden until flip?). 
    //   Actually, usually "Def First" means you see Def, guess Term. So Front = Def. Back = Term.
    //   Where does example go? Usually with the Definition as a hint or context.
    //   Let's check if the user wants to toggle "Show Example" as a hint on the front or strictly on back.
    //   "you can check either definiteitin or example or both" -> implies filtering what is shown.
    //   Let's assume Example stays with Definition side for now. 

    const getSideContent = (side: "front" | "back") => {
        const isTermSide = (mode === "term-first" && side === "front") || (mode === "def-first" && side === "back");

        if (isTermSide) {
            return {
                type: "Term",
                text: currentCard.term,
                example: null
            };
        } else {
            return {
                type: "Definition",
                text: currentCard.definition,
                example: showExample ? currentCard.example : null
            };
        }
    };

    const currentFront = getSideContent("front");
    const currentBack = getSideContent("back");


    const goNext = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, [total]);

    const goPrev = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    }, [total]);

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    const shuffleOrder = () => {
        setIsShuffling(true);
        setTimeout(() => {
            const newOrder = [...order];
            for (let i = newOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
            }
            setOrder(newOrder);
            setCurrentIndex(0);
            setIsFlipped(false);
            setIsShuffling(false);
        }, 300);
    };

    const resetOrder = () => {
        setOrder(cards.map((_, i) => i));
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleFlip();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goNext, goPrev]);

    useEffect(() => {
        if (!activityId || total === 0) return;
        const percent = Math.round(((currentIndex + 1) / total) * 100);
        void saveActivityProgress(activityId, percent, percent >= 100 ? "completed" : "in_progress");
    }, [activityId, currentIndex, total]);

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 touch-manipulation">
            {/* Controls & Settings */}
            <div className="mb-6">
                <div className="bg-white rounded-2xl shadow-md border-2 border-[var(--color-border)] p-3 sm:p-4 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="text-base sm:text-lg font-bold text-[var(--color-text)] flex items-center gap-1">
                            <span>Card</span>
                            <span className="text-[var(--color-primary)] text-xl sm:text-2xl">{currentIndex + 1}</span>
                            <span className="text-[var(--color-text-muted)]">/</span>
                            <span className="text-[var(--color-text-muted)]">{total}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={shuffleOrder}
                                className={`p-3 rounded-xl bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] transition-all text-[var(--color-text)] hover:text-[var(--color-primary)] min-h-[44px] min-w-[44px] ${isShuffling ? "animate-spin" : ""}`}
                                title="Shuffle Cards"
                            >
                                <ShuffleIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={resetOrder}
                                className="p-3 rounded-xl bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] transition-all text-[var(--color-text)] hover:text-[var(--color-primary)] min-h-[44px] min-w-[44px]"
                                title="Reset Order"
                            >
                                <RefreshCwIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center bg-[var(--color-bg-light)] rounded-xl p-1.5 border border-[var(--color-border)] shadow-sm">
                            <button
                                onClick={() => { setMode("term-first"); setIsFlipped(false); }}
                                className={`px-4 sm:px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 min-h-[40px] whitespace-nowrap ${mode === "term-first" ? "!bg-[var(--color-primary)] !text-white shadow-lg" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white"}`}
                            >
                                Term First
                            </button>
                            <button
                                onClick={() => { setMode("def-first"); setIsFlipped(false); }}
                                className={`px-4 sm:px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 min-h-[40px] whitespace-nowrap ${mode === "def-first" ? "!bg-[var(--color-primary)] !text-white shadow-lg" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white"}`}
                            >
                                Definition First
                            </button>
                        </div>

                        <label className="flex items-center justify-center gap-2 sm:gap-3 cursor-pointer bg-white px-4 sm:px-5 py-2.5 rounded-xl border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)] transition-all min-h-[40px]">
                            <input
                                type="checkbox"
                                checked={showExample}
                                onChange={(e) => setShowExample(e.target.checked)}
                                className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 cursor-pointer"
                            />
                            <span className="text-sm font-bold text-[var(--color-text)]">Show Example</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 sm:h-2.5 w-full bg-[var(--color-bg-light)] rounded-full mb-6 overflow-hidden shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
            </div>

            {/* Card Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] max-h-[65vh] perspective-1000 group cursor-pointer mb-6" onClick={handleFlip}>
                {/* The Card Inner wrapper that rotates */}
                <div
                    className={`relative w-full h-full duration-500 transform-style-3d transition-transform ease-in-out ${isFlipped ? "rotate-y-180" : ""
                        }`}
                >
                    {/* Front Face */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                        <CardFace
                            content={currentFront}
                            variant="front"
                            theme="light" // Term side usually cleaner
                        />
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <CardFace
                            content={currentBack}
                            variant="back"
                            theme="colored" // Definition side colored, per user images and theme request
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Controls - Below card */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[var(--color-border)] shadow-lg hover:shadow-xl hover:bg-[var(--color-bg-light)] hover:border-[var(--color-primary)] text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 min-h-[56px] min-w-[56px] active:scale-95"
                    aria-label="Previous card"
                >
                    <ChevronLeftIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                    className="px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-[var(--color-text)] text-white font-bold shadow-xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-[var(--color-text)] focus:ring-offset-2 min-h-[56px] active:scale-95"
                >
                    {isFlipped ? "Flip Back" : "Flip Card"}
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[var(--color-border)] shadow-lg hover:shadow-xl hover:bg-[var(--color-bg-light)] hover:border-[var(--color-primary)] text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 min-h-[56px] min-w-[56px] active:scale-95"
                    aria-label="Next card"
                >
                    <ChevronRightIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
            </div>

            <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
        </div>
    );
}

// Subcomponent for Card Face to reduce duplication
function CardFace({ content, variant, theme }: { content: { type: string; text: string; example?: string | null }; variant: "front" | "back"; theme: "light" | "colored" }) {

    // Theme classes based on user request for "oranges, greens, etc"
    // Using globals: --color-bg (whiteish), --color-primary (terracotta), --color-secondary (sage)

    const containerClasses = theme === "colored"
        // Back/Colored theme (Sage Green Background)
        ? "bg-[var(--color-secondary)] text-white shadow-2xl border-2 border-[var(--color-secondary)]"
        // Front/Light theme (White Background)
        : "bg-white text-[var(--color-text)] shadow-2xl border-2 border-[var(--color-border)]";

    const labelClasses = theme === "colored"
        ? "bg-white/25 text-white backdrop-blur-sm border border-white/40"
        : "bg-[var(--color-bg-light)] text-[var(--color-text-muted)] border border-[var(--color-border)]";

    const titleClasses = theme === "colored"
        ? "text-white"
        : "text-[var(--color-text)]";

    return (
        <div className={`h-full w-full rounded-3xl flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 transition-all ${containerClasses}`}>
            {/* Top Label */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                <span className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm ${labelClasses}`}>
                    {content.type}
                </span>
            </div>

            {/* Content */}
            <div className="text-center w-full max-w-3xl flex flex-col gap-4 sm:gap-6">
                <h3 className={`text-2xl sm:text-4xl md:text-5xl font-bold leading-tight font-display ${titleClasses}`}>
                    {content.text}
                </h3>

                {/* Example Section */}
                {content.example && (
                    <div className={`mt-2 sm:mt-4 pt-4 sm:pt-6 border-t-2 ${theme === "colored" ? "border-white/30" : "border-[var(--color-border)]"}`}>
                        <p className={`text-base sm:text-lg md:text-xl italic leading-relaxed ${theme === "colored" ? "text-white/95" : "text-[var(--color-text-muted)]"}`}>
                            "{content.example}"
                        </p>
                    </div>
                )}
            </div>

            {/* Click Hint */}
            <div className="absolute bottom-4 sm:bottom-6 text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-40">
                {variant === "front" ? "Tap to Flip" : ""}
            </div>
        </div>
    );
}

// Icons
function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );
}

function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );
}

function ShuffleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M16 3h5v5" />
            <path d="M4 20L21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
        </svg>
    );
}

function RefreshCwIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
        </svg>
    )
}
