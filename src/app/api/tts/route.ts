import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs voice: Rachel — clear, warm American English. Good for ESOL instruction.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM';
const API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });
  }

  let text: string;
  try {
    const body = await request.json();
    text = String(body.text ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!text || text.length > 500) {
    return NextResponse.json({ error: 'text must be 1–500 characters' }, { status: 400 });
  }

  try {
    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            speed: 0.85, // slightly slower — easier for ESOL learners
          },
        }),
      },
    );

    if (!elevenResponse.ok) {
      const err = await elevenResponse.text().catch(() => 'unknown error');
      console.error('[TTS] ElevenLabs error:', elevenResponse.status, err);
      return NextResponse.json({ error: 'TTS service error' }, { status: 502 });
    }

    const audioBuffer = await elevenResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        // Cache for 24h — same sentence always produces the same audio
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('[TTS] fetch error:', err);
    return NextResponse.json({ error: 'TTS request failed' }, { status: 500 });
  }
}
