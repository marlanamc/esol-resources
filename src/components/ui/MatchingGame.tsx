import { useState, useEffect, useMemo } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";

interface MatchPair {
    id: number;
    term: string;
    definition: string;
}

interface ShuffledItem {
    id: number;
    text: string;
    originalId: number; // Links back to the pair
}

interface Props {
    contentStr: string;
    activityId?: string;
}

export default function MatchingGame({ contentStr, activityId }: Props) {
    // Memoize pairs to prevent recalculation on every render
    const pairs = useMemo(() => parsePairs(contentStr), [contentStr]);

    const [terms, setTerms] = useState<ShuffledItem[]>([]);
    const [definitions, setDefinitions] = useState<ShuffledItem[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
    const [selectedDef, setSelectedDef] = useState<number | null>(null);
    const [matches, setMatches] = useState<Map<number, number>>(new Map());
    const [incorrect, setIncorrect] = useState<Set<string>>(new Set());
    const [isComplete, setIsComplete] = useState(false);

    const progress = pairs.length ? Math.round((matches.size / pairs.length) * 100) : 0;

    useEffect(() => {
        if (!activityId || pairs.length === 0) return;
        const progress = Math.round((matches.size / pairs.length) * 100);
        void saveActivityProgress(activityId, progress, progress >= 100 ? "completed" : "in_progress");
    }, [activityId, matches, pairs.length]);

    // Inject shake animation styles and mobile improvements
    useEffect(() => {
        const styleId = 'matching-game-shake-styles';
        if (document.getElementById(styleId)) return; // Already injected

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
            .animate-shake {
                animation: shake 0.5s;
            }
            .touch-manipulation {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
        `;
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    // Initialize shuffled items only when pairs change
    useEffect(() => {
        if (pairs.length === 0) return;

        const shuffledTerms = pairs
            .map((pair, idx) => ({ id: idx, text: pair.term, originalId: pair.id }))
            .sort(() => Math.random() - 0.5);

        const shuffledDefs = pairs
            .map((pair, idx) => ({ id: idx + 100, text: pair.definition, originalId: pair.id }))
            .sort(() => Math.random() - 0.5);

        setTerms(shuffledTerms);
        setDefinitions(shuffledDefs);
    }, [pairs]); // Only re-run when pairs changes

    const handleTermClick = (id: number) => {
        if (matches.has(id)) return; // Already matched

        if (selectedTerm === id) {
            setSelectedTerm(null); // Deselect
        } else {
            setSelectedTerm(id);
            // If a definition is already selected, try to match
            if (selectedDef !== null) {
                tryMatch(id, selectedDef);
            }
        }
    };

    const handleDefClick = (id: number) => {
        // Check if this definition is already matched
        const isMatched = Array.from(matches.values()).includes(id);
        if (isMatched) return;

        if (selectedDef === id) {
            setSelectedDef(null); // Deselect
        } else {
            setSelectedDef(id);
            // If a term is already selected, try to match
            if (selectedTerm !== null) {
                tryMatch(selectedTerm, id);
            }
        }
    };

    const tryMatch = (termId: number, defId: number) => {
        const term = terms.find(t => t.id === termId);
        const def = definitions.find(d => d.id === defId);

        if (!term || !def) return;

        // Check if they match
        if (term.originalId === def.originalId) {
            // Correct match!
            setMatches(new Map(matches).set(termId, defId));
            setSelectedTerm(null);
            setSelectedDef(null);

            // Check if all matched
            if (matches.size + 1 === pairs.length) {
                setIsComplete(true);
            }
        } else {
            // Incorrect match
            const key = `${termId}-${defId}`;
            setIncorrect(new Set(incorrect).add(key));
            setTimeout(() => {
                setIncorrect(new Set(Array.from(incorrect).filter(k => k !== key)));
                setSelectedTerm(null);
                setSelectedDef(null);
            }, 1000);
        }
    };

    const handleReset = () => {
        setMatches(new Map());
        setSelectedTerm(null);
        setSelectedDef(null);
        setIncorrect(new Set());
        setIsComplete(false);

        // Re-shuffle
        setTerms([...terms].sort(() => Math.random() - 0.5));
        setDefinitions([...definitions].sort(() => Math.random() - 0.5));
    };

    if (pairs.length === 0) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <p className="text-gray-500">No matching pairs available.</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:max-w-6xl md:mx-auto md:px-3 md:py-4">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-gray-200 p-3 md:p-4">
                <div className="flex items-start gap-3">
                    {/* Back button - only on mobile */}
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors md:hidden touch-manipulation"
                        aria-label="Go back"
                    >
                        <XIcon className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">
                                Match Terms to Definitions
                            </h2>
                            <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                <span className="text-green-600 font-bold">{matches.size}</span> / {pairs.length} matched
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                            Tap a term, then tap its matching definition.
                        </p>
                        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Matching Grid - Horizontal scroll on mobile, side-by-side on desktop */}
            <div className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain md:overflow-visible px-3 py-4 md:px-0 md:py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="flex md:grid md:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6 min-w-max md:min-w-0">
                {/* Terms Column */}
                <div className="space-y-2 md:space-y-3 w-[90vw] md:w-auto flex-shrink-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
                        Terms
                    </h3>
                    {terms.map((term) => {
                        const isMatched = matches.has(term.id);
                        const isSelected = selectedTerm === term.id;
                        const isShaking = Array.from(incorrect).some(key => key.startsWith(`${term.id}-`));

                        return (
                            <button
                                key={term.id}
                                onClick={() => handleTermClick(term.id)}
                                disabled={isMatched}
                                className={`w-full min-h-[56px] md:min-h-[64px] p-3 md:p-4 rounded-xl border-2 font-medium text-left transition-all touch-manipulation active:scale-[0.98] ${isMatched
                                    ? "bg-green-50 border-green-400 text-green-900 opacity-60 cursor-not-allowed ring-2 ring-yellow-300 ring-opacity-50"
                                    : isSelected
                                        ? "!bg-yellow-400 !border-yellow-500 border-[3px] text-gray-900 shadow-lg scale-[1.02] font-bold"
                                        : "bg-white border-gray-300 text-gray-900 active:border-yellow-400 active:shadow-md"
                                    } ${isShaking ? "animate-shake" : ""}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm md:text-base lg:text-lg break-words flex-1">{term.text}</span>
                                    {isMatched && <span className="text-green-600 text-xl md:text-2xl flex-shrink-0">✓</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Definitions Column */}
                <div className="space-y-2 md:space-y-3 w-[90vw] md:w-auto flex-shrink-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2 md:mb-3">
                        Definitions
                    </h3>
                    {definitions.map((def) => {
                        const isMatched = Array.from(matches.values()).includes(def.id);
                        const isSelected = selectedDef === def.id;
                        const isShaking = Array.from(incorrect).some(key => key.endsWith(`-${def.id}`));

                        return (
                            <button
                                key={def.id}
                                onClick={() => handleDefClick(def.id)}
                                disabled={isMatched}
                                className={`w-full min-h-[56px] md:min-h-[64px] p-3 md:p-4 rounded-xl border-2 font-medium text-left transition-all touch-manipulation active:scale-[0.98] ${isMatched
                                    ? "bg-green-50 border-green-400 text-green-900 opacity-60 cursor-not-allowed ring-2 ring-yellow-300 ring-opacity-50"
                                    : isSelected
                                        ? "!bg-yellow-400 !border-yellow-500 border-[3px] text-gray-900 shadow-lg scale-[1.02] font-bold"
                                        : "bg-white border-gray-300 text-gray-900 active:border-yellow-400 active:shadow-md"
                                    } ${isShaking ? "animate-shake" : ""}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm md:text-base break-words flex-1">{def.text}</span>
                                    {isMatched && <span className="text-green-600 text-xl md:text-2xl flex-shrink-0">✓</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

                {/* Completion Message */}
                {isComplete && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-xl mb-4 md:mb-6 mx-3 md:mx-0">
                        <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎉</div>
                        <h2 className="text-2xl md:text-4xl font-bold mb-2">Perfect Match!</h2>
                        <p className="text-base md:text-xl text-white/90">
                            You've matched all {pairs.length} terms correctly!
                        </p>
                    </div>
                )}

                {/* Reset Button */}
                <div className="flex justify-center px-3 md:px-0 pb-4 md:pb-0">
                    <button
                        onClick={handleReset}
                        className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg active:bg-gray-900 hover:bg-gray-800 transition-all shadow-lg active:shadow-xl touch-manipulation text-base md:text-sm"
                    >
                        Reset & Shuffle
                    </button>
                </div>
            </div>
        </div>
    );
}

// XIcon component
function XIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}

// Parse content into matching pairs
function parsePairs(content: string): MatchPair[] {
    const pairs: MatchPair[] = [];
    const lines = content.trim().split("\n").filter(l => l.trim());

    let id = 1;
    for (const line of lines) {
        if (line.includes("::")) {
            const [term, definition] = line.split("::").map(s => s.trim());
            if (term && definition) {
                pairs.push({ id: id++, term, definition });
            }
        }
    }

    return pairs;
}
