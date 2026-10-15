import { Loader2, Sparkles } from "lucide-react";
import { AppProvider, useApp } from "@/context/AppContext";
import AuthScreen from "@/components/AuthScreen";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import HomeView from "@/components/views/HomeView";
import TasksView from "@/components/views/TasksView";
import CheckInView from "@/components/views/CheckInView";
import JournalView from "@/components/views/JournalView";
import SettingsView from "@/components/views/SettingsView";

function MainApp() {
  const { session, authReady, activeView } = useApp();

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
            <Sparkles className="text-white" size={24} />
          </div>
          <Loader2 size={24} className="animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div key={activeView} className="animate-fade-in-up">
            {activeView === "home" && <HomeView />}
            {activeView === "tasks" && <TasksView />}
            {activeView === "check-in" && <CheckInView />}
            {activeView === "journal" && <JournalView />}
            {activeView === "settings" && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
