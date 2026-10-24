import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { checkRateLimit } from '@/lib/api/rate-limit';

// ElevenLabs voice: Rachel — clear, warm American English. Good for ESOL instruction.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const API_KEY = process.env.ELEVENLABS_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });
  }

  let text: string;
  try {
    const body = await request.json();
    text = typeof body?.text === 'string' ? body.text.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!text || text.length > 500) {
    return NextResponse.json({ error: 'text must be 1–500 characters' }, { status: 400 });
  }

  // This endpoint spends paid credits. Use the shared store, and refuse paid
  // work on a store outage instead of inheriting the login limiter's fail-open policy.
  const limits = await Promise.all([
    checkRateLimit(`tts:minute:${session.user.id}`, { limit: 30, windowSeconds: 60, failClosed: true }),
    checkRateLimit(`tts:day:${session.user.id}`, { limit: 500, windowSeconds: 86400, failClosed: true }),
  ]);
  if (limits.some(allowed => !allowed)) {
    return NextResponse.json({ error: 'Audio request limit reached. Please try again later.' }, { status: 429 });
  }

  try {
    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
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
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[TTS] fetch error:', err);
    return NextResponse.json({ error: 'TTS request failed' }, { status: 500 });
  }
}
