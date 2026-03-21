import type { Todos } from "~/types/appwrite";

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
