import { Home, ClipboardCheck, ListTodo, BookOpen, Settings, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ViewKey } from "@/types";

const NAV_ITEMS: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "check-in", label: "Daily Check-In", icon: ClipboardCheck },
  { key: "tasks", label: "My Tasks", icon: ListTodo },
  { key: "journal", label: "Daily Journal", icon: BookOpen },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { activeView, setActiveView } = useApp();

  return (
    <aside className="sticky top-0 z-30 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
          <Sparkles className="text-white" size={20} />
        </div>
        <span className="text-lg font-bold text-slate-800 dark:text-white">
          CalmDesk
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-primary-500/10 to-transparent text-primary-700 dark:text-primary-300"
                  : "text-slate-600 hover:bg-slate-200/40 dark:text-slate-400 dark:hover:bg-slate-800/40"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
              )}
              <Icon
                size={20}
                className={`transition-transform duration-300 group-hover:scale-110 ${
                  active ? "text-primary-600 dark:text-primary-400" : ""
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="px-3 pb-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-transparent p-4 dark:from-primary-500/15">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Stay calm, stay focused
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            You've got this. Take it one task at a time.
          </p>
        </div>
      </div>
    </aside>
  );
}
