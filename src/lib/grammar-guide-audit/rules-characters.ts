import { grammarContentRegistry } from "@/lib/grammar-content-loader";
import type { LoadedGuide } from "./types";
import type { AuditFinding, DialogueTurn } from "./types";
import { AMERICAN_NAMES, PLAIN_YELLOW_AVATARS } from "./config";
import { getAllPlainText } from "./collect-strings";

function warning(
    slug: string,
    ruleId: string,
    path: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity: "warning", ruleId, slug, path, message, snippet };
}

function error(
    slug: string,
    ruleId: string,
    path: string,
    message: string,
    snippet?: string,
): AuditFinding {
    return { severity: "error", ruleId, slug, path, message, snippet };
}

export function runCharacterRules(
    guide: LoadedGuide,
    dialogues: DialogueTurn[],
): AuditFinding[] {
    const { slug } = guide;
    const findings: AuditFinding[] = [];
    const allText = getAllPlainText(guide.content).toLowerCase();

    const hasAmericanName = AMERICAN_NAMES.some((name) => {
        const pattern = new RegExp(`\\b${name}\\b`, "i");
        return pattern.test(allText);
    });

    if (!hasAmericanName) {
        findings.push(
            warning(
                slug,
                "american-name-missing",
                "characters",
                "Guide has no common American name from the spec table",
            ),
        );
    }

    const speakers = new Set(
        dialogues
            .map((turn) => turn.speaker.trim())
            .filter((speaker) => speaker && !/classmate|neighbor|cousin|staff|landlord/i.test(speaker)),
    );

    if (dialogues.length > 0 && speakers.size < 2) {
        findings.push(
            warning(
                slug,
                "speaker-variety",
                "dialogue",
                `Only ${speakers.size} distinct named speaker(s) in dialogue (expected at least 2)`,
            ),
        );
    }

    const avatars = dialogues.map((turn) => turn.avatar).filter(Boolean) as string[];
    const plainYellowNamed = dialogues.filter(
        (turn) =>
            turn.avatar &&
            PLAIN_YELLOW_AVATARS.has(turn.avatar) &&
            !/classmate|neighbor|staff/i.test(turn.speaker),
    );

    if (plainYellowNamed.length > 0) {
        findings.push(
            warning(
                slug,
                "plain-yellow-avatar",
                "dialogue",
                `Named character(s) use plain yellow avatars: ${plainYellowNamed.map((t) => t.speaker).join(", ")}`,
            ),
        );
    }

    const skinTones = avatars
        .map((avatar) => avatar.match(/[\u{1F3FB}-\u{1F3FF}]/u)?.[0])
        .filter(Boolean);
    if (skinTones.length >= 3 && new Set(skinTones).size === 1) {
        findings.push(
            warning(
                slug,
                "avatar-skin-tone-monotone",
                "dialogue",
                "All dialogue avatars use the same skin-tone modifier",
            ),
        );
    }

    return findings;
}

export function runWiringWarnings(guide: LoadedGuide): AuditFinding[] {
    const findings: AuditFinding[] = [];
    if (!grammarContentRegistry[guide.slug]) {
        findings.push(
            warning(
                guide.slug,
                "content-loader-missing",
                "src/lib/grammar-content-loader.ts",
                "Guide slug missing from grammarContentRegistry",
            ),
        );
    }
    return findings;
}
