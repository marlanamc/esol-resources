'use client';

import React, { useRef, useEffect } from 'react';

interface StreakCalendarProps {
  activityDates: Array<Date | string>; // Array of dates when user was active
  className?: string;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  activityDates,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const appLaunchDate = new Date(2025, 11, 1); // December 1, 2025
  const MAX_WEEKS_VISIBLE = 18;

  useEffect(() => {
    if (scrollRef.current) {
      // Small timeout to ensure layout is complete before scrolling
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayKey = getLocalDateKey(today);

  // Create a map of dates with activity
  const activityMap = new Map<string, number>();
  activityDates.forEach(date => {
    const dateKey = getLocalDateKey(new Date(date));
    activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
  });

  // Generate weeks array - each week is a column with exactly 7 days (Sun-Sat)
  // Start from the Sunday of the week containing appLaunchDate
  const firstSunday = new Date(appLaunchDate);
  firstSunday.setDate(appLaunchDate.getDate() - appLaunchDate.getDay());
  
  // End at the Saturday of the current week
  const lastSaturday = new Date(today);
  lastSaturday.setDate(today.getDate() + (6 - today.getDay()));
  
  // Calculate number of weeks
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const numWeeks = Math.ceil((lastSaturday.getTime() - firstSunday.getTime() + 1) / msPerWeek);
  
  const weeks: Date[][] = [];
  for (let w = 0; w < numWeeks; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(firstSunday);
      date.setDate(firstSunday.getDate() + (w * 7) + d);
      week.push(date);
    }
    weeks.push(week);
  }
  const visibleWeeks = weeks.slice(-MAX_WEEKS_VISIBLE);
  

  // Get activity level for styling (0 = none, 1-3 = low to high)
  const getActivityLevel = (date: Date): number => {
    const dateKey = getLocalDateKey(date);
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
    <div className={`${className} w-full`}>
      <div className="flex gap-2 sm:gap-4">
        {/* Fixed Day labels */}
        <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 text-[10px] md:text-sm text-text-muted justify-start pt-[20px] md:pt-[24px]">
          {dayLabels.map((day, i) => (
            <div key={i} className="h-3.5 md:h-4 lg:h-5 xl:h-6 flex items-center pr-1 sm:pr-2">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Scrollable Month labels + Grid */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-x-auto scrollbar-hide pb-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex flex-col gap-1.5 md:gap-3 min-w-max">
            {/* Month labels row */}
            <div className="flex gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
              {visibleWeeks.map((week, weekIndex) => {
                const firstDayOfWeek = week[0];
                const showMonth = firstDayOfWeek.getDate() <= 7 || weekIndex === 0;
                return (
                  <div key={weekIndex} className="w-3.5 md:w-4 lg:w-5 xl:w-6 text-[10px] md:text-sm text-text-muted font-medium shrink-0">
                    {showMonth ? monthLabels[firstDayOfWeek.getMonth()].slice(0, 3) : ''}
                  </div>
                );
              })}
            </div>

            {/* Calendar grid */}
            <div className="flex gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
              {visibleWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 shrink-0">
                  {/* Days in week */}
                  {week.map((date, dayIndex) => {
                    const dateKey = getLocalDateKey(date);
                    const isToday = dateKey === todayKey;
                    const isFuture = dateKey > todayKey;
                    const level = getActivityLevel(date);
                    const activityCount = activityMap.get(dateKey) || 0;

                    if (isFuture) {
                      return (
                        <div
                          key={dayIndex}
                          className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 opacity-0"
                        />
                      );
                    }

                    return (
                      <div
                        key={dayIndex}
                        className={`
                          w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded-sm transition-[background-color,opacity] duration-200
                          ${getColorClass(level)}
                          ${isToday ? 'ring-2 ring-primary ring-offset-1 z-10' : ''}
                          hover:ring-2 hover:ring-gray-400 hover:ring-offset-1
                          cursor-pointer shrink-0
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
