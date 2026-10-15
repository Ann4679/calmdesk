import { Search, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const { theme, toggleTheme, profile, logout, searchQuery, setSearchQuery } = useApp();

  const handleLogout = () => {
    logout().catch(console.error);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200/60 bg-white/40 px-6 py-3.5 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/30">
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, journal entries..."
          className="w-full rounded-xl border border-slate-200/50 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50">
          <Bell size={20} />
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2.5 rounded-xl bg-slate-200/40 py-1.5 pl-1.5 pr-3 dark:bg-slate-800/40">
          <img
            src={profile.avatar}
            alt={profile.displayName}
            className="h-8 w-8 rounded-lg object-cover ring-2 ring-primary-500/20"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-700 dark:text-white">
              {profile.displayName}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {profile.subtitle}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-500 dark:text-slate-300 dark:hover:bg-rose-500/15"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
