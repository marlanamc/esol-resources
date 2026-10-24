import { getActiveLearnerId } from "@/lib/learner-session";
import type { SpeakingSubmission } from "@/types/activity";
import { submitWithOutbox } from "@/lib/submissionOutbox";

const STORAGE_KEY = "speaking-warmup-draft";

export interface DraftData {
    activityId: string;
    assignmentId?: string | null;
    selectedPromptIds: string[];
    solo: {
        sentences: [string, string, string];
        followUpQuestions: [string, string];
        completedStepIds: string[];
    };
    speaking: {
        bestSentence: string;
        completedStepIds: string[];
    };
    lastSaved: string;
}

function draftKey(owner: string, activityId: string, assignmentId?: string | null) {
    return `${STORAGE_KEY}-v2-${JSON.stringify([owner, activityId, assignmentId || null])}`;
}

export function saveDraft(data: Omit<DraftData, 'lastSaved'>, owner = getActiveLearnerId()): void {
    if (typeof window === 'undefined' || !owner) return;
    
    const draftData: DraftData = {
        ...data,
        lastSaved: new Date().toISOString(),
    };
    
    const key = draftKey(owner, data.activityId, data.assignmentId);
    localStorage.setItem(key, JSON.stringify(draftData));
}

export function loadDraft(activityId: string, assignmentId?: string | null, owner = getActiveLearnerId()): DraftData | null {
    if (typeof window === 'undefined' || !owner) return null;
    
    const key = draftKey(owner, activityId, assignmentId);
    const stored = localStorage.getItem(key);
    
    if (!stored) return null;
    
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
}

export function clearDraft(activityId: string, assignmentId?: string | null, owner = getActiveLearnerId()): void {
    if (typeof window === 'undefined' || !owner) return;
    
    const key = draftKey(owner, activityId, assignmentId);
    localStorage.removeItem(key);
}

export type SpeakingSubmissionPayload = Omit<SpeakingSubmission, "submittedAt" | "status" | "userId">;

export interface SubmitSpeakingWarmupResult {
    success: boolean;
    submission?: SpeakingSubmission | null;
    error?: string;
    queued?: boolean;
}

export async function submitSpeakingWarmup(submission: SpeakingSubmissionPayload): Promise<SubmitSpeakingWarmupResult> {
    const owner = getActiveLearnerId();
    try {
        const submitResult = await submitWithOutbox({
            endpoint: "/api/speaking/submissions",
            method: "POST",
            payload: submission,
        });

        if (submitResult.queued) {
            return { success: true, queued: true, submission: null };
        }

        const response = submitResult.response;
        const data = await response.json().catch((err) => {
            console.warn("Failed to parse API response", err);
            return {};
        });

        if (!response.ok) {
            return { 
                success: false, 
                error: data.error || `HTTP ${response.status}: ${response.statusText}` 
            };
        }
        // Clear draft on successful submission
        clearDraft(submission.activityId, submission.assignmentId, owner);
        
        return { success: true, submission: data.submission || null };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        };
    }
}

export async function getSpeakingSubmission(activityId: string, assignmentId?: string | null): Promise<SpeakingSubmission | null> {
    try {
        const params = new URLSearchParams({ activityId });
        if (assignmentId) params.append('assignmentId', assignmentId);
        
        const response = await fetch(`/api/speaking/submissions?${params}`);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.submission || null;
    } catch {
        return null;
    }
}
