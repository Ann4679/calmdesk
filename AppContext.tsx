import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Profile, Task, JournalEntry, CheckIn, ViewKey, Priority, Status } from "@/types";

interface AppContextValue {
  // auth
  session: Session | null;
  authReady: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  // theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  // profile
  profile: Profile;
  setProfile: (p: Profile) => Promise<void>;
  // data
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  journal: JournalEntry[];
  addJournal: (e: { date: string; title: string; body: string }) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  checkIns: CheckIn[];
  addCheckIn: (c: Omit<CheckIn, "id">) => Promise<void>;
  // UI state
  activeView: ViewKey;
  setActiveView: (v: ViewKey) => void;
  selectedDate: string | null;
  setSelectedDate: (d: string | null) => void;
  priorityFilter: "All" | Priority;
  setPriorityFilter: (f: "All" | Priority) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dataLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultProfile: Profile = {
  displayName: "User",
  subtitle: "STUDENT",
  avatar: "https://i.pravatar.cc/150?img=12",
};

export function AppProvider({ children }: { children: ReactNode }) {
  // UI prefs stay in localStorage
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("calmdesk-theme", "dark");
  const [activeView, setActiveView] = useLocalStorage<ViewKey>("calmdesk-view", "home");
  const [selectedDate, setSelectedDate] = useLocalStorage<string | null>("calmdesk-seldate", null);
  const [priorityFilter, setPriorityFilter] = useLocalStorage<"All" | Priority>("calmdesk-pfilter", "All");
  const [searchQuery, setSearchQuery] = useLocalStorage<string>("calmdesk-search", "");

  // Cloud data
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Load all user data when session changes
  const loadUserData = useCallback(async (userId: string) => {
    setDataLoading(true);

    const [profileRes, tasksRes, journalRes, checkInsRes] = await Promise.all([
      supabase.from("profiles").select("display_name, subtitle, avatar").eq("id", userId).maybeSingle(),
      supabase.from("tasks").select("id, title, description, priority, status, due_date, created_at").order("created_at", { ascending: false }),
      supabase.from("journal_entries").select("id, title, body, entry_date, created_at").order("created_at", { ascending: false }),
      supabase.from("check_ins").select("id, entry_date, mood, energy, note").order("entry_date", { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfileState({
        displayName: profileRes.data.display_name,
        subtitle: profileRes.data.subtitle,
        avatar: profileRes.data.avatar,
      });
    } else {
      // Auto-create profile on first login
      setProfileState(defaultProfile);
    }

    if (tasksRes.data) {
      setTasks(
        tasksRes.data.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          priority: t.priority as Priority,
          status: t.status as Status,
          dueDate: t.due_date,
          createdAt: t.created_at,
        })),
      );
    }

    if (journalRes.data) {
      setJournal(
        journalRes.data.map((e) => ({
          id: e.id,
          title: e.title,
          body: e.body,
          date: e.entry_date,
          createdAt: e.created_at,
        })),
      );
    }

    if (checkInsRes.data) {
      setCheckIns(
        checkInsRes.data.map((c) => ({
          id: c.id,
          date: c.entry_date,
          mood: c.mood,
          energy: c.energy,
          note: c.note,
        })),
      );
    }

    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserData(session.user.id);
    } else {
      setTasks([]);
      setJournal([]);
      setCheckIns([]);
      setProfileState(defaultProfile);
      setDataLoading(false);
    }
  }, [session, loadUserData]);

  // Auth methods
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    if (error) return { error: error.message };

    // Create profile row
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: name,
        subtitle: "STUDENT",
        avatar: defaultProfile.avatar,
      });
    }

    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Profile update
  const setProfile = async (p: Profile) => {
    if (!session?.user?.id) return;
    setProfileState(p);
    await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        display_name: p.displayName,
        subtitle: p.subtitle,
        avatar: p.avatar,
        updated_at: new Date().toISOString(),
      });
  };

  // Task methods
  const addTask = async (t: Omit<Task, "id" | "createdAt">) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        due_date: t.dueDate,
      })
      .select("id, title, description, priority, status, due_date, created_at")
      .single();
    if (error) throw error;
    if (data) {
      setTasks((prev) => [
        {
          id: data.id,
          title: data.title,
          description: data.description,
          priority: data.priority as Priority,
          status: data.status as Status,
          dueDate: data.due_date,
          createdAt: data.created_at,
        },
        ...prev,
      ]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const dbUpdates: Record<string, string> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

    const { error } = await supabase.from("tasks").update(dbUpdates).eq("id", id);
    if (error) throw error;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Journal methods
  const addJournal = async (e: { date: string; title: string; body: string }) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({ title: e.title, body: e.body, entry_date: e.date })
      .select("id, title, body, entry_date, created_at")
      .single();
    if (error) throw error;
    if (data) {
      setJournal((prev) => [
        {
          id: data.id,
          title: data.title,
          body: data.body,
          date: data.entry_date,
          createdAt: data.created_at,
        },
        ...prev,
      ]);
    }
  };

  const deleteJournal = async (id: string) => {
    const { error } = await supabase.from("journal_entries").delete().eq("id", id);
    if (error) throw error;
    setJournal((prev) => prev.filter((e) => e.id !== id));
  };

  // Check-in methods
  const addCheckIn = async (c: Omit<CheckIn, "id">) => {
    const { data, error } = await supabase
      .from("check_ins")
      .upsert(
        { entry_date: c.date, mood: c.mood, energy: c.energy, note: c.note },
        { onConflict: "user_id,entry_date" },
      )
      .select("id, entry_date, mood, energy, note")
      .single();
    if (error) throw error;
    if (data) {
      setCheckIns((prev) => {
        const filtered = prev.filter((e) => e.date !== c.date);
        return [
          {
            id: data.id,
            date: data.entry_date,
            mood: data.mood,
            energy: data.energy,
            note: data.note,
          },
          ...filtered,
        ];
      });
    }
  };

  const value: AppContextValue = {
    session,
    authReady,
    login,
    signUp,
    logout,
    theme,
    toggleTheme,
    profile,
    setProfile,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    journal,
    addJournal,
    deleteJournal,
    checkIns,
    addCheckIn,
    activeView,
    setActiveView,
    selectedDate,
    setSelectedDate,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    dataLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
