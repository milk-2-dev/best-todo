import { useMemo, useState } from "react";
import { useNavigation, useFetcher } from "react-router";

import type { Todos, TodosStatus } from "~/types/appwrite";
import type { TodoFormPayload } from "~/types/todo";

import { useViewMode } from "~/contexts/ViewModeContext";

import { buildTodoTree } from "~/lib/todoTreeUtils";

import TodoList from "./TodoList";
import KanbanBoard from "./KanbanBoard";
import TodoModal from "./TodoModal";

interface Props {
  todos: { total: number; rows: Todos[] };
}

export default function TodoPage({ todos }: Props) {
  const { viewMode } = useViewMode();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todos | null>(null);

  const todoTree = useMemo(() => buildTodoTree(todos.rows), [todos.rows]);

  const fetcher = useFetcher();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  const handleToggleComplete = async (todo) => {
    if (!todo.$id) return;

    const submitData: TodoFormPayload = {
      intent: "toggleComplete",
      todoId: todo.$id,
      status: "completed" as TodosStatus, //!todo.completed
    };

    await fetcher.submit(submitData, {
      method: "post",
      encType: "application/json",
    });
  };

  const handleEdit = (todo: Todos) => {
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
    setEditingTodo(null);
    setModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {viewMode === "list" ? (
          <TodoList
            tasks={todoTree}
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
            tasks={todoTree}
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
