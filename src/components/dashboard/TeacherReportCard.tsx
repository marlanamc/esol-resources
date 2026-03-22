'use client';

import { useState, useEffect } from 'react';
import ReportSummaryStats from './ReportSummaryStats';
import PopularActivitiesChart from './PopularActivitiesChart';
import ActiveStudentsList from './ActiveStudentsList';
import RecentActivityFeed from './RecentActivityFeed';

interface PopularActivity {
  activityId: string;
  name: string;
  type: string;
  playCount: number;
  uniquePlayers: number;
}

interface ActiveStudent {
  userId: string;
  username: string;
  firstName: string;
  activitiesCompleted: number;
  pointsEarned: number;
  lastActivityReason?: string;
  lastActivityTime?: string;
}

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

interface ReportData {
  timeframe: 'daily' | 'weekly';
  lastUpdated: string;
  popularActivities: PopularActivity[];
  activeStudents: ActiveStudent[];
  recentActivity: RecentActivityEntry[];
  summary: {
    totalPlays: number;
    totalActiveStudents: number;
    totalPointsAwarded: number;
  };
}

interface ClassOption {
  id: string;
  name: string;
  studentCount: number;
}

type LearnerType = 'classroom' | 'independent' | 'all';

interface TeacherReportCardProps {
  initialData?: ReportData;
  classes?: ClassOption[];
  showLearnerTypeFilter?: boolean;
  classroomCount?: number;
  independentCount?: number;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export default function TeacherReportCard({
  initialData,
  classes = [],
  showLearnerTypeFilter = false,
  classroomCount = 0,
  independentCount = 0,
}: TeacherReportCardProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('weekly');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [learnerType, setLearnerType] = useState<LearnerType>('classroom');
  const [data, setData] = useState<ReportData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState('');

  // Update "time ago" text every minute
  useEffect(() => {
    if (data?.lastUpdated) {
      const updateText = () => setLastUpdatedText(timeAgo(data.lastUpdated));
      updateText();
      const interval = setInterval(updateText, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [data?.lastUpdated]);

  // Fetch data when timeframe, class, or learner type changes
  useEffect(() => {
    // Skip fetch if using initial data and timeframe is weekly
    if (initialData && timeframe === 'weekly' && selectedClassId === 'all' && learnerType === 'classroom' && !data) {
      setData(initialData);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ timeframe });
        if (selectedClassId !== 'all') {
          params.append('classId', selectedClassId);
        }
        if (learnerType !== 'classroom') {
          params.append('learnerType', learnerType);
        }

        const response = await fetch(
          `/api/teacher/activity-reports?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const reportData: ReportData = await response.json();
        setData(reportData);

        // Cache to localStorage
        const cacheKey = `teacher-report-${timeframe}-${selectedClassId}-${learnerType}`;
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: reportData,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Unable to load report. Please try again.');

        // Try to load from cache
        const cacheKey = `teacher-report-${timeframe}-${selectedClassId}-${learnerType}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            const cacheAge = Date.now() - timestamp;
            // Use cache if less than 1 hour old
            if (cacheAge < 3600000) {
              setData(cachedData);
              setError('Showing cached data');
            }
          } catch (cacheErr) {
            console.error('Error loading cached data:', cacheErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe, selectedClassId, learnerType]); // Fetch when timeframe, class, or learner type changes

  // Keyboard shortcuts (D for Daily, W for Weekly)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only if not typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.key === 'd' || e.key === 'D') && timeframe !== 'daily') {
        setTimeframe('daily');
      }
      if ((e.key === 'w' || e.key === 'W') && timeframe !== 'weekly') {
        setTimeframe('weekly');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timeframe]);

  return (
    <div
      className="dashboard-panel p-4 sm:p-6"
      role="region"
      aria-label="Class Activity Report"
    >
      {/* Header with Class Selector and Toggle */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Title and Timestamp */}
        <div>
          <h2 className="text-xl font-display font-bold text-text mb-1">
            Class Activity Report
          </h2>
          {lastUpdatedText && (
            <p className="text-xs text-text-muted">
              Updated {lastUpdatedText}
            </p>
          )}
        </div>

        {/* Learner Type Filter (Admin only) */}
        {showLearnerTypeFilter && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-text-muted">Learner Type:</span>
            <div className="inline-flex items-center rounded-lg p-1 bg-bg-light border border-border/40">
              {[
                { type: 'classroom' as LearnerType, label: 'Classroom', count: classroomCount },
                { type: 'independent' as LearnerType, label: 'Independent', count: independentCount },
                { type: 'all' as LearnerType, label: 'All', count: classroomCount + independentCount },
              ].map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setLearnerType(option.type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    learnerType === option.type
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-muted hover:text-text hover:bg-white'
                  }`}
                >
                  {option.label}
                  <span className={`ml-1 ${learnerType === option.type ? 'text-white/80' : 'text-text-light'}`}>
                    ({option.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Class Selector and Toggle Buttons Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Class Selector Dropdown - hide when viewing independent learners */}
          {classes.length > 0 && learnerType !== 'independent' && (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-white text-text font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full sm:w-auto"
            >
              <option value="all">All Classes ({classes.reduce((sum, c) => sum + c.studentCount, 0)} students)</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.studentCount} students)
                </option>
              ))}
            </select>
          )}

          {/* Toggle Buttons */}
          <div
            className="flex gap-2 w-full sm:w-auto sm:ml-auto"
            role="tablist"
            aria-label="Report timeframe"
          >
          <button
            role="tab"
            aria-selected={timeframe === 'daily'}
            onClick={() => setTimeframe('daily')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
              timeframe === 'daily'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/60 text-text-muted hover:bg-white hover:text-text'
            }`}
          >
            Daily
            <span className="hidden sm:inline text-xs ml-1 opacity-60">(D)</span>
          </button>
          <button
            role="tab"
            aria-selected={timeframe === 'weekly'}
            onClick={() => setTimeframe('weekly')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
              timeframe === 'weekly'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/60 text-text-muted hover:bg-white hover:text-text'
            }`}
          >
            Weekly
            <span className="hidden sm:inline text-xs ml-1 opacity-60">(W)</span>
          </button>
        </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
          {error !== 'Showing cached data' && (
            <button
              onClick={() => setTimeframe(timeframe)} // Trigger refetch
              className="ml-auto text-xs underline hover:no-underline"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div aria-live="polite">
        <ReportSummaryStats summary={data?.summary} loading={loading} />
      </div>

      {/* Recent Activity Feed - Primary Section */}
      <div className="mb-6" aria-live="polite">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">
          Recent Activity
        </h3>
        <RecentActivityFeed
          activities={data?.recentActivity || []}
          loading={loading}
        />
      </div>

      {/* Activities and Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite">
        {/* Popular Activities */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">
            Most Popular Activities
          </h3>
          <PopularActivitiesChart
            activities={data?.popularActivities || []}
            loading={loading}
          />
        </div>

        {/* Active Students */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">
            Most Active Students
          </h3>
          <ActiveStudentsList
            students={data?.activeStudents || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
