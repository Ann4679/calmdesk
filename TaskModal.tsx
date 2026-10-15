import { useState } from "react";
import { X } from "lucide-react";
import type { Priority, Status, Task } from "@/types";

interface Props {
  onClose: () => void;
  onSave: (t: Omit<Task, "id" | "createdAt">) => void;
  editTask?: Task | null;
}

export default function TaskModal({ onClose, onSave, editTask }: Props) {
  const [title, setTitle] = useState(editTask?.title ?? "");
  const [description, setDescription] = useState(editTask?.description ?? "");
  const [priority, setPriority] = useState<Priority>(editTask?.priority ?? "Medium");
  const [status, setStatus] = useState<Status>(editTask?.status ?? "To Do");
  const [dueDate, setDueDate] = useState(editTask?.dueDate ?? new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), priority, status, dueDate });
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200/60 bg-white/50 py-2.5 px-4 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white";

  const priorities: Priority[] = ["High", "Medium", "Low"];
  const statuses: Status[] = ["In Progress", "To Do", "Completed"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg animate-scale-in rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl dark:border-slate-700/40 dark:bg-slate-800/80">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {editTask ? "Edit Task" : "Add New Task"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={inputClass}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Priority
              </label>
              <div className="flex gap-1.5">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all duration-300 ${
                      priority === p
                        ? p === "High"
                          ? "border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : p === "Medium"
                            ? "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "border-slate-200/60 text-slate-500 dark:border-slate-700/50 dark:text-slate-400"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className={inputClass}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200/60 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-200/40 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
            >
              {editTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
