'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Dot } from 'lucide-react';

interface ProgressBarProps {
    total: number;
    current: number;
    completed: number;
}

export function ProgressBar({ total, current, completed }: ProgressBarProps) {
    const percentage = Math.round((completed / total) * 100);

    return (
        <div className="progress-bar">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text">
                    Your Progress
                </span>
                <motion.span
                    className="text-sm font-bold text-success"
                    key={percentage}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                    {percentage}%
                </motion.span>
            </div>

            {/* Traditional progress bar with animated fill */}
            <div className="relative h-2 bg-border rounded-full overflow-hidden mb-3">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>

            {/* Section dots with icons */}
            <div className="flex items-center gap-1.5 mb-3">
                {Array.from({ length: total }).map((_, index) => {
                    const isCompleted = index < completed;
                    const isCurrent = index === current;

                    return (
                        <motion.div
                            key={index}
                            className={`relative flex-1 min-w-0 h-2.5 rounded-full flex items-center justify-center ${
                                isCompleted
                                    ? "bg-success"
                                    : isCurrent
                                    ? "bg-primary"
                                    : "bg-border"
                            }`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                delay: index * 0.05,
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            whileHover={{
                                scale: 1.15,
                                transition: { duration: 0.2 }
                            }}
                            title={`Section ${index + 1}${
                                isCompleted
                                    ? " (Completed)"
                                    : isCurrent
                                    ? " (Current)"
                                    : ""
                            }`}
                        >
                            {isCompleted && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                >
                                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                </motion.div>
                            )}
                            {isCurrent && !isCompleted && (
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [1, 0.7, 1]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Dot className="w-3.5 h-3.5 text-white" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <p className="text-xs text-text-muted text-center">
                {completed} of {total} sections completed
            </p>
        </div>
    );
}
