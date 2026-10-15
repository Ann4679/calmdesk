import KanbanBoard from "@/components/kanban/KanbanBoard";
import CalendarWidget from "@/components/rightPanel/CalendarWidget";
import QuoteAndMetrics from "@/components/rightPanel/QuoteAndMetrics";

export default function HomeView() {
  return (
    <div className="flex gap-6">
      {/* Kanban — 70% */}
      <div className="w-full xl:w-[70%]">
        <KanbanBoard />
      </div>

      {/* Right panel — 30% */}
      <div className="hidden xl:block w-[30%] space-y-5">
        <CalendarWidget />
        <QuoteAndMetrics />
      </div>
    </div>
  );
}
