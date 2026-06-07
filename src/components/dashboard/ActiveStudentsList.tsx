'use client';

import Link from 'next/link';

interface ActiveStudent {
  userId: string;
  username: string;
  firstName: string;
  activitiesCompleted: number;
  pointsEarned: number;
  lastActivityReason?: string;
  lastActivityTime?: string;
}

// Relative time formatting
function timeAgo(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

interface ActiveStudentsListProps {
  students: ActiveStudent[];
  loading?: boolean;
}

// Rank badge emojis
const getRankBadge = (rank: number): string => {
  switch (rank) {
    case 1:
      return '🏆'; // Gold
    case 2:
      return '🥈'; // Silver
    case 3:
      return '🥉'; // Bronze
    default:
      return '⭐'; // Star
  }
};

function SkeletonStudentsList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8 text-text-muted">
      <div className="text-4xl mb-3 opacity-40">👥</div>
      <p className="text-sm font-medium">No active students yet</p>
      <p className="text-xs mt-1">
        Students will appear here once they start activities.
      </p>
    </div>
  );
}

export default function ActiveStudentsList({
  students,
  loading = false,
}: ActiveStudentsListProps) {
  if (loading) {
    return <SkeletonStudentsList />;
  }

  if (!students || students.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {students.map((student, idx) => {
        const rank = idx + 1;
        const badge = getRankBadge(rank);

        return (
          <Link
            key={student.userId}
            href={`/teach/students/${student.userId}`}
            className="dashboard-soft-button flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-border/40 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            {/* Rank Badge */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-lg shrink-0">
              {badge}
            </div>

            {/* Student Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted">
                  #{rank}
                </span>
                <p className="font-bold text-sm text-text truncate">
                  {student.firstName}
                </p>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {student.activitiesCompleted} activities • {student.pointsEarned} pts
              </p>
              {student.lastActivityReason && (
                <p className="text-[11px] text-text-light mt-1 truncate">
                  {student.lastActivityReason}
                  {student.lastActivityTime && (
                    <span className="ml-1 opacity-70">• {timeAgo(student.lastActivityTime)}</span>
                  )}
                </p>
              )}
            </div>

            {/* Arrow indicator */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
