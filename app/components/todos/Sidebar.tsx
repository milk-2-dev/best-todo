import { Link } from "react-router";
import { useNavItems } from "~/hooks/useNavItems";
import { Plus, Sparkles } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";


export default function Sidebar({ onCreateTask }) {
  const { navItems, activeNavItem } = useNavItems();

  return (
    <aside className="w-64 h-screen bg-slate-50/80 border-r border-slate-200/60 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">
            Taskflow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === activeNavItem.href;
            const count = 5; //taskCounts?.[item.id] || 0;

            return (
              <Link
                key={item.id}
                to={item.href}
                prefetch="intent"
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white shadow-sm text-slate-900 border border-slate-200/60"
                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-[18px] h-[18px]",
                    isActive ? item.color : "text-slate-400"
                  )}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-slate-100 text-slate-600"
                        : "bg-slate-200/60 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Create Button */}
      <div className="p-4 border-t border-slate-200/60">
        <Button
          onClick={onCreateTask}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
    </aside>
  );
}
