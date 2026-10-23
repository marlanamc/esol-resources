'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VerbQuizContent, VerbQuizAnswers, VerbQuizSubmission } from '@/types/verb-quiz';
import VerbQuiz from './VerbQuiz';
import VerbQuizResults from './VerbQuizResults';
import { PointsToast } from '@/components/ui/PointsToast';
import { generateIdempotencyKey, submissionSavedEventName, submitWithOutbox } from '@/lib/submissionOutbox';

interface VerbQuizContainerProps {
  content: VerbQuizContent;
  activityId: string;
  assignmentId?: string | null;
  activityTitle?: string;
  existingSubmission?: { id: string; content: unknown; score: number | null; pointsAwarded?: number } | null;
}
type Receipt = { error?: string; quizResult?: VerbQuizSubmission; points?: number; score?: number };

export default function VerbQuizContainer({ content, activityId, assignmentId, activityTitle, existingSubmission }: VerbQuizContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState('');
  const attemptKey = useRef<string | null>(null);
  const pendingKey = useRef<string | null>(null);
  const submitting = useRef(false);
  const [submission, setSubmission] = useState<VerbQuizSubmission | null>(existingSubmission?.content
    ? { ...existingSubmission.content as VerbQuizSubmission, totalPoints: existingSubmission.pointsAwarded ?? 0 } : null);
  const [bestScore, setBestScore] = useState(existingSubmission?.score ?? submission?.score ?? 0);
  const [pointsToast, setPointsToast] = useState<number | null>(null);

  function showReceipt(receipt: Receipt) {
    if (!receipt.quizResult) throw new Error('Refresh this page to see your saved result.');
    setSubmission({ ...receipt.quizResult, totalPoints: receipt.points ?? 0 });
    setBestScore(previous => Math.max(previous, receipt.score ?? receipt.quizResult!.score));
    if (receipt.points && receipt.points > 0) setPointsToast(receipt.points);
  }

  useEffect(() => {
    const onSaved = (event: Event) => {
      const { idempotencyKey, result } = (event as CustomEvent<{ idempotencyKey: string; result: Receipt }>).detail;
      if (idempotencyKey !== pendingKey.current || !result.quizResult) return;
      pendingKey.current = null;
      setQueued(false);
      showReceipt(result);
    };
    window.addEventListener(submissionSavedEventName, onSaved);
    return () => window.removeEventListener(submissionSavedEventName, onSaved);
  }, []);

  const handleComplete = async (answers: VerbQuizAnswers) => {
    if (submitting.current || queued) return;
    submitting.current = true;
    setIsSubmitting(true);
    setError('');
    attemptKey.current ??= generateIdempotencyKey();
    try {
      const sent = await submitWithOutbox({ endpoint: '/api/activity/submit', method: 'POST', idempotencyKey: attemptKey.current,
        payload: { activityId, assignmentId: assignmentId ?? null, content: { answers } } });
      if (sent.queued) { pendingKey.current = sent.idempotencyKey; setQueued(true); return; }
      const receipt: Receipt = await sent.response.json();
      if (!sent.response.ok) throw new Error(receipt.error || 'Your quiz could not be saved. Please try again.');
      showReceipt(receipt);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
    } finally { submitting.current = false; setIsSubmitting(false); }
  };

  const handleRetake = () => {
    setSubmission(null); // Remounting VerbQuiz clears every answer and its progress.
    attemptKey.current = null;
    setPointsToast(null);
    setError('');
    window.scrollTo({ top: 0 });
  };

  return <>
    {pointsToast !== null && <PointsToast points={pointsToast} onComplete={() => setPointsToast(null)} />}
    {submission ? <VerbQuizResults content={content} submission={submission} bestScore={bestScore} onRetake={handleRetake} />
      : <VerbQuiz content={content} activityId={activityId} activityTitle={activityTitle} onComplete={handleComplete} isSubmitting={isSubmitting || queued} />}
    {queued && <p role="status" className="mt-4 rounded-xl bg-bg-light p-4 text-text">Saved on this device. Your quiz will submit when you reconnect; results and points appear after it syncs.</p>}
    {error && <p role="alert" className="mt-4 text-red-700 dark:text-red-300">{error}</p>}
  </>;
}
