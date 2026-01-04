'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { EditableFlow } from './EditableFlow';
import {
  TeachingScheduleFlowItem,
  MonthDay,
  TeachingScheduleDay,
  TeachingSchedule,
  TeachingScheduleWeekDay,
  TeachingScheduleWeek
} from '@/lib/teachingSchedule';

export type { TeachingScheduleDay, TeachingSchedule, TeachingScheduleWeekDay, TeachingScheduleWeek };

function formatMonthDay(date: MonthDay) {
  return new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function stripMarkdown(text: string): string {
  return text
    // Remove bold/italic markers
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove backticks and code blocks
    .replace(/`(.+?)`/g, '$1')
    // Remove "USE:" instructions (teacher-only metadata)
    .replace(/\s*-\s*USE:\s*`[^`]+`\s*\([^)]+\)/gi, '')
    .trim();
}

function getCurrentWeekIndex(weeklySchedule: TeachingScheduleWeek[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < weeklySchedule.length; i++) {
    const week = weeklySchedule[i];
    if (!week) continue;

    const tueDate = new Date(week.dates.tue.year, week.dates.tue.month - 1, week.dates.tue.day);
    const thuDate = new Date(week.dates.thu.year, week.dates.thu.month - 1, week.dates.thu.day);

    if (today >= tueDate && today <= thuDate) {
      return i;
    }

    if (today < tueDate) {
      return Math.max(0, i - 1);
    }
  }

  return Math.max(0, weeklySchedule.length - 1);
}

function getWeekStatus(week: TeachingScheduleWeek): 'past' | 'current' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tueDate = new Date(week.dates.tue.year, week.dates.tue.month - 1, week.dates.tue.day);
  const thuDate = new Date(week.dates.thu.year, week.dates.thu.month - 1, week.dates.thu.day);

  if (today > thuDate) return 'past';
  if (today >= tueDate && today <= thuDate) return 'current';
  return 'upcoming';
}

export function TeacherCalendar({
  teachingSchedule,
  weeklySchedule,
}: {
  teachingSchedule: TeachingSchedule;
  weeklySchedule: TeachingScheduleWeek[];
}) {
  const [selectedWeek, setSelectedWeek] = useState(() =>
    weeklySchedule.length > 0 ? getCurrentWeekIndex(weeklySchedule) : 0
  );
  const [showWeekList, setShowWeekList] = useState(false);
  const [localSchedule, setLocalSchedule] = useState(teachingSchedule);

  // Sync local schedule when props change
  useEffect(() => {
    setLocalSchedule(teachingSchedule);
  }, [teachingSchedule]);

  const handleSaveFlow = async (day: "Tuesday" | "Thursday", flow: TeachingScheduleFlowItem[]) => {
    const response = await fetch("/api/teaching-schedule/flow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day, flow }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save flow");
    }

    // Update local state
    setLocalSchedule({
      ...localSchedule,
      [day]: {
        ...localSchedule[day],
        flow,
      },
    });
  };

  const currentWeek = weeklySchedule[selectedWeek];
  const hasWeeks = weeklySchedule.length > 0 && !!currentWeek;
  const maxWeekIndex = Math.max(0, weeklySchedule.length - 1);
  const currentWeekIndex = getCurrentWeekIndex(weeklySchedule);
  const progressPercentage = hasWeeks ? Math.round(((selectedWeek + 1) / weeklySchedule.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ADHD-Friendly Header with Progress */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-semibold text-text">Teaching Schedule</h2>
            <p className="text-sm text-text/70 mt-1">
              ESOL Level 3 — Jan–Jun 2026 | Tue/Thu 6:00–8:15pm
            </p>
          </div>

          <button
            onClick={() => setShowWeekList(!showWeekList)}
            className="px-4 py-2 rounded-lg border border-border/50 hover:bg-bg-light transition text-sm font-medium text-text flex items-center gap-2"
          >
            {showWeekList ? '📅 Hide Week List' : '📋 Show All Weeks'}
          </button>
        </div>

        {/* Progress Bar */}
        {hasWeeks && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-text">
                Viewing: Week {selectedWeek + 1} of {weeklySchedule.length}
              </span>
              <span className="text-text/60">{progressPercentage}% through semester</span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedWeek((prev) => Math.max(0, prev - 1))}
            disabled={!hasWeeks || selectedWeek === 0}
            className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-primary transition"
          >
            ← Previous
          </button>

          <button
            onClick={() => setSelectedWeek(currentWeekIndex)}
            disabled={!hasWeeks || selectedWeek === currentWeekIndex}
            className="px-4 py-2 rounded-lg bg-accent/80 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold text-text transition shadow-sm"
          >
            📍 Jump to Current Week
          </button>

          <button
            onClick={() => setSelectedWeek((prev) => Math.min(maxWeekIndex, prev + 1))}
            disabled={!hasWeeks || selectedWeek === maxWeekIndex}
            className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-primary transition"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Week List View (Collapsible) */}
      {showWeekList && hasWeeks && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text mb-4">All Weeks at a Glance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weeklySchedule.map((week, index) => {
              const status = getWeekStatus(week);
              const isCurrent = status === 'current';
              const isPast = status === 'past';
              const isSelected = index === selectedWeek;

              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedWeek(index);
                    setShowWeekList(false);
                  }}
                  className={`
                    text-left p-4 rounded-lg border-2 transition-all
                    ${isSelected ? 'border-primary bg-primary/10 shadow-md' : 'border-border/30 hover:border-primary/40 hover:bg-bg-light'}
                    ${isCurrent ? 'ring-2 ring-accent ring-offset-2' : ''}
                    ${isPast ? 'opacity-60' : ''}
                  `}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-text text-sm">{week.week}</span>
                    {isCurrent && (
                      <span className="text-xs font-bold bg-accent text-text px-2 py-0.5 rounded">NOW</span>
                    )}
                    {isPast && (
                      <span className="text-xs font-medium text-text/50">✓ Past</span>
                    )}
                  </div>
                  <div className="text-xs text-text/60">
                    {formatMonthDay(week.dates.tue)} – {formatMonthDay(week.dates.thu)}
                  </div>
                  <div className="text-xs text-text/70 mt-2 line-clamp-2">
                    {stripMarkdown(week.tuesday.grammar || week.tuesday.warmup)}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Week Detail View */}
      <Card className="p-6">
        {!hasWeeks ? (
          <div className="text-sm text-text/70">No schedule data found.</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">{currentWeek.week}</h3>
              {getWeekStatus(currentWeek) === 'current' && (
                <span className="text-sm font-bold bg-accent text-text px-3 py-1 rounded-full">📍 Current Week</span>
              )}
              {getWeekStatus(currentWeek) === 'past' && (
                <span className="text-sm font-medium text-text/50 px-3 py-1 rounded-full border border-border/30">✓ Completed</span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tuesday */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text">
                    Tuesday {formatMonthDay(currentWeek.dates.tue)}
                  </h4>
                  {localSchedule.Tuesday.time && (
                    <span className="text-sm text-text/60">{localSchedule.Tuesday.time}</span>
                  )}
                </div>

                <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                  {currentWeek.tuesday.grammar && (
                    <div className="pb-3 border-b border-primary/20">
                      <div className="text-xs font-medium text-primary uppercase mb-1">📖 Grammar Lesson</div>
                      <div className="font-medium text-text">{stripMarkdown(currentWeek.tuesday.grammar)}</div>
                    </div>
                  )}

                  <div className={currentWeek.tuesday.notes ? "pb-3 border-b border-secondary/20" : ""}>
                    <div className="text-xs font-medium text-secondary uppercase mb-1">🗣️ Speaking Warm-up</div>
                    <div className="text-sm text-text/80">{stripMarkdown(currentWeek.tuesday.warmup)}</div>
                  </div>

                  {currentWeek.tuesday.notes && (
                    <div>
                      <div className="text-xs font-medium text-text/60 uppercase mb-1">📝 Notes</div>
                      <div className="text-sm text-text/70">{stripMarkdown(currentWeek.tuesday.notes)}</div>
                    </div>
                  )}

                  <EditableFlow
                    flow={currentWeek.tuesday.flow}
                    day="Tuesday"
                    onSave={(flow) => handleSaveFlow("Tuesday", flow)}
                  />
                </div>
              </div>

              {/* Thursday */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text">
                    Thursday {formatMonthDay(currentWeek.dates.thu)}
                  </h4>
                  {localSchedule.Thursday.time && (
                    <span className="text-sm text-text/60">{localSchedule.Thursday.time}</span>
                  )}
                </div>

                <div className="bg-secondary/5 rounded-lg p-4 space-y-3">
                  {currentWeek.thursday.quiz && (
                    <div className="pb-3 border-b border-orange-200">
                      <div className="text-xs font-medium text-orange-700 uppercase mb-1">⚠️ Unit Quiz</div>
                      <div className="font-medium text-text">{currentWeek.thursday.quiz}</div>
                    </div>
                  )}

                  {currentWeek.thursday.grammar && (
                    <div className={`${currentWeek.thursday.notes || !currentWeek.thursday.quiz ? "pb-3 border-b border-secondary/20" : ""}`}>
                      <div className="text-xs font-medium text-secondary uppercase mb-1">📖 Grammar Review</div>
                      <div className="font-medium text-text">{stripMarkdown(currentWeek.thursday.grammar)}</div>
                    </div>
                  )}

                  <div className={currentWeek.thursday.notes ? "pb-3 border-b border-secondary/20" : ""}>
                    <div className="text-xs font-medium text-primary uppercase mb-1">🗣️ Speaking Warm-up</div>
                    <div className="text-sm text-text/80">{stripMarkdown(currentWeek.thursday.warmup)}</div>
                  </div>

                  {currentWeek.thursday.notes && (
                    <div>
                      <div className="text-xs font-medium text-text/60 uppercase mb-1">📝 Notes</div>
                      <div className="text-sm text-text/70">{stripMarkdown(currentWeek.thursday.notes)}</div>
                    </div>
                  )}

                  <EditableFlow
                    flow={currentWeek.thursday.flow}
                    day="Thursday"
                    onSave={(flow) => handleSaveFlow("Thursday", flow)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Weekly Checklist & Quick Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">📋 Weekly Checklist</h3>
          {hasWeeks && (
            <button className="px-3 py-1.5 rounded-lg bg-accent text-text hover:bg-accent/90 text-xs font-bold uppercase tracking-wide transition">
              🚀 Auto-Release All for This Week
            </button>
          )}
        </div>

        {!hasWeeks ? (
          <div className="text-sm text-text/70">Add weeks to the schedule file to enable weekly checklist.</div>
        ) : (
          <div className="space-y-4">
            {/* Verb Quiz Section */}
            <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-primary uppercase">📚 Verb Quiz</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                      Due: Next Tuesday
                    </span>
                  </div>
                  <div className="text-sm text-text/80 font-medium mb-1">{currentWeek.week} - Irregular Verbs</div>
                  <div className="text-xs text-text/60">5 verbs: Check quizzes.json for this week's list</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-xs font-medium whitespace-nowrap transition">
                  ✓ Release Quiz
                </button>
              </div>
            </div>

            {/* Speaking Activities Section */}
            <div className="bg-secondary/5 rounded-lg p-4 border-l-4 border-secondary">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-secondary uppercase">🗣️ Speaking Warmups</span>
              </div>

              {/* Tuesday Speaking */}
              <div className="mb-3 pb-3 border-b border-secondary/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-text/60 mb-1">Tuesday {formatMonthDay(currentWeek.dates.tue)}</div>
                    <div className="text-sm text-text/90 font-medium">{stripMarkdown(currentWeek.tuesday.warmup)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-secondary text-white hover:bg-secondary/90 text-xs font-medium whitespace-nowrap transition">
                      ✓ Release
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-secondary text-secondary hover:bg-secondary/10 text-xs font-medium whitespace-nowrap transition">
                      ⭐ Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* Thursday Speaking */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-text/60 mb-1">Thursday {formatMonthDay(currentWeek.dates.thu)}</div>
                    <div className="text-sm text-text/90 font-medium">{stripMarkdown(currentWeek.thursday.warmup)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-secondary text-white hover:bg-secondary/90 text-xs font-medium whitespace-nowrap transition">
                      ✓ Release
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-secondary text-secondary hover:bg-secondary/10 text-xs font-medium whitespace-nowrap transition">
                      ⭐ Feature
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grammar Assignments Section */}
            <div className="bg-accent/5 rounded-lg p-4 border-l-4 border-accent">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-text uppercase">📖 Grammar Activities</span>
              </div>

              {currentWeek.tuesday.grammar && (
                <div className="mb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-text/60 mb-1">Tuesday - New Grammar</div>
                      <div className="text-sm text-text/90 font-medium">{stripMarkdown(currentWeek.tuesday.grammar)}</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-xs font-medium whitespace-nowrap transition">
                      📝 Assign
                    </button>
                  </div>
                </div>
              )}

              {currentWeek.thursday.grammar && (
                <div className="mt-3 pt-3 border-t border-accent/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-text/60 mb-1">Thursday - Grammar Review</div>
                      <div className="text-sm text-text/90 font-medium">{stripMarkdown(currentWeek.thursday.grammar)}</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-xs font-medium whitespace-nowrap transition">
                      📝 Assign
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Unit Quiz Alert */}
            {currentWeek.thursday.quiz && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-orange-900 mb-1">Unit Quiz This Thursday</div>
                    <div className="text-sm text-orange-800">{currentWeek.thursday.quiz}</div>
                    <div className="text-xs text-orange-700 mt-1">Note: Unit quizzes are paper tests provided by the program</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20"></div>
          <span className="text-text/70">Grammar Lesson</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary/20"></div>
          <span className="text-text/70">Speaking Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/20"></div>
          <span className="text-text/70">Quiz/Assessment</span>
        </div>
      </div>
    </div>
  );
}
