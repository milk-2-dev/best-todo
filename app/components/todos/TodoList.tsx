import { Plus } from "lucide-react";

import TodoCard from "./TodoCard";
import EmptyState from "./EmptyState";

import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";

export default function TodoList({
  tasks,
  isLoading,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateTask,
  activeView,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200/60"
          >
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState view={activeView} onCreateTask={onCreateTask} />;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TodoCard
          key={task.$id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          variant="list"
        />
      ))}

      <div className="py-4 border-t border-slate-200/60">
        <Button
          variant="ghost"
          onClick={onCreateTask}
          className=" hover:bg-slate-800 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
