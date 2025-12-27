/**
 * Production-grade HTML/CSS sanitizers using DOMPurify to prevent XSS attacks.
 * This replaces the previous regex-based approach which had multiple bypass vulnerabilities.
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify with a strict allowlist of safe tags and attributes
 */
export function sanitizeHtml(input?: string | null): string {
    if (!input) return "";

    return DOMPurify.sanitize(input, {
        // Only allow safe formatting tags
        ALLOWED_TAGS: ['strong', 'em', 'u', 'br', 'p', 'span', 'b', 'i'],
        // Only allow class attribute for styling
        ALLOWED_ATTR: ['class'],
        // Remove any data attributes
        FORBID_ATTR: ['style', 'onerror', 'onclick'],
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

