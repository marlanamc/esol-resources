'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VerbQuizContent, VerbQuizAnswers, VerbQuizSubmission } from '@/types/verb-quiz';
import VerbQuiz from './VerbQuiz';
import VerbQuizResults from './VerbQuizResults';

interface VerbQuizContainerProps {
  content: VerbQuizContent;
  activityId: string;
  existingSubmission?: {
    id: string;
    content: any;
    score: number | null;
  } | null;
}

export default function VerbQuizContainer({
  content,
  activityId,
  existingSubmission
}: VerbQuizContainerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<VerbQuizSubmission | null>(
    existingSubmission?.content ? existingSubmission.content as VerbQuizSubmission : null
  );

  const handleComplete = async (answers: VerbQuizAnswers, score: number) => {
    setIsSubmitting(true);

    try {
      // Calculate detailed results
      const results: VerbQuizSubmission['results'] = {};
      let correctCount = 0;

      Object.entries(content.verbs).forEach(([verb, correctAnswers]) => {
        const userAnswers = answers[verb];
        results[verb] = {
          v1_3rd: userAnswers.v1_3rd.toLowerCase() === correctAnswers.v1_3rd.toLowerCase(),
          v1_ing: userAnswers.v1_ing.toLowerCase() === correctAnswers.v1_ing.toLowerCase(),
          v2: userAnswers.v2.toLowerCase() === correctAnswers.v2.toLowerCase(),
          v3: userAnswers.v3.toLowerCase() === correctAnswers.v3.toLowerCase(),
        };

        correctCount += Object.values(results[verb]).filter(Boolean).length;
      });

      const totalForms = Object.keys(content.verbs).length * 4;

      // Calculate points based on gamification system
      let totalPoints = 10; // Base points for quiz completion
      if (score === 100) {
        totalPoints += 20; // Perfect score bonus
      } else if (score >= 90) {
        totalPoints += 10; // High score bonus
      } else if (score >= 80) {
        totalPoints += 5; // Good score bonus
      }

      const submissionData: VerbQuizSubmission = {
        answers,
        score,
        totalPoints,
        correctCount,
        totalForms,
        results,
        submittedAt: new Date().toISOString(),
      };

      // Submit to API
      const response = await fetch('/api/activity/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          content: submissionData,
          score,
          points: totalPoints,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      setSubmission(submissionData);
      router.refresh(); // Refresh to update progress badge
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSubmission(null);
    router.refresh();
  };

  if (submission) {
    return (
      <VerbQuizResults
        content={content}
        submission={submission}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <VerbQuiz
      content={content}
      activityId={activityId}
      onComplete={handleComplete}
      isSubmitting={isSubmitting}
    />
  );
}
