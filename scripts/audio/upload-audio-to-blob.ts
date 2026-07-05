/**
 * Uploads public/audio/**\/*.mp3 to Vercel Blob so the generated audio can
 * live outside git (see docs/planning/scalability-roadmap.md, "audio out of
 * git").
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... npm run audio:upload:blob        # upload
 *   BLOB_READ_WRITE_TOKEN=... npm run audio:upload:blob -- --dry-run
 *
 * Idempotent: already-uploaded pathnames are skipped, so it can be re-run
 * after generating new audio. On success it prints the base URL to set as
 * NEXT_PUBLIC_AUDIO_CDN_URL.
 */

import { list, put } from "@vercel/blob";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const AUDIO_ROOT = path.join(process.cwd(), "public/audio");
const BATCH_SIZE = 10;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const dryRun = process.argv.includes("--dry-run");

function collectMp3Files(dir: string): string[] {
    const files: string[] = [];
    for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) {
            files.push(...collectMp3Files(full));
        } else if (name.endsWith(".mp3")) {
            files.push(full);
        }
    }
    return files;
}

async function listExistingPathnames(): Promise<Set<string>> {
    const existing = new Set<string>();
    let cursor: string | undefined;
    do {
        const page = await list({ prefix: "audio/", cursor, limit: 1000 });
        for (const blob of page.blobs) existing.add(blob.pathname);
        cursor = page.cursor ?? undefined;
    } while (cursor);
    return existing;
}

async function main() {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error(
            "BLOB_READ_WRITE_TOKEN is not set.\n" +
                "Create a Blob store in the Vercel dashboard (Storage -> Blob), then\n" +
                "copy the read-write token into your environment and re-run."
        );
        process.exit(1);
    }

    const files = collectMp3Files(AUDIO_ROOT);
    console.log(`Found ${files.length} mp3 files under public/audio/`);

    const existing = await listExistingPathnames();
    console.log(`Blob store already has ${existing.size} audio files`);

    const pending = files.filter(
        (file) => !existing.has(path.relative(path.join(process.cwd(), "public"), file))
    );
    console.log(`${pending.length} files to upload${dryRun ? " (dry run)" : ""}`);

    if (dryRun || pending.length === 0) {
        if (dryRun) for (const f of pending.slice(0, 20)) console.log(`  would upload ${f}`);
        return;
    }

    let uploaded = 0;
    let failed = 0;
    let sampleUrl: string | null = null;

    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
        const batch = pending.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
            batch.map(async (file) => {
                const pathname = path.relative(path.join(process.cwd(), "public"), file);
                const blob = await put(pathname, readFileSync(file), {
                    access: "public",
                    addRandomSuffix: false,
                    contentType: "audio/mpeg",
                    cacheControlMaxAge: ONE_YEAR_SECONDS,
                });
                return blob.url;
            })
        );
        for (const result of results) {
            if (result.status === "fulfilled") {
                uploaded++;
                sampleUrl ??= result.value;
            } else {
                failed++;
                console.error("  upload failed:", result.reason);
            }
        }
        console.log(`  ${Math.min(i + BATCH_SIZE, pending.length)}/${pending.length}`);
    }

    console.log(`\nDone: ${uploaded} uploaded, ${failed} failed`);
    if (sampleUrl) {
        const base = new URL(sampleUrl).origin;
        console.log(
            `\nSet this in Vercel project env (and .env.local for local dev):\n` +
                `  NEXT_PUBLIC_AUDIO_CDN_URL=${base}\n\n` +
                `After deploying with that env set and verifying audio playback,\n` +
                `public/audio/ can be removed from git.`
        );
    }
    if (failed > 0) process.exit(1);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
