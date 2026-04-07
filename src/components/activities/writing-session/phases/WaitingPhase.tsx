"use client";

interface WaitingPhaseProps {
    // Group info is only available between rounds (round 2+), not in the lobby
    groupName?: string;
    groupEmoji?: string;
    groupColor?: string;
    roundNumber: number;
}

const PRIMARY = "#d97757";

export function WaitingPhase({ groupName, groupEmoji, groupColor, roundNumber }: WaitingPhaseProps) {
    const isLobby = !groupName;
    const color = groupColor ?? PRIMARY;

    return (
        <>
            <style>{`
                @keyframes ripple-out {
                    0%   { transform: scale(0.9); opacity: 0.45; }
                    100% { transform: scale(2.6); opacity: 0; }
                }
                @keyframes wp-bounce {
                    0%, 100% { transform: translateY(0); }
                    50%       { transform: translateY(-6px); }
                }
                .wr-ring-a { animation: ripple-out 2.6s ease-out infinite; }
                .wr-ring-b { animation: ripple-out 2.6s ease-out infinite 0.85s; }
                .wr-ring-c { animation: ripple-out 2.6s ease-out infinite 1.7s; }
            `}</style>

            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-9 text-center px-4">
                {/* Pulsing avatar */}
                <div className="relative flex items-center justify-center w-32 h-32">
                    <div className="wr-ring-a absolute w-32 h-32 rounded-full" style={{ backgroundColor: color + "40" }} />
                    <div className="wr-ring-b absolute w-32 h-32 rounded-full" style={{ backgroundColor: color + "40" }} />
                    <div className="wr-ring-c absolute w-32 h-32 rounded-full" style={{ backgroundColor: color + "40" }} />
                    <div
                        className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-xl"
                        style={{
                            backgroundColor: color + "28",
                            border: `3px solid ${color}`,
                        }}
                    >
                        {isLobby ? "✏️" : groupEmoji}
                    </div>
                </div>

                {isLobby ? (
                    /* Lobby state — group not revealed yet */
                    <div className="space-y-2">
                        <p className="text-xs font-medium tracking-[0.22em] uppercase text-gray-400">
                            you&apos;re checked in
                        </p>
                        <h2
                            className="text-4xl font-display font-bold tracking-tight leading-none"
                            style={{ color }}
                        >
                            Ready to write!
                        </h2>
                        <p className="font-handwritten text-xl mt-1 text-gray-400">
                            Your group will be revealed when the round starts
                        </p>
                    </div>
                ) : (
                    /* Between-rounds state — group is known */
                    <div className="space-y-1.5">
                        <p className="text-xs font-medium tracking-[0.22em] uppercase text-gray-400">
                            you are the
                        </p>
                        <h2
                            className="text-5xl font-display font-bold tracking-tight leading-none"
                            style={{ color }}
                        >
                            {groupName}
                        </h2>
                        {roundNumber > 0 && (
                            <p className="font-handwritten text-xl mt-1 text-gray-400">
                                Round {roundNumber + 1} coming up…
                            </p>
                        )}
                    </div>
                )}

                {/* Waiting dots */}
                <div className="flex flex-col items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="inline-block w-2 h-2 rounded-full animate-bounce"
                                style={{ backgroundColor: color, animationDelay: `${i * 150}ms` }}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-400">Waiting for your teacher to start…</p>
                </div>
            </div>
        </>
    );
}
