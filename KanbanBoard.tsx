import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Status, Task } from "@/types";
import {
  PILL_FILTERS,
  PRIORITY_STYLES,
  PRIORITY_DOT,
  COLUMN_ACCENTS,
  COLUMNS,
  pillToPriority,
} from "./constants";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

export default function KanbanBoard() {
  const { tasks, priorityFilter, setPriorityFilter, selectedDate, setSelectedDate, searchQuery, addTask, updateTask, deleteTask, dataLoading } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<Status>("To Do");
  const [editTask, setEditTask] = useState<Task | null>(null);

  const filtered = tasks.filter((t) => {
    if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
    if (selectedDate && t.dueDate !== selectedDate) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const openAdd = (status: Status) => {
    setEditTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Filter pills */}
      {dataLoading ? (
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Loading your tasks...
        </div>
      ) : (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {PILL_FILTERS.map((pill) => {
            const active = priorityFilter === pillToPriority(pill);
            return (
              <button
                key={pill}
                onClick={() => {
                  setPriorityFilter(pillToPriority(pill));
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25"
                    : "border border-slate-200/60 bg-white/40 text-slate-600 hover:border-primary-300 hover:text-primary-600 dark:border-slate-700/50 dark:bg-slate-800/30 dark:text-slate-300 dark:hover:border-primary-500/50"
                }`}
              >
                {pill}
              </button>
            );
          })}
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="ml-1 rounded-full bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400"
            >
              Date filter: {selectedDate} ✕
            </button>
          )}
        </div>
      )}

      {/* Columns */}
      <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col);
          return (
            <div
              key={col}
              className="flex flex-col rounded-2xl border border-slate-200/50 bg-white/30 p-3 dark:border-slate-700/40 dark:bg-slate-800/20"
            >
              {/* Header */}
              <div className="mb-3 flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${COLUMN_ACCENTS[col]}`} />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {col}
                  </h3>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200/60 px-2 text-[11px] font-bold text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-1 py-1 max-h-[calc(100vh-280px)]">
                {colTasks.length === 0 && (
                  <div className="flex flex-1 items-center justify-center py-12 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-600">
                      No tasks here yet
                    </p>
                  </div>
                )}
                {colTasks.map((task) => (
                  <div key={task.id} onClick={() => openEdit(task)} className="cursor-pointer">
                    <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                  </div>
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={() => openAdd(col)}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300/60 py-2.5 text-xs font-medium text-slate-500 transition-all duration-300 hover:border-primary-400 hover:bg-primary-500/5 hover:text-primary-600 dark:border-slate-700/50 dark:text-slate-400 dark:hover:border-primary-500/50"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          onClose={() => setModalOpen(false)}
          onSave={(t) => {
            if (editTask) {
              updateTask(editTask.id, t).catch(console.error);
            } else {
              addTask(t).catch(console.error);
            }
          }}
          editTask={editTask ? { ...editTask, status: defaultStatus } : null}
        />
      )}
    </div>
  );
}
