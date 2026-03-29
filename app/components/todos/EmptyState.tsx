import { useLocation } from "react-router";
import { Inbox, Sun, Calendar, CheckCircle2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

const emptyConfig = {
  backlog: {
    icon: Inbox,
    title: "No tasks in backlog",
    description: "Tasks you create will appear here until you schedule them.",
  },
  today: {
    icon: Sun,
    title: "Your day is clear",
    description: "Move tasks here to focus on what matters today.",
  },
  upcoming: {
    icon: Calendar,
    title: "Nothing scheduled",
    description: "Plan ahead by scheduling tasks for later.",
  },
  completed: {
    icon: CheckCircle2,
    title: "No completed tasks",
    description: "Complete some tasks to see them here.",
  },
};

export default function EmptyState({ view, onCreateTask }) {
  const location = useLocation();
  const defaults = {
    "/backlog": "backlog",
    "/today": "today",
    "/upcoming": "upcoming",
    "/completed": "completed",
  };
  const config =
    emptyConfig[defaults[location.pathname]] || emptyConfig.backlog;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        {config.title}
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-xs mb-6">
        {config.description}
      </p>
      {view !== "completed" && (
        <Button
          onClick={onCreateTask}
          variant="outline"
          className="border-slate-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      )}
    </div>
  );
}
