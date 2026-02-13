import { List, LayoutGrid } from "lucide-react";
import { cn } from "~/lib/utils";

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => {
          console.log("Switching to list view");
          onViewChange("list")
        }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
          view === "list"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <button
        onClick={() => onViewChange("board")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
          view === "board"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        Board
      </button>
    </div>
  );
}
