/**
 * Public audio lives at `public/audio/vocab/<term>.mp3`.
 * When the on-disk filename differs from the curriculum `card.term`, map it here.
 */
/** Map `card.term` → filename base when the mp3 on disk does not match the term text. */
const VOCAB_AUDIO_FILE_OVERRIDES: Record<string, string> = {};

export function getVocabAudioUrl(term: string): string {
  const fileBase = VOCAB_AUDIO_FILE_OVERRIDES[term] ?? term;
  return `/audio/vocab/${encodeURIComponent(fileBase)}.mp3`;
}
