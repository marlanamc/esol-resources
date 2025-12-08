'use client';

import type { FormulaPart } from "@/types/activity";
import { motion } from "framer-motion";

interface FormulaBoxProps {
    parts: FormulaPart[];
}

const colorMap = {
    subject: "bg-primary/10 text-primary border-primary/20",
    verb: "bg-warning/10 text-warning border-warning/20",
    object: "bg-success/10 text-success border-success/20",
    other: "bg-bg-light text-text-muted border-border",
};

export function FormulaBox({ parts }: FormulaBoxProps) {
    return (
        <motion.div
            className="formula-box bg-white border-2 border-border rounded-lg p-6 my-6 text-center shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="flex items-center justify-center gap-2 flex-wrap">
                {parts.map((part, index) => (
                    <motion.span
                        key={index}
                        className={`formula-part px-3 py-2 rounded-md font-semibold border text-sm ${colorMap[part.type || "other"]
                            }`}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.4,
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                    >
                        {part.text}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
}
