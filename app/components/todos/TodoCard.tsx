import { useMemo, useState } from "react";
import { useFetcher } from "react-router";
import {
  Calendar,
  Flag,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  ListChecks,
  Pencil,
} from "lucide-react";
import { format, set } from "date-fns";
import { ChevronRightIcon, ChevronDownIcon, Trash2 } from "lucide-react";

import { cn } from "~/lib/utils";

import type { TodoNode, ViewMode } from "~/types/todo";

import { useTodoStore } from "~/store/todoStore";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import TodoForm from "./TodoForm";

const priorityConfig = {
  low: { color: "text-slate-400", bg: "bg-slate-100", label: "Low" },
  medium: { color: "text-amber-500", bg: "bg-amber-50", label: "Medium" },
  high: { color: "text-red-500", bg: "bg-red-50", label: "High" },
};

type TodoCardProps = {
  todo: TodoNode;
  nestingLevel: number;
  variant?: ViewMode;
};

const DEFAULT_NESTING_LEVEL = 0;

export default function TodoCard({
  todo,
  nestingLevel = DEFAULT_NESTING_LEVEL,
  variant = "list",
}: TodoCardProps) {
  const isOpenTodoDetails = useTodoStore((s) => s.isOpenTodoDetails);
  const formData = useTodoStore((s) => s.formData);
  const setTodoDetailsOpen = useTodoStore((s) => s.setTodoDetailsOpen);
  const setSelectedTodo = useTodoStore((s) => s.setSelectedTodo);
  const setFormData = useTodoStore((s) => s.setFormData);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);

  const isCompleted = useMemo(() => todo.completed, [todo.completed]);
  const completedCount = useMemo(() => {
    if (!todo.subtasks) return 0;

    return todo.subtasks.filter((s) => {
      return s.completed;
    }).length;
  }, [todo]);

  const priority = priorityConfig[todo.priority] || priorityConfig.medium;
  const nestingClass = `ml-${nestingLevel * 2 + 4}`;
  const [isOpened, setIsOpened] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const fetcher = useFetcher();

  const deleteTodoFetcher = useFetcher({ key: "deleteTodo" });

  const handleToggle = async (todo: TodoNode) => {
    if (!todo.$id) return;

    toggleTodo(todo.$id);

    const submitData = {
      intent: "toggleComplete",
      todoId: todo.$id,
      completed: !todo.completed,
    };

    await fetcher.submit(submitData, {
      method: "post",
      encType: "application/json",
      action: "/backlog",
    });
  };

  const handleShowDetails = (todo: TodoNode) => {
    setSelectedTodo(todo);
    if (!isOpenTodoDetails) setTodoDetailsOpen(true);
  };

  const handleCollapsibleChanged = (isOpen: boolean) => {
    setIsOpened(isOpen);
  };

  const handleEditTodo = (todo: TodoNode) => {
    setFormData(todo);
    setIsEditFormOpen(true);
  };

  const handleEditFormClose = () => {
    setFormData(null);
    setIsEditFormOpen(false);
  };

  const handleDelete = async (todoId: string) => {
    if (!todoId) return;

    setIsDeleting(true);
    removeTodo(todoId);

    const submitData = {
      intent: "delete",
      todoId,
    };

    await deleteTodoFetcher.submit(submitData, {
      method: "post",
      encType: "application/json",
    });
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
              onClick={(todo) => handleShowDetails(todo)}
              className={cn(
                "text-sm font-medium text-slate-900 leading-snug hover:under",
                isCompleted && "line-through text-slate-400"
              )}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {todo.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              {todo.subtasks?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <ListChecks className="w-3 h-3" />
                  {completedCount}/{todo.subtasks.length}
                </span>
              )}
              {todo.dueDate && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(todo.dueDate), "MMM d")}
                </span>
              )}
              {todo.priority && todo.priority !== "medium" && (
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

  return (
    <Collapsible key={todo.$id} onOpenChange={handleCollapsibleChanged}>
      <div
        className={cn(
          "group  bg-white transition-all duration-200",
          nestingLevel === DEFAULT_NESTING_LEVEL &&
            "py-3.5 px-4 border border-slate-200/60 rounded-xl hover:shadow-md hover:border-slate-300/60",
          isDeleting && "opacity-50 scale-95 pointer-events-none"
        )}
      >
        {isEditFormOpen && formData?.$id === todo.$id ? (
          <TodoForm onClose={handleEditFormClose} todo={formData} />
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center relative pl-8">
              {todo.subtasks?.length > 0 && (
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

              <button
                onClick={() => handleToggle(todo)}
                className="shrink-0 cursor-pointer"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 transition-colors" />
                )}
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p
                onClick={() => handleShowDetails(todo)}
                className={cn(
                  "text-sm font-medium text-slate-900 hover:underline cursor-pointer",
                  isCompleted && "line-through text-slate-400"
                )}
              >
                {todo.title}
              </p>

              {todo.description && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {todo.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {todo.subtasks?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <ListChecks className="w-3 h-3" />
                  {completedCount}/{todo.subtasks.length}
                </span>
              )}

              {todo.dueDate && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(todo.dueDate), "MMM d")}
                </span>
              )}

              {todo.priority && (
                <Flag className={cn("w-4 h-4", priority.color)} />
              )}

              <Button
                className="cursor-pointer text-slate-500 hover:bg-white"
                variant="ghost"
                size="icon-xs"
                onClick={() => handleEditTodo(todo)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="cursor-pointer text-slate-500 hover:text-red-600 hover:bg-white"
                    variant="ghost"
                    size="icon-xs"
                  >
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(todo.$id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
                    onStatusChange(todo, "backlog");
                  }}
                >
                  Move to Backlog
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(todo, "today");
                  }}
                >
                  Move to Today
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(todo, "upcoming");
                  }}
                >
                  Move to Upcoming
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(todo);
                  }}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            </div>
          </div>
        )}

        {todo.subtasks?.length > 0 && (
          <CollapsibleContent
            className={`${nestingClass} border-t border-slate-200/60 mt-3 space-y-3 pt-3`}
          >
            {todo.subtasks.map((subtask) => (
              <TodoCard
                key={subtask.$id}
                todo={subtask}
                nestingLevel={nestingLevel + 1}
                variant={variant}
              />
            ))}
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}
