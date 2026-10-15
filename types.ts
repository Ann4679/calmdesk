export type Priority = "High" | "Medium" | "Low";
export type Status = "In Progress" | "To Do" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export type ViewKey =
  | "home"
  | "check-in"
  | "tasks"
  | "journal"
  | "settings";

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-5
  energy: number; // 1-5
  note: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  body: string;
  createdAt: string;
}

export interface Profile {
  displayName: string;
  subtitle: string;
  avatar: string; // URL or base64 string
}

export interface AppState {
  theme: "light" | "dark";
  isLoggedIn: boolean;
  profile: Profile;
  tasks: Task[];
  checkIns: CheckIn[];
  journal: JournalEntry[];
}
