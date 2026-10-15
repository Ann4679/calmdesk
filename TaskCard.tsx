import { Calendar, Trash2, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Task, Priority, Status } from "@/types";
import { PRIORITY_STYLES, PRIORITY_DOT } from "./constants";

interface Props {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statuses: Status[] = ["In Progress", "To Do", "Completed"];
  const priorities: Priority[] = ["High", "Medium", "Low"];

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="group relative cursor-grab rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-slate-200/40 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:shadow-black/20">
      {/* Top row */}
      <div className="mb-2 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PRIORITY_STYLES[task.priority]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
          {task.priority}
        </span>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-lg p-1 text-slate-400 opacity-0 transition-all duration-200 hover:bg-slate-200/50 group-hover:opacity-100 dark:hover:bg-slate-700/50"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-44 animate-scale-in rounded-xl border border-slate-200/60 bg-white/90 p-2 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/90">
              <p className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">Move to</p>
              {statuses.map((s) => (
                <button
                  key={s}
                  disabled={s === task.status}
                  onClick={() => {
                    onUpdate(task.id, { status: s });
                    setMenuOpen(false);
                  }}
                  className={`block w-full rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    s === task.status
                      ? "cursor-default text-slate-400 dark:text-slate-600"
                      : "text-slate-700 hover:bg-slate-200/50 dark:text-slate-200 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {s}
                </button>
              ))}
              <div className="my-1 border-t border-slate-200/50 dark:border-slate-700/50" />
              <p className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">Priority</p>
              {priorities.map((p) => (
                <button
                  key={p}
                  disabled={p === task.priority}
                  onClick={() => {
                    onUpdate(task.id, { priority: p });
                    setMenuOpen(false);
                  }}
                  className={`block w-full rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    p === task.priority
                      ? "cursor-default text-slate-400 dark:text-slate-600"
                      : "text-slate-700 hover:bg-slate-200/50 dark:text-slate-200 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <div className="my-1 border-t border-slate-200/50 dark:border-slate-700/50" />
              <button
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-rose-500 transition-colors hover:bg-rose-500/10"
              >
                <Trash2 size={14} /> Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status badge */}
      <span className="mb-2 inline-block rounded-md bg-slate-100/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
        {task.status === "In Progress" ? "ONGOING" : task.status === "To Do" ? "PENDING" : "DONE"}
      </span>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {task.title}
      </h4>
      {task.description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Due date */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <Calendar size={13} />
        <span>{formatDate(task.dueDate)}</span>
      </div>
    </div>
  );
}
