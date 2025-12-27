/**
 * Production-grade HTML/CSS sanitizers using DOMPurify to prevent XSS attacks.
 * This replaces the previous regex-based approach which had multiple bypass vulnerabilities.
 */

import DOMPurify from 'isomorphic-dompurify';

type SanitizeHtmlOptions = {
    allowStyles?: boolean;
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify with a strict allowlist of safe tags and attributes
 */
export function sanitizeHtml(input?: string | null, options: SanitizeHtmlOptions = {}): string {
    if (!input) return "";

    const allowStyles = options.allowStyles === true;

    return DOMPurify.sanitize(input, {
        // Allow safe structural + formatting tags used in content
        ALLOWED_TAGS: [
            'a',
            'b',
            'blockquote',
            'br',
            'code',
            'div',
            'em',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'hr',
            'i',
            'li',
            'mark',
            'ol',
            'p',
            'pre',
            'span',
            'strong',
            'sub',
            'sup',
            'table',
            'tbody',
            'td',
            'tfoot',
            'th',
            'thead',
            'tr',
            'u',
            'ul',
        ],
        // Allow a small set of safe attributes
        ALLOWED_ATTR: [
            'class',
            'href',
            'rel',
            'target',
            'colspan',
            'rowspan',
            ...(allowStyles ? ['style'] : []),
        ],
        // Forbid inline styles by default (styles can be enabled per-renderer)
        FORBID_ATTR: allowStyles ? ['onerror', 'onclick'] : ['style', 'onerror', 'onclick'],
        // Remove tags completely rather than escaping
        KEEP_CONTENT: true,
        // Return empty string for invalid input
        RETURN_TRUSTED_TYPE: false,
    });
}

/**
 * Sanitize CSS to prevent CSS injection attacks
 * Removes dangerous CSS constructs like @import, javascript:, and expression()
 */
export function sanitizeCss(input?: string | null): string {
    if (!input) return "";

    // Use DOMPurify for CSS as well
    let cleaned = DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });

    // Additional CSS-specific cleaning
    cleaned = cleaned.replace(/@import[^;]+;/gi, "");
    cleaned = cleaned.replace(/expression\s*\([^)]*\)/gi, "");
    cleaned = cleaned.replace(/javascript:/gi, "");
    cleaned = cleaned.replace(/data:/gi, "");
    cleaned = cleaned.replace(/vbscript:/gi, "");

    return cleaned;
}
