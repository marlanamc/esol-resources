"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, BookOpen, MessageCircle, Target, Maximize2, Minimize2, Play, Pause, RotateCcw, Plus, Trophy, Shuffle, Settings, ArrowLeft } from "lucide-react";
import { getRotationForSegmentCenter, normalizeDegrees } from "./emotionSpinWheelGeometry";

interface EmotionData {
    word: string;
    wheelLabel: string;
    category: "positive" | "neutral" | "negative";
    color: string;
    definition: string;
    exampleSentence: string;
    prompts: string[];
}

const EMOTIONS: EmotionData[] = [
    {
        word: "happy",
        wheelLabel: "happy",
        category: "positive",
        color: "#d4edda",
        definition: "Feeling very good and full of joy.",
        exampleSentence: "I feel happy when I spend time with my family.",
        prompts: [
            "Tell about a time you felt really happy at work or school.",
            "What is one thing that makes you feel happy every day?",
            "What makes people feel happy in a new country?",
            "Describe your happiest memory in one or two sentences.",
            "What helps you stay happy when things are difficult?",
            "Who in your life makes you feel the most happy? Why?",
        ],
    },
    {
        word: "excited",
        wheelLabel: "excited",
        category: "positive",
        color: "#fff3cd",
        definition: "Feeling very happy and eager about something that is going to happen.",
        exampleSentence: "I feel excited when I have a new opportunity.",
        prompts: [
            "Tell about a time you felt excited about something new.",
            "What made you feel excited when you first came to this country?",
            "What things make people feel excited at work?",
            "Describe a time you were excited and things turned out well.",
            "How do you show excitement? What do you say or do?",
            "When was the last time you felt excited? What happened?",
        ],
    },
    {
        word: "proud",
        wheelLabel: "proud",
        category: "positive",
        color: "#c3e6cb",
        definition: "Feeling very pleased with yourself or someone else for doing something well.",
        exampleSentence: "I feel proud when I learn something difficult.",
        prompts: [
            "Tell about a time you felt proud of yourself.",
            "What is something you worked hard to do? How did it feel?",
            "What makes parents feel proud of their children?",
            "What would make you feel proud this year?",
            "When was the last time someone else made you feel proud of them?",
        ],
    },
    {
        word: "peaceful",
        wheelLabel: "peaceful",
        category: "positive",
        color: "#ffeeba",
        definition: "Feeling calm and quiet, without worry or stress.",
        exampleSentence: "I feel peaceful when I sit outside in the morning.",
        prompts: [
            "Tell about a place or activity that makes you feel peaceful.",
            "What helps you find peace after a hard day?",
            "Why is it important for people to have peaceful moments?",
            "What sounds or places make you feel most peaceful?",
            "How can you create a more peaceful morning routine?",
        ],
    },
    {
        word: "accepted",
        wheelLabel: "accepted",
        category: "positive",
        color: "#d1ecf1",
        definition: "Feeling like you belong and that others welcome you.",
        exampleSentence: "I feel accepted when my coworkers include me in conversations.",
        prompts: [
            "Tell about a time you felt accepted by a group.",
            "What did someone do or say that made you feel accepted?",
            "Why is feeling accepted important at work or school?",
            "What can you do to help someone else feel accepted?",
            "When do people often feel they don't belong? What helps?",
            "Describe a place where you always feel accepted.",
        ],
    },
    {
        word: "tired",
        wheelLabel: "tired",
        category: "neutral",
        color: "#cce5ff",
        definition: "Feeling like you need to rest because you have done too much.",
        exampleSentence: "I feel tired when I work late and don't sleep enough.",
        prompts: [
            "Tell about a time you felt very tired. What helped?",
            "What makes you feel tired quickly?",
            "What do people do when they feel tired at work?",
            "How can you take care of yourself when you are tired?",
            "What is the difference between being tired in your body and tired in your mind?",
        ],
    },
    {
        word: "busy",
        wheelLabel: "busy",
        category: "neutral",
        color: "#e2d9f3",
        definition: "Having a lot of things to do and not much free time.",
        exampleSentence: "I feel busy when I have work, class, and family responsibilities.",
        prompts: [
            "Tell about your busiest day. How did you manage?",
            "What do you do when you feel too busy?",
            "Why do people sometimes feel proud of being busy?",
            "What is one thing you could stop doing to feel less busy?",
            "When does feeling busy become a problem?",
        ],
    },
    {
        word: "bored",
        wheelLabel: "bored",
        category: "neutral",
        color: "#d6ecf3",
        definition: "Feeling uninterested because you have nothing exciting to do.",
        exampleSentence: "I feel bored when I wait a long time and have nothing to read.",
        prompts: [
            "Tell about a time you felt bored. What did you do?",
            "What activities never make you feel bored?",
            "Why do students sometimes feel bored in class?",
            "What is one thing you can do when you feel bored at home?",
            "Is it ever good to feel bored? Why or why not?",
        ],
    },
    {
        word: "stressed",
        wheelLabel: "stressed",
        category: "negative",
        color: "#f8d7da",
        definition: "Feeling worried and tense because you have too many problems or too much to do.",
        exampleSentence: "I feel stressed when I have many deadlines at the same time.",
        prompts: [
            "Tell about a time you felt very stressed. What happened?",
            "What are the biggest causes of stress in your life?",
            "What makes workers feel stressed on the job?",
            "What is one thing that helps you feel less stressed?",
            "How does your body feel when you are stressed?",
            "What advice would you give a friend who feels stressed?",
        ],
    },
    {
        word: "confused",
        wheelLabel: "confused",
        category: "neutral",
        color: "#d9d2f5",
        definition: "Not being able to understand something clearly.",
        exampleSentence: "I feel confused when I read instructions with many steps.",
        prompts: [
            "Tell about a time you felt confused. How did you get help?",
            "What do you do when you feel confused at work or school?",
            "Why do people sometimes feel confused in a new country?",
            "What is the best way to ask for help when you are confused?",
            "When was the last time you felt confused? Did you figure it out?",
        ],
    },
    {
        word: "nervous",
        wheelLabel: "nervous",
        category: "negative",
        color: "#fde8d4",
        definition: "Feeling worried and a little scared about something that might happen.",
        exampleSentence: "I feel nervous when I speak English in front of many people.",
        prompts: [
            "Tell about a time you felt nervous. How did you handle it?",
            "What situations make you feel most nervous?",
            "Why do many people feel nervous during job interviews?",
            "What helps you calm down when you feel nervous?",
            "Is feeling nervous always bad? Can it help you?",
            "When was the last time you felt nervous about something?",
        ],
    },
    {
        word: "lonely",
        wheelLabel: "lonely",
        category: "negative",
        color: "#f5c6cb",
        definition: "Feeling sad because you are alone or don't have friends or family nearby.",
        exampleSentence: "I feel lonely when I am far from my family.",
        prompts: [
            "Tell about a time you felt lonely. What helped?",
            "What situations often make people feel lonely?",
            "Why do people sometimes feel lonely even in a crowd?",
            "What is one thing you can do when you feel lonely?",
            "How can communities help people who feel lonely?",
            "What would you say to a friend who tells you they feel lonely?",
        ],
    },
    {
        word: "disappointed",
        wheelLabel: "disappoint",
        category: "negative",
        color: "#ffdab3",
        definition: "Feeling sad because something did not happen the way you hoped.",
        exampleSentence: "I feel disappointed when I work hard but don't get the result I wanted.",
        prompts: [
            "Tell about a time you felt disappointed. What did you learn?",
            "What do you do to feel better after a disappointment?",
            "Why is it important to talk about feeling disappointed?",
            "How do children feel disappointed differently than adults?",
            "When was the last time something made you feel disappointed?",
        ],
    },
    {
        word: "angry",
        wheelLabel: "angry",
        category: "negative",
        color: "#f9c5c8",
        definition: "Feeling very upset or mad about something that happened.",
        exampleSentence: "I feel angry when I am treated unfairly.",
        prompts: [
            "Tell about a time you felt angry. How did you handle it?",
            "What things make you feel angry?",
            "What is a healthy way to deal with angry feelings?",
            "Why is it important not to act when you are very angry?",
            "How do you know when someone else is feeling angry?",
            "What do you do to calm down when you feel angry?",
        ],
    },
    {
        word: "frustrated",
        wheelLabel: "frustrated",
        category: "negative",
        color: "#ffe5cc",
        definition: "Feeling annoyed and upset because something is not working or not going the way you want.",
        exampleSentence: "I feel frustrated when I try to explain something and people don't understand me.",
        prompts: [
            "Tell about a time you felt frustrated at work or school.",
            "What things cause frustration for English language learners?",
            "What is the difference between frustrated and angry?",
            "What do you do when you feel frustrated with a task?",
            "When was the last time you felt frustrated? Did the situation improve?",
        ],
    },
    {
        word: "scared",
        wheelLabel: "scared",
        category: "negative",
        color: "#f8d7da",
        definition: "Feeling afraid because something seems dangerous or threatening.",
        exampleSentence: "I feel scared when I have to go to a new place alone.",
        prompts: [
            "Tell about a time you felt scared. How did you handle it?",
            "What situations make you feel scared or unsafe?",
            "Why do many immigrants feel scared in new situations?",
            "What helps you feel brave when you are scared?",
            "How do you know when a fear is reasonable vs. too much?",
            "What would you tell a child who is scared of something?",
        ],
    },
    {
        word: "hopeful",
        wheelLabel: "hopeful",
        category: "positive",
        color: "#ddf4b5",
        definition: "Feeling like good things will happen in the future.",
        exampleSentence: "I feel hopeful when I see progress in my English.",
        prompts: [
            "Tell about something that makes you feel hopeful right now.",
            "What helps people feel hopeful during hard times?",
            "What are you most hopeful about for your future?",
            "How do you keep feeling hopeful when things are difficult?",
            "Who in your life helps you feel hopeful? What do they do?",
        ],
    },
    {
        word: "calm",
        wheelLabel: "calm",
        category: "positive",
        color: "#d1ecf1",
        definition: "Feeling relaxed and not worried or upset.",
        exampleSentence: "I feel calm when I take a few deep breaths.",
        prompts: [
            "Tell about something you do to help yourself feel calm.",
            "What places or activities make you feel the most calm?",
            "Why is it important to stay calm in a difficult situation at work?",
            "How do you help someone else feel calm when they are upset?",
            "When was the last time you felt completely calm?",
        ],
    },
];

const SENTENCE_STARTERS = [
    "I feel ___ when...",
    "People feel ___ when...",
    "Sometimes workers feel ___ because...",
    "In my culture, people feel ___ when...",
    "Children often feel ___ when...",
];

const CHALLENGE_QUESTIONS = [
    "Why?",
    "How often?",
    "Can you give an example?",
    "What helps?",
    "When was the last time?",
    "How does that make you feel now?",
];

const N = EMOTIONS.length;

function buildSegmentPath(index: number): string {
    const startAngle = ((index / N) * 2 * Math.PI) - Math.PI / 2;
    const endAngle = (((index + 1) / N) * 2 * Math.PI) - Math.PI / 2;
    const x1 = Math.cos(startAngle);
    const y1 = Math.sin(startAngle);
    const x2 = Math.cos(endAngle);
    const y2 = Math.sin(endAngle);
    return `M 0 0 L ${x1.toFixed(5)} ${y1.toFixed(5)} A 1 1 0 0 1 ${x2.toFixed(5)} ${y2.toFixed(5)} Z`;
}

function getLabelPosition(index: number): { x: number; y: number; angleDeg: number } {
    const midAngle = ((index + 0.5) / N) * 2 * Math.PI - Math.PI / 2;
    const r = 0.65;
    return {
        x: Number((Math.cos(midAngle) * r).toFixed(5)),
        y: Number((Math.sin(midAngle) * r).toFixed(5)),
        angleDeg: ((index + 0.5) / N) * 360 - 90,
    };
}

function pickPrompts(pool: string[], count: number, exclude: number[] = []): number[] {
    const available = pool.map((_, i) => i).filter((i) => !exclude.includes(i));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    if (shuffled.length >= count) return shuffled.slice(0, count);
    // If not enough after excluding, fall back to full pool shuffle
    return [...pool.map((_, i) => i)].sort(() => Math.random() - 0.5).slice(0, count);
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
    activityId: string;
    contentStr?: string;
    assignmentId?: string | null;
}

function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 4);
}

export default function EmotionSpinWheel({}: Props) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const [svgRotation, setSvgRotation] = useState(0);

    const [phase, setPhase] = useState<"wheel" | "result" | "complete">("wheel");
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentRotation, setCurrentRotation] = useState(0);
    const [landedIndex, setLandedIndex] = useState<number | null>(null);
    const [displayedPromptIndices, setDisplayedPromptIndices] = useState<number[]>([]);
    const [showDefinition, setShowDefinition] = useState(false);
    const [challengeMode, setChallengeMode] = useState(false);
    const [timerEnabled, setTimerEnabled] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(120);
    const [timerRunning, setTimerRunning] = useState(false);
    const [scoreEnabled, setScoreEnabled] = useState(false);
    const [score, setScore] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [liveAnnounce, setLiveAnnounce] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [gameModeEnabled, setGameModeEnabled] = useState(false);
    const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
    const [showSettings, setShowSettings] = useState(false);

    const segments = useMemo(() => EMOTIONS.map((_, i) => ({
        path: buildSegmentPath(i),
        label: getLabelPosition(i),
    })), []);

    useEffect(() => {
        return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
    }, []);

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    useEffect(() => {
        if (!timerRunning || timerSeconds <= 0) return;
        const id = setInterval(() => {
            setTimerSeconds((s) => {
                if (s <= 1) {
                    setTimerRunning(false);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [timerRunning, timerSeconds]);


    const handleSpin = useCallback(() => {
        if (isSpinning) return;

        // In game mode, pick only from indices not yet used
        const available = gameModeEnabled
            ? Array.from({ length: N }, (_, i) => i).filter((i) => !usedIndices.has(i))
            : Array.from({ length: N }, (_, i) => i);
        if (available.length === 0) {
            setPhase(gameModeEnabled ? "complete" : "wheel");
            return;
        }

        setIsSpinning(true);
        setPhase("wheel");

        const targetIndex = available[Math.floor(Math.random() * available.length)];

        const fullRotations = 3 + Math.floor(Math.random() * 6);
        const targetRotation = getRotationForSegmentCenter(targetIndex, N);
        const currentOffset = normalizeDegrees(currentRotation);
        const delta = normalizeDegrees(targetRotation - currentOffset);
        const endRotation = currentRotation + fullRotations * 360 + delta;
        const startRotation = currentRotation;
        const durationMs = (4 + Math.random() * 2) * 1000;
        const startTime = performance.now();

        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

        const tick = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / durationMs, 1);
            const easedT = easeOut(t);
            const current = startRotation + (endRotation - startRotation) * easedT;
            setSvgRotation(current);

            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setCurrentRotation(endRotation);
                setIsSpinning(false);
                setLandedIndex(targetIndex);
                setDisplayedPromptIndices(pickPrompts(EMOTIONS[targetIndex].prompts, 3));
                setShowDefinition(false);
                setTimerRunning(false);
                setTimerSeconds(120);
                setPhase("result");
                setLiveAnnounce(EMOTIONS[targetIndex].word);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    }, [isSpinning, currentRotation, gameModeEnabled, usedIndices]);

    const handleNewPrompts = useCallback(() => {
        if (landedIndex === null) return;
        const emotion = EMOTIONS[landedIndex];
        setDisplayedPromptIndices(pickPrompts(emotion.prompts, 3, displayedPromptIndices));
    }, [landedIndex, displayedPromptIndices]);

    const playAudio = useCallback((url: string): Promise<void> => {
        audioRef.current?.pause();
        const audio = new Audio(url);
        audioRef.current = audio;

        return new Promise((resolve, reject) => {
            const cleanup = () => {
                audio.removeEventListener("ended", onEnded);
                audio.removeEventListener("error", onError);
            };
            const onEnded = () => {
                cleanup();
                if (audioRef.current === audio) audioRef.current = null;
                resolve();
            };
            const onError = () => {
                cleanup();
                if (audioRef.current === audio) audioRef.current = null;
                reject(new Error("Audio failed"));
            };

            audio.addEventListener("ended", onEnded);
            audio.addEventListener("error", onError);
            audio.play().catch((error) => {
                cleanup();
                if (audioRef.current === audio) audioRef.current = null;
                reject(error);
            });
        });
    }, []);

    const playGeneratedTts = useCallback(async (word: string): Promise<void> => {
        const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: word }),
        });
        if (!res.ok) throw new Error("TTS failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        try {
            await playAudio(url);
        } finally {
            URL.revokeObjectURL(url);
        }
    }, [playAudio]);

    const speakWithBrowser = useCallback((word: string) => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(word);
        utter.lang = "en-US";
        utter.rate = 0.85;
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
    }, []);

    const handleSpeak = useCallback(async () => {
        if (landedIndex === null) return;
        const word = EMOTIONS[landedIndex].word;
        setIsSpeaking(true);
        try {
            const audioUrl = `/audio/emotions/${encodeURIComponent(word)}.mp3`;
            await playAudio(audioUrl);
        } catch {
            try {
                await playGeneratedTts(word);
            } catch {
                speakWithBrowser(word);
                return;
            }
        } finally {
            if (!("speechSynthesis" in window) || !window.speechSynthesis.speaking) {
                setIsSpeaking(false);
            }
        }
    }, [landedIndex, playAudio, playGeneratedTts, speakWithBrowser]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            void containerRef.current?.requestFullscreen();
        } else {
            void document.exitFullscreen();
        }
    }, []);

    const emotion = landedIndex !== null ? EMOTIONS[landedIndex] : null;

    return (
        <div
            ref={containerRef}
            className="min-h-full bg-[#fdf9f0] dark:bg-gray-900 flex flex-col"
        >
            {/* Live region for accessibility */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {liveAnnounce ? `The wheel landed on: ${liveAnnounce}` : ""}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="font-display text-lg font-semibold text-gray-800 dark:text-gray-100">How Are You Feeling? 🎡</h1>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button
                        onClick={() => setShowSettings((v) => !v)}
                        aria-label="Settings"
                        aria-expanded={showSettings}
                        className={`p-2 rounded-lg transition-colors ${
                            showSettings
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Collapsible settings panel */}
            {showSettings && (
                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-4 flex flex-col gap-3">
                    {/* Row 1: mode toggles */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setChallengeMode((v) => !v)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                challengeMode
                                    ? "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-300"
                                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            {challengeMode ? "✓ Challenge Mode" : "Easy Mode"}
                        </button>

                        <button
                            onClick={() => {
                                setTimerEnabled((v) => !v);
                                setTimerRunning(false);
                                setTimerSeconds(120);
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                timerEnabled
                                    ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-300"
                                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            {timerEnabled ? "✓ Timer On" : "Timer"}
                        </button>

                        <button
                            onClick={() => {
                                setScoreEnabled((v) => !v);
                                setScore(0);
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                scoreEnabled
                                    ? "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600 text-purple-800 dark:text-purple-300"
                                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            {scoreEnabled ? "✓ Score On" : "Score"}
                        </button>

                        <button
                            onClick={() => {
                                setGameModeEnabled((v) => !v);
                                setUsedIndices(new Set());
                                setPhase("wheel");
                                setLandedIndex(null);
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                gameModeEnabled
                                    ? "bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-600 text-rose-800 dark:text-rose-300"
                                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            {gameModeEnabled ? "✓ Game Mode" : "🎯 Game Mode"}
                        </button>

                        {gameModeEnabled && usedIndices.size > 0 && (
                            <button
                                onClick={() => {
                                    setUsedIndices(new Set());
                                    setPhase("wheel");
                                    setLandedIndex(null);
                                }}
                                className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                Reset Game
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Timer bar */}
            {timerEnabled && phase === "result" && (
                <div className="flex items-center justify-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-950/50 border-b border-blue-100 dark:border-blue-900">
                    <span className={`font-mono text-2xl font-bold tabular-nums ${timerSeconds === 0 ? "text-red-600 dark:text-red-400" : "text-blue-700 dark:text-blue-300"}`}>
                        {formatTime(timerSeconds)}
                    </span>
                    <button
                        onClick={() => setTimerRunning((v) => !v)}
                        disabled={timerSeconds === 0}
                        aria-label={timerRunning ? "Pause timer" : "Start timer"}
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 disabled:opacity-40 transition-colors"
                    >
                        {timerRunning ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                        onClick={() => { setTimerSeconds(120); setTimerRunning(false); }}
                        aria-label="Reset timer"
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 transition-colors"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            )}

            {/* Score bar */}
            {scoreEnabled && (
                <div className="flex items-center justify-center gap-3 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border-b border-purple-100 dark:border-purple-900">
                    <span className="text-purple-800 dark:text-purple-300 font-semibold">Score:</span>
                    <span className="font-mono text-2xl font-bold text-purple-700 dark:text-purple-300 tabular-nums">{score}</span>
                    <button
                        onClick={() => setScore((s) => s + 1)}
                        aria-label="Add 1 point"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/50 text-purple-800 dark:text-purple-300 text-sm font-medium transition-colors"
                    >
                        <Plus size={14} /> 1 pt
                    </button>
                    <button
                        onClick={() => setScore((s) => s + 2)}
                        aria-label="Add 2 points"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-200 dark:bg-purple-800/50 hover:bg-purple-300 dark:hover:bg-purple-700/50 text-purple-800 dark:text-purple-300 text-sm font-medium transition-colors"
                    >
                        <Plus size={14} /> 2 pts
                    </button>
                    <button
                        onClick={() => setScore(0)}
                        aria-label="Reset score"
                        className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 transition-colors"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-start px-4 py-6 md:justify-center">
                <AnimatePresence mode="wait">
                    {phase === "wheel" && (
                        <motion.div
                            key="wheel-phase"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-6 w-full"
                        >
                            {/* Wheel container */}
                            <div className="relative w-full max-w-sm md:max-w-xl lg:max-w-2xl mx-auto aspect-square">
                                {/* Pointer triangle */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 -top-1 z-10"
                                    style={{ width: 0, height: 0 }}
                                >
                                    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                                        <polygon
                                            points="14,28 2,2 26,2"
                                            fill="var(--color-primary, #b05740)"
                                            stroke="white"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>

                                {/* SVG Wheel */}
                                <svg
                                    viewBox="-1.05 -1.05 2.1 2.1"
                                    className="w-full h-full drop-shadow-lg"
                                    aria-hidden="true"
                                >
                                    {/* Outer ring */}
                                    <circle cx="0" cy="0" r="1.02" fill="none" stroke="#d1d5db" strokeWidth="0.03" />

                                    <g transform={`rotate(${svgRotation})`}>
                                        {EMOTIONS.map((emotion, i) => {
                                            const isUsed = gameModeEnabled && usedIndices.has(i);
                                            return (
                                                <g key={emotion.word} opacity={isUsed ? 0.28 : 1}>
                                                    <path
                                                        d={segments[i].path}
                                                        fill={isUsed ? "#e5e7eb" : emotion.color}
                                                        stroke="white"
                                                        strokeWidth="0.012"
                                                    />
                                                    <text
                                                        x={segments[i].label.x}
                                                        y={segments[i].label.y}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        fontSize="0.065"
                                                        fontFamily="DM Sans, sans-serif"
                                                        fontWeight="600"
                                                        fill={isUsed ? "#9ca3af" : "#2d2d2d"}
                                                        transform={`rotate(${segments[i].label.angleDeg}, ${segments[i].label.x}, ${segments[i].label.y})`}
                                                    >
                                                        {isUsed ? "✓" : emotion.wheelLabel}
                                                    </text>
                                                </g>
                                            );
                                        })}

                                        {/* Center circle */}
                                        <circle cx="0" cy="0" r="0.18" fill="white" stroke="#e5e7eb" strokeWidth="0.015" />
                                    </g>
                                </svg>

                                {/* SPIN button — centered over SVG */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <button
                                        onClick={handleSpin}
                                        disabled={isSpinning || (gameModeEnabled && usedIndices.size >= N)}
                                        aria-label="Spin the wheel"
                                        className="pointer-events-auto w-16 h-16 md:w-24 md:h-24 rounded-full font-display font-bold text-white text-sm md:text-lg shadow-lg transition-transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: "var(--color-primary, #b05740)" }}
                                    >
                                        {isSpinning ? "…" : "SPIN"}
                                    </button>
                                </div>
                            </div>

                            {gameModeEnabled ? (
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                                        {usedIndices.size} <span className="text-gray-400 dark:text-gray-500 font-normal text-lg">/ {N} done</span>
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                                        {N - usedIndices.size} emotion{N - usedIndices.size !== 1 ? "s" : ""} remaining
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                    Tap SPIN to land on an emotion word
                                </p>
                            )}
                        </motion.div>
                    )}

                    {phase === "result" && emotion && (
                        <motion.div
                            key="result-phase"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-5 w-full max-w-lg md:max-w-2xl mx-auto"
                        >
                            {/* Emotion word card — keep the pastel color but darken text for dark mode readability */}
                            <div
                                className="rounded-2xl p-6 text-center shadow-md"
                                style={{ backgroundColor: emotion.color }}
                            >
                                <p className="text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">You landed on</p>
                                <h2 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-3 capitalize">
                                    {emotion.word}
                                </h2>
                                <p className="text-lg text-gray-700 italic">"{emotion.exampleSentence}"</p>
                            </div>

                            {/* Definition panel */}
                            <AnimatePresence>
                                {showDefinition && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Definition</p>
                                            <p className="text-gray-800 dark:text-gray-200 text-lg">
                                                <span className="font-semibold capitalize">{emotion.word}</span> = {emotion.definition}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Discussion prompts */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Discussion Prompts</p>
                                <ul className="space-y-2">
                                    {displayedPromptIndices.map((pi, idx) => (
                                        <motion.li
                                            key={`${pi}-${idx}`}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.06 }}
                                            className="flex items-start gap-2 text-gray-700 dark:text-gray-200 text-base"
                                        >
                                            <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                                {idx + 1}
                                            </span>
                                            {emotion.prompts[pi]}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Scaffolding panel */}
                            <div
                                className={`rounded-xl p-4 border shadow-sm ${
                                    challengeMode
                                        ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
                                        : "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800"
                                }`}
                            >
                                {challengeMode ? (
                                    <>
                                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">Follow-up Questions</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CHALLENGE_QUESTIONS.map((q) => (
                                                <span key={q} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 rounded-full text-amber-800 dark:text-amber-300 text-sm font-medium">
                                                    {q}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">Sentence Starters</p>
                                        <ul className="space-y-1">
                                            {SENTENCE_STARTERS.map((s) => (
                                                <li key={s} className="text-green-800 dark:text-green-300 text-sm">
                                                    {s.replace("___", emotion.word)}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            {/* Support buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleSpeak}
                                    disabled={isSpeaking}
                                    aria-label={isSpeaking ? `Playing ${emotion.word}` : `Hear ${emotion.word}`}
                                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                                >
                                    <Volume2 size={18} className="shrink-0" />
                                    <span>{isSpeaking ? "Playing..." : "Hear Word"}</span>
                                </button>

                                <button
                                    onClick={() => setShowDefinition((v) => !v)}
                                    className={`flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl border font-medium shadow-sm active:scale-95 transition-all ${
                                        showDefinition
                                            ? "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <BookOpen size={18} className="shrink-0" />
                                    <span>{showDefinition ? "Hide Definition" : "Show Definition"}</span>
                                </button>

                                <button
                                    onClick={handleNewPrompts}
                                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                                >
                                    <MessageCircle size={18} className="shrink-0" />
                                    <span>New Prompts</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowDefinition(false);
                                        setTimerRunning(false);
                                        setTimerSeconds(120);
                                        if (gameModeEnabled && landedIndex !== null) {
                                            const next = new Set([...usedIndices, landedIndex]);
                                            setUsedIndices(next);
                                            setPhase(next.size >= N ? "complete" : "wheel");
                                        } else {
                                            setPhase("wheel");
                                        }
                                    }}
                                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl font-medium shadow-sm active:scale-95 transition-all text-white"
                                    style={{ backgroundColor: "var(--color-primary, #b05740)" }}
                                >
                                    <Target size={18} className="shrink-0" />
                                    <span>{gameModeEnabled ? "Next Emotion" : "Spin Again"}</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {phase === "complete" && (
                        <motion.div
                            key="complete-phase"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto text-center py-8"
                        >
                            <div className="text-6xl">🎉</div>
                            <div>
                                <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                                    Amazing Work!
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Your class discussed all {N} emotions. Great conversation today!
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md w-full">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <Trophy size={24} className="text-amber-500" />
                                    <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Emotions Covered</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {EMOTIONS.map((e) => (
                                        <span
                                            key={e.word}
                                            className="px-3 py-1 rounded-full text-sm font-medium"
                                            style={{ backgroundColor: e.color, color: "#2d2d2d" }}
                                        >
                                            ✓ {e.word}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {scoreEnabled && (
                                <div className="bg-purple-50 dark:bg-purple-950/50 rounded-xl px-8 py-4 border border-purple-200 dark:border-purple-800">
                                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">Final Score</p>
                                    <p className="font-mono text-4xl font-bold text-purple-700 dark:text-purple-300">{score}</p>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setUsedIndices(new Set());
                                    setLandedIndex(null);
                                    setScore(0);
                                    setPhase("wheel");
                                }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-md active:scale-95 transition-all"
                                style={{ backgroundColor: "var(--color-primary, #b05740)" }}
                            >
                                <Shuffle size={18} />
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
