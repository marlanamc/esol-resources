'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

export type MonthDay = { year: number; month: number; day: number };

export type TeachingScheduleFlowItem = { time: string; activity: string };

export type TeachingScheduleDay = {
  time: string;
  flow: TeachingScheduleFlowItem[];
};

export type TeachingSchedule = {
  Tuesday: TeachingScheduleDay;
  Thursday: TeachingScheduleDay;
};

export type TeachingScheduleWeekDay = {
  warmup: string;
  grammar?: string;
  quiz?: string;
  notes?: string;
};

export type TeachingScheduleWeek = {
  week: string;
  dates: { tue: MonthDay; thu: MonthDay };
  tuesday: TeachingScheduleWeekDay;
  thursday: TeachingScheduleWeekDay;
};

function formatMonthDay(date: MonthDay) {
  return new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TeacherCalendar({
  teachingSchedule,
  weeklySchedule,
}: {
  teachingSchedule: TeachingSchedule;
  weeklySchedule: TeachingScheduleWeek[];
}) {
  const [selectedWeek, setSelectedWeek] = useState(0);

  const currentWeek = weeklySchedule[selectedWeek];
  const hasWeeks = weeklySchedule.length > 0 && !!currentWeek;
  const maxWeekIndex = Math.max(0, weeklySchedule.length - 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Teaching Calendar</h2>
          <p className="text-sm text-text/70 mt-1">
            ESOL Level 3 — Jan–Jun 2026 | Tue/Thu 6:00–8:15pm
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedWeek((prev) => Math.max(0, prev - 1))}
            disabled={!hasWeeks || selectedWeek === 0}
            className="px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-primary"
          >
            ← Previous Week
          </button>
          <button
            onClick={() => setSelectedWeek((prev) => Math.min(maxWeekIndex, prev + 1))}
            disabled={!hasWeeks || selectedWeek === maxWeekIndex}
            className="px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-primary"
          >
            Next Week →
          </button>
        </div>
      </div>

      {/* Week Overview */}
      <Card className="p-6">
        {!hasWeeks ? (
          <div className="text-sm text-text/70">No schedule data found.</div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-text mb-4">{currentWeek.week}</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tuesday */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text">
                    Tuesday {formatMonthDay(currentWeek.dates.tue)}
                  </h4>
                  <span className="text-sm text-text/60">{teachingSchedule.Tuesday.time}</span>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                  {currentWeek.tuesday.grammar && (
                    <div>
                      <div className="text-xs font-medium text-primary uppercase mb-1">Grammar Lesson</div>
                      <div className="font-medium text-text">{currentWeek.tuesday.grammar}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-medium text-secondary uppercase mb-1">Speaking Warm-up</div>
                    <div className="text-sm text-text/80">{currentWeek.tuesday.warmup}</div>
                  </div>

                  {currentWeek.tuesday.notes && (
                    <div>
                      <div className="text-xs font-medium text-text/60 uppercase mb-1">Notes</div>
                      <div className="text-sm text-text/70">{currentWeek.tuesday.notes}</div>
                    </div>
                  )}

                  {teachingSchedule.Tuesday.flow.length > 0 && (
                    <div className="pt-3 border-t border-text/10">
                      <div className="text-xs font-medium text-text/60 mb-2">Class Flow:</div>
                      <div className="space-y-1">
                        {teachingSchedule.Tuesday.flow.map((item, idx) => (
                          <div key={idx} className="text-xs text-text/70 flex">
                            <span className="font-mono text-text/50 w-24">{item.time}</span>
                            <span>{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thursday */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text">
                    Thursday {formatMonthDay(currentWeek.dates.thu)}
                  </h4>
                  <span className="text-sm text-text/60">{teachingSchedule.Thursday.time}</span>
                </div>

                <div className="bg-secondary/5 rounded-lg p-4 space-y-3">
                  {currentWeek.thursday.quiz && (
                    <div className="bg-accent/20 rounded px-3 py-2 mb-2">
                      <div className="text-xs font-medium text-text uppercase mb-1">📝 Unit Quiz</div>
                      <div className="font-medium text-text">{currentWeek.thursday.quiz}</div>
                    </div>
                  )}

                  {currentWeek.thursday.grammar && (
                    <div>
                      <div className="text-xs font-medium text-secondary uppercase mb-1">Grammar Review</div>
                      <div className="font-medium text-text">{currentWeek.thursday.grammar}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-medium text-primary uppercase mb-1">Speaking Warm-up</div>
                    <div className="text-sm text-text/80">{currentWeek.thursday.warmup}</div>
                  </div>

                  {currentWeek.thursday.notes && (
                    <div>
                      <div className="text-xs font-medium text-text/60 uppercase mb-1">Notes</div>
                      <div className="text-sm text-text/70">{currentWeek.thursday.notes}</div>
                    </div>
                  )}

                  {teachingSchedule.Thursday.flow.length > 0 && (
                    <div className="pt-3 border-t border-text/10">
                      <div className="text-xs font-medium text-text/60 mb-2">Class Flow:</div>
                      <div className="space-y-1">
                        {teachingSchedule.Thursday.flow.map((item, idx) => (
                          <div key={idx} className="text-xs text-text/70 flex">
                            <span className="font-mono text-text/50 w-24">{item.time}</span>
                            <span>{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Quick Assignment Creator */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Quick Assign for This Week</h3>
        <p className="text-sm text-text/70 mb-4">
          Based on this week's schedule, you can quickly assign relevant activities to your classes.
        </p>

        <div className="flex flex-wrap gap-3">
          {!hasWeeks ? (
            <div className="text-sm text-text/70">Add weeks to the schedule file to enable quick-assign suggestions.</div>
          ) : (
            <>
              {currentWeek.tuesday.grammar && (
                <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm font-medium">
                  Assign "{currentWeek.tuesday.grammar}"
                </button>
              )}
              <button className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 text-sm font-medium">
                Assign "{currentWeek.tuesday.warmup}" speaking activity
              </button>
              {currentWeek.thursday.quiz && (
                <button className="px-4 py-2 rounded-lg bg-accent text-text hover:bg-accent/90 text-sm font-medium">
                  Create {currentWeek.thursday.quiz}
                </button>
              )}
            </>
          )}
        </div>
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
