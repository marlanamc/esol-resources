'use client';

import { StatCard } from '@/components/ui/StatCard';

interface ReportSummaryStatsProps {
  summary?: {
    totalPlays: number;
    totalActiveStudents: number;
    totalPointsAwarded: number;
  };
  loading?: boolean;
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`group flex items-center gap-4 ${i === 3 ? 'col-span-2 md:col-span-1' : ''}`}
        >
          <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-20" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple icon components (SVGs)
function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function ReportSummaryStats({
  summary,
  loading = false,
}: ReportSummaryStatsProps) {
  if (loading) {
    return <SkeletonStats />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      <StatCard
        variant="minimal"
        label="Total Plays"
        value={summary?.totalPlays || 0}
        icon={<PlayIcon />}
        color="primary"
      />
      <StatCard
        variant="minimal"
        label="Active Students"
        value={summary?.totalActiveStudents || 0}
        icon={<UsersIcon />}
        color="secondary"
      />
      <StatCard
        variant="minimal"
        label="Points Awarded"
        value={summary?.totalPointsAwarded || 0}
        icon={<StarIcon />}
        color="accent"
        className="col-span-2 md:col-span-1"
      />
    </div>
  );
}
