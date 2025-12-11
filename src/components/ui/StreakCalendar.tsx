'use client';

import React from 'react';

interface StreakCalendarProps {
  activityDates: Date[]; // Array of dates when user was active
  className?: string;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  activityDates,
  className = '',
}) => {
  // Get last 12 weeks (84 days) for display
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 83); // 12 weeks ago

  // Create a map of dates with activity
  const activityMap = new Map<string, number>();
  activityDates.forEach(date => {
    const dateKey = new Date(date).toISOString().split('T')[0];
    activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
  });

  // Generate weeks array (each week is an array of 7 days)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // Start from the beginning of the week containing startDate
  const firstDay = new Date(startDate);
  const dayOfWeek = firstDay.getDay();
  firstDay.setDate(firstDay.getDate() - dayOfWeek);

  for (let i = 0; i < 84; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);

    currentWeek.push(date);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Get activity level for styling (0 = none, 1-3 = low to high)
  const getActivityLevel = (date: Date): number => {
    const dateKey = date.toISOString().split('T')[0];
    const count = activityMap.get(dateKey) || 0;
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    return 3;
  };

  const getColorClass = (level: number): string => {
    switch (level) {
      case 0:
        return 'bg-gray-100 border border-gray-200';
      case 1:
        return 'bg-primary/20 border border-primary/30';
      case 2:
        return 'bg-primary/50 border border-primary/60';
      case 3:
        return 'bg-primary border border-primary';
      default:
        return 'bg-gray-100 border border-gray-200';
    }
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`${className}`}>
      <div className="flex flex-col gap-3">
        {/* Month labels row */}
        <div className="flex gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 ml-8 md:ml-12 lg:ml-14">
          {weeks.map((week, weekIndex) => {
            const firstDayOfWeek = week[0];
            const showMonth = firstDayOfWeek.getDate() <= 7 || weekIndex === 0;
            return (
              <div key={weekIndex} className="w-3.5 md:w-4 lg:w-5 xl:w-6 text-xs md:text-sm text-text-muted font-medium">
                {showMonth && monthLabels[firstDayOfWeek.getMonth()].slice(0, 3)}
              </div>
            );
          })}
        </div>

        {/* Calendar grid with day labels */}
        <div className="flex gap-3 md:gap-4">
          {/* Day labels */}
          <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-2.5 text-xs md:text-sm text-text-muted justify-start pt-0.5">
            {dayLabels.map((day, i) => (
              <div key={i} className="h-3.5 md:h-4 lg:h-5 flex items-center w-8 md:w-10 lg:w-12">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Calendar weeks */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1.5 md:gap-2 lg:gap-3 xl:gap-4">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
                  {/* Days in week */}
                  {week.map((date, dayIndex) => {
                    const level = getActivityLevel(date);
                    const isToday = date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
                    const dateKey = date.toISOString().split('T')[0];
                    const activityCount = activityMap.get(dateKey) || 0;

                    return (
                      <div
                        key={dayIndex}
                        className={`
                          w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded-sm transition-all duration-200
                          ${getColorClass(level)}
                          ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                          hover:ring-2 hover:ring-gray-400 hover:ring-offset-1
                          cursor-pointer
                        `}
                        title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6 text-xs md:text-sm text-text-muted">
        <span>Less</span>
        <div className="flex gap-1 md:gap-1.5">
          {[0, 1, 2, 3].map(level => (
            <div
              key={level}
              className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-sm ${getColorClass(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
