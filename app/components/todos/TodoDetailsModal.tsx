import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";

import { cn } from "~/lib/utils";

import type { TodoNode } from "~/types/todo";

import {
  Calendar as CalendarIcon,
  Flag,
  Loader2,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";

import TodoCard from "./TodoCard";
import TodoForm from "./TodoForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  todo: TodoNode | null;
}

const priorityConfig = {
  low: { color: "text-slate-500", bg: "bg-slate-100", label: "Low" },
  medium: { color: "text-amber-600", bg: "bg-amber-50", label: "Medium" },
  high: { color: "text-red-600", bg: "bg-red-50", label: "High" },
};

export default function TodoDetailsModal({ isOpen, onClose, todo }: Props) {
  if (!todo) return null;

  const isCompleted = useMemo(() => todo?.completed, [todo]);
  const priority = priorityConfig[todo.priority] || priorityConfig.low;
  const [isFormOpened, setIsFormOpened] = useState(false);

  useEffect(() => {
    console.log("Todo details modal - received todo:", todo);
  }, [todo]);

  const handleToggle = () => {};
  const onFormClose = () => setIsFormOpened(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Todo details
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4">
          <div className="flex items-center relative">
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
              className={cn(
                "text-sm font-medium text-slate-900",
                isCompleted && "line-through text-slate-400"
              )}
            >
              {todo.title}
            </p>
          </div>
        </div>

        {todo.description && (
          <p className="text-sm text-slate-500 mt-0.5 truncate">
            {todo.description}
          </p>
        )}

        <div className="space-y-5 mt-1">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                priority.bg,
                priority.color
              )}
            >
              <Flag className="w-3 h-3" />
              {todo.priority} priority
            </span>
            {todo.dueDate && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                <Calendar className="w-3 h-3" />
                {format(new Date(todo.dueDate), "MMM d, yyyy")}
              </span>
            )}
          </div>

          {/* Created date */}
          {/* {task.created_date && (
            <p className="text-xs text-slate-400">
              Created {format(new Date(task.created_date), "MMM d, yyyy")}
            </p>
          )} */}

          {/* Subtasks */}
          <div className="py-4 space-y-4 border-t border-slate-200/60">
            {todo.subtasks && todo.subtasks.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Subtasks:</p>

                {todo.subtasks.map((subtask) => (
                  <TodoCard
                    key={subtask.$id}
                    todo={subtask}
                    nestingLevel={0}
                    variant="list"
                  />
                ))}
              </div>
            )}

            {isFormOpened ? (
              <div className="bg-white py-3.5 px-4 border border-slate-200/60 rounded-xl transition-all duration-200">
                <TodoForm
                  onClose={onFormClose}
                  parentTodoId={todo.$id}
                  todo={null}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => setIsFormOpened(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subtask
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
