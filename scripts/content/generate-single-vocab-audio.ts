import * as fs from "fs";
import * as path from "path";

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "EXAVITQu4vr4xnSDxMaL";

const term = process.argv[2];
const spokenText = process.argv[3] ?? term;

if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY");
  process.exit(1);
}

if (!term) {
  console.error('Usage: npx tsx scripts/content/generate-single-vocab-audio.ts "term" ["spoken text"]');
  process.exit(1);
}

const apiKey = API_KEY;

async function main() {
  const headers: HeadersInit = {
    Accept: "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": apiKey,
  };

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      text: spokenText,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    process.exit(1);
  }

  const outputPath = path.join(process.cwd(), "public", "audio", "vocab", `${encodeURIComponent(term)}.mp3`);
  const audioBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
  console.log(`Saved ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
