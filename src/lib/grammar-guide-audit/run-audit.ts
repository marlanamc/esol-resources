import { resolveWeek1to18Guides } from "./scope";
import { loadGuide } from "./load-guide";
import { runMechanicalRules } from "./rules-mechanical";
import { runGlobalImageRules, runGuideImageRules } from "./rules-images";
import { runCharacterRules, runWiringWarnings } from "./rules-characters";
import { runToneHeuristics } from "./heuristics-tone";
import {
    extractDialoguesFromContent,
    extractDialoguesFromSource,
    extractScenarioParagraphs,
    usesSceneCards,
} from "./parse-dialogue";
import type { AuditResult, GuideReviewBundle } from "./types";

export interface RunAuditOptions {
    minWeek?: number;
    maxWeek?: number;
}

export async function runMiniGuidesAudit(
    options: RunAuditOptions = {},
): Promise<AuditResult> {
    const scope = resolveWeek1to18Guides(options.minWeek ?? 1, options.maxWeek ?? 18);
    const guides: GuideReviewBundle[] = [];
    const allFindings = [...(await runGlobalImageRules())];

    for (const entry of scope) {
        const loaded = await loadGuide(entry);
        const dialoguesFromSource = extractDialoguesFromSource(loaded.contentSource);
        const dialogues =
            dialoguesFromSource.length > 0
                ? dialoguesFromSource
                : extractDialoguesFromContent(loaded.content);

        const scenarioParagraphs = extractScenarioParagraphs(loaded.content);
        const usesScenes = usesSceneCards(loaded.contentSource);

        const imageResult = await runGuideImageRules(
            loaded.slug,
            loaded.imageModulePath,
            usesScenes,
        );

        const findings = [
            ...runMechanicalRules(loaded),
            ...imageResult.findings,
            ...runCharacterRules(loaded, dialogues),
            ...runWiringWarnings(loaded),
            ...runToneHeuristics(loaded, dialogues),
        ];

        guides.push({
            guide: loaded,
            findings,
            dialogues,
            scenarioParagraphs,
            imageEntries: imageResult.imageEntries,
        });

        allFindings.push(...findings);
    }

    const errorCount = allFindings.filter((f) => f.severity === "error").length;
    const warningCount = allFindings.filter((f) => f.severity === "warning").length;

    return {
        generatedAt: new Date().toISOString(),
        guides,
        findings: allFindings,
        errorCount,
        warningCount,
    };
}
