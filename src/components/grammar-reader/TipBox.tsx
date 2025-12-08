'use client';

import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface TipBoxProps {
    tip: {
        title: string;
        content: string;
    };
}

export function TipBox({ tip }: TipBoxProps) {
    return (
        <motion.div
            className="tip-box bg-warning/10 border border-warning/30 rounded-lg p-4 my-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h4 className="text-sm font-bold text-warning mb-2 flex items-center gap-2">
                <motion.div
                    initial={{ rotate: -20 }}
                    animate={{ rotate: 0 }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2,
                        ease: "easeInOut"
                    }}
                >
                    <Lightbulb className="w-5 h-5" />
                </motion.div>
                {tip.title}
            </h4>
            <p className="text-sm text-text">{tip.content}</p>
        </motion.div>
    );
}
