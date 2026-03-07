import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}
import type { InteractiveGuideSection } from '@/types/activity';

type FutureChoiceOption = NonNullable<NonNullable<InteractiveGuideSection['futureChoiceFlow']>['options']>[number];

interface FutureChoiceFlowProps {
    data: NonNullable<InteractiveGuideSection['futureChoiceFlow']>;
}

export function FutureChoiceFlow({ data }: FutureChoiceFlowProps) {
    
    const getTheme = (colorName: string) => {
        switch (colorName) {
            case 'cyan': // Will
                return {
                    border: 'border-cyan-500',
                    bg: 'bg-cyan-50 text-cyan-900',
                    icon: 'text-cyan-600',
                    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200'
                };
            case 'green': // Going to
                return {
                    border: 'border-emerald-500',
                    bg: 'bg-emerald-50 text-emerald-900',
                    icon: 'text-emerald-600',
                    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                };
            case 'violet': // Present Continuous
                return {
                    border: 'border-violet-500',
                    bg: 'bg-violet-50 text-violet-900',
                    icon: 'text-violet-600',
                    badge: 'bg-violet-100 text-violet-800 border-violet-200'
                };
            case 'amber': // Future Continuous
                return {
                    border: 'border-amber-500',
                    bg: 'bg-amber-50 text-amber-900',
                    icon: 'text-amber-600',
                    badge: 'bg-amber-100 text-amber-800 border-amber-200'
                };
            default:
                return {
                    border: 'border-border',
                    bg: 'bg-[var(--color-surface-subtle)] text-text',
                    icon: 'text-text-muted',
                    badge: 'bg-[var(--color-surface-subtle)] text-text border-border'
                };
        }
    };

    const getFormLabel = (form: FutureChoiceOption['form']) => {
        switch (form) {
            case 'will': return 'Will';
            case 'going-to': return 'Going to';
            case 'present-continuous': return 'Present Continuous';
            case 'future-continuous': return 'Future Continuous';
            default: return form;
        }
    };

    return (
        <div className="my-8">
            <div className="rounded-xl border border-border bg-[var(--color-surface-elevated)] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="border-b border-border bg-[var(--color-surface-subtle)] p-4 text-center md:p-6">
                    <h3 className="m-0 flex items-center justify-center gap-2 text-lg font-bold text-text md:text-xl">
                         🧭 {data.title || "Future Decision Flow"}
                    </h3>
                    {data.description && (
                        <p className="mt-2 mx-auto max-w-2xl text-sm text-text-muted md:text-base">
                            {data.description}
                        </p>
                    )}
                </div>

                {/* Flow Content */}
                <div className="p-4 md:p-6 space-y-4 relative">
                    {/* Connecting line for desktop visual flow */}
                    <div className="absolute left-8 top-6 bottom-6 hidden w-0.5 bg-border md:block" />

                    {data.options.map((option, index) => {
                        const theme = getTheme(option.color);
                        
                        return (
                            <div 
                                key={index}
                                className={cn(
                                    "relative rounded-lg border-l-4 bg-[var(--color-surface-elevated)] p-4 shadow-sm transition-all hover:shadow-md",
                                    theme.border
                                )}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                                    {/* Trigger Question/Context */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className={cn("mt-1 rounded-full bg-[var(--color-surface-base)] p-1 md:bg-transparent", theme.icon)}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="mb-1 font-medium text-text">
                                                    {option.trigger}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-muted md:hidden">
                                                    <ArrowRight className="w-4 h-4" />
                                                    <span className={cn("px-2 py-0.5 rounded text-xs font-semibold border", theme.badge)}>
                                                        {getFormLabel(option.form)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow for Desktop */}
                                    <div className="hidden items-center text-text-light md:flex">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>

                                    {/* Result: Form + Example */}
                                    <div className="rounded-lg bg-[var(--color-surface-subtle)] p-3 md:w-1/2 md:bg-transparent md:p-0">
                                        <div className="hidden md:flex items-center gap-2 mb-1">
                                            <span className={cn("px-2 py-0.5 rounded text-xs font-semibold border uppercase tracking-wider", theme.badge)}>
                                                {getFormLabel(option.form)}
                                            </span>
                                        </div>
                                        <div className="text-sm italic text-text md:text-base">
                                            "{option.example}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Quick Helper / Mobile Hint */}
            <div className="mt-3 text-center">
                <p className="text-xs italic text-text-light">
                    Ask yourself: "When was the decision made?"
                </p>
            </div>
        </div>
    );
}
