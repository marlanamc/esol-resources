'use client';

import type { UsageMeaning } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";
import { motion } from "framer-motion";
import {
    Repeat,
    Globe,
    Briefcase,
    Calendar,
    Heart,
    ArrowRight,
    Sparkles
} from "lucide-react";

interface UsageMeaningsListProps {
    meanings: UsageMeaning[];
}

// Map emoji prefixes to beautiful Lucide icons
const getIconForMeaning = (title: string) => {
    if (title.includes('Habit') || title.includes('Routine') || title.includes('🔄')) {
        return Repeat;
    }
    if (title.includes('Fact') || title.includes('Truth') || title.includes('🌍')) {
        return Globe;
    }
    if (title.includes('Situation') || title.includes('Life') || title.includes('💼')) {
        return Briefcase;
    }
    if (title.includes('Schedule') || title.includes('Timetable') || title.includes('📅')) {
        return Calendar;
    }
    if (title.includes('Feeling') || title.includes('Opinion') || title.includes('❤️')) {
        return Heart;
    }
    if (title.includes('Actions') || title.includes('Continue') || title.includes('⏰')) {
        return Repeat;
    }
    if (title.includes('Recent') || title.includes('🆕')) {
        return Sparkles;
    }
    if (title.includes('Multiple') || title.includes('🔢')) {
        return Repeat;
    }
    if (title.includes('Past Action') || title.includes('Result') || title.includes('➡️')) {
        return ArrowRight;
    }
    return Sparkles; // Default
};

// Extract clean title without emojis
const cleanTitle = (title: string) => {
    return title
        .replace(/[\p{Extended_Pictographic}\u200D\uFE0E\uFE0F✓]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
};

export function UsageMeaningsList({ meanings }: UsageMeaningsListProps) {
    return (
        <div className="usage-meanings-list space-y-4 md:space-y-6 my-6 md:my-8">
            {meanings.map((meaning, index) => {
                const Icon = getIconForMeaning(meaning.title);
                const title = cleanTitle(meaning.title);

                return (
                    <motion.div
                        key={index}
                        className="usage-meaning group relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1] // Custom easing for smooth feel
                        }}
                    >
                        {/* Card with gradient border effect */}
                        <div className="relative bg-gradient-to-br from-white to-bg-light border-2 border-border rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                            {/* Subtle gradient background accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl -z-10 transform translate-x-32 -translate-y-32" />

                            {/* Header with icon and title */}
                            <div className="flex items-baseline gap-3 md:gap-4 mb-4">
                                <motion.div
                                    className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-primary to-accent rounded-xl md:rounded-2xl flex items-center justify-center shadow-md"
                                    style={{ marginTop: '0.375rem' }}
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                                </motion.div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="!text-xl md:!text-2xl lg:!text-3xl font-bold text-text mb-2 font-display leading-tight">
                                        {title}
                                    </h4>
                                    <p className="text-base md:text-lg text-text-muted leading-relaxed">
                                        {meaning.description}
                                    </p>
                                </div>
                            </div>

                            {/* Examples with staggered animation */}
                            <div className="space-y-2 md:space-y-3 mt-4 md:mt-5">
                                {meaning.examples.map((example, exIdx) => (
                                    <motion.div
                                        key={exIdx}
                                        className="group/example relative"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: index * 0.1 + exIdx * 0.05,
                                            duration: 0.4
                                        }}
                                    >
                                        {/* Example card with hover effect */}
                                        <div className="relative bg-white rounded-xl p-3 md:p-4 border-l-4 border-primary shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                            {/* Arrow indicator on hover */}
                                            <motion.div
                                                className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/example:opacity-100 transition-opacity"
                                                initial={{ x: -10 }}
                                                whileHover={{ x: 0 }}
                                            >
                                                <ArrowRight className="w-4 h-4 text-primary" />
                                            </motion.div>

                                            <div className="pl-2 md:pl-6">
                                                <p
                                                    className="text-sm md:text-base text-text font-medium leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(example.sentence) }}
                                                />
                                                {example.explanation && (
                                                    <motion.div
                                                        className="flex items-start gap-2 mt-2 pt-2 border-t border-border/50"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        whileInView={{ opacity: 1, height: "auto" }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent flex-shrink-0 mt-0.5" />
                                                        <p className="text-xs md:text-sm text-text-muted italic flex-1">
                                                            {example.explanation.replace('✓', '').trim()}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
