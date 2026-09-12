/** Returns a normalized http(s) URL, or null if the input is invalid or unsafe. */
export function toSafeExternalUrl(url: string): string | null {
    try {
        const parsed = new URL(url.trim());
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return parsed.toString();
        }
        return null;
    } catch {
        return null;
    }
}
