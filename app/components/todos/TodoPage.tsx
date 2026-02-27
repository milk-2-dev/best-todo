import { useMemo, useState } from "react";
import { useNavigation } from "react-router";

import type { Todos } from "~/types/appwrite";

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

  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";


  const handleToggleComplete = () => {
    console.log("Toggle Complete Action");
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
