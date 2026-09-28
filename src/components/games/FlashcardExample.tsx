/** Emphasize exact vocabulary words/phrases without matching inside other words. */
export function FlashcardExample({ example, term }: { example: string; term: string }) {
    const cleanTerm = term.trim();
    if (!cleanTerm) return <>{example}</>;
    const escaped = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const matches = new RegExp(`(?<![\\p{L}\\p{N}_])(${escaped})(?![\\p{L}\\p{N}_])`, "giu");
    return <>{example.split(matches).map((part, index) => index % 2 === 1
        ? <strong key={index} className="font-bold">{part}</strong>
        : part)}</>;
}
