'use client';

import { useEffect, useState } from 'react';
import { TrophyIcon, FlameIcon, SparklesIcon } from '@/components/icons/Icons';
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
}

type LeaderboardPayload = {
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  classId: string | null;
};

interface ClassOption {
  id: string;
  name: string;
}

type LeaderboardScope = 'section' | 'all';
type ViewerRole = 'student' | 'teacher' | 'admin' | null;

async function fetchLeaderboard({
  classId,
  scope = 'section',
}: {
  classId?: string | null;
  scope?: LeaderboardScope;
} = {}): Promise<LeaderboardPayload & { scope: LeaderboardScope }> {
  const params = new URLSearchParams();
  if (classId) {
    params.set('classId', classId);
  }
  params.set('scope', scope);
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
    classId: data.classId || null,
    scope: data.scope === 'all' ? 'all' : 'section',
  };
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [scope, setScope] = useState<LeaderboardScope>('section');
  const [viewerRole, setViewerRole] = useState<ViewerRole>(null);

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
        setClassOptions(contextData.classes || []);
        setViewerRole(contextData.viewerRole || null);
        setSelectedClassId(payload.classId || contextData.defaultClassId || null);
        setScope(payload.scope || 'section');
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
      const payload = await fetchLeaderboard({ classId: normalizedClassId, scope });
      setLeaderboard(payload.leaderboard);
      setUserRank(payload.userRank);
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
      const payload = await fetchLeaderboard({ classId: selectedClassId, scope: nextScope });
      setLeaderboard(payload.leaderboard);
      setUserRank(payload.userRank);
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center px-6">
          <TrophyIcon className="w-16 h-16 mx-auto mb-4 animate-bounce" style={{ color: 'var(--color-primary)' }} />
          <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-muted)' }}>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const hasNonZeroScores = leaderboard.some((entry) => entry.weeklyPoints > 0);
  const studentScopeToggle = viewerRole === 'student' ? (
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
        onClick={() => void onScopeChange('section')}
        aria-pressed={scope === 'section'}
        className="!min-h-0 !min-w-0 px-3 py-1 text-[10px] leading-none sm:px-4 sm:py-1.5 sm:text-xs font-semibold sm:font-bold rounded-full sm:rounded-md transition-all duration-200"
        style={
          scope === 'section'
            ? {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-accent)',
                boxShadow: '0 1px 2px color-mix(in srgb, var(--color-primary) 28%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)',
              }
            : {
                backgroundColor: 'transparent',
                color: 'var(--color-text-muted)',
              }
        }
      >
        <span className="sm:hidden">My Class</span>
        <span className="hidden sm:inline">My Class</span>
      </button>
      <button
        type="button"
        onClick={() => void onScopeChange('all')}
        aria-pressed={scope === 'all'}
        className="!min-h-0 !min-w-0 px-3 py-1 text-[10px] leading-none sm:px-4 sm:py-1.5 sm:text-xs font-semibold sm:font-bold rounded-full sm:rounded-md transition-all duration-200"
        style={
          scope === 'all'
            ? {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--text-on-accent)',
                boxShadow: '0 1px 2px color-mix(in srgb, var(--color-primary) 28%, transparent), inset 0 1px 0 rgba(255,255,255,0.18)',
              }
            : {
                backgroundColor: 'transparent',
                color: 'var(--color-text-muted)',
              }
        }
      >
        <span className="sm:hidden">All</span>
        <span className="hidden sm:inline">All Classes</span>
      </button>
    </div>
  ) : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="sticky top-0 backdrop-blur-lg border-b" style={{ zIndex: 200, backgroundColor: 'color-mix(in srgb, var(--surface-overlay) 96%, transparent)', borderColor: 'var(--border-subtle)', boxShadow: '0 1px 6px rgba(13,22,32,0.10)' }}>
        <div className="container mx-auto pt-2.5 pb-0.5 px-4 sm:py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-color-light) 76%, var(--surface-elevated)) 0%, color-mix(in srgb, var(--accent-color) 38%, var(--surface-elevated)) 100%)' }}>
                <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex flex-col justify-center py-0.5 pt-1 sm:pt-0.5">
                <h1 className="text-[1.75rem] leading-[0.95] sm:text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  Weekly Leaderboard
                </h1>
                <p className="text-[13px] sm:text-sm font-medium leading-tight mt-1 sm:mt-0.5" style={{ color: 'var(--success-color)' }}>
                  Top performers this week
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {viewerRole === 'student' ? (
                <div className="hidden sm:inline-flex">
                  {studentScopeToggle}
                </div>
              ) : classOptions.length > 1 ? (
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
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6 space-y-6 pb-28 md:pb-10">
        {/* User's Rank Card - Only show if user has points and appears in leaderboard */}
        {userRank && leaderboard.some((entry) => entry.rank === userRank) && (
          <div className="border-2 rounded-2xl p-5 sm:p-6" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--color-primary)', boxShadow: '0 4px 14px color-mix(in srgb, var(--color-primary) 22%, transparent)' }}>
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--success-color)' }}>
                  Your Rank
                </p>
                <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                  {getRankIcon(userRank, hasNonZeroScores)}
                </p>
              </div>
              {leaderboard.find((entry) => entry.rank === userRank)?.rankChange && (
                <div className="mt-4 sm:mt-0 sm:text-right">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    From last week
                  </p>
                  {(() => {
                    const userEntry = leaderboard.find((entry) => entry.rank === userRank);
                    const change = getRankChangeIndicator(userEntry?.rankChange || null);
                    return change ? (
                      <p className="text-2xl font-bold" style={{ color: change.color }}>
                        {change.icon} {change.text}
                      </p>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top 3 Podium (hide on mobile, hide if everyone is at 0) */}
        {leaderboard.some(entry => entry.rank <= 3) && hasNonZeroScores && (() => {
          // Get all students in top 3 ranks (handles ties)
          const rank1Students = leaderboard.filter(entry => entry.rank === 1);
          const rank2Students = leaderboard.filter(entry => entry.rank === 2);
          const rank3Students = leaderboard.filter(entry => entry.rank === 3);
          const topStudents = [...rank1Students, ...rank2Students, ...rank3Students];

          return (
            <div className="hidden md:flex flex-wrap justify-center gap-4 mb-8">
              {/* Display students in rank order (1st, then all 2nd, then all 3rd) */}
              {topStudents.map((student) => (
                <div key={student.id} className="flex-shrink-0">
                  <div
                    className="border-2 rounded-2xl p-4 text-center min-w-[180px]"
                    style={{
                      backgroundColor: getRankColor(student.rank).bg,
                      borderColor: getRankColor(student.rank).border,
                      boxShadow: student.rank === 1 ? '0 10px 28px color-mix(in srgb, #FFD700 26%, transparent)' : '0 8px 20px rgba(13,22,32,0.10)'
                    }}
                  >
                    <div className={student.rank === 1 ? "text-5xl mb-2" : "text-4xl mb-2"}>
                      {getRankIcon(student.rank)}
                    </div>
                    {student.avatar && (
                      <div className="flex justify-center mb-2">
                        <LeaderboardAvatar avatar={student.avatar} avatarColor={student.avatarColor} size="md" />
                      </div>
                    )}
                    <p className="font-bold text-lg truncate" style={{ color: 'var(--color-text)' }}>
                      {student.name}
                    </p>
                    {student.rank === 1 && (
                      <p className="text-sm mt-1" style={{ color: 'var(--success-color)' }}>
                        Champion
                      </p>
                    )}
                    <div className="mt-2">
                      <Badge variant={student.rank === 1 ? "warning" : "secondary"}>
                        {student.weeklyPoints} pts
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Full Leaderboard */}
        {leaderboard.length > 0 ? (
          <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', boxShadow: '0 4px 12px rgba(13,22,32,0.12)' }}>
            <div className="border-b p-4" style={{ backgroundColor: 'var(--surface-contrast)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                  All Rankings
                </h2>
                {viewerRole === 'student' ? (
                  <div className="sm:hidden">
                    {studentScopeToggle}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {leaderboard.map((entry) => {
              const rankColors = getRankColor(entry.rank);
              const rankChange = getRankChangeIndicator(entry.rankChange);
              const isUserRow = entry.rank === userRank;

              return (
                <div
                  key={entry.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 transition-all ${isUserRow ? 'border-l-4' : ''}`}
                    style={{
                    backgroundColor: isUserRow ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)' : 'transparent',
                    borderLeftColor: isUserRow ? 'var(--color-primary)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 text-center flex-shrink-0">
                      <span className="text-xl font-bold" style={{ color: rankColors.text }}>
                        {getRankIcon(entry.rank, hasNonZeroScores)}
                      </span>
                    </div>
                    {entry.avatar ? (
                      <LeaderboardAvatar avatar={entry.avatar} avatarColor={entry.avatarColor} size="sm" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-sm font-semibold">
                          {entry.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                        {entry.name}
                        {isUserRow && (
                          <span className="ml-2 text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                            (You)
                          </span>
                        )}
                      </p>
                      <div className="flex items-center flex-wrap gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          <SparklesIcon size={16} />
                          <span>{entry.weeklyPoints} pts</span>
                        </div>
                        {entry.currentStreak > 0 && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--accent-color)' }}>
                            <FlameIcon size={16} />
                            <span>{entry.currentStreak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {rankChange && (
                    <div className="hidden md:block text-left sm:text-right">
                      <div className="flex items-center gap-1 text-lg font-bold sm:justify-end" style={{ color: rankChange.color }}>
                        <span>{rankChange.icon}</span>
                        <span className="text-sm">{Math.abs(entry.rankChange || 0)}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                        vs last week
                      </p>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          </div>
        ) : (
          <div className="border rounded-2xl overflow-hidden text-center py-12" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', boxShadow: '0 4px 12px rgba(13,22,32,0.12)' }}>
            <TrophyIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--border-strong)' }} />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
              No rankings yet
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>
              Students will appear here once they earn points. Complete activities to climb the ranks!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
