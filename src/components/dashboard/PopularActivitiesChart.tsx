'use client';

interface PopularActivity {
  activityId: string;
  name: string;
  type: string;
  playCount: number;
  uniquePlayers: number;
}

interface PopularActivitiesChartProps {
  activities: PopularActivity[];
  loading?: boolean;
}

// Activity type icons
const getActivityIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    'interactive-guide': '📝',
    quiz: '✏️',
    worksheet: '📄',
    slides: '📊',
    flashcards: '🎴',
    matching: '🎯',
    'fill-in-blank': '✍️',
    'numbers-game': '🎮',
    'word-scramble': '🔤',
  };
  return iconMap[type] || '📚';
};

function SkeletonActivitiesChart() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
          </div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8 text-text-muted">
      <div className="text-4xl mb-3 opacity-40">📭</div>
      <p className="text-sm font-medium">No activities completed yet</p>
      <p className="text-xs mt-1">Check back once students start working!</p>
    </div>
  );
}

export default function PopularActivitiesChart({
  activities,
  loading = false,
}: PopularActivitiesChartProps) {
  if (loading) {
    return <SkeletonActivitiesChart />;
  }

  if (!activities || activities.length === 0) {
    return <EmptyState />;
  }

  const maxPlayCount = Math.max(...activities.map((a) => a.playCount));

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const percentage = (activity.playCount / maxPlayCount) * 100;
        const icon = getActivityIcon(activity.type);

        return (
          <div
            key={activity.activityId}
            className="group hover:scale-[1.01] transition-transform duration-200"
          >
            {/* Activity Name */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{icon}</span>
              <p className="text-sm font-bold text-text truncate flex-1">
                {activity.name}
              </p>
              <span className="text-xs font-bold text-primary shrink-0">
                {activity.playCount} plays
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-secondary/10 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Unique Players Count */}
            <p className="text-xs text-text-muted mt-1">
              {activity.uniquePlayers} student{activity.uniquePlayers !== 1 ? 's' : ''}
            </p>
          </div>
        );
      })}
    </div>
  );
}
