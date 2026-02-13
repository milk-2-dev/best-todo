import TodoList from "~/components/todos/TodoList";
import KanbanBoard from "~/components/todos/KanbanBoard";
import { useViewMode } from "~/hooks/useViewMode";

export function BacklogTodos({ todos, user }) {
  const [viewMode] = useViewMode();

  console.log("Loaded todos in Component:", todos);

  const isLoading = false;
  const handleToggleComplete = () => {
    console.log("Toggle Complete Action");
  };
  const handleEditTask = () => {
    console.log("Edit Task Action");
  };
  const handleDeleteTask = () => {
    console.log("Delete Task Action");
  
  };
  const handleStatusChange = () => {
    console.log("Status Change Action");
  };
  const handleCreateTask = () => {
    console.log("Create Task Action");
  };

  return (
    <div className="flex-1 overflow-auto p-4 lg:p-8">
      {viewMode === "list" ? (
        <TodoList
          tasks={todos.rows}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onCreateTask={handleCreateTask}
          activeView={viewMode}
        />
      ) : (
        <KanbanBoard
          tasks={todos.rows}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
