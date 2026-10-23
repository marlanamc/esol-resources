/** Server-rendered review: all saved answers remain available to the teacher. */
export function QuizAttemptHistory({ attempts }: { attempts: { id: string; content: string; score: number | null; completedAt: Date; pointsAwarded: number }[] }) {
  if (!attempts.length) return null;
  return <details className="mt-3 w-full text-sm text-text">
    <summary className="min-h-11 cursor-pointer py-3 font-semibold">Review {attempts.length} saved attempt{attempts.length === 1 ? '' : 's'}</summary>
    <div className="space-y-3">
      {attempts.map(attempt => {
        let answers: Record<string, unknown> = {};
        try { answers = JSON.parse(attempt.content)?.answers ?? {}; } catch { /* Preserve unparseable historical data in storage. */ }
        return <details key={attempt.id} className="rounded-xl border border-border p-3">
          <summary className="min-h-11 cursor-pointer py-2">{attempt.score === null ? 'Not scored' : `${attempt.score}%`} · {attempt.completedAt.toLocaleString('en-US', { timeZone: 'America/New_York' })} · {attempt.pointsAwarded} points</summary>
          <dl className="space-y-2 break-words">
            {Object.entries(answers).map(([question, answer]) => <div key={question}>
              <dt className="font-semibold">{question}</dt>
              <dd>{answer && typeof answer === 'object'
                ? Object.entries(answer).map(([form, value]) => <span className="mr-3 inline-block" key={form}>{form}: {String(value)}</span>)
                : String(answer ?? '')}</dd>
            </div>)}
          </dl>
        </details>;
      })}
    </div>
  </details>;
}
