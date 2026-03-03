import { useState } from "react";
import { Outlet, redirect } from "react-router";

import type { Route } from "./+types/_protected";

import { requireUser } from "~/utils/session.server";

import { useViewMode } from "~/contexts/ViewModeContext";

import { useNavItems } from "~/hooks/useNavItems";

import Sidebar from "~/components/todos/Sidebar";
import ViewToggle from "~/components/todos/ViewToggle";

export async function loader({ request }: Route.LoaderArgs) {
  console.log("\n📍 ===== PROTECTED LAYOUT LOADER =====");
  console.log("🌐 URL:", request.url);

  const user = await requireUser(request);

  console.log("👤 User ID:", user ? user.$id : "NONE");
  console.log("👤 User Name:", user ? user.name : "NONE");
  console.log("=============================\n");

  return { user };
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  const { activeNavItem } = useNavItems();
  const { viewMode, setViewMode } = useViewMode();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ViewIcon = activeNavItem?.icon;

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
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
            </div>
          </div>
        </header>

        {/* Content */}
        <Outlet />
      </main>

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
