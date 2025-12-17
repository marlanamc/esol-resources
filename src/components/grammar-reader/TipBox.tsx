'use client';

import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface TipBoxProps {
    tip: {
        title: string;
        content: string;
    };
}

// Parse content to make it ADHD-friendly with bullets and bold
function formatContent(content: string) {
    // Split by periods or common separators
    const sentences = content
        .split(/\.\s+(?=[A-Z])/)
        .map(s => s.trim().replace(/\.$/, ''))
        .filter(s => s.length > 0);

    // If multiple sentences, return bulleted list
    if (sentences.length > 1) {
        return (
            <ul className="space-y-2.5 mt-3">
                {sentences.map((sentence, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="text-warning flex-shrink-0 text-lg leading-none mt-0.5">•</span>
                        <span className="text-sm text-text leading-relaxed">
                            {highlightKeywords(sentence)}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    // Single sentence with highlighted keywords
    return <p className="text-sm text-text leading-relaxed mt-2">{highlightKeywords(content)}</p>;
}

// Highlight important keywords in bold
function highlightKeywords(text: string): React.ReactNode {
    // Keywords to bold
    const keywords = ['NOT', 'NO', 'NEVER', 'ALWAYS', 'ONLY', 'IMPORTANT', 'REMEMBER', "don't", "doesn't"];

    let result: React.ReactNode[] = [];
    let lastIndex = 0;

    // Create regex pattern for all keywords
    const pattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    let match;

    const matches: Array<{ index: number; text: string }> = [];
    while ((match = pattern.exec(text)) !== null) {
        matches.push({ index: match.index, text: match[0] });
    }

    matches.forEach((match, i) => {
        // Add text before match
        if (match.index > lastIndex) {
            result.push(text.substring(lastIndex, match.index));
        }
        // Add highlighted keyword
        result.push(
            <span key={`bold-${i}`} className="font-bold text-warning">
                {match.text}
            </span>
        );
        lastIndex = match.index + match.text.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }

    return result.length > 0 ? <>{result}</> : text;
}

export function TipBox({ tip }: TipBoxProps) {
    return (
        <motion.div
            className="tip-box relative bg-gradient-to-br from-warning/10 to-accent/5 border-2 border-warning/40 rounded-2xl p-5 my-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Decorative background blob */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-warning/10 rounded-full blur-2xl -z-10 transform -translate-x-12 -translate-y-12" />

            <div className="flex items-start gap-3">
                <motion.div
                    className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-warning to-accent rounded-xl flex items-center justify-center shadow-md"
                    initial={{ rotate: -20 }}
                    animate={{ rotate: 0 }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2,
                        ease: "easeInOut"
                    }}
                >
                    <Lightbulb className="w-5 h-5 text-white" />
                </motion.div>

                <div className="flex-1">
                    <h4 className="text-base font-bold text-warning mb-1">
                        {tip.title}
                    </h4>
                    {formatContent(tip.content)}
                </div>
            </div>
        </motion.div>
    );
}
