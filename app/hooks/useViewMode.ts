import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import type { ViewMode } from "~/types/todo";

export function useViewMode(defaultMode: ViewMode = "list"): [ViewMode, (mode: ViewMode) => void] {
  const location = useLocation();
  const storageKey = `todo-view-mode-${location.pathname}`;

  const [viewMode, setViewModeState] = useState<ViewMode>(defaultMode);

  // Load from localStorage on mount or route change
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "list" || stored === "board") {
      setViewModeState(stored);
    } else {
      // Defaults per page
      const defaults: Record<string, ViewMode> = {
        "/backlog": "list",
        "/today": "list", 
        "/upcoming": "board",
        "/completed": "list",
      };
      setViewModeState(defaults[location.pathname] || "list");
    }
  }, [location.pathname, storageKey]);

  const setViewMode = (mode: ViewMode) => {
    console.log(`Setting view mode to ${mode} for ${location.pathname}`);
    setViewModeState(mode);
    localStorage.setItem(storageKey, mode);
  };

  return [viewMode, setViewMode];
}