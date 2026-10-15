import { useState } from "react";
import { Moon, Sun, Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AuthScreen() {
  const { login, signUp, theme, toggleTheme } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const { error: err } = await login(email, password);
      if (err) {
        setError(err.includes("Invalid login") ? "Incorrect email or password." : err);
        setLoading(false);
      }
    } else {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(email, password, name || "User");
      if (err) {
        setError(err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-300/30 blur-3xl dark:bg-primary-600/20" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-700/15" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl dark:bg-emerald-700/10" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full glass text-slate-700 transition-all duration-300 hover:scale-110 dark:text-slate-200"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              CalmDesk
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your calm, focused productivity companion
            </p>
          </div>

          {/* Card */}
          <div className="glass-card rounded-3xl p-8">
            {/* Toggle */}
            <div className="relative mb-7 flex rounded-full bg-slate-200/60 p-1 dark:bg-slate-800/60">
              <div
                className="absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg transition-all duration-300"
                style={{ transform: mode === "login" ? "translateX(0%)" : "translateX(100%)" }}
              />
              <button
                onClick={() => { setMode("login"); setError(null); }}
                className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${
                  mode === "login" ? "text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode("signup"); setError(null); }}
                className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${
                  mode === "signup" ? "text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div className="animate-fade-in">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-200/60 bg-white/50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200/60 bg-white/50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200/60 bg-white/50 py-3 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="animate-fade-in rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <button
                    type="button"
                    onClick={() => setRemember((r) => !r)}
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-300 ${
                      remember
                        ? "border-primary-500 bg-primary-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {remember && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            Your data is securely stored in the cloud and syncs across devices
          </p>
        </div>
      </div>
    </div>
  );
}
