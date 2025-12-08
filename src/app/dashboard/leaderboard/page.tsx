'use client';

import { useEffect, useState } from 'react';
import { TrophyIcon, FlameIcon, StarIcon, SparklesIcon } from '@/components/icons/Icons';
import { Badge } from '@/components/ui';

interface LeaderboardEntry {
  id: string;
  name: string;
  weeklyPoints: number;
  currentStreak: number;
  rank: number;
  rankChange: number | null;
  lastWeekRank: number | null;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/gamification/leaderboard');
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);

      // Get user's stats to find their rank
      const statsResponse = await fetch('/api/gamification/stats');
      const statsData = await statsResponse.json();
      setUserRank(statsData.stats?.rank || null);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return { bg: 'rgba(255, 215, 0, 0.1)', border: '#FFD700', text: '#B8860B' }; // Gold
    if (rank === 2) return { bg: 'rgba(192, 192, 192, 0.1)', border: '#C0C0C0', text: '#808080' }; // Silver
    if (rank === 3) return { bg: 'rgba(205, 127, 50, 0.1)', border: '#CD7F32', text: '#8B4513' }; // Bronze
    return { bg: '#ffffff', border: '#d9cfc0', text: '#2b3a4a' };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankChangeIndicator = (rankChange: number | null) => {
    if (!rankChange) return null;
    if (rankChange > 0) return { icon: '↑', color: '#7ba884', text: `+${rankChange}` };
    if (rankChange < 0) return { icon: '↓', color: '#e76f51', text: `${rankChange}` };
    return { icon: '−', color: '#5a6b7f', text: '0' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fef9f3' }}>
        <div className="text-center">
          <TrophyIcon className="w-16 h-16 mx-auto mb-4 animate-bounce" style={{ color: '#d97757' }} />
          <p style={{ color: '#5a6b7f' }}>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fef9f3' }}>
      {/* Header */}
      <header className="sticky top-0 backdrop-blur-lg border-b-2" style={{ zIndex: 200, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#d9cfc0', boxShadow: '0 1px 3px rgba(43, 58, 74, 0.08)' }}>
        <div className="container mx-auto py-4 px-4 flex items-center gap-4">
          <TrophyIcon className="w-8 h-8" style={{ color: '#f4d35e' }} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#2b3a4a' }}>
              Weekly Leaderboard
            </h1>
            <p className="text-sm" style={{ color: '#7ba884' }}>
              Top performers this week
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 space-y-6 pb-24 md:pb-8">
        {/* User's Rank Card */}
        {userRank && (
          <div className="border-2 rounded-2xl p-6" style={{ backgroundColor: '#ffffff', borderColor: '#d97757', boxShadow: '0 4px 12px rgba(217, 119, 87, 0.15)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#7ba884' }}>
                  Your Rank
                </p>
                <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#d97757' }}>
                  {getRankIcon(userRank)}
                </p>
              </div>
              {leaderboard.find((_, i) => i + 1 === userRank)?.rankChange && (
                <div className="text-right">
                  <p className="text-sm" style={{ color: '#5a6b7f' }}>
                    From last week
                  </p>
                  {(() => {
                    const change = getRankChangeIndicator(leaderboard.find((_, i) => i + 1 === userRank)?.rankChange || null);
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

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Second Place */}
            <div className="pt-12">
              <div className="border-2 rounded-2xl p-4 text-center" style={{ backgroundColor: getRankColor(2).bg, borderColor: getRankColor(2).border }}>
                <div className="text-4xl mb-2">🥈</div>
                <p className="font-bold text-lg truncate" style={{ color: '#2b3a4a' }}>
                  {leaderboard[1].name}
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">
                    {leaderboard[1].weeklyPoints} pts
                  </Badge>
                </div>
              </div>
            </div>

            {/* First Place */}
            <div>
              <div className="border-2 rounded-2xl p-6 text-center" style={{ backgroundColor: getRankColor(1).bg, borderColor: getRankColor(1).border, boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)' }}>
                <div className="text-6xl mb-2">🥇</div>
                <p className="font-bold text-xl truncate" style={{ color: '#2b3a4a' }}>
                  {leaderboard[0].name}
                </p>
                <p className="text-sm mt-1" style={{ color: '#7ba884' }}>
                  Champion
                </p>
                <div className="mt-3">
                  <Badge variant="warning">
                    {leaderboard[0].weeklyPoints} pts
                  </Badge>
                </div>
              </div>
            </div>

            {/* Third Place */}
            <div className="pt-12">
              <div className="border-2 rounded-2xl p-4 text-center" style={{ backgroundColor: getRankColor(3).bg, borderColor: getRankColor(3).border }}>
                <div className="text-4xl mb-2">🥉</div>
                <p className="font-bold text-lg truncate" style={{ color: '#2b3a4a' }}>
                  {leaderboard[2].name}
                </p>
                <div className="mt-2">
                  <Badge variant="warning">
                    {leaderboard[2].weeklyPoints} pts
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="border rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: '#d9cfc0', boxShadow: '0 4px 12px rgba(43, 58, 74, 0.1)' }}>
          <div className="border-b-2 p-4" style={{ backgroundColor: '#f5f1e8', borderColor: '#d9cfc0' }}>
            <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: '#2b3a4a' }}>
              All Rankings
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: '#ede7db' }}>
            {leaderboard.map((entry) => {
              const rankColors = getRankColor(entry.rank);
              const rankChange = getRankChangeIndicator(entry.rankChange);
              const isUserRow = entry.rank === userRank;

              return (
                <div
                  key={entry.id}
                  className={`p-4 flex items-center justify-between transition-all ${isUserRow ? 'border-l-4' : ''}`}
                  style={{
                    backgroundColor: isUserRow ? 'rgba(217, 119, 87, 0.05)' : 'transparent',
                    borderLeftColor: isUserRow ? '#d97757' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 text-center">
                      <span className="text-2xl font-bold" style={{ color: rankColors.text }}>
                        {getRankIcon(entry.rank)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: '#2b3a4a' }}>
                        {entry.name}
                        {isUserRow && (
                          <span className="ml-2 text-xs font-bold" style={{ color: '#d97757' }}>
                            (You)
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm" style={{ color: '#5a6b7f' }}>
                          <SparklesIcon size={16} />
                          <span>{entry.weeklyPoints} pts</span>
                        </div>
                        {entry.currentStreak > 0 && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: '#f4a261' }}>
                            <FlameIcon size={16} />
                            <span>{entry.currentStreak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {rankChange && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold" style={{ color: rankChange.color }}>
                        <span>{rankChange.icon}</span>
                        <span className="text-sm">{Math.abs(entry.rankChange || 0)}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#8996a6' }}>
                        vs last week
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="w-16 h-16 mx-auto mb-4" style={{ color: '#d9cfc0' }} />
            <p className="text-lg font-medium mb-2" style={{ color: '#5a6b7f' }}>
              No leaderboard data yet
            </p>
            <p className="text-sm" style={{ color: '#8996a6' }}>
              Complete activities to earn points and climb the ranks!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
