import { useMemo } from "react";
import { useLocation } from "react-router";

import { Inbox, Sun, Calendar, CheckCircle2 } from "lucide-react";

const navItems = [
  {
    id: "backlog",
    label: "Backlog",
    description: "Tasks waiting to be scheduled",
    href: "/backlog",
    icon: Inbox,
    color: "text-slate-500",
  },
  {
    id: "today",
    label: "Today",
    description: "Focus on what matters today",
    href: "/today",
    icon: Sun,
    color: "text-amber-500",
  },
  {
    id: "upcoming",
    label: "Upcoming",
    description: "Planned for the future",
    href: "/upcoming",
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    id: "completed",
    label: "Completed",
    description: "Tasks you've finished",
    href: "/completed",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
];

export function useNavItems() {
  const location = useLocation();

  const activeNavItem = useMemo(() => {
    return (
      navItems.find((item) => item.href === location.pathname)
    );
  }, [location.pathname]);

  return { navItems, activeNavItem };
}
