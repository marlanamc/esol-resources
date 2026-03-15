"use client";

import type { LearnerSearchContext, LearnerSearchFilter } from "./types";

type LearnerSearchTelemetryEvent =
    | {
        type: "query";
        context: LearnerSearchContext;
        query: string;
        filter: LearnerSearchFilter;
    }
    | {
        type: "zero_results";
        context: LearnerSearchContext;
        query: string;
        filter: LearnerSearchFilter;
    }
    | {
        type: "click_result";
        context: LearnerSearchContext;
        query: string;
        filter: LearnerSearchFilter;
        resultId: string;
        href: string;
    }
    | {
        type: "select_filter";
        context: LearnerSearchContext;
        query: string;
        filter: LearnerSearchFilter;
    };

function postTelemetry(payload: LearnerSearchTelemetryEvent) {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon("/api/search/learner/telemetry", blob)) {
            return;
        }
    }

    void fetch("/api/search/learner/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "same-origin",
        keepalive: true,
    });
}

export function trackLearnerSearchEvent(payload: LearnerSearchTelemetryEvent) {
    postTelemetry({
        ...payload,
        query: payload.query.trim().toLowerCase().slice(0, 80),
    });
}
