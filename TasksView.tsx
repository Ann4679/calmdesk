import KanbanBoard from "@/components/kanban/KanbanBoard";
import CalendarWidget from "@/components/rightPanel/CalendarWidget";
import QuoteAndMetrics from "@/components/rightPanel/QuoteAndMetrics";

export default function TasksView() {
  return (
    <div className="flex gap-6">
      <div className="w-full xl:w-[70%]">
        <KanbanBoard />
      </div>
      <div className="hidden xl:block w-[30%] space-y-5">
        <CalendarWidget />
        <QuoteAndMetrics />
      </div>
    </div>
  );
}
