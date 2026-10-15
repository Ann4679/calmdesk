import { useState } from "react";
import { BookOpen, Plus, Trash2, Calendar as CalIcon, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function JournalView() {
  const { journal, addJournal, deleteJournal } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      await addJournal({ date, title: title.trim(), body: body.trim() });
      setTitle("");
      setBody("");
      setDate(new Date().toISOString().slice(0, 10));
      setShowForm(false);
    } catch {
      /* show error inline */
    }
    setSaving(false);
  };

  const formatNice = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const inputClass =
    "w-full rounded-xl border border-slate-200/60 bg-white/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white";

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Journal</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Reflect on your day and track your thoughts.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
        >
          <Plus size={16} /> New Entry
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card animate-scale-in rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-2">
            <BookOpen size={18} className="text-primary-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              New Journal Entry
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What happened today?"
                  className={inputClass}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Entry
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your thoughts..."
                rows={5}
                className={`${inputClass} resize-none`}
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200/60 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-200/40 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/40"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries */}
      <div className="space-y-4">
        {journal.length === 0 && !showForm && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <BookOpen size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No journal entries yet. Click "New Entry" to start writing.
            </p>
          </div>
        )}
        {journal.map((entry) => (
          <div
            key={entry.id}
            className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <CalIcon size={14} />
                {formatNice(entry.date)}
              </div>
              <button
                onClick={async () => {
                  setDeletingId(entry.id);
                  try {
                    await deleteJournal(entry.id);
                  } catch {
                    /* ignore */
                  }
                  setDeletingId(null);
                }}
                disabled={deletingId === entry.id}
                className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-500 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === entry.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">
              {entry.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {entry.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
