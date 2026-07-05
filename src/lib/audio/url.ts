/**
 * Resolves app audio paths ("/audio/...") to their serving URL.
 *
 * When NEXT_PUBLIC_AUDIO_CDN_URL is set (e.g. a Vercel Blob store's public
 * base URL), audio is served from there instead of the Next.js public/
 * directory — allowing the ~21MB of generated mp3s to live outside git.
 * When unset, paths pass through unchanged and audio serves from
 * public/audio/ exactly as before.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so this works in both
 * client and server components.
 */
const AUDIO_CDN_BASE = (process.env.NEXT_PUBLIC_AUDIO_CDN_URL ?? "").replace(/\/+$/, "");

export function resolveAudioUrl(path: string): string {
    if (!AUDIO_CDN_BASE || !path.startsWith("/audio/")) {
        return path;
    }
    return `${AUDIO_CDN_BASE}${path}`;
}
