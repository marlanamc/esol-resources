'use client';

import React, { useState } from 'react';

interface AssignmentRequirementToggleProps {
    assignmentId: string;
    initialIsRequired: boolean;
}

export const AssignmentRequirementToggle: React.FC<AssignmentRequirementToggleProps> = ({
    assignmentId,
    initialIsRequired,
}) => {
    const [isRequired, setIsRequired] = useState(initialIsRequired);
    const [isLoading, setIsLoading] = useState(false);

    const toggleRequired = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/assignments', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assignmentId,
                    isRequired: !isRequired,
                    syncToSectionGroup: true,
                }),
            });

            if (response.ok) {
                setIsRequired(!isRequired);
                window.location.reload();
            } else {
                console.error('Failed to toggle required status');
            }
        } catch (error) {
            console.error('Error toggling required status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleRequired}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-[border-color,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                isRequired
                    ? 'border-secondary/40 bg-secondary/10 text-secondary'
                    : 'border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? (
                <span>...</span>
            ) : (
                <>{isRequired ? '✓ Required' : '○ Optional'}</>
            )}
        </button>
    );
};
