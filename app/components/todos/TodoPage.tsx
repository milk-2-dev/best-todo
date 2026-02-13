import { useState } from "react";

import type { Todo } from "~/types/todo";

import { useViewMode } from "~/contexts/ViewModeContext";

import TodoList from "./TodoList";
import KanbanBoard from "./KanbanBoard";
import TodoModal from "./TodoModal";

interface Props {
  todos: { total: number; rows: Todo[] };
}

export default function TodoPage({ todos }: Props) {
  const {viewMode} = useViewMode();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const isLoading = false;

  const handleToggleComplete = () => {
    console.log("Toggle Complete Action");
  };

  const handleEdit = (todo: Todo) => {
    console.log("Edit Task Action");
    setEditingTodo(todo);
    setModalOpen(true);
  };

  const handleDelete = () => {
    console.log("Delete Task Action");
  };

  const handleStatusChange = () => {
    console.log("Status Change Action");
  };

  const handleCreate = () => {
    console.log("Create Task Action");
    console.log(modalOpen);
    console.log(editingTodo);
    setEditingTodo(null);
    setModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {viewMode === "list" ? (
          <TodoList
            tasks={todos.rows}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onCreateTask={handleCreate}
            activeView={viewMode}
          />
        ) : (
          <KanbanBoard
            tasks={todos.rows}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <TodoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        todo={editingTodo}
      />
    </div>
  );
}
