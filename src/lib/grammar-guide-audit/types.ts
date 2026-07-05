import type { InteractiveGuideContent } from "@/types/activity";

export type AuditSeverity = "error" | "warning";

export interface AuditFinding {
    severity: AuditSeverity;
    ruleId: string;
    slug: string;
    path: string;
    message: string;
    snippet?: string;
}

export interface GuideScopeEntry {
    slug: string;
    title: string;
    weekNumber: number;
    itemId: string;
    href: string;
}

export interface LoadedGuide {
    slug: string;
    scope: GuideScopeEntry;
    content: InteractiveGuideContent;
    contentPath: string;
    contentSource: string;
    pagePath: string | null;
    pageSource: string | null;
    /** Route metadata from the page file, or from the guide registry when served by the dynamic [slug] route. Null when no route exists. */
    pageMeta: { completionKey: string | null; activityTitle: string | null } | null;
    imageModulePath: string | null;
    exportName: string;
}

export interface DialogueTurn {
    speaker: string;
    text: string;
    avatar?: string;
    sectionId?: string;
    sectionTitle?: string;
}

export interface GuideReviewBundle {
    guide: LoadedGuide;
    findings: AuditFinding[];
    dialogues: DialogueTurn[];
    scenarioParagraphs: Array<{ sectionTitle: string; text: string }>;
    imageEntries: Array<{ sceneId: string; alt: string; unsplashId: string }>;
}

export interface AuditResult {
    generatedAt: string;
    guides: GuideReviewBundle[];
    findings: AuditFinding[];
    errorCount: number;
    warningCount: number;
}
