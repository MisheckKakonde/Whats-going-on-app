import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { DAYS_OF_WEEK_FILTER } from '../data/mockData';
import { EventItem } from '../types';

interface DateFilterBarProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  events: EventItem[];
}

export const DateFilterBar: React.FC<DateFilterBarProps> = ({
  selectedDate,
  onSelectDate,
  events,
}) => {
  // Count how many events fall on each day
  const getEventCountForDate = (dateKey: string) => {
    if (dateKey === 'all') return events.length;
    return events.filter((e) => e.date === dateKey).length;
  };

  return (
    <div className="bg-zinc-50 border-b border-zinc-200 px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>7-Day Calendar Filter</span>
        </div>
        <span className="text-[11px] text-zinc-500 font-medium">
          {selectedDate === 'all'
            ? `${events.length} events scheduled this week`
            : `${getEventCountForDate(selectedDate)} events on this day`}
        </span>
      </div>

      {/* Horizontal Scrollable Days */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-1 px-1">
        {DAYS_OF_WEEK_FILTER.map((item) => {
          const isSelected = selectedDate === item.key;
          const count = getEventCountForDate(item.key);
          const isToday = 'isToday' in item && item.isToday;

          if (item.key === 'all') {
            return (
              <button
                key={item.key}
                id={`date-filter-${item.key}`}
                onClick={() => onSelectDate(item.key)}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[70px] h-[58px] px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm shadow-zinc-900/10'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/60'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Sparkles className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-zinc-400'}`} />
                  <span className="text-[11px] uppercase tracking-wider font-bold">All</span>
                </div>
                <span className={`text-[11px] mt-0.5 font-medium ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  7 Days
                </span>
                <span
                  className={`text-[9px] mt-0.5 px-1.5 rounded-full font-bold ${
                    isSelected ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.key}
              id={`date-filter-${item.key}`}
              onClick={() => onSelectDate(item.key)}
              className={`flex-shrink-0 flex flex-col items-center justify-between min-w-[58px] h-[58px] py-1.5 px-2 rounded-xl text-xs transition-all border relative ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm shadow-zinc-900/10 scale-[1.02]'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/60'
              }`}
            >
              {isToday && (
                <span
                  className={`absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter ${
                    isSelected ? 'bg-amber-400 text-zinc-900' : 'bg-emerald-600 text-white'
                  }`}
                >
                  Today
                </span>
              )}

              <span
                className={`text-[10px] uppercase font-bold tracking-wider ${
                  isSelected ? 'text-zinc-300' : 'text-zinc-500'
                }`}
              >
                {item.day}
              </span>

              <span className="text-sm font-black leading-none my-0.5">
                {item.dateNum}
              </span>

              {/* Event count dot or number */}
              <div className="flex items-center gap-1">
                {count > 0 ? (
                  <span
                    className={`text-[9px] font-bold px-1.5 rounded-full leading-tight ${
                      isSelected ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {count} {count === 1 ? 'event' : 'events'}
                  </span>
                ) : (
                  <span className={`text-[9px] ${isSelected ? 'text-zinc-500' : 'text-zinc-300'}`}>-</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
