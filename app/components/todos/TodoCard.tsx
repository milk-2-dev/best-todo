import { useState } from "react";
import {
  Calendar,
  Flag,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  ListChecks,
} from "lucide-react";
import { format } from "date-fns";
import { ChevronRightIcon, ChevronDownIcon, Trash2 } from "lucide-react";

import { cn } from "~/lib/utils";

import type { TodoNode, ViewMode } from "~/types/todo";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

const priorityConfig = {
  low: { color: "text-slate-400", bg: "bg-slate-100", label: "Low" },
  medium: { color: "text-amber-500", bg: "bg-amber-50", label: "Medium" },
  high: { color: "text-red-500", bg: "bg-red-50", label: "High" },
};

type TodoCardProps = {
  task: TodoNode;
  nestingLevel: number;
  onToggleComplete: (task: any) => void;
  onEdit: (task: any) => void;
  onDelete: (task: any) => void;
  variant?: ViewMode;
};

const DEFAULT_NESTING_LEVEL = 0;

export default function TodoCard({
  task,
  nestingLevel = DEFAULT_NESTING_LEVEL,
  onToggleComplete,
  onEdit,
  onDelete,
  variant = "list",
}: TodoCardProps) {
  const isCompleted = task.completed;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const nestingClass = `ml-${nestingLevel * 2 + 4}`;
  const [isOpened, setIsOpened] = useState(false);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleComplete(task);
  };

  if (variant === "board") {
    return (
      <div className="group bg-white rounded-xl border border-slate-200/60 p-4 cursor-pointer hover:shadow-md hover:border-slate-300/60 transition-all duration-200">
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
              onClick={() => onEdit(task)}
              className={cn(
                "text-sm font-medium text-slate-900 leading-snug hover:under",
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
              {task.subtasks?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <ListChecks className="w-3 h-3" />
                  {task.subtasks.filter((s) => s.status === "completed").length}
                  /{task.subtasks.length}
                </span>
              )}
              {task.dueDate && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.dueDate), "MMM d")}
                </span>
              )}
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCollapsibleChanged = (isOpen: boolean) => {
    setIsOpened(isOpen);
  };

  return (
    <Collapsible key={task.$id} onOpenChange={handleCollapsibleChanged}>
      <div
        className={cn(
          "group  bg-white transition-all duration-200",
          nestingLevel === DEFAULT_NESTING_LEVEL &&
            "py-3.5 px-4 border border-slate-200/60 rounded-xl hover:shadow-md hover:border-slate-300/60"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center relative pl-8">
            {task.subtasks?.length > 0 && (
              <CollapsibleTrigger
                asChild
                className="absolute left-0 top-1/2 -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="cursor-pointer"
                >
                  {isOpened ? (
                    <ChevronDownIcon className="transition-transform group-data-[state=open]:rotate-90" />
                  ) : (
                    <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                  )}
                </Button>
              </CollapsibleTrigger>
            )}

            <button onClick={handleToggle} className="shrink-0 cursor-pointer">
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 transition-colors" />
              )}
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <p
              onClick={() => onEdit(task)}
              className={cn(
                "text-sm font-medium text-slate-900 hover:underline cursor-pointer",
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
            {task.subtasks?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <ListChecks className="w-3 h-3" />
                {task.subtasks.filter((s) => s.status === "completed").length}/
                {task.subtasks.length}
              </span>
            )}

            {task.dueDate && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            )}

            {task.priority && (
              <Flag className={cn("w-4 h-4", priority.color)} />
            )}

            <Button
              className="cursor-pointer text-slate-500 hover:text-red-600 hover:bg-white"
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(task)}
            >
              <Trash2 />
            </Button>

            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
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
            </DropdownMenu> */}
          </div>
        </div>

        {task.subtasks?.length > 0 && (
          <CollapsibleContent
            className={`${nestingClass} border-t border-slate-200/60 mt-3 space-y-3 pt-3`}
          >
            {task.subtasks.map((subtask) => (
              <TodoCard
                key={subtask.$id}
                task={subtask}
                nestingLevel={nestingLevel + 1}
                variant={variant}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}
