"use client";

import { useState, useEffect, useCallback } from "react";

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
}

type CardMode = "term-first" | "def-first";

export default function FlashcardCarousel({ cards }: FlashcardCarouselProps) {
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

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-4">
            {/* Controls & Settings */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
                {/* Playback Controls */}
                <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-[var(--color-text-muted)] mr-4">
                        Card <span className="text-[var(--color-primary)] font-bold">{currentIndex + 1}</span> / {total}
                    </div>
                    <button
                        onClick={shuffleOrder}
                        className={`p-2 rounded-full hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)] ${isShuffling ? "animate-spin" : ""}`}
                        title="Shuffle Cards"
                    >
                        <ShuffleIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={resetOrder}
                        className="p-2 rounded-full hover:bg-[var(--color-bg-light)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                        title="Reset Order"
                    >
                        <RefreshCwIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters / Toggles */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                        <button
                            onClick={() => { setMode("term-first"); setIsFlipped(false); }}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === "term-first" ? "!bg-[#f97316] !text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
                        >
                            Term First
                        </button>
                        <button
                            onClick={() => { setMode("def-first"); setIsFlipped(false); }}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === "def-first" ? "!bg-[#f97316] !text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
                        >
                            Definition First
                        </button>
                    </div>

                    {/* Content Checkbox */}
                    <label className="flex items-center space-x-2 cursor-pointer text-sm text-[var(--color-text)] font-medium">
                        <input
                            type="checkbox"
                            checked={showExample}
                            onChange={(e) => setShowExample(e.target.checked)}
                            className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span>Show Example</span>
                    </label>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-[var(--color-border)] rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-[var(--color-primary)] transition-all duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
            </div>

            {/* Navigation Controls - Moved above card */}
            <div className="flex items-center justify-center mb-4 space-x-6">
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="p-4 rounded-full bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md hover:bg-[var(--color-bg-light)] text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                    aria-label="Previous card"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                    className="px-8 py-3 rounded-full bg-[var(--color-text)] text-white font-medium shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-2 min-w-[160px]"
                >
                    {isFlipped ? "Flip Back" : "Flip Card"}
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="p-4 rounded-full bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md hover:bg-[var(--color-bg-light)] text-[var(--color-text)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                    aria-label="Next card"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Card Container */}
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-1000 group cursor-pointer" onClick={handleFlip}>
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
        ? "bg-[var(--color-secondary)] text-white shadow-[0_8px_30px_rgb(110,145,118,0.25)] border-transparent"
        // Front/Light theme (White Background) 
        : "bg-white text-[var(--color-text)] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[var(--color-border)]";

    const labelClasses = theme === "colored"
        ? "bg-white/20 text-white backdrop-blur-sm"
        : "bg-[var(--color-bg-light)] text-[var(--color-text-muted)]";

    const titleClasses = theme === "colored"
        ? "text-white"
        : "text-[var(--color-text)]";

    return (
        <div className={`h-full w-full rounded-2xl flex flex-col items-center justify-center p-8 md:p-12 hover:shadow-xl transition-shadow ${containerClasses}`}>
            {/* Top Label */}
            <div className="absolute top-6 left-6">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${labelClasses}`}>
                    {content.type}
                </span>
            </div>

            {/* Content */}
            <div className="text-center w-full max-w-3xl flex flex-col gap-6">
                <h3 className={`text-3xl md:text-5xl font-bold leading-tight ${titleClasses}`}>
                    {content.text}
                </h3>

                {/* Example Section */}
                {content.example && (
                    <div className={`mt-4 pt-4 border-t ${theme === "colored" ? "border-white/20" : "border-[var(--color-border)]"}`}>
                        <p className={`text-lg md:text-xl italic ${theme === "colored" ? "text-white/90" : "text-[var(--color-text-muted)]"}`}>
                            "{content.example}"
                        </p>
                    </div>
                )}
            </div>

            {/* Click Hint */}
            <div className="absolute bottom-6 text-xs font-semibold tracking-widest uppercase opacity-50">
                {variant === "front" ? "Click to Flip" : ""}
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
