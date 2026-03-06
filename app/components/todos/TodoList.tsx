import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import TodoCard from "./TodoCard";
import EmptyState from "./EmptyState";

import type { ViewMode, TodoNode } from "~/types/todo";

import TodoForm from "./TodoForm";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";

type Props = {
  tasks: TodoNode[];
  isLoading: boolean;
  onToggleComplete: (id: string) => void;
  isFormOpen: boolean;
  onFormClose: () => void;
  editedId: string | null;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onCreateTask: () => void;
  activeView: ViewMode;
};

export default function TodoList({
  tasks,
  isLoading,
  onToggleComplete,
  isFormOpen,
  onFormClose,
  onEdit,
  editedId,
  onDelete,
  onCreateTask,
  activeView,
}: Props) {
  const isCreatingNewTodo = useMemo(
    () => isFormOpen && !editedId,
    [isFormOpen, editedId]
  );

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
          todo={task}
          nestingLevel={0}
          onToggleComplete={onToggleComplete}
          isFormOpen={isFormOpen}
          onFormClose={onFormClose}
          editedId={editedId}
          onEdit={onEdit}
          onDelete={onDelete}
          variant="list"
        />
      ))}

      <div className="py-4 border-t border-slate-200/60">
        {isCreatingNewTodo ? (
          <div className="bg-white py-3.5 px-4 border border-slate-200/60 rounded-xl transition-all duration-200">
            <TodoForm onClose={onFormClose} todo={null} />
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={onCreateTask}
            className=" hover:bg-slate-800 hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>
    </div>
  );
}
