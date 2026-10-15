import type { Priority, Status } from "@/types";

export const PILL_FILTERS = ["All Tasks", "High Priority", "Medium Priority", "Low Priority"] as const;
export type PillFilter = (typeof PILL_FILTERS)[number];

export const COLUMNS: Status[] = ["In Progress", "To Do", "Completed"];

export const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 dark:bg-rose-500/15",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15",
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15",
};

export const PRIORITY_DOT: Record<Priority, string> = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
};

export const COLUMN_ACCENTS: Record<Status, string> = {
  "In Progress": "bg-blue-500",
  "To Do": "bg-amber-500",
  Completed: "bg-emerald-500",
};

export function pillToPriority(pill: PillFilter): "All" | Priority {
  if (pill === "All Tasks") return "All";
  return pill.replace(" Priority", "") as Priority;
}
