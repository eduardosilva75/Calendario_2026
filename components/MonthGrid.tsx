import React from 'react';
import { DayInfo } from '../types';
import { WEEKDAYS_PT, MONTH_NAMES } from '../constants';

interface Props {
  monthIndex: number;
  weeks: DayInfo[][];
}

const MonthGrid: React.FC<Props> = ({ monthIndex, weeks }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-1 text-center border-b-2 border-gray-300 pb-1">
        {MONTH_NAMES[monthIndex]}
      </h3>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-xs font-semibold text-gray-500 mb-1">
        {WEEKDAYS_PT.map((d, i) => (
          <div key={i} className="text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="flex-1 flex flex-col justify-start">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7 flex-1">
            {week.map((day, dIdx) => {
              if (!day) return <div key={dIdx} className="p-1" />;

              // Styling Logic
              // Default: white
              // Holiday: Red/Pink (Pastel)
              // Shift Off: Teal/Green (Pastel)
              // Weekend: Gray/Blue (Pastel)
              
              let bgClass = "bg-white";
              let textClass = "text-gray-700";
              let borderClass = "border border-gray-100";
              
              if (day.isHoliday) {
                bgClass = "bg-red-100 print:bg-red-100";
                textClass = "text-red-800 font-bold";
              } else if (day.isShiftOff) {
                bgClass = "bg-teal-100 print:bg-teal-100";
                textClass = "text-teal-800 font-semibold";
              } else if (day.isWeekend) {
                bgClass = "bg-slate-100 print:bg-slate-100";
                textClass = "text-slate-600";
              }

              return (
                <div
                  key={dIdx}
                  className={`
                    relative h-auto min-h-[2.2rem] flex items-center justify-center 
                    text-sm ${bgClass} ${textClass} ${borderClass}
                    hover:brightness-95 transition-all
                  `}
                  title={day.holidayName}
                >
                  {/* Day Number */}
                  <span className="z-10">{day.dayOfMonth}</span>
                  
                  {/* Week number indicator (tiny, absolute) */}
                  {dIdx === 0 && (
                    <span className="absolute left-0.5 top-0.5 text-[0.55rem] text-gray-400 no-print">
                      W{day.weekNumber}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthGrid;