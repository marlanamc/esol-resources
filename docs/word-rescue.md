# Word Rescue

## Live release — October 10, 2026

Word Rescue is live on https://myesolclass.com as the first required activity in weeks 1–4. Production deployment: `dpl_36kBDqxqXJuUKXx3juyqBUG9rBxZ`. The narrow release script enabled only `sep-w1`, `sep-w2`, `sep-w4`, and `oct-learning`; class reveals and schedules were unchanged. The sections below retain implementation history and earlier pending checks; this status supersedes their deployment status.

Student access follows the same visible class weeks as the course map, including manual reveals and scheduled releases. There is no separate per-week Word Rescue allowlist. Everyday practice remains available. The global activity release switch remains available for disabling the whole activity. Use the narrow placement script for new map entries; do not run the wholesale map seed for a Word Rescue-only rollout.

Validation passed: production build and TypeScript, critical tests, full Vitest suite (759 tests at that run), final focused Word Rescue suite (36 tests), lint with no errors, and decoding all 93 initial-release audio clips. A real PostgreSQL transaction verified balance/ledger credit and duplicate-save suppression, then rolled back all temporary test records. Live smoke checks confirmed audio delivery, authenticated access using the dedicated E2E student, rejection of an unreleased collection, and all four map links ordered first.

Recording denial, local-only recording, playback cleanup, and 0.7× pitch-preserving playback have automated coverage. Physical iPhone/Android microphone checks and independent human listening review of every clip were not completed in this run. Generation and file decoding are not pronunciation approval. Initial-release phrase fragments were reviewed and corrected; the active catalogue now has 567 unique generated texts across 597 clips.

Mobile-first implementation of the Focused Word concept. The local development preview is `/preview/word-rescue`; it is unavailable in production and never grants account points. The integrated activity route is `/activity/word-rescue` after seeding.

## Content and language support

The weekly catalogue uses the existing vocabulary IDs, definitions, and example sentences. Run `node scripts/word-rescue/sync-weekly.mjs` after editing `scripts/vocab/weekly-vocab-data.js`; `--check` verifies synchronization. Short phrases extracted from those sentences are drafts for teacher review.

Everyday words: through, prohibited, achieve, correctly, pronounce, spell, repeat. These seven words and the six October transportation words have authored English clues plus Spanish and Brazilian Portuguese coaching. Some hints intentionally use mouth instructions instead of a misleading respelling. Every other weekly word now has two authored sound targets with Spanish and Brazilian Portuguese explanations in `word-rescue-language-help.ts`. All 203 unique terms (229 word IDs, including saved legacy sets) have language help. These are focused pronunciation tips, not a full native-language phonetic dictionary.

Respellings are approximate, not IPA and not a substitute for model audio. The guide explains the schwa where used and preserves unfamiliar English sounds rather than silently replacing them. The language panel starts closed. The learner's choice is stored with account progress (or separately in the unscored preview).

## Audio and recording

`node --import tsx scripts/word-rescue/generate-preview-audio.ts` creates draft US English clips with the installed Samantha voice and ffmpeg. It checks for empty output. The manifest remains `draft-needs-listening-review`; generation is not pronunciation approval. Files under `public/word-rescue-audio` are intentionally separate from the legacy ignored/CDN audio folder so deployment includes them.

Normal speed is 1×; slow is 0.7× with pitch preservation. A single media owner cancels competing playback. Completion evidence is submitted only on playback end. Missing audio offers an explicit device-voice alternative, labeled as variable across devices.

Recording uses MediaRecorder only after a button press and browser permission. It remains in memory, is never uploaded, stops after 60 seconds, and is discarded when leaving the word or page. Late permission results release their microphone tracks. Denied/unsupported recording does not block spoken practice. The Permissions-Policy enables microphone self-access only on `/activity/word-rescue`.

## Persistence and rewards

`/api/word-rescue` authenticates the user, verifies activity availability and assignment membership, and stores progress in the existing ActivityProgress model. No schema migration is needed. The existing generic progress and submission routes reject Word Rescue to prevent bypassing its completion requirements.

A session contains up to three words, preferring less-practiced words. A second tab resumes an active session. Per-word heard evidence and spoken confirmation precede the confidence choice. Both confidence choices earn two points. A stable session/word key is used for the ledger claim; completion and balance/ledger updates run in one PostgreSQL transaction under a per-student advisory lock. Repeating the full practice sequence in a new session is rewarded. Replays and retries are not new attempts.

The client stores the pending request in user/assignment-scoped device storage before sending, retries on reconnection or explicit Retry, and never displays earned credit before server confirmation. Recording data is excluded. Assignment completion never regresses when a later practice session starts.

## Release

1. Review all draft clips and phrase extractions; correct any mispronunciation or awkward phrase. Complete additional per-word language guides as needed for the class's selected week.
2. Check recording/permission denial on a real iPhone Safari and Android Chrome. Desktop preview verification is not a substitute for those device checks.
3. Run `npm run db:seed:word-rescue` against the intended database using the existing DB safety guard. The seed creates an unreleased activity and preserves an existing release setting. No database seed or production deployment was run while implementing this feature.
4. Verify a signed-in student's two-point balance and ledger update on a non-production database, including an interrupted/retried save. Unit tests exercise the transactional contract using a mocked database, not a live PostgreSQL connection.
5. Release the reviewed activity through the normal teacher workflow.

Validation: focused progression, transactional award/recovery, endpoint authorization, generic progress and submission contracts; TypeScript and scoped lint; mobile browser walkthrough of normal/slow audio, Spanish/Portuguese selection, reload/resume, unrecorded completion, and the revisit choice.

## Weekly course map and ElevenLabs

The map definition adds Word Rescue to each of the 31 weeks with a supported vocabulary set, using that week's actual vocabulary activity ID rather than guessing from calendar dates. Review/assessment weeks without a vocabulary set are unchanged. The link preselects the collection and preserves unfinished practice; three distinct practiced words in that collection complete its map checkmark. Global completion does not complete other weeks. Practice sits before the closing verb quiz. Run the existing course-map seed after the Word Rescue activity seed to install these definitions; no map/database seed was run for this change. Unreleased/missing Word Rescue activities show as planned on the learner map.

`npm run audio:word-rescue:words` reports missing word recordings without spending credits. Add `-- --apply` to reuse the local vocabulary library and generate missing words through the configured ElevenLabs account. API keys stay in the server-side environment. Generated clips are cached and their provenance is recorded in `public/word-rescue-audio/word-sources.json`; interrupted runs reuse completed clips. No student data is sent. The October 10 run reused existing recordings for 201 unique terms and generated only **through** and **correctly**, covering all 229 word IDs. Phrases and sentences remain Samantha preview audio. All clips still require listening review before release.

API reference: https://elevenlabs.io/docs/api-reference/text-to-speech/convert

## Consistent ElevenLabs audio and FY27 picker (October 10 update)

The weekly selector now derives its ordering and titles from `COURSE_MAP_UNITS`: **FY27 · Week N · course-map title**. Only the 31 vocabulary sets actually referenced by that map appear. Legacy vocabulary IDs are preserved internally for saved progress; calendar labels from the older weekly vocabulary catalog are no longer shown. Older word records remain available for resuming saved sessions.

`npm run audio:word-rescue:elevenlabs` performs a dry run; `-- --apply` prepares word, phrase, and sentence audio for every current collection using one configured voice/model/settings combination. It groups identical text to avoid duplicate API charges, checkpoints after each success, and reuses clips only when text and voice settings match. Failed API requests stop the batch without automatic paid retries. The original word-only generator refuses to overwrite this consistent library.

The current catalogue contains 199 word IDs and 597 clips (569 unique text requests). Source details live in `elevenlabs-sources.json`. Generation and decode checks do not replace listening review; release and physical microphone checks remain pending.

## Student week access

The authenticated API now returns only collections backed by the student's visible course-map weeks, using the existing class reveal/scheduled-release policy. Teacher/admin access and the development-only teacher preview keep the full catalogue. Dropdown labels omit FY27 and use `Week N · title`.

The server also rejects attempts to start or submit word evidence for unavailable weeks. Practice again filters unavailable words without deleting their saved history or points. If a previously started week is withdrawn, its unfinished session is preserved and locked until that week becomes available again. Completed sessions do not block new available practice. Everyday words remain available when no class weeks are released.

## Complete bilingual coaching

`src/data/word-rescue-language-help.ts` explicitly maps each additional term to selected sound targets. Shared bilingual explanations keep repeated sounds consistent; targets are authored per word rather than inferred automatically from spelling. Existing bespoke guides take precedence. No phonetic respelling is invented for sounds without a close native-language equivalent. The added guides have two short tips each, rendered with bold labels and visible bullets. Spanish label text is localized for the Portuguese panel.

Coverage tests require both languages for every current and legacy word, and guard the silent t in listen, voiced th in soothe, the final t in processed, and the curriculum-vitae meaning of resume. These checks establish completeness and regressions, not independent linguistic approval. Teacher listening/content review before release remains necessary, particularly the model audio for meaning-dependent terms such as resume.

Reference checks: [Cambridge résumé](https://dictionary.cambridge.org/us/dictionary/english/resume), [Cambridge courtesy](https://dictionary.cambridge.org/us/pronunciation/english/courtesy), and [University of Iowa Sounds of Speech](https://soundsofspeech.uiowa.edu/). Coaching text is newly authored; it does not reproduce dictionary definitions or audio.

## Course-map warm-up wrapper

Word Rescue is now first in each week that has a vocabulary set. Links carry the collection, `fromMap=1`, and a safe return URL for that exact map week. The wrapper starts/resumes the selected set directly, omits collection browsing, and offers Back to course map after the final server-confirmed word receipt. The header also returns to that map week. Standard standalone collection browsing remains available outside this wrapper.

Unfinished sessions are saved by collection when switching weeks and resume with their original attempt IDs and listening evidence. Week release checks still apply to both new and resumed sessions. The five review/assessment weeks without vocabulary sets do not get an invented vocabulary assignment. Database seeding/deployment is still required to apply map ordering to the live course.

## Round reward confirmation

The final confirmed word save replaces the per-word receipt with a persistent round-total banner: “+6 points earned” for three words, followed by “Your points are saved!” and the course-map return button. The total uses the completed session’s word count times the existing two-point award, so shorter revisit rounds show their actual total. This is a summary of saved credit, not an extra award. Preview explicitly labels the illustrative total and awards no account points. The banner is announced politely and has no animation or dismissal timer.

## Deployment source reconciliation

The release checkout was brought up to date with GitHub main, restoring the leaderboard commits through PR #84 and the award-chain response fix. Vercel now uses `npx prisma generate && npx next build`, matching the verified narrow deployment. Database migrations and course-map seeding must be run explicitly when needed; publishing a frontend update no longer invokes the wholesale map seed.

## Full weekly rounds — October 10 update

Course-map launches now pass weekly mode and practice the complete vocabulary collection (six words in the released weeks), earning 12 points at two points per word. Standalone starts stay at three words and six points. Weekly and standalone unfinished rounds have separate saved-session keys. Unfinished legacy weekly rounds expand to the full set without changing session IDs, credited words, or current listening/spoken evidence. A completed older three-word round retains its credit; the course-map checkmark now requires all distinct words in that week's collection.

The persistent final receipt reports the actual round total: “+12 points earned” and “You practiced all 6 weekly words. Your points are saved!” for a full weekly round. Both confidence choices still earn equal credit, and retrying any finish request does not add points again.
