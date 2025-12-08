import { useState, useEffect, useMemo } from "react";

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
}

export default function MatchingGame({ contentStr }: Props) {
    // Memoize pairs to prevent recalculation on every render
    const pairs = useMemo(() => parsePairs(contentStr), [contentStr]);

    const [terms, setTerms] = useState<ShuffledItem[]>([]);
    const [definitions, setDefinitions] = useState<ShuffledItem[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
    const [selectedDef, setSelectedDef] = useState<number | null>(null);
    const [matches, setMatches] = useState<Map<number, number>>(new Map());
    const [incorrect, setIncorrect] = useState<Set<string>>(new Set());
    const [isComplete, setIsComplete] = useState(false);

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
        <div className="max-w-6xl mx-auto px-4 py-4">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Match the Terms to Their Definitions</h2>
                    <div className="text-sm font-medium text-gray-600">
                        Matched: <span className="text-green-600 font-bold">{matches.size}</span> / {pairs.length}
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Click a term, then click its matching definition. All matches must be correct!
                </p>
            </div>

            {/* Matching Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Terms Column */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Terms</h3>
                    {terms.map((term) => {
                        const isMatched = matches.has(term.id);
                        const isSelected = selectedTerm === term.id;
                        const isShaking = Array.from(incorrect).some(key => key.startsWith(`${term.id}-`));

                        return (
                            <button
                                key={term.id}
                                onClick={() => handleTermClick(term.id)}
                                disabled={isMatched}
                                className={`w-full p-4 rounded-xl border-2 font-medium text-left transition-all ${isMatched
                                    ? "bg-green-50 border-green-400 text-green-900 opacity-50 cursor-not-allowed"
                                    : isSelected
                                        ? "!bg-orange-600 !border-orange-700 border-[3px] text-white shadow-xl scale-105 font-bold"
                                        : "bg-white border-gray-300 text-gray-900 hover:border-orange-400 hover:shadow-md"
                                    } ${isShaking ? "animate-shake" : ""}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-lg">{term.text}</span>
                                    {isMatched && <span className="text-green-600 text-xl">✓</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Definitions Column */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Definitions</h3>
                    {definitions.map((def) => {
                        const isMatched = Array.from(matches.values()).includes(def.id);
                        const isSelected = selectedDef === def.id;
                        const isShaking = Array.from(incorrect).some(key => key.endsWith(`-${def.id}`));

                        return (
                            <button
                                key={def.id}
                                onClick={() => handleDefClick(def.id)}
                                disabled={isMatched}
                                className={`w-full p-4 rounded-xl border-2 font-medium text-left transition-all ${isMatched
                                    ? "bg-green-50 border-green-400 text-green-900 opacity-50 cursor-not-allowed"
                                    : isSelected
                                        ? "!bg-orange-600 !border-orange-700 border-[3px] text-white shadow-xl scale-105 font-bold"
                                        : "bg-white border-gray-300 text-gray-900 hover:border-orange-400 hover:shadow-md"
                                    } ${isShaking ? "animate-shake" : ""}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-base">{def.text}</span>
                                    {isMatched && <span className="text-green-600 text-xl">✓</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Completion Message */}
            {isComplete && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl mb-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-4xl font-bold mb-2">Perfect Match!</h2>
                    <p className="text-xl text-white/90">
                        You've matched all {pairs.length} terms correctly!
                    </p>
                </div>
            )}

            {/* Reset Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl"
                >
                    Reset & Shuffle
                </button>
            </div>

            <style jsx>{`
                        @keyframes shake {
                            0 %, 100 % { transform: translateX(0); }
                            25 % { transform: translateX(-10px); }
                            75 % { transform: translateX(10px); }
                        }
        .animate - shake {
                        animation: shake 0.5s;
        }
      `}</style>
        </div>
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
