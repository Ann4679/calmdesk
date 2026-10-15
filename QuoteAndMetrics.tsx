import { Quote, TrendingUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getQuoteOfTheDay } from "@/data/quotes";

export default function QuoteAndMetrics() {
  const { tasks } = useApp();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const todo = tasks.filter((t) => t.status === "To Do").length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Quote card */}
      <div className="glass-card relative overflow-hidden rounded-2xl p-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-500/10 blur-2xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <Quote size={18} className="text-primary-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quote of the Day
            </span>
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">
            "{getQuoteOfTheDay()}"
          </p>
        </div>
      </div>

      {/* Metrics card */}
      <div className="glass-card rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Performance
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Completion Rate
          </span>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {rate}%
          </span>
        </div>
        <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-700/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "In Progress", value: inProgress, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "To Do", value: todo, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Done", value: completed, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl ${stat.bg} p-3 text-center transition-transform duration-300 hover:scale-105`}
            >
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
