'use client';

import Link from 'next/link';

interface RecentActivityEntry {
  odgerId: string;
  userId: string;
  studentName: string;
  studentUsername: string;
  activity: string;
  activityType?: string;
  points: number;
  timestamp: string;
}

interface RecentActivityFeedProps {
  activities: RecentActivityEntry[];
  loading?: boolean;
}

// Activity type emoji mapping
const getActivityEmoji = (type?: string): string => {
  switch (type?.toLowerCase()) {
    case 'quiz':
      return '📝';
    case 'game':
    case 'numbers-game':
    case 'flashcard':
    case 'matching':
    case 'word-scramble':
      return '🎮';
    case 'guide':
    case 'interactive-guide':
      return '📖';
    case 'worksheet':
      return '📋';
    case 'slides':
      return '🎬';
    default:
      return '✨';
  }
};

// Relative time formatting
function timeAgo(dateString: string): string {
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

function SkeletonFeed() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-28" />
          </div>
          <div className="h-5 bg-gray-200 rounded w-12" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8 text-text-muted">
      <div className="text-4xl mb-3 opacity-40">📭</div>
      <p className="text-sm font-medium">No recent activity</p>
      <p className="text-xs mt-1">
        Student activity will appear here as they complete tasks.
      </p>
    </div>
  );
}

export default function RecentActivityFeed({
  activities,
  loading = false,
}: RecentActivityFeedProps) {
  if (loading) {
    return <SkeletonFeed />;
  }

  if (!activities || activities.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {activities.map((entry) => {
        const emoji = getActivityEmoji(entry.activityType);
        const relativeTime = timeAgo(entry.timestamp);

        return (
          <Link
            key={entry.odgerId}
            href={`/dashboard/students/${entry.userId}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-border/40 hover:bg-white hover:shadow-md hover:scale-[1.01] transition-all duration-200"
          >
            {/* Activity Type Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-lg shrink-0">
              {emoji}
            </div>

            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-text">
                  {entry.studentName}
                </span>
                <span className="text-xs text-text-muted">completed</span>
              </div>
              <p className="text-xs text-text-muted truncate mt-0.5">
                {entry.activity}
              </p>
            </div>

            {/* Points and Time */}
            <div className="flex flex-col items-end shrink-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
                +{entry.points}
              </span>
              <span className="text-[10px] text-text-light mt-1">
                {relativeTime}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
