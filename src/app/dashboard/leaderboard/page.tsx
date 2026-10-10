'use client';

import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { TrophyIcon, FlameIcon, CheckCircleIcon } from '@/components/icons/Icons';
import { Badge } from '@/components/ui';
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

/** Short status pill for a leaderboard row; the key above the list explains each one. */
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
}

const TROPHY_TILE_BG =
  "linear-gradient(135deg, var(--primary) 0%, var(--primary-color-dark) 100%)";

type LeaderboardPayload = {
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  /** The viewer's own row when they rank below the visible all-time list. */
  viewerEntry: LeaderboardEntry | null;
  classId: string | null;
};

interface ClassOption {
  id: string;
  name: string;
}

type LeaderboardScope = 'section' | 'all' | 'independent';
type LeaderboardTimeframe = 'week' | 'all';
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
    viewerEntry: data.viewerEntry || null,
    classId: data.classId || null,
    scope: data.scope === 'all' || data.scope === 'independent' ? data.scope : 'section',
  };
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [viewerEntry, setViewerEntry] = useState<LeaderboardEntry | null>(null);
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('week');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [scope, setScope] = useState<LeaderboardScope>('section');
  const [viewerRole, setViewerRole] = useState<ViewerRole>(null);
  const [learnerMode, setLearnerMode] = useState<LearnerMode>(null);
  const [isAdmin, setIsAdmin] = useState<IsAdmin>(false);

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
        setLeaderboard(payload.leaderboard);
        setUserRank(payload.userRank);
        setViewerEntry(payload.viewerEntry);
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
      setLeaderboard(payload.leaderboard);
      setUserRank(payload.userRank);
      setViewerEntry(payload.viewerEntry);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
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
      setLeaderboard(payload.leaderboard);
      setUserRank(payload.userRank);
      setViewerEntry(payload.viewerEntry);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
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
      setLeaderboard(payload.leaderboard);
      setUserRank(payload.userRank);
      setViewerEntry(payload.viewerEntry);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
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
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center px-6">
          <TrophyIcon className="w-16 h-16 mx-auto mb-4 animate-bounce" style={{ color: 'var(--color-primary)' }} />
          <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-muted)' }}>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const hasNonZeroScores = leaderboard.some((entry) => entry.weeklyPoints > 0);
  const isAllTime = timeframe === 'all';
  // Weekly quiz / week-done badges describe the current week, so they only make sense on the weekly board.
  const showWeekBadges = !isAllTime;
  const renderStatusChips = (entry: LeaderboardEntry, className = '') => {
    const showStreak = entry.currentStreak > 0;
    const showQuiz = showWeekBadges && entry.weeklyQuizComplete;
    const showWeek = showWeekBadges && entry.weekComplete;
    if (!showStreak && !showQuiz && !showWeek) return null;
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {showStreak && (
          <StatusChip
            icon={<FlameIcon size={12} />}
            label={`${entry.currentStreak} ${entry.currentStreak === 1 ? 'day' : 'days'}`}
            title={`${entry.currentStreak} day streak`}
            color="var(--color-primary)"
          />
        )}
        {showQuiz && (
          <StatusChip
            icon={<CheckCircleIcon size={12} />}
            iconAfter
            label="Quiz"
            title="Finished this week's quiz"
            className="text-violet-700 dark:text-violet-300"
          />
        )}
        {showWeek && (
          <StatusChip
            icon={<CheckCircleIcon size={12} />}
            iconAfter
            label="Week done"
            title="Finished every activity in this week's course map"
            color="var(--success-color)"
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
      role="tablist"
      aria-label="Leaderboard time range"
      className="inline-flex items-center rounded-full p-0.5 sm:rounded-lg sm:p-1"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-contrast)',
      }}
    >
      {([['week', 'This Week'], ['all', 'All Time']] as const).map(([value, label]) => {
        const selected = timeframe === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => void onTimeframeChange(value)}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full sm:rounded-md transition-all duration-200"
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
        className="!min-h-0 !min-w-0 px-3 py-1 text-[10px] leading-none sm:px-4 sm:py-1.5 sm:text-xs font-semibold sm:font-bold rounded-full sm:rounded-md transition-all duration-200"
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
        className="inline-flex items-center px-3 py-1 text-[10px] leading-none sm:px-4 sm:py-1.5 sm:text-xs font-semibold sm:font-bold rounded-full sm:rounded-md"
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
                  {scope === 'independent' ? 'Self-paced Leaderboard' : isAllTime ? 'All-Time Leaderboard' : 'Weekly Leaderboard'}
                </h1>
                <p className="text-[13px] sm:text-sm font-medium leading-tight mt-1 sm:mt-0.5" style={{ color: 'var(--success-color)' }}>
                  {isAllTime
                    ? 'Total points since you joined'
                    : scope === 'independent' ? 'Top self-paced learners this week' : 'Top performers this week'}
                </p>
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
                        className="border-none bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
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
            <span className="ml-1 text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}>
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
                            ? 'min-w-[210px] py-6 animate-medal-glow animate-shine-sweep'
                            : 'min-w-[180px] py-4'
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
                            className="block text-[11px] font-bold tracking-[0.18em] uppercase mb-1"
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
                          <p className="text-[10px] font-bold leading-tight" style={{ color: 'var(--color-primary)' }}>
                            (You)
                          </p>
                        )}
                        <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--success-color)' }}>
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
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                        <span className="text-sm font-semibold text-gray-400">
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
        {leaderboard.length === 0 && (
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
              The podium is wide open
            </p>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Be the first to claim a spot. Complete an activity to earn points and watch your name climb the ranks.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
