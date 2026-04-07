"use client";

interface ResultsPhaseProps {
    classWinner: { text: string; groupName: string; groupEmoji: string } | null;
    myGroupName: string;
    isFinished: boolean;
    isGroupWinner?: boolean;
}

const CONFETTI_COLORS = ["#d97757", "#f4d35e", "#7ba884", "#d97757", "#f4d35e", "#7ba884"];

export function ResultsPhase({ classWinner, myGroupName, isFinished, isGroupWinner }: ResultsPhaseProps) {
    const wonClass = classWinner?.groupName === myGroupName;

    return (
        <>
            <style>{`
                @keyframes rp-confetti {
                    0%   { transform: translateY(0px) rotate(0deg) scale(1); opacity: 1; }
                    100% { transform: translateY(-80px) rotate(540deg) scale(0.5); opacity: 0; }
                }
                @keyframes rp-glow {
                    0%, 100% { box-shadow: 0 0 18px rgba(244,211,94,0.25), 0 4px 24px rgba(0,0,0,0.07); }
                    50%       { box-shadow: 0 0 40px rgba(244,211,94,0.55), 0 4px 24px rgba(0,0,0,0.07); }
                }
                @keyframes rp-fadein {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .rp-confetti-dot { animation: rp-confetti 1.4s ease-out forwards; }
                .rp-winner-card  { animation: rp-glow 2.2s ease-in-out infinite; }
                .rp-fadein       { animation: rp-fadein 0.5s ease-out both; }
            `}</style>

            <div className="max-w-2xl mx-auto space-y-6 px-1 py-4">
                {classWinner ? (
                    <>
                        {/* Result header */}
                        <div className="text-center space-y-2 pt-2 relative rp-fadein">
                            {wonClass && (
                                <div className="absolute inset-x-0 top-0 pointer-events-none overflow-visible">
                                    {CONFETTI_COLORS.map((color, i) => (
                                        <span
                                            key={i}
                                            className="rp-confetti-dot absolute w-2.5 h-2.5 rounded-sm"
                                            style={{
                                                backgroundColor: color,
                                                left: `${8 + i * 16}%`,
                                                top: "0%",
                                                animationDelay: `${i * 0.12}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="text-5xl leading-none mb-2">
                                {wonClass ? "🎉" : "🏆"}
                            </div>
                            <h2 className="text-3xl font-display font-bold text-[var(--text)]">
                                {wonClass
                                    ? "Your group won!"
                                    : `${classWinner.groupEmoji} ${classWinner.groupName} win!`}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {wonClass
                                    ? "The class voted for your writing!"
                                    : `The class voted for the ${classWinner.groupName}.`}
                            </p>
                        </div>

                        {/* Group winner recognition (runner-up) */}
                        {!wonClass && isGroupWinner && (
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold rp-fadein"
                                style={{
                                    backgroundColor: "#7ba88420",
                                    color: "#7ba884",
                                    border: "1.5px solid #7ba88450",
                                    animationDelay: "0.1s",
                                }}
                            >
                                🌟 Your writing was voted best by your group!
                            </div>
                        )}

                        {/* Winning writing card */}
                        <div
                            className="rounded-2xl overflow-hidden border-2 rp-winner-card rp-fadein"
                            style={{
                                borderColor: "#f4d35e80",
                                backgroundColor: "#fffef8",
                                animationDelay: "0.15s",
                            }}
                        >
                            <div
                                className="px-4 py-2.5 flex items-center gap-2"
                                style={{
                                    backgroundColor: "#f4d35e1a",
                                    borderBottom: "1px solid #f4d35e45",
                                }}
                            >
                                <span className="text-base">{classWinner.groupEmoji}</span>
                                <span className="text-sm font-semibold text-[var(--text)]">
                                    {classWinner.groupName}
                                </span>
                                <span className="text-xs text-amber-600 ml-auto font-medium">
                                    ✨ winning writing
                                </span>
                            </div>
                            <div className="px-5 py-5">
                                <p className="text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                                    {classWinner.text}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-400 py-16">No winner this round.</div>
                )}

                <p
                    className="text-center font-handwritten text-xl rp-fadein"
                    style={{ color: "#9ca3af", animationDelay: "0.3s" }}
                >
                    {isFinished ? "Great session! Well done everyone ✏️" : "Get ready for the next prompt…"}
                </p>
            </div>
        </>
    );
}
