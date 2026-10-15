import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarWidget() {
  const { tasks, selectedDate, setSelectedDate } = useApp();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = today.toISOString().slice(0, 10);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const tasksByDate = new Map<string, number>();
  tasks.forEach((t) => {
    const count = tasksByDate.get(t.dueDate) ?? 0;
    tasksByDate.set(t.dueDate, count + 1);
  });

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const dateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="glass-card rounded-2xl p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-200/50 hover:text-slate-700 dark:hover:bg-slate-700/50 dark:hover:text-slate-200"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-200/50 hover:text-slate-700 dark:hover:bg-slate-700/50 dark:hover:text-slate-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const ds = dateStr(day);
          const isToday = ds === todayStr;
          const isSelected = ds === selectedDate;
          const hasTasks = tasksByDate.has(ds);

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(isSelected ? null : ds)}
              className={`relative flex h-9 items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25"
                  : isToday
                    ? "border border-primary-400 text-primary-600 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-200/40 dark:text-slate-300 dark:hover:bg-slate-700/40"
              }`}
            >
              {day}
              {hasTasks && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary-500" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 rounded-xl bg-primary-500/10 px-3 py-2 text-center animate-fade-in">
          <p className="text-xs text-primary-600 dark:text-primary-400">
            Showing tasks due on {selectedDate}
          </p>
        </div>
      )}
    </div>
  );
}
