import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import type { ViewMode } from "~/types/todo";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const storageKey = `todo-view-mode-${location.pathname}`;

  const getInitialViewMode = (): ViewMode => {
    if (typeof window === "undefined") {
      return "list"; // SSR fallback
    }

    const stored = localStorage.getItem(storageKey);
    if (stored === "list" || stored === "board") {
      return stored;
    }

    // Defaults per page
    const defaults: Record<string, ViewMode> = {
      "/backlog": "list",
      "/today": "list", 
      "/upcoming": "board",
      "/completed": "list",
    };
    return defaults[location.pathname] || "list";
  };

  const [viewMode, setViewModeState] = useState<ViewMode>(getInitialViewMode);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const stored = localStorage.getItem(storageKey);
    if (stored === "list" || stored === "board") {
      setViewModeState(stored);
    } else {
      const defaults: Record<string, ViewMode> = {
        "/backlog": "list",
        "/today": "list", 
        "/upcoming": "board",
        "/completed": "list",
      };
      setViewModeState(defaults[location.pathname] || "list");
    }
  }, [location.pathname, storageKey, isHydrated]);

  const setViewMode = (mode: ViewMode) => {
    console.log(`Setting view mode to ${mode} for ${location.pathname}`);
    setViewModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, mode);
    }
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within ViewModeProvider');
  }
  return context;
}