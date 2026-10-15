import type { Task, JournalEntry, CheckIn } from "@/types";

function inDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "Finish calculus problem set",
    description: "Chapter 7 exercises on integration techniques",
    priority: "High",
    status: "In Progress",
    dueDate: inDays(1),
    createdAt: inDays(-2),
  },
  {
    id: "t2",
    title: "Read research paper on neural networks",
    description: "Annotate key sections for the seminar discussion",
    priority: "Medium",
    status: "In Progress",
    dueDate: inDays(3),
    createdAt: inDays(-1),
  },
  {
    id: "t3",
    title: "Prepare presentation slides",
    description: "Slides for Thursday's project update meeting",
    priority: "High",
    status: "To Do",
    dueDate: inDays(4),
    createdAt: inDays(0),
  },
  {
    id: "t4",
    title: "Grocery shopping",
    description: "Weekly groceries run",
    priority: "Low",
    status: "To Do",
    dueDate: inDays(2),
    createdAt: inDays(0),
  },
  {
    id: "t5",
    title: "Submit scholarship application",
    description: "Deadline is approaching — gather recommendation letters",
    priority: "High",
    status: "To Do",
    dueDate: inDays(5),
    createdAt: inDays(-3),
  },
  {
    id: "t6",
    title: "Review lecture notes",
    description: "Re-read machine learning lecture 9 and 10",
    priority: "Medium",
    status: "Completed",
    dueDate: inDays(-1),
    createdAt: inDays(-4),
  },
  {
    id: "t7",
    title: "Update resume",
    description: "Add recent project experience and skills",
    priority: "Low",
    status: "Completed",
    dueDate: inDays(-2),
    createdAt: inDays(-5),
  },
  {
    id: "t8",
    title: "Team standup meeting",
    description: "Weekly sync with study group",
    priority: "Medium",
    status: "Completed",
    dueDate: inDays(-3),
    createdAt: inDays(-6),
  },
];

export const SEED_JOURNAL: JournalEntry[] = [
  {
    id: "j1",
    date: inDays(-1),
    title: "A productive study session",
    body: "Spent three hours at the library and got through most of the calculus problem set. Feeling good about tomorrow's quiz. Need to keep this momentum going.",
    createdAt: inDays(-1),
  },
  {
    id: "j2",
    date: inDays(-3),
    title: "Reflection on the week",
    body: "This week was challenging but I managed my time better than usual. The new scheduling system is working well. I should remember to take more breaks though.",
    createdAt: inDays(-3),
  },
];

export const SEED_CHECKINS: CheckIn[] = [
  { id: "c1", date: inDays(-1), mood: 4, energy: 3, note: "Good day overall, felt focused." },
  { id: "c2", date: inDays(-2), mood: 3, energy: 4, note: "A bit stressed but energized." },
  { id: "c3", date: inDays(-3), mood: 5, energy: 5, note: "Great day! Super productive." },
];

export const SEED_AVATAR = "https://i.pravatar.cc/150?img=12";
