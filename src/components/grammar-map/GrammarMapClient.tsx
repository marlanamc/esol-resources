'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { grammarTopics, categoryColors, categoryLabels, type GrammarTopic } from '@/data/grammar-map';
import { Check, Loader2, ArrowRight } from 'lucide-react';

interface ProgressData {
    completionPercentage: number;
    status: string;
}

interface GrammarMapClientProps {
    progressMap: Record<string, ProgressData>;
}

interface NodePosition {
    x: number;
    y: number;
}

interface Edge {
    from: string;
    to: string;
    type: 'prerequisite' | 'related';
}

const CATEGORY_ORDER: GrammarTopic['category'][] = [
    'foundation',
    'writing',
    'tenses',
    'gerunds-infinitives',
    'modals',
    'advanced',
];

export default function GrammarMapClient({ progressMap }: GrammarMapClientProps) {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
    const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
    const [edges, setEdges] = useState<Edge[]>([]);
    const svgRef = useRef<SVGSVGElement>(null);

    const weekRange = useMemo(() => {
        const weeks = grammarTopics.map((t) => t.week).filter((w): w is number => typeof w === 'number' && Number.isFinite(w));
        if (!weeks.length) return { minWeek: 0, maxWeek: 0, weeks: [] as number[] };
        const uniqueWeeks = Array.from(new Set(weeks)).sort((a, b) => a - b);
        return { minWeek: Math.min(...uniqueWeeks), maxWeek: Math.max(...uniqueWeeks), weeks: uniqueWeeks };
    }, []);

    const lanes = useMemo(() => {
        const topicsByWeek: Record<number, GrammarTopic[]> = {};
        grammarTopics.forEach((topic) => {
            const week = topic.week || 0;
            if (!topicsByWeek[week]) topicsByWeek[week] = [];
            topicsByWeek[week].push(topic);
        });

        const nodeHeight = 90;
        const stackGap = 14;
        const laneGap = 34;
        const topPad = 90;

        const laneMaxStack: Record<GrammarTopic['category'], number> = {
            foundation: 1,
            tenses: 1,
            'gerunds-infinitives': 1,
            modals: 1,
            advanced: 1,
            writing: 1,
        };

        for (const topics of Object.values(topicsByWeek)) {
            const counts: Record<string, number> = {};
            for (const topic of topics) {
                counts[topic.category] = (counts[topic.category] || 0) + 1;
            }
            for (const [category, count] of Object.entries(counts)) {
                const cat = category as GrammarTopic['category'];
                laneMaxStack[cat] = Math.max(laneMaxStack[cat] ?? 1, count);
            }
        }

        let cursorY = topPad;
        const result: { category: GrammarTopic['category']; y: number; height: number }[] = [];
        for (const category of CATEGORY_ORDER) {
            const height = laneMaxStack[category] * (nodeHeight + stackGap) - stackGap;
            result.push({ category, y: cursorY, height });
            cursorY += height + laneGap;
        }

        return result;
    }, []);

    // Calculate node positions based on week + category lanes (game-map layout)
    useEffect(() => {
        const positions: Record<string, NodePosition> = {};
        const edgesList: Edge[] = [];

        // Group topics by week
        const topicsByWeek: Record<number, GrammarTopic[]> = {};
        grammarTopics.forEach(topic => {
            const week = topic.week || 0;
            if (!topicsByWeek[week]) {
                topicsByWeek[week] = [];
            }
            topicsByWeek[week].push(topic);
        });

        const nodeWidth = 220;
        const nodeHeight = 90;
        const stackGap = 14;
        const laneGap = 34;
        const leftPad = 80;
        const topPad = 90;
        const weekGap = 140;

        const laneMaxStack: Record<GrammarTopic['category'], number> = {
            foundation: 1,
            tenses: 1,
            'gerunds-infinitives': 1,
            modals: 1,
            advanced: 1,
            writing: 1,
        };

        for (const topics of Object.values(topicsByWeek)) {
            const counts: Record<string, number> = {};
            for (const topic of topics) {
                counts[topic.category] = (counts[topic.category] || 0) + 1;
            }
            for (const [category, count] of Object.entries(counts)) {
                const cat = category as GrammarTopic['category'];
                laneMaxStack[cat] = Math.max(laneMaxStack[cat] ?? 1, count);
            }
        }

        const laneStartY: Record<GrammarTopic['category'], number> = {
            foundation: 0,
            tenses: 0,
            'gerunds-infinitives': 0,
            modals: 0,
            advanced: 0,
            writing: 0,
        };

        let cursorY = topPad;
        for (const category of CATEGORY_ORDER) {
            laneStartY[category] = cursorY;
            cursorY += laneMaxStack[category] * (nodeHeight + stackGap) - stackGap + laneGap;
        }

        const stackIndexByWeekAndCategory = new Map<string, number>();

        for (const [week, topics] of Object.entries(topicsByWeek)) {
            const weekNum = Number.parseInt(week, 10);
            const weekIndex = weekNum - weekRange.minWeek;
            const x = leftPad + weekIndex * (nodeWidth + weekGap);

            for (const topic of topics) {
                const key = `${weekNum}:${topic.category}`;
                const stackIndex = stackIndexByWeekAndCategory.get(key) ?? 0;
                stackIndexByWeekAndCategory.set(key, stackIndex + 1);

                const y = laneStartY[topic.category] + stackIndex * (nodeHeight + stackGap);
                positions[topic.id] = { x, y };

                // Create edges for prerequisites
                if (topic.prerequisites) {
                    topic.prerequisites.forEach(prereqId => {
                        edgesList.push({
                            from: prereqId,
                            to: topic.id,
                            type: 'prerequisite'
                        });
                    });
                }

                // Create edges for related topics
                if (topic.relatedTopics) {
                    topic.relatedTopics.forEach(relatedId => {
                        // Only add if not already added as prerequisite
                        const existingEdge = edgesList.find(
                            e => (e.from === relatedId && e.to === topic.id) ||
                                 (e.from === topic.id && e.to === relatedId)
                        );
                        if (!existingEdge) {
                            edgesList.push({
                                from: topic.id,
                                to: relatedId,
                                type: 'related'
                            });
                        }
                    });
                }
            }
        }

        setNodePositions(positions);
        setEdges(edgesList);
    }, [weekRange.minWeek]);

    // Get completion status for a topic
    const arePrereqsMet = (topic: GrammarTopic): boolean => {
        if (!topic.prerequisites || topic.prerequisites.length === 0) return true;
        return topic.prerequisites.every((prereqId) => {
            const prereqTopic = grammarTopics.find((t) => t.id === prereqId);
            if (!prereqTopic?.activityId) return true;
            const prereqProgress = progressMap[prereqTopic.activityId];
            return !!prereqProgress && prereqProgress.completionPercentage >= 80;
        });
    };

    const getTopicStatus = (topic: GrammarTopic): 'completed' | 'in-progress' | 'available' => {
        if (!topic.activityId) return 'available';

        const progress = progressMap[topic.activityId];

        if (progress) {
            if (progress.completionPercentage >= 80) return 'completed';
            if (progress.completionPercentage > 0) return 'in-progress';
        }

        return 'available';
    };

    // Get suggested next topics
    const getSuggestedNext = (): string[] => {
        const suggested: string[] = [];

        for (const topic of grammarTopics) {
            const status = getTopicStatus(topic);
            if (status === 'available') {
                // Check if this is a logical next step (prerequisites completed, not started yet)
                const progress = topic.activityId ? progressMap[topic.activityId] : null;
                if (!progress || progress.completionPercentage === 0) {
                    suggested.push(topic.id);
                    if (suggested.length >= 3) break; // Only suggest top 3
                }
            }
        }

        return suggested;
    };

    const suggestedTopics = getSuggestedNext();

    // Get node color based on status
    const getNodeColor = (topic: GrammarTopic): string => {
        const status = getTopicStatus(topic);
        const prereqsMet = arePrereqsMet(topic);
        const baseColor = categoryColors[topic.category];

        switch (status) {
            case 'completed':
                return '#22c55e'; // Green
            case 'in-progress':
                return '#f59e0b'; // Amber
            case 'available':
            default:
                return prereqsMet ? baseColor : '#94a3b8'; // Slate for "recommended first"
        }
    };

    // Get status icon
    const getStatusIcon = (topic: GrammarTopic) => {
        const status = getTopicStatus(topic);

        switch (status) {
            case 'completed':
                return <Check className="w-6 h-6" />;
            case 'in-progress':
                return <Loader2 className="w-6 h-6" />;
            default:
                return null;
        }
    };

    const handleTopicClick = (topicId: string) => {
        const topic = grammarTopics.find(t => t.id === topicId);
        if (topic?.activityId) {
            // Navigate to the grammar guide (using topic ID as the route slug)
            window.location.assign(`/grammar-reader/${topic.id}`);
        }
    };

    const nodeWidth = 220;
    const nodeHeight = 90;
    const weekGap = 140;
    const leftPad = 80;
    const rightPad = 160;
    const topPad = 90;
    const bottomPad = 140;

    const canvas = useMemo(() => {
        const widthWeeks = Math.max(1, weekRange.maxWeek - weekRange.minWeek + 1);
        const width = leftPad + widthWeeks * (nodeWidth + weekGap) - weekGap + rightPad;

        const ys = Object.values(nodePositions).map((p) => p.y);
        const height = (ys.length ? Math.max(...ys) + nodeHeight : topPad) + bottomPad;

        return { width, height };
    }, [nodePositions, weekRange.maxWeek, weekRange.minWeek]);

    return (
        <div className="w-full">
            {/* Legend */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg mb-3">Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                        <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-400"></div>
                        <span className="text-sm">Recommended First (dim)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Suggested Next</span>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-lg mb-3">Categories</h3>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: categoryColors[key as keyof typeof categoryColors] }}
                            ></div>
                            <span className="text-sm">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Network Graph */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto h-[70vh] min-h-[520px]">
                <svg
                    ref={svgRef}
                    width={canvas.width}
                    height={canvas.height}
                    className="block"
                >
                    <defs>
                        <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="45%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#f1f5f9" />
                        </linearGradient>
                        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        </pattern>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.14" />
                        </filter>
                    </defs>

                    {/* Background */}
                    <rect x="0" y="0" width={canvas.width} height={canvas.height} fill="url(#mapBg)" />
                    <rect x="0" y="0" width={canvas.width} height={canvas.height} fill="url(#grid)" opacity="0.55" />

                    {/* Category lanes */}
                    <g>
                        {lanes.map((lane) => (
                            <g key={lane.category}>
                                <rect
                                    x="18"
                                    y={lane.y - 10}
                                    width={canvas.width - 36}
                                    height={lane.height + 20}
                                    rx="18"
                                    fill={categoryColors[lane.category]}
                                    opacity="0.06"
                                />
                                <rect
                                    x="24"
                                    y={lane.y + lane.height / 2 - 16}
                                    width="154"
                                    height="32"
                                    rx="12"
                                    fill={categoryColors[lane.category]}
                                    opacity="0.92"
                                />
                                <text
                                    x="101"
                                    y={lane.y + lane.height / 2 + 6}
                                    textAnchor="middle"
                                    className="text-sm font-semibold fill-white"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {categoryLabels[lane.category]}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* Render edges */}
                    <g className="edges">
                        {edges.map((edge, index) => {
                            const fromPos = nodePositions[edge.from];
                            const toPos = nodePositions[edge.to];

                            if (!fromPos || !toPos) return null;

                            const isHighlighted =
                                hoveredTopic === edge.from ||
                                hoveredTopic === edge.to ||
                                selectedTopic === edge.from ||
                                selectedTopic === edge.to;

                            const x1 = fromPos.x + nodeWidth / 2;
                            const y1 = fromPos.y + nodeHeight / 2;
                            const x2 = toPos.x + nodeWidth / 2;
                            const y2 = toPos.y + nodeHeight / 2;
                            const dx = Math.max(60, Math.abs(x2 - x1) * 0.5);

                            return (
                                <motion.path
                                    key={`${edge.from}-${edge.to}-${index}`}
                                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                                    fill="none"
                                    stroke={edge.type === 'prerequisite' ? '#2563eb' : '#cbd5e1'}
                                    strokeWidth={isHighlighted ? 3 : edge.type === 'prerequisite' ? 2 : 1.25}
                                    strokeDasharray={edge.type === 'related' ? '6,6' : '0'}
                                    opacity={isHighlighted ? 1 : 0.35}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: isHighlighted ? 1 : 0.35 }}
                                    transition={{ duration: 0.5, delay: index * 0.01 }}
                                />
                            );
                        })}
                    </g>

                    {/* Render nodes */}
                    <g className="nodes">
                        {grammarTopics.map((topic, index) => {
                            const pos = nodePositions[topic.id];
                            if (!pos) return null;

                            const status = getTopicStatus(topic);
                            const color = getNodeColor(topic);
                            const prereqsMet = arePrereqsMet(topic);
                            const isSuggested = suggestedTopics.includes(topic.id);
                            const isHovered = hoveredTopic === topic.id;
                            const isSelected = selectedTopic === topic.id;
                            const isDimmed = status === 'available' && !prereqsMet;

                            return (
                                <g key={topic.id}>
                                    {/* Suggested indicator */}
                                    {isSuggested && (
                                        <motion.circle
                                            cx={pos.x + nodeWidth / 2}
                                            cy={pos.y + nodeHeight / 2}
                                            r="65"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="3"
                                            strokeDasharray="5,5"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}

                                    {/* Node */}
                                    <motion.g
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onMouseEnter={() => setHoveredTopic(topic.id)}
                                        onMouseLeave={() => setHoveredTopic(null)}
                                        onClick={() => {
                                            setSelectedTopic(topic.id);
                                            handleTopicClick(topic.id);
                                        }}
                                        className="cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {/* Node background */}
                                        <rect
                                            x={pos.x}
                                            y={pos.y}
                                            width={nodeWidth}
                                            height={nodeHeight}
                                            rx="14"
                                            fill={color}
                                            opacity={isDimmed ? 0.55 : 1}
                                            stroke={isSelected ? '#0f172a' : isHovered ? '#334155' : 'rgba(255,255,255,0.55)'}
                                            strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                                            filter="url(#shadow)"
                                        />

                                        {/* Topic title */}
                                        <text
                                            x={pos.x + nodeWidth / 2}
                                            y={pos.y + nodeHeight / 2 + 5}
                                            textAnchor="middle"
                                            className="text-sm font-semibold fill-white"
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {topic.title.length > 25
                                                ? topic.title.substring(0, 25) + '...'
                                                : topic.title}
                                        </text>

                                        {/* Status icon */}
                                        <foreignObject
                                            x={pos.x + nodeWidth - 36}
                                            y={pos.y + 10}
                                            width="28"
                                            height="28"
                                        >
                                            <div className="flex items-center justify-center w-full h-full text-white">
                                                {getStatusIcon(topic)}
                                            </div>
                                        </foreignObject>
                                    </motion.g>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Topic details panel */}
            {selectedTopic && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                    {(() => {
                        const topic = grammarTopics.find(t => t.id === selectedTopic);
                        if (!topic) return null;

                        const status = getTopicStatus(topic);
                        const prereqsMet = arePrereqsMet(topic);
                        const progress = topic.activityId ? progressMap[topic.activityId] : null;

                        return (
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[var(--text)]">{topic.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTopic(null)}
                                        className="text-[var(--text)]/60 hover:text-[var(--text)]"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Status</h4>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getNodeColor(topic) }}
                                            ></div>
                                            <span className="capitalize">{status.replace('-', ' ')}</span>
                                        </div>
                                        {progress && (
                                            <div className="mt-2">
                                                <p className="text-sm text-[var(--text)]/70">
                                                    Progress: {progress.completionPercentage}%
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Category</h4>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: categoryColors[topic.category] }}
                                            ></div>
                                            <span>{categoryLabels[topic.category]}</span>
                                        </div>
                                    </div>
                                </div>

                                {topic.activityId && (
                                    <button
                                        onClick={() => handleTopicClick(topic.id)}
                                        className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        {status === 'completed' ? 'Review' : 'Start Learning'}
                                    </button>
                                )}

                                {!prereqsMet && (
                                    <p className="mt-4 text-sm text-[var(--text)]/70">
                                        Recommended: complete the prerequisite topics first for an easier time (you can still start this now).
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </motion.div>
            )}
        </div>
    );
}
