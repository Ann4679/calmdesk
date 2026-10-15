import { useState } from "react";
import { ClipboardCheck, Save, Smile, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

const MOODS = [
  { value: 1, emoji: "😞", label: "Struggling", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { value: 2, emoji: "😕", label: "Below avg", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { value: 3, emoji: "😐", label: "Okay", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  { value: 4, emoji: "🙂", label: "Good", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { value: 5, emoji: "😄", label: "Great", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];

export default function CheckInView() {
  const { checkIns, addCheckIn } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const existing = checkIns.find((c) => c.date === today);

  const [mood, setMood] = useState(existing?.mood ?? 3);
  const [energy, setEnergy] = useState(existing?.energy ?? 3);
  const [note, setNote] = useState(existing?.note ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await addCheckIn({ date: today, mood, energy, note: note.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Could not save. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
    setSaving(false);
  };

  const formatNice = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Check-In</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          How are you feeling today, {formatNice(today)}?
        </p>
      </div>

      {/* Check-in card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-6 flex items-center gap-2">
          <ClipboardCheck size={18} className="text-primary-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Today's Check-In
          </h3>
        </div>

        {/* Mood */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Mood
          </label>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-all duration-300 ${
                  mood === m.value
                    ? `border-transparent ${m.color} scale-105 shadow-sm`
                    : "border-slate-200/60 text-slate-400 hover:scale-105 dark:border-slate-700/50"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Energy Level
            </label>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {energy}/5
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Notes (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200/60 bg-white/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : saved ? (
            <>
              <Smile size={16} /> Saved! Have a great day
            </>
          ) : (
            <>
              <Save size={16} /> Save Check-In
            </>
          )}
        </button>
        {error && (
          <p className="mt-3 text-xs text-rose-500">{error}</p>
        )}
      </div>

      {/* History */}
      {checkIns.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Recent Check-Ins
          </h3>
          <div className="space-y-3">
            {checkIns.slice(0, 7).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200/40 bg-white/30 p-3 dark:border-slate-700/40 dark:bg-slate-800/20"
              >
                <span className="text-2xl">{MOODS[c.mood - 1].emoji}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {formatNice(c.date)}
                  </p>
                  {c.note && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {c.note}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Energy</p>
                  <p className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    {c.energy}/5
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
