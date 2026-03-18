import { useState } from "react";
import { useFetcher } from "react-router";

import type { Todos } from "~/types/appwrite";
import type { TodoFormPayload, TodoNode } from "~/types/todo";

import { useViewMode } from "~/contexts/ViewModeContext";

import { useTodoStore } from "~/store/todoStore";

import TodoList from "./TodoList";
import KanbanBoard from "./KanbanBoard";
import TodoDetailsModal from "./TodoDetailsModal";

interface Props {
  todos: { total: number; rows: Todos[] };
}

export default function TodoPage() {
  const { todos, selectedTodo, isOpenTodoDetails, setTodoDetailsOpen } =
    useTodoStore();
  const isLoading = useTodoStore((s) => s.isLoading);

  const { viewMode } = useViewMode();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todos | null>(null);
  const [todoDetails, setTodoDetails] = useState<Todos | null>(null);

  const fetcher = useFetcher();
  const deleteTodoFetcher = useFetcher({ key: "deleteTodo" });

  const handleCreate = () => {
    setEditingTodo(null);
    setFormOpen(true);
  };

  const handleEdit = (todo: TodoNode) => {
    setEditingTodo(todo);
    setFormOpen(true);
  };

  const handleToggleComplete = async (todo: TodoNode) => {
    if (!todo.$id) return;

    const submitData: TodoFormPayload = {
      intent: "toggleComplete",
      todoId: todo.$id,
      completed: !todo.completed,
    };

    await fetcher.submit(submitData, {
      method: "post",
      encType: "application/json",
    });
  };

  const handleDelete = async (todoId: string) => {
    if (!todoId) return;

    const submitData: TodoFormPayload = {
      intent: "delete",
      todoId,
    };

    await deleteTodoFetcher.submit(submitData, {
      method: "post",
      encType: "application/json",
    });
  };

  return (
    <div className="p-8">
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {viewMode === "list" ? (
          <TodoList
            tasks={todos}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            isFormOpen={formOpen}
            editedId={editingTodo ? editingTodo.$id : null}
            onFormClose={() => setFormOpen(false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateTask={handleCreate}
            activeView={viewMode}
          />
        ) : (
          <KanbanBoard
            tasks={todos}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <TodoDetailsModal
        isOpen={isOpenTodoDetails}
        todo={selectedTodo}
        onClose={() => setTodoDetailsOpen(false)}
      />
    </div>
  );
}
