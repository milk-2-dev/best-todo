import React from "react";
import {
  Calendar,
  Flag,
  MoreHorizontal,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

const priorityConfig = {
  low: { color: "text-slate-400", bg: "bg-slate-100", label: "Low" },
  medium: { color: "text-amber-500", bg: "bg-amber-50", label: "Medium" },
  high: { color: "text-red-500", bg: "bg-red-50", label: "High" },
};

export default function TodoCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
  variant = "list",
}) {
  const isCompleted = task.status === "completed";
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleComplete(task);
  };

  if (variant === "kanban") {
    return (
      <div
        onClick={() => onEdit(task)}
        className="group bg-white rounded-xl border border-slate-200/60 p-4 cursor-pointer hover:shadow-md hover:border-slate-300/60 transition-all duration-200"
      >
        <div className="flex items-start gap-3">
          <button onClick={handleToggle} className="mt-0.5 flex-shrink-0">
            {isCompleted ? (
              <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500" />
            ) : (
              <Circle className="w-[18px] h-[18px] text-slate-300 hover:text-slate-400 transition-colors" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm font-medium text-slate-900 leading-snug",
                isCompleted && "line-through text-slate-400"
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              {task.priority && task.priority !== "medium" && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                    priority.bg,
                    priority.color
                  )}
                >
                  <Flag className="w-3 h-3" />
                  {priority.label}
                </span>
              )}
              {task.due_date && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.due_date), "MMM d")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onEdit(task)}
      className="group flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border border-slate-200/60 cursor-pointer hover:shadow-md hover:border-slate-300/60 transition-all duration-200"
    >
      <button onClick={handleToggle} className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-slate-900",
            isCompleted && "line-through text-slate-400"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {task.priority && <Flag className={cn("w-4 h-4", priority.color)} />}
        {task.due_date && (
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(task.due_date), "MMM d")}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task, "backlog");
              }}
            >
              Move to Backlog
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task, "today");
              }}
            >
              Move to Today
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task, "upcoming");
              }}
            >
              Move to Upcoming
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
