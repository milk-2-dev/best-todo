import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isFuture, isPast, parseISO } from "date-fns";
import type { Status, Priority, Todo } from "~/types/todo";

export function determineStatus(dueDate?: string): Status {
  if (!dueDate) return "backlog";

  const date = parseISO(dueDate);

  if (isToday(date)) return "today";
  if (isFuture(date)) return "upcoming";
  if (isPast(date)) return "backlog";

  return "backlog";
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "MMM dd, yyyy");
}

export function getPriorityColor(priority: Priority): string {
  const colors = {
    low: "text-green-600 bg-green-50",
    medium: "text-amber-600 bg-amber-50",
    high: "text-red-600 bg-red-50",
  };
  return colors[priority];
}

export function getPriorityLabel(priority: Priority): string {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return labels[priority];
}

export function calculateProgress(todo: Todo): number {
  if (!todo.subtasks || todo.subtasks.length === 0) {
    return todo.status === "completed" ? 100 : 0;
  }

  const totalSubtasks = todo.subtasks.length;
  const completedSubtasks = todo.subtasks.filter(
    (subtask) => subtask.status === "completed"
  ).length;

  return Math.round((completedSubtasks / totalSubtasks) * 100);
}

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  const date = parseISO(dueDate);
  return isPast(date) && !isToday(date);
}

export function sortTodosByOrder(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => a.order - b.order);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
