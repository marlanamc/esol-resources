'use client';

import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { TrophyIcon, FlameIcon, CheckCircleIcon } from '@/components/icons/Icons';
import Link from 'next/link';
import { NotebookPen } from 'lucide-react';
import { Badge } from '@/components/ui';
import LeaderboardLoading from './loading';
import { getAvatarEmoji, getColorClass } from '@/lib/avatar-constants';

function LeaderboardAvatar({ avatar, avatarColor, size = "sm" }: { avatar: string | null; avatarColor: string | null; size?: "sm" | "md" }) {
  const emoji = getAvatarEmoji(avatar);
  const colorClass = getColorClass(avatarColor);
  const sizeClass = size === "sm" ? "w-8 h-8 text-base" : "w-10 h-10 text-lg";

  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center shadow-sm flex-shrink-0`}>
      <span className="select-none">{emoji}</span>
    </div>
  );
}

const STREAK_CHIP = 'text-orange-800 dark:text-orange-300';
const QUIZ_CHIP = 'text-violet-800 dark:text-violet-300';
const PRACTICE_CHIP = 'text-sky-800 dark:text-sky-300';

/** Short status pill for a leaderboard row. A key at the bottom of the page names each one. */
function StatusChip({
  icon,
  label,
  title,
  color,
  className = '',
  iconAfter = false,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  color?: string;
  className?: string;
  /** Put the icon after the label, e.g. "Quiz ✓". */
  iconAfter?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${className}`}
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color ?? 'currentColor'} 12%, transparent)`,
      }}
      title={title}
      aria-label={title}
    >
      {!iconAfter && icon}
      <span aria-hidden="true">{label}</span>
      {iconAfter && icon}
    </span>
  );
}

interface LeaderboardEntry {
  id: string;
  name: string;
  weeklyPoints: number;
  currentStreak: number;
  rank: number;
  rankChange: number | null;
  lastWeekRank: number | null;
  avatar: string | null;
  avatarColor: string | null;
  weekComplete: boolean;
  weeklyQuizComplete: boolean;
  completedWeeksCount: number;
  /** Days with a practice log in the selected week; display only, never part of the score. */
  practiceDays?: number;
}

const TROPHY_TILE_BG =
  "linear-gradient(135deg, var(--primary) 0%, var(--primary-color-dark) 100%)";

type LeaderboardPayload = {
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  viewerPoints: number;
  viewerCompletedWeeks: number;
  periodEnd: string | null;
  /** The viewer's own row when they rank below the visible all-time list. */
  viewerEntry: LeaderboardEntry | null;
  classId: string | null;
  periodLabel: string;
  currentWeekLabel: string;
  previousWeekLabel: string;
  lastWeekPoints: number;
};

interface ClassOption {
  id: string;
  name: string;
}

type LeaderboardScope = 'section' | 'all' | 'independent';
type LeaderboardTimeframe = 'week' | 'last-week' | 'all';
type ViewerRole = 'student' | 'teacher' | 'admin' | null;
type LearnerMode = 'classroom' | 'independent' | null;
type IsAdmin = boolean;

async function fetchLeaderboard({
  classId,
  scope = 'section',
  timeframe = 'week',
}: {
  classId?: string | null;
  scope?: LeaderboardScope;
  timeframe?: LeaderboardTimeframe;
} = {}): Promise<LeaderboardPayload & { scope: LeaderboardScope }> {
  const params = new URLSearchParams();
  if (classId) {
    params.set('classId', classId);
  }
  params.set('scope', scope);
  params.set('timeframe', timeframe);
  const response = await fetch(`/api/gamification/leaderboard${params.toString() ? `?${params.toString()}` : ''}`);
  if (!response.ok) {
    const raw = await response.text();
    let details = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: string; details?: string };
      details = parsed.details || parsed.error || raw;
    } catch {
      // keep raw body
    }
    throw new Error(`Failed to fetch leaderboard payload (${response.status}): ${details}`);
  }
  const data = await response.json();
  return {
    leaderboard: data.leaderboard || [],
    userRank: data.userRank || null,
    viewerPoints: data.viewerPoints ?? 0,
    viewerCompletedWeeks: data.viewerCompletedWeeks ?? 0,
    periodEnd: data.periodEnd ?? null,
    viewerEntry: data.viewerEntry || null,
    classId: data.classId || null,
    periodLabel: data.periodLabel,
    currentWeekLabel: data.currentWeekLabel,
    previousWeekLabel: data.previousWeekLabel,
    lastWeekPoints: data.lastWeekPoints ?? 0,
    scope: data.scope === 'all' || data.scope === 'independent' ? data.scope : 'section',
  };
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewerPoints, setViewerPoints] = useState(0);
  const [viewerCompletedWeeks, setViewerCompletedWeeks] = useState(0);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [periodLabel, setPeriodLabel] = useState('');
  const [currentWeekLabel, setCurrentWeekLabel] = useState('This week');
  const [previousWeekLabel, setPreviousWeekLabel] = useState('Last week');
  const [lastWeekPoints, setLastWeekPoints] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [viewerEntry, setViewerEntry] = useState<LeaderboardEntry | null>(null);
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('week');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [scope, setScope] = useState<LeaderboardScope>('section');
  const [viewerRole, setViewerRole] = useState<ViewerRole>(null);
  const [learnerMode, setLearnerMode] = useState<LearnerMode>(null);
  const [isAdmin, setIsAdmin] = useState<IsAdmin>(false);

  const applyPayload = (payload: LeaderboardPayload) => {
    setLeaderboard(payload.leaderboard);
    setUserRank(payload.userRank);
    setViewerPoints(payload.viewerPoints);
    setViewerCompletedWeeks(payload.viewerCompletedWeeks);
    setDaysLeft(payload.periodEnd
      ? Math.max(1, Math.ceil((new Date(payload.periodEnd).getTime() - Date.now()) / 86_400_000))
      : null);
    setViewerEntry(payload.viewerEntry);
    setPeriodLabel(payload.periodLabel);
    setCurrentWeekLabel(payload.currentWeekLabel);
    setPreviousWeekLabel(payload.previousWeekLabel);
    setLastWeekPoints(payload.lastWeekPoints);
    setErrorMessage(null);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [payload, contextResponse] = await Promise.all([
          fetchLeaderboard({ scope: 'section' }),
          fetch('/api/gamification/leaderboard/context'),
        ]);
        if (!contextResponse.ok) {
          throw new Error('Failed to fetch leaderboard context');
        }
        const contextData = await contextResponse.json();
        if (cancelled) return;
        applyPayload(payload);
        setClassOptions(contextData.classes || []);
        setViewerRole(contextData.viewerRole || null);
        setLearnerMode(contextData.learnerMode || null);
        setIsAdmin(contextData.isAdmin || false);
        setSelectedClassId(payload.classId || contextData.defaultClassId || null);
        setScope(
          contextData.learnerMode === 'independent' || contextData.defaultScope === 'independent'
            ? 'independent'
            : 'section'
        );
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        if (cancelled) return;
        setErrorMessage('We couldn’t load these standings. Your earned points are still saved.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onClassChange = async (classId: string) => {
    const normalizedClassId = classId || null;
    setSelectedClassId(normalizedClassId);
    setLoading(true);
    try {
      const payload = await fetchLeaderboard({ classId: normalizedClassId, scope, timeframe });
      applyPayload(payload);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setErrorMessage('We couldn’t load these standings. Your earned points are still saved.');
    } finally {
      setLoading(false);
    }
  };

  const onScopeChange = async (nextScope: LeaderboardScope) => {
    if (scope === nextScope) return;
    setScope(nextScope);
    setLoading(true);
    try {
      const payload = await fetchLeaderboard({ classId: selectedClassId, scope: nextScope, timeframe });
      applyPayload(payload);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setErrorMessage('We couldn’t load these standings. Your earned points are still saved.');
    } finally {
      setLoading(false);
    }
  };

  const onTimeframeChange = async (nextTimeframe: LeaderboardTimeframe) => {
    if (timeframe === nextTimeframe) return;
    setTimeframe(nextTimeframe);
    setLoading(true);
    try {
      const payload = await fetchLeaderboard({ classId: selectedClassId, scope, timeframe: nextTimeframe });
      applyPayload(payload);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setErrorMessage('We couldn’t load these standings. Your earned points are still saved.');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) {
      return {
        bg: 'color-mix(in srgb, #FFD700 12%, var(--surface-elevated))',
        border: 'color-mix(in srgb, #FFD700 58%, var(--border-strong))',
        text: 'color-mix(in srgb, #FFD700 72%, var(--color-text))',
      };
    }
    if (rank === 2) {
      return {
        bg: 'color-mix(in srgb, #C0C0C0 10%, var(--surface-elevated))',
        border: 'color-mix(in srgb, #C0C0C0 54%, var(--border-strong))',
        text: 'color-mix(in srgb, #C0C0C0 78%, var(--color-text))',
      };
    }
    if (rank === 3) {
      return {
        bg: 'color-mix(in srgb, #CD7F32 10%, var(--surface-elevated))',
        border: 'color-mix(in srgb, #CD7F32 56%, var(--border-strong))',
        text: 'color-mix(in srgb, #CD7F32 78%, var(--color-text))',
      };
    }
    return { bg: 'var(--surface-elevated)', border: 'var(--border-subtle)', text: 'var(--color-text)' };
  };

  const getRankIcon = (rank: number, hasScores: boolean = true) => {
    // When everyone is at 0, display a tie at #1 for clarity
    if (!hasScores) return '#1';
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankChangeIndicator = (rankChange: number | null) => {
    if (!rankChange) return null;
    if (rankChange > 0) return { icon: '↑', color: 'var(--success-color)', text: `+${rankChange}` };
    if (rankChange < 0) return { icon: '↓', color: 'var(--error-color)', text: `${rankChange}` };
    return { icon: '−', color: 'var(--color-text-muted)', text: '0' };
  };

  if (loading) {
    return <LeaderboardLoading />;
  }

  if (errorMessage) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p role="alert">{errorMessage}</p>
        <button type="button" className="min-h-11 px-4 underline" onClick={() => window.location.reload()}>Try again</button>
      </main>
    );
  }

  const hasNonZeroScores = leaderboard.some((entry) => entry.weeklyPoints > 0);
  const isAllTime = timeframe === 'all';
  // Historical chips describe the selected course week, never the whole unit.
  const isLastWeek = timeframe === 'last-week';
  const showWeekBadges = !isAllTime;
  // Once the learner has points this week, a compact this-week / last-week card replaces the saved row.
  const showWeekCard = timeframe === 'week' && viewerRole === 'student' && viewerPoints > 0;
  // All time gets the same card shape: total points and weeks finished.
  const showAllTimeCard = isAllTime && viewerRole === 'student' && viewerPoints > 0;
    const renderStatusChips = (entry: LeaderboardEntry, className = '') => {
    const showStreak = !isLastWeek && entry.currentStreak > 0;
    const showQuiz = showWeekBadges && entry.weeklyQuizComplete;
    const showWeek = showWeekBadges && entry.weekComplete;
    const practiceDays = showWeekBadges ? entry.practiceDays ?? 0 : 0;
    if (!showStreak && !showQuiz && !showWeek && !practiceDays) return null;
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {showStreak && (
          <StatusChip
            icon={<FlameIcon size={12} />}
            label={`${entry.currentStreak} ${entry.currentStreak === 1 ? 'day' : 'days'}`}
            title={`${entry.currentStreak} day streak`}
            className={STREAK_CHIP}
          />
        )}
        {showQuiz && (
          <StatusChip
            icon={<CheckCircleIcon size={12} />}
            iconAfter
            label="Quiz"
            title={`Finished the quiz for ${isLastWeek ? previousWeekLabel : currentWeekLabel}`}
            className={QUIZ_CHIP}
          />
        )}
        {showWeek && (
          <StatusChip
            icon={<CheckCircleIcon size={12} />}
            iconAfter
            label="Week done"
            title={`Finished every required activity for ${isLastWeek ? previousWeekLabel : currentWeekLabel}`}
            color="var(--success-color)"
          />
        )}
        {practiceDays > 0 && (
          <StatusChip
            icon={<NotebookPen size={12} aria-hidden />}
            label={`${practiceDays} ${practiceDays === 1 ? 'day' : 'days'}`}
            title={`Logged practice on ${practiceDays} ${practiceDays === 1 ? 'day' : 'days'} in ${isLastWeek ? previousWeekLabel : currentWeekLabel}`}
            className={PRACTICE_CHIP}
          />
        )}
      </div>
    );
  };
  const showPodium = hasNonZeroScores && leaderboard.some((entry) => entry.rank <= 3);
  // The podium already shows the top 3, so the list picks up at #4 to avoid repeating them.
  const listEntries = [
    ...leaderboard.filter((entry) => !showPodium || entry.rank > 3),
    ...(viewerEntry ? [viewerEntry] : []),
  ];
  const timeframeTabs = (
    <div
      role="group"
      aria-label="Leaderboard time range"
      className="inline-flex items-center rounded-full p-0.5 sm:rounded-lg sm:p-1"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-contrast)',
      }}
    >
      {([['week', currentWeekLabel], ['last-week', previousWeekLabel], ['all', 'All time']] as const).map(([value, label]) => {
        const selected = timeframe === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => void onTimeframeChange(value)}
            className="min-h-11 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full sm:rounded-md transition-all duration-200"
            style={
              selected
                ? { backgroundColor: 'var(--color-primary)', color: 'var(--text-on-accent)' }
                : { backgroundColor: 'transparent', color: 'var(--color-text-muted)' }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
  const studentScopeToggle = viewerRole === 'student' && learnerMode === 'independent' ? (
    <div
      className="inline-flex items-center rounded-full p-0.5 sm:rounded-lg sm:p-1"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-contrast)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 2px rgba(13,22,32,0.10)',
      }}
    >
      <button
        type="button"
        onClick={() => void onScopeChange('independent')}
        aria-pressed={scope === 'independent'}
        className="min-h-11 px-3 py-1 text-xs leading-none sm:px-4 sm:py-1.5 font-semibold sm:font-bold rounded-full sm:rounded-md transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-on-accent)',
          boxShadow: '0 1px 2px color-mix(in srgb, var(--color-primary) 28%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <span className="sm:hidden">Self-paced</span>
        <span className="hidden sm:inline">Self-paced</span>
      </button>
    </div>
  ) : viewerRole === 'student' ? (
    <div
      className="inline-flex items-center rounded-full p-0.5 sm:rounded-lg sm:p-1"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-contrast)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 2px rgba(13,22,32,0.10)',
      }}
    >
      <span
        className="inline-flex items-center px-3 py-1 text-[0.625rem] leading-none sm:px-4 sm:py-1.5 sm:text-xs font-semibold sm:font-bold rounded-full sm:rounded-md"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-on-accent)',
          boxShadow: '0 1px 2px color-mix(in srgb, var(--color-primary) 28%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        My Class
      </span>
    </div>
  ) : null;

  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="sticky top-0 backdrop-blur-lg border-b" style={{ zIndex: 200, backgroundColor: 'color-mix(in srgb, var(--surface-overlay) 96%, transparent)', borderColor: 'var(--border-subtle)', boxShadow: '0 1px 6px rgba(13,22,32,0.10)' }}>
        <div className="container mx-auto pt-2.5 pb-0.5 px-4 sm:py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: TROPHY_TILE_BG }}>
                <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--text-on-accent)' }} />
              </div>
              <div className="flex flex-col justify-center py-0.5 pt-1 sm:pt-0.5">
                <h1 className="text-[1.75rem] leading-[0.95] sm:text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  {scope === 'independent' ? 'Self-paced Leaderboard' : isAllTime ? 'All-Time Leaderboard' : `${isLastWeek ? previousWeekLabel : currentWeekLabel} Leaderboard`}
                </h1>
                {isLastWeek && (
                  <p className="text-[0.8125rem] sm:text-sm font-medium leading-tight mt-1 sm:mt-0.5" style={{ color: 'var(--success-color)' }}>
                    Celebrating last week’s effort
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {viewerRole === 'student' ? (
                <div className="hidden sm:inline-flex">
                  {studentScopeToggle}
                </div>
              ) : (
                <>
                  {/* Admin scope toggle - allows viewing independent learners */}
                  {isAdmin && (
                    <div
                      className="inline-flex items-center rounded-lg p-1"
                      style={{
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--surface-contrast)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => void onScopeChange('section')}
                        aria-pressed={scope === 'section'}
                        className="px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200"
                        style={
                          scope === 'section'
                            ? {
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--text-on-accent)',
                              }
                            : {
                                backgroundColor: 'transparent',
                                color: 'var(--color-text-muted)',
                              }
                        }
                      >
                        Classroom
                      </button>
                      <button
                        type="button"
                        onClick={() => void onScopeChange('independent')}
                        aria-pressed={scope === 'independent'}
                        className="px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200"
                        style={
                          scope === 'independent'
                            ? {
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--text-on-accent)',
                              }
                            : {
                                backgroundColor: 'transparent',
                                color: 'var(--color-text-muted)',
                              }
                        }
                      >
                        Independent
                      </button>
                    </div>
                  )}
                  {/* Class selector - hide when viewing independent learners */}
                  {classOptions.length > 1 && scope !== 'independent' && (
                    <div className="inline-flex items-center rounded-lg border px-3 py-1.5 shadow-sm" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-elevated)' }}>
                      <select
                        id="leaderboard-class"
                        value={selectedClassId || ''}
                        onChange={(e) => void onClassChange(e.target.value)}
                        className="border-none bg-transparent text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {classOptions.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 space-y-6 pb-28 md:pb-10">
        <div className="flex justify-center">{timeframeTabs}</div>

        {!isAllTime && (
        <section className="text-center space-y-2" aria-label="Scoring period">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{periodLabel}</span>
          </p>
          {isLastWeek && scope !== 'independent' && previousWeekLabel.startsWith('Week ') && (
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Quiz and Week done show saved completion for {previousWeekLabel}, including catch-up work.
            </p>
          )}
        </section>
        )}
        {showAllTimeCard && (
          <section
            className="grid grid-cols-2 overflow-hidden rounded-2xl border"
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
            aria-label="Your total points"
          >
            <div className="flex min-w-0 flex-col gap-0.5 px-3 py-2 sm:px-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>All time</span>
                {userRank && (
                  <span
                    className="rounded-full px-2 text-xs font-bold tabular-nums"
                    style={{ color: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--surface-elevated))' }}
                    aria-label={`Rank ${userRank}`}
                  >
                    #{userRank}
                  </span>
                )}
              </div>
              <span className="text-xl font-bold tabular-nums sm:text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                {viewerPoints.toLocaleString()}
                <span className="ml-1 text-sm font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>pts</span>
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 border-l px-3 py-2 sm:px-4" style={{ backgroundColor: 'var(--surface-contrast)', borderColor: 'var(--border-subtle)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>Weeks done</span>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold tabular-nums sm:text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  {viewerCompletedWeeks}
                  <span className="ml-1 text-sm font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                    {viewerCompletedWeeks === 1 ? 'week' : 'weeks'}
                  </span>
                </span>
                {viewerCompletedWeeks > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--success-color)', color: 'var(--surface-elevated)' }} aria-hidden>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </section>
        )}
        {showWeekCard && (
          <section
            className="grid grid-cols-2 overflow-hidden rounded-2xl border"
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
            aria-label="Your points"
          >
            <div className="flex min-w-0 flex-col gap-0.5 px-3 py-2 sm:px-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>{currentWeekLabel}</span>
                {userRank && (
                  <span
                    className="rounded-full px-2 text-xs font-bold tabular-nums"
                    style={{ color: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--surface-elevated))' }}
                    aria-label={`Rank ${userRank}`}
                  >
                    #{userRank}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="text-xl font-bold tabular-nums sm:text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  {viewerPoints.toLocaleString()}
                  <span className="ml-1 text-sm font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>pts</span>
                </span>
                {daysLeft !== null && (
                  <span className="flex min-w-0 flex-1 items-center gap-1.5 whitespace-nowrap text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="hidden h-1.5 max-w-28 min-w-7 flex-1 overflow-hidden rounded-full sm:block" style={{ backgroundColor: 'var(--border-subtle)' }} aria-hidden>
                      <span className="block h-full rounded-full" style={{ width: `${Math.round(((7 - daysLeft) / 7) * 100)}%`, minWidth: '6%', backgroundColor: 'var(--color-primary)' }} />
                    </span>
                    {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                  </span>
                )}
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 border-l px-3 py-2 sm:px-4" style={{ backgroundColor: 'var(--surface-contrast)', borderColor: 'var(--border-subtle)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>{previousWeekLabel}</span>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold tabular-nums sm:text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  {lastWeekPoints.toLocaleString()}
                  <span className="ml-1 text-sm font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>pts</span>
                </span>
                {lastWeekPoints > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--success-color)' }}>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--success-color)', color: 'var(--surface-elevated)' }} aria-hidden>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    </span>
                    Saved
                  </span>
                )}
              </div>
            </div>
          </section>
        )}
        {/* Top 3 Podium — desktop + compact mobile variants (hidden if everyone is at 0) */}
        {showPodium && (() => {
          // Get all students in top 3 ranks (handles ties)
          const rank1Students = leaderboard.filter(entry => entry.rank === 1);
          const rank2Students = leaderboard.filter(entry => entry.rank === 2);
          const rank3Students = leaderboard.filter(entry => entry.rank === 3);
          const topStudents = [...rank1Students, ...rank2Students, ...rank3Students];

          // Per-rank glow color feeds the shared .animate-medal-glow utility (--medal-glow-color)
          const glowFor = (rank: number) =>
            rank === 1 ? 'rgba(233,196,106,0.55)' : rank === 2 ? 'rgba(192,192,192,0.45)' : 'rgba(205,127,50,0.45)';
          const youLabel = (
            <span className="ml-1 text-[0.6875rem] font-bold" style={{ color: 'var(--color-primary)' }}>
              (You)
            </span>
          );

          return (
            <>
              {/* Desktop podium — champions rise above on an aligned baseline */}
              <div className="hidden md:flex flex-wrap items-end justify-center gap-4 mb-8">
                {topStudents.map((student, index) => {
                  const isChampion = student.rank === 1;
                  const colors = getRankColor(student.rank);
                  return (
                    <div
                      key={student.id}
                      className="flex-shrink-0 animate-medal-reveal"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <div
                        className={`relative overflow-hidden border-2 rounded-3xl px-5 text-center ${
                          isChampion
                            ? 'min-w-0 max-w-full sm:min-w-[210px] py-6 animate-medal-glow animate-shine-sweep'
                            : 'min-w-0 max-w-full sm:min-w-[180px] py-4'
                        }`}
                        style={{
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                          boxShadow: isChampion
                            ? '0 16px 40px rgba(233,196,106,0.30)'
                            : '0 8px 20px rgba(13,22,32,0.10)',
                          ...(isChampion ? { ['--medal-glow-color']: glowFor(student.rank) } : {}),
                        } as CSSProperties}
                      >
                        {isChampion && (
                          <span
                            className="block text-[0.6875rem] font-bold tracking-[0.18em] uppercase mb-1"
                            style={{ fontFamily: 'var(--font-display)', color: 'color-mix(in srgb, #e9c46a 78%, var(--color-text))' }}
                          >
                            Champion
                          </span>
                        )}
                        <div className={`${isChampion ? 'text-6xl animate-medal-float' : 'text-4xl'} mb-2`}>
                          {getRankIcon(student.rank)}
                        </div>
                        {student.avatar && (
                          <div className="flex justify-center mb-2">
                            <LeaderboardAvatar avatar={student.avatar} avatarColor={student.avatarColor} size="md" />
                          </div>
                        )}
                        <p
                          className={`font-bold truncate ${isChampion ? 'text-xl' : 'text-lg'}`}
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                        >
                          {student.name}
                          {student.rank === userRank && youLabel}
                        </p>
                        <div className="mt-2">
                          <Badge variant={isChampion ? 'warning' : 'secondary'}>
                            {student.weeklyPoints} pts
                          </Badge>
                        </div>
                        {renderStatusChips(student, 'mt-3 justify-center')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile podium — compact strip so phone learners still see the top of the board */}
              <div className="flex md:hidden flex-wrap items-end justify-center gap-2.5 mb-6">
                {topStudents.map((student, index) => {
                  const isChampion = student.rank === 1;
                  const colors = getRankColor(student.rank);
                  return (
                    <div
                      key={student.id}
                      className="flex-shrink-0 animate-medal-reveal"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div
                        className={`relative overflow-hidden border-2 rounded-2xl px-3 py-3 text-center w-[106px] ${
                          isChampion ? 'animate-medal-glow' : ''
                        }`}
                        style={{
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                          boxShadow: isChampion
                            ? '0 10px 24px rgba(233,196,106,0.28)'
                            : '0 6px 14px rgba(13,22,32,0.10)',
                          ...(isChampion ? { ['--medal-glow-color']: glowFor(student.rank) } : {}),
                        } as CSSProperties}
                      >
                        <div className={`${isChampion ? 'text-3xl animate-medal-float' : 'text-2xl'} mb-1`}>
                          {getRankIcon(student.rank)}
                        </div>
                        {student.avatar && (
                          <div className="flex justify-center mb-1">
                            <LeaderboardAvatar avatar={student.avatar} avatarColor={student.avatarColor} size="sm" />
                          </div>
                        )}
                        <p className="font-bold text-xs truncate" style={{ color: 'var(--color-text)' }}>
                          {student.name}
                        </p>
                        {student.rank === userRank && (
                          <p className="text-[0.625rem] font-bold leading-tight" style={{ color: 'var(--color-primary)' }}>
                            (You)
                          </p>
                        )}
                        <p className="text-[0.6875rem] font-semibold mt-0.5" style={{ color: 'var(--success-color)' }}>
                          {student.weeklyPoints} pts
                        </p>
                        {renderStatusChips(student, 'mt-1.5 flex-wrap justify-center')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* Full Leaderboard — starts at #4 when the podium is showing */}
        {listEntries.length > 0 && (
          <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', boxShadow: '0 4px 12px rgba(13,22,32,0.12)' }}>
            <div className="border-b p-4" style={{ backgroundColor: 'var(--surface-contrast)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  {showPodium ? 'Everyone else' : 'All Rankings'}
                </h2>
                {viewerRole === 'student' ? (
                  <div className="sm:hidden">
                    {studentScopeToggle}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {listEntries.map((entry) => {
              const rankColors = getRankColor(entry.rank);
              const rankChange = getRankChangeIndicator(entry.rankChange);
              const isUserRow = entry.rank === userRank;
              const isDetachedViewerRow = entry === viewerEntry;

              return (
                <Fragment key={entry.id}>
                {isDetachedViewerRow && (
                  <div
                    className="px-4 py-1.5 text-center text-xs font-bold tracking-wide"
                    style={{ backgroundColor: 'var(--surface-contrast)', color: 'var(--color-text-muted)' }}
                  >
                    Your place
                  </div>
                )}
                <div
                  className={`relative flex items-center justify-between gap-3 px-4 py-2.5 leading-none transition-all animate-card-lift ${isUserRow ? 'border-l-4' : ''}`}
                    style={{
                    backgroundColor: isUserRow ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'transparent',
                    borderLeftColor: isUserRow ? 'var(--color-primary)' : 'transparent',
                  }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="w-10 shrink-0 text-center">
                      <span
                        className={`font-bold leading-none ${entry.rank <= 3 && hasNonZeroScores ? 'text-2xl' : 'text-xl'}`}
                        style={{
                          color: rankColors.text,
                          filter: entry.rank <= 3 && hasNonZeroScores ? 'drop-shadow(0 2px 4px rgba(13,22,32,0.18))' : undefined,
                        }}
                      >
                        {getRankIcon(entry.rank, hasNonZeroScores)}
                      </span>
                    </div>
                    {entry.avatar ? (
                      <LeaderboardAvatar avatar={entry.avatar} avatarColor={entry.avatarColor} size="sm" />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-subtle)]">
                        <span className="text-sm font-semibold text-text-muted">
                          {entry.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
                        {entry.name}
                        {isUserRow && (
                          <span className="ml-2 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                            (You)
                          </span>
                        )}
                      </div>
                      {renderStatusChips(entry, 'mt-1 flex-wrap gap-y-1')}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-base font-bold tabular-nums leading-none" style={{ color: 'var(--color-text)' }}>
                      {entry.weeklyPoints}
                      <span className="ml-1 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>pts</span>
                    </div>
                    {rankChange && (
                      <div
                        className="mt-1 flex items-center justify-end gap-0.5 text-xs font-bold leading-none"
                        style={{ color: rankChange.color }}
                        title="Change since last week"
                      >
                        <span>{rankChange.icon}</span>
                        <span>{Math.abs(entry.rankChange || 0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                </Fragment>
              );
              })}
            </div>
          </div>
        )}
        {leaderboard.length === 0 && !isLastWeek && (
          <section
            className="flex flex-col items-center gap-6 rounded-2xl border px-4 pt-10 pb-8 text-center sm:px-6"
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', boxShadow: '0 4px 12px rgba(13,22,32,0.12)' }}
            aria-label="No points yet this week"
          >
            {/* Empty podium in 2-1-3 order, matching the real podium */}
            <div className="flex items-end justify-center gap-2.5 sm:gap-4" aria-hidden>
              {([2, 1, 3] as const).map((place) => {
                const isFirst = place === 1;
                return (
                  <div key={place} className="flex w-[84px] flex-col items-center gap-2 sm:w-28">
                    <span
                      className={`flex items-center justify-center rounded-full border-2 border-dashed font-bold ${isFirst ? 'h-14 w-14 text-sm animate-medal-float' : 'h-11 w-11 text-lg'}`}
                      style={isFirst
                        ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--surface-elevated))' }
                        : { borderColor: 'var(--border-subtle)', color: 'var(--color-text-muted)' }}
                    >
                      {isFirst && viewerRole === 'student' ? 'You?' : '?'}
                    </span>
                    <span
                      className={`flex w-full items-center justify-center rounded-t-xl rounded-b-sm border-2 border-dashed text-2xl font-bold ${isFirst ? 'h-[86px] sm:h-28' : place === 2 ? 'h-16 sm:h-20' : 'h-12 sm:h-[60px]'}`}
                      style={{
                        fontFamily: 'var(--font-display)',
                        borderColor: isFirst ? 'rgba(217,169,60,0.75)' : 'var(--border-subtle)',
                        color: isFirst ? 'rgb(217,169,60)' : 'var(--color-text-muted)',
                      }}
                    >
                      {place}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Who will be first?
            </p>
            {viewerRole === 'student' && (
              <Link
                href="/dashboard/activities"
                className="inline-flex min-h-11 items-center rounded-xl px-5 font-bold"
                style={{ background: 'var(--color-primary)', color: 'var(--text-on-accent)' }}
              >
                Start an activity
              </Link>
            )}
          </section>
        )}
        {leaderboard.length === 0 && isLastWeek && (
          <div className="relative overflow-hidden border rounded-2xl text-center py-14 px-6" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', boxShadow: '0 4px 12px rgba(13,22,32,0.12)' }}>
            <div className="relative inline-flex items-center justify-center mb-5">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 42%, transparent), transparent 70%)' }}
                aria-hidden
              />
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center animate-medal-float"
                style={{ background: TROPHY_TILE_BG }}
              >
                <TrophyIcon className="w-10 h-10" style={{ color: 'var(--text-on-accent)' }} />
              </div>
            </div>
            <p className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              No points recorded last week
            </p>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              There is a new chance to practice and earn points this week.
            </p>
          </div>
        )}
        {leaderboard.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
            role="note"
            aria-label="Key"
          >
            <span className="font-bold tracking-wide uppercase">Key</span>
            {!isLastWeek && (
              <span className="inline-flex items-center gap-1.5">
                <FlameIcon size={14} aria-hidden className={STREAK_CHIP} />
                days in a row
              </span>
            )}
            {showWeekBadges && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <NotebookPen size={14} aria-hidden className={PRACTICE_CHIP} />
                  days logged
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircleIcon size={14} aria-hidden className={QUIZ_CHIP} />
                  quiz done
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircleIcon size={14} aria-hidden style={{ color: 'var(--success-color)' }} />
                  week done
                </span>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
