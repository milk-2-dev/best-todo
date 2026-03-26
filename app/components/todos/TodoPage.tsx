import { useEffect } from "react";

import { useViewMode } from "~/contexts/ViewModeContext";

import { useTodoStore } from "~/store/todoStore";

import TodoList from "./TodoList";
import KanbanBoard from "./KanbanBoard";
import TodoDetailsModal from "./TodoDetailsModal";


export default function TodoPage() {
  const {
    todos,
    selectedTodo,
    isOpenTodoDetails,
    setTodoDetailsOpen,
    setSelectedTodo,
  } = useTodoStore();
  const isLoading = useTodoStore((s) => s.isLoading);

  const { viewMode } = useViewMode();

  // Sync selectedTodo with the latest todos data, for example after an update or toggle action
  useEffect(() => {
    if (selectedTodo) {
      setSelectedTodo(todos.find((t) => t.$id === selectedTodo.$id) || null);
    }
  }, [todos]);

  return (
    <div className="p-8">
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {viewMode === "list" ? (
          <TodoList tasks={todos} isLoading={isLoading} activeView={viewMode} />
        ) : (
          <KanbanBoard tasks={todos} isLoading={isLoading} />
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
