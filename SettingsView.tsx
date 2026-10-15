import { useState, useRef } from "react";
import { User, Upload, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SettingsView() {
  const { profile, setProfile } = useApp();
  const [name, setName] = useState(profile.displayName);
  const [subtitle, setSubtitle] = useState(profile.subtitle);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarInput, setAvatarInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setProfile({
        displayName: name.trim() || "User",
        subtitle: subtitle.trim() || "Member",
        avatar,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      /* show error */
    }
    setSaving(false);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200/60 bg-white/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white";

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your profile and customize how you appear across CalmDesk.
        </p>
      </div>

      {/* Avatar section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-2">
          <User size={18} className="text-primary-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Profile Picture
          </h3>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {/* Current avatar */}
          <div className="relative">
            <img
              src={avatar}
              alt="Profile"
              className="h-28 w-28 rounded-2xl object-cover ring-4 ring-primary-500/20"
            />
          </div>

          <div className="flex-1 space-y-4">
            {/* Upload */}
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/40 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700/50 dark:bg-slate-800/30 dark:text-slate-300"
              >
                <Upload size={16} /> Upload from device
              </button>
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                Image is stored in the cloud. Max 2MB.
              </p>
            </div>

            {/* URL input */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Or paste an image URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <button
                  onClick={() => {
                    if (avatarInput.trim()) setAvatar(avatarInput.trim());
                  }}
                  className="rounded-xl bg-slate-200/60 px-4 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-300/60 dark:bg-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-700/80"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-5 flex items-center gap-2">
          <User size={18} className="text-primary-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Profile Information
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Subtitle / Role
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. STUDENT, DEVELOPER, DESIGNER"
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              This appears next to your name in the top bar.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
            >
              {saved ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setName(profile.displayName);
                setSubtitle(profile.subtitle);
                setAvatar(profile.avatar);
              }}
              className="rounded-xl border border-slate-200/60 px-5 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-slate-200/40 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/40"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
