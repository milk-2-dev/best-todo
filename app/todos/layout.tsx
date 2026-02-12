import { useState } from "react";
import { Outlet } from "react-router";
import { Plus } from "lucide-react";

import { useNavItems } from "~/hooks/useNavItems";
import { useViewMode } from "~/hooks/useViewMode";

import Sidebar from "~/components/todos/Sidebar";
import ViewToggle from "~/components/todos/ViewToggle";
import { Button } from "~/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { activeNavItem } = useNavItems();
  const [viewMode, setViewMode] = useViewMode();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCreateTask = () => {
  
    console.log("Create Task Action");
  };

  const ViewIcon = activeNavItem?.icon;

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onCreateTask={handleCreateTask} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              {/* <MobileSidebar
                activeView={activeView}
                // onViewChange={setActiveView}
                // taskCounts={taskCounts}
                onCreateTask={handleCreateTask}
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
              /> */}

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <ViewIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    {activeNavItem?.label}
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    {activeNavItem?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ViewToggle view={viewMode} onViewChange={setViewMode} />
              <Button
                onClick={handleCreateTask}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 hidden sm:flex"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Task
              </Button>
              <Button
                onClick={handleCreateTask}
                size="icon"
                className="bg-slate-900 hover:bg-slate-800 sm:hidden"
              >
                <Plus className="w-4 h-4" />
              </Button>

              {/* Logout */}
              {/* <Form method="post" action="/logout">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </Form> */}
            </div>
          </div>
        </header>

        <Outlet />

        {/* Content */}
        {/* <div className="flex-1 overflow-auto p-4 lg:p-8">
          {displayMode === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onCreateTask={handleCreateTask}
              activeView={activeView}
            />
          ) : (
            <KanbanBoard
              tasks={tasks}
              isLoading={isLoading}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          )}
        </div> */}
      </main>

      {/* Task Modal */}
      {/* <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        isSaving={createMutation.isPending || updateMutation.isPending}
      /> */}

      {/* Mobile Overlay */}
      {/* {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}
    </div>
  );
}
