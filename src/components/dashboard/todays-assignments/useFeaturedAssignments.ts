'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/shared/logger';
import type { FeaturedAssignment } from './types';

export interface UseFeaturedAssignmentsOptions {
    /** Pre-loaded assignments (e.g. from server). If set, no fetch runs unless refreshOnMount is true. */
    initialAssignments?: FeaturedAssignment[];
    /** If true, always refetch on mount. */
    refreshOnMount?: boolean;
}

export interface UseFeaturedAssignmentsResult {
    assignments: FeaturedAssignment[];
    loading: boolean;
    refetch: () => Promise<void>;
}

/**
 * Fetches and caches featured assignments for the student dashboard.
 * Uses initialAssignments when provided and skips fetch unless refreshOnMount is true.
 */
export function useFeaturedAssignments({
    initialAssignments,
    refreshOnMount = false,
}: UseFeaturedAssignmentsOptions = {}): UseFeaturedAssignmentsResult {
    const hasInitial = initialAssignments !== undefined;
    const [assignments, setAssignments] = useState<FeaturedAssignment[]>(initialAssignments ?? []);
    const [loading, setLoading] = useState(() => !hasInitial || refreshOnMount);

    const fetchFeaturedAssignments = useCallback(async () => {
        try {
            const response = await fetch('/api/assignments/featured');
            if (response.ok) {
                const data = (await response.json()) as FeaturedAssignment[];
                setAssignments(data);
            }
        } catch (error) {
            logger.error('Error fetching featured assignments', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (refreshOnMount) {
            void fetchFeaturedAssignments();
            return;
        }
        if (hasInitial) {
            setLoading(false);
            return;
        }
        void fetchFeaturedAssignments();
    }, [hasInitial, refreshOnMount, fetchFeaturedAssignments]);

    return { assignments, loading, refetch: fetchFeaturedAssignments };
}
