/**
 * Lightweight HTML/CSS sanitizers to reduce XSS risk without extra deps.
 * Removes script/style/iframe/embed/object/link/meta tags and inline event handlers.
 * Not a full sanitizer, but safer than raw injection.
 */

const TAG_BLOCKLIST = ["script", "style", "iframe", "object", "embed", "link", "meta"];

function stripDangerousTags(html: string): string {
    return html.replace(
        new RegExp(`<\\/?(?:${TAG_BLOCKLIST.join("|")})[^>]*>`, "gi"),
        ""
    );
}

function stripEventHandlers(html: string): string {
    // remove inline on* handlers and javascript: urls
    let cleaned = html.replace(/\s+on\w+="[^"]*"/gi, "");
    cleaned = cleaned.replace(/\s+on\w+='[^']*'/gi, "");
    cleaned = cleaned.replace(/javascript:/gi, "");
    return cleaned;
}

export function sanitizeHtml(input?: string | null): string {
    if (!input) return "";
    const withoutTags = stripDangerousTags(input);
    const withoutEvents = stripEventHandlers(withoutTags);
    return withoutEvents;
}

export function sanitizeCss(input?: string | null): string {
    if (!input) return "";
    // Drop @import and javascript/expressions
    let cleaned = input.replace(/@import[^;]+;/gi, "");
    cleaned = cleaned.replace(/expression\s*\([^)]*\)/gi, "");
    cleaned = cleaned.replace(/javascript:/gi, "");
    return cleaned;
}

