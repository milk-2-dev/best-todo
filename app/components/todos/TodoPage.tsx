import { useEffect } from "react";
import { useFetcher } from "react-router";

import { useViewMode } from "~/contexts/ViewModeContext";

import { useTodoStore } from "~/store/todoStore";

import TodoList from "./TodoList";
import KanbanBoard from "./KanbanBoard";
import TodoDetailsModal from "./TodoDetailsModal";

export default function TodoPage() {
  const todos = useTodoStore((s) => s.todos);
  const selectedTodo = useTodoStore((s) => s.selectedTodo);
  const setSelectedTodo = useTodoStore((s) => s.setSelectedTodo);
  const isOpenTodoDetails = useTodoStore((s) => s.isOpenTodoDetails);
  const setTodoDetailsOpen = useTodoStore((s) => s.setTodoDetailsOpen);
  const isLoading = useTodoStore((s) => s.isLoading);

  const fetcher = useFetcher({ key: "todo-form" });

  const { viewMode } = useViewMode();

  useEffect(() => {
    if (fetcher.data?.success && selectedTodo) {
      setSelectedTodo(fetcher.data.todo);
    }
  }, [fetcher.data]);

  return (
    <div className="p-8 h-full">
      <div className="flex-1 h-full overflow-auto p-4 lg:p-8">
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
