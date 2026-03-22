'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LearnerType = 'classroom' | 'independent' | 'all';

interface LearnerTypeFilterProps {
    currentType: LearnerType;
    classroomCount: number;
    independentCount: number;
}

export function LearnerTypeFilter({
    currentType,
    classroomCount,
    independentCount,
}: LearnerTypeFilterProps) {
    const pathname = usePathname();
    const totalCount = classroomCount + independentCount;

    const options: { type: LearnerType; label: string; count: number }[] = [
        { type: 'classroom', label: 'Classroom', count: classroomCount },
        { type: 'independent', label: 'Independent', count: independentCount },
        { type: 'all', label: 'All Students', count: totalCount },
    ];

    return (
        <div className="bg-white rounded-2xl border border-border/40 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-text">Learner Type</h3>
                    <p className="text-xs text-text-muted">
                        Filter students by learning mode
                    </p>
                </div>
                <div className="inline-flex items-center rounded-lg p-1 bg-bg-light border border-border/40">
                    {options.map((option) => {
                        const isActive = currentType === option.type;
                        const href = option.type === 'classroom'
                            ? pathname
                            : `${pathname}?learnerType=${option.type}`;

                        return (
                            <Link
                                key={option.type}
                                href={href}
                                className={`
                                    px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-text-muted hover:text-text hover:bg-white'
                                    }
                                `}
                            >
                                {option.label}
                                <span className={`ml-1.5 ${isActive ? 'text-white/80' : 'text-text-light'}`}>
                                    ({option.count})
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
