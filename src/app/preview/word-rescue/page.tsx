import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import WordRescueGame from '@/components/games/WordRescue/WordRescueGame';

export default function WordRescuePreview() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <Suspense fallback={<p>Loading practice…</p>}><WordRescueGame preview /></Suspense>;
}
